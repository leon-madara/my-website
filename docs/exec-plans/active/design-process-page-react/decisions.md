# Decisions

## 2026-03-29 - React-first Implementation
- Status: Accepted
- Decision:
  - Implement the Design Process page as a React route under `app/`, aligned with `codex/react-overhaul`.
  - Treat the legacy static page as reference/spec only (not the primary runtime).
- Reason:
  - Enables reusable components (mobile nav, theme toggle variants, shared chrome) and seamless merge into the React migration branch.

## 2026-03-29 - Route Path
- Status: Accepted
- Decision: Use `/design-process` for the React route.
- Reason:
  - Mirrors the legacy `design-process.html` naming and keeps intent obvious.

## 2026-03-29 - Mobile Nav Visual Language
- Status: Accepted
- Decision: Implement a glass capsule mobile bottom nav with icon-only items and a distinct active bubble.
- Reason:
  - Matches the provided reference and is broadly reusable across routes.

