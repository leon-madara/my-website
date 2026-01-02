# Requirements Document

## Introduction

This feature redesigns the portfolio page layout for Projects 01 (Eastleigh Turf Flow) and 02 (Delivah Logistics). The redesign replaces the left sidebar accordion navigation with horizontal section tabs featuring dropdowns, and restructures the content area into a full-width card with improved layout and spacing. Project 03 (EduManage) remains unchanged and continues to redirect to its dedicated page.

## Glossary

- **Section_Tab**: A horizontal pill-shaped button representing one of the 9 case study sections, with a dropdown chevron
- **Section_Dropdown**: A dropdown menu that appears when a Section_Tab is clicked, containing links to sub-pages within that section
- **Content_Card**: The main content area displaying project information, status, metadata, tech stack, and page content
- **Tech_Stack_Pills**: Horizontal row of rounded badge elements displaying the technologies used in a project
- **Status_Badge**: A colored label indicating the project's current status (e.g., "Production-Ready")
- **Sub_Page**: An individual content page within a section (e.g., "Overview" within "Project Details")
- **Portfolio_System**: The overall portfolio page component managing navigation and content display

## Requirements

### Requirement 1: Horizontal Section Pills with Dropdowns

**User Story:** As a portfolio visitor, I want to see all 9 case study sections as horizontal pill buttons with dropdowns, so that I can quickly understand the structure and navigate between sections.

#### Acceptance Criteria

1. WHEN the portfolio page loads, THE Portfolio_System SHALL display 9 horizontal Section_Tabs arranged as pill-shaped buttons in a single row below the project toggle buttons
2. THE Section_Tab SHALL display a number prefix (01-09) and section name for each of the 9 sections: Project Details, Problem, Goal, Impact, Early Adoption, Testing, Final Designs, Development, Future Steps
3. THE Section_Tab SHALL include a dropdown chevron icon on each pill indicating expandable content
4. WHEN a user clicks a Section_Tab pill, THE Portfolio_System SHALL display a dropdown menu below that pill showing the sub-pages for that section
5. WHEN a Section_Tab is active, THE Portfolio_System SHALL apply distinct styling (darker fill) to indicate the current section
6. WHILE the viewport width is insufficient for all 9 pills, THE Section_Tab row SHALL be horizontally scrollable

### Requirement 2: Section Dropdown Navigation

**User Story:** As a portfolio visitor, I want to click a section tab to see its sub-pages in a dropdown, so that I can navigate to specific content within each section.

#### Acceptance Criteria

1. WHEN a user clicks a Section_Tab, THE Portfolio_System SHALL display a Section_Dropdown below the clicked tab
2. THE Section_Dropdown SHALL contain links to all Sub_Pages within that section
3. WHEN a user clicks a Sub_Page link in the dropdown, THE Portfolio_System SHALL navigate to that content and close the dropdown
4. WHEN a user clicks outside the Section_Dropdown, THE Portfolio_System SHALL close the dropdown
5. WHEN a different Section_Tab is clicked while a dropdown is open, THE Portfolio_System SHALL close the previous dropdown and open the new one
6. THE Section_Dropdown SHALL maintain the existing sub-page structure from the current accordion (e.g., Project Details contains Overview, Role & Timeline, Tech Stack)

### Requirement 3: Full-Width Content Card Layout

**User Story:** As a portfolio visitor, I want to see project content in a clean, full-width card, so that I can focus on the case study details without sidebar distractions.

#### Acceptance Criteria

1. THE Content_Card SHALL span the full available width of the content area (removing the 22% sidebar)
2. THE Content_Card SHALL display a Status_Badge in the top-left corner showing the project status
3. THE Content_Card SHALL display project metadata (Timeline, Role) in the top-right corner
4. THE Content_Card SHALL display the project title as a large serif heading below the status/metadata row
5. THE Content_Card SHALL display a one-line project description/tagline below the title
6. THE Content_Card SHALL display Tech_Stack_Pills as a horizontal row of rounded badges below the description
7. THE Content_Card SHALL include a visual divider separating the header area from the page content
8. THE Content_Card SHALL display the current section label (e.g., "PROJECT DETAILS") above the page title
9. THE Content_Card SHALL allow vertical scrolling for content that exceeds the viewport height

### Requirement 4: Tech Stack Pills Display

**User Story:** As a portfolio visitor, I want to see the technologies used in a project as visual badges, so that I can quickly understand the technical stack.

#### Acceptance Criteria

1. THE Tech_Stack_Pills SHALL display as horizontally arranged rounded pill badges
2. THE Tech_Stack_Pills SHALL wrap to multiple lines if the viewport width is insufficient
3. THE Tech_Stack_Pills SHALL use consistent styling (border, padding, typography) matching the design reference
4. THE Tech_Stack_Pills SHALL be displayed only in the Content_Card header area, visible regardless of current section

### Requirement 5: Project Switching Behavior

**User Story:** As a portfolio visitor, I want to switch between projects and see the appropriate content, so that I can explore different case studies.

#### Acceptance Criteria

1. WHEN a user clicks Project 01 or Project 02 toggle button, THE Portfolio_System SHALL display the new horizontal tabs layout with Content_Card
2. WHEN a user clicks Project 03 (EduManage) toggle button, THE Portfolio_System SHALL redirect to the dedicated edumanage.html page
3. WHEN switching between Project 01 and Project 02, THE Portfolio_System SHALL reset to the first section (Project Details) and first sub-page (Overview)
4. THE Portfolio_System SHALL preserve the existing project toggle button styling and behavior

### Requirement 6: Visual Design Consistency

**User Story:** As a portfolio visitor, I want the redesigned layout to maintain the Kenyan-inspired visual identity, so that the experience feels cohesive with the rest of the site.

#### Acceptance Criteria

1. THE Portfolio_System SHALL maintain the existing Kenyan color palette (green #006b3f, red #ce1126, black)
2. THE Portfolio_System SHALL maintain the dotted background pattern
3. THE Content_Card SHALL use the existing typography system (Asimovian for headings, Space Mono for labels, system fonts for body)
4. THE Section_Tab and Section_Dropdown SHALL use styling consistent with the existing design tokens (borders, shadows, border-radius)
5. THE Status_Badge SHALL use amber/orange coloring to indicate "Production-Ready" status

### Requirement 7: Responsive Behavior

**User Story:** As a mobile user, I want the portfolio to adapt to smaller screens, so that I can browse case studies on any device.

#### Acceptance Criteria

1. WHILE the viewport width is below 768px, THE Section_Tab row SHALL be horizontally scrollable with touch support
2. WHILE the viewport width is below 768px, THE Content_Card metadata SHALL stack vertically instead of side-by-side
3. WHILE the viewport width is below 768px, THE Tech_Stack_Pills SHALL wrap to multiple lines as needed
4. IF the viewport width is below 480px, THEN THE Section_Tab labels MAY be abbreviated or hidden, showing only numbers

### Requirement 8: Carousel Pagination Controls

**User Story:** As a portfolio visitor, I want Previous/Next navigation and page indicators, so that I can easily move between content pages within a section.

#### Acceptance Criteria

1. THE Content_Card SHALL display "< Previous" and "Next >" navigation links at the bottom of the content area
2. THE Content_Card SHALL display dot indicators showing the current page position within the section
3. WHEN a user clicks "Previous", THE Portfolio_System SHALL navigate to the previous Sub_Page (or previous section's last page if at first page)
4. WHEN a user clicks "Next", THE Portfolio_System SHALL navigate to the next Sub_Page (or next section's first page if at last page)
5. THE dot indicators SHALL highlight the current page with distinct styling (filled vs outline)
6. WHEN a user clicks a dot indicator, THE Portfolio_System SHALL navigate directly to that Sub_Page
