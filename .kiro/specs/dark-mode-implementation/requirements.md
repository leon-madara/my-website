# Dark Mode Implementation - Requirements

## Project Context
Leon Madara's portfolio website currently has a **functional theme toggle** (day/night switch) that adds `.dark-theme` class to `<body>`, but **no CSS styles respond to this class yet**. The toggle works mechanically with localStorage persistence, but clicking it produces no visual changes.

## User Stories

### US-1: As a visitor, I want to toggle between light and dark themes
**Acceptance Criteria:**
- ✅ Theme toggle button exists and is functional (DONE)
- ✅ Toggle state persists across page refreshes (DONE)
- ❌ Clicking toggle changes all page colors appropriately (TODO)
- ❌ All text remains readable with WCAG AAA contrast (7:1+) (TODO)
- ❌ Kenyan identity colors (green, red, black) are enhanced in dark mode (TODO)

### US-2: As a visitor, I want the dark theme to be visually stunning
**Acceptance Criteria:**
- ❌ Dark backgrounds use deep charcoal (#0a0e12) instead of pure black
- ❌ Kenyan colors are MORE vibrant in dark mode with glow effects
- ❌ Glassmorphism effects adapt to dark theme
- ❌ Decorative shapes and patterns are inverted appropriately
- ❌ All gradients transform to darker, glowing versions

### US-3: As a visitor, I want smooth transitions between themes
**Acceptance Criteria:**
- ❌ Color transitions are smooth (0.3s ease)
- ❌ No jarring flashes or layout shifts
- ❌ Reduced motion preferences are respected

### US-4: As a visitor, I want dark mode on all pages
**Acceptance Criteria:**
- ❌ Home page (index.html) supports dark mode
- ❌ About page (about.html) supports dark mode
- ❌ Portfolio page (portfolio.html) supports dark mode
- ❌ Contact page (contact.html) supports dark mode
- ❌ All modals and components support dark mode

## Design System

### Color Transformation Strategy

#### Background System
| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary Background | `hsl(48, 10%, 90%)` | `#0a0e12` (deep charcoal) |
| Secondary Background | `#f8fafc` | `#131920` |
| Content Background | `#ffffff` | `#1e2730` |
| Glassmorphism Base | `rgba(255,255,255,0.9)` | `rgba(30,39,48,0.85)` |

#### Kenyan Colors Enhancement
| Color | Light Mode | Dark Mode | Enhancement |
|-------|-----------|-----------|-------------|
| Green | `#006b3f` | `#10cf74` | Brighter, glowing |
| Red | `#ce1126` | `#ff3355` | Brighter, glowing |
| Black | `#000` | `#e8edf3` | Inverted to light |
| Accent Green | `#10cf74` | `#10cf74` | Same, with glow |

#### Text Hierarchy
| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary Text | `#333` | `#e8edf3` |
| Secondary Text | `rgba(51,51,51,0.7)` | `#a8b5c7` |
| Tertiary Text | `#94a3b8` | `#6b7a8f` |

#### Borders & Shadows
| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Light Border | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.08)` |
| Medium Border | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.15)` |
| Kenyan Border | `rgba(0,107,63,0.12)` | `rgba(16,207,116,0.25)` |
| Shadow SM | `0 2px 4px rgba(0,0,0,0.06)` | `0 2px 4px rgba(0,0,0,0.4)` |
| Shadow MD | `0 4px 12px rgba(0,0,0,0.08)` | `0 4px 12px rgba(0,0,0,0.5)` |
| Shadow LG | `0 8px 24px rgba(0,0,0,0.12)` | `0 8px 24px rgba(0,0,0,0.6)` |
| Kenyan Glow | N/A | `0 0 20px rgba(16,207,116,0.3)` |

### Component-Specific Transformations

#### Navigation (liquid-nav.css)
- Nav pills background: `transparent` → `rgba(30,39,48,0.6)`
- Nav pills border: `rgba(122,72,56,0.4)` → `rgba(255,255,255,0.15)`
- Active indicator: `#1a1a1a` → `#10cf74` (glowing green)
- Link text: `#555` → `#a8b5c7`
- Active link: `#0adf86` → `#10cf74`

#### Sidebar Profile Card (sidebar-profile-card.css)
- Card background: `rgba(255,255,255,0.4)` → `rgba(30,39,48,0.85)`
- Header gradient: Keep Kenyan gradient but darker base
- Follow button: `#ffffff` → `#1e2730` with white text
- Stats borders: `#e5e7eb` → `rgba(255,255,255,0.1)`

#### Portfolio Page (portfolio.css)
- Container background: `transparent` → `transparent` (show dark background)
- Accordion nav: `#f8fafc` → `#1e2730`
- Accordion items: `#fafbfc` → `#131920`
- Active accordion: `rgba(0,107,63,0.08)` → `rgba(16,207,116,0.15)` with glow
- Content pages: `#f8fafc` → `#0a0e12`
- Info cards: `#f1f5f9` → `#1e2730`

#### About Page (about.css)
- Hero background: Keep transparent
- Glassmorphism cards: `rgba(255,255,255,0.9)` → `rgba(30,39,48,0.85)`
- Text colors: Follow text hierarchy
- Decorative shapes: Reduce opacity, adjust colors

#### Contact Page (contact.css)
- Form shell: `rgba(255,255,255,0.85)` → `rgba(30,39,48,0.85)`
- Form groups: `rgba(248,249,251,0.95)` → `rgba(19,25,32,0.95)`
- Input borders: `rgba(15,23,42,0.12)` → `rgba(255,255,255,0.15)`
- Contact cards: `rgba(255,255,255,0.95)` → `rgba(30,39,48,0.85)`
- Floating shapes: Adjust colors and opacity

#### Modals (modal.css)
- Modal container: `rgba(255,255,255,0.12)` → `rgba(30,39,48,0.85)`
- Modal overlay: `rgba(0,0,0,0.7)` → `rgba(0,0,0,0.85)`
- Tab buttons: Adjust for dark background
- Content sections: Follow dark theme colors

### Decorative Elements

#### Dot Pattern
- Light mode: `opacity: 0.4`
- Dark mode: `opacity: 0.15`, inverted colors

#### Floating Shapes
- Transform to darker versions with reduced opacity
- Add subtle glow effects in dark mode

#### Code Elements
- Light mode: `opacity: 0.04`
- Dark mode: `opacity: 0.08`, lighter colors

## Technical Implementation

### CSS Architecture
```css
/* Use body.dark-theme selector for all dark mode styles */
body.dark-theme {
    /* CSS variables override */
}

/* Component-specific dark mode */
body.dark-theme .component {
    /* Component styles */
}
```

### Transition Strategy
```css
/* Add transitions to all color-changing elements */
* {
    transition: background-color 0.3s ease,
                color 0.3s ease,
                border-color 0.3s ease,
                box-shadow 0.3s ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
    }
}
```

### Glow Effects
```css
/* Kenyan green glow */
body.dark-theme .kenyan-element {
    box-shadow: 0 0 20px rgba(16, 207, 116, 0.3);
    filter: drop-shadow(0 0 8px rgba(16, 207, 116, 0.4));
}

/* Kenyan red glow */
body.dark-theme .kenyan-red-element {
    box-shadow: 0 0 20px rgba(255, 51, 85, 0.3);
    filter: drop-shadow(0 0 8px rgba(255, 51, 85, 0.4));
}
```

## Files to Modify

### Primary CSS Files
1. **css/styles.css** - Core variables and base styles
2. **css/liquid-nav.css** - Navigation and theme toggle
3. **css/sidebar-profile-card.css** - Sidebar component
4. **css/portfolio.css** - Portfolio page
5. **css/about.css** - About page
6. **css/contact.css** - Contact page
7. **css/modal.css** - Modal components

### JavaScript Files
- **js/theme-toggle.js** - Already functional, no changes needed

## Accessibility Requirements

### WCAG AAA Compliance
- All text must have 7:1+ contrast ratio
- Focus indicators must be visible in both themes
- Color is not the only means of conveying information

### Reduced Motion
- All animations must respect `prefers-reduced-motion: reduce`
- Theme transitions should be instant for reduced motion users

### Screen Readers
- Theme toggle must announce state changes
- No visual-only information

## Testing Checklist

### Visual Testing
- [ ] All pages render correctly in dark mode
- [ ] No white flashes during theme switch
- [ ] All text is readable
- [ ] Glassmorphism effects work properly
- [ ] Gradients look good in dark mode
- [ ] Decorative elements are visible but not distracting

### Functional Testing
- [ ] Theme persists across page navigation
- [ ] Theme persists after browser refresh
- [ ] Toggle animation works smoothly
- [ ] No console errors

### Accessibility Testing
- [ ] Contrast ratios meet WCAG AAA (7:1+)
- [ ] Keyboard navigation works
- [ ] Screen reader announces theme changes
- [ ] Reduced motion is respected

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Success Metrics

### User Experience
- Theme switch feels instant (< 300ms)
- No layout shifts during transition
- Dark mode feels premium and polished

### Technical
- No performance degradation
- CSS file size increase < 30%
- No JavaScript errors

### Design
- Kenyan identity is stronger in dark mode
- Professional polish is maintained
- All elements are well-visible

## Implementation Phases

### Phase 1: Core Variables & Base Styles
- Set up CSS variables for dark mode
- Implement background system
- Transform text colors

### Phase 2: Navigation & Sidebar
- Update liquid navigation
- Transform sidebar profile card
- Ensure theme toggle visual feedback

### Phase 3: Page-Specific Styles
- Portfolio page dark mode
- About page dark mode
- Contact page dark mode

### Phase 4: Components & Modals
- Modal dark mode
- Form elements dark mode
- Card components dark mode

### Phase 5: Polish & Refinements
- Add glow effects
- Refine transitions
- Test accessibility
- Cross-browser testing

## Notes

- The theme toggle is **already functional** - we only need to add CSS
- Focus on making Kenyan colors **MORE vibrant** in dark mode, not less
- Use **deep charcoal** (#0a0e12) instead of pure black for sophistication
- Add **glow effects** to Kenyan elements for premium feel
- Maintain **glassmorphism** aesthetic in dark mode
- Ensure **smooth transitions** between themes
- Respect **reduced motion** preferences
- Test on **all pages** (home, about, portfolio, contact)
