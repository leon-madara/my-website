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

### 2026-03-27 - Do not reuse the full legacy `public/` directory as the React app public asset source

- Status: Accepted
- Reason:
  - Copying the full legacy `public/` directory into the React build caused route shadowing for `/about` and `/contact`
  - The React app only needs a narrow set of shared image assets during migration
  - A dedicated `app/public/` folder preserves SPA route ownership while keeping asset churn manageable

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

### 2026-03-27 - Treat the new React portfolio feature layer as the canonical authoring source for routed portfolio pages

- Status: Accepted
- Reason:
  - The live portfolio currently splits ownership across `public/portfolio.html`, legacy JS loaders, and generated React build output
  - The React migration needs one durable source inside `app/src/features/portfolio/` instead of runtime dependence on `public/portfolio_build`
  - `portfolio_src` and live static sources remain migration inputs, not the long-term routed runtime

### 2026-03-27 - Keep Eastleigh and Legit Logistics on one shared tabbed case-study template

- Status: Accepted
- Reason:
  - Projects 01 and 02 already share the same case-study interaction model and information architecture
  - A shared template reduces migration risk and keeps the route system consistent
  - Query-param deep linking is simpler and safer than recreating the old horizontal DOM scroll controller

### 2026-03-27 - Keep EduManage as a separate long-form React case-study template

- Status: Accepted
- Reason:
  - EduManage already has a different long-scroll structure in the live site
  - Flattening it into the tabbed case-study model would lose the editorial pacing and chapter rhythm
  - A dedicated template preserves the content shape while still moving ownership into React

### 2026-03-27 - Scope the portfolio entrance animation to `/portfolio` only

- Status: Accepted
- Reason:
  - The entrance is part of the portfolio landing identity, but it should not delay direct case-study entry
  - This preserves the effect while keeping routed project pages fast and link-friendly
  - Session-based skipping remains intact for repeat visits
