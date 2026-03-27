# Plan

## Phases

### Phase 1 - Discovery

- [x] Read the shared engineering workflow
- [x] Read a reference repo to understand how `AGENTS.md` steers execution
- [x] Audit the current `my-website` structure and existing context layers

### Phase 2 - Design

- [x] Define the precedence order between Codex, repo docs, `.kiro`, and `.agent`
- [x] Define the minimal durable documentation structure for this repo

### Phase 3 - Implementation

- [x] Add root `AGENTS.md`
- [x] Add `WORKFLOW/` docs
- [x] Add `docs/` architecture and rules docs
- [x] Add execution-plan templates and archive this bootstrap record

## Risks

- Risk: Creating overlapping instruction systems
  Mitigation: Make precedence explicit and keep each layer's responsibility narrow

- Risk: Describing the repo inaccurately
  Mitigation: Base the docs on the current `public/`, `tests/`, `.agent/`, `.kiro/`, and legacy markdown structure
