# Verification

## Automated
- `npm run test:gsap` (PASS)

## Manual
- `npm run serve` (started successfully)
- Fetched pages while serving:
  - `http://localhost:3000/design-process.html` (200)
  - `http://localhost:3000/index.html` (200)
- Fetched SVG hero asset while serving:
  - `http://localhost:3000/designProcess/DesignProcess.svg` (200)
- Fetched SVG hero dark asset while serving:
  - `http://localhost:3000/designProcess/DesignProcessDarkMode.svg` (200)
- Fetched SVG hero mobile asset while serving:
  - `http://localhost:3000/designProcess/DesignProcessMobile.svg` (200)
- Fetched SVG hero mobile dark asset while serving:
  - `http://localhost:3000/designProcess/DesignProcessMobileDark.svg` (200)
- Fetched Organical font while serving:
  - `http://localhost:3000/designProcess/organical-personal-use.bold-italic.ttf` (200)
- Confirmed `design-process.html` contains keyword artifact triggers and mobile nav label `Process`.
- Confirmed `design-process.html` includes `theme-toggle-landscape` and the "MY DESIGN" hero overlay markup.
