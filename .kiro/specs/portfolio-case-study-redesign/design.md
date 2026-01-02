# Design Document: Portfolio Case Study Redesign

## Overview

This design transforms the portfolio page navigation from a left sidebar accordion to a horizontal pill-based navigation system with dropdowns. The content area becomes a full-width card with a structured header containing project metadata, status badge, and tech stack pills. This redesign applies only to Projects 01 (Eastleigh Turf Flow) and 02 (Delivah Logistics), while Project 03 (EduManage) continues to use its dedicated page.

The key changes are:
1. Replace the 22% width accordion sidebar with horizontal section pills
2. Each pill has a dropdown showing sub-pages for that section
3. Content card expands to full width with improved header layout
4. Add carousel pagination (Previous/Next + dots) at the bottom

## Architecture

The redesign modifies the existing portfolio page structure while preserving the core navigation logic and content data.

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo                    Nav Pills (Home, About, Portfolio...)  │
├─────────────────────────────────────────────────────────────────┤
│         Project Toggle Buttons (01, 02, 03) [UNCHANGED]         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ...   │
│  │01 ▼│ │02 ▼│ │03 ▼│ │04 ▼│ │05 ▼│ │06 ▼│ │07 ▼│        │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│           Section Pills Row (NEW - horizontally scrollable)     │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [Production-Ready]              Timeline: 3w | Role: FSD  │  │
│  │                                                           │  │
│  │ Eastleigh Turf Flow                                       │  │
│  │ Full-stack e-commerce platform for turf installation...   │  │
│  │                                                           │  │
│  │ [React 18] [Supabase] [Tailwind CSS] [Vercel]            │  │
│  │ ─────────────────────────────────────────────────────────│  │
│  │ PROJECT DETAILS                                           │  │
│  │ Overview                                                  │  │
│  │                                                           │  │
│  │ [Page content here...]                                    │  │
│  │                                                           │  │
│  │ < Previous          ● ○ ○              Next >             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                    Content Card (NEW - full width)              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
portfolio.html
├── Header (UNCHANGED)
│   ├── Logo
│   └── Nav Pills
├── Portfolio Container
│   ├── Portfolio Header Section (UNCHANGED)
│   ├── Project Toggle Container (UNCHANGED)
│   ├── Section Pills Row (NEW)
│   │   ├── Section Pill (×9)
│   │   │   ├── Number Badge
│   │   │   ├── Section Name
│   │   │   ├── Chevron Icon
│   │   │   └── Dropdown Menu
│   │   │       └── Sub-page Links
│   └── Content Card (NEW)
│       ├── Card Header
│       │   ├── Status Badge
│       │   ├── Metadata (Timeline, Role)
│       │   ├── Project Title
│       │   ├── Project Description
│       │   └── Tech Stack Pills
│       ├── Divider
│       ├── Section Label
│       ├── Page Title
│       ├── Page Content
│       └── Pagination Controls
│           ├── Previous Link
│           ├── Dot Indicators
│           └── Next Link
└── Sidebar (UNCHANGED - profile card)
```

## Components and Interfaces

### Section Pills Row Component

**Purpose:** Horizontal navigation showing all 9 sections as clickable pills with dropdowns.

**HTML Structure:**
```html
<div class="section-pills-row">
  <button class="section-pill active" data-section="details">
    <span class="pill-number">01</span>
    <span class="pill-label">Project Details</span>
    <svg class="pill-chevron">...</svg>
    <div class="pill-dropdown">
      <a href="#overview" class="dropdown-link active">Overview</a>
      <a href="#role-timeline" class="dropdown-link">Role & Timeline</a>
      <a href="#tech-stack" class="dropdown-link">Tech Stack</a>
    </div>
  </button>
  <!-- Repeat for all 9 sections -->
</div>
```

**CSS Classes:**
- `.section-pills-row` - Flex container, horizontal scroll on overflow
- `.section-pill` - Individual pill button with dropdown trigger
- `.section-pill.active` - Active section styling (darker fill)
- `.section-pill.open` - Dropdown is visible
- `.pill-number` - Circular number badge
- `.pill-label` - Section name text
- `.pill-chevron` - Dropdown indicator icon
- `.pill-dropdown` - Dropdown menu container
- `.dropdown-link` - Individual sub-page link

### Content Card Component

**Purpose:** Full-width card displaying project information and page content.

**HTML Structure:**
```html
<div class="content-card">
  <header class="card-header">
    <div class="header-top-row">
      <span class="status-badge">Production-Ready</span>
      <div class="header-metadata">
        <span class="meta-item"><strong>Timeline</strong> 3 weeks</span>
        <span class="meta-item"><strong>Role</strong> Full Stack Developer</span>
      </div>
    </div>
    <h1 class="project-title">Eastleigh Turf Flow</h1>
    <p class="project-tagline">Full-stack e-commerce platform for a professional turf installation business.</p>
    <div class="tech-stack-pills">
      <span class="tech-pill">React 18 with TypeScript</span>
      <span class="tech-pill">Supabase backend with RLS</span>
      <span class="tech-pill">Tailwind CSS UI</span>
      <span class="tech-pill">CI/CD via Vercel</span>
    </div>
  </header>
  <hr class="card-divider">
  <div class="card-content">
    <span class="section-label">PROJECT DETAILS</span>
    <h2 class="page-title">Overview</h2>
    <div class="page-content">
      <!-- Dynamic content here -->
    </div>
  </div>
  <footer class="card-pagination">
    <button class="pagination-prev">< Previous</button>
    <div class="pagination-dots">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <button class="pagination-next">Next ></button>
  </footer>
</div>
```

### JavaScript Interface

**State Management:**
```javascript
const portfolioState = {
  currentProject: 1,           // 1, 2, or 3
  currentSection: 'details',   // Section key
  currentPage: 0,              // Sub-page index within section
  openDropdown: null           // Currently open dropdown section key
};
```

**Key Functions:**
- `openDropdown(sectionKey)` - Opens dropdown for specified section
- `closeAllDropdowns()` - Closes any open dropdowns
- `navigateToPage(sectionKey, pageIndex)` - Updates content and state
- `navigatePrevious()` - Goes to previous page/section
- `navigateNext()` - Goes to next page/section
- `updatePaginationDots()` - Updates dot indicators for current section

## Data Models

### Section Configuration

```javascript
const SECTIONS = [
  {
    key: 'details',
    number: '01',
    label: 'Project Details',
    pages: [
      { id: 'overview', title: 'Overview' },
      { id: 'role-timeline', title: 'Role & Timeline' },
      { id: 'tech-stack', title: 'Tech Stack' }
    ]
  },
  {
    key: 'problem',
    number: '02',
    label: 'Problem',
    pages: [
      { id: 'challenge', title: 'The Challenge' },
      { id: 'pain-points', title: 'Pain Points' }
    ]
  },
  // ... remaining 7 sections
];
```

### Project Data

```javascript
const PROJECTS = {
  1: {
    title: 'Eastleigh Turf Flow',
    tagline: 'Full-stack e-commerce platform for a professional turf installation business.',
    status: 'Production-Ready',
    timeline: '3 weeks',
    role: 'Full Stack Developer',
    techStack: [
      'React 18 with TypeScript',
      'Supabase backend with RLS',
      'Tailwind CSS UI',
      'CI/CD via Vercel'
    ],
    // Page content data...
  },
  2: {
    title: 'Delivah Logistics',
    // Similar structure...
  }
};
```

## Error Handling

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Invalid section key | Default to 'details' section |
| Invalid page index | Clamp to valid range (0 to pages.length - 1) |
| Project 3 selected | Redirect to edumanage.html |
| Dropdown click outside | Close dropdown via document click listener |
| Rapid navigation clicks | Debounce navigation functions |

## Testing Strategy

### Unit Tests
- Section pill rendering with correct numbers and labels
- Dropdown open/close behavior
- Navigation state updates
- Pagination boundary conditions (first page, last page)
- Project switching resets state

### Integration Tests
- Full navigation flow: pill click → dropdown → sub-page → content update
- Previous/Next navigation across section boundaries
- Project switching preserves correct layout
- Responsive behavior at breakpoints

### Property-Based Tests
- Navigation state consistency
- Dropdown mutual exclusivity
- Pagination dot count matches section pages



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified for property-based testing:

### Property 1: Section Pill Structure Consistency

*For any* section pill in the section pills row, it SHALL contain a number prefix matching its position (01-09) and the correct section name from the SECTIONS configuration.

**Validates: Requirements 1.2**

### Property 2: Dropdown Contains Correct Sub-Pages

*For any* section pill clicked, the displayed dropdown SHALL contain exactly the number of sub-page links defined for that section in the SECTIONS configuration, with matching titles.

**Validates: Requirements 1.4, 2.1, 2.2**

### Property 3: Dropdown Mutual Exclusivity

*For any* two different section pills, if the first has an open dropdown and the second is clicked, then only the second dropdown SHALL be open (the first must close).

**Validates: Requirements 2.5**

### Property 4: Sub-Page Navigation Updates Content

*For any* sub-page link clicked in a dropdown, the content card SHALL update to display the corresponding section label and page title, and the dropdown SHALL close.

**Validates: Requirements 2.3, 3.8**

### Property 5: Content Card Header Renders Project Data

*For any* project (1 or 2) selected, the content card header SHALL display the correct status badge, timeline, role, project title, tagline, and tech stack pills matching the project's data configuration.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 6: Tech Stack Pills Persist Across Navigation

*For any* section and page navigation within a project, the tech stack pills in the content card header SHALL remain visible and unchanged.

**Validates: Requirements 4.4**

### Property 7: Project Switch Resets Navigation State

*For any* switch between Project 01 and Project 02, the navigation state SHALL reset to the first section (Project Details) and first sub-page (Overview).

**Validates: Requirements 5.3**

### Property 8: Pagination Dot Count Matches Section Pages

*For any* section currently active, the number of pagination dot indicators SHALL equal the number of sub-pages defined for that section.

**Validates: Requirements 8.2**

### Property 9: Pagination Navigation Correctness

*For any* current page index within a section:
- Clicking "Previous" when page > 0 SHALL decrement the page index by 1
- Clicking "Next" when page < (section.pages.length - 1) SHALL increment the page index by 1
- Exactly one dot indicator SHALL have the active state, matching the current page index

**Validates: Requirements 8.3, 8.4, 8.5**

### Property 10: Dot Indicator Direct Navigation

*For any* dot indicator clicked, the current page index SHALL update to match that dot's position index, and the content SHALL update accordingly.

**Validates: Requirements 8.6**

### Property 11: Active Section Styling

*For any* navigation state, exactly one section pill SHALL have the active styling class, corresponding to the currently displayed section.

**Validates: Requirements 1.5**

