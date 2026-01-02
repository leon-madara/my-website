# GSAP Scroll Plugin Notes

Reference notes compiled from GSAP docs for ScrollTrigger (v3.3.0), ScrollTo, and ScrollSmoother (v3.10.0+).

## ScrollTrigger (v3.3.0)
- **Purpose**: Connects scroll position to GSAP timelines/tweens; supports scrubbing, pinning, snapping, and callbacks without requiring animations.
- **Quick Start**:
  - Minimal: `scrollTrigger: '.selector'` to trigger a tween when the element enters the viewport.
  - Advanced timeline-based setup supports pinning, scrubbing durations, and snapping to labels.
- **Standalone Usage**: `ScrollTrigger.create({...})` lets you react to scroll changes via callbacks even without animations.
- **Key Features**:
  - Link animations to viewport visibility for perf-friendly playbacks.
  - Toggle actions (play/pause/resume/restart/reverse/reset) based on entering/leaving trigger regions.
  - Smoothed scrubbing (`scrub: <seconds>`) and snapping options (`snap: 'labels'`, arrays, numbers, or functions).
  - Integrated support for ScrollSmoother and ScrollSmoother-specific offsets.
- **Notable Config Properties**:
  - `trigger`, `start`, `end`, `endTrigger` define activation bounds.
  - `pin`, `pinSpacing`, `pinType`, `pinReparent`, `pinnedContainer` manage sticky behavior.
  - `markers` aids debugging; accepts boolean or styling object.
  - `once`, `fastScrollEnd`, `anticipatePin`, `preventOverlaps`, `refreshPriority` fine-tune UX/perf.
  - `scroller` switches away from `window`; `horizontal: true` for horizontal scroll setups.
  - Callback hooks: `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack`, `onToggle`, `onUpdate`, `onScrubComplete`, `onSnapComplete`, `onRefresh`.
- **API Highlights**:
  - Inspect state via `progress`, `direction`, `isActive`, `getVelocity()`.
  - Control with `.enable()`, `.disable()`, `.kill()`, `.refresh()`, `.update()`.
  - Utilities: `ScrollTrigger.getAll()`, `.getById()`, `.batch()`, `.matchMedia()` (deprecated), `.config()`, `.sort()`.

## ScrollTo Plugin
- **Purpose**: Tween native scroll positions for `window` or scrollable elements (`scrollTop` / `scrollLeft`) using GSAP’s animation engine.
- **Usage Basics**:
  - Scroll window to absolute pixels: `gsap.to(window, {duration: 2, scrollTo: 400})`.
  - Scroll to selectors or elements: `scrollTo: '#target'` (implicit `y`) or `scrollTo: {y: '#target', offsetY: 50}`.
  - Scroll containers must have `overflow: scroll/auto`.
  - Combine `x` and `y` for diagonal moves.
- **Features & Options**:
  - `"max"` target scrolls to the maximum scrollable distance.
  - `offsetX`/`offsetY` adjust final position relative to targets (handy for sticky headers).
  - `autoKill: true` cancels the tween if the user manually scrolls; optional `onAutoKill` callback.
  - Global defaults configurable via `ScrollToPlugin.config({autoKill: true})`.
- **Warnings**:
  - Conflicts with CSS `scroll-behavior: smooth`; disable that when using ScrollToPlugin.
  - For scroll-triggered animations, continue to rely on ScrollTrigger (the ScrollTo plugin only animates scroll positions).

## ScrollSmoother (v3.10.0+)
- **Purpose**: Adds native-friendly smooth scrolling on top of ScrollTrigger by animating a content wrapper using transforms while preserving native scrollbars/interactions.
- **Structure**:
  - Required DOM: `#smooth-wrapper > #smooth-content` (or custom selectors via `wrapper`/`content` config). All scrollable content must live inside `#smooth-content`.
  - Fixed-position UI should live outside the wrapper or use ScrollTrigger pinning because transformed parents alter `position: fixed` behavior.
- **Initialization**:
  ```js
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  ScrollSmoother.create({
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
  });
  ```
- **Config Options**:
  - `smooth`: seconds to catch up to native scroll (default 0.8); `smoothTouch` overrides for touch devices (default no smoothing).
  - `effects`: enable `data-speed` / `data-lag` parsing; accept selector/array to scope effects.
  - `effectsPrefix`, `effectsPadding`, `speed`, `ease`, `normalizeScroll`, `ignoreMobileResize` for advanced tuning.
  - Lifecycle callbacks: `onUpdate`, `onStop`, `onFocusIn`.
- **Parallax & Lag Effects**:
  - `data-speed="<number|auto|clamp(x)>"` controls relative speed; `auto` calculates travel bounds within parent; `clamp()` prevents offsets above the fold (v3.12+ behavior).
  - `data-lag="<seconds>"` makes elements ease toward their natural position, creating layered motion.
  - Programmatic control via `ScrollSmoother.get().effects(targets, {speed, lag})`.
- **API Highlights**:
  - Inspect via `.progress`, `.scrollTrigger`, `.vars`.
  - Control methods: `.scrollTo()`, `.scrollTop()`, `.smooth()`, `.paused()`, `.kill()`, `.getVelocity()`, `.wrapper()`, `.content()`.
  - Only one ScrollSmoother instance can exist; retrieve via `ScrollSmoother.get()`.
- **Caveats**:
  - Keep `position: fixed` elements outside the smoothed content or replace with ScrollTrigger pinning.
  - `normalizeScroll: true` can’t prevent iOS Safari’s URL bar show/hide in portrait mode.
  - Effects should not be nested to avoid compounded transforms.

---

Use these notes as a quick reference when integrating GSAP scroll plugins into the portfolio project. Remember to register plugins before use and keep ScrollTrigger-driven logic in sync with ScrollSmoother scroll positions.

