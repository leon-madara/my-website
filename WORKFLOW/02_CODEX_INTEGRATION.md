# 02 - Codex Integration and Context Precedence

This document keeps the repo workflow aligned with Codex so the two systems reinforce each other instead of colliding.

## Precedence Order

When instructions conflict, follow this order:

1. Codex platform, system, and developer instructions
2. The active user request
3. Workspace baseline at `C:\Users\Leon\DevMode\AGENTS.md`
4. Root `AGENTS.md`
5. `WORKFLOW/` docs
6. Active feature context in `docs/exec-plans/active/<feature-slug>/`
7. Supporting specs in `.kiro/specs/`
8. Lightweight hints in `.agent/` and older legacy docs

If you discover a lower-level document that conflicts with a higher-level source, obey the higher-level source and note the mismatch in the relevant handoff or decisions file.

## Responsibilities By Layer

### Codex Instructions

- Safety rules
- Tool usage rules
- Communication style
- Task classification discipline

### Root `AGENTS.md`

- Project overview
- Directory boundaries
- Required reading order
- Repo-specific non-negotiables

### Workspace `AGENTS.md`

- Shared workflow baseline across repos in `C:\Users\Leon\DevMode`
- Cross-repo consistency for classification, planning, and continuity
- Explicit deference to repo-local rules for project-specific behavior

### `WORKFLOW/`

- Operating model for planning, execution, and handoff
- How feature continuity is maintained
- How to use the repo context layers together

### `docs/exec-plans/`

- Session-to-session memory
- Progress tracking
- Decisions, blockers, handoff, and verification

### `.kiro/specs/`

- Requirements
- Design intent
- Task checklists for feature exploration

### `.agent/`

- Lightweight behavior hints for agent-capable tools
- Small tool- or environment-specific notes

## Rules To Avoid Collision

1. Do not duplicate the same decision in multiple places unless one file links to the canonical copy.
2. Put durable implementation history in `docs/exec-plans/`, not in `.agent/`.
3. Use `.kiro/specs/` for feature intent and design context, then link those specs from the execution-plan folder when relevant.
4. Keep `AGENTS.md` short; push detail into `docs/` and `WORKFLOW/`.
5. When a repo convention changes, update the canonical doc and let lower-level files point to it.
6. Keep the workspace-level `C:\Users\Leon\DevMode\AGENTS.md` generic; do not put repo-specific architecture or implementation details there.

## Branch Persistence

This repo also keeps a branch-neutral seed copy of the workflow docs under `.git/info/agent-workflow-bootstrap/`.

- Git hooks restore missing workflow files on checkout and merge.
- The sync is non-destructive: it creates missing files only and does not overwrite branch-specific tracked content.
- The working-tree copies remain the agent-facing source, while `.git/info/agent-workflow-bootstrap/` acts as a safety net across local branches.

## Recommended Read Order For Codex

1. `C:\Users\Leon\DevMode\AGENTS.md`
2. `AGENTS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/GOLDEN_PRINCIPLES.md`
5. `WORKFLOW/01_WORKFLOW.md`
6. Active feature folder, if one exists
7. Relevant `.kiro/specs/<feature>/` documents
8. Relevant code
