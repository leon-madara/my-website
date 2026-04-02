# Plan

## Phases

### Phase 1

- [x] Capture branch-safe context and create durable feature records
- [x] Replace the component markup, styling, and JS state model with a ground-up rebuild

### Phase 2

- [x] Add focused Jest coverage for hydration, theme switching, and hover-preview state
- [ ] Manually verify home and contact behavior, then update feature records with outcomes

## Risks

- Risk: The rebuilt component could break pages that rely on the existing `body.dark-theme` contract.
  Mitigation: Preserve `localStorage('theme')`, host `data-theme`, `body.dark-theme`, and the `theme-changed` event exactly.

- Risk: Hover preview and click-transition states could conflict and leave the thumb or celestial actors stuck.
  Mitigation: Use explicit component state attributes and clear transition cleanup timers in JS.
