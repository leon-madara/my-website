# Decisions

- The redesign is mobile-only.
- Desktop navigation remains the existing top `nav-pills` system.
- The floating ball represents the active page, not a special Contact action.
- Current site icons remain in use for continuity.
- The saddle moves with the ball so the active item always feels seated in the dock.
- The active ball uses the site theme colors rather than the blue from the reference.
- The Replit import is used as an aesthetic and animation reference, not as a workspace/template import.
- The React/Vite nav uses `framer-motion` for spring ball travel and icon presence changes.
- The static `public/` nav remains vanilla CSS/JS and mirrors the same timing/visual values without adding a build dependency.
- The ball stays Kenyan green on every route instead of adopting Replit's per-icon black/red/green colors.
