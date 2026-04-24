# Plan

Implement the mobile-only floating active-ball navigation.

## Decisions

- Keep desktop `nav-pills` unchanged.
- Keep the static pages on four existing routes: Home, About, Portfolio, Contact.
- Keep the React/Vite local app on its existing route set: Home, About, Portfolio, Process, Contact.
- Use the active tab icon inside the floating ball.
- Hide the active inline dock icon while preserving its layout slot.
- Move the saddle with the active ball.
- Use `var(--kenyan-green)` and `var(--accent-green-light)` for the ball.
- Delay page navigation until the icon-out, travel, and icon-in animation completes.
- Copy the imported Replit dock aesthetic where practical: 360px dock, 88px height, 60px ball, inset border, strong top radii, straighter bottom radii, and radial ball depth.
- Use Framer Motion only in the React/Vite nav; keep the static `public/` nav vanilla.

## Implementation

- Replace old limelight indicator markup with `.mobile-nav-saddle` and `.mobile-active-ball`.
- Restyle mobile bottom nav as a soft rounded dock with a moving notch.
- Rewrite mobile nav JS to clone active SVGs into the ball and coordinate navigation timing.
- Refine React/Vite `MobileBottomNav` with Framer Motion for spring ball movement and `AnimatePresence` icon swaps.
