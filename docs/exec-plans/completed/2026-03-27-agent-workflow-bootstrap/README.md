# Agent Workflow Bootstrap

## Status

- State: Complete
- Owner: Codex
- Started: 2026-03-27
- Last Updated: 2026-03-27

## Goal

Adapt the shared engineering workflow for `my-website`, create a repo-native agent operating layer, make it work cleanly with Codex plus the existing `.kiro` and `.agent` folders, and ensure the guidance is available from both the workspace level and across local branch switches.

## Scope

- In scope:
  - Root agent entrypoint
  - Workspace-level baseline guide for `C:\Users\Leon\DevMode`
  - Repo workflow docs
  - Architecture and golden-principle docs
  - Execution-plan templates
  - Integration guidance for Codex, `.kiro`, and `.agent`
  - Branch-neutral workflow persistence under `.git/info`
- Out of scope:
  - Refactoring the site implementation itself
  - Converting the repo to a new framework or build system

## Context

- Shared workflow source: `C:\Users\Leon\DevMode\ENG WORKFLOW\`
- Reference patterns: `C:\Users\Leon\DevMode\design-compass\` and `C:\Users\Leon\DevMode\kossy-langat-website\`
- Existing repo context layers: `.agent/`, `.kiro/specs/`, legacy markdown docs, `public/PROJECT.md`

## Acceptance Criteria

- [x] Repo has a root `AGENTS.md` tailored to the actual project
- [x] Workspace has a global `AGENTS.md` baseline that defers to repo-local rules
- [x] Repo has a workflow folder adapted from the engineering workflow
- [x] Repo has a docs system of record for architecture, rules, and execution plans
- [x] Repo has clear guidance on how Codex, `.kiro`, and `.agent` should work together
- [x] Local branch switches have a non-destructive workflow restore path
