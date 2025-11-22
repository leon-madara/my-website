# GitHub Configuration

This directory contains GitHub-specific configurations for automation and workflows.

## 📁 Structure

```
.github/
├── workflows/
│   └── auto-merge-to-main-fusion.yml    # Primary: Auto-merge GitHub Action
├── scripts/
│   ├── merge-to-main-fusion.sh          # Core: Merge logic (called by both)
│   ├── manual-merge.sh                  # Fallback: Manual merge script
│   ├── local-sync-main-fusion.ps1       # Local: Auto-pull from MAIN-FUSION
│   └── setup-local-sync.ps1             # Local: Setup Task Scheduler
├── docs/
│   ├── MAIN-FUSION-AUTOMATION.md        # Full automation documentation
│   ├── QUICK-START.md                   # Quick setup guide
│   ├── LOCAL-SYNC-GUIDE.md              # Local sync complete guide
│   └── SYNC-QUICK-REFERENCE.md          # Quick reference card
├── logs/
│   └── sync.log                         # Local sync activity log
└── README.md                            # This file
```

## 🎯 Purpose

Automates the workflow for Claude Code cloud sessions by:
- **Remote**: Automatically merging `claude/*` branches into `MAIN-FUSION`
- **Local**: Automatically pulling `MAIN-FUSION` updates to your machine
- Creating documentation PRs for each merge
- Cleaning up merged branches
- Handling conflicts with GitHub Issues
- Keeping your local environment synchronized

## 🚀 Quick Start

### Remote Automation (GitHub Actions)

**One-time setup:**
1. Enable GitHub Actions permissions (Settings → Actions → General)
2. Merge automation files to `main` branch
3. Done! Automation runs automatically

**See:** `.github/docs/QUICK-START.md`

### Local Synchronization (Your Machine)

**One-time setup:**
```powershell
# Install automatic sync (runs every 30 minutes)
.\.github\scripts\setup-local-sync.ps1 -Install
```

**Daily usage:**
```powershell
# Check for updates now
.\.github\scripts\local-sync-main-fusion.ps1 -Once

# Check status
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

**See:** `.github/docs/LOCAL-SYNC-GUIDE.md`

## 📊 Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    End-to-End Workflow                       │
└─────────────────────────────────────────────────────────────┘

1. Claude Code (cloud) pushes to: claude/feature-xyz-abc123
                    ↓
2. GitHub Actions detects push (AUTOMATIC - REMOTE)
                    ↓
3. Merges to MAIN-FUSION on GitHub (AUTOMATIC - REMOTE)
                    ↓
4. Task Scheduler detects update (AUTOMATIC - LOCAL)
                    ↓
5. Pulls to your local MAIN-FUSION (AUTOMATIC - LOCAL)
                    ↓
6. Desktop notification sent (LOCAL)
                    ↓
7. You continue working with latest code (LOCAL)
```

## 🔧 Components

### Remote Automation (GitHub)

| Component | Purpose | Trigger |
|-----------|---------|---------|
| `auto-merge-to-main-fusion.yml` | GitHub Actions workflow | Push to `claude/*` |
| `merge-to-main-fusion.sh` | Core merge logic | Called by workflow |
| `manual-merge.sh` | Manual fallback | User runs manually |

### Local Automation (Your Machine)

| Component | Purpose | Trigger |
|-----------|---------|---------|
| `local-sync-main-fusion.ps1` | Sync script | Task Scheduler / Manual |
| `setup-local-sync.ps1` | Setup Task Scheduler | User runs once |

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `QUICK-START.md` | 5-minute setup guide | First-time setup |
| `MAIN-FUSION-AUTOMATION.md` | Complete remote automation docs | Reference |
| `LOCAL-SYNC-GUIDE.md` | Complete local sync docs | Daily use |
| `SYNC-QUICK-REFERENCE.md` | Command cheat sheet | Quick lookup |

## 🎯 Key Features

### Remote (GitHub Actions)
✅ Auto-merge `claude/*` → `MAIN-FUSION`  
✅ Conflict detection with GitHub Issues  
✅ Auto-delete merged branches  
✅ Documentation PRs for each merge  
✅ Concurrency control  

### Local (Your Machine)
✅ Auto-pull every 30 minutes  
✅ Uncommitted changes protection  
✅ Automatic backup branches  
✅ Desktop notifications  
✅ Terminal messages  
✅ Activity logging  
✅ Manual on-demand sync  

## 🔔 Notifications

### Remote
- GitHub Issues for conflicts
- Pull Requests for successful merges

### Local
- Windows desktop notifications
- Color-coded terminal messages
- Activity logs in `.github/logs/sync.log`

## 🆘 Quick Help

### Remote Issues

**Merge conflicts:**
- Check GitHub Issues tab for `merge-conflict` label
- Follow instructions in the issue

**Workflow not running:**
- Check Actions tab in GitHub
- Verify workflow file is in `main` branch
- Check GitHub Actions permissions

### Local Issues

**Sync not working:**
```powershell
.\.github\scripts\setup-local-sync.ps1 -Test
```

**Uncommitted changes:**
```powershell
# Script creates backup automatically
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**View logs:**
```powershell
Get-Content .github\logs\sync.log -Tail 50
```

## 📖 Getting Started

### For Remote Automation
1. Read: `.github/docs/QUICK-START.md`
2. Enable GitHub Actions permissions
3. Merge to `main` branch
4. Test with a `claude/*` branch

### For Local Sync
1. Read: `.github/docs/SYNC-QUICK-REFERENCE.md`
2. Run: `.\.github\scripts\setup-local-sync.ps1 -Install`
3. Test: `.\.github\scripts\local-sync-main-fusion.ps1 -Once`
4. Check: `.\.github\scripts\local-sync-main-fusion.ps1 -Status`

## 🔗 Related Files

- **Workflows**: `.github/workflows/`
- **Scripts**: `.github/scripts/`
- **Documentation**: `.github/docs/`
- **Logs**: `.github/logs/`

## 💡 Tips

1. **Stay on MAIN-FUSION locally** for automatic sync
2. **Commit regularly** to avoid large stashes
3. **Check status before starting work** each day
4. **Review logs weekly** to monitor sync activity
5. **Clean up backup branches monthly**

## 🎉 Benefits

### Before Automation
❌ Manually pull from multiple `claude/*` branches  
❌ Track which branches have which changes  
❌ Manually merge and resolve conflicts  
❌ Remember to clean up old branches  
❌ Keep local machine manually synchronized  

### After Automation
✅ Single unified `MAIN-FUSION` branch  
✅ Automatic merging and cleanup  
✅ Automatic conflict detection  
✅ Complete documentation trail  
✅ Local machine always synchronized  
✅ Desktop notifications for updates  
✅ Automatic backups of your work  

---

**Questions?** Check the documentation in `.github/docs/`
