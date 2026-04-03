# Plan

## Phases

### Phase 0 - Isolation And Tracking

- [x] Confirm this is a dedicated About rebuild and not an in-place patch
- [x] Record the approved branch split to `codex/about-react-rebuild`
- [x] Create the dedicated execution-plan folder for this rebuild
- [x] Finalize the About feature boundary and replacement criteria

### Phase 1 - Source Mapping

- [x] Recheck the vanilla About page as the source of truth
- [x] Maintain a parity checklist for hero, sections, styling, and motion
- [x] Separate required static behavior from deferred motion behavior

### Phase 2 - Static Rebuild

- [x] Rebuild the page shell integration first
- [x] Rebuild the hero as static parity only
- [x] Rebuild the six content sections in order:
  - About Me
  - Skills & Technologies
  - Professional Experience
  - Education
  - Featured Projects
  - Certifications

### Phase 3 - Low-Risk Motion

- [x] Add section reveal behavior with opacity and transform only
- [x] Keep reduced-motion fallback behavior fully usable
- [x] Avoid shell animation ownership from inside the feature

### Phase 4 - Hero Motion

- [x] Add a simple hero entrance after static parity is stable
- [x] Keep hero motion local to the hero-owned nodes
- [x] Avoid layout-defining animated properties in the first motion pass

### Phase 5 - Advanced Motion

- [ ] Add optional ScrollTrigger effects only after the page is stable
- [ ] Reintroduce text effects or image randomization only if needed
- [ ] Remove any effect that reintroduces jitter

### Phase 6 - Replacement And Cleanup

- [ ] Replace the current About route only after validation passes
- [ ] Update durable docs with the final cutover state
- [ ] Retire obsolete About-only code paths after replacement

## Risks

- Risk: Reintroducing the full vanilla animation stack too early could recreate the jitter.
  Mitigation: Keep static parity separate from motion and gate each effect independently.

- Risk: Shared shell behavior could fight with route-local motion.
  Mitigation: Keep shell ownership outside the About feature and verify scroll behavior in-browser before adding any advanced motion.

- Risk: A broad rewrite could miss content or spacing details.
  Mitigation: Use a section-by-section parity checklist and validate after each milestone.

- Risk: Mobile hero composition can regress more easily than desktop because the vanilla layout compresses a large hero image, fixed controls, and a bottom nav into one viewport.
  Mitigation: Keep the mobile hero in a dedicated stacked composition and validate it separately from desktop.
