/**
 * Design Process page interactions (v1)
 * - Minimal keyword "artifact" popovers
 * - Gentle scroll reveals
 */

(() => {
  if (!document.body.classList.contains("design-process-page")) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover =
    window.matchMedia && window.matchMedia("(hover: hover)").matches;

  // Swap the hero SVG when the theme toggle flips `body.dark-theme`.
  const heroImg = document.querySelector(".dp-hero-svg-image");
  if (heroImg) {
    const srcDay =
      heroImg.getAttribute("data-src-day") || heroImg.getAttribute("src") || "";
    const srcNight = heroImg.getAttribute("data-src-night") || "";
    const srcMobile = heroImg.getAttribute("data-src-mobile") || "";
    const srcMobileNight = heroImg.getAttribute("data-src-mobile-night") || "";

    const isMobileQuery =
      window.matchMedia && window.matchMedia("(max-width: 768px)");

    const syncHero = () => {
      const isNight = document.body.classList.contains("dark-theme");
      const isMobile = isMobileQuery ? isMobileQuery.matches : false;

      const nextSrc = isMobile
        ? isNight && srcMobileNight
          ? srcMobileNight
          : srcMobile || (isNight && srcNight ? srcNight : srcDay)
        : isNight && srcNight
          ? srcNight
          : srcDay;

      if (!nextSrc) return;
      if (heroImg.getAttribute("src") === nextSrc) return;
      heroImg.setAttribute("src", nextSrc);
    };

    syncHero();

    const themeObserver = new MutationObserver(syncHero);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (isMobileQuery) {
      isMobileQuery.addEventListener("change", syncHero);
    } else {
      // Fallback for older engines: keep it correct on resize/orientation.
      window.addEventListener("resize", syncHero, { passive: true });
    }
  }

  const triggers = Array.from(document.querySelectorAll("[data-artifact]"));
  if (triggers.length === 0) return;

  const popover = document.createElement("div");
  popover.className = "dp-artifact-popover";
  popover.id = "dp-artifact-popover";
  popover.setAttribute("role", "tooltip");
  popover.setAttribute("aria-hidden", "true");
  document.body.appendChild(popover);

  let activeTrigger = null;
  let hideTimer = null;

  function clearHideTimer() {
    if (!hideTimer) return;
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function artifactMarkup(type) {
    switch (String(type || "")) {
      case "screenshots":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Screenshot Frenzy</span>
            <span class="dp-artifact-meta">Direction library</span>
          </div>
          <div class="dp-artifact-grid">
            <div class="dp-mini-card"><span>mood</span></div>
            <div class="dp-mini-card"><span>detail</span></div>
            <div class="dp-mini-card"><span>industry</span></div>
            <div class="dp-mini-card"><span>layout</span></div>
            <div class="dp-mini-card"><span>ux</span></div>
            <div class="dp-mini-card"><span>color</span></div>
          </div>
        `;
      case "ai":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">AI Exploration</span>
            <span class="dp-artifact-meta">Fast iteration</span>
          </div>
          <div class="dp-chip-row" aria-label="Prompt tags">
            <span class="dp-chip"><span class="dp-chip-dot"></span>hero mood</span>
            <span class="dp-chip"><span class="dp-chip-dot red"></span>variation</span>
            <span class="dp-chip"><span class="dp-chip-dot dark"></span>layout</span>
            <span class="dp-chip"><span class="dp-chip-dot"></span>contrast</span>
            <span class="dp-chip"><span class="dp-chip-dot red"></span>emotion</span>
          </div>
        `;
      case "research":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Research Loop</span>
            <span class="dp-artifact-meta">Depth first</span>
          </div>
          <div class="dp-lines" aria-label="Research prompts">
            <div class="dp-line">What features do we need?</div>
            <div class="dp-line">What can go wrong?</div>
            <div class="dp-line">What is standard in this industry?</div>
          </div>
        `;
      case "hero":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Hero Anchor</span>
            <span class="dp-artifact-meta">First impression</span>
          </div>
          <div class="dp-artifact-grid" aria-label="Hero variants">
            <div class="dp-mini-card"><span>bold</span></div>
            <div class="dp-mini-card"><span>editorial</span></div>
            <div class="dp-mini-card"><span>minimal</span></div>
          </div>
        `;
      case "typography":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Typography</span>
            <span class="dp-artifact-meta">Tone + rhythm</span>
          </div>
          <div class="dp-chip-row" aria-label="Type signals">
            <span class="dp-chip"><span class="dp-chip-dot"></span>contrast</span>
            <span class="dp-chip"><span class="dp-chip-dot red"></span>hierarchy</span>
            <span class="dp-chip"><span class="dp-chip-dot dark"></span>rhythm</span>
            <span class="dp-chip"><span class="dp-chip-dot"></span>clarity</span>
          </div>
        `;
      case "github":
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Build Support</span>
            <span class="dp-artifact-meta">Handoff ready</span>
          </div>
          <div class="dp-chip-row" aria-label="Stack chips">
            <span class="dp-chip"><span class="dp-chip-dot"></span>HTML</span>
            <span class="dp-chip"><span class="dp-chip-dot"></span>CSS</span>
            <span class="dp-chip"><span class="dp-chip-dot red"></span>JS</span>
            <span class="dp-chip"><span class="dp-chip-dot dark"></span>Git</span>
          </div>
        `;
      default:
        return `
          <div class="dp-artifact-head">
            <span class="dp-artifact-title">Artifact</span>
            <span class="dp-artifact-meta">Preview</span>
          </div>
          <div class="dp-lines">
            <div class="dp-line">No preview available.</div>
          </div>
        `;
    }
  }

  function setOpen(open) {
    popover.classList.toggle("is-open", open);
    popover.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function positionPopover(trigger) {
    if (!trigger) return;

    // Reset first so getBoundingClientRect reflects natural size.
    popover.style.left = "0px";
    popover.style.top = "0px";

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const margin = 12;

    const preferredLeft =
      triggerRect.left + triggerRect.width * 0.5 - popoverRect.width * 0.5;
    const left = clamp(
      preferredLeft,
      margin,
      window.innerWidth - popoverRect.width - margin,
    );

    const spaceAbove = triggerRect.top;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const fitsBelow = spaceBelow > popoverRect.height + margin;

    const preferredTop =
      fitsBelow || spaceBelow >= spaceAbove
        ? triggerRect.bottom + margin
        : triggerRect.top - popoverRect.height - margin;
    const top = clamp(
      preferredTop,
      margin,
      window.innerHeight - popoverRect.height - margin,
    );

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
  }

  function show(trigger) {
    if (!trigger) return;
    clearHideTimer();

    const type = trigger.getAttribute("data-artifact");
    popover.innerHTML = artifactMarkup(type);

    if (activeTrigger && activeTrigger !== trigger) {
      activeTrigger.removeAttribute("aria-describedby");
    }

    activeTrigger = trigger;
    activeTrigger.setAttribute("aria-describedby", popover.id);

    setOpen(true);
    positionPopover(trigger);
  }

  function hide() {
    clearHideTimer();
    if (activeTrigger) {
      activeTrigger.removeAttribute("aria-describedby");
    }
    activeTrigger = null;
    setOpen(false);
  }

  function scheduleHide(delayMs) {
    clearHideTimer();
    hideTimer = window.setTimeout(hide, delayMs);
  }

  triggers.forEach((trigger) => {
    if (trigger.tagName.toLowerCase() === "button" && !trigger.type) {
      trigger.type = "button";
    }

    if (supportsHover) {
      trigger.addEventListener("mouseenter", () => show(trigger), {
        passive: true,
      });
      trigger.addEventListener("mouseleave", () => scheduleHide(60), {
        passive: true,
      });
    }

    trigger.addEventListener("focus", () => show(trigger));
    trigger.addEventListener("blur", () => scheduleHide(60));

    trigger.addEventListener("click", (event) => {
      if (supportsHover) return;
      event.preventDefault();
      event.stopPropagation();

      if (activeTrigger === trigger && popover.classList.contains("is-open")) {
        hide();
        return;
      }

      show(trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      hide();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    hide();
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!popover.classList.contains("is-open")) return;
    if (popover.contains(target)) return;
    if (activeTrigger && activeTrigger.contains(target)) return;
    hide();
  });

  window.addEventListener("resize", () => {
    if (!activeTrigger) return;
    positionPopover(activeTrigger);
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!popover.classList.contains("is-open")) return;
      hide();
    },
    { passive: true },
  );

  // Scroll reveal (light touch)
  const revealNodes = Array.from(document.querySelectorAll(".dp-reveal"));
  if (revealNodes.length > 0) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );

      revealNodes.forEach((node) => observer.observe(node));
    }
  }
})();
