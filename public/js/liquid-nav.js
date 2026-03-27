/**
 * Liquid Navigation
 * Handles the sliding indicator effect with animated transitions between pages
 */

(function () {
  const nav = document.querySelector(".nav-pills");
  if (!nav) return;

  const indicator = nav.querySelector(".indicator");
  const links = nav.querySelectorAll("a");
  if (!indicator || links.length === 0) return;
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TRANSITION_DURATION_MS = prefersReducedMotion ? 0 : 380;
  let pendingHref = null;
  let navigationTimer = null;
  let isNavigating = false;

  function routeKeyFromPathname(pathname) {
    const lower = String(pathname || "").toLowerCase();
    const trimmed = lower.replace(/\/+$/, "");
    const parts = trimmed.split("/").filter(Boolean);
    let last = parts.length ? parts[parts.length - 1] : "index";

    if (last.endsWith(".html")) {
      last = last.slice(0, -".html".length);
    }

    return last || "index";
  }

  function routeKeyFromHref(href) {
    try {
      const url = new URL(href, window.location.href);
      return routeKeyFromPathname(url.pathname);
    } catch {
      const raw = String(href || "").split("#")[0].split("?")[0];
      return routeKeyFromPathname(raw);
    }
  }

  // Find active link based on current URL
  function getActiveLink() {
    const currentKey = routeKeyFromPathname(window.location.pathname);

    for (const link of links) {
      const href = link.getAttribute("href") || "";
      const linkKey = routeKeyFromHref(href);

      if (
        currentKey === linkKey ||
        (currentKey === "index" && linkKey === "index")
      ) {
        return link;
      }
    }
    return links[0];
  }

  // Move indicator to target link
  function moveIndicator(target, animate = true) {
    if (!target) return;

    const left = target.offsetLeft;
    const width = target.offsetWidth;

    if (!animate || prefersReducedMotion) {
      indicator.style.transition = "none";
      indicator.offsetHeight; // Force reflow
    } else {
      indicator.style.transition =
        "left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)";
    }

    indicator.style.left = left + "px";
    indicator.style.width = width + "px";

    if (!animate) {
      indicator.offsetHeight; // Force reflow
      indicator.style.transition = "";
    }
  }

  // Set active class
  function setActive(target) {
    links.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
      link.style.color = "";
    });
    if (target) {
      target.classList.add("active");
      target.setAttribute("aria-current", "page");
    }
  }

  function clearPendingNavigation() {
    pendingHref = null;
    isNavigating = false;
    nav.classList.remove("is-transitioning");
    if (navigationTimer) {
      window.clearTimeout(navigationTimer);
      navigationTimer = null;
    }
  }

  function completeNavigation() {
    if (!pendingHref) {
      clearPendingNavigation();
      return;
    }

    const href = pendingHref;
    clearPendingNavigation();
    window.location.href = href;
  }

  function shouldHandleAnimatedNavigation(event) {
    if (event.defaultPrevented) return false;
    if (event.button && event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }

    const target = event.currentTarget;
    if (!target) return false;

    if (target.target && target.target.toLowerCase() !== "_self") {
      return false;
    }

    return true;
  }

  // Initialize
  function init() {
    const activeLink = getActiveLink();
    setActive(activeLink);
    moveIndicator(activeLink, false);
    clearPendingNavigation();
  }

  // Handle click - animate first, then navigate
  function handleClick(e) {
    if (!shouldHandleAnimatedNavigation(e)) {
      return;
    }

    const clickedLink = e.currentTarget;
    const href = clickedLink.getAttribute("href");

    if (!href) {
      e.preventDefault();
      return;
    }

    const currentKey = routeKeyFromPathname(window.location.pathname);
    const targetKey = routeKeyFromHref(href);
    const isCurrentPage = currentKey === targetKey;

    if (isCurrentPage) {
      e.preventDefault();
      return;
    }

    if (isNavigating) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    pendingHref = href;
    isNavigating = true;
    nav.classList.add("is-transitioning");

    setActive(clickedLink);
    requestAnimationFrame(function () {
      moveIndicator(clickedLink, !prefersReducedMotion);
    });

    if (prefersReducedMotion) {
      completeNavigation();
      return;
    }

    navigationTimer = window.setTimeout(completeNavigation, TRANSITION_DURATION_MS + 140);
  }

  links.forEach(function (link) {
    // Attach click handler
    link.addEventListener("click", handleClick);
  });

  indicator.addEventListener("transitionend", function (event) {
    if (event.propertyName !== "left" || !isNavigating) {
      return;
    }

    completeNavigation();
  });

  // Wait for fonts and layout before initial positioning
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      requestAnimationFrame(init);
    });
  } else {
    requestAnimationFrame(init);
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const activeLink = nav.querySelector("a.active");
      moveIndicator(activeLink, false);
    }, 100);
  });
})();
