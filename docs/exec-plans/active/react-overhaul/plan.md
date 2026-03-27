# Plan

## Phases

### Phase 0 - Pre-Migration Guardrails

- [ ] Confirm this is an overhaul effort and follow the repo branching rule before implementation
- [ ] Checkpoint the current branch state in a commit before any React migration work begins
- [ ] Ask for approval to branch to `codex/react-overhaul` or a similar approved branch name
- [ ] Keep `public/` as the live production surface during migration; do not cut it over until parity is proven
- [ ] Record the final boundary decision when the React source becomes canonical

### Phase 1 - Foundation and Architecture

- [ ] Scaffold a React + TypeScript + Vite application in a new authoring surface outside `public/`
- [ ] Establish folder structure for routes, shared components, hooks, styles, assets, and page features
- [ ] Add React Router and define route parity for `/`, `/about`, `/contact`, `/portfolio`, and future case-study routes
- [ ] Decide build output strategy for static hosting:
  - Temporary: build to `dist/` or another non-live folder for side-by-side validation
  - Cutover: either publish generated files into `public/` or formally redefine `public/` as deploy output only
- [ ] Define how assets are referenced so existing images, fonts, and icons remain stable during migration
- [ ] Set up baseline testing for the React app with Vitest and React Testing Library, while keeping existing targeted tests available

### Phase 2 - Shared UI Extraction

- [ ] Convert repeated page chrome into reusable React components:
  - Header logo
  - Liquid navigation
  - Mobile bottom navigation
  - Footer
  - Theme toggle variants
  - Profile sidebar and social links
  - Shared decorative background layers
- [ ] Move route awareness from DOM scripts into React state and router-driven active-nav behavior
- [ ] Consolidate theme persistence logic into a single client hook or provider
- [ ] Extract common layout and token styles before page-specific rewrites
- [ ] Preserve accessibility behavior such as ARIA state, keyboard support, and reduced-motion handling

### Phase 3 - Wave 1: Homepage

- [ ] Rebuild the homepage first because it is visually central but structurally simpler than portfolio
- [ ] Port these behaviors into React:
  - Hero layout and CTA flow
  - Role sequence text animation
  - No-scroll viewport behavior used on home
  - Theme toggle landscape component
  - Sidebar card interactions
- [ ] Replace imperative initialization in `public/js/main.js` with focused hooks and component-local effects
- [ ] Keep styling parity first, then simplify or refactor only after visual parity is verified
- [ ] Validate on desktop and mobile against the current page

### Phase 4 - Wave 1: About Page

- [ ] Migrate the about page into React after homepage shared components are stable
- [ ] Encapsulate GSAP + ScrollTrigger behavior inside a React hook with cleanup and fallback modes
- [ ] Port the parallax hero, section reveals, skills grid, timeline, and other long-scroll sections
- [ ] Keep reduced-motion support and fallback rendering as first-class behavior
- [ ] Remove duplicated inline theme and nav scripts once React equivalents are stable

### Phase 5 - Wave 1: Contact Page

- [ ] Migrate the contact page after shared form, nav, theme, and toast patterns are ready
- [ ] Port contact cards, copy-to-clipboard, FAQ accordion behavior, live Nairobi time, and availability display
- [ ] Convert the form to React-managed validation and submission states
- [ ] Preserve semantic form structure and accessible inline error reporting
- [ ] Decide whether submission remains simulated, mailto-based, or backed by a service before final cutover

### Phase 6 - Wave 2: Portfolio and Case Studies

- [ ] Audit the current split portfolio setup:
  - `public/portfolio.html` loading `public/portfolio_build/assets/*`
  - `portfolio_src/` holding typed data and adapter logic
  - `public/js/projectData.js`, `public/portfolio_data/*.json`, and `public/MARKDOWN/*.md`
- [ ] Choose one canonical portfolio authoring path and document it before coding
- [ ] Rebuild the portfolio experience in the new React app using route-aware structure
- [ ] Recommended route model:
  - `/portfolio`
  - `/portfolio/:projectSlug`
  - Nested section state for case-study subsections
- [ ] Reuse `portfolio_src` typed data and adapter concepts where they reduce migration risk
- [ ] Stop treating `public/portfolio_build/assets/*` as an authoring surface; treat it as generated output only
- [ ] Migrate portfolio entrance animation only after baseline navigation and content rendering are stable

### Phase 7 - Cutover and Cleanup

- [ ] Compare React pages against current static pages and close parity gaps
- [ ] Update deployment config, redirects, and route handling for static hosting
- [ ] Remove or archive legacy page scripts only after the React versions are verified
- [ ] Update architecture docs to reflect the new source-of-truth boundary
- [ ] Add a migration summary and cleanup checklist before merging

## Proposed Structure

- React authoring surface:
  - `app/`
  - `app/routes/`
  - `app/components/`
  - `app/features/home/`
  - `app/features/about/`
  - `app/features/contact/`
  - `app/features/portfolio/`
  - `app/hooks/`
  - `app/styles/`
- Transitional output:
  - `dist/` or `output/react-overhaul/`
- Existing live surface during migration:
  - `public/`

## Verification Strategy

- Targeted automated checks:
  - Existing `npm run test:gsap`
  - Existing `tests/` utilities where still relevant
  - New React component and hook tests
- Manual and browser validation:
  - Desktop and mobile parity review
  - Keyboard navigation and focus order
  - Theme persistence
  - Reduced motion behavior
  - Route refresh and direct-entry checks
  - Portfolio project and subsection navigation

## Risks

- Risk: The repo currently treats `public/` as the default source of truth, but a React rewrite introduces a new authoring surface.
  Mitigation: Keep `public/` live during migration, then document and approve the final boundary change at cutover.

- Risk: The current branch is already mid-flight and dirty, which makes a large migration risky on top of unrelated work.
  Mitigation: Follow the branch checkpoint rule and start implementation only after a dedicated approved overhaul branch is created.

- Risk: The portfolio already has a partial React/build pipeline plus a separate `portfolio_src` typed layer.
  Mitigation: Canonicalize one portfolio source before implementation and treat other layers as transitional inputs or generated outputs.

- Risk: GSAP and DOM-heavy scripts may regress when moved into React lifecycle code.
  Mitigation: Wrap each animation system in isolated hooks, add cleanup, and keep reduced-motion fallback paths.

- Risk: Static hosting may break client-side routes on refresh or direct links.
  Mitigation: Decide route strategy early, add redirects/fallbacks, and test direct-entry navigation before cutover.

- Risk: Incremental page migration can create duplicated theme, nav, and layout behavior across old and new stacks.
  Mitigation: Build shared React primitives first and migrate pages in waves rather than page-by-page improvisation.
