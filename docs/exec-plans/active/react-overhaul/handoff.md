# Handoff

## Next Recommended Step

Ask the user to approve the branch split for the overhaul work and propose `codex/react-overhaul` as the branch name. After approval, create the checkpoint commit on the current branch, create the new branch, and scaffold the React app in a parallel authoring surface without replacing the current `public/` pages yet.

## Notes

- Relevant files:
  - `AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `WORKFLOW/01_WORKFLOW.md`
  - `public/index.html`
  - `public/about.html`
  - `public/contact.html`
  - `public/portfolio.html`
  - `portfolio_src/README.md`
  - `portfolio_src/src/data/projectData.ts`
  - `portfolio_src/src/adapters/portfolioAdapter.ts`
- Known risks:
  - Dirty working tree on the current branch
  - Existing mixed portfolio architecture
  - Route handling and static-hosting cutover complexity
