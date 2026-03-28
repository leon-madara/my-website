# Decisions

## URL + Navigation
- Page slug: `design-process.html`
- Desktop liquid nav: icon-only, accessible label `Design Process`
- Mobile bottom nav: visible label `Process`
- Position: between `Portfolio` and `Contact`

## Interaction v1
- Keep it minimal: popovers for a handful of keywords using a single reusable system.
- Keywords shipped in v1: `screenshots`, `ai`, `research`, `hero`, `typography`, `github`

## Assets v1
- No third-party screenshots committed; use placeholder frames until we curate real visuals.

## Hero Direction v1
- Hero is the custom mural SVG: `public/designProcess/DesignProcess.svg`.
- Height uses `100svh` with `100vh` fallback.
- Hero overlay text: "MY DESIGN" (top-right) using `public/designProcess/organical-personal-use.bold-italic.ttf`.
- Dark mode hero asset: `public/designProcess/DesignProcessDarkMode.svg` (swapped via `body.dark-theme`).
- Mobile hero asset: `public/designProcess/DesignProcessMobile.svg` (used on small screens).
- Mobile dark hero asset: `public/designProcess/DesignProcessMobileDark.svg` (used on small screens when dark mode is enabled).

## Theme Toggle
- Use the shared `theme-toggle-landscape` web component (same pattern as `index.html`).
