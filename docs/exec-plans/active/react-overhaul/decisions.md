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

### 2026-03-27 - Align the React homepage hero morph to Magic UI timing but keep Leon-specific branding and accessibility

- Status: Accepted
- Reason:
  - The existing React hero already matched the legacy blur math, but its hold-heavy timing felt less fluid than the Magic UI reference
  - Keeping the current role copy, `<h2>` semantics, and reduced-motion behavior preserves homepage identity and accessibility while improving the motion system
  - Porting the Magic UI loop into the existing React feature is lower risk than introducing Tailwind, shadcn, or a new shared abstraction mid-migration

### 2026-03-27 - Use the exact Magic UI cooldown handoff in the React homepage hero

- Status: Accepted
- Reason:
  - The intermediate React workaround reassigned the finished word back onto the first layer, which diverged from the reference component
  - The requested goal is exact Magic UI behavior with Leon's words, so cooldown ownership must remain on the second text layer
  - Accessibility and stability wrappers should adapt around the reference algorithm rather than rewriting its visual handoff

### 2026-03-30 - Make `npm run dev` target the React app on `codex/react-overhaul`

- Status: Accepted
- Reason:
  - The default `dev` script was still serving the legacy static `public/` site, which hid the React-only `/design-process` route during normal local startup
  - This branch now needs the default developer entrypoint to represent the React migration surface, not the legacy static server
  - Keeping `serve` and `start` pointed at `public/` preserves the legacy static workflow when it is needed explicitly

### 2026-03-30 - Keep the left profile pill homepage-only in the React shared shell

- Status: Accepted
- Reason:
  - The left profile pill is part of the homepage composition and should not bleed into inner pages
  - Reusing it on other routes changes the intended page hierarchy and distracts from page-specific layouts
  - The shared shell should apply the sidebar layout offset only on `/`

### 2026-03-30 - Route-specific parity fixes may override the shared `.page-content` width with higher-specificity selectors

- Status: Accepted
- Reason:
  - Inner routes like About and Contact need to escape the shared `1040px` cap when their legacy layouts are full-width compositions
  - Relying on equal-specificity selectors made the outcome depend on stylesheet order, which caused incorrect route width on Contact
  - A route-specific selector such as `.page-content.page-content--contact` is a safer parity fix than loosening the shared default for every page

### 2026-03-30 - Treat the live workspace view of `public/portfolio.html` as the parity target for the React portfolio

- Status: Accepted
- Reason:
  - The user wants the React portfolio to match the native design exactly, and the rendered native portfolio experience is a compact case-study workspace rather than a summary landing page
  - The current React `/portfolio` landing composition adds a new information architecture that does not exist in the native design
  - The React tabbed case-study route is closer to the native experience, so the React rebuild should converge toward that workspace model instead of polishing the migration-only landing page

### 2026-03-30 - Make `/portfolio` open directly into the default tabbed workspace

- Status: Accepted
- Reason:
  - The native portfolio route is the workspace itself, not an intermediate chooser page
  - Keeping `/portfolio` as a migration-only landing page preserved the biggest parity mismatch in the portfolio migration
  - Using Eastleigh as the default workspace entry keeps React routing intact while matching the native entry experience much more closely

### 2026-03-30 - Let portfolio routes own their own chrome

- Status: Accepted
- Reason:
  - The native portfolio presentation keeps the logo and theme toggle but does not use the full shared React nav/footer/background chrome
  - The shared nav pill and footer changed the top-of-page composition and made the portfolio feel like a generic routed page instead of a self-contained workspace
  - Route-specific chrome rules are lower risk than introducing another specialized global layout abstraction mid-migration

### 2026-03-30 - Lock the Eastleigh tabbed portfolio workspace to a strict 100vh shell with instant transitions

- Status: Accepted
- Reason:
  - The supplied screenshots show a fully locked viewport composition where the content card always lands on the bottom edge of the screen
  - Smooth scroll resets made the React workspace feel looser than the reference and were explicitly called out by the user
  - A fixed-height card with instant tab changes keeps the portfolio experience closer to the native workspace without changing the route model

### 2026-03-30 - Use the screenshot composition, not the earlier red-outline selector styling, as the portfolio shell source of truth

- Status: Accepted
- Reason:
  - The newer screenshots show a softer green-highlighted project selector, visible landscape toggle, and card-edge-aligned logo placement
  - Preserving the older red-outline selector styling kept a visible mismatch after the first React portfolio rebuild
  - Updating the selector shell and copy to follow the screenshot composition gives the React portfolio a more faithful parity target

### 2026-04-02 - Implement homepage hero organic blobs as React components (not CSS pseudo-elements)

- Status: Accepted
- Reason:
  - The legacy design expresses the blobs as `.hero-section::before/::after` and `.landing-page::before`, but React benefits from explicit, composable DOM nodes for parity work and future reuse across routes
  - Componentized blobs keep the migration work isolated to the Home route and avoid coupling global selectors to pseudo-element behavior

### 2026-04-02 - Use the rebuilt landscape web component as the default React theme toggle

- Status: Accepted
- Reason:
  - The shipped vanilla landscape toggle now owns the scenic sun/moon choreography the user approved, so React should reuse that exact interaction model instead of maintaining a second approximation
  - Wrapping the custom element inside React is lower risk than reimplementing the full animation system a second time in `app/src/`
  - Bridging its `theme-changed` event into `ThemeProvider` preserves React-side theme state while keeping the visual behavior identical across static and React surfaces

### 2026-04-03 - Propagate the scenic React toggle by copying the canonical main-worktree file set into the other local React branches

- Status: Accepted
- Reason:
  - The current `main` worktree already contains the most up-to-date React-side scenic toggle integration
  - Copying the known-good file set into the other local React branches is lower risk than re-deriving the same integration separately on each branch
  - Separate git worktrees allow the propagation without disturbing the in-progress uncommitted work on `main`

### 2026-04-03 - Make the React scenic toggle click-only with no hover preview

- Status: Accepted
- Reason:
  - The user wants the React toggle to stay visually quiet on hover and only animate on click
  - Removing preview and activation states makes the sun set or the moon lower directly into the theme change
  - This is intentionally scoped to the React-side copy of the landscape component, leaving the static-site component unchanged for now

### 2026-04-03 - Keep the React theme switch immediate but stretch scenic celestial motion to `1.2s`

- Status: Accepted
- Reason:
  - The user wants the site theme to respond instantly while the sun/moon finishes the visual story more gently afterward
  - Slowing only the scenic bodies preserves responsiveness better than delaying the actual theme state change
  - Keeping this timing change scoped to the React-side landscape component avoids unintentionally changing the already-diverged static-site toggle
