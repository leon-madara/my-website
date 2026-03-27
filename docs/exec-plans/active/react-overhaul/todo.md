# Todo

- [x] Get user approval for the overhaul branch split before implementation starts
- [x] Create the checkpoint commit on the current branch, then create the approved `codex/react-overhaul` branch
- [x] Scaffold the React authoring surface and route skeleton without replacing the current live `public/` pages yet
- [x] Build shared React shell components for nav, footer, theme, sidebar, and mobile nav
- [ ] Finish homepage parity review with live desktop/mobile browser validation and polish any layout mismatches
- [ ] Finish About page parity review with live desktop/mobile browser validation and polish any layout or motion mismatches
- [ ] Finish Contact page parity review with live desktop/mobile browser validation and polish any layout or interaction mismatches
- [ ] Decide the canonical portfolio data and UI source before portfolio migration begins
- [ ] Migrate portfolio shell, project routes, and case-study subsections
- [ ] Cut over deployment and retire the legacy static implementation

## Blockers

- The final source-of-truth boundary between the future React app and `public/` must be documented before cutover.
- A live browser validation pass is still needed for the React homepage because the temporary local preview launch was blocked in this session.
- A live browser validation pass is also still needed for the React About page before it can be called parity-complete.
- A live browser validation pass is also still needed for the React Contact page before Wave 1 can be treated as visually and behaviorally signed off.
