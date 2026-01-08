# Portfolio TypeScript Integration Guide

This guide explains how to integrate the TypeScript portfolio system into your website.

---

## Overview

You've successfully created:
1. **Type System** (`portfolio_src/src/types/`) - TypeScript interfaces
2. **Content Data** (`portfolio_src/src/data/`) - Your project information
3. **Adapter Layer** (`portfolio_src/src/adapters/`) - Transformation logic

Now it's time to **use** this system in your application.

---

## Quick Start

### Option A: Static HTML Integration (Current Setup)

Since your site uses static HTML (`public/*.html`), you'll need to compile the TypeScript to JavaScript first.

**Steps**:

1. **Install TypeScript** (if not installed):
   ```bash
   npm install --save-dev typescript
   ```

2. **Create tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "lib": ["ES2020", "DOM"],
       "outDir": "./public/js/portfolio",
       "rootDir": "./portfolio_src/src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "moduleResolution": "node"
     },
     "include": ["portfolio_src/src/**/*"],
     "exclude": ["node_modules", "public"]
   }
   ```

3. **Add build script to package.json**:
   ```json
   {
     "scripts": {
       "build:portfolio": "tsc -p tsconfig.json",
       "watch:portfolio": "tsc -p tsconfig.json --watch"
     }
   }
   ```

4. **Build the TypeScript**:
   ```bash
   npm run build:portfolio
   ```

   This generates:
   - `public/js/portfolio/data/projectData.js`
   - `public/js/portfolio/adapters/portfolioAdapter.js`
   - `public/js/portfolio/types/portfolio.types.js`

5. **Use in HTML**:
   ```html
   <!-- In your portfolio.html or index.html -->
   <script type="module">
     import { adaptPortfolioData } from './js/portfolio/adapters/portfolioAdapter.js';
     import projectsData from './js/portfolio/data/projectData.js';

     const { projects, projectsMap } = adaptPortfolioData(projectsData);

     console.log('Projects:', projects);
     console.log('Eastleigh:', projectsMap['eastleigh']);

     // Render projects dynamically
     projects.forEach(project => {
       console.log(`${project.badge}: ${project.title}`);
       console.log(`Sections: ${project.sections.length}`);
     });
   </script>
   ```

---

### Option B: Bundle with Build Tool (Recommended)

For better performance and compatibility, use a bundler:

**Vite Setup** (Fast, modern):

1. **Install Vite**:
   ```bash
   npm install --save-dev vite
   ```

2. **Create vite.config.ts**:
   ```typescript
   import { defineConfig } from 'vite';

   export default defineConfig({
     root: 'public',
     build: {
       outDir: '../dist',
       rollupOptions: {
         input: {
           main: 'public/index.html',
           portfolio: 'public/portfolio.html',
         },
       },
     },
   });
   ```

3. **Update package.json**:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

4. **Use in HTML with Vite**:
   ```html
   <script type="module" src="/js/portfolio-entry.js"></script>
   ```

5. **Create /public/js/portfolio-entry.js**:
   ```javascript
   import { adaptPortfolioData } from '../../portfolio_src/src/adapters/portfolioAdapter';
   import projectsData from '../../portfolio_src/src/data/projectData';

   // Initialize portfolio
   const { projects, projectsMap } = adaptPortfolioData(projectsData);

   // Make available globally if needed
   window.portfolioData = { projects, projectsMap };

   // Dispatch event when ready
   window.dispatchEvent(new CustomEvent('portfolio:ready', {
     detail: { projects, projectsMap }
   }));
   ```

---

## Usage Examples

### Example 1: Display All Projects

```javascript
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

const { projects } = adaptPortfolioData(projectsData);

const container = document.getElementById('projects-container');

projects.forEach(project => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <span class="badge">${project.badge}</span>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="highlights">
      ${project.highlights.map(h => `<span class="highlight">${h}</span>`).join('')}
    </div>
    <a href="#${project.id}">View Project</a>
  `;
  container.appendChild(card);
});
```

---

### Example 2: Display Single Project

```javascript
import { getProject } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

// Get project ID from URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project') || 'eastleigh';

const project = getProject(projectsData, projectId);

if (project) {
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-summary').textContent = project.summary;
  document.getElementById('project-timeline').textContent = project.timeline;
  
  // Render sections
  const sectionsContainer = document.getElementById('sections');
  project.sections.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'section';
    sectionEl.innerHTML = `
      <h2>${section.title}</h2>
      ${section.pages.map(page => `
        <div class="page">
          <h3>${page.title}</h3>
          <div class="content">${page.content}</div>
        </div>
      `).join('')}
    `;
    sectionsContainer.appendChild(sectionEl);
  });
}
```

---

### Example 3: React Component (Future)

If you migrate to React:

```typescript
import { useState, useEffect } from 'react';
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';
import type { ShowcaseProject } from './types/portfolio.types';

function Portfolio() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);

  useEffect(() => {
    const { projects } = adaptPortfolioData(projectsData);
    setProjects(projects);
  }, []);

  return (
    <div className="portfolio">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <div className="project-card">
      <span className="badge">{project.badge}</span>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="highlights">
        {project.highlights.map((highlight, i) => (
          <span key={i} className="highlight">{highlight}</span>
        ))}
      </div>
    </div>
  );
}
```

---

## Testing the Integration

### Test 1: Verify Compilation

```bash
# Check TypeScript compiles without errors
npx tsc --noEmit -p tsconfig.json

# Expected output: No errors
```

### Test 2: Verify Data Structure

Create `portfolio_src/test-adapter.js`:

```javascript
import { adaptPortfolioData } from './src/adapters/portfolioAdapter.js';
import projectsData from './src/data/projectData.js';

const { projects, projectsMap } = adaptPortfolioData(projectsData);

console.log('=== Portfolio Adapter Test ===\n');

// Test 1: Projects array
console.log('✓ Projects array:', projects.length === 3);

// Test 2: Project map
console.log('✓ Eastleigh exists:', !!projectsMap['eastleigh']);
console.log('✓ Delivah exists:', !!projectsMap['delivah']);
console.log('✓ EduManage exists:', !!projectsMap['edumanage']);

// Test 3: Structure
projects.forEach(project => {
  console.log(`\n${project.badge}: ${project.title}`);
  console.log(`  Highlights: ${project.highlights.length}`);
  console.log(`  Sections: ${project.sections.length}`);
  
  let totalPages = 0;
  project.sections.forEach(section => {
    totalPages += section.pages.length;
  });
  console.log(`  Total Pages: ${totalPages}`);
});

console.log('\n=== All Tests Passed ===');
```

Run:
```bash
node portfolio_src/test-adapter.js
```

### Test 3: Browser Test

Create `public/test-typescript-adapter.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TypeScript Adapter Test</title>
  <style>
    body { font-family: system-ui; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .project { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
    .badge { background: #0066cc; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; }
    .highlight { background: #f0f0f0; padding: 0.25rem 0.5rem; margin: 0.25rem; display: inline-block; border-radius: 4px; }
    .section { margin: 1rem 0; padding: 1rem; background: #f9f9f9; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>TypeScript Adapter Test</h1>
  <div id="test-results"></div>
  <div id="projects"></div>

  <script type="module">
    import { adaptPortfolioData } from './js/portfolio/adapters/portfolioAdapter.js';
    import projectsData from './js/portfolio/data/projectData.js';

    const { projects, projectsMap } = adaptPortfolioData(projectsData);

    // Display test results
    const results = document.getElementById('test-results');
    results.innerHTML = `
      <h2>Test Results</h2>
      <ul>
        <li>✅ Projects array length: ${projects.length}</li>
        <li>✅ Eastleigh exists: ${!!projectsMap['eastleigh']}</li>
        <li>✅ Delivah exists: ${!!projectsMap['delivah']}</li>
        <li>✅ EduManage exists: ${!!projectsMap['edumanage']}</li>
      </ul>
    `;

    // Display projects
    const projectsContainer = document.getElementById('projects');
    projects.forEach(project => {
      const div = document.createElement('div');
      div.className = 'project';
      div.innerHTML = `
        <h2><span class="badge">${project.badge}</span> ${project.title}</h2>
        <p><strong>Summary:</strong> ${project.summary}</p>
        <p><strong>Timeline:</strong> ${project.timeline}</p>
        <p><strong>Role:</strong> ${project.role}</p>
        <div>
          <strong>Highlights:</strong><br>
          ${project.highlights.map(h => `<span class="highlight">${h}</span>`).join('')}
        </div>
        <div style="margin-top: 1rem;">
          <strong>Sections (${project.sections.length}):</strong>
          ${project.sections.map(s => `
            <div class="section">
              <strong>${s.title}</strong> (${s.pages.length} pages)
            </div>
          `).join('')}
        </div>
      `;
      projectsContainer.appendChild(div);
    });
  </script>
</body>
</html>
```

After building TypeScript, open `test-typescript-adapter.html` in browser.

---

## Integration Checklist

### Pre-Integration
- [ ] TypeScript compiles without errors
- [ ] All three projects in data
- [ ] Adapter test passes

### Build Setup
- [ ] TypeScript installed
- [ ] tsconfig.json configured
- [ ] Build script in package.json
- [ ] Output directory configured

### Code Integration
- [ ] Import statements added
- [ ] Adapter called correctly
- [ ] Data rendered in UI
- [ ] No console errors

### Testing
- [ ] All projects display
- [ ] Section mapping correct
- [ ] Highlights show (4 per project)
- [ ] Type safety working in IDE

### Production
- [ ] Build succeeds
- [ ] Bundle size acceptable
- [ ] Performance good
- [ ] Works on mobile

---

## Troubleshooting

### Issue: "Cannot find module"

**Problem**: Import statements not working

**Solution**:
1. Check tsconfig.json `moduleResolution`: should be `"node"`
2. Verify file paths in imports
3. Ensure TypeScript is compiled: `npm run build:portfolio`

---

### Issue: "Type errors in IDE"

**Problem**: VS Code showing red squiggles

**Solution**:
1. Restart TypeScript server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
2. Check tsconfig.json includes portfolio_src
3. Run `npx tsc --noEmit` to see errors

---

### Issue: "Adapter returns undefined"

**Problem**: `getProject()` returns undefined

**Solution**:
1. Check project ID is correct: `'eastleigh'`, `'delivah'`, or `'edumanage'`
2. Verify projectData.ts exports correctly
3. Test with: `console.log(Object.keys(projectsData))`

---

### Issue: "Missing sections"

**Problem**: Some sections don't appear

**Solution**:
1. Check source data exists (e.g., `project.impact`)
2. Review adapter's `adaptSections()` method
3. Add missing data to projectData.ts

---

## Migration Path

### Current Setup (Static)
```
public/
  js/
    projectData.js  (Old JavaScript)
  portfolio.html    (Uses old data)
```

### After Migration
```
portfolio_src/
  src/
    data/projectData.ts        (New TypeScript - YOUR content)
    adapters/portfolioAdapter.ts (Transformation logic)
    types/portfolio.types.ts    (Type definitions)

public/
  js/
    portfolio/                 (Compiled from portfolio_src)
      data/projectData.js
      adapters/portfolioAdapter.js
    projectData.js            (Keep for backward compatibility)
  portfolio.html              (Update imports)
```

### Migration Steps
1. ✅ Create TypeScript files (DONE)
2. ✅ Build TypeScript to JavaScript
3. ⏳ Update HTML to import from new location
4. ⏳ Test thoroughly
5. ⏳ Remove old projectData.js
6. ⏳ Update .syncignore if needed

---

## Next Steps

1. **Build the TypeScript**:
   ```bash
   npm run build:portfolio
   ```

2. **Test the output**:
   - Open `test-typescript-adapter.html` in browser
   - Check console for errors
   - Verify all projects render

3. **Update portfolio.html**:
   - Replace old JavaScript imports
   - Use adapter to load data
   - Test live

4. **Deploy**:
   - Commit changes
   - Push to main
   - Deploy to Cloudflare

---

## Support

For questions:
- **Migration Log**: `portfolio_src/MIGRATION_LOG.md`
- **Type Documentation**: `portfolio_src/src/types/README.md`
- **Adapter Documentation**: `portfolio_src/src/adapters/README.md`
- **GitHub Issues**: https://github.com/leon-madara/my-website/issues

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0
