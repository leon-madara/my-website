# React Overhaul

## Status

- State: Planning
- Owner: Codex + Leon
- Started: 2026-03-27
- Last Updated: 2026-03-27

## Goal

Transition the portfolio site from the current mixed static-HTML and partial React setup into a maintainable React application, starting with the homepage, about page, and contact page, then migrating the portfolio experience and case studies after the shared foundation is stable.

## Scope

- In scope:
  - Migration planning for a repo-wide React overhaul
  - Recommended architecture for React, routing, styling, animations, and deployment
  - Sequenced rollout for `index`, `about`, `contact`, then `portfolio`
  - Reuse strategy for shared UI, existing GSAP behaviors, and `portfolio_src`
  - Verification and cutover strategy
- Out of scope:
  - Immediate implementation of the React app
  - Branch creation before user approval
  - Content rewrites unrelated to the migration
  - Reworking deployed generated assets by hand

## Context

- Relevant docs:
  - `AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/GOLDEN_PRINCIPLES.md`
  - `WORKFLOW/01_WORKFLOW.md`
  - `WORKFLOW/02_CODEX_INTEGRATION.md`
  - `docs/exec-plans/README.md`
- Relevant code:
  - `public/index.html`
  - `public/about.html`
  - `public/contact.html`
  - `public/portfolio.html`
  - `public/js/main.js`
  - `public/js/about-parallax.js`
  - `public/js/contact.js`
  - `public/js/liquid-nav.js`
  - `portfolio_src/README.md`
  - `portfolio_src/INTEGRATION_GUIDE.md`
  - `portfolio_src/src/data/projectData.ts`
  - `portfolio_src/src/adapters/portfolioAdapter.ts`
- Related `.kiro/specs/` folder:
  - `.kiro/specs/landing-page-redesign/`
  - `.kiro/specs/portfolio-case-study-redesign/`
  - `.kiro/specs/dark-mode-implementation/`
  - `.kiro/specs/floating-header/`

## Acceptance Criteria

- [ ] A branch-safe migration path is defined before implementation starts
- [ ] The React app architecture is documented with clear source-of-truth boundaries
- [ ] Shared UI, theme, and navigation are planned as reusable React primitives
- [ ] Home, About, and Contact have explicit migration scopes and parity checks
- [ ] Portfolio migration includes a plan for subsections, case studies, and existing typed content
- [ ] Static hosting and route compatibility are planned before cutover
- [ ] Verification covers desktop, mobile, accessibility, motion, and regression checks
- [ ] Another agent can resume the migration from repo docs without chat history
