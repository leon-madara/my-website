# Portfolio JSON Data Migration

## Overview

This directory contains the infrastructure for loading portfolio data dynamically from JSON files instead of embedding it in the compiled JavaScript bundle.

## Architecture

```
public/
├── portfolio_data/              ← JSON data files (content)
│   ├── eastleigh.json
│   └── delivah.json
├── portfolio_components/        ← React components (UI)
│   ├── dataLoader.js          ← Dynamic data loading
│   └── README.md              ← This file
├── portfolio_build/             ← Current React build
└── portfolio.html               ← Entry point
```

## Benefits of JSON Data Separation

### ✅ **Content Updates Without Rebuilding**
- Update portfolio content by editing JSON files
- No need to rebuild entire React application
- Faster iteration on content changes

### ✅ **Clean Separation of Concerns**
- **Content** (JSON): Your project data
- **Design** (React): UI components from portfolio-showcase
- **Infrastructure** (dataLoader.js): Data fetching logic

### ✅ **Version Control Friendly**
- Track content changes separately from code changes
- Easy to review content updates in PRs
- Smaller commit diffs

### ✅ **Scalability**
- Easy to add new projects (just add JSON file)
- Can implement lazy loading for large portfolios
- Potential for CMS integration in future

## Data Loader API

### `loadProjectData(projectId)`

Load a single project's data.

```javascript
const project = await window.PortfolioDataLoader.loadProjectData('eastleigh-turf');
console.log(project.title); // "Eastleigh Turf Flow"
```

### `loadAllProjects()`

Load all available projects.

```javascript
const projects = await window.PortfolioDataLoader.loadAllProjects();
console.log(`Loaded ${projects.length} projects`);
```

### `getAvailableProjects()`

Get list of available project IDs.

```javascript
const projectIds = window.PortfolioDataLoader.getAvailableProjects();
// ["eastleigh-turf", "delivah-logistics"]
```

### `projectExists(projectId)`

Check if a project exists.

```javascript
if (window.PortfolioDataLoader.projectExists('eastleigh-turf')) {
  // Load the project
}
```

## JSON Data Structure

Each project JSON file follows the portfolio-showcase format:

```json
{
  "id": "project-id",
  "badge": "01",
  "title": "Project Title",
  "summary": "Brief summary",
  "timeline": "3 weeks",
  "role": "Full Stack Developer",
  "status": "Production-Ready",
  "highlights": [
    "Tech 1",
    "Tech 2"
  ],
  "link": "https://github.com/...",
  "sections": [
    {
      "id": "section-id",
      "title": "Section Title",
      "pages": [
        {
          "id": 0,
          "title": "Page Title",
          "content": "Page content with detailed information"
        }
      ]
    }
  ]
}
```

## Integration with React App

The data loader must be loaded **before** the React application:

```html
<!-- Load data loader first -->
<script src="portfolio_components/dataLoader.js"></script>

<!-- Then load React app -->
<script type="module">
  (async () => {
    // Load portfolio data
    const projects = await window.PortfolioDataLoader.loadAllProjects();
    
    // Make available to React app
    window.__PORTFOLIO_DATA__ = projects;
    
    // Initialize React app
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'portfolio_build/assets/index-[hash].js';
    document.body.appendChild(script);
  })();
</script>
```

## Migration Status

### ✅ Completed

- [x] Created `portfolio_data/` directory
- [x] Added `eastleigh.json` with complete project data
- [x] Added `delivah.json` with complete project data
- [x] Created `dataLoader.js` for dynamic loading
- [x] Created feature branch: `feature/portfolio-json-data-migration`

### ⏳ Pending

- [ ] Modify portfolio-showcase React app to use `window.__PORTFOLIO_DATA__`
- [ ] Rebuild React app with JSON loading support
- [ ] Copy new build to `portfolio_build/`
- [ ] Update `portfolio.html` to load data before React app
- [ ] Test portfolio functionality with JSON data
- [ ] Verify all projects render correctly
- [ ] Merge feature branch to main

## Adding New Projects

To add a new project:

1. **Create JSON file**: `public/portfolio_data/project-name.json`
2. **Update dataLoader.js**:
   ```javascript
   const PROJECTS_DATA = {
     'eastleigh-turf': '/portfolio_data/eastleigh.json',
     'delivah-logistics': '/portfolio_data/delivah.json',
     'new-project': '/portfolio_data/new-project.json' // Add this
   };
   ```
3. **Test**: Verify the project loads correctly

## Error Handling

The data loader includes comprehensive error handling:

- **Network errors**: Caught and logged with context
- **Invalid JSON**: Parsing errors are caught
- **Missing projects**: Clear error messages
- **HTTP errors**: Status codes are logged

## Browser Compatibility

- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Requirements**: 
  - `async/await` support
  - `fetch` API
  - ES6 modules

## Next Steps

### Option A: Modify portfolio-showcase (Recommended)

1. Clone portfolio-showcase locally
2. Modify `src/data/portfolioData.ts` to load from `window.__PORTFOLIO_DATA__`
3. Rebuild the app
4. Copy build to `my-website/public/portfolio_build/`

### Option B: Create New Standalone Build

1. Create new React app that reads JSON data
2. Build and deploy to `portfolio_components/`
3. Update `portfolio.html` to use new build

## Testing

To test the data loader:

```javascript
// In browser console after loading portfolio.html
await window.PortfolioDataLoader.loadAllProjects();
// Should log: "✅ Loaded 2 projects"
```

## Troubleshooting

### Data not loading

- Check browser console for errors
- Verify JSON files are accessible (check Network tab)
- Ensure `dataLoader.js` loaded before React app

### Projects not rendering

- Verify `window.__PORTFOLIO_DATA__` is populated
- Check React app console for errors
- Ensure JSON structure matches expected format

## Contributing

When updating portfolio content:

1. Create feature branch
2. Update JSON files in `portfolio_data/`
3. Test locally
4. Submit PR for review
5. Merge to main after verification

## Support

For issues or questions:
- Check this README first
- Review browser console logs
- Verify JSON structure against examples
- Check Network tab for failed requests
