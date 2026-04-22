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
  disabled = false,
  hasHashTarget = false,
  threshold = STICKY_BOTTOM_THRESHOLD_PX,
}: UseStickyBottomScrollOptions): UseStickyBottomScrollResult {
  const pinnedRef = useRef(true);
  const [isPinned, setIsPinned] = useState(true);
  const initializedRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const programmaticTimeoutRef = useRef<number | null>(null);
  const lastMessagesLengthRef = useRef(0);

  const setPinned = useCallback((next: boolean) => {
    if (pinnedRef.current === next) return;
    pinnedRef.current = next;
    setIsPinned(next);
  }, []);

  const clearProgrammaticTimeout = useCallback(() => {
    if (programmaticTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(programmaticTimeoutRef.current);
      programmaticTimeoutRef.current = null;
    }
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (typeof window === "undefined") return;
      const target = resolveIssueChatScrollTarget();
      programmaticScrollRef.current = true;
      scrollTargetToBottom(target, behavior);
      pinnedRef.current = true;
      setIsPinned(true);

      if (behavior === "smooth") {
        // Smooth scrolls fire intermediate scroll events for ~200-500ms. The
        // scroll handler clears the suppression only when it sees the position
        // actually reach the bottom — otherwise mid-animation events would
        // compute "not at bottom" and flicker the unpinned state. Safety
        // timeout: release after 1s in case content grows during the animation
        // and we never settle at the bottom.
        clearProgrammaticTimeout();
        programmaticTimeoutRef.current = window.setTimeout(() => {
          programmaticScrollRef.current = false;
          programmaticTimeoutRef.current = null;
        }, 1000);
      } else {
        // Auto/instant scrolls complete in one frame; clear after rAF so the
        // next user-initiated scroll is processed normally.
        window.requestAnimationFrame(() => {
          programmaticScrollRef.current = false;
        });
      }
    },
    [clearProgrammaticTimeout],
  );

  // Attach a scroll listener that updates pinned state from user scrolls.
  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    const target = resolveIssueChatScrollTarget();

    const handle = () => {
      const nearBottom = isScrollTargetNearBottom(target, threshold);
      if (programmaticScrollRef.current) {
        if (nearBottom) {
          programmaticScrollRef.current = false;
          clearProgrammaticTimeout();
        }
        return;
      }
      setPinned(nearBottom);
    };

    const detach = attachScrollListener(target, handle);
    return () => {
      detach();
      clearProgrammaticTimeout();
    };
  }, [disabled, threshold, setPinned, clearProgrammaticTimeout]);

  // First-mount: scroll to bottom once the thread has at least one message.
  // Defer to hash-link navigation when one is in play.
  useLayoutEffect(() => {
    if (disabled || initializedRef.current) return;
    if (hasHashTarget) {
      // Hash navigation owns the initial scroll position.
      initializedRef.current = true;
      pinnedRef.current = false;
      setIsPinned(false);
      lastMessagesLengthRef.current = messages.length;
      return;
    }
    if (messages.length === 0) return;
    initializedRef.current = true;
    lastMessagesLengthRef.current = messages.length;
    scrollToBottom("auto");
  }, [disabled, hasHashTarget, messages, scrollToBottom]);

  // On message growth while pinned, follow the tail. We use the snap behavior
  // ("auto") even between full messages — chats feel better when new content
  // appears instantly rather than animating in. The smooth animation is
  // reserved for the explicit Jump-to-latest button click.
  useLayoutEffect(() => {
    if (disabled || !initializedRef.current) return;
    const previousLength = lastMessagesLengthRef.current;
    lastMessagesLengthRef.current = messages.length;
    if (!pinnedRef.current) return;
    if (messages.length === 0) return;
    if (messages.length <= previousLength) return;
    scrollToBottom("auto");
  }, [disabled, messages, scrollToBottom]);

  return { isPinned, pinnedRef, scrollToBottom };
}
