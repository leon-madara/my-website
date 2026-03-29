# Portfolio Migration - Quick Start

🚀 **Branch**: `feature/portfolio-json-data-migration`

---

## ⚡ TL;DR

**What's Done**:
- ✅ JSON data files created (Eastleigh, Delivah)
- ✅ Data loader script ready
- ✅ Documentation complete
- ✅ Feature branch created

**What's Next**: Choose your path →

---

## 🛖 Two Paths Forward

### Path A: Quick (Recommended) ⏱️ 30 minutes

Modify existing portfolio-showcase React app.

```bash
# 1. Clone portfolio-showcase
git clone https://github.com/leon-madara/portfolio-showcase.git
cd portfolio-showcase
npm install

# 2. Edit src/data/portfolioData.ts
# Replace hardcoded data with:
export const portfolioData: Project[] = 
  (window as any).__PORTFOLIO_DATA__ || [];

# 3. Rebuild
npm run build

# 4. Copy to my-website
cp -r dist/* ../my-website/public/portfolio_build/

# 5. Update my-website/public/portfolio.html
# Add data loader before React app (see template below)

# 6. Test and merge
```

### Path B: From Scratch ⏱️ 2-3 hours

Create new React app that reads JSON.

```bash
cd my-website
npx create-vite@latest portfolio-json-app --template react-ts
# Copy components, build, deploy
```

---

## 📝 portfolio.html Template (Path A)

Add this before your React app loads:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Your existing head content -->
</head>
<body>
  <!-- Your existing nav/logo -->
  
  <div id="root"></div>

  <!-- ADD THIS: Data Loader -->
  <script src="portfolio_components/dataLoader.js"></script>

  <!-- MODIFY THIS: React App Loading -->
  <script type="module">
    (async () => {
      try {
        // Load portfolio data from JSON
        const projects = await window.PortfolioDataLoader.loadAllProjects();
        window.__PORTFOLIO_DATA__ = projects;
        
        console.log('✅ Loaded', projects.length, 'projects');
        
        // Load React app
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'portfolio_build/assets/index-B-NOlmU5.js'; // Your hash
        document.body.appendChild(script);
      } catch (error) {
        console.error('❌ Portfolio load failed:', error);
        document.getElementById('root').innerHTML = `
          <div style="padding: 2rem; text-align: center;">
            <h2>Failed to load portfolio</h2>
            <p>Please refresh or check console</p>
          </div>
        `;
      }
    })();
  </script>

  <!-- Your other scripts -->
</body>
</html>
```

---

## 🧪 Quick Test

After setup, open browser console:

```javascript
// Should show loader API
window.PortfolioDataLoader

// Should return 2 projects
await window.PortfolioDataLoader.loadAllProjects()

// Should show loaded data
window.__PORTFOLIO_DATA__
```

---

## 🐛 Troubleshooting

**Data not loading?**
```javascript
// Check if loader exists
console.log(window.PortfolioDataLoader);

// Try manual load
await window.PortfolioDataLoader.loadProjectData('eastleigh-turf');
```

**Projects not rendering?**
- Check `window.__PORTFOLIO_DATA__` is set BEFORE React renders
- Verify React app reads from global variable
- Check browser console for errors

**Build failed?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 File Locations

```
my-website/
├── MIGRATION_GUIDE.md        ← Full instructions
├── QUICK_START.md             ← This file
└── public/
    ├── portfolio_data/
    │   ├── eastleigh.json      ← Project 1 data
    │   └── delivah.json        ← Project 2 data
    ├── portfolio_components/
    │   ├── dataLoader.js       ← JSON loader
    │   └── README.md           ← API docs
    ├── portfolio_build/        ← React app (update)
    └── portfolio.html          ← Entry (update)
```

---

## ✅ Verification Checklist

Before merging:

- [ ] Both projects load without errors
- [ ] Navigation works between projects
- [ ] Chapter slider functions
- [ ] Theme toggle persists
- [ ] Mobile nav works
- [ ] No console errors
- [ ] Page loads fast (<2s)

---

## 🚀 Deploy

When ready:

```bash
# Push feature branch
git checkout feature/portfolio-json-data-migration
git push origin feature/portfolio-json-data-migration

# Create PR on GitHub
# Test deployed preview
# Merge to main

# Cleanup
git checkout main
git pull
git branch -d feature/portfolio-json-data-migration
```

---

## 🔗 Resources

- **Full Guide**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **API Docs**: [public/portfolio_components/README.md](./public/portfolio_components/README.md)
- **Feature Branch**: [View on GitHub](https://github.com/leon-madara/my-website/tree/feature/portfolio-json-data-migration)
- **JSON Data**: 
  - [eastleigh.json](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_data/eastleigh.json)
  - [delivah.json](https://github.com/leon-madara/my-website/blob/feature/portfolio-json-data-migration/public/portfolio_data/delivah.json)

---

## ❓ Need Help?

1. Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed steps
2. Review console logs for specific errors
3. Test data loader independently
4. Verify JSON structure

---

**Recommended**: Start with **Path A** (30 min) - it's faster and uses proven components.
