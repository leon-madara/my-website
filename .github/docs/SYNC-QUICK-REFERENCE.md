# MAIN-FUSION Sync - Quick Reference Card

## 🚀 One-Time Setup

```powershell
# Install automatic sync (runs every 30 minutes)
.\.github\scripts\setup-local-sync.ps1 -Install
```

## 📋 Daily Commands

```powershell
# Check for updates now
.\.github\scripts\local-sync-main-fusion.ps1 -Once

# Check sync status
.\.github\scripts\local-sync-main-fusion.ps1 -Status

# View recent logs
Get-Content .github\logs\sync.log -Tail 20
```

## 🔧 Management Commands

```powershell
# Start background sync
.\.github\scripts\local-sync-main-fusion.ps1 -Daemon

# Stop background sync
.\.github\scripts\local-sync-main-fusion.ps1 -Stop

# Test setup
.\.github\scripts\setup-local-sync.ps1 -Test

# Uninstall Task Scheduler
.\.github\scripts\setup-local-sync.ps1 -Uninstall
```

## 🔔 What You'll See

### ✅ Successful Sync
```
✓ Successfully pulled changes from MAIN-FUSION
Latest commit: abc1234 - feat: updated dashboard
```
**Desktop notification:** "MAIN-FUSION Updated!"

### ⚠️ Backup Created
```
⚠ Uncommitted changes detected!
✓ Created backup branch: backup/MAIN-FUSION-portfolio-20241122-143022
```
**Desktop notification:** "Backup Created"

### ℹ️ No Updates
```
ℹ No updates available from remote
```

## 🆘 Quick Fixes

### Not on MAIN-FUSION?
```powershell
git checkout MAIN-FUSION
```

### Uncommitted changes?
```powershell
# Let script handle it (creates backup)
.\.github\scripts\local-sync-main-fusion.ps1 -Once

# Or commit manually
git add .
git commit -m "WIP: my changes"
```

### Sync not working?
```powershell
# Reinstall
.\.github\scripts\setup-local-sync.ps1 -Uninstall
.\.github\scripts\setup-local-sync.ps1 -Install
```

### Recover from backup?
```powershell
# List backups
git branch | Select-String "backup/"

# Restore
git checkout backup/MAIN-FUSION-mywork-20241122-143022
git checkout -b recovered-work
```

## 📊 Status Indicators

| Symbol | Meaning |
|--------|---------|
| ✓ | Success / OK |
| ⚠ | Warning / Attention needed |
| ✗ | Error / Failed |
| ℹ | Information |

## 🎯 Best Practices

1. **Always work on MAIN-FUSION locally**
2. **Commit regularly** (avoid large stashes)
3. **Check status before starting work**
4. **Review logs weekly**
5. **Clean up old backup branches monthly**

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.github/logs/sync.log` | Sync activity log |
| `.git/main-fusion-sync.lock` | Prevents concurrent syncs |
| `.git/main-fusion-sync.pid` | Daemon process ID |

## 🔗 Full Documentation

- **Complete guide**: `.github/docs/LOCAL-SYNC-GUIDE.md`
- **Automation docs**: `.github/docs/MAIN-FUSION-AUTOMATION.md`
- **Quick start**: `.github/docs/QUICK-START.md`

---

**Print this and keep it handy!** 📌
