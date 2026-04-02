import { RefObject, useEffect, useRef } from "react";

interface ScrollNavEntry {
  section: { id: string };
  page: { id: string };
}

interface UsePortfolioScrollNavOptions {
  contentBodyRef: RefObject<HTMLElement | null>;
  nextEntry: ScrollNavEntry | null;
  previousEntry: ScrollNavEntry | null;
  navigateTo: (sectionId: string, pageId: string) => void;
  entranceReady: boolean;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
}

const COOLDOWN_MS = 650;
const MIN_SWIPE_PX = 40;
const SCROLL_BOUNDARY_TOLERANCE_PX = 4;

export function usePortfolioScrollNav({
  contentBodyRef,
  nextEntry,
  previousEntry,
  navigateTo,
  entranceReady,
  openDropdownId,
  setOpenDropdownId,
}: UsePortfolioScrollNavOptions) {
  // Keep latest values in refs so the event listeners never need to be
  // re-registered when these change — avoids the teardown/re-attach gap
  // where a wheel event could fire against a dead listener.
  const stateRef = useRef({
    nextEntry,
    previousEntry,
    navigateTo,
    entranceReady,
    openDropdownId,
    setOpenDropdownId,
  });

  useEffect(() => {
    stateRef.current = {
      nextEntry,
      previousEntry,
      navigateTo,
      entranceReady,
      openDropdownId,
      setOpenDropdownId,
    };
  });

  const navLock = useRef(false);
  const touchStartY = useRef<number | null>(null);

  // Listeners are registered once on mount and read live state via stateRef.
  // This means no teardown/re-attach on every page change.
  useEffect(() => {
    const element = contentBodyRef.current;
    if (!element) return;
    // element is non-null from here — captured once, used in all handlers below
    const safeElement = element;

    function tryNavigate(direction: "next" | "prev") {
      if (navLock.current) return;
      const { nextEntry, previousEntry, navigateTo, entranceReady } = stateRef.current;
      if (!entranceReady) return;
      if (direction === "next" && !nextEntry) return;
      if (direction === "prev" && !previousEntry) return;

      navLock.current = true;
      setTimeout(() => {
        navLock.current = false;
      }, COOLDOWN_MS);

      if (direction === "next" && nextEntry) {
        navigateTo(nextEntry.section.id, nextEntry.page.id);
      } else if (direction === "prev" && previousEntry) {
        navigateTo(previousEntry.section.id, previousEntry.page.id);
      }
    }

    function handleWheel(event: WheelEvent) {
      const { entranceReady, openDropdownId, setOpenDropdownId } = stateRef.current;
      if (!entranceReady) return;

      if (openDropdownId) {
        setOpenDropdownId(null);
        return;
      }

      const body = safeElement;
      const atBottom =
        body.scrollTop + body.clientHeight >= body.scrollHeight - SCROLL_BOUNDARY_TOLERANCE_PX;
      const atTop = body.scrollTop <= SCROLL_BOUNDARY_TOLERANCE_PX;

      if (event.deltaY > 0 && atBottom) {
        event.preventDefault();
        tryNavigate("next");
      } else if (event.deltaY < 0 && atTop) {
        event.preventDefault();
        tryNavigate("prev");
      }
      // Mid-scroll: let the element scroll naturally
    }

    function handleTouchStart(event: TouchEvent) {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    }

    function handleTouchEnd(event: TouchEvent) {
      const { entranceReady, openDropdownId, setOpenDropdownId } = stateRef.current;
      if (!entranceReady) return;
      if (touchStartY.current === null) return;

      const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
      const delta = touchStartY.current - endY;
      touchStartY.current = null;

      if (Math.abs(delta) < MIN_SWIPE_PX) return;

      if (openDropdownId) {
        setOpenDropdownId(null);
        return;
      }

      if (delta > 0) {
        tryNavigate("next");
      } else {
        tryNavigate("prev");
      }
    }

    safeElement.addEventListener("wheel", handleWheel, { passive: false });
    safeElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    safeElement.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      safeElement.removeEventListener("wheel", handleWheel);
      safeElement.removeEventListener("touchstart", handleTouchStart);
      safeElement.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentBodyRef]); // Only re-register if the DOM element itself changes
}
