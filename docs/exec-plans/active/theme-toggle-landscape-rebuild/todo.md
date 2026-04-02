# Todo

- [x] Rebuild `theme-toggle-landscape` with scenic celestial actors plus a dormant hero knob
- [x] Remove redundant legacy toggle script from `public/contact.html` if it is no longer needed
- [x] Add focused tests for theme hydration, activation-before-transition, preview skipping, and hover state
- [x] Run targeted automated verification and record outcomes
- [x] Run real-browser visual QA for hover and click choreography on home and contact

## Blockers

- Playwright MCP local-browser checks are still blocked by `EPERM: operation not permitted, mkdir 'C:\\Windows\\System32\\.playwright-mcp'`, but the needed browser QA now runs successfully through `playwright-cli`.
