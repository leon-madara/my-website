# Decisions

## Planning Decisions

### 2026-03-27 - Treat this as a major overhaul

- Status: Accepted
- Reason:
  - The request converts the whole project to React
  - It changes architecture, workflow, and likely the source-of-truth boundary
  - It will span multiple sessions and multiple page migrations

### 2026-03-27 - Migrate in waves: Home, About, Contact, then Portfolio

- Status: Accepted
- Reason:
  - This matches the user-requested order
  - The first three pages are simpler and help stabilize shared components before the portfolio migration
  - The portfolio page carries the highest architectural risk because it already mixes generated React output, typed source experiments, and static content loaders

### 2026-03-27 - Keep `public/` as the live surface until parity is proven

- Status: Accepted
- Reason:
  - Repo rules currently make `public/` the deployable production surface
  - A parallel React authoring surface lowers risk during the migration
  - The final cutover can then be documented cleanly instead of happening implicitly

### 2026-03-27 - Prefer one new React app instead of several independent page mounts

- Status: Accepted
- Reason:
  - A single app gives consistent routing, theme, navigation, and shared state patterns
  - It is a better fit for the later portfolio and case-study route structure
  - It avoids maintaining separate React entrypoints with duplicated chrome logic

### 2026-03-27 - Reuse `portfolio_src` concepts, but do not assume it is already the final portfolio source

- Status: Accepted
- Reason:
  - `portfolio_src` has useful typed data and adapter work
  - The live portfolio currently runs from generated assets in `public/portfolio_build`
  - The migration should explicitly choose a canonical portfolio source instead of silently inheriting both

### 2026-03-27 - Do not start implementation on the current branch

- Status: Accepted
- Reason:
  - Repo workflow requires a checkpoint commit and explicit approval for a new `codex/<feature-slug>` branch before overhaul work
  - The current branch already contains unrelated and in-progress edits
- Recommended branch name:
  - `codex/react-overhaul`

### 2026-03-27 - Put the new authoring surface in `app/`

- Status: Accepted
- Reason:
  - It keeps the React workspace clearly separate from the live `public/` surface
  - It matches the execution plan naming and makes the migration path easier to follow
  - It avoids prematurely redefining `public/` as the React source of truth

### 2026-03-27 - Reuse `public/` as the Vite public asset source during migration

- Status: Accepted
- Reason:
  - Existing images, icons, and static assets remain available without moving them yet
  - It supports parity-first page migration with minimal asset churn
  - Build output is heavier, but the output stays transitional and ignored

### 2026-03-27 - Port homepage hero behavior as isolated React feature modules, not as a new global controller

- Status: Accepted
- Reason:
  - The legacy homepage behavior in `public/js/main.js` and `public/js/role-sequence.js` is tightly scoped to the hero route
  - A dedicated homepage hook and component keep the new React app easier to reason about than recreating another all-page controller
  - This keeps the migration aligned with route-first ownership and makes later page migrations less error-prone

### 2026-03-27 - Rebuild the About page from structured React content plus scoped GSAP hooks instead of porting the old page-wide scripts verbatim

- Status: Accepted
- Reason:
  - The live About page relies on large page-global scripts, CDN-loaded GSAP plugins, and imperative DOM control
  - Rendering the content from typed React data with a local `gsap` dependency keeps the migration easier to maintain and test
  - Scoped hooks and section-level selectors reduce the risk of stale ScrollTriggers and make later Contact and Portfolio work cleaner

### 2026-03-27 - Rebuild the Contact page around React state, not a recreated page controller

- Status: Accepted
- Reason:
  - The live Contact page behavior is primarily local UI state: copy actions, validation, submit feedback, time, and FAQ toggles
  - React state and small helper functions are easier to verify and maintain than another imperative `ContactPage` object
  - This keeps Wave 1 aligned around page-scoped ownership before portfolio complexity begins
