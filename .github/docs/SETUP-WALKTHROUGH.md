# MAIN-FUSION Complete Setup Walkthrough

## 🎯 Goal

Set up complete automation so that:
1. Claude Code pushes to `claude/*` branches (cloud)
2. GitHub Actions merges to `MAIN-FUSION` (remote)
3. Your local machine pulls updates automatically (local)

**Result:** You never manually pull from `claude/*` branches again!

---

## 📋 Prerequisites

- [ ] Git installed
- [ ] PowerShell 7+ installed
- [ ] GitHub repository access
- [ ] Windows 10/11 (for Task Scheduler)

---

## Part 1: Remote Automation Setup (5 minutes)

### Step 1: Enable GitHub Actions Permissions

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Actions** → **General** (left sidebar)
4. Scroll to **Workflow permissions**
5. Select: ✅ **"Read and write permissions"**
6. Check: ✅ **"Allow GitHub Actions to create and approve pull requests"**
7. Click **Save**

**Why?** This allows the automation to push to MAIN-FUSION and create PRs.

### Step 2: Merge Automation to Main Branch

The automation files are currently in a `claude/*` branch. They need to be in `main` to work.

**Option A: Via GitHub UI (Recommended)**
1. Go to your repository on GitHub
2. Click **Pull requests** tab
3. Click **New pull request**
4. Base: `main` ← Compare: `claude/review-portfolio-page-014ZgN6JYGSeUWaptTiRfBmx`
5. Click **Create pull request**
6. Click **Merge pull request**
7. Click **Confirm merge**

**Option B: Via Command Line**
```powershell
git checkout main
git pull origin main
git merge claude/review-portfolio-page-014ZgN6JYGSeUWaptTiRfBmx
git push origin main
```

### Step 3: Verify Remote Automation

1. Go to **Actions** tab in GitHub
2. You should see the workflow: **"Auto-Merge to MAIN-FUSION"**
3. It will run automatically on next `claude/*` push

**Test it (optional):**
- Let Claude Code make any small change
- Push to a new `claude/*` branch
- Watch the Actions tab
- Check that MAIN-FUSION branch is created/updated

✅ **Remote automation complete!**

---

## Part 2: Local Sync Setup (5 minutes)

### Step 1: Ensure You're on MAIN-FUSION

```powershell
# Check current branch
git branch

# If not on MAIN-FUSION, switch to it
git checkout MAIN-FUSION

# If MAIN-FUSION doesn't exist locally yet, create it
git checkout -b MAIN-FUSION origin/MAIN-FUSION
```

### Step 2: Install Task Scheduler

Open PowerShell in your repository directory and run:

```powershell
.\.github\scripts\setup-local-sync.ps1 -Install
```

**Expected output:**
```
═══════════════════════════════════════════════════
  Installing MAIN-FUSION Auto-Sync Task
═══════════════════════════════════════════════════

✓ Task Scheduler configured successfully!

Task Details:
  Name: MAIN-FUSION-Auto-Sync
  Frequency: Every 30 minutes
  Script: C:\...\my-website\.github\scripts\local-sync-main-fusion.ps1
  Repository: C:\...\my-website

✓ Background sync is now active!
  The task will run every 30 minutes automatically.
```

### Step 3: Test the Sync

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**Expected output:**
```
ℹ Starting MAIN-FUSION sync check...
✓ On MAIN-FUSION branch
✓ Working directory clean
ℹ Checking for remote updates...
ℹ No updates available from remote
```

### Step 4: Verify Status

```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

**Expected output:**
```
═══════════════════════════════════════════════════
  MAIN-FUSION Sync Status
═══════════════════════════════════════════════════

Current Branch: MAIN-FUSION
✓ On MAIN-FUSION branch
✓ Working directory clean
✓ Background sync running (PID: 12345)
✓ Up to date with remote
```

✅ **Local sync complete!**

---

## Part 3: Verify End-to-End (10 minutes)

### Test the Complete Workflow

1. **Make a change in Claude Code (cloud)**
   - Edit any file
   - Let Claude push to a new `claude/*` branch

2. **Watch GitHub Actions (remote)**
   - Go to Actions tab
   - See "Auto-Merge to MAIN-FUSION" running
   - Wait for it to complete (usually < 1 minute)

3. **Wait for local sync (local)**
   - Wait up to 30 minutes (or run manual sync)
   - Or run immediately: `.\.github\scripts\local-sync-main-fusion.ps1 -Once`

4. **Verify local update**
   - Check your files - they should have the changes
   - Check logs: `Get-Content .github\logs\sync.log -Tail 20`

**Expected flow:**
```
Claude Code → claude/feature-xyz
     ↓ (automatic)
GitHub Actions → MAIN-FUSION (remote)
     ↓ (automatic, every 30 mins)
Task Scheduler → MAIN-FUSION (local)
     ↓
Desktop notification: "MAIN-FUSION Updated!"
```

✅ **End-to-end automation working!**

---

## 🎉 You're Done!

### What Happens Now?

**Automatically:**
- Claude Code pushes to `claude/*` branches
- GitHub Actions merges to MAIN-FUSION
- Your local machine pulls updates every 30 minutes
- You get desktop notifications
- Old `claude/*` branches are deleted
- Documentation PRs are created

**You do:**
- Work normally on MAIN-FUSION locally
- Commit your changes regularly
- Periodically merge MAIN-FUSION → main when ready to deploy

---

## 📚 Daily Usage

### Morning Routine

```powershell
# Check status
.\.github\scripts\local-sync-main-fusion.ps1 -Status

# Get latest updates
.\.github\scripts\local-sync-main-fusion.ps1 -Once

# Start working
code .
```

### During the Day

- Work normally
- Commit regularly
- Sync happens automatically every 30 minutes
- Desktop notifications alert you to updates

### End of Day

```powershell
# Commit your work
git add .
git commit -m "feat: completed today's work"

# Check final status
.\.github\scripts\local-sync-main-fusion.ps1 -Status
```

---

## 🆘 Troubleshooting

### Remote Automation Not Working

**Check workflow exists in main:**
```powershell
git checkout main
git pull origin main
ls .github/workflows/
```

**Check GitHub Actions permissions:**
- Settings → Actions → General → Workflow permissions
- Must be "Read and write permissions"

**Check Actions tab:**
- Should show "Auto-Merge to MAIN-FUSION" workflow
- Check for error messages

### Local Sync Not Working

**Reinstall Task Scheduler:**
```powershell
.\.github\scripts\setup-local-sync.ps1 -Uninstall
.\.github\scripts\setup-local-sync.ps1 -Install
```

**Check Task Scheduler:**
```powershell
Get-ScheduledTask -TaskName "MAIN-FUSION-Auto-Sync"
```

**View logs:**
```powershell
Get-Content .github\logs\sync.log
```

**Use daemon mode as fallback:**
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Daemon
```

### Uncommitted Changes Blocking Sync

**Let script handle it (creates backup):**
```powershell
.\.github\scripts\local-sync-main-fusion.ps1 -Once
```

**Or commit manually:**
```powershell
git add .
git commit -m "WIP: my changes"
```

---

## 📖 Reference Documentation

| Document | Purpose |
|----------|---------|
| `SYNC-QUICK-REFERENCE.md` | Command cheat sheet |
| `LOCAL-SYNC-GUIDE.md` | Complete local sync guide |
| `MAIN-FUSION-AUTOMATION.md` | Remote automation details |
| `QUICK-START.md` | Quick setup summary |

---

## ✅ Setup Checklist

### Remote Setup
- [ ] GitHub Actions permissions enabled
- [ ] Automation files merged to `main` branch
- [ ] Workflow visible in Actions tab
- [ ] Test with a `claude/*` branch push

### Local Setup
- [ ] On MAIN-FUSION branch locally
- [ ] Task Scheduler installed
- [ ] Test sync runs successfully
- [ ] Status shows "Background sync running"
- [ ] Logs directory created

### Verification
- [ ] End-to-end test completed
- [ ] Desktop notifications working
- [ ] Logs being written
- [ ] Backup branches created when needed

---

## 🎊 Success!

You now have a fully automated workflow:

**Before:**
- ❌ Manually track multiple `claude/*` branches
- ❌ Manually pull and merge changes
- ❌ Manually clean up old branches
- ❌ Risk of conflicts and confusion

**After:**
- ✅ Single unified MAIN-FUSION branch
- ✅ Automatic merging and pulling
- ✅ Automatic cleanup
- ✅ Desktop notifications
- ✅ Automatic backups
- ✅ Complete documentation trail

**Happy coding!** 🚀
