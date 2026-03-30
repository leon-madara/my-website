# Verification

- `npx jest tests/roleSequenceController.test.js tests/gsapDemoReference.test.js --runInBand`
  - Passed: 2 suites, 4 tests.
- Static diff review confirmed:
  - Homepage hero markup now contains stacked morphing text layers and a screen-reader-only live text node.
  - Homepage-only GSAP role script tags were removed from `public/index.html`.
  - The role controller no longer depends on `gsap`, `TextPlugin`, `SplitText`, or `ScrambleTextPlugin`.
- Interactive browser verification was attempted with Playwright, but runtime inspection was blocked by an existing Chrome session on the machine (`Opening in existing browser session` launch failure).
