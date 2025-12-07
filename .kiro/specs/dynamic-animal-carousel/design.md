# Design Document: Dynamic Animal Carousel

## Overview

This feature transforms the static green section and lion image on the about page into a dynamic, engaging visual experience. The implementation replaces the solid green background with a persistent gradient background element (matching the aside pill design) and introduces an automatic image carousel that cycles through five animal images based on scroll position and idle time.

The design prioritizes:
- **Visual Cohesion**: Gradient background matches the aside pill component
- **Smooth Animations**: GSAP-powered transitions for professional feel
- **Performance**: Preloaded images and optimized event handling
- **Accessibility**: Respects reduced motion preferences and provides screen reader support

## Architecture

### Component Structure

```
about.html
├── .gradient-background-element (NEW - Fixed position, 0-20vw)
│   └── Gradient styling matching aside pill
├── .hero-image-wrapper (MODIFIED)
│   └── <img> (Dynamic src, cycles through animals)
└── .hero-container (EXISTING)
    └── Text content
```

### Key Architectural Decisions

1. **Fixed Background Element**: The gradient background is a separate, fixed-position element that persists throughout scrolling, independent of the image carousel
2. **Image Swapping Strategy**: Use a single `<img>` element with dynamic `src` attribute changes rather than multiple overlapping images
3. **State Management**: JavaScript module pattern to encapsulate carousel state (current index, timer, sections)
4. **Event Handling**: Intersection Observer API for section detection + debounced scroll handlers
5. **Animation Library**: Leverage existing GSAP setup for smooth image transitions

## Components and Interfaces

### 1. Gradient Background Element

**HTML Structure**:
```html
<div class="gradient-background-element" aria-hidden="true"></div>
```

**CSS Styling**:
```css
.gradient-background-element {
    position: fixed;
    left: 0;
    top: 0;
    width: 20vw;
    height: 100vh;
    background: linear-gradient(
        135deg,
        rgba(0, 107, 63, 0.85) 0%,
        rgba(179, 0, 0, 0.85) 50%,
        rgba(255, 255, 255, 1) 100%
    );
    z-index: 1;
    pointer-events: none;
}
```

**Key Properties**:
- `position: fixed` - Remains visible during scroll
- `width: 20vw` - Matches current green section dimensions
- Gradient matches `.sidebar-header` from sidebar-profile-card.css
- `z-index: 1` - Behind images (z-index: 3) but above background

### 2. Animal Carousel Module

**JavaScript Module** (`js/animal-carousel.js`):

```javascript
const AnimalCarousel = {
    images: [
        'images/lion1.PNG',
        'images/lion2.png',
        'images/giraffe1.png',
        'images/frog1.png',
        'images/frog2.png'
    ],
    currentIndex: 0,
    idleTimer: null,
    idleTimeout: 20000, // 20 seconds
    sections: [],
    
    init() { },
    preloadImages() { },
    changeImage(direction) { },
    startIdleTimer() { },
    resetIdleTimer() { },
    setupScrollObserver() { },
    cleanup() { }
};
```

**Public Methods**:
- `init()`: Initialize carousel, preload images, setup observers
- `changeImage(direction)`: Change to next/previous image with animation
- `cleanup()`: Remove event listeners and clear timers

**Private Methods**:
- `preloadImages()`: Create Image objects for all carousel images
- `startIdleTimer()`: Begin 20-second countdown
- `resetIdleTimer()`: Clear and restart timer
- `setupScrollObserver()`: Configure Intersection Observer for sections

### 3. Section Detection System

**Intersection Observer Configuration**:
```javascript
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is centered
    threshold: 0
};
```

**Tracked Sections**:
- `.parallax-hero`
- `.what-i-do-section`
- `.skills-section`
- `.experience-section`
- `.education-section`
- `.projects-section`
- `.certifications-section`

## Data Models

### Carousel State

```javascript
{
    images: string[],           // Array of image paths
    currentIndex: number,       // Current image index (0-4)
    idleTimer: number | null,   // setTimeout ID
    idleTimeout: number,        // 20000ms
    sections: HTMLElement[],    // Observed sections
    isAnimating: boolean,       // Prevent concurrent animations
    observer: IntersectionObserver | null
}
```

### Section Mapping

```javascript
{
    sectionElement: HTMLElement,
    imageIndex: number,         // Which image to show for this section
    isVisible: boolean          // Currently in viewport
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Gradient background element exists with correct styling
*For any* page load of the about page, the gradient background element should exist in the DOM with the correct gradient CSS values matching the aside pill design
**Validates: Requirements 1.1, 1.4**

### Property 2: Gradient background remains fixed during scroll
*For any* scroll position on the about page, the gradient background element should maintain `position: fixed` and remain visible
**Validates: Requirements 1.2**

### Property 3: Gradient background maintains correct dimensions
*For any* viewport size, the gradient background element should have a computed width equal to 20vw
**Validates: Requirements 1.3**

### Property 4: Image sequence cycles correctly
*For any* starting index in the image array, cycling through all images should return to the starting image (round trip property)
**Validates: Requirements 2.2**

### Property 5: Section transitions trigger image changes
*For any* section transition detected by the Intersection Observer, the image src should change to the next image in the sequence
**Validates: Requirements 2.1**

### Property 6: Backward scrolling reverses image sequence
*For any* forward scroll followed by backward scroll, the image sequence should reverse correctly
**Validates: Requirements 2.4**

### Property 7: Idle timer triggers image change
*For any* section where the user remains idle for 20 seconds, the system should automatically advance to the next image
**Validates: Requirements 3.1**

### Property 8: Scroll events reset idle timer
*For any* scroll event, the idle timer should be cleared and restarted
**Validates: Requirements 3.3**

### Property 9: Timer cleanup prevents memory leaks
*For any* page unload event, all timers and event listeners should be properly cleared
**Validates: Requirements 3.5**

### Property 10: Image positioning remains consistent
*For any* image in the carousel, the position and scale CSS properties should remain constant (invariant)
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 11: Images layer above gradient background
*For any* time when both the gradient background and an animal image are visible, the image z-index should be greater than the background z-index
**Validates: Requirements 4.5**

### Property 12: All images are preloaded
*For any* carousel initialization, all images in the sequence should be loaded before the carousel becomes interactive
**Validates: Requirements 5.1**

### Property 13: Reduced motion disables animations
*For any* user with `prefers-reduced-motion: reduce` enabled, image transitions should occur instantly without animation
**Validates: Requirements 5.2**

### Property 14: Image load failures are handled gracefully
*For any* image that fails to load, the system should continue functioning with the remaining available images
**Validates: Requirements 5.3**

### Property 15: ARIA attributes update with image changes
*For any* image change, the img element's aria-label should be updated to reflect the current animal
**Validates: Requirements 5.5**

## Error Handling

### Image Loading Errors
- **Strategy**: Graceful degradation
- **Implementation**: 
  - Wrap image preloading in try-catch blocks
  - Filter out failed images from the carousel array
  - Log errors to console for debugging
  - If all images fail, fall back to original lion1.PNG

### Timer Management Errors
- **Strategy**: Defensive cleanup
- **Implementation**:
  - Always clear existing timer before setting new one
  - Use `window.addEventListener('beforeunload', cleanup)`
  - Null checks before clearing timers

### Animation Conflicts
- **Strategy**: Animation locking
- **Implementation**:
  - `isAnimating` flag prevents concurrent transitions
  - Queue subsequent requests until current animation completes
  - GSAP's `onComplete` callback releases lock

### Intersection Observer Errors
- **Strategy**: Feature detection and fallback
- **Implementation**:
  - Check for `IntersectionObserver` support
  - Fallback to scroll event listener if unavailable
  - Throttle scroll events to prevent performance issues

## Testing Strategy

### Unit Tests

**Test Suite**: `animal-carousel.test.js`

1. **Carousel Initialization**
   - Verify all images are added to preload queue
   - Verify initial index is 0
   - Verify idle timer is started

2. **Image Cycling**
   - Test `changeImage(1)` increments index
   - Test `changeImage(-1)` decrements index
   - Test wraparound at array boundaries

3. **Timer Management**
   - Test timer starts on init
   - Test timer resets on scroll
   - Test timer triggers image change after 20s

4. **Cleanup**
   - Verify timers are cleared
   - Verify observers are disconnected
   - Verify event listeners are removed

### Property-Based Tests

**Test Suite**: `animal-carousel.properties.test.js`

**Testing Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Minimum 100 iterations per property

1. **Property Test: Round trip cycling**
   - Generate random starting indices
   - Cycle through all 5 images
   - Verify return to starting index
   - **Feature: dynamic-animal-carousel, Property 4: Image sequence cycles correctly**

2. **Property Test: Position invariant**
   - Generate random image indices
   - Verify position and scale remain constant
   - **Feature: dynamic-animal-carousel, Property 10: Image positioning remains consistent**

3. **Property Test: Z-index layering**
   - For all states, verify image z-index > background z-index
   - **Feature: dynamic-animal-carousel, Property 11: Images layer above gradient background**

4. **Property Test: Timer reset on scroll**
   - Generate random scroll events before 20s
   - Verify timer resets and image doesn't change
   - **Feature: dynamic-animal-carousel, Property 8: Scroll events reset idle timer**

5. **Property Test: Gradient dimensions**
   - Generate random viewport widths
   - Verify gradient width = 20vw in all cases
   - **Feature: dynamic-animal-carousel, Property 3: Gradient background maintains correct dimensions**

### Integration Tests

1. **Full Page Load Test**
   - Load about.html
   - Verify gradient background renders
   - Verify lion1.PNG is displayed
   - Verify GSAP animations complete

2. **Scroll Through Sections Test**
   - Simulate scroll through all sections
   - Verify image changes at each section
   - Verify images cycle in correct order

3. **Idle Timer Integration Test**
   - Load page and wait 20 seconds
   - Verify image changes automatically
   - Scroll and verify timer resets

### Accessibility Tests

1. **Reduced Motion Test**
   - Enable `prefers-reduced-motion: reduce`
   - Verify transitions are instant
   - Verify functionality still works

2. **Screen Reader Test**
   - Verify aria-label updates with image changes
   - Verify gradient background has `aria-hidden="true"`
   - Test with NVDA/JAWS

## Implementation Notes

### File Modifications

**New Files**:
- `js/animal-carousel.js` - Main carousel module

**Modified Files**:
- `about.html` - Add gradient background element, update image element
- `css/about.css` - Add gradient background styles, update z-index values
- `js/about-parallax.js` - Integrate carousel initialization

### Integration with Existing Code

**GSAP Integration**:
```javascript
// In animal-carousel.js
changeImage(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const img = document.querySelector('.hero-image');
    const newIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
    
    gsap.to(img, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            img.src = this.images[newIndex];
            img.alt = this.getAltText(newIndex);
            this.currentIndex = newIndex;
            
            gsap.to(img, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        }
    });
}
```

**Parallax Integration**:
```javascript
// In about-parallax.js, after existing initialization
if (typeof AnimalCarousel !== 'undefined') {
    AnimalCarousel.init();
}
```

### Performance Optimizations

1. **Image Preloading**: All images loaded on page init to prevent flicker
2. **Debounced Scroll**: Scroll events throttled to max 1 per 100ms
3. **Intersection Observer**: More efficient than scroll listeners for section detection
4. **GPU Acceleration**: Use `transform` and `opacity` for animations (not `left`, `top`)
5. **Will-change Hints**: Add `will-change: transform, opacity` to animated elements

### Browser Compatibility

- **Intersection Observer**: Supported in all modern browsers (IE11 requires polyfill)
- **GSAP**: Already in use, no additional concerns
- **CSS Gradients**: Universal support
- **Fixed Positioning**: Universal support

### Responsive Behavior

**Desktop (> 1024px)**:
- Full gradient background (20vw)
- All animations enabled
- Intersection Observer for section detection

**Tablet (768px - 1024px)**:
- Gradient background scales proportionally
- Animations enabled
- Intersection Observer active

**Mobile (< 768px)**:
- Gradient background hidden (matches current green section behavior)
- Carousel disabled or simplified
- Fallback to static lion1.PNG

## Deployment Considerations

### Rollout Strategy
1. Deploy CSS changes first (gradient background)
2. Deploy JavaScript module (carousel)
3. Monitor console for errors
4. A/B test if desired

### Rollback Plan
- Remove gradient background element from HTML
- Disable carousel JavaScript
- Revert to original green section CSS

### Monitoring
- Track image load failures in analytics
- Monitor scroll performance metrics
- Collect user feedback on animation smoothness

## Future Enhancements

1. **Admin Configurable Images**: Allow image sequence to be configured via CMS
2. **Parallax Effect**: Add subtle parallax movement to gradient background
3. **Touch Gestures**: Swipe to change images on mobile
4. **Keyboard Navigation**: Arrow keys to manually cycle images
5. **Image Captions**: Display animal names with smooth fade-in
6. **Performance Mode**: Detect low-end devices and disable animations
