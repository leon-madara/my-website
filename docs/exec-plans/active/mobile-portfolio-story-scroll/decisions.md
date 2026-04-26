# Decisions

- Scope is mobile only; existing desktop/tablet tabbed behavior remains the source interaction for larger screens.
- Mobile uses continuous story scrolling rather than page snapping.
- Query params remain compatible with the existing `section` and `page` model.
- `app/src/features/portfolio` is the editable source; `public/portfolio_build` is generated deploy output.

