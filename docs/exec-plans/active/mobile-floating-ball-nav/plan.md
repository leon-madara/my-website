# Plan

Implement the mobile-only floating active-ball navigation.

## Decisions

- Keep desktop `nav-pills` unchanged.
- Keep the four existing routes: Home, About, Portfolio, Contact.
- Use the active tab icon inside the floating ball.
- Hide the active inline dock icon while preserving its layout slot.
- Move the saddle with the active ball.
- Use `var(--kenyan-green)` and `var(--accent-green-light)` for the ball.
- Delay page navigation until the icon-out, travel, and icon-in animation completes.

## Implementation

- Replace old limelight indicator markup with `.mobile-nav-saddle` and `.mobile-active-ball`.
- Restyle mobile bottom nav as a soft rounded dock with a moving notch.
- Rewrite mobile nav JS to clone active SVGs into the ball and coordinate navigation timing.

