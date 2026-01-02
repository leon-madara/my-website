# MAIN-FUSION Complete Automation Guide

## 🎯 What This Is

A complete automation system that eliminates manual branch management for Claude Code cloud sessions.

**Problem Solved:**
- No more pulling from multiple `claude/*` branches
- No more manual merging
- No more tracking which branch has which changes
- No more keeping local machine manually synchronized

**Solution:**
Automatic workflow: `claude/*` → `MAIN-FUSION` (remote) → Your local machine

---

## 🚀 Quick Start (10 Minutes)

### Remote Setup (5 minutes)

1. **Enable GitHub Actions:**
   - Go to: Settings → Actions → General
   - Select: "Read and write permissions"
   - Check: "Allow GitHub Actions to create and approve pull requests"
   - Save

2. **Merge to main:**
   ```powershell
   # Create PR from current branch to main and merge it
   # Or via GitHub UI: Pull requests → New → Merge
   ```

### Local Setup (5 minutes)

1. **Switch to MAIN-FUSION:**
   ```powershell
   git checkout MAIN-FUSION
   ```

2. **Install automatic sync:**
   ```powershell
   .\.github\scripts\setup-local-sync.ps1 -Install
   ```

3. **Test it:**
   ```powershell
   .\.github\scripts\local-sync-main-fusion.ps1 -Once
   ```

**Done!** 🎉

---

## 📊 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Complete Workflow                         │
└─────────────────────────────────────────────────────────────┘

1. You work with Claude Code (cloud)
                    ↓
2. Claude pushes to: claude/feature-xyz-abc123
                    ↓
3. GitHub Actions detects push (AUTOMATIC)
                    ↓
4. Merges to MAIN-FUSION on GitHub (AUTOMATIC)
                    ↓
5. Deletes claude/* branch (AUTOMATIC)
                    ↓
6. Creates documentation PR (AUTOMATIC)
                    ↓
7. Task Scheduler checks for updates (AUTOMATIC - every 30 mins)
                    ↓
8. Pulls to local MAIN-FUSION (AUTOMATIC)
                    ↓
9. Creates backup if you have uncommitted changes (AUTOMATIC)
                    ↓
10. Desktop notification sent (AUTOMATIC)
                    ↓
11. You continue working with latest code ✨
```

---

## 📁 File Structure

```
my-website/
├── .github/
│   ├── workflows/
│   │   └── auto-merge-to-main-fusion.yml    # Remote: GitHub Actions
│   ├── scripts/
│   │   ├── merge-to-main-fusion.sh          # Remote: Merge logic
│   │   ├── manual-merge.sh                  # Remote: Manual fallback
│   │   ├── local-sync-main-fusion.ps1       # Local: Sync script ⭐
│   │   ├── setup-local-sync.ps1             # Local: Setup ⭐
│   │   └── sync-on-startup.ps1              # Local: Optional startup
│   ├── docs/
│   │   ├── SETUP-WALKTHROUGH.md             # Step-by-step setup ⭐
│   │   ├── SYNC-QUICK-REFERENCE.md          # Command cheat sheet ⭐
│   │   ├── LOCAL-SYNC-GUIDE.md              # Complete local guide
│   │   ├── MAIN-FUSION-AUTOMATION.md        # Remote automation docs
│   │   └── QUICK-START.md                   # Quick setup
│   ├── logs/
│   │   └── sync.log                         # Activity log
│   └── README.md                            # Overview
└── MAIN-FUSION-COMPLETE-GUIDE.md            # This file ⭐
```

**⭐ = Most important files**

---

## 🎮 Daily Commands

### Check Status
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

### Sync Now
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

### View Logs
```powershell
Get-Content .github\logs\sync.log -Tail 20
```

### Stop Background Sync
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Stop
```

---

## 🔔 What You'll See

### Successful Sync
```
✓ Successfully pulled changes from MAIN-FUSION
Latest commit: abc1234 - feat: updated dashboard
```
**Desktop notification:** "MAIN-FUSION Updated!"

### Backup Created
```
⚠ Uncommitted changes detected!
✓ Created backup branch: backup/MAIN-FUSION-portfolio-20241122-143022
✓ Changes stashed for safety
✓ Successfully pulled changes
```
**Desktop notification:** "Backup Created - Your work saved to: backup/..."

### No Updates
```
ℹ No updates available from remote
```

### Conflict Detected (Remote)
**GitHub Issue created** with label `merge-conflict`
- Contains conflict details
- Provides resolution steps
- Preserves the `claude/*` branch

---

## 🔒 Safety Features

### 1. Uncommitted Changes Protection
- Detects uncommitted changes before pulling
- Creates backup branch automatically
- Backup name includes file descriptions and timestamp
- Stashes changes safely
- Pulls updates
- Notifies you

### 2. Automatic Backups
**Backup branch format:**
```
backup/MAIN-FUSION-[file-descriptions]-[timestamp]

Examples:
- backup/MAIN-FUSION-portfolio-styles-20241122-143022
- backup/MAIN-FUSION-dashboard-modal-about-20241122-150315
```

**Restore from backup:**
```powershell
git checkout backup/MAIN-FUSION-portfolio-styles-20241122-143022
git checkout -b my-work-restored
```

### 3. Concurrency Control
- Lock file prevents multiple syncs
- Only one sync operation at a time
- Prevents race conditions

### 4. Activity Logging
- All operations logged to `.github/logs/sync.log`
- Timestamps for every action
- Error details for troubleshooting

---

## 🎯 Best Practices

### 1. Always Work on MAIN-FUSION Locally
```powershell
git checkout MAIN-FUSION
```

### 2. Commit Regularly
```powershell
git add .
git commit -m "feat: descriptive message"
```

### 3. Check Status Before Starting Work
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

### 4. Review Logs Weekly
```powershell
Get-Content .github\logs\sync.log | Select-String "ERROR|WARNING"
```

### 5. Clean Up Old Backups Monthly
```powershell
# List backups
git branch | Select-String "backup/"

# Delete old ones
git branch -D backup/MAIN-FUSION-old-work-20241101-120000
```

---

## 🆘 Troubleshooting

### Remote Issues

| Problem | Solution |
|---------|----------|
| Workflow not running | Check if files are in `main` branch |
| Merge conflicts | Check GitHub Issues for `merge-conflict` label |
| No MAIN-FUSION branch | Will be created automatically on first merge |
| Permissions error | Enable Actions write permissions in Settings |

### Local Issues

| Problem | Solution |
|---------|----------|
| Sync not working | Run: `.\.github\scripts\setup-local-sync.ps1 -Test` |
| Not on MAIN-FUSION | Run: `git checkout MAIN-FUSION` |
| Uncommitted changes | Let script handle it (creates backup) |
| Task Scheduler fails | Use daemon mode: `-Daemon` flag |

### Quick Fixes

**Reinstall everything:**
```powershell
.\.github\scripts\setup-local-sync.ps1 -Uninstall
.\.github\scripts\setup-local-sync.ps1 -Install
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**Reset to remote:**
```powershell
git fetch origin MAIN-FUSION
git reset --hard origin/MAIN-FUSION
```

**View detailed logs:**
```powershell
Get-Content .github\logs\sync.log
```

---

## 📚 Documentation Index

| Document | When to Read |
|----------|--------------|
| **SETUP-WALKTHROUGH.md** | First-time setup (start here!) |
| **SYNC-QUICK-REFERENCE.md** | Daily command reference |
| **LOCAL-SYNC-GUIDE.md** | Complete local sync documentation |
| **MAIN-FUSION-AUTOMATION.md** | Remote automation details |
| **QUICK-START.md** | Quick setup summary |
| **This file** | Overview and quick reference |

---

## 🎊 Benefits

### Before Automation
❌ Pull from multiple `claude/*` branches manually  
❌ Track which branch has which changes  
❌ Manually merge and resolve conflicts  
❌ Remember to clean up old branches  
❌ Keep local machine manually synchronized  
❌ Risk losing work during merges  

### After Automation
✅ Single unified `MAIN-FUSION` branch  
✅ Automatic merging (remote)  
✅ Automatic pulling (local)  
✅ Automatic cleanup  
✅ Desktop notifications  
✅ Automatic backups  
✅ Complete documentation trail  
✅ Conflict detection and alerts  
✅ Activity logging  

---

## 🔗 Quick Links

### Setup
- [Step-by-step walkthrough](.github/docs/SETUP-WALKTHROUGH.md)
- [Quick start guide](.github/docs/QUICK-START.md)

### Daily Use
- [Command reference](.github/docs/SYNC-QUICK-REFERENCE.md)
- [Complete local guide](.github/docs/LOCAL-SYNC-GUIDE.md)

### Reference
- [Remote automation](.github/docs/MAIN-FUSION-AUTOMATION.md)
- [GitHub configuration](.github/README.md)

---

## ✅ Setup Checklist

### Remote
- [ ] GitHub Actions permissions enabled
- [ ] Automation files in `main` branch
- [ ] Workflow visible in Actions tab
- [ ] Tested with a `claude/*` push

### Local
- [ ] On MAIN-FUSION branch
- [ ] Task Scheduler installed
- [ ] Test sync successful
- [ ] Status shows "Background sync running"
- [ ] Desktop notifications working

### Verification
- [ ] End-to-end test completed
- [ ] Logs being written
- [ ] Backup branches created when needed
- [ ] Comfortable with daily commands

---

## 🎉 You're All Set!

Your workflow is now fully automated. Just work normally on MAIN-FUSION and let the system handle the rest!

**Questions?** Check the documentation in `.github/docs/`

**Happy coding!** 🚀

---

## 📞 Support

### Check Logs
```powershell
Get-Content .github\logs\sync.log -Tail 50
```

### Test Setup
```powershell
.\.github\scripts\setup-local-sync.ps1 -Test
```

### Check Status
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

### View Task Scheduler
```powershell
Get-ScheduledTask -TaskName "MAIN-FUSION-Auto-Sync"
```

---

**Last Updated:** November 22, 2024  
**Version:** 1.0.0
