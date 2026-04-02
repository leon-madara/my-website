# Done

- Created the dedicated feature branch `codex/theme-toggle-landscape-rebuild` after checkpointing the current `main` worktree state.
- Created the feature continuity folder for the landscape toggle rebuild.
- Rebuilt `public/js/theme-toggle-landscape-component.js` with a new layered scene model: separate thumb, sun actor, crescent moon actor, stars, clouds, and mountains.
- Added explicit hover-preview state, click-triggered transition state, keyboard-friendly button state updates, and reduced-motion handling while preserving the existing theme persistence contract.
- Refined the rebuild so the resting state is scenic-first: a small rear sun or crescent sits inside the landscape while the hero knob stays visually dormant until hover or activation.
- Added a `data-activation` phase so touch, keyboard, and non-hover clicks run a short grow-first beat before the slide transition starts.
- Updated the day-to-night and night-to-day choreography so the outgoing hero knob slides away while the scenic celestial actor sets or rises and the stars fade on their own timing.
- Removed the redundant `js/theme-toggle.js` include from `public/contact.html` so the landscape component is the only active shared toggle there.
- Expanded the focused Jest coverage in `tests/themeToggleLandscapeComponent.test.js` to cover saved-theme hydration, activation-before-transition, preview-skip clicks, resting night preview, and reduced-motion timing.
- Ran a real-browser `playwright-cli` smoke pass covering day rest, day hover growth, dark-mode toggle, in-browser persistence from home to contact, night hover, and reverse toggle back to day.
