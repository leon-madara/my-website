# Decisions

## Planning Decisions

### 2026-04-03 - Treat the About rewrite as a dedicated rebuild

- Status: Accepted
- Reason:
  - The current React About route is jitter-prone and should not be patched in place
  - A dedicated rebuild keeps the replacement path isolated and easier to validate

### 2026-04-03 - Fork from `codex/react-overhaul`

- Status: Accepted
- Reason:
  - The shared React app shell and routing work already live there
  - The new About feature can reuse the existing base without mixing with `main`

### 2026-04-03 - Make static parity the first acceptance milestone

- Status: Accepted
- Reason:
  - The vanilla About page is animation-heavy, so layout and content parity need to be stable before motion is reintroduced
  - This reduces the chance that GSAP or lifecycle issues hide layout regressions

### 2026-04-03 - Reintroduce motion in layers

- Status: Accepted
- Reason:
  - The page should get section reveals first, then simple hero motion, then optional advanced effects
  - This makes jitter easier to isolate and remove

### 2026-04-03 - Keep shell ownership outside the About feature

- Status: Accepted
- Reason:
  - Header, nav, theme toggle, sidebar, and footer are shared shell concerns
  - The About rebuild should not animate shared chrome directly

### 2026-04-03 - Replace the old About animation stack with local hooks and CSS-state motion

- Status: Accepted
- Reason:
  - The old page-wide controller combined shell fade, hero motion, and section reveals in one imperative unit
  - The rebuild is more stable when hero motion and section reveals are independent and scoped to About-owned nodes only

### 2026-04-03 - Use a static-first mobile hero layout instead of forcing the desktop overlay pattern onto small screens

- Status: Accepted
- Reason:
  - The desktop overlay composition does not compress cleanly into the mobile viewport once the bottom navigation and fixed header controls are present
  - A stacked mobile hero keeps the first screen legible without reintroducing heavy motion or layout thrash

### 2026-04-03 - Use the simple page toggle on About and Contact

- Status: Accepted
- Reason:
  - The scenic landscape toggle belongs to the home and portfolio experiences
  - About and Contact match the vanilla/static shell more closely with the simple fixed button treatment

### 2026-04-03 - Keep the profile sidebar homepage-only

- Status: Accepted
- Reason:
  - The sidebar is a home-page shell element, not part of the About route design
  - Removing it from About simplifies the route shell and gives the hero the correct full-width canvas

### 2026-04-03 - Use `@gsap/react` for About hero entrance + ScrambleText

- Status: Accepted
- Reason:
  - `useGSAP()` provides reliable automatic cleanup via `gsap.context()` and avoids StrictMode re-entry artifacts
  - ScrambleText is reintroduced only for the small, hero-owned eyebrow text to match vanilla entrance flair without destabilizing layout
