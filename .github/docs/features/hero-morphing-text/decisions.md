# Decisions

- Implement the morph effect in vanilla HTML/CSS/JS instead of React to fit the static homepage architecture.
- Preserve the outer `.role` / `.role-sequence` element so existing homepage code keeps working.
- Target the full threshold-style Magic UI morph effect rather than a simplified fade.
- Inject the SVG threshold filter from the controller instead of hardcoding it into `index.html`, keeping the markup lighter and making test coverage straightforward.
- Keep the automated coverage in the root Jest setup to match the existing `gsapDemoReference.test.js` workflow and avoid introducing new root-level test dependencies.
