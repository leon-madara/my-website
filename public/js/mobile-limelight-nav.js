// public/js/mobile-limelight-nav.js

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".mobile-bottom-nav");
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll(".mobile-nav-item"));
    const ball = nav.querySelector(".mobile-active-ball");
    const saddle = nav.querySelector(".mobile-nav-saddle");

    if (!ball || !saddle || items.length === 0) return;

    const reduceMotionQuery = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const ICON_OUT_MS = 120;
    const TRAVEL_MS = 380;
    const ICON_IN_MS = 150;
    const NAVIGATION_DELAY_MS = ICON_OUT_MS + TRAVEL_MS + ICON_IN_MS;
    let currentActive = findActiveItem();
    let navigationTimer = null;
    let phaseTimers = [];
    let pendingHref = null;
    let isNavigating = false;

    function prefersReducedMotion() {
        return Boolean(reduceMotionQuery && reduceMotionQuery.matches);
    }

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

    function findActiveItem() {
        const currentKey = routeKeyFromPathname(window.location.pathname);
        return (
            items.find((item) => routeKeyFromHref(item.getAttribute("href")) === currentKey) ||
            items.find((item) => item.classList.contains("active")) ||
            items[0]
        );
    }

    function clearNavigationTimer() {
        if (navigationTimer) {
            window.clearTimeout(navigationTimer);
            navigationTimer = null;
        }

        phaseTimers.forEach((timer) => window.clearTimeout(timer));
        phaseTimers = [];
    }

    function completeNavigation() {
        if (!pendingHref) {
            isNavigating = false;
            nav.classList.remove("is-transitioning");
            return;
        }

        const href = pendingHref;
        pendingHref = null;
        isNavigating = false;
        nav.classList.remove("is-transitioning");
        window.location.assign(href);
    }

    function updateActiveClasses(activeItem) {
        items.forEach((item) => {
            const isActive = item === activeItem;
            item.classList.toggle("active", isActive);

            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }
        });
    }

    function centerOffsetFor(target, elementWidth) {
        return target.offsetLeft + target.offsetWidth / 2 - elementWidth / 2;
    }

    function positionChrome(target, animate = true) {
        if (!target) return;

        if (!animate || prefersReducedMotion()) {
            ball.style.transition = "none";
            saddle.style.transition = "none";
        }

        ball.style.transform = `translateX(${centerOffsetFor(target, ball.offsetWidth)}px)`;
        saddle.style.transform = `translateX(${centerOffsetFor(target, saddle.offsetWidth)}px)`;

        if (!animate || prefersReducedMotion()) {
            ball.offsetHeight;
            saddle.offsetHeight;
            ball.style.transition = "";
            saddle.style.transition = "";
        }
    }

    function renderBallIcon(activeItem, hidden = false) {
        const icon = activeItem && activeItem.querySelector("svg");
        if (!icon) return;

        const clone = icon.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("id");
        clone.removeAttribute("class");
        ball.replaceChildren(clone);
        ball.classList.toggle("is-icon-hidden", hidden);
    }

    function setActiveItem(activeItem, options = {}) {
        currentActive = activeItem;
        updateActiveClasses(activeItem);
        positionChrome(activeItem, options.animate !== false);
    }

    function sameRoute(href) {
        return routeKeyFromHref(href) === routeKeyFromPathname(window.location.pathname);
    }

    function shouldAnimateNavigation(event) {
        if (event.defaultPrevented) return false;
        if (event.button && event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if (event.currentTarget.target && event.currentTarget.target.toLowerCase() !== "_self") {
            return false;
        }
        return true;
    }

    function navigateWithAnimation(target, href) {
        clearNavigationTimer();
        pendingHref = href;
        isNavigating = true;
        nav.classList.add("is-transitioning");
        ball.classList.remove("is-traveling");
        ball.classList.add("is-icon-hidden");

        phaseTimers.push(window.setTimeout(() => {
            ball.classList.add("is-traveling");
            setActiveItem(target, { animate: true });
        }, ICON_OUT_MS));

        phaseTimers.push(window.setTimeout(() => {
            renderBallIcon(target, true);
            ball.classList.remove("is-traveling");
            ball.classList.remove("is-icon-hidden");
        }, ICON_OUT_MS + TRAVEL_MS));

        navigationTimer = window.setTimeout(completeNavigation, NAVIGATION_DELAY_MS);
    }

    function handleClick(event) {
        if (!shouldAnimateNavigation(event)) return;

        const target = event.currentTarget;
        const href = target.getAttribute("href");

        if (!href) {
            event.preventDefault();
            return;
        }

        if (sameRoute(href)) {
            event.preventDefault();
            return;
        }

        event.preventDefault();

        if (prefersReducedMotion()) {
            pendingHref = href;
            setActiveItem(target, { animate: false });
            renderBallIcon(target, false);
            completeNavigation();
            return;
        }

        navigateWithAnimation(target, href);
    }

    items.forEach((item) => {
        item.addEventListener("click", handleClick);
    });

    function syncToCurrentActive(animate = false) {
        const active = findActiveItem();
        setActiveItem(active, { animate });
        renderBallIcon(active, false);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => syncToCurrentActive(false));
    });

    let resizeFrame = null;
    window.addEventListener("resize", () => {
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
            positionChrome(currentActive, false);
            resizeFrame = null;
        });
    });

    window.addEventListener("orientationchange", () => {
        window.setTimeout(() => positionChrome(currentActive, false), 120);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && isNavigating && pendingHref) {
            clearNavigationTimer();
            completeNavigation();
        }
    });
});
