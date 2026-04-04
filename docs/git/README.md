# Git Branch Orchestration

This folder stores the repo-wide branch hierarchy used by the v1 branch orchestration workflow.

## Files

- `branch-registry.json`
  - Canonical repo-wide map of managed branches, parents, default promotion targets, and feature scope hints

## How It Works

The branch orchestration helper reads:

1. `docs/git/branch-registry.json`
2. `docs/exec-plans/active/*/branch-context.json` when present

The registry is the whole-repo tree view.

Per-feature `branch-context.json` files are the local detail view for active feature folders that exist on the current branch.

## V1 Rules

- `main` is the root branch
- each managed branch has one parent branch
- promotion defaults to the parent branch
- branch switch, branch creation, push, and merge actions require user approval
- the helper stops on ambiguity instead of guessing
