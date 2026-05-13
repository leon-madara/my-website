# Plan

- Audit crawlability, sitemap, robots, canonical, titles, descriptions, H1s, social metadata, and schema.
- Fix React live surface first because live `robots.txt` and `sitemap.xml` were falling back to the SPA HTML.
- Mirror essential fixes into `public/` because it remains documented as a shipping source-of-truth surface.
- Verify with typecheck, build, targeted Jest, local HTTP checks, and Playwright-rendered route metadata checks.
