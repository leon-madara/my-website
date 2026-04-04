# Todo

- [ ] Run the helper against more real branch scenarios after the first commit
- [ ] Decide whether the registry should stay hand-maintained or be generated from feature metadata
- [ ] Add branch-context files to active feature folders that are not tracked on this branch when they become available here
- [ ] Consider whether to add a lightweight npm script alias for the helper
- [ ] Decide whether hooks or CI should enforce parts of this workflow later

## Blockers

- No immediate blocker for the v1 draft implementation
- Cross-branch feature folders such as `about-react-rebuild` are not present on this branch, so the registry currently carries their relationship without a local `branch-context.json` file here
