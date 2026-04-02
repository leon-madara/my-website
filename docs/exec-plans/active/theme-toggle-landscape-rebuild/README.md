# Theme Toggle Landscape Rebuild

## Status

- State: In Review
- Owner: Codex
- Started: 2026-04-02
- Last Updated: 2026-04-02

## Goal

Rebuild and refine the shared `theme-toggle-landscape` component so the resting control reads as a small scenic sun or crescent inside the landscape, while a separate dormant hero knob grows forward on hover and handles the click-driven day/night switch.

## Scope

- In scope:
  - `public/js/theme-toggle-landscape-component.js`
  - Shared behavior used by `public/index.html` and `public/contact.html`
  - Focused regression coverage for theme hydration, toggling, and hover-preview state
  - Removal of redundant page integration if `public/contact.html` still loads the legacy toggle script beside the custom element
- Out of scope:
  - Legacy toggle variants on `public/about.html` and `public/edumanage.html`
  - React-side toggle work under `app/`
  - Global dark-theme styling beyond what is needed to preserve existing compatibility

## Context

- Relevant docs:
  - `AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/GOLDEN_PRINCIPLES.md`
  - `WORKFLOW/01_WORKFLOW.md`
- Relevant code:
  - `public/js/theme-toggle-landscape-component.js`
  - `public/index.html`
  - `public/contact.html`
- Related `.kiro/specs/` folder:
  - `.kiro/specs/dark-mode-implementation/`

## Acceptance Criteria

- [x] The rebuilt component keeps the same public custom-element contract and theme persistence behavior
- [x] Hover preview enlarges the active celestial body without switching theme
- [x] Click switching moves the thumb and plays the correct day/night transition sequence
- [x] Night mode shows a crescent moon and twinkling stars; day mode restores smaller clouds
- [x] Focus, keyboard, and reduced-motion behavior remain accessible
