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
