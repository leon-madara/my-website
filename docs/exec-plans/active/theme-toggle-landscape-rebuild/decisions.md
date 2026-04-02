# Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-02 | Scope the rebuild to `theme-toggle-landscape` only | The shared landscape component is the active shipped surface for the current pill toggle on home and contact. |
| 2026-04-02 | Preserve the existing external theme contract | The rest of the static site depends on `body.dark-theme` and the saved `theme` key. |
| 2026-04-02 | Implement the redesign with CSS transitions/keyframes plus minimal JS state | The requested motion can be delivered without adding GSAP or changing the static-first stack. |
| 2026-04-02 | Use separate scenic celestial actors plus thumb faces | This keeps hover-preview animation independent from click-driven thumb movement and avoids a tangled single-element animation model. |
| 2026-04-02 | Use a focused Jest mock-DOM test instead of a true jsdom runtime | The current workspace lacks a working Jest jsdom environment, so a local mock DOM was the most reliable way to add regression coverage without changing dependencies. |
| 2026-04-02 | Keep the scenic actor visible behind the hero knob during hover | The component should still read as a landscape first, with the knob growing out of the scene rather than replacing it. |
| 2026-04-02 | Use a short activation phase before transitions when clicking from rest | This preserves the hover story for touch and keyboard users and prevents the switch from feeling like an instant lateral jump. |
| 2026-04-02 | Use `playwright-cli` for browser validation when MCP browser startup is blocked | The Windows permission error affects Playwright MCP initialization, but the CLI path still provides reliable real-browser coverage for this feature. |
