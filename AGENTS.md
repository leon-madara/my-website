# AGENTS.md - Leon Portfolio Agent Guide

This file adds repository-specific context for agents working in this project. Codex system and developer instructions remain authoritative for safety, tools, and higher-level behavior.

## Project Overview

**Name:** Leon Madara Portfolio  
**Stack:** Vanilla HTML, CSS, JavaScript, Jest/Vitest utilities, static hosting via `public/`  
**Description:** Personal portfolio site with marketing pages, portfolio case studies, and static deployment artifacts.

## Directory Structure

```text
my-website/
|- public/                 <- Production source of truth for deployed pages and assets
|  |- *.html               <- Entry pages: home, about, contact, portfolio, case-study pages
|  |- css/                 <- Site styles
|  |- js/                  <- Browser behavior and content loaders
|  |- portfolio_data/      <- Structured case-study content
|  |- MARKDOWN/            <- Long-form content fragments
|  `- portfolio_build/     <- Generated build output; do not hand-edit casually
|- tests/                  <- Automated JS and interaction checks
|- validation/             <- Browser-based manual validation pages
|- portfolio_src/          <- Typed adapter/prototype workspace, not the default deploy target
|- .kiro/specs/            <- Feature requirements, designs, and task breakdowns
|- .agent/rules/           <- Lightweight agent behavior hints
|- docs/                   <- System of record for architecture, rules, and execution plans
`- WORKFLOW/               <- Repo operating model for agents
```

## Read Before Making Changes

| Doc | Purpose |
|-----|---------|
| `docs/README.md` | Documentation index and context map |
| `docs/ARCHITECTURE.md` | Real source-of-truth boundaries and edit map |
| `docs/GOLDEN_PRINCIPLES.md` | Non-negotiable repo rules |
| `WORKFLOW/01_WORKFLOW.md` | How agents should operate here |
| `WORKFLOW/02_CODEX_INTEGRATION.md` | Instruction precedence and how Codex, `.kiro`, and `.agent` work together |
| `docs/exec-plans/active/` | In-progress feature continuity folders |
| `.kiro/specs/` | Existing feature specs that still matter for active work |

## Must Follow

1. Read the relevant docs before medium or complex changes.
2. Treat `public/` as the shipping source of truth unless the task explicitly targets `portfolio_src/`.
3. If a change touches both `public/` and `portfolio_src/`, document the sync strategy in an execution plan or handoff note.
4. Keep the site static-first. Do not introduce frameworks, build tooling, or generated-asset edits unless the task explicitly requires it.
5. For multi-session or cross-cutting work, create or update a feature folder in `docs/exec-plans/active/<feature-slug>/`.
6. Update docs when architecture, workflow, or source-of-truth boundaries change.
7. Run the smallest relevant verification before finishing. Start with `npm run test:gsap` or the targeted validation page and expand only as needed.
8. If the proposed work is a major change, redesign, or overhaul of an existing system, checkpoint the current branch state before implementation. Commit the existing changes on the current branch first, then create a new `codex/<feature-slug>` branch for the overhaul work.
9. Before creating that new branch, prompt the user with the proposed branch name and wait for approval so the branch split is explicit and intentional.

## Anti-Patterns

- Do not hand-edit `public/portfolio_build/assets/*` unless the task is specifically about generated output.
- Do not store important decisions only in chat when they need to survive across sessions.
- Do not move source-of-truth responsibilities between `public/`, `portfolio_src/`, `.kiro`, and `docs/` without documenting the new boundary.

## How To Get Context

1. Start here.
2. Read `docs/ARCHITECTURE.md` and `docs/GOLDEN_PRINCIPLES.md`.
3. Read `WORKFLOW/01_WORKFLOW.md`.
4. Read any active execution-plan folder for the feature.
5. Pull supporting feature intent from `.kiro/specs/<feature>/` or legacy docs such as `public/PROJECT.md`, `implementation_features.md`, `layout-design.md`, and `content-data.md`.
