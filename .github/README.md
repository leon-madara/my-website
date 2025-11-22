# GitHub Configuration

This directory contains GitHub-specific configurations for automation and workflows.

## 📁 Structure

```
.github/
├── workflows/
│   └── auto-merge-to-main-fusion.yml    # Primary: Auto-merge GitHub Action
├── scripts/
│   ├── merge-to-main-fusion.sh          # Core: Merge logic (called by both)
│   └── manual-merge.sh                  # Fallback: Manual merge script
├── docs/
│   ├── MAIN-FUSION-AUTOMATION.md        # Full documentation
│   └── QUICK-START.md                   # Quick setup guide
└── README.md                            # This file
```

## 🎯 Purpose

**MAIN-FUSION Automation System** - Automatically merges Claude Code cloud pushes into a unified staging branch.

### What It Does

1. ✅ Detects pushes to `claude/*` branches (automatic via GitHub Actions)
2. ✅ Merges to `MAIN-FUSION` branch (automatic)
3. ✅ Creates documentation PRs (automatic)
4. ✅ Deletes merged branches (automatic)
5. 🚨 Alerts on conflicts (creates issues for manual resolution)

## 🚀 Getting Started

### Quick Setup (3 steps)

1. **Enable GitHub Actions permissions**
   - Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"
   - Enable "Allow GitHub Actions to create and approve pull requests"

2. **Push to main branch**
   ```bash
   git push origin main
   ```

3. **Done!** Automation is now active ✨

### Usage

- **Normal:** Just use Claude Code - automation handles everything
- **Manual:** Run `.github/scripts/manual-merge.sh` if needed
- **Monitor:** Check Actions tab for workflow runs

## 📚 Documentation

- **Quick Start:** [docs/QUICK-START.md](docs/QUICK-START.md) - Fast setup & usage guide
- **Full Docs:** [docs/MAIN-FUSION-AUTOMATION.md](docs/MAIN-FUSION-AUTOMATION.md) - Complete reference

## 🔧 Components

### GitHub Actions Workflow

**File:** `workflows/auto-merge-to-main-fusion.yml`

**Trigger:** Push to any `claude/*` branch

**Features:**
- Automatic execution
- Conflict detection
- PR & issue creation
- Branch cleanup
- Concurrency control (queues multiple merges safely)

### Merge Scripts

**Core Script:** `scripts/merge-to-main-fusion.sh`
- Main merge logic
- Creates MAIN-FUSION if needed
- Generates detailed reports
- Handles success and conflict cases

**Manual Script:** `scripts/manual-merge.sh`
- Interactive CLI tool
- Fallback if Actions fail
- Same merge logic as automated version

## 📊 Monitoring

| Aspect | Location | Info |
|--------|----------|------|
| **Workflow runs** | Actions tab | See automation execution |
| **Successful merges** | Pull Requests | PRs with `auto-merge` label |
| **Conflicts** | Issues | Issues with `merge-conflict` label |
| **Branch state** | Branches | Check `MAIN-FUSION` branch |

## 🆘 Troubleshooting

**Workflow not running?**
- Ensure files are in `main` branch (workflows only run from default branch)
- Check Actions are enabled in repository settings

**Permission errors?**
- Verify workflow permissions (see Setup step 1)

**Need to pause automation?**
- Actions tab → "Auto-Merge to MAIN-FUSION" → "..." → "Disable workflow"

## 🔄 Workflow Diagram

```
Claude Code (Cloud)
        ↓
    Pushes to claude/*
        ↓
    GitHub Actions (Auto)
        ↓
    ┌───────┴───────┐
    │               │
Success         Conflict
    │               │
    ↓               ↓
Merge to      Create Issue
MAIN-FUSION   Keep Branch
    │               │
Create PR     Wait for Manual
    │          Resolution
Delete Branch      │
    ↓               ↓
  DONE          Manual Merge
```

## 🤝 Contributing

To modify the automation:

1. Edit files in `.github/`
2. Test locally with manual script
3. Commit to main branch
4. Changes take effect immediately

## 📝 Version

**Version:** 1.0
**Created:** 2025-11-22
**Purpose:** Streamline Claude Code cloud workflow

---

For questions or issues, see the full documentation or create a GitHub issue.
