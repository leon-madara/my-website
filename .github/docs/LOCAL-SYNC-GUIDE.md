# MAIN-FUSION Local Synchronization Guide

## 🎯 Overview

This guide explains how to keep your local machine automatically synchronized with the MAIN-FUSION branch, eliminating manual pulls and reducing conflicts.

## 📋 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│              Local Sync Workflow                             │
└─────────────────────────────────────────────────────────────┘

1. GitHub Actions merges claude/* → MAIN-FUSION (remote)
                    ↓
2. Task Scheduler runs every 30 minutes (local)
                    ↓
3. Script checks for remote updates
                    ↓
        ┌───────────┴───────────┐
        │                       │
   NO UPDATES              UPDATES FOUND
        │                       │
        ↓                       ↓
   Do nothing          Check working directory
                                ↓
                    ┌───────────┴───────────┐
                    │                       │
              CLEAN DIRECTORY      UNCOMMITTED CHANGES
                    │                       │
                    ↓                       ↓
              Pull changes        Create backup branch
                    │             Stash changes
                    │             Pull changes
                    │                       │
                    └───────────┬───────────┘
                                ↓
                    Desktop notification sent
                    Terminal message logged
```

## 🚀 Quick Start

### Option 1: Automatic (Recommended)

**Install Task Scheduler** (runs every 30 minutes automatically):

```powershell
.\.github\scripts\setup-local-sync.ps1 -Install
```

This configures Windows Task Scheduler to run the sync automatically in the background.

### Option 2: Manual On-Demand

**Run sync once** when you want to check for updates:

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

### Option 3: Daemon Mode

**Run as background process** (alternative to Task Scheduler):

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Daemon
```

## 📚 Complete Command Reference

### Setup Commands

| Command | Description |
|---------|-------------|
| `setup-local-sync.ps1 -Install` | Install Task Scheduler (automatic every 30 mins) |
| `setup-local-sync.ps1 -Uninstall` | Remove Task Scheduler |
| `setup-local-sync.ps1 -Test` | Test the sync setup |

### Sync Commands

| Command | Description |
|---------|-------------|
| `local-sync-main-fusion.ps1 -Once` | Run sync once and exit |
| `local-sync-main-fusion.ps1 -Daemon` | Run in background (every 30 mins) |
| `local-sync-main-fusion.ps1 -Status` | Check current sync status |
| `local-sync-main-fusion.ps1 -Stop` | Stop background daemon |

## 🔒 Safety Features

### 1. Uncommitted Changes Protection

**What happens:**
- Script detects uncommitted changes
- Creates backup branch with descriptive name
- Example: `backup/MAIN-FUSION-about-parallax-dashboard-20241122-143022`
- Stashes your changes
- Pulls updates
- Notifies you

**Your work is safe!** You can recover from the backup branch anytime.

### 2. Automatic Backups

**Backup branch naming:**
```
backup/[current-branch]-[file-descriptions]-[timestamp]

Examples:
- backup/MAIN-FUSION-portfolio-styles-20241122-143022
- backup/MAIN-FUSION-dashboard-modal-20241122-150315
```

**To restore from backup:**
```powershell
git checkout backup/MAIN-FUSION-portfolio-styles-20241122-143022
git checkout -b my-work-restored
```

### 3. Lock File Prevention

Prevents multiple sync operations from running simultaneously.

### 4. Clean Directory Verification

Only pulls if working directory is clean (or creates backup first).

## 🔔 Notifications

### Desktop Notifications

You'll receive Windows toast notifications for:
- ✅ Successful sync with commit details
- ⚠️ Backup branch created
- ❌ Sync failures

### Terminal Messages

Color-coded messages in terminal:
- 🟢 **Green**: Success
- 🟡 **Yellow**: Warnings
- 🔴 **Red**: Errors
- 🔵 **Cyan**: Info

### Log Files

All sync activity is logged to:
```
.github/logs/sync.log
```

## 📊 Monitoring

### Check Sync Status

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

**Shows:**
- Current branch
- Working directory status
- Background sync status
- Remote update availability

### View Logs

```powershell
Get-Content .github\logs\sync.log -Tail 50
```

### Check Task Scheduler

```powershell
Get-ScheduledTask -TaskName "MAIN-FUSION-Auto-Sync"
```

## 🛠️ Troubleshooting

### Sync Not Running

**Check if Task Scheduler is installed:**
```powershell
.\.github\scripts\setup-local-sync.ps1 -Test
```

**Reinstall if needed:**
```powershell
.\.github\scripts\setup-local-sync.ps1 -Uninstall
.\.github\scripts\setup-local-sync.ps1 -Install
```

### Stuck on Wrong Branch

**Manually switch to MAIN-FUSION:**
```powershell
git checkout MAIN-FUSION
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

### Uncommitted Changes Blocking Sync

**Option 1: Let script handle it** (creates backup automatically)
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**Option 2: Manual commit**
```powershell
git add .
git commit -m "WIP: my changes"
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**Option 3: Manual stash**
```powershell
git stash
.\.github\scripts\local-sync-main-fusion.ps1 -Once
git stash pop
```

### Sync Fails with Conflicts

**The script will:**
1. Stop the sync
2. Alert you with notification
3. Log the error
4. Keep your branch intact

**Manual resolution:**
```powershell
git fetch origin MAIN-FUSION
git merge origin/MAIN-FUSION
# Resolve conflicts manually
git add .
git commit -m "Resolved merge conflicts"
```

### Task Scheduler Not Working

**Fallback to daemon mode:**
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Daemon
```

**Or run manually when needed:**
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

## 🎯 Best Practices

### 1. Stay on MAIN-FUSION Locally

Always work on the MAIN-FUSION branch locally:
```powershell
git checkout MAIN-FUSION
```

### 2. Commit Regularly

Commit your work frequently to avoid large stashes:
```powershell
git add .
git commit -m "Descriptive message"
```

### 3. Check Status Before Starting Work

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

### 4. Review Backup Branches Periodically

List backup branches:
```powershell
git branch | Select-String "backup/"
```

Delete old backups:
```powershell
git branch -D backup/MAIN-FUSION-old-work-20241101-120000
```

### 5. Monitor Sync Logs

Check logs weekly:
```powershell
Get-Content .github\logs\sync.log -Tail 100
```

## 🔄 Complete Workflow Example

### Daily Workflow

**Morning:**
```powershell
# Check status
.\.github\scripts\local-sync-main-fusion.ps1 -Status

# Ensure on MAIN-FUSION
git checkout MAIN-FUSION

# Manual sync to get latest
.\.github\scripts\local-sync-main-fusion.ps1 -Once

# Start working
code .
```

**During work:**
- Task Scheduler syncs every 30 minutes automatically
- You receive notifications if updates arrive
- Your work is backed up automatically if needed

**End of day:**
```powershell
# Commit your work
git add .
git commit -m "feat: completed dashboard updates"

# Check final status
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

## 📈 Advanced Usage

### Custom Polling Interval

Edit the script to change from 30 minutes:

```powershell
# In local-sync-main-fusion.ps1
$POLL_INTERVAL = 1800  # Change to desired seconds
```

### Disable Notifications

Comment out the `Send-Notification` calls in the script if you prefer silent operation.

### Run on Startup

Add to Task Scheduler with "At startup" trigger:
```powershell
$trigger = New-ScheduledTaskTrigger -AtStartup
```

## 🆘 Emergency Procedures

### Stop Everything

```powershell
# Stop daemon
.\.github\scripts\local-sync-main-fusion.ps1 -Stop

# Uninstall Task Scheduler
.\.github\scripts\setup-local-sync.ps1 -Uninstall
```

### Recover Lost Work

```powershell
# List all backup branches
git branch -a | Select-String "backup/"

# Checkout the backup
git checkout backup/MAIN-FUSION-mywork-20241122-143022

# Create new branch from backup
git checkout -b recovered-work

# Merge back to MAIN-FUSION when ready
git checkout MAIN-FUSION
git merge recovered-work
```

### Reset to Remote

```powershell
# Nuclear option: reset local to match remote exactly
git fetch origin MAIN-FUSION
git reset --hard origin/MAIN-FUSION
```

## 📞 Support

### Check Documentation

- **Full automation docs**: `.github/docs/MAIN-FUSION-AUTOMATION.md`
- **Quick start**: `.github/docs/QUICK-START.md`
- **This guide**: `.github/docs/LOCAL-SYNC-GUIDE.md`

### View Logs

```powershell
Get-Content .github\logs\sync.log
```

### Test Setup

```powershell
.\.github\scripts\setup-local-sync.ps1 -Test
```

## ✅ Setup Checklist

- [ ] Install Task Scheduler: `.\.github\scripts\setup-local-sync.ps1 -Install`
- [ ] Test sync: `.\.github\scripts\local-sync-main-fusion.ps1 -Once`
- [ ] Verify status: `.\.github\scripts\local-sync-main-fusion.ps1 -Status`
- [ ] Check Task Scheduler: `Get-ScheduledTask -TaskName "MAIN-FUSION-Auto-Sync"`
- [ ] Ensure on MAIN-FUSION: `git checkout MAIN-FUSION`
- [ ] Review logs: `Get-Content .github\logs\sync.log`

## 🎉 You're All Set!

Your local machine will now automatically stay synchronized with MAIN-FUSION every 30 minutes, with full safety features and notifications.

**Next steps:**
1. Continue working normally on MAIN-FUSION
2. Receive automatic updates every 30 minutes
3. Get notified when changes arrive
4. Your work is automatically backed up if needed

Happy coding! 🚀
