# Handoff

## Next Recommended Step

Review the slower `1.2s` React scenic-toggle timing across home/contact/design-process in a manual desktop/mobile pass, then decide whether to keep that immediate-theme/slow-celestial cadence as React-only behavior or mirror it into the legacy static `public/` scenic toggle.

## Notes

- Relevant files:
  - `public/css/portfolio.css`
  - `app/src/features/portfolio/PortfolioRoute.tsx`
  - `app/src/features/portfolio/TabbedCaseStudyRoute.tsx`
  - `app/src/features/portfolio/LongformCaseStudyRoute.tsx`
  - `app/src/features/portfolio/PortfolioEntrance.tsx`
  - `app/src/features/portfolio/PortfolioBackground.tsx`
  - `app/src/features/portfolio/portfolioContent.ts`
  - `app/src/features/portfolio/eastleighProject.ts`
  - `app/src/features/portfolio/legitLogisticsProject.ts`
  - `app/src/features/portfolio/eduManageProject.ts`
  - `app/src/features/portfolio/portfolio.css`
  - `app/src/features/home/HomeRoute.tsx`
  - `app/src/features/home/RoleSequence.tsx`
  - `app/src/features/home/RoleSequence.test.tsx`
  - `app/src/features/home/useHomeViewportLock.ts`
  - `app/src/features/about/AboutRoute.tsx`
  - `app/src/features/about/aboutContent.ts`
  - `app/src/features/about/useAboutAnimations.ts`
  - `app/src/features/about/about.css`
  - `app/src/features/contact/ContactRoute.tsx`
  - `app/src/features/contact/contactContent.ts`
  - `app/src/features/contact/contact.css`
  - `app/src/features/designProcess/DesignProcessRoute.tsx`
  - `app/src/features/designProcess/designProcess.css`
  - `app/src/features/designProcess/PixelImage.tsx`
  - `app/src/styles/global.css`
  - `app/src/shared/RouteErrorBoundary.tsx`
  - `app/src/shared/ThemeToggle.tsx`
  - `app/src/shared/AppLayout.tsx`
  - `app/src/shared/ProfileSidebar.tsx`
  - `app/public/js/theme-toggle-landscape-component.js`
  - `package.json`
  - `public/index.html`
  - `public/about.html`
  - `public/contact.html`
  - `public/portfolio.html`
  - `public/edumanage.html`
  - `public/js/about-parallax.js`
- Known risks:
  - The React app now depends on `app/public/js/theme-toggle-landscape-component.js`, and it intentionally diverges from `public/js/theme-toggle-landscape-component.js` because the React version is now hoverless
- `codex/react-overhaul` and `codex/design-process-page-react` now carry pushed scenic-toggle slowdown updates, so `main` is the remaining branch that still needs the matching timing commit if the React branches should stay in sync
  - Homepage parity still needs broader desktop/mobile comparison beyond sanity checks, especially whether the exact Magic UI cooldown handoff feels continuous with Leon's current hero typography
  - About page parity still needs broader desktop/mobile comparison beyond sanity checks, although its route-width and hero-structure mismatch has now had a first correction pass
  - Contact page parity still needs broader desktop/mobile comparison beyond sanity checks, although its route-width cap from the shared `.page-content` shell has now been fixed
  - Navigating from `/about` to `/contact` in the built React app can still trigger the known GSAP revert recursion crash; direct entry to `/contact` remains healthy
  - Design Process parity still needs broader desktop/mobile comparison beyond sanity checks
  - Eastleigh is much closer to the supplied screenshot states now, but Legit Logistics still needs the same screenshot-driven polish pass
  - EduManage still needs an explicit regression check after the portfolio-specific chrome changes
  - Existing mixed portfolio architecture until cutover
  - Route handling and static-hosting cutover complexity
  - React production build currently emits a single JS chunk slightly above Vite's default 500 kB warning threshold
