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

## Open

### Registry location

- Options under consideration:
  - `docs/git/branch-registry.json`
  - `docs/git/branch-registry.yaml`
  - A branch section embedded only in each active feature folder plus a generated registry later

### Enforcement shape

- Options under consideration:
  - skill-only v1
  - skill plus helper script v1
  - skill plus helper script plus optional hooks in a later phase
