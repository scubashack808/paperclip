import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  STICKY_BOTTOM_THRESHOLD_PX,
  isScrollTargetNearBottom,
  resolveIssueChatScrollTarget,
  scrollTargetToBottom,
  type IssueChatScrollTarget,
} from "../lib/issue-chat-scroll";

export interface UseStickyBottomScrollOptions {
  messages: ReadonlyArray<unknown>;
  isStreaming: boolean;
  disabled?: boolean;
  hasHashTarget?: boolean;
  threshold?: number;
}

export interface UseStickyBottomScrollResult {
  isPinned: boolean;
  pinnedRef: React.MutableRefObject<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

function attachScrollListener(
  target: IssueChatScrollTarget,
  handler: () => void,
): () => void {
  if (target.type === "element") {
    target.element.addEventListener("scroll", handler, { passive: true });
    return () => target.element.removeEventListener("scroll", handler);
  }
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}

export function useStickyBottomScroll({
  messages,
  isStreaming,
  disabled = false,
  hasHashTarget = false,
  threshold = STICKY_BOTTOM_THRESHOLD_PX,
}: UseStickyBottomScrollOptions): UseStickyBottomScrollResult {
  const pinnedRef = useRef(true);
  const [isPinned, setIsPinned] = useState(true);
  const initializedRef = useRef(false);
  const programmaticScrollRef = useRef(false);

  const setPinned = useCallback((next: boolean) => {
    if (pinnedRef.current === next) return;
    pinnedRef.current = next;
    setIsPinned(next);
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (typeof window === "undefined") return;
      const target = resolveIssueChatScrollTarget();
      programmaticScrollRef.current = true;
      scrollTargetToBottom(target, behavior);
      pinnedRef.current = true;
      setIsPinned(true);
      // Clear the programmatic flag after the scroll settles. A single rAF is
      // enough for "auto" / "instant"; smooth scrolls release on the next
      // user-initiated scroll event.
      window.requestAnimationFrame(() => {
        programmaticScrollRef.current = false;
      });
    },
    [],
  );

  // Attach a scroll listener that updates pinned state from user scrolls.
  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    const target = resolveIssueChatScrollTarget();

    const handle = () => {
      if (programmaticScrollRef.current) return;
      const nearBottom = isScrollTargetNearBottom(target, threshold);
      setPinned(nearBottom);
    };

    const detach = attachScrollListener(target, handle);
    return detach;
  }, [disabled, threshold, setPinned]);

  // First-mount: scroll to bottom once the thread has at least one message.
  // Defer to hash-link navigation when one is in play.
  useLayoutEffect(() => {
    if (disabled || initializedRef.current) return;
    if (hasHashTarget) {
      // Hash navigation owns the initial scroll position.
      initializedRef.current = true;
      pinnedRef.current = false;
      setIsPinned(false);
      return;
    }
    if (messages.length === 0) return;
    initializedRef.current = true;
    scrollToBottom("auto");
  }, [disabled, hasHashTarget, messages, scrollToBottom]);

  // On message growth while pinned, follow the tail.
  useLayoutEffect(() => {
    if (disabled || !initializedRef.current) return;
    if (!pinnedRef.current) return;
    if (messages.length === 0) return;
    scrollToBottom(isStreaming ? "auto" : "smooth");
  }, [disabled, messages, isStreaming, scrollToBottom]);

  return { isPinned, pinnedRef, scrollToBottom };
}
