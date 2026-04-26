# Handoff

Implementation is in `app/src/features/portfolio/TabbedCaseStudyRoute.tsx` and `app/src/features/portfolio/portfolio.css`.

The mobile story layout renders only when `(max-width: 768px)` matches. Desktop markup remains present for larger screens and uses the existing query-param driven section/page navigation.

Generated deploy assets were synced into `public/portfolio_build/assets`, and `public/portfolio.html` now points at the current hashed bundle names.
