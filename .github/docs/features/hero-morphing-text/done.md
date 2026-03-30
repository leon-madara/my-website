# Done

- Created feature context for the homepage hero morphing text change.
- Updated the homepage hero markup to use two visual morph layers and one screen-reader-only text node.
- Replaced the scramble-specific hero CSS with morph container and layer styles, including reserved-height support.
- Rewrote the role sequence controller in vanilla JavaScript using `requestAnimationFrame`, reduced motion fallback, visibility pause/resume, filter injection, and responsive remeasurement.
- Removed homepage-only GSAP script tags from `public/index.html`.
- Added focused automated coverage for controller initialization, reduced motion fallback, and one completed role transition.
- Ran targeted Jest verification for the controller and the existing GSAP reference scan.
