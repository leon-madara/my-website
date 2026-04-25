# Done

- Created `codex/mobile-portfolio-story-scroll` after checkpointing the previous dirty branch state.
- Added mobile-only story markup for tabbed case studies.
- Added sticky chapter status/progress UI for mobile.
- Added mobile active-page tracking and URL compatibility updates.
- Added mobile CSS for the new app-like case-study workspace.
- Built and synced generated portfolio assets for `public/portfolio.html`.
- Verified mobile and desktop behavior in local Chrome.
- Removed the mobile story content card frame so the reading area flows as a full-width white surface below the chapter bar.
- Extended the mobile story reading surface to the bottom of the viewport while preserving internal scroll padding.
- Refined the mobile chapter indicator to use a deep green treatment for number, title, and progress.
- Added section-specific mobile colors so the active chapter indicator and matching in-content section label share the same color.
- Fixed mobile deep-link scrolling so `/portfolio?section=problem&page=challenge` lands on the requested story section.
- Simplified the mobile chapter/section accent to one uniform readable red.
