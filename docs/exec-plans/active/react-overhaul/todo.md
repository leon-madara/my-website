# Todo

- [x] Get user approval for the overhaul branch split before implementation starts
- [x] Create the checkpoint commit on the current branch, then create the approved `codex/react-overhaul` branch
- [x] Scaffold the React authoring surface and route skeleton without replacing the current live `public/` pages yet
- [x] Build shared React shell components for nav, footer, theme, sidebar, and mobile nav
- [ ] Compare the updated React homepage role morph against the Magic UI reference on desktop and mobile during the homepage parity pass
- [x] Port the vanilla homepage hero organic floating blobs into the React hero background
- [ ] Finish homepage parity review with live desktop/mobile browser validation and polish any layout mismatches
- [ ] Finish About page parity review with live desktop/mobile browser validation and polish any layout or motion mismatches
- [ ] Finish Contact page parity review with live desktop/mobile browser validation and polish any layout or interaction mismatches
- [ ] Decide whether to mirror the new hoverless React scenic-toggle behavior back into the legacy static `public/` surface or keep the two stacks temporarily different
- [ ] Decide whether to retire the now-unused React-only `.theme-toggle-simple` and `.theme-toggle-sunmoon` CSS once all route parity checks are complete
- [x] Commit and push the propagated scenic React theme-toggle changes from `codex/react-overhaul` and `codex/design-process-page-react`
- [ ] Run live desktop/mobile browser validation on the React Design Process route and polish any layout mismatches
- [x] Replace the React `/portfolio` landing-page composition with the native workspace-style portfolio shell from `public/portfolio.html`
- [x] Rebuild the React portfolio top controls to match the native project selector row, section pills row, and divider rhythm
- [x] Rework the React Eastleigh and Legit Logistics case-study layout to match the native viewport-locked content-card geometry and spacing
- [x] Run a first live desktop/mobile browser validation pass on the rebuilt React portfolio workspace routes
- [x] Run a second screenshot-driven polish pass on the React portfolio workspace routes for exact spacing and typography parity
- [ ] Verify that the shared portfolio chrome changes did not regress the React EduManage long-form route on desktop and mobile
- [ ] Run live desktop/mobile browser validation on the React EduManage long-form route and polish any layout or motion mismatches
- [ ] Cut over deployment and retire the legacy static implementation

## Blockers

- The final source-of-truth boundary between the future React app and `public/` must be documented before cutover.
- A live browser validation pass is also still needed for the React About page before it can be called parity-complete.
- A live browser validation pass is also still needed for the React Contact page before Wave 1 can be treated as visually and behaviorally signed off.
- The scenic React toggle is now pushed on `codex/react-overhaul` and `codex/design-process-page-react`, but `main` still needs its own commit and push so the source branch matches the propagated React branches.
- The React scenic toggle is now intentionally hoverless while the static-site scenic toggle still has hover preview, so behavior currently differs by stack.
- Navigating from the React About route into Contact can still trigger the pre-existing GSAP revert recursion (`Maximum call stack size exceeded`); direct entry to Contact still works and the new shared theme toggle does not appear to be the cause.
- A live browser validation pass is still needed for the React Design Process page before it can be treated as parity-complete.
- The live portfolio reference is split across `public/portfolio.html`, compiled `public/portfolio_build/assets/*`, and the readable style reference in `public/css/portfolio.css`, so the React rebuild must treat the rendered workspace experience as the parity target.
- The Eastleigh workspace now matches the supplied reference states much more closely, but Legit Logistics and EduManage still need an explicit parity/regression pass under the updated shell.
