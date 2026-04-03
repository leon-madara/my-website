# Decisions

- Initially staged the rebuild at `/contact-rebuild` for safe iteration, then promoted it to `/contact` (2026-04-03).
- Use a single container contract for every section (prevents mobile clipping).
- Use CSS + IntersectionObserver for reveal motion (no GSAP requirement for this page).
- Keep the shared `.site-main` padding for most routes, but override it on `.contact-page` so the hero can go true full-viewport without changing other pages.
