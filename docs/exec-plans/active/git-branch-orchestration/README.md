# Git Branch Orchestration

## Status

- State: In Progress
- Owner: Codex + Leon
- Started: 2026-04-03
- Last Updated: 2026-04-03

## Goal

Define a first-pass workflow system that helps agents choose the correct working branch before implementation, preserve feature separation while work is in progress, and recommend the correct push or merge target after work is complete.

## Scope

- In scope:
  - A v1 specification for hierarchical branch orchestration
  - A repo-wide managed branch registry at `docs/git/branch-registry.json`
  - Per-feature branch metadata files at `docs/exec-plans/active/<feature-slug>/branch-context.json`
  - A helper CLI for branch inspection and recommendation
  - A Codex skill scaffold for repeatable branch-orchestration behavior
  - Agent responsibilities before branch switch and before push or merge
  - Durable branch metadata expectations for feature folders and a future global registry
  - Approval gates and refusal conditions for risky Git actions
  - A rollout plan for turning the spec into a skill plus supporting scripts
- Out of scope:
  - Enforcing the workflow with hooks or CI in this session
  - Changing existing feature branches or merge strategy yet

## Context

- Relevant docs:
  - `AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/git/README.md`
  - `docs/git/branch-registry.json`
  - `docs/GOLDEN_PRINCIPLES.md`
  - `WORKFLOW/01_WORKFLOW.md`
  - `WORKFLOW/02_CODEX_INTEGRATION.md`
  - `docs/exec-plans/README.md`
- Relevant code:
  - `scripts/git-branch-orchestrator.js`
- Related `.kiro/specs/` folder:
  - None currently
- Related workflow context:
  - `docs/exec-plans/active/react-overhaul/README.md`
  - `docs/exec-plans/active/about-react-rebuild/README.md`
  - `docs/exec-plans/active/react-contact-rebuild/README.md`

## Acceptance Criteria

- [x] A dedicated execution-plan folder exists for this workflow feature
- [x] A v1 specification defines the branch hierarchy model and agent responsibilities
- [x] The spec defines entry and exit orchestration flows with explicit approval points
- [x] The spec defines refusal conditions for ambiguous or risky branch actions
- [x] The v1 metadata schema and registry location are implemented
- [x] V1 ships as a skill plus helper script, not skill-only
- [x] The implementation phase is planned well enough for another agent to start without chat history
