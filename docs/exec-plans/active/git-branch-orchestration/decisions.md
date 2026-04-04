# Decisions

## Accepted

### 2026-04-03 - Treat this as branch orchestration, not passive monitoring

- Decision:
  - Model the workflow as a gatekeeper that runs before implementation and again before push or merge.
- Why:
  - Codex skills and agents operate on demand, not as a persistent background watcher.
  - The high-value behavior is selecting the right branch and recommending the right promotion target.

### 2026-04-03 - Split responsibilities across policy, inspection, and execution

- Decision:
  - Plan for three layers:
    - a `git-branch-orchestrator` skill for rules and workflow,
    - a future helper script for deterministic branch-state inspection,
    - worker agents that only make changes after branch approval.
- Why:
  - Skill-only guidance is not strong enough for repeated Git decisions.
  - Script-only enforcement would miss the repo-specific reasoning and approval language.

### 2026-04-03 - Use the repo execution-plan system as durable branch context

- Decision:
  - Store branch intent in the repo's existing `docs/exec-plans/` structure rather than inventing a parallel tracking system.
- Why:
  - The repo already treats execution plans as the durable memory layer for ongoing work.
  - This keeps branch reasoning resumable across sessions and agents.

### 2026-04-03 - Require approval before branch switch and before push or merge

- Decision:
  - The orchestrator may inspect and recommend autonomously, but branch-changing and remote-affecting actions require user approval.
- Why:
  - This preserves safety while still allowing agents to do the branch analysis work.
  - It matches the user's stated expectation for explicit consent before switching and promotion actions.

### 2026-04-03 - Use `docs/git/branch-registry.json` as the canonical repo-wide branch tree

- Decision:
  - Store the managed branch hierarchy in `docs/git/branch-registry.json`.
- Why:
  - JSON is straightforward for the helper script to parse.
  - The path is easy to discover from the repo docs and workflow files.

### 2026-04-03 - Use `branch-context.json` inside active feature folders for local branch metadata

- Decision:
  - Store per-feature branch metadata in `docs/exec-plans/active/<feature-slug>/branch-context.json` when that folder exists on the current branch.
- Why:
  - A machine-readable file is more reliable than scraping Markdown.
  - It keeps feature-local branch state close to the feature handoff docs.

### 2026-04-03 - Implement v1 as a skill plus helper script

- Decision:
  - Ship the first pass as both:
    - `scripts/git-branch-orchestrator.js`
    - `C:/Users/Leon/.codex/skills/git-branch-orchestrator`
- Why:
  - The script gives deterministic inspection and recommendation output.
  - The skill gives reusable workflow rules and approval behavior for Codex.

## Open

### Registry maintenance model

- Options under consideration:
  - Keep `docs/git/branch-registry.json` hand-maintained
  - Generate the registry from feature metadata later

### Future enforcement

- Options under consideration:
  - skill plus helper script only
  - skill plus helper script plus optional hooks in a later phase
