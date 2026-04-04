# Plan

## Phases

### Phase 1 - Define the workflow contract

- [x] Confirm the problem is branch selection and promotion safety, not generic Git monitoring
- [x] Draft the v1 specification for branch hierarchy, approvals, and refusal rules
- [x] Capture the design in a durable execution-plan folder

### Phase 2 - Choose the implementation shape

- [x] Decide whether v1 should be skill-only guidance or skill plus helper script
- [x] Confirm the canonical location for the future branch registry
- [x] Confirm the per-feature metadata fields that active execution-plan folders must carry

### Phase 3 - Build the workflow tooling

- [x] Create the `git-branch-orchestrator` skill
- [x] Add a helper script to inspect branch ancestry, upstream state, and allowed promotion targets
- [x] Define the pre-flight and post-task invocation flow for agents

### Phase 4 - Validate the workflow on real feature branches

- [x] Test branch selection against at least two active feature branches
- [x] Test refusal behavior for ambiguous or unsafe push or merge attempts
- [ ] Refine the skill and script based on real usage

## Risks

- Risk: The system becomes too clever and starts guessing branch intent without enough evidence.
  Mitigation: Require explicit approval for branch switch, branch creation, push, and merge actions, and stop on ambiguity.
- Risk: Branch truth gets duplicated across docs and Git output and drifts over time.
  Mitigation: Keep one future global registry plus one local feature-context section, and define which one is canonical.
- Risk: The workflow adds too much friction for simple changes.
  Mitigation: Keep v1 focused on branch choice and promotion checks only, with minimal metadata and clear stop conditions.
