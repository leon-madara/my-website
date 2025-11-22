# MAIN-FUSION Automation System

## Overview

This automation system automatically merges changes from Claude Code cloud sessions into a unified `MAIN-FUSION` branch, eliminating the need to manually pull from multiple `claude/*` branches.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Diagram                          │
└─────────────────────────────────────────────────────────────┘

1. Claude Code (Cloud) pushes to: claude/feature-xyz-sessionId
                ↓
2. GitHub Actions detects push (AUTOMATIC)
                ↓
3. Auto-merge script runs
                ↓
        ┌───────┴───────┐
        │               │
    No Conflicts    Conflicts Detected
        │               │
        ↓               ↓
4a. Merge Success   4b. Create Issue
    → Push to           → Preserve branch
      MAIN-FUSION       → Alert for manual
    → Create PR            resolution
      (documentation)
    → Delete claude/*
      branch
                │
                ↓
5. MAIN-FUSION is staging area
                ↓
6. You review and merge MAIN-FUSION → main when ready
```

## Components

### 1. Primary Solution: GitHub Actions (Automatic)

**File:** `.github/workflows/auto-merge-to-main-fusion.yml`

**Triggers:** Automatically on every push to any `claude/*` branch

**Features:**
- ✅ Fully automatic - no manual intervention needed
- ✅ Creates MAIN-FUSION if it doesn't exist
- ✅ Detects and handles merge conflicts
- ✅ Creates documentation PRs for successful merges
- ✅ Creates GitHub issues for conflicts
- ✅ Deletes claude/* branches after successful merge
- ✅ Runs with proper GitHub permissions

**Configuration:**
- Ensures only one merge runs at a time (prevents race conditions)
- Uses concurrency groups to queue merges safely
- Full history fetch for accurate merging

### 2. Fallback Solution: Manual Script

**File:** `.github/scripts/manual-merge.sh`

**Usage:** Run manually if GitHub Actions fails or for one-off merges

```bash
# Make executable (first time only)
chmod +x .github/scripts/manual-merge.sh

# Run for current branch (if it's a claude/* branch)
./.github/scripts/manual-merge.sh

# Or specify a branch
./.github/scripts/manual-merge.sh claude/feature-xyz-sessionId
```

### 3. Core Merge Logic

**File:** `.github/scripts/merge-to-main-fusion.sh`

This is the main merge script called by both the GitHub Action and manual script. It:
- Creates MAIN-FUSION if needed
- Attempts the merge
- Generates detailed reports (success or conflict)
- Manages branch cleanup

## Branch Strategy

### MAIN-FUSION Branch

**Purpose:** Staging area for all Claude Code changes before merging to main

**Lifecycle:**
1. Created from `main` on first run
2. Continuously updated with claude/* merges
3. You review periodically
4. Merge to `main` when ready

**Benefits:**
- Single unified branch for all Claude changes
- No need to track multiple claude/* branches
- Safe staging before production (main)
- Complete history of all Claude sessions

### claude/* Branches

**Lifecycle:**
1. Created by Claude Code cloud (automatic)
2. Auto-merged to MAIN-FUSION (automatic)
3. Deleted after successful merge (automatic)
4. Preserved if conflicts detected (manual resolution required)

## Conflict Resolution

### What Happens When Conflicts Occur

1. **GitHub Actions:**
   - Merge is aborted (no changes made)
   - GitHub Issue is created with details
   - Branch is preserved for manual resolution
   - You receive a notification

2. **Issue Content:**
   - Exact steps to resolve
   - List of conflicting files
   - Commit history from the branch

### How to Resolve Conflicts

```bash
# 1. Checkout MAIN-FUSION
git checkout MAIN-FUSION
git pull origin MAIN-FUSION

# 2. Attempt merge
git merge origin/claude/problematic-branch-sessionId

# 3. Git will show conflicting files - edit them to resolve

# 4. Mark as resolved
git add .

# 5. Complete merge
git commit -m "Merge claude/problematic-branch-sessionId (manual resolution)"

# 6. Push to MAIN-FUSION
git push origin MAIN-FUSION

# 7. Delete the claude branch
git push origin --delete claude/problematic-branch-sessionId

# 8. Close the GitHub issue
```

## Monitoring & Tracking

### Successful Merges

**Evidence:**
- ✅ Pull Request created: `[Auto-Merge] claude/xyz → MAIN-FUSION`
- ✅ Labels: `auto-merge`, `claude-code`
- ✅ Detailed description with:
  - Commit list
  - Files changed
  - Timestamp

**Location:** Check repository Pull Requests tab

### Conflicts

**Evidence:**
- 🚨 GitHub Issue created: `Merge Conflict: claude/xyz → MAIN-FUSION`
- 🚨 Labels: `merge-conflict`, `manual-resolution-required`, `claude-code`
- 🚨 Resolution instructions included

**Location:** Check repository Issues tab

### GitHub Actions Logs

**Location:** Actions tab → "Auto-Merge to MAIN-FUSION" workflow

**What to Check:**
- Merge success/failure status
- Detailed logs for each step
- Script output and error messages

## Merging MAIN-FUSION to Main

When you're ready to deploy changes from MAIN-FUSION to main:

### Option 1: Via Pull Request (Recommended)

```bash
# A PR is automatically created from MAIN-FUSION → main
# Just review and merge it via GitHub UI
```

### Option 2: Via Command Line

```bash
git checkout main
git pull origin main
git merge MAIN-FUSION
git push origin main
```

### Option 3: Via Manual Script

```bash
# Create a script for this if needed
git checkout main
git pull origin main
git merge --no-ff MAIN-FUSION -m "Deploy: Merge MAIN-FUSION to main"
git push origin main
```

## Configuration

### Customization Options

Edit `.github/workflows/auto-merge-to-main-fusion.yml`:

**Change target branch name:**
```yaml
# In the merge script call, update MAIN_FUSION_BRANCH variable
# File: .github/scripts/merge-to-main-fusion.sh
MAIN_FUSION_BRANCH="YOUR-BRANCH-NAME"
```

**Disable auto-delete of claude/* branches:**
```bash
# Comment out in .github/scripts/merge-to-main-fusion.sh
# git push origin --delete "$CLAUDE_BRANCH"
```

**Change PR behavior:**
```yaml
# In auto-merge-to-main-fusion.yml, modify the "Create Success PR" step
# Change base branch, title format, or labels
```

## Troubleshooting

### Problem: GitHub Actions not triggering

**Symptoms:** Push to claude/* branch but no workflow runs

**Solutions:**
1. Check Actions tab is enabled in repository settings
2. Verify workflow file is in `main` branch (workflows only run from default branch)
3. Check workflow file syntax: `yamllint .github/workflows/auto-merge-to-main-fusion.yml`

### Problem: Merge script fails with permissions error

**Symptoms:** "Permission denied" or "403 Forbidden"

**Solutions:**
1. Ensure workflow has `contents: write` permission (already configured)
2. Check repository settings → Actions → General → Workflow permissions
3. Should be set to "Read and write permissions"

### Problem: MAIN-FUSION not created

**Symptoms:** Script fails because MAIN-FUSION doesn't exist

**Solutions:**
1. Script auto-creates it - check logs for actual error
2. Manually create: `git checkout -b MAIN-FUSION main && git push origin MAIN-FUSION`
3. Ensure `main` branch exists (or update script to use your default branch name)

### Problem: Too many PRs created

**Symptoms:** Multiple PRs from MAIN-FUSION to main

**Solutions:**
- This is by design - one PR per merge for documentation
- Close old PRs manually if not needed
- Or modify workflow to update existing PR instead of creating new ones

## Advanced Usage

### Running for Specific Branches Only

Edit the workflow trigger:

```yaml
on:
  push:
    branches:
      - 'claude/feature-*'  # Only merge feature branches
      # or
      - 'claude/*-production-*'  # Only specific patterns
```

### Adding Custom Checks Before Merge

Add a step before merge in the workflow:

```yaml
- name: Run Tests
  run: |
    npm test
    # or
    pytest
    # Only merge if tests pass
```

### Notifications

**Slack/Discord Integration:**
Add notification steps to the workflow after successful merge or conflict detection.

**Email Notifications:**
GitHub automatically emails on Action failures if enabled in settings.

## Security Considerations

### Permissions

The workflow requires:
- `contents: write` - To push to MAIN-FUSION and delete branches
- `pull-requests: write` - To create PRs
- `issues: write` - To create conflict issues

These are minimal required permissions.

### Token Security

- Uses `GITHUB_TOKEN` (automatic, secure)
- No additional secrets needed
- Token expires after workflow run

### Branch Protection

**Recommended:** Add branch protection to MAIN-FUSION:
1. Go to Settings → Branches
2. Add rule for `MAIN-FUSION`
3. Enable: "Require pull request reviews before merging" (optional)
4. This prevents accidental direct pushes

## Maintenance

### Regular Tasks

**Weekly:**
- Review MAIN-FUSION changes
- Merge MAIN-FUSION to main
- Close completed PRs/issues

**Monthly:**
- Check for orphaned claude/* branches: `git branch -r | grep claude`
- Delete if safe: `git push origin --delete claude/old-branch`

### Updating the System

**To update scripts:**
1. Edit files in `.github/scripts/` or `.github/workflows/`
2. Commit and push to main
3. Changes take effect immediately for new pushes

## FAQ

**Q: What happens if two Claude sessions push at the same time?**
A: The concurrency group ensures they queue and run sequentially.

**Q: Can I disable this for specific branches?**
A: Yes, modify the workflow trigger to exclude certain patterns.

**Q: What if I want to manually merge a claude/* branch differently?**
A: Just merge it manually before the workflow runs. The workflow will fail gracefully if the branch is already merged or deleted.

**Q: How do I pause the automation temporarily?**
A: Disable the workflow in Actions tab → "Auto-Merge to MAIN-FUSION" → "..." → "Disable workflow"

**Q: Can this work with other branch prefixes besides `claude/`?**
A: Yes, edit the workflow trigger pattern and script validation logic.

## Support

**Issues:** Create a GitHub issue in this repository
**Docs:** This file (`.github/docs/MAIN-FUSION-AUTOMATION.md`)
**Logs:** Check GitHub Actions tab for detailed execution logs

---

*Last Updated: 2025-11-22*
*Version: 1.0*
