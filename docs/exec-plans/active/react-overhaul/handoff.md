# Handoff

## Next Recommended Step

Run a fuller parity review on desktop and mobile for the React pages that already passed sanity checks, especially the About long-scroll animation timing and the portfolio layouts against `public/portfolio.html` and `public/edumanage.html`. After that, document the production cutover boundary and replace the remaining legacy entrypoints only when route refresh and visual parity are signed off.

## Notes

- Relevant files:
  - `app/src/features/portfolio/PortfolioRoute.tsx`
  - `app/src/features/portfolio/PortfolioLanding.tsx`
  - `app/src/features/portfolio/TabbedCaseStudyRoute.tsx`
  - `app/src/features/portfolio/LongformCaseStudyRoute.tsx`
  - `app/src/features/portfolio/PortfolioEntrance.tsx`
  - `app/src/features/portfolio/portfolioContent.ts`
  - `app/src/features/portfolio/eastleighProject.ts`
  - `app/src/features/portfolio/legitLogisticsProject.ts`
  - `app/src/features/portfolio/eduManageProject.ts`
  - `app/src/features/portfolio/portfolio.css`
  - `app/src/features/home/HomeRoute.tsx`
  - `app/src/features/home/RoleSequence.tsx`
  - `app/src/features/home/useHomeViewportLock.ts`
  - `app/src/features/about/AboutRoute.tsx`
  - `app/src/features/about/aboutContent.ts`
  - `app/src/features/about/useAboutAnimations.ts`
  - `app/src/features/about/about.css`
  - `app/src/features/contact/ContactRoute.tsx`
  - `app/src/features/contact/contactContent.ts`
  - `app/src/features/contact/contact.css`
  - `app/src/styles/global.css`
  - `public/index.html`
  - `public/about.html`
  - `public/contact.html`
  - `public/portfolio.html`
  - `public/edumanage.html`
  - `public/js/about-parallax.js`
- Known risks:
  - Homepage parity still needs broader desktop/mobile comparison beyond sanity checks
  - About page parity still needs broader desktop/mobile comparison beyond sanity checks
  - Contact page parity still needs broader desktop/mobile comparison beyond sanity checks
  - Portfolio parity still needs broader desktop/mobile comparison beyond sanity checks
  - Existing mixed portfolio architecture until cutover
  - Route handling and static-hosting cutover complexity
  - React production build currently emits a single JS chunk slightly above Vite's default 500 kB warning threshold
