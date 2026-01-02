# Feature Implementation Plan for Portfolio Page

## 1. Main Title
- **Element**: `<h1 class="portfolio-header-title">Portfolio</h1>`
- **Behavior**: Static text displayed at the top of the page header. No interactive behavior required.

## 2. Project Toggle Buttons
- **Elements**: Three `<button class="project-toggle-btn">` inside `.project-toggle-container`.
- **Function**: When clicked, set `data-project` attribute on the container, update the active button class, and trigger loading of the corresponding project data via `portfolioContentLoader.js`.
- **Exclusions**: The third button (EDUMANAGE) is present in HTML but will be ignored in documentation and data files.

## 3. Left Navigation Panel (Accordion)
- **Element**: `<aside class="accordion-nav">` containing multiple `.accordion-item` sections.
- **Features**:
  - Expand/collapse with smooth height transition.
  - Each header (`.accordion-header`) toggles `aria-expanded` and shows a progress circle.
  - Links (`.accordion-link`) inside each item load a specific page in the right content area.
- **Implementation**: JavaScript in `portfolio.js` handles click events, updates active link styling, and calls `showPage(pageId)`.

## 4. Right Content Area (Horizontal Pages)
- **Element**: `<div class="content-area">` → `<div class="horizontal-pages">`.
- **Pages**: Individual `<div class="content-page" data-page="X">` elements loaded dynamically based on the selected project and accordion link.
- **Navigation**:
  - Arrow keys / swipe gestures move between pages.
  - Active page receives the `active` class for styling.
- **Implementation**: `portfolioContentLoader.js` fetches page templates from `projectData.js` and injects them.

## 5. Theme Toggle Animation
- **HTML (memory snippet)**: `<div class="theme-toggle-wrapper">…</div>`
- **Behavior**: Toggles a CSS class on `<body>` (`dark-mode`), switches CSS variables, and animates the day/night scenery and crater elements.
- **Implementation**: `themeToggle.js` listens for click on `#themeToggle` and adds/removes the class.

## 6. Page‑Flip Sound Effect
- **File**: `audio/page-flip.mp3` (referenced in `portfolio.js`).
- **Trigger**: Played each time an accordion link is activated (`playFlipSound()`).
- **Implementation**: Create an `Audio` object, preload it, and call `.play()` on navigation events.

## 7. Accordion Progress Circles
- **SVG**: Circular progress indicator inside each accordion header.
- **Logic**: `stroke-dashoffset` reflects completion percentage (updated via JavaScript when a section is marked complete).

## 8. Responsiveness
- **Mobile**: Left navigation collapses into a top drawer; toggle buttons become a carousel (CSS media queries).
- **Desktop**: Left panel remains sticky; right area scrolls horizontally.
- **Implementation**: Use CSS grid/flex layout with breakpoints at 768px.

## 9. Accessibility
- All interactive elements have appropriate `aria-label`, `role`, and keyboard support (Enter/Space to activate buttons, Arrow keys for page navigation).
- Focus outlines are visible, and the theme toggle respects `prefers-reduced-motion`.

---
*This plan outlines the expected behavior for each UI component. The actual implementation resides in the JavaScript and CSS files referenced above.*
