# Plan

## Phase 1: Wire In Route + Navigation
- Add a new `DesignProcessRoute` under `app/src/features/`.
- Register `/design-process` in `app/src/routes/router.tsx`.
- Add `Process` to `siteRoutes` between `Portfolio` and `Contact`.

## Phase 2: Glass Capsule Mobile Bottom Nav
- Redesign shared `MobileBottomNav` to match the glass capsule reference:
  - Frosted background + subtle highlight stroke + soft shadow
  - Icon-only items (labels remain accessible via screen reader text)
  - Active bubble behind the active icon
- Ensure reduced-motion and keyboard focus remain usable.

## Phase 3: Design Process Hero (SVG)
- Add design-process assets into `app/public/designProcess/`:
  - `DesignProcess.svg`, `DesignProcessDarkMode.svg`
  - `DesignProcessMobile.svg`, `DesignProcessMobileDark.svg`
  - `organical-personal-use.bold-italic.ttf`
- Fix SVG clipping by updating viewBox/clipPath to include full artwork extents.
- Implement hero layout:
  - Full viewport height (`100svh` preferred)
  - No cropping; allow top/bottom whitespace if needed
  - Avoid nav overlay hiding the SVG (pad content above the fixed nav on mobile)

## Phase 4: Page-Specific Theme Toggle + Header Logo Override
- Add a mobile-only theme toggle UI for `/design-process` that matches the reference (sun/moon segmented control).
- Override `HeaderLogo` icon sources on this route to use the provided icons.

## Phase 5: Verification
- `npm run react:typecheck`
- `npm run react:test`
- Manual:
  - `npm run react:dev`, verify mobile nav visuals, active state, and theme switching on `/design-process`

