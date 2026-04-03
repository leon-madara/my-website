# About React Rebuild

## Status

- State: In Progress
- Owner: Codex + Leon
- Started: 2026-04-03
- Last Updated: 2026-04-03

## Goal

Rebuild the About page as a dedicated React feature that replaces the current migrated About route only after the new version passes static parity, responsive parity, dark-mode parity, reduced-motion checks, and scroll-stability validation.

## Scope

- In scope:
  - Dedicated About-only React feature surface
  - Static-first parity rebuild of the vanilla About page
  - Section-by-section implementation
  - Phased motion reintroduction after layout parity is stable
  - Verification and handoff state for a future cutover
- Out of scope:
  - Rebuilding other pages
  - Changing the live `public/` source of truth during this session
  - Porting the full vanilla GSAP stack in one pass
  - Replacing the current About route before validation

## Context

- Relevant docs:
  - `AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/GOLDEN_PRINCIPLES.md`
  - `WORKFLOW/01_WORKFLOW.md`
  - `WORKFLOW/02_CODEX_INTEGRATION.md`
  - `docs/exec-plans/README.md`
  - `docs/exec-plans/active/react-overhaul/README.md`
- Relevant code:
  - `app/src/features/about/AboutRoute.tsx`
  - `app/src/features/about/AboutPage.tsx`
  - `app/src/features/about/about.css`
  - `app/src/features/about/aboutContent.ts`
  - `app/src/features/about/about.types.ts`
  - `app/src/features/about/components/`
  - `app/src/features/about/hooks/`
  - `public/about.html`
  - `public/css/about.css`
  - `public/js/about-parallax.js`
  - `app/src/shared/AppLayout.tsx`
  - `app/src/hooks/useReducedMotion.ts`
  - `app/src/routes/router.tsx`
- Related branch:
  - `codex/react-overhaul`
- Intended rebuild branch:
  - `codex/about-react-rebuild`

## Acceptance Criteria

- [x] The new About feature is tracked in its own execution-plan folder
- [x] Static parity is implemented before advanced motion
- [ ] The rebuilt page preserves the six About sections and their content order
- [ ] Motion is introduced in isolated layers with reduced-motion fallback
- [ ] The page is validated on desktop and mobile before replacement
- [ ] Another agent can resume the rebuild from repo docs without chat history
