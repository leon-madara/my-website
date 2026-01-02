# Portfolio Page Layout Design

## Overview
The portfolio page follows a **two‑column responsive layout** with a fixed left navigation panel and a dynamic right content area. The main title sits at the top of the page, followed by three toggle buttons that switch between case‑study projects.

## Structural Elements
1. **Main Title** – `<h1 class="portfolio-header-title">Portfolio</h1>` positioned at the top of the `<header>` section.
2. **Project Toggle Buttons** – Three `<button class="project-toggle-btn">` elements inside `.project-toggle-container`. They display a badge (`01`, `02`, `03`) and a label for each case study. The third button (`EDUMANAGE`) is present in the HTML but will be ignored in documentation as requested.
3. **Left Navigation Panel** – `<aside class="accordion-nav">` contains an accordion menu with sections such as *Project Details*, *Problem*, *Goal*, *Impact*, etc. Each accordion item expands to reveal internal links (`<a class="accordion-link" data-page="0">`).
4. **Right Content Area** – `<div class="content-area">` holds a horizontally scrollable container (`.horizontal-pages`). Individual pages (`.content-page`) are loaded dynamically based on the selected project and accordion link.
5. **Footer / Additional UI** – The page includes a theme toggle animation (HTML stored in the global memory) and a page‑flip sound effect triggered by JavaScript (`portfolioContentLoader.js`).

## Interactive Features
- **Theme Toggle** – Animated switch with day/night scenery, defined in the memory snippet. It toggles CSS variables for light/dark mode.
- **Page Flip Sound** – Played on navigation between accordion sections using the `playFlipSound()` function in `portfolio.js`.
- **Accordion Animation** – Expands/collapses sections with smooth height transitions.
- **Horizontal Scrolling** – Swipes or arrow keys navigate between pages; the active page is highlighted in the navigation.

## Responsiveness
- On **mobile**, the left navigation collapses into a top drawer, and the project toggle buttons become a carousel.
- On **desktop**, the left panel remains sticky while the right content scrolls horizontally.

---
*All documentation reflects the current HTML structure in `public/portfolio.html`.*
