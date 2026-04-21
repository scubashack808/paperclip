// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  captureComposerViewportSnapshot,
  isScrollTargetNearBottom,
  restoreComposerViewportSnapshot,
  resolveIssueChatScrollTarget,
  scrollTargetToBottom,
  shouldPreserveComposerViewport,
} from "./issue-chat-scroll";

function makeMainContent({
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
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: clientHeight });
  el.scrollTop = scrollTop;
  document.body.appendChild(el);
  return el;
}

function mockTop(element: HTMLElement, top: number) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + 48,
    left: 0,
    right: 0,
    width: 0,
    height: 48,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

describe("issue-chat-scroll", () => {
  it("restores page scroll when the composer shifts in the viewport", () => {
    const composer = document.createElement("div");
    document.body.appendChild(composer);
    const scrollByMock = vi.spyOn(window, "scrollBy").mockImplementation(() => {});

    mockTop(composer, 420);
    const snapshot = captureComposerViewportSnapshot(composer);

    mockTop(composer, 560);
    restoreComposerViewportSnapshot(snapshot, composer);

    expect(scrollByMock).toHaveBeenCalledWith({ top: 140, left: 0, behavior: "auto" });

    scrollByMock.mockRestore();
    composer.remove();
  });

  it("restores main-content scroll when the layout uses an internal scroller", () => {
    const mainContent = document.createElement("main");
    mainContent.id = "main-content";
    mainContent.style.overflowY = "auto";
    Object.defineProperty(mainContent, "scrollHeight", {
      configurable: true,
      value: 1800,
    });
    Object.defineProperty(mainContent, "clientHeight", {
      configurable: true,
      value: 900,
    });
    mainContent.scrollTop = 240;
    document.body.appendChild(mainContent);

    const composer = document.createElement("div");
    document.body.appendChild(composer);
    const scrollByMock = vi.spyOn(window, "scrollBy").mockImplementation(() => {});

    mockTop(composer, 300);
    const snapshot = captureComposerViewportSnapshot(composer);

    mockTop(composer, 380);
    restoreComposerViewportSnapshot(snapshot, composer);

    expect(mainContent.scrollTop).toBe(320);
    expect(scrollByMock).not.toHaveBeenCalled();

    scrollByMock.mockRestore();
    composer.remove();
    mainContent.remove();
  });

  it("does not preserve the composer viewport just because the composer is visible", () => {
    const composer = document.createElement("div");
    document.body.appendChild(composer);
    mockTop(composer, 540);

    expect(shouldPreserveComposerViewport(composer)).toBe(false);

    composer.remove();
  });

  it("preserves the composer viewport when focus stays inside the composer", () => {
    const composer = document.createElement("div");
    const input = document.createElement("textarea");
    composer.appendChild(input);
    document.body.appendChild(composer);
    mockTop(composer, 1200);

    input.focus();

    expect(shouldPreserveComposerViewport(composer)).toBe(true);

    composer.remove();
  });

  describe("isScrollTargetNearBottom", () => {
    it("treats an element pinned to the bottom as near bottom", () => {
      const el = makeMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 900 });
      expect(isScrollTargetNearBottom({ type: "element", element: el })).toBe(true);
      el.remove();
    });

    it("treats an element scrolled within the threshold as near bottom", () => {
      const el = makeMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 820 });
      expect(isScrollTargetNearBottom({ type: "element", element: el })).toBe(true);
      el.remove();
    });

    it("returns false when the user has scrolled clearly above the bottom", () => {
      const el = makeMainContent({ scrollHeight: 1800, clientHeight: 900, scrollTop: 200 });
      expect(isScrollTargetNearBottom({ type: "element", element: el })).toBe(false);
      el.remove();
    });

    it("treats short content (no overflow) as always pinned", () => {
      const el = makeMainContent({ scrollHeight: 600, clientHeight: 900, scrollTop: 0 });
      expect(isScrollTargetNearBottom({ type: "element", element: el })).toBe(true);
      el.remove();
    });
  });

  describe("scrollTargetToBottom", () => {
    it("scrolls the element scroller to its full scroll height", () => {
      const el = makeMainContent({ scrollHeight: 2400, clientHeight: 800, scrollTop: 100 });
      const scrollToMock = vi.fn();
      el.scrollTo = scrollToMock;

      scrollTargetToBottom({ type: "element", element: el }, "smooth");

      expect(scrollToMock).toHaveBeenCalledWith({ top: 2400, behavior: "smooth" });
      el.remove();
    });

    it("falls back to window scroll when no scrollable main-content exists", () => {
      const scrollToMock = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
      Object.defineProperty(document.documentElement, "scrollHeight", {
        configurable: true,
        value: 5000,
      });

      const target = resolveIssueChatScrollTarget();
      expect(target.type).toBe("window");
      scrollTargetToBottom(target, "auto");

      expect(scrollToMock).toHaveBeenCalledWith({ top: 5000, left: 0, behavior: "auto" });
      scrollToMock.mockRestore();
    });
  });
});
