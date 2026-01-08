# Portfolio Type System

This directory contains TypeScript type definitions for the portfolio system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER (Ours)                     │
│  projectData.ts → portfolio.types.ts (ProjectData types)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ADAPTER LAYER                            │
│  portfolioAdapter.ts → Transforms content to design format  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  DESIGN LAYER (Showcase)                     │
│  Components from portfolio-showcase (ShowcaseProject types) │
└─────────────────────────────────────────────────────────────┘
```

## Type Definitions

### Content Layer Types

These types define YOUR project data structure:

- **`ProjectData`** - Root interface containing all projects
- **`ProjectInfo`** - Complete information for a single project
- **`OverviewSection`** - Project overview with hero, problem, solution
- **`TechnicalSection`** - Tech stack, architecture, decisions, challenges
- **`ImpactSection`** - Metrics, business value, testimonials
- **`ProcessSection`** - Research, methodology, timeline, lessons

### Design Layer Types

These types match the portfolio-showcase component expectations:

- **`ShowcaseProject`** - Project format expected by showcase components
- **`ShowcaseSection`** - Section structure for accordion navigation
- **`ShowcasePage`** - Individual page content within sections

### Adapter Types

- **`AdaptedPortfolioData`** - Output format from adapter transformation

## Usage Example

```typescript
import type { ProjectData, ShowcaseProject } from './types/portfolio.types';
import projectsData from './data/projectData';
import { adaptPortfolioData } from './adapters/portfolioAdapter';

// Your content (type-safe)
const myProjects: ProjectData = projectsData;

// Adapt to showcase format
const { projects, projectsMap } = adaptPortfolioData(myProjects);

// Use with showcase components
const activeProject: ShowcaseProject = projectsMap['eastleigh-turf'];
```

## Benefits of This Architecture

### ✅ Type Safety
- Catch errors at compile time, not runtime
- Auto-completion in IDE
- Refactoring confidence

### ✅ Separation of Concerns
- **Content** (yours) stays independent
- **Design** (showcase) can be updated freely
- **Adapter** bridges the gap cleanly

### ✅ Maintainability
- Clear data contracts
- Easy to add new projects
- Simple to update content

### ✅ Future-Proof
- Easy to swap design systems
- Content survives design changes
- No vendor lock-in

## Type Safety Rules

### DO ✅
- Use these types when creating/updating project data
- Import types with `import type` for better tree-shaking
- Extend interfaces when adding new fields
- Use type guards for runtime validation

### DON'T ❌
- Use `any` type - always use proper interfaces
- Mix content and design concerns in one file
- Bypass the adapter - always transform through it
- Modify showcase types directly - those come from showcase repo

## File Protection

These files should **NEVER** be synced from portfolio-showcase:

```
✋ PROTECTED FILES (Never overwrite)
├── portfolio_src/src/types/portfolio.types.ts
├── portfolio_src/src/data/projectData.ts
└── portfolio_src/src/adapters/portfolioAdapter.ts
```

These contain YOUR content and should be excluded in `.syncignore`.

## Adding New Projects

When adding a new project:

1. **Update TypeScript types** (if needed):
   ```typescript
   // Add to ProjectData interface
   export interface ProjectData {
     eastleigh: ProjectInfo;
     delivah: ProjectInfo;
     edumanage: ProjectInfo;
     newProject: ProjectInfo; // ← Add here
   }
   ```

2. **Add project data** in `projectData.ts`:
   ```typescript
   export const projectsData: ProjectData = {
     // ... existing projects
     newProject: {
       id: 'new-project',
       name: 'New Project Name',
       // ... rest of data
     }
   };
   ```

3. **Update adapter** (if needed) in `portfolioAdapter.ts`:
   ```typescript
   // Adapter will automatically handle new project
   // Only update if new project has unique structure
   ```

## Type Utilities

### Project ID Type Guard

```typescript
import { isProjectId } from './types/portfolio.types';

const id: string = 'eastleigh';
if (isProjectId(id)) {
  // TypeScript knows id is 'eastleigh' | 'delivah' | 'edumanage'
  const project = projectsData[id];
}
```

### Deep Partial

```typescript
import type { DeepPartial, ProjectInfo } from './types/portfolio.types';

// Useful for partial updates
const updates: DeepPartial<ProjectInfo> = {
  overview: {
    hero: 'Updated hero text'
  }
};
```

## Migration from JavaScript

If migrating existing JavaScript code:

1. Rename `.js` files to `.ts`
2. Add type imports: `import type { ProjectData } from './types/portfolio.types'`
3. Add type annotations: `const projectsData: ProjectData = { ... }`
4. Fix any type errors that appear
5. Remove any `@ts-ignore` comments

## Questions?

For questions about:
- **Content types** - Check this file
- **Showcase types** - Check portfolio-showcase repository
- **Adapter logic** - Check `portfolioAdapter.ts`

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0
