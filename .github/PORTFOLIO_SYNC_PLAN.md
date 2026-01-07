# Portfolio Synchronization Plan

## Overview

This document outlines the automated synchronization process between `portfolio-showcase` and `my-website` repositories.

## What Gets Synced

### From portfolio-showcase → my-website

#### 1. Core Components (`src/components/portfolio/`)
- ✅ `AnimatedBackground.tsx` - Background animations and effects
- ✅ `ChapterSlider.tsx` - Chapter navigation slider
- ✅ `ContentArea.tsx` - Main content display area
- ✅ `MobileNav.tsx` - Mobile navigation component
- ✅ `ProjectToggle.tsx` - Project switching buttons (01, 02, 03)
- ✅ `ThemeToggle.tsx` - Dark/Light theme switcher

#### 2. UI Components (`src/components/ui/`)
- ✅ All shadcn/ui components used in portfolio
- These provide the base UI primitives

#### 3. Data Structure (`src/data/`)
- ✅ `portfolioData.ts` - Project data structure
- This defines how Eastleigh, Delivah content is organized

#### 4. Hooks (`src/hooks/`)
- ✅ Custom React hooks for state management

#### 5. Utilities (`src/lib/`)
- ✅ Helper functions and utilities

#### 6. Styles (`src/`)
- ✅ `index.css` - Global styles with CSS variables
- ✅ `App.css` - Component-specific styles

#### 7. Configuration Files
- ✅ `tailwind.config.ts` - Tailwind configuration with theme
- ✅ `components.json` - shadcn/ui configuration
- ✅ `tsconfig.json` - TypeScript configuration

#### 8. Dependencies
- ✅ Merge package.json dependencies
- React 18, TypeScript, Tailwind CSS, Radix UI, etc.

## What DOESN'T Get Synced

### Stays in my-website (No Override)

- ❌ `public/*.html` files (index, about, contact, edumanage, portfolio)
- ❌ `public/js/` - Custom JavaScript files
- ❌ `public/css/` - Custom CSS files
- ❌ `public/images/` - Image assets
- ❌ Cloudflare Workers configuration
- ❌ GitHub Actions workflows (except sync workflow)
- ❌ README, documentation files

## Directory Structure After Sync

```
my-website/
├── .github/
│   ├── workflows/
│   │   └── sync-portfolio.yml          (NEW - Automation workflow)
│   └── scripts/
│       └── sync-portfolio.js           (NEW - Sync script)
├── public/
│   ├── index.html                      (KEEP - Existing)
│   ├── about.html                      (KEEP - Existing)
│   ├── contact.html                    (KEEP - Existing)
│   ├── edumanage.html                  (KEEP - Existing)
│   ├── portfolio.html                  (UPDATE - Load React app)
│   ├── portfolio_build/                (OVERWRITE - React build output)
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   ├── js/                             (KEEP - Existing scripts)
│   ├── css/                            (KEEP - Existing styles)
│   └── images/                         (KEEP - Existing images)
├── portfolio_src/                      (NEW - React source)
│   ├── src/
│   │   ├── components/
│   │   │   ├── portfolio/              (FROM showcase)
│   │   │   └── ui/                     (FROM showcase)
│   │   ├── data/
│   │   │   └── portfolioData.ts        (FROM showcase)
│   │   ├── hooks/                      (FROM showcase)
│   │   ├── lib/                        (FROM showcase)
│   │   ├── pages/
│   │   │   └── Portfolio.tsx           (FROM showcase)
│   │   ├── index.css                   (FROM showcase)
│   │   └── main.tsx                    (FROM showcase)
│   ├── index.html                      (NEW - Entry point)
│   ├── vite.config.ts                  (NEW - Vite config)
│   └── tsconfig.json                   (FROM showcase)
├── package.json                        (MERGE - Dependencies)
├── tailwind.config.ts                  (FROM showcase)
└── components.json                     (FROM showcase)
```

## Sync Process Flow

### 1. Trigger Events
- **Manual**: Run workflow from GitHub Actions UI
- **Automatic**: Push to `portfolio-showcase` main branch
- **Scheduled**: Daily at 2 AM EAT

### 2. Sync Steps

#### Step 1: Authentication
- GitHub Actions authenticates with repository secrets
- Validates access to both repos

#### Step 2: Clone showcase
```bash
git clone --depth 1 https://github.com/leon-madara/portfolio-showcase.git
```

#### Step 3: Copy Files Selectively
```bash
# Copy components
cp -r showcase/src/components/* my-website/portfolio_src/src/components/

# Copy data
cp -r showcase/src/data/* my-website/portfolio_src/src/data/

# Copy hooks
cp -r showcase/src/hooks/* my-website/portfolio_src/src/hooks/

# Copy utilities
cp -r showcase/src/lib/* my-website/portfolio_src/src/lib/

# Copy pages
cp -r showcase/src/pages/* my-website/portfolio_src/src/pages/

# Copy styles
cp showcase/src/index.css my-website/portfolio_src/src/
cp showcase/src/App.css my-website/portfolio_src/src/

# Copy config files
cp showcase/tailwind.config.ts my-website/
cp showcase/components.json my-website/
cp showcase/tsconfig.json my-website/portfolio_src/
```

#### Step 4: Merge Dependencies
```javascript
// Read both package.json files
const showcasePkg = require('showcase/package.json');
const myWebsitePkg = require('my-website/package.json');

// Merge dependencies (showcase takes precedence for conflicts)
myWebsitePkg.dependencies = {
  ...myWebsitePkg.dependencies,
  ...showcasePkg.dependencies
};

myWebsitePkg.devDependencies = {
  ...myWebsitePkg.devDependencies,
  ...showcasePkg.devDependencies
};

// Add new scripts
myWebsitePkg.scripts['build:portfolio'] = 'vite build --config vite.portfolio.config.ts';
myWebsitePkg.scripts['dev:portfolio'] = 'vite --config vite.portfolio.config.ts';
```

#### Step 5: Install Dependencies
```bash
npm install
```

#### Step 6: Run Tests
```bash
npm test
```

#### Step 7: Build Portfolio
```bash
npm run build:portfolio
```

#### Step 8: Commit Changes
```bash
git add portfolio_src/ public/portfolio_build/ package.json tailwind.config.ts
git commit -m "sync: Update portfolio from showcase@<commit-sha>"
```

#### Step 9: Create Pull Request
- Create PR to `main` branch
- Include sync details
- Add labels: `sync`, `portfolio`, `automated`
- Request review (optional)

#### Step 10: Auto-merge (If tests pass)
- If triggered by repository_dispatch (automatic)
- If all checks pass
- Merge to main

#### Step 11: Deploy to Cloudflare
- Triggered on merge to main
- Deploy updated portfolio_build/
- Verify deployment

### 3. Error Handling

#### If Tests Fail
- ❌ Stop sync process
- 📧 Create GitHub issue
- 🔔 Notify maintainers
- Keep PR open for manual review

#### If Build Fails
- ❌ Stop sync process
- 📋 Log error details
- 📧 Create GitHub issue
- Rollback changes

#### If Deployment Fails
- ⚠️  Keep previous version live
- 📧 Create GitHub issue
- 🔄 Retry deployment (max 3 times)

## Integration Points

### 1. Third Button Behavior (EduManage)

**Current in showcase**: All three buttons are React components
**Required in my-website**: Button 03 should redirect to `/edumanage.html`

**Implementation**:
```typescript
// portfolio_src/src/components/portfolio/ProjectToggle.tsx
const handleProjectChange = (projectId: number) => {
  if (projectId === 3) {
    // External navigation for EduManage
    window.location.href = '/edumanage.html';
  } else {
    // React state update for Eastleigh/Delivah
    setActiveProject(projectId);
  }
};
```

### 2. Theme Integration

**Existing theme toggle**: `public/js/theme-toggle-component.js`
**New theme toggle**: React component in showcase

**Solution**: Use existing theme toggle, sync theme state
```javascript
// Listen for theme changes from existing component
window.addEventListener('theme-changed', (e) => {
  setReactTheme(e.detail.theme);
});
```

### 3. Navigation Bar Integration

**Existing nav**: Liquid navigation in all pages
**New portfolio**: React-based navigation

**Solution**: Keep existing nav, activate portfolio link
```javascript
// Update active state when portfolio loads
document.querySelector('[href="portfolio.html"]').classList.add('active');
```

## Testing Strategy

### Pre-Sync Tests
- ✅ Verify showcase repo accessibility
- ✅ Validate current my-website state
- ✅ Check for uncommitted changes

### Post-Sync Tests
- ✅ Component tests (Jest + React Testing Library)
- ✅ Build validation
- ✅ TypeScript type checking
- ✅ Linting
- ✅ Bundle size analysis

### Integration Tests
- ✅ Portfolio page loads
- ✅ Project toggling works
- ✅ EduManage button redirects correctly
- ✅ Theme toggle synchronizes
- ✅ Navigation highlights correctly
- ✅ Mobile responsive
- ✅ Accessibility (WCAG 2.1 AA)

### E2E Tests (Optional)
- Playwright tests for full user journey

## Rollback Strategy

### If Sync Causes Issues

1. **Immediate Rollback**
```bash
git revert <commit-sha>
git push origin main
```

2. **Redeploy Previous Version**
```bash
cloudflare pages deployment create --project=my-website --commit-sha=<previous-sha>
```

3. **Manual Investigation**
- Review sync logs
- Compare file changes
- Test locally
- Fix issues
- Re-sync

## Security Considerations

### Secrets Management
- ✅ GitHub Actions secrets for API tokens
- ✅ No hardcoded credentials
- ✅ Minimal permissions (only what's needed)

### Code Review
- ✅ PRs require review for manual triggers
- ✅ Auto-merge only for automated triggers with passing tests
- ✅ Audit trail via commit history

## Monitoring & Alerts

### Success Metrics
- Sync duration
- Build time
- Bundle size
- Test coverage
- Deployment time

### Failure Alerts
- GitHub issue created automatically
- Email notification to maintainers
- Slack/Discord webhook (optional)

## Future Enhancements

### Phase 2
- [ ] Content CMS integration
- [ ] Visual regression testing
- [ ] Performance budgets
- [ ] A/B testing framework

### Phase 3
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Progressive Web App features

## Maintenance

### Weekly
- Review sync logs
- Check for failed syncs
- Monitor bundle size

### Monthly
- Update dependencies
- Review performance metrics
- Optimize sync process

### Quarterly
- Security audit
- Dependency vulnerability scan
- Performance audit

---

**Last Updated**: January 8, 2026
**Maintained By**: Leon Madara
**Contact**: [GitHub](https://github.com/leon-madara)
