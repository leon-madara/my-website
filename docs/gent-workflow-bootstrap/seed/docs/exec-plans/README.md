# Execution Plans

Execution plans are the durable memory layer for medium ongoing work and all complex work.

## Structure

- `active/` - Feature folders currently in progress
- `completed/` - Archived feature folders with full history
- `_templates/feature-work/` - Starter files for new feature folders

## When To Create A Feature Folder

Create or update a feature folder when the work is:

- Complex
- Multi-session
- Cross-cutting
- Shared across multiple agents
- Likely to need a handoff

## Required Files

Each feature folder should contain:

- `README.md`
- `plan.md`
- `todo.md`
- `done.md`
- `decisions.md`
- `handoff.md`
- `verification.md`
- `assets-prompts.md` when asset generation is involved

## Naming

- Active work: `active/<feature-slug>/`
- Completed work: `completed/YYYY-MM-DD-<feature-slug>/`

## How To Start

1. Copy the files from `_templates/feature-work/`
2. Fill in the goal, scope, and current status
3. Update the folder after every meaningful session
