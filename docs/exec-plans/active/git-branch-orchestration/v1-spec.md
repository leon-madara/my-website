# Git Branch Orchestration V1 Specification

## 1. Purpose

Define a safe, repeatable workflow that helps an agent:

1. determine the correct branch before starting work,
2. avoid mixing unrelated features across branches,
3. recommend the correct push or merge target after work is complete,
4. stop and ask for approval before any risky Git action.

V1 is intentionally narrow. It is not a full Git automation framework. It is a branch-choice and branch-promotion gatekeeper.

## 2. Problem Statement

The repo can have multiple active branches derived from `main`, with additional child branches derived from those feature branches. Without a shared orchestration layer, an agent can:

- start work on the wrong branch,
- mix unrelated page work in one branch,
- push to the wrong remote branch,
- merge into the wrong parent branch,
- increase conflict risk and create review confusion.

V1 addresses those failure modes by making branch intent explicit and reviewable.

## 3. Design Principles

1. Prefer explicit branch intent over inference.
2. Preserve separation of concerns between features.
3. Require user approval before branch-changing or remote-affecting actions.
4. Stop on ambiguity instead of guessing.
5. Keep durable branch context in the repo, not only in chat.
6. Keep V1 small enough to adopt before adding hooks, CI, or deeper automation.

## 4. System Components

V1 is designed around three cooperating parts.

### 4.1 Skill Layer

Name:
- `git-branch-orchestrator`

Responsibility:
- read the repo workflow rules,
- inspect the task request and feature context,
- invoke the helper script or Git inspection commands,
- explain the recommended branch action in clear language,
- enforce the approval checkpoints in the agent workflow.

### 4.2 Inspection Layer

Initial form:
- a helper script or deterministic command flow

Responsibility:
- inspect the current branch,
- inspect upstream and divergence state,
- inspect branch ancestry where available,
- read the future branch registry,
- read feature-folder branch metadata,
- produce allowed and blocked next actions.

This layer does not switch, push, or merge by itself. It reports state and allowed targets.

### 4.3 Execution Layer

Responsibility:
- perform the approved action:
  - switch branch,
  - create branch,
  - push branch,
  - merge branch,
  - or continue work on the current branch.

This layer is allowed to act only after the orchestrator presents the recommendation and the user approves.

## 5. Branch Model

V1 assumes a tree, not an arbitrary graph.

Rules:

- `main` is the root branch.
- Every managed branch has exactly one parent branch.
- Every managed branch maps to exactly one feature slug.
- A feature branch may have child branches for sub-features or isolated rebuild work.
- The default merge or promotion target for a branch is its parent branch.
- Promotion to a non-parent branch is blocked unless the user explicitly overrides it.

Example tree:

```text
main
└── codex/react-overhaul
    ├── codex/about-react-rebuild
    └── codex/react-contact-rebuild
```

In this model:

- About work belongs on `codex/about-react-rebuild`
- Contact work belongs on `codex/react-contact-rebuild`
- Neither branch should merge into the other
- Both normally promote into `codex/react-overhaul`
- `codex/react-overhaul` later promotes into `main`

## 6. Canonical Data Sources

V1 will use two durable data sources.

### 6.1 Local Feature Context

Each active feature folder should carry a branch metadata block describing:

- feature slug,
- branch name,
- parent branch,
- allowed promotion target,
- current state,
- notes on special handling if needed.

This gives each feature self-contained branch memory.

### 6.2 Global Branch Registry

V1 also plans for one repo-wide registry containing branch relationships and status for the whole tree.

Suggested candidate paths:

- `docs/git/branch-registry.json`
- `docs/git/branch-registry.yaml`

The registry should eventually be the canonical whole-repo tree view. Feature folders remain the local detail view.

## 7. Proposed Metadata Schema

V1 should keep the schema small.

### 7.1 Per-Feature Metadata

Suggested fields:

```yaml
feature_slug: react-contact-rebuild
branch: codex/react-contact-rebuild
parent_branch: codex/react-overhaul
default_promotion_target: codex/react-overhaul
status: active
scope_hint:
  - contact page
  - contact route
  - contact form
```

### 7.2 Global Registry Entry

Suggested fields:

```json
{
  "branch": "codex/react-contact-rebuild",
  "feature_slug": "react-contact-rebuild",
  "parent_branch": "codex/react-overhaul",
  "children": [],
  "default_promotion_target": "codex/react-overhaul",
  "status": "active",
  "scope_hint": ["contact page", "contact route", "contact form"]
}
```

V1 should avoid more fields unless a real use case requires them.

## 8. Entry Orchestration Flow

This flow runs before implementation begins.

### 8.1 Inputs

- user request,
- current branch,
- working tree state,
- branch registry,
- active feature-folder metadata,
- optional changed-file hints if continuing prior work.

### 8.2 Steps

1. Classify the task.
2. Infer the likely feature slug from the user request and the repo context.
3. Inspect the current branch and local worktree state.
4. Match the task to a managed branch using:
   - explicit feature folder metadata first,
   - global registry second,
   - branch ancestry and naming as supporting evidence only.
5. Produce one recommendation:
   - stay on current branch,
   - switch to an existing branch,
   - create a new child branch,
   - or stop because the target is ambiguous.
6. Present the recommendation to the user with:
   - target branch,
   - parent branch,
   - reason for the match,
   - blocked alternatives if relevant.
7. Wait for approval before switching or creating the branch.
8. After approval, perform the action and continue with implementation.

### 8.3 Required Approval Checkpoint

Approval is required before:

- switching to another branch,
- creating a new branch,
- moving work that may mix with unrelated uncommitted changes.

## 9. Exit Orchestration Flow

This flow runs after implementation or before any promotion action.

### 9.1 Inputs

- branch where work was completed,
- changed files,
- branch ancestry,
- branch registry,
- feature-folder metadata,
- upstream and divergence state.

### 9.2 Steps

1. Inspect the branch where the work was completed.
2. Confirm that the branch still matches the intended feature scope.
3. Determine the default next target:
   - push to the matching remote branch,
   - merge into the parent branch,
   - or hold locally if the work is not ready.
4. Detect blocked targets, including sibling branches and unrelated feature branches.
5. Present the recommendation to the user with:
   - current branch,
   - default promotion target,
   - why that target is valid,
   - what targets are blocked.
6. Wait for approval before push or merge.
7. After approval, perform the action or hand off to the execution agent that will.

### 9.3 Required Approval Checkpoint

Approval is required before:

- pushing to a remote,
- merging into any branch,
- rebasing onto another branch,
- promoting to a non-parent branch.

## 10. Refusal Conditions

The orchestrator must stop and refuse to proceed when any of the following is true:

- the task maps equally well to more than one branch,
- the working tree contains unrelated uncommitted changes that would be mixed by switching,
- the branch registry and feature-folder metadata disagree,
- the requested merge target is a sibling branch with no explicit override,
- the branch has no known parent and no approved default promotion path,
- the current branch is detached,
- the branch is behind its parent in a way that makes safe promotion unclear,
- the user request conflicts with the documented branch ownership.

When refusing, the orchestrator should explain:

- what evidence conflicted,
- what action is blocked,
- what clarification or cleanup is needed.

## 11. Allowed Autonomy

The orchestrator may do these autonomously:

- inspect branch status,
- inspect branch ancestry and divergence,
- read registry and feature metadata,
- recommend a branch or target,
- warn about conflicts or ambiguity.

The orchestrator may not do these autonomously:

- switch branches,
- create branches,
- push,
- merge,
- rebase,
- force-push,
- delete branches.

Those actions require explicit user approval in V1.

## 12. Role Separation

V1 should keep the roles clear.

### Orchestrator Agent

- Runs before implementation and before promotion
- Produces the branch recommendation
- Enforces the approval checkpoints

### Worker Agent

- Makes code or docs changes only on the approved branch
- Does not independently choose another branch mid-task

### Review or Promotion Agent

- Re-checks the branch relationship after the worker finishes
- Recommends the correct push or merge target

The same top-level agent may play all three roles in sequence, but the workflow should still treat them as separate stages.

## 13. V1 Non-Goals

V1 will not:

- infer complex multi-parent merge strategies,
- manage long-running background monitoring,
- rewrite branch history automatically,
- resolve merge conflicts automatically,
- enforce policy with server-side Git controls,
- replace human review for integration decisions.

## 14. Recommended Rollout

### Step 1

Lock the spec and choose the registry format and path.

### Step 2

Create the `git-branch-orchestrator` skill with:

- the decision rules,
- the approval wording,
- the stop conditions,
- the metadata lookup order.

### Step 3

Create the helper script for:

- current branch detection,
- worktree cleanliness checks,
- ancestry and divergence checks,
- allowed promotion-target calculation.

### Step 4

Add the metadata block to active feature folders.

### Step 5

Trial the flow on existing feature branches before any broader rollout.

## 15. Open Questions

1. Should the global registry be hand-maintained or generated from per-feature metadata?
2. Should `main` always be the root, or should the system support another stable integration branch?
3. Should simple doc-only changes still go through the same approval gates when they stay on the current branch?
4. Should the helper script block on a dirty tree, or only warn when the dirty files are outside the target feature scope?

## 16. Recommended Default Answers For V1

If no stronger requirement emerges, use these defaults:

- Keep `main` as the root branch.
- Use one parent branch per managed branch.
- Default promotion goes to the parent branch only.
- Stop on ambiguity.
- Require approval for switch, create, push, and merge actions.
- Start with a skill plus helper script, not hooks.
