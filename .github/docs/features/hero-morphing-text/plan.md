# Plan

1. Update the hero heading markup to use stacked visual text layers plus a screen-reader-only text node.
2. Replace the scramble-specific styling with morph container and layer styles, including threshold filter support and reserved height handling.
3. Rewrite the role controller around `requestAnimationFrame`, reduced motion handling, visibility pause/resume, and dynamic height measurement.
4. Remove homepage-only GSAP includes if they are no longer required.
5. Add targeted automated coverage for initialization, fallback behavior, and role transitions.
6. Verify behavior manually and with focused automated checks, then update handoff docs.
