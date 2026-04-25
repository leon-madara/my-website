# Decisions

- The redesign is mobile-only.
- Desktop navigation remains the existing top `nav-pills` system.
- The floating ball represents the active page, not a special Contact action.
- Current site icons remain in use for continuity.
- The React/Vite local nav now follows the provided `mobile-dock/MobileDock.tsx` and `MobileDock.css` structure and class system.
- The provided dock has no saddle/notch, so the React/Vite local nav no longer renders the saddle layer and the static `public/` saddle is hidden/decorative.
- The active ball uses the provided dock's per-route black/red/green color model in both React/Vite and static `public/`.
- The Replit import is used as an aesthetic and animation reference, not as a workspace/template import.
- The React/Vite nav uses `framer-motion` for eased ball travel and icon presence changes.
- The static `public/` nav remains vanilla CSS/JS and mirrors the same timing/visual values without adding a build dependency.
- The latest `mobile-dock/` reference uses 560ms cubic-bezier travel and ring-tint shadows instead of the earlier green glow.
- Per review, the active icon ball is positioned inside the mobile nav menu, vertically centered in the dock card.
