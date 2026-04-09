# Portfolio JSON Data Migration Guide

**Branch**: `feature/portfolio-json-data-migration`  
**Status**: ⏳ In Progress  
**Created**: January 9, 2026

---

## 🎯 Objective

Migrate portfolio data from embedded React code to dynamic JSON files, enabling content updates without rebuilding the entire React application.

## ✅ Completed Steps

### 1. Branch Creation

✅ Created feature branch: [`feature/portfolio-json-data-migration`](https://github.com/leon-madara/my-website/tree/feature/portfolio-json-data-migration)

### 2. JSON Data Files

✅ **Eastleigh Turf Flow** - [`public/portfolio_data/eastleigh.json`](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_data/eastleigh.json)
- 13,159 bytes
- 9 sections with 18 pages
- Complete project documentation

✅ **Delivah Dispatch Hub** - [`public/portfolio_data/delivah.json`](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_data/delivah.json)
- 15,059 bytes
- 9 sections with 18 pages
- Enterprise logistics platform details

### 3. Data Loader Infrastructure

✅ **Data Loader** - [`public/portfolio_components/dataLoader.js`](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_components/dataLoader.js)
- Dynamic JSON loading
- Error handling
- Browser API (`window.PortfolioDataLoader`)

✅ **Documentation** - [`public/portfolio_components/README.md`](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_components/README.md)
- Complete API documentation
- Usage examples
- Troubleshooting guide

---

## 🛠️ Next Steps

You have **two options** for completing the migration:

### Option A: Modify Existing portfolio-showcase (Recommended)

**Pros**: 
- Uses existing, tested React components
- Maintains current design and animations
- Minimal changes required

**Cons**:
- Requires rebuilding React app
- Need to modify TypeScript source

**Steps**:

1. **Clone portfolio-showcase locally** (if not already):
   ```bash
   git clone https://github.com/leon-madara/portfolio-showcase.git
   cd portfolio-showcase
   npm install
   ```

2. **Modify data source** in `portfolio-showcase/src/data/portfolioData.ts`:
   
   **Replace this**:
   ```typescript
   export const portfolioData: Project[] = [
     // Hardcoded data
   ];
   ```
   
   **With this**:
   ```typescript
   // Load from window global (set by dataLoader.js)
   export const portfolioData: Project[] = 
     (window as any).__PORTFOLIO_DATA__ || [];
   ```

3. **Rebuild the application**:
   ```bash
   npm run build
   ```

4. **Copy build to my-website**:
   ```bash
   # From portfolio-showcase directory
   cp -r dist/* ../my-website/public/portfolio_build/
   ```

5. **Update portfolio.html** in my-website to load data first:
   ```html
   <!-- Load data loader -->
   <script src="portfolio_components/dataLoader.js"></script>
   
   <!-- Load React with data -->
   <script type="module">
     (async () => {
       const projects = await window.PortfolioDataLoader.loadAllProjects();
       window.__PORTFOLIO_DATA__ = projects;
       
       // Then load React app
       const script = document.createElement('script');
       script.type = 'module';
       script.src = 'portfolio_build/assets/index-[hash].js';
       document.body.appendChild(script);
     })();
   </script>
   ```

6. **Test locally** and verify both projects render correctly

7. **Commit changes** to feature branch

8. **Create PR** and merge to main after verification

---

### Option B: Create Standalone JSON-Driven Build

**Pros**:
- Clean separation from portfolio-showcase
- Can customize specifically for JSON loading
- Independent versioning

**Cons**:
- More work upfront
- Need to replicate existing design
- Maintain separate codebase

**Steps**:

1. **Create new React app** in my-website:
   ```bash
   cd my-website
   npx create-vite@latest portfolio-json-app --template react-ts
   cd portfolio-json-app
   npm install
   ```

2. **Copy React components** from portfolio-showcase:
   - AnimatedBackground
   - ChapterSlider
   - ContentArea
   - MobileNav
   - ProjectToggle
   - ThemeToggle

3. **Modify App.tsx** to load from window global:
   ```typescript
   const [projects, setProjects] = useState([]);
   
   useEffect(() => {
     setProjects((window as any).__PORTFOLIO_DATA__ || []);
   }, []);
   ```

4. **Build and deploy**:
   ```bash
   npm run build
   cp -r dist/* ../public/portfolio_build/
   ```

5. **Update portfolio.html** (same as Option A)

6. **Test and merge**

---

## 📝 File Structure After Migration

```
my-website/
├── public/
│   ├── portfolio_data/           ← JSON content files
│   │   ├── eastleigh.json
│   │   └── delivah.json
│   ├── portfolio_components/     ← Data loader
│   │   ├── dataLoader.js
│   │   └── README.md
│   ├── portfolio_build/          ← React build (updated)
│   │   └── assets/
│   └── portfolio.html            ← Updated loader
├── MIGRATION_GUIDE.md           ← This file
└── README.md
```

---

## 🧪 Testing Checklist

Before merging to main:

- [ ] Data loader loads without errors
- [ ] Both projects (Eastleigh, Delivah) render correctly
- [ ] Navigation between projects works
- [ ] Chapter slider functions properly
- [ ] Theme toggle persists
- [ ] Mobile navigation works
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] All sections and pages accessible
- [ ] Links to GitHub repos work
- [ ] Page loads in under 2 seconds

---

## 🐛 Troubleshooting

### Data Not Loading

**Symptom**: Portfolio shows "No projects found" or blank screen

**Check**:
1. Browser console for errors
2. Network tab - verify JSON files loaded (200 status)
3. `window.__PORTFOLIO_DATA__` is populated before React renders
4. `dataLoader.js` loaded before React app

**Fix**:
```javascript
// In browser console
await window.PortfolioDataLoader.loadAllProjects()
// Should return array with 2 projects
```

### Projects Not Rendering

**Symptom**: Data loads but UI doesn't render

**Check**:
1. React app expects data in correct format
2. JSON structure matches TypeScript interfaces
3. No TypeScript type errors in build

**Fix**:
- Verify JSON structure matches portfolio-showcase format
- Check all required fields are present
- Validate JSON syntax

### Build Issues

**Symptom**: `npm run build` fails

**Check**:
1. Node version (16+)
2. Dependencies installed (`npm install`)
3. TypeScript compilation errors

**Fix**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🚀 Deployment

Once verified on feature branch:

1. **Create Pull Request**:
   ```bash
   git checkout feature/portfolio-json-data-migration
   git push origin feature/portfolio-json-data-migration
   ```

2. **Review changes** on GitHub

3. **Test deployed preview** (if available)

4. **Merge to main**:
   - Via GitHub PR interface
   - Or command line:
     ```bash
     git checkout main
     git merge feature/portfolio-json-data-migration
     git push origin main
     ```

5. **Verify production** site after deployment

6. **Delete feature branch** after successful merge:
   ```bash
   git branch -d feature/portfolio-json-data-migration
   git push origin --delete feature/portfolio-json-data-migration
   ```

---

## 📚 Benefits of This Approach

### For Development

✅ **No Rebuilds for Content Updates**  
Update JSON files directly - no React rebuild needed

✅ **Clean Separation**  
Content (JSON) separate from code (React)

✅ **Version Control**  
Track content changes independently

✅ **Faster Iteration**  
Test content changes without waiting for builds

### For Maintenance

✅ **Easier Updates**  
Edit JSON files instead of TypeScript code

✅ **Smaller Commits**  
Content changes don't include build artifacts

✅ **Better Reviews**  
Reviewers can focus on content, not code

### For Scalability

✅ **Add Projects Easily**  
Just create new JSON file

✅ **Lazy Loading Potential**  
Load projects on-demand in future

✅ **CMS Integration**  
Can connect to headless CMS later

---

## ❓ Questions?

If you need help with any step:

1. Check the README in `public/portfolio_components/`
2. Review browser console logs
3. Verify JSON structure matches examples
4. Test data loader independently

---

## 📝 Notes

- Both JSON files are now in the repository on feature branch
- Data loader is ready to use
- Main branch remains unchanged (safe fallback)
- Can test feature branch before merging
- edumanage.html remains separate (as requested)

---

**Ready to proceed?** Choose **Option A** (recommended) or **Option B** and follow the steps above. Let me know which option you prefer or if you need any clarification!
