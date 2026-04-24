# Handoff

Implementation lives in both `public/` and the React/Vite local app used by `localhost:5173`.

The React/Vite local app now uses the provided `mobile-dock` structure and copied CSS for the dock/card/ball styling. It keeps React Router links and existing site icons instead of adding `lucide-react`. Static pages keep the vanilla controller.

Remaining follow-up is human visual review against the provided `mobile-dock` reference and deciding whether to fully rework the static `public/` markup to the same `mdock-*` structure.
