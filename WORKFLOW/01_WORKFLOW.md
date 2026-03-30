# 01 - Leon Portfolio Workflow

This repository follows the shared engineering workflow, adapted for a static, vanilla portfolio codebase with long-lived agent context.

## Philosophy

- Humans steer with goals, acceptance criteria, and review.
- Agents execute by reading repo instructions, updating durable context, and making the smallest correct change.
- Important knowledge must live in the repo, not only in chat.

## Core Loop

1. Classify the task as `Simple`, `Medium`, or `Complex`.
2. Read only the required context for that class.
3. For medium and complex work, write or update a short plan before major edits.
4. Implement the change in the correct source-of-truth area.
5. Run targeted verification.
6. Update docs and execution-plan files before ending the session.

## Task Classes

### Simple

- Single-file or tightly bounded task
- Low risk and minimal discovery
- Read only the immediately relevant files unless risk increases

### Medium

- Bounded multi-file work
- Shared UI, routing, docs, or logic changes
- Read `AGENTS.md` and any directly relevant docs before editing
- Maintain a short explicit plan

### Complex

- New feature, cross-cutting refactor, architecture change, or multi-session effort
- Read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/GOLDEN_PRINCIPLES.md`, this workflow doc, and the relevant feature folder before implementation
- Create or update a feature folder in `docs/exec-plans/active/<feature-slug>/`
- If the work is a major redesign or overhaul of an existing system, checkpoint the current branch first, then continue the overhaul on a new approved `codex/<feature-slug>` branch instead of the current branch

## Source-of-Truth Rules

- `public/` is the default deployable product surface.
- `portfolio_src/` is supporting typed or prototype work unless the task explicitly redefines that boundary.
- `.kiro/specs/` stores requirement/design/task artifacts, not the final implementation history.
- `docs/exec-plans/` stores durable execution memory and handoff state.

## Feature Continuity

Use a feature folder for:

- Complex tasks
- Medium tasks that are part of an ongoing feature
- Any work likely to continue across sessions or agents

Required files:

- `README.md`
- `plan.md`
- `todo.md`
- `done.md`
- `decisions.md`
- `handoff.md`
- `verification.md`
- `assets-prompts.md` when asset generation is involved

Resume order:

1. `README.md`
2. `plan.md`
3. `todo.md`
4. `done.md`
5. `decisions.md`
6. `handoff.md`
7. `verification.md`
8. `assets-prompts.md`

## Verification Expectations

- Start with the smallest relevant check.
- Prefer existing test commands before inventing new ones.
- For UI changes, use the existing validation pages or focused browser checks.
- Record what was verified and what was not.

## Session Close

Before ending work on a feature, update:

- `todo.md`
- `done.md`
- `decisions.md`
- `handoff.md`
- `verification.md`

When feature work is complete, move the folder to `docs/exec-plans/completed/` and leave a clear summary for the next agent.

## Branching Rule For Major Overhauls

- Use this rule when the proposed change is a major redesign, large UI refresh, architecture shift, or another overhaul that would make the current branch hard to review incrementally.
- Before starting implementation, prepare a checkpoint commit for the current branch state.
- Propose a new `codex/<feature-slug>` branch name to the user and wait for approval before creating it.
- After approval, create the new branch from the checkpointed state and do the overhaul work there.
- Do not silently branch-split major work without telling the user first.
