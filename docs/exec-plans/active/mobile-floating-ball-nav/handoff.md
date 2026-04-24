# Handoff

Implementation lives in both `public/` and the React/Vite local app used by `localhost:5173`.

The current refresh copies the imported Replit dock proportions and radial ball depth while keeping the Kenyan green glass glow. React uses `framer-motion`; static pages keep the vanilla controller.

Remaining follow-up is human visual review against the imported reference. If the notch needs tighter per-page matching, add a page-level `--mobile-nav-notch-color` override rather than changing the shared animation model.
