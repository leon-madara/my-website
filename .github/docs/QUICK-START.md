# MAIN-FUSION Quick Start Guide

## 🚀 What This Does

Every time Claude Code (cloud) pushes to a `claude/*` branch, it automatically:
1. ✅ Merges to `MAIN-FUSION` branch
2. ✅ Creates a PR for documentation
3. ✅ Deletes the `claude/*` branch
4. 🚨 Or creates an issue if conflicts occur

**No manual intervention needed!** ✨

## 📋 Setup Checklist

- [x] **.github/workflows/auto-merge-to-main-fusion.yml** - GitHub Actions workflow (automatic)
- [x] **.github/scripts/merge-to-main-fusion.sh** - Core merge logic
- [x] **.github/scripts/manual-merge.sh** - Fallback manual script
- [x] **.github/docs/MAIN-FUSION-AUTOMATION.md** - Full documentation

### ⚙️ One-Time Setup Required

1. **Enable GitHub Actions** (if not already enabled)
   - Go to: Settings → Actions → General
   - Enable: "Allow all actions and reusable workflows"

2. **Set Workflow Permissions**
   - Go to: Settings → Actions → General → Workflow permissions
   - Select: "Read and write permissions"
   - Check: "Allow GitHub Actions to create and approve pull requests"
   - Click: "Save"

3. **Push these files to `main` branch**
   ```bash
   git add .github/
   git commit -m "feat: add MAIN-FUSION automation system"
   git push origin main
   ```

4. **Make scripts executable** (if running locally)
   ```bash
   chmod +x .github/scripts/*.sh
   ```

That's it! The automation is now active. 🎉

## 🎯 How to Use

### Normal Workflow (Automatic)

1. **Work with Claude Code** (cloud) as usual
2. Claude pushes to `claude/your-feature-sessionId`
3. **Automation runs automatically** - check Actions tab
4. Review `MAIN-FUSION` branch periodically
5. Merge `MAIN-FUSION` → `main` when ready

### If Conflicts Occur

1. Check **Issues** tab for conflict notification
2. Follow the resolution steps in the issue
3. Manually merge and push
4. Close the issue

### Manual Merge (Fallback)

If automation fails or you want manual control:

```bash
./.github/scripts/manual-merge.sh claude/branch-name
```

## 📊 Monitoring

| What to Check | Where to Look | What You'll See |
|---------------|---------------|-----------------|
| **Successful merges** | Pull Requests tab | PRs labeled `auto-merge` |
| **Conflicts** | Issues tab | Issues labeled `merge-conflict` |
| **Automation logs** | Actions tab | "Auto-Merge to MAIN-FUSION" workflow |
| **Current state** | Branches | `MAIN-FUSION` branch |

## 🔄 Regular Workflow

### Daily/Per Session
- ✅ Claude Code pushes automatically
- ✅ Automation handles merging
- 👀 Quick check Actions tab (optional)

### Weekly
- 📝 Review changes in MAIN-FUSION
- ✅ Test MAIN-FUSION locally (optional)
- 🚀 Merge MAIN-FUSION → main
- 🧹 Close old PRs/issues

## 🆘 Quick Troubleshooting

### "Workflow not running"
- Check if files are in `main` branch
- Verify Actions are enabled in Settings

### "Permission denied"
- Check Workflow permissions in Settings → Actions
- Should be "Read and write permissions"

### "Can't create MAIN-FUSION"
- Script creates it automatically
- If issues persist, create manually: `git checkout -b MAIN-FUSION main && git push origin MAIN-FUSION`

### "Too many conflicts"
- This is normal if working on same files
- Follow issue instructions to resolve
- Consider working on different areas to minimize conflicts

## 📚 Full Documentation

For detailed information, see [MAIN-FUSION-AUTOMATION.md](./MAIN-FUSION-AUTOMATION.md)

## 🎓 Example Scenario

```
Day 1: Claude adds new feature
  → Pushes to: claude/add-feature-abc123
  → Automation: Merges to MAIN-FUSION ✅
  → Result: PR created, branch deleted

Day 2: Claude fixes bug
  → Pushes to: claude/fix-bug-def456
  → Automation: Merges to MAIN-FUSION ✅
  → Result: PR created, branch deleted

Day 3: You review
  → Check MAIN-FUSION branch
  → All changes look good
  → Merge MAIN-FUSION → main
  → Deploy! 🚀
```

## ✨ Tips

- 💡 **Trust the automation** - It handles most cases automatically
- 👀 **Monitor the Actions tab** - Especially for the first few merges
- 📋 **Review MAIN-FUSION regularly** - Don't let changes pile up too long
- 🔔 **Watch for conflict issues** - Resolve them promptly
- 🧪 **Test MAIN-FUSION** - Before merging to main

---

**Need help?** Check the full docs or create a GitHub issue.
