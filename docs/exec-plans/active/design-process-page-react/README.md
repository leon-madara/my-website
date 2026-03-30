# Design Process Page (React)

## Goal
Add a new React route for **My Design Process** and implement a reusable **glass capsule** mobile bottom navigation component that can be shared across the React app.

## Status
In progress (React-first implementation).

## Scope (v1)
- New route: `/design-process`
- Hero: SVG-based mural that fits the viewport without cropping
- Design Process page-specific:
  - Overlay text: `MY DESIGN` in Organical bold italic, color `#573E0F`
  - Custom header logo icons on this route:
    - Light: `logoICON.svg`
    - Dark: `logoIconDark.svg`
  - Mobile-only theme toggle UI matches the provided sun/moon reference
- Mobile bottom nav:
  - Glass capsule style
  - Icon-only navigation with clear active state (“active bubble”)
  - Includes `Process` between `Portfolio` and `Contact`

## Notes
- This work builds on `codex/react-overhaul` which introduces the React authoring surface under `app/` (Vite + React Router).
- The legacy static implementation in `public/design-process.html` remains a separate track and is not the source of truth for the React route.

