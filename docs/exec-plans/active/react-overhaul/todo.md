# Todo

- [ ] Get user approval for the overhaul branch split before implementation starts
- [ ] Create the checkpoint commit on the current branch, then create the approved `codex/react-overhaul` branch
- [ ] Scaffold the React authoring surface and route skeleton without replacing the current live `public/` pages yet
- [ ] Build shared React shell components for nav, footer, theme, sidebar, and mobile nav
- [ ] Migrate homepage to React and validate parity
- [ ] Migrate about page to React and validate parity
- [ ] Migrate contact page to React and validate parity
- [ ] Decide the canonical portfolio data and UI source before portfolio migration begins
- [ ] Migrate portfolio shell, project routes, and case-study subsections
- [ ] Cut over deployment and retire the legacy static implementation

## Blockers

- The repo rule for major overhauls requires a checkpoint commit and explicit user approval for a new `codex/<feature-slug>` branch before implementation.
- The final source-of-truth boundary between the future React app and `public/` must be documented before cutover.
