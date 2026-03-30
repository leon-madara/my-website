# Hero Morphing Text

## Scope

Replace the homepage hero role scramble effect with a Magic UI-style morphing text animation in vanilla HTML/CSS/JS while preserving the existing role words, typography, and outer `.role` wrapper compatibility.

## Current Status

- Implementation complete.
- Homepage hero now uses stacked morph text layers, a vanilla `requestAnimationFrame` controller, and homepage-only GSAP role dependencies have been removed.
- Target files updated: `public/index.html`, `public/css/styles.css`, `public/js/role-sequence.js`, and focused test coverage in `tests/`.
