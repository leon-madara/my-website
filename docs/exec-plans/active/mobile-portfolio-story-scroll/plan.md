# Plan

- Keep desktop and tablet behavior on the existing tabbed/page navigation.
- Add a mobile-only story layout in `app/src/features/portfolio/TabbedCaseStudyRoute.tsx`.
- Track the active mobile story page with `IntersectionObserver` and keep `section`/`page` query params compatible through `replace: true` updates.
- Use `app/src/features/portfolio/portfolio.css` as the mobile layout surface, with a `100dvh` app-like workspace, stable project selector, sticky chapter bar, and one internal scroll area.
- Build the React app and deliberately sync generated assets into `public/portfolio_build` for deployment.

