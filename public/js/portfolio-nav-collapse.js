(() => {
  if (!document.body.classList.contains("portfolio-page")) return;

  const NAV_SELECTOR = "nav.nav-pills";
  const INITIAL_COLLAPSE_DELAY_MS = 1500;
  const RECOLLAPSE_DELAY_MS = 1000;

  let initialized = false;
  let initialCollapseTimer = null;
  let recollapseTimer = null;

  function hasEntranceCompleted() {
    return document.body.classList.contains("entrance-complete");
  }

  function setCollapsed(collapsed) {
    document.body.classList.toggle("nav-collapsed", collapsed);
  }

  function clearTimer(timerId) {
    if (timerId) window.clearTimeout(timerId);
    return null;
  }

  function getNav() {
    return document.querySelector(NAV_SELECTOR);
  }

  function navIsActive(nav) {
    if (!nav) return false;
    return nav.matches(":hover") || nav.contains(document.activeElement);
  }

  function expandNow() {
    recollapseTimer = clearTimer(recollapseTimer);
    setCollapsed(false);
  }

  function scheduleRecollapse() {
    recollapseTimer = clearTimer(recollapseTimer);
    if (!hasEntranceCompleted()) return;

    const nav = getNav();
    recollapseTimer = window.setTimeout(() => {
      if (!navIsActive(nav)) setCollapsed(true);
    }, RECOLLAPSE_DELAY_MS);
  }

  function scheduleInitialCollapse() {
    initialCollapseTimer = clearTimer(initialCollapseTimer);
    if (!hasEntranceCompleted()) return;

    const nav = getNav();
    initialCollapseTimer = window.setTimeout(() => {
      if (!navIsActive(nav)) setCollapsed(true);
    }, INITIAL_COLLAPSE_DELAY_MS);
  }

  function ensureNavIsFocusable(nav) {
    if (!nav) return;
    if (!nav.hasAttribute("tabindex")) {
      nav.setAttribute("tabindex", "0");
    }
    if (!nav.hasAttribute("aria-label")) {
      nav.setAttribute("aria-label", "Site navigation");
    }
  }

  function init() {
    if (initialized) return true;
    const nav = getNav();
    if (!nav) return false;

    ensureNavIsFocusable(nav);

    // Start expanded; collapse later once the entrance completes.
    setCollapsed(false);

    nav.addEventListener("mouseenter", expandNow, { passive: true });
    nav.addEventListener("mouseleave", scheduleRecollapse, { passive: true });
    nav.addEventListener("focusin", expandNow);
    nav.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!nav.contains(document.activeElement)) scheduleRecollapse();
      }, 0);
    });

    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!nav.contains(event.target)) scheduleRecollapse();
      },
      { passive: true },
    );

    initialized = true;
    return true;
  }

  function tryStart() {
    init();
    scheduleInitialCollapse();
  }

  // React entrance toggles `entrance-complete` asynchronously.
  const classObserver = new MutationObserver(() => {
    if (!hasEntranceCompleted()) return;
    tryStart();
  });

  classObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryStart, { once: true });
  } else {
    tryStart();
  }
})();

