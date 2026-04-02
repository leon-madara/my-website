# Handoff

## Next Recommended Step

Browser-validate the React homepage hero against `public/index.html` with a specific focus on the newly ported organic floating blobs (light/dark theme + reduced-motion), then continue the screenshot-driven parity pass on Legit Logistics and regression-check EduManage under the updated portfolio shell.

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
  - `package.json`
  - `public/index.html`
  - `public/about.html`
  - `public/contact.html`
  - `public/portfolio.html`
  - `public/edumanage.html`
  - `public/js/about-parallax.js`
- Known risks:
  - Homepage parity still needs broader desktop/mobile comparison beyond sanity checks, especially whether the exact Magic UI cooldown handoff feels continuous with Leon's current hero typography
  - About page parity still needs broader desktop/mobile comparison beyond sanity checks, although its route-width and hero-structure mismatch has now had a first correction pass
  - Contact page parity still needs broader desktop/mobile comparison beyond sanity checks, although its route-width cap from the shared `.page-content` shell has now been fixed
  - Design Process parity still needs broader desktop/mobile comparison beyond sanity checks
  - Eastleigh is much closer to the supplied screenshot states now, but Legit Logistics still needs the same screenshot-driven polish pass
  - EduManage still needs an explicit regression check after the portfolio-specific chrome changes
  - Existing mixed portfolio architecture until cutover
  - Route handling and static-hosting cutover complexity
  - React production build currently emits a single JS chunk slightly above Vite's default 500 kB warning threshold
