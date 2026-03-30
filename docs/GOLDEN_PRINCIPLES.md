# Golden Principles

## 1. Preserve the Static-First Model

This project ships as a static site. Do not add framework or build-system complexity unless the task explicitly requires it and the change is documented.

## 2. `public/` Is the Default Production Surface

When in doubt, implement shipped behavior in `public/`. Treat other workspaces as supporting layers unless the task clearly redefines the boundary.

## 3. One Canonical Place For Durable Decisions

Use `docs/exec-plans/` for decisions, blockers, progress, and handoff state. Do not leave important implementation history only in chat, `.agent/`, or scattered notes.

## 4. Keep `.kiro` As Intent, Not As Runtime Truth

Use `.kiro/specs/` for requirements, design thinking, and task breakdowns. Mirror accepted implementation decisions into execution-plan files when work is active.

## 5. Do Not Hand-Edit Generated Assets Casually

Avoid direct edits inside `public/portfolio_build/assets/` unless the task specifically targets generated output and the change path is documented.

## 6. Accessibility and Responsiveness Are Baseline Requirements

Preserve semantic HTML, keyboard reachability, readable contrast, touch-friendly interactions, and reduced-motion support where applicable.

## 7. Prefer Small, Verifiable Changes

Start with the smallest safe change, then run the smallest meaningful verification before expanding scope.

## 8. Document Boundary Changes

If the role of `public/`, `portfolio_src/`, `tests/`, `validation/`, `.agent/`, or `.kiro/` changes, update `docs/ARCHITECTURE.md`, relevant workflow docs, and the active execution plan.

## 9. Respect Existing Work

This repo may be mid-flight. Work with the current state instead of flattening or reverting parallel edits that are unrelated to your task.
