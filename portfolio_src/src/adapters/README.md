# Portfolio Data Adapter

The Portfolio Adapter is the **bridge** between YOUR content data and the showcase design components.

## Purpose

This adapter solves a critical problem:

**YOUR DATA** ≠ **SHOWCASE COMPONENT FORMAT**

Your project data is structured for content management and maintainability. Showcase components expect a specific format optimized for UI rendering. The adapter transforms one to the other.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   YOUR CONTENT (Input)                      │
│                   projectData.ts                            │
│                                                             │
│  {                                                          │
│    eastleigh: {                                             │
│      id: 'eastleigh',                                       │
│      name: 'Eastleigh Turf Flow',                           │
│      overview: { hero, problem, solution, keyFeatures },    │
│      technical: { stack, architecture, challenges },        │
│      impact: { metrics, businessValue },                    │
│      process: { research, methodology, timeline }           │
│    }                                                        │
│  }                                                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ portfolioAdapter.adaptPortfolioData()
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADAPTER LAYER                              │
│              portfolioAdapter.ts                            │
│                                                             │
│  - adaptProject(): Transform single project                │
│  - adaptSections(): Map content → pages                     │
│  - extractHighlights(): Pull tech stack                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               SHOWCASE FORMAT (Output)                      │
│                 ShowcaseProject                             │
│                                                             │
│  {                                                          │
│    id: 'eastleigh',                                         │
│    badge: '01',                                             │
│    title: 'Eastleigh Turf Flow',                            │
│    highlights: ['React 18', 'TypeScript', ...],             │
│    sections: [                                              │
│      { id: 'details', pages: [...] },                       │
│      { id: 'problem', pages: [...] },                       │
│      { id: 'impact', pages: [...] }                         │
│    ]                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage

### Basic Usage

```typescript
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

// Transform all projects
const { projects, projectsMap } = adaptPortfolioData(projectsData);

// Access by array index
const firstProject = projects[0]; // Eastleigh

// Access by ID
const eastleigh = projectsMap['eastleigh'];
const delivah = projectsMap['delivah'];
const edumanage = projectsMap['edumanage'];
```

### Single Project

```typescript
import { getProject } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

const eastleigh = getProject(projectsData, 'eastleigh');

if (eastleigh) {
  console.log(eastleigh.sections); // Array of ShowcaseSection
}
```

### With React Components

```typescript
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';
import { HorizontalScroller } from 'portfolio-showcase';

function PortfolioPage() {
  const { projects } = adaptPortfolioData(projectsData);

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          
          {/* Pass sections to showcase component */}
          <HorizontalScroller sections={project.sections} />
        </div>
      ))}
    </div>
  );
}
```

---

## Transformation Flow

### 1. Project Transformation

**Input**: `ProjectInfo` (your format)
```typescript
{
  id: 'eastleigh',
  name: 'Eastleigh Turf Flow',
  tagline: 'Modern E-Commerce Platform',
  hero: { role, client, duration, status },
  overview: { hero, problem, solution, keyFeatures },
  technical: { stack, architecture, challenges },
  // ... more content
}
```

**Output**: `ShowcaseProject` (showcase format)
```typescript
{
  id: 'eastleigh',
  badge: '01',
  title: 'Eastleigh Turf Flow',
  summary: 'Modern E-Commerce Platform',
  timeline: '3 weeks',
  role: 'Full Stack Developer',
  highlights: ['React 18', 'TypeScript', 'Vite', 'Supabase'],
  sections: [...] // See below
}
```

---

### 2. Section Mapping

The adapter maps your rich content structure to a flat page-based structure:

| Your Content | Showcase Section | Pages From |
|--------------|-----------------|------------|
| `overview.hero` + `hero` | **Project Details** | Overview, Role & Team, Timeline |
| `challenge` + `overview.problem` | **Problem** | Challenge description + individual problems |
| `solution` + `overview.solution` | **Goal** | Objectives + benefits |
| `impact` | **Impact** | Metrics + Business Value |
| `research` + `process.research` | **Early Adoption** | User Research insights |
| `technical.challenges` | **Testing** | Each challenge as a page |
| `overview.keyFeatures` | **Final Designs** | Each feature as a page |
| `technical.*` | **Development** | Stack + Architecture + Key Decisions |
| `futureEnhancements` + `process.lessonsLearned` | **Future Steps** | Roadmap + Lessons |

---

### 3. Highlight Extraction

Tech stack highlights are extracted in priority order:

**Priority 1**: `technical.stack` array (first 4 items)
```typescript
[
  { name: 'React', version: '18+', purpose: '...' },
  { name: 'TypeScript', version: '97%+ coverage', purpose: '...' }
]
// → ['React (18+)', 'TypeScript (97%+ coverage)']
```

**Priority 2**: `quickStats.techStack` string
```typescript
'React 18, TypeScript, Vite, Supabase'
// → ['React 18', 'TypeScript', 'Vite', 'Supabase']
```

**Fallback**: Empty array `[]`

---

## Section Structure

Each section follows this structure:

```typescript
interface ShowcaseSection {
  id: string;        // Unique identifier
  title: string;     // Display title
  pages: ShowcasePage[];
}

interface ShowcasePage {
  id: number;        // Numeric page ID
  title: string;     // Page title
  content: string;   // Markdown content
}
```

### Example: Impact Section

**Your Content**:
```typescript
impact: {
  metrics: [
    { label: 'TypeScript Coverage', value: '97%+', description: 'Prevented errors' },
    { label: 'Page Load Time', value: '<2s', description: 'Vite optimization' }
  ],
  businessValue: 'Demonstrates ability to build modern e-commerce...'
}
```

**Adapted Output**:
```typescript
{
  id: 'impact',
  title: 'Impact',
  pages: [
    {
      id: 10,
      title: 'Results',
      content: `**TypeScript Coverage**: 97%+
Prevented errors

**Page Load Time**: <2s
Vite optimization`
    },
    {
      id: 11,
      title: 'Business Value',
      content: 'Demonstrates ability to build modern e-commerce...'
    }
  ]
}
```

---

## Method Reference

### `adaptPortfolioData(projectsData: ProjectData): AdaptedPortfolioData`

**Purpose**: Transform all projects from your format to showcase format

**Input**: Complete `ProjectData` object with all projects

**Output**: Object containing:
- `projects`: Array of `ShowcaseProject` (ordered: Eastleigh, Delivah, EduManage)
- `projectsMap`: Object mapping project ID → `ShowcaseProject`

**Example**:
```typescript
const { projects, projectsMap } = adaptPortfolioData(projectsData);

// Array access
projects[0]; // Eastleigh (badge '01')
projects[1]; // Delivah (badge '02')
projects[2]; // EduManage (badge '03')

// Map access
projectsMap['eastleigh'];
projectsMap['delivah'];
projectsMap['edumanage'];
```

---

### `getProject(projectsData: ProjectData, projectId: string): ShowcaseProject | undefined`

**Purpose**: Get a single adapted project by ID

**Input**: 
- `projectsData`: Complete project data
- `projectId`: ID of project to retrieve

**Output**: Adapted project or `undefined` if not found

**Example**:
```typescript
const eastleigh = getProject(projectsData, 'eastleigh');

if (eastleigh) {
  console.log(eastleigh.title);    // "Eastleigh Turf Flow"
  console.log(eastleigh.sections); // Array of sections
}
```

---

## Integration Patterns

### Pattern 1: Static Site Generation

```typescript
// During build time
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

const { projects } = adaptPortfolioData(projectsData);

// Generate HTML for each project
projects.forEach((project) => {
  generateProjectPage(project);
});
```

### Pattern 2: React Component

```typescript
import { useState, useEffect } from 'react';
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

function Portfolio() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const adapted = adaptPortfolioData(projectsData);
    setData(adapted);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Pattern 3: API Endpoint

```typescript
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

export async function GET(request: Request) {
  const { projects, projectsMap } = adaptPortfolioData(projectsData);

  return new Response(JSON.stringify({ projects }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## Benefits

### 1. **Content Independence**
Your data structure never changes. Update showcase components without touching content.

### 2. **Type Safety**
Full TypeScript support catches errors at compile time.

### 3. **Single Source of Truth**
All transformation logic in one place. Easy to update and test.

### 4. **Future-Proof**
Swap out showcase design system without rewriting content.

### 5. **Versioning**
Handle multiple showcase versions by adapting differently.

---

## Troubleshooting

### Missing Sections?

**Problem**: Some sections don't appear in adapted output

**Solution**: Check if source data exists:
```typescript
// Missing impact section?
if (!project.impact) {
  // Add impact data to projectData.ts
}
```

### Wrong Highlight Count?

**Problem**: Not getting 4 highlights

**Solution**: Ensure `technical.stack` has at least 4 items:
```typescript
technical: {
  stack: [
    { name: 'React', version: '18+', purpose: '...' },
    { name: 'TypeScript', version: '97%', purpose: '...' },
    { name: 'Vite', version: 'Latest', purpose: '...' },
    { name: 'Supabase', version: 'Latest', purpose: '...' }
  ]
}
```

### Type Errors?

**Problem**: TypeScript complaining about mismatched types

**Solution**: Verify your data matches `ProjectInfo` interface:
```bash
npx tsc --noEmit portfolio_src/src/data/projectData.ts
```

---

## Testing

### Manual Testing

```typescript
import { adaptPortfolioData } from './adapters/portfolioAdapter';
import projectsData from './data/projectData';

const { projects, projectsMap } = adaptPortfolioData(projectsData);

// Verify structure
console.assert(projects.length === 3, 'Should have 3 projects');
console.assert(projectsMap['eastleigh'], 'Eastleigh should exist');

// Verify sections
projects.forEach((project) => {
  console.assert(project.sections.length > 0, 'Should have sections');
  project.sections.forEach((section) => {
    console.assert(section.pages.length > 0, 'Should have pages');
  });
});
```

### Unit Testing (Optional)

```typescript
import { describe, it, expect } from 'vitest';
import { adaptPortfolioData } from './portfolioAdapter';
import projectsData from '../data/projectData';

describe('portfolioAdapter', () => {
  it('should transform all projects', () => {
    const result = adaptPortfolioData(projectsData);
    
    expect(result.projects).toHaveLength(3);
    expect(result.projectsMap['eastleigh']).toBeDefined();
  });

  it('should extract highlights correctly', () => {
    const { projectsMap } = adaptPortfolioData(projectsData);
    const eastleigh = projectsMap['eastleigh'];
    
    expect(eastleigh.highlights).toHaveLength(4);
    expect(eastleigh.highlights[0]).toContain('React');
  });
});
```

---

## Future Enhancements

### Planned Features

1. **Multiple Output Formats**
   - JSON API format
   - Static HTML format
   - PDF export format

2. **Validation Layer**
   - Runtime validation with Zod
   - Schema mismatch warnings
   - Missing content detection

3. **Performance Optimization**
   - Memoization for repeated calls
   - Lazy transformation
   - Caching layer

4. **Version Support**
   - Handle multiple showcase versions
   - Backward compatibility
   - Migration utilities

---

## Related Files

- **Type Definitions**: `../types/portfolio.types.ts`
- **Content Data**: `../data/projectData.ts`
- **Type Documentation**: `../types/README.md`

---

## Questions?

For questions about the adapter:
- **Developer**: Leon Madara
- **Repository**: leon-madara/my-website
- **Issue Tracker**: https://github.com/leon-madara/my-website/issues

---

**Last Updated**: January 8, 2026  
**Version**: 1.0.0
