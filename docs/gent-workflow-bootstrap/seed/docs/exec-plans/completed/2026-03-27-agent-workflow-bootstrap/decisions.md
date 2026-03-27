# Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-03-27 | Use `WORKFLOW/` plus root `AGENTS.md` as the primary operating layer | This mirrors the strongest reference pattern and gives agents a clear repo entrypoint |
| 2026-03-27 | Keep `public/` as the documented production source of truth | The current scripts and file layout ship directly from `public/` |
| 2026-03-27 | Keep `.kiro/specs/` as requirement/design support rather than replacing it | The repo already has feature specs there and future agents can still benefit from them |
| 2026-03-27 | Keep `.agent/` lightweight and move durable workflow memory into `docs/exec-plans/` | This prevents three competing long-term memory systems |
