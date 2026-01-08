# Portfolio Source Directory

**Status**: 🚧 TypeScript Migration in Progress  
**Branch**: `feature/portfolio-typescript-migration`  
**Last Updated**: January 8, 2026

---

## Overview

This directory contains the TypeScript-based portfolio system for my-website, featuring a clean separation between content (your project data) and design (showcase components).

## Directory Structure

```
portfolio_src/
├── src/
│   ├── types/
│   │   ├── portfolio.types.ts    # ✅ TypeScript type definitions
│   │   └── README.md             # Type system documentation
│   │
│   ├── data/
│   │   └── projectData.ts        # 🔄 YOUR project content (Step 2)
│   │
│   ├── adapters/
│   │   └── portfolioAdapter.ts   # 🔄 Data transformation (Step 3)
│   │
│   ├── components/            # 🔄 Showcase UI components (synced)
│   ├── hooks/                 # 🔄 React hooks (synced)
│   ├── lib/                   # 🔄 Utilities (synced)
│   └── index.css              # 🔄 Global styles (synced)
│
├── MIGRATION_LOG.md         # ✅ Complete migration documentation
└── README.md                # ✅ This file
```

**Legend**:
- ✅ Complete
- 🔄 Pending
- 🔒 Protected from sync
- ✅ Synced from showcase

---

## Architecture

### Three-Layer System

```
CONTENT → ADAPTER → DESIGN

1. CONTENT LAYER (🔒 Protected)
   - Your project data
   - Type definitions
   - Never synced from showcase

2. ADAPTER LAYER (🔄 Custom)
   - Transforms content to design format
   - Bridges structure differences
   - Your mapping logic

3. DESIGN LAYER (✅ Synced)
   - UI components from showcase
   - React hooks and utilities
   - Always updated from showcase
```

### Data Flow

```typescript
// Step 1: Your content (protected)
const myProjects: ProjectData = {
  eastleigh: { /* your data */ },
  delivah: { /* your data */ },
  edumanage: { /* your data */ }
};

// Step 2: Adapt to showcase format
const { projects } = adaptPortfolioData(myProjects);

// Step 3: Render with showcase components
<HorizontalScroller sections={projects[0].sections} />
```

---

## Quick Start

### For Development

```bash
# Install dependencies
npm install

# Type check
npx tsc --noEmit

# Run dev server
npm run dev
```

### Adding a New Project

1. **Update types** (if structure differs):
   ```typescript
   // src/types/portfolio.types.ts
   export interface ProjectData {
     eastleigh: ProjectInfo;
     delivah: ProjectInfo;
     edumanage: ProjectInfo;
     newProject: ProjectInfo; // Add here
   }
   ```

2. **Add content** in `src/data/projectData.ts`:
   ```typescript
   export const projectsData: ProjectData = {
     // ... existing projects
     newProject: {
       id: 'new-project',
       name: 'New Project',
       // ... rest of data
     }
   };
   ```

3. **Adapter handles it automatically** - no changes needed!

### Updating Content

Edit `src/data/projectData.ts` - that's it! TypeScript will validate your changes.

---

## Migration Status

### ✅ Step 1: Type System (Complete)
- TypeScript type definitions created
- Documentation written
- Sync protection configured
- **Files**: `src/types/portfolio.types.ts`, `src/types/README.md`, `.syncignore`

### 🔄 Step 2: Convert Data (Next)
- Convert `projectData.js` to TypeScript
- Add type annotations
- Verify compilation
- **File**: `src/data/projectData.ts`

### 🔄 Step 3: Create Adapter (Pending)
- Implement transformation logic
- Map content to showcase format
- Add unit tests
- **File**: `src/adapters/portfolioAdapter.ts`

### 🔄 Step 4: Integration (Pending)
- Connect adapter to app
- Test rendering
- Verify type safety

### 🔄 Step 5: Sync Automation (Pending)
- GitHub App setup
- Automated PR creation
- Respects `.syncignore`

---

## Documentation

### Primary Docs
- **[MIGRATION_LOG.md](./MIGRATION_LOG.md)** - Complete migration tracking with decisions and rationale
- **[src/types/README.md](./src/types/README.md)** - Type system documentation and usage guide

### Reference
- **[.syncignore](../.syncignore)** - Files protected from showcase syncs
- **[src/types/portfolio.types.ts](./src/types/portfolio.types.ts)** - Type definitions (see inline comments)

---

## Sync Protection

### 🔒 Never Synced (YOUR content)
```
src/types/portfolio.types.ts
src/data/projectData.ts
src/adapters/portfolioAdapter.ts
public/js/projectData.js
public/images/projects/**
```

### ✅ Always Synced (showcase design)
```
src/components/**
src/hooks/**
src/lib/**
src/index.css
tailwind.config.ts
```

See [.syncignore](../.syncignore) for complete list.

---

## Benefits

### Type Safety
✅ Catch errors at compile time  
✅ IDE auto-completion  
✅ Self-documenting code  
✅ Refactoring confidence  

### Separation of Concerns
✅ Content independent from design  
✅ Design updates don't break content  
✅ Easy to swap design systems  
✅ Clear boundaries  

### Maintainability
✅ Clear data contracts  
✅ Easy to add projects  
✅ Simple content updates  
✅ Version controlled types  

---

## Tech Stack

- **TypeScript** 5.x - Type safety
- **React** 18+ - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library (from showcase)
- **Framer Motion** - Animations (from showcase)

---

## Commands

```bash
# Type checking
npm run type-check

# Build
npm run build

# Development
npm run dev

# Lint
npm run lint

# Format
npm run format
```

---

## Contributing

When working with this system:

### DO ✅
- Use TypeScript types
- Update MIGRATION_LOG.md when completing steps
- Follow the three-layer architecture
- Respect `.syncignore` rules
- Write type-safe code

### DON'T ❌
- Use `any` type
- Bypass the adapter
- Mix content and design concerns
- Manually sync files in `.syncignore`
- Modify showcase components directly

---

## Support

### Questions?
- Check [MIGRATION_LOG.md](./MIGRATION_LOG.md) for detailed explanations
- Review [src/types/README.md](./src/types/README.md) for type system help
- Open an issue in the repository

### Need Help?
- **Developer**: Leon Madara
- **Repository**: [leon-madara/my-website](https://github.com/leon-madara/my-website)
- **Branch**: `feature/portfolio-typescript-migration`

---

## Next Steps

To continue the migration:

1. **Review completed work**: Read through the created files
2. **Proceed to Step 2**: Convert `projectData.js` to TypeScript
3. **See MIGRATION_LOG.md**: For detailed step-by-step instructions

---

**Last Updated**: January 8, 2026, 1:22 PM EAT  
**Version**: 1.0.0  
**Status**: Step 1 Complete ✅
