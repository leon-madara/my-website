# Architecture

## Overview

`my-website` is a static, multi-page portfolio site. The deployable site lives primarily in `public/`, where HTML entry points load CSS, JavaScript, structured content, and static assets directly in the browser.

## Primary Source-of-Truth Areas

### `public/`

This is the default shipping surface.

- `public/index.html`, `about.html`, `contact.html`, `portfolio.html`, `edumanage.html` are the main page entry points.
- `public/css/` contains styling for pages and shared UI.
- `public/js/` contains interaction logic, navigation behavior, and content loading.
- `public/portfolio_data/` and `public/MARKDOWN/` hold structured case-study content and longer-form narrative content.
- `public/images/` holds deployed static assets, while some legacy source assets still exist in mirrored root-level folders such as `images/` and `sounds/`.

### `portfolio_src/`

This is a supporting typed/prototype workspace. It can inform production logic, but it is not automatically the deployable source of truth. Any change that affects both `portfolio_src/` and `public/` needs a documented sync strategy.

### `tests/`

Automated JavaScript checks and testing utilities live here. This is the first stop for targeted automated verification when a task already has coverage.

### `validation/`

Manual browser validation pages and scripts live here. Use these for focused UI, accessibility, responsive, and browser checks when automated coverage is limited.

## Runtime Shape

### Marketing Pages

- Static HTML entry points render the public-facing pages.
- Shared behavior is loaded from `public/js/`.
- Styling is loaded from `public/css/`.

### Portfolio Experience

- `public/portfolio.html` is the portfolio shell.
- `public/js/portfolio.js` and `public/js/portfolioContentLoader.js` coordinate navigation and content loading.
- `public/js/projectData.js`, `public/portfolio_data/*.json`, and `public/MARKDOWN/*.md` provide structured case-study content.

### Generated Output

- `public/portfolio_build/` contains generated artifacts.
- Treat generated asset files as outputs, not hand-maintained source, unless the task explicitly targets the build result.

## Documentation and Planning Layers

- Root `AGENTS.md` is the repo entry point for agents.
- `WORKFLOW/` defines operating behavior.
- `docs/exec-plans/` stores active and completed feature continuity folders.
- `.kiro/specs/` stores requirement/design/task documents for some features.

## Change Map

| Change Type | Start Here |
|-------------|------------|
| Copy/content updates | `public/*.html`, `public/portfolio_data/`, `public/MARKDOWN/` |
| Styling updates | `public/css/` |
| Frontend interactions | `public/js/` |
| Typed adapter or model experiments | `portfolio_src/` |
| Automated verification | `tests/` |
| Manual validation flow | `validation/` |
| Multi-session or architectural work | `docs/exec-plans/` and `WORKFLOW/` |

## Boundary Rules

1. Do not quietly migrate source-of-truth ownership between folders.
2. If a task changes the intended role of `public/`, `portfolio_src/`, or `.kiro`, update this document and the relevant execution plan.
3. Prefer the lowest-complexity change that keeps the static delivery model intact.
