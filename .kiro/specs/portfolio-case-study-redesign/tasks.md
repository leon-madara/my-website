# Implementation Plan: Portfolio Case Study Redesign

## Overview

This implementation transforms the portfolio page from a sidebar accordion layout to horizontal section pills with dropdowns and a full-width content card. The work is organized into phases: HTML structure, CSS styling, JavaScript functionality, and integration.

## Tasks

- [x] 1. Create Section Pills Row HTML Structure
  - Add new `.section-pills-row` container below project toggle buttons
  - Create 9 section pill buttons with number badges, labels, and chevron icons
  - Add dropdown menu structure inside each pill with sub-page links
  - Use data attributes to link pills to section configuration
  - _Requirements: 1.1, 1.2, 1.3, 2.6_

- [x] 2. Create Content Card HTML Structure
  - Replace existing `.content-wrapper` with new `.content-card` structure
  - Add card header with status badge, metadata row, title, tagline
  - Add tech stack pills container
  - Add divider element
  - Add section label and page title elements
  - Add page content container
  - Add pagination footer with Previous/Next buttons and dot indicators
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 8.1, 8.2_

- [x] 3. Style Section Pills Row
  - [x] 3.1 Style `.section-pills-row` as horizontal flex container with gap
    - Add horizontal scroll for overflow
    - Style scrollbar or hide it
    - _Requirements: 1.6_
  - [x] 3.2 Style `.section-pill` buttons
    - Pill shape with border-radius
    - Number badge styling (circular, Kenyan green)
    - Label typography (Space Mono, uppercase)
    - Chevron icon positioning
    - _Requirements: 1.2, 1.3_
  - [x] 3.3 Style active and hover states for pills
    - Active: darker fill, distinct border
    - Hover: subtle background change
    - _Requirements: 1.5_
  - [x] 3.4 Style `.pill-dropdown` menu
    - Position below pill
    - White background with shadow
    - Sub-page link styling
    - Show/hide transitions
    - _Requirements: 2.1, 2.2_

- [x] 4. Style Content Card
  - [x] 4.1 Style `.content-card` container
    - Full width layout
    - Background, border-radius, shadow
    - Vertical scroll for overflow
    - _Requirements: 3.1, 3.9_
  - [x] 4.2 Style card header elements
    - Status badge (amber/orange, top-left)
    - Metadata row (top-right alignment)
    - Project title (large serif, Asimovian)
    - Tagline (secondary text)
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 6.3, 6.5_
  - [x] 4.3 Style tech stack pills
    - Horizontal flex with wrap
    - Rounded pill badges
    - Consistent border and padding
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 4.4 Style divider and content area
    - Subtle divider line
    - Section label (uppercase, small)
    - Page title styling
    - _Requirements: 3.7, 3.8_
  - [x] 4.5 Style pagination controls
    - Previous/Next button styling
    - Dot indicators (filled vs outline)
    - Centered layout
    - _Requirements: 8.1, 8.2, 8.5_

- [x] 5. Implement Section Pills JavaScript
  - [x] 5.1 Create section configuration data structure
    - Define SECTIONS array with keys, numbers, labels, and pages
    - Match existing accordion structure
    - _Requirements: 2.6_
  - [x] 5.2 Implement dropdown toggle functionality
    - Click handler to open/close dropdowns
    - Close dropdown when clicking outside
    - Close previous dropdown when opening new one
    - _Requirements: 1.4, 2.1, 2.4, 2.5_
  - [x] 5.3 Implement sub-page navigation from dropdown
    - Click handler for dropdown links
    - Update state (currentSection, currentPage)
    - Close dropdown after selection
    - Update active pill styling
    - _Requirements: 2.3, 1.5_

- [x] 6. Implement Content Card JavaScript
  - [x] 6.1 Create project data structure
    - Define PROJECTS object with title, tagline, status, timeline, role, techStack
    - Include page content data
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 6.2 Implement content rendering function
    - Render card header from project data
    - Render tech stack pills
    - Render section label and page title
    - Render page content
    - _Requirements: 3.2-3.8, 4.4_
  - [x] 6.3 Implement pagination functionality
    - Previous button handler (navigate to previous page/section)
    - Next button handler (navigate to next page/section)
    - Dot indicator click handler
    - Update dot active states
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

- [x] 7. Implement Project Switching Integration
  - [x] 7.1 Update project toggle button handlers
    - Projects 1 and 2: render new layout, reset to first section/page
    - Project 3: redirect to edumanage.html
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 7.2 Preserve existing toggle button styling
    - Keep current active state styling (verified in portfolio.css)
    - Maintain Kenyan color scheme (green badges, red active border)
    - _Requirements: 5.4, 6.1, 6.4_

- [x] 8. Add Section Pills Responsive Styles
  - [x] 8.1 Add tablet breakpoint styles (768px) for section pills
    - Ensure section pills row has proper touch scrolling
    - Reduce pill padding and font sizes
    - Adjust dropdown positioning for smaller screens
    - _Requirements: 7.1_
  - [x] 8.2 Add mobile breakpoint styles (480px) for section pills
    - Abbreviate or hide pill labels, show only numbers
    - Reduce pill number badge size
    - Adjust dropdown width for mobile
    - _Requirements: 7.4_

- [x] 9. Hide Old Accordion Sidebar for New Layout
  - [x] 9.1 Add CSS to hide `.accordion-nav` and `.content-wrapper` when content card is active
    - Use display:none or visibility:hidden for Projects 1 and 2
    - Ensure content card takes full width when accordion is hidden
    - _Requirements: 3.1_
  - [x] 9.2 Add JavaScript logic to toggle visibility based on active project
    - Show new layout (section pills + content card) for Projects 1 and 2
    - Keep accordion code available for potential future use
    - _Requirements: 3.1_

- [x] 10. Checkpoint - Visual and Functional Testing
  - Ensure all section pills render correctly
  - Test dropdown open/close behavior
  - Test navigation through all sections and pages
  - Test pagination Previous/Next and dots
  - Test project switching
  - Test responsive behavior at breakpoints
  - Verify accordion is hidden when new layout is active
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Write Property Tests
  - [x] 11.1 Write property test for section pill structure
    - **Property 1: Section Pill Structure Consistency**
    - **Validates: Requirements 1.2**
  - [x] 11.2 Write property test for dropdown content
    - **Property 2: Dropdown Contains Correct Sub-Pages**
    - **Validates: Requirements 1.4, 2.1, 2.2**
  - [x] 11.3 Write property test for dropdown mutual exclusivity
    - **Property 3: Dropdown Mutual Exclusivity**
    - **Validates: Requirements 2.5**
  - [x] 11.4 Write property test for navigation state
    - **Property 7: Project Switch Resets Navigation State**
    - **Validates: Requirements 5.3**
  - [x] 11.5 Write property test for pagination
    - **Property 8: Pagination Dot Count Matches Section Pages**
    - **Property 9: Pagination Navigation Correctness**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5**

- [x] 12. Final Checkpoint
  - Run all property-based tests and ensure they pass
  - Verify visual design matches reference images
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- The existing accordion code is preserved but hidden, not deleted
