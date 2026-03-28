# Handoff

## Next Recommended Step
Run a quick manual pass in the browser and then expand content:
1. `npm run react:dev` and validate `/design-process` on mobile and desktop:
   - Hero SVG is fully visible (not clipped) and not covered by the mobile capsule nav.
   - Theme toggle works and swaps the hero SVG (mobile + desktop variants).
   - Nav active states behave correctly.
2. Port the full narrative sections from the static page outline into the React route.
3. Implement the minimal hover-reveal keyword artifacts as a reusable popover (React).

## Notes
- Keep accessibility: icon-only labels should remain available via screen reader text.
- Keep route-specific styling opt-in via body class (set in `AppLayout`) to avoid affecting other routes unexpectedly.
