// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStickyBottomScroll } from "./useStickyBottomScroll";

interface ProbeProps {
  messages: ReadonlyArray<unknown>;
  hasHashTarget?: boolean;
  onState: (state: { isPinned: boolean; scrollToBottom: (behavior?: ScrollBehavior) => void }) => void;
}

function Probe({ messages, hasHashTarget = false, onState }: ProbeProps) {
  const result = useStickyBottomScroll({ messages, hasHashTarget });
  onState({ isPinned: result.isPinned, scrollToBottom: result.scrollToBottom });
  return null;
}

function setupMainContent({
  scrollHeight,
  clientHeight,
  scrollTop,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
}) {
  const el = document.createElement("main");
  el.id = "main-content";
  el.style.overflowY = "auto";
  Object.defineProperty(el, "scrollHeight", { configurable: true, writable: true, value: scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, writable: true, value: clientHeight });
  el.scrollTop = scrollTop;
  document.body.appendChild(el);
  return el;
}

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("useStickyBottomScroll", () => {
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
  });

  afterEach(() => {
    host.remove();
    document.querySelectorAll("#main-content").forEach((el) => el.remove());
    vi.restoreAllMocks();
  });

  it("scrolls the page to the bottom on first mount when messages exist", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 0 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const states: Array<{ isPinned: boolean }> = [];
    const root = createRoot(host);

    act(() => {
      root.render(
        <Probe
          messages={[{ id: "m1" }]}
          onState={(s) => states.push({ isPinned: s.isPinned })}
        />,
      );
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
    expect(states.at(-1)?.isPinned).toBe(true);

    act(() => root.unmount());
  });

  it("does not auto-scroll on first mount when a hash anchor owns navigation", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 0 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    const states: Array<{ isPinned: boolean }> = [];

    act(() => {
      root.render(
        <Probe
          messages={[{ id: "m1" }]}
          hasHashTarget
          onState={(s) => states.push({ isPinned: s.isPinned })}
        />,
      );
    });

    expect(scrollToMock).not.toHaveBeenCalled();
    // Hash navigation owns the scroll, so we are not pinned.
    expect(states.at(-1)?.isPinned).toBe(false);

    act(() => root.unmount());
  });

  it("follows new messages while pinned at the bottom", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 900 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    let states: Array<{ isPinned: boolean }> = [];

    act(() => {
      root.render(<Probe messages={[{ id: "m1" }]} onState={(s) => states.push({ isPinned: s.isPinned })} />);
    });

    states = [];
    Object.defineProperty(main, "scrollHeight", { configurable: true, writable: true, value: 2400 });

    act(() => {
      root.render(
        <Probe
          messages={[{ id: "m1" }, { id: "m2" }]}
          onState={(s) => states.push({ isPinned: s.isPinned })}
        />,
      );
    });

    expect(scrollToMock).toHaveBeenLastCalledWith({ top: 2400, behavior: "auto" });
    expect(states.at(-1)?.isPinned).toBe(true);

    act(() => root.unmount());
  });

  it("releases pinned mode when the user scrolls up, and does not yank them down on new messages", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 900 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    let states: Array<{ isPinned: boolean }> = [];

    act(() => {
      root.render(<Probe messages={[{ id: "m1" }]} onState={(s) => states.push({ isPinned: s.isPinned })} />);
    });

    // User scrolls up well above the threshold.
    act(() => {
      main.scrollTop = 200;
      main.dispatchEvent(new Event("scroll"));
    });

    states = [];
    scrollToMock.mockClear();
    Object.defineProperty(main, "scrollHeight", { configurable: true, writable: true, value: 2400 });

    act(() => {
      root.render(
        <Probe
          messages={[{ id: "m1" }, { id: "m2" }]}
          onState={(s) => states.push({ isPinned: s.isPinned })}
        />,
      );
    });

    expect(scrollToMock).not.toHaveBeenCalled();
    expect(states.at(-1)?.isPinned).toBe(false);

    act(() => root.unmount());
  });

  it("re-pins when the user scrolls back to the bottom", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 200 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    const states: Array<{ isPinned: boolean }> = [];

    act(() => {
      root.render(<Probe messages={[{ id: "m1" }]} onState={(s) => states.push({ isPinned: s.isPinned })} />);
    });

    act(() => {
      main.scrollTop = 200;
      main.dispatchEvent(new Event("scroll"));
    });

    expect(states.at(-1)?.isPinned).toBe(false);

    act(() => {
      main.scrollTop = 900;
      main.dispatchEvent(new Event("scroll"));
    });

    expect(states.at(-1)?.isPinned).toBe(true);

    act(() => root.unmount());
  });

  it("does not flicker the pinned state during a smooth scrollToBottom animation", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 200 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    const states: Array<{ isPinned: boolean }> = [];
    let captured!: { isPinned: boolean; scrollToBottom: (behavior?: ScrollBehavior) => void };

    act(() => {
      root.render(
        <Probe
          messages={[{ id: "m1" }]}
          onState={(s) => {
            captured = s;
            states.push({ isPinned: s.isPinned });
          }}
        />,
      );
    });

    // User has scrolled up.
    act(() => {
      main.scrollTop = 200;
      main.dispatchEvent(new Event("scroll"));
    });
    expect(states.at(-1)?.isPinned).toBe(false);

    // Trigger a smooth scrollToBottom — the state should immediately go pinned.
    states.length = 0;
    act(() => {
      captured.scrollToBottom("smooth");
    });
    expect(states.at(-1)?.isPinned).toBe(true);

    // Simulate intermediate scroll events that the smooth animation fires while
    // it is animating from scrollTop=200 toward scrollTop=900. None of these
    // should flick the user back to unpinned, because we initiated the scroll.
    states.length = 0;
    for (const intermediate of [400, 600, 800]) {
      act(() => {
        main.scrollTop = intermediate;
        main.dispatchEvent(new Event("scroll"));
      });
    }
    expect(states.every((s) => s.isPinned)).toBe(true);

    // Final scroll event lands at the bottom — handler clears the suppression.
    // No setPinned is needed since pinnedRef was already true, so states stays
    // empty (no extra render). The latest captured state is still pinned.
    act(() => {
      main.scrollTop = 900;
      main.dispatchEvent(new Event("scroll"));
    });
    expect(captured.isPinned).toBe(true);

    act(() => root.unmount());
  });

  it("scrollToBottom() jumps and re-pins regardless of current pinned state", () => {
    const main = setupMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 100 });
    const scrollToMock = vi.fn();
    main.scrollTo = scrollToMock;

    const root = createRoot(host);
    let captured!: { isPinned: boolean; scrollToBottom: (behavior?: ScrollBehavior) => void };

    act(() => {
      root.render(<Probe messages={[{ id: "m1" }]} onState={(s) => (captured = s)} />);
    });

    // User has scrolled up.
    act(() => {
      main.scrollTop = 100;
      main.dispatchEvent(new Event("scroll"));
    });

    scrollToMock.mockClear();
    act(() => {
      captured.scrollToBottom("smooth");
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 1800, behavior: "smooth" });

    act(() => root.unmount());
  });
});
