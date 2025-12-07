# Implementation Plan

- [ ] 1. Create gradient background element and styling
  - Add new `.gradient-background-element` div to about.html before the parallax-hero section
  - Create CSS styling in about.css matching the aside pill gradient design
  - Set fixed positioning, 20vw width, full viewport height
  - Configure z-index layering (background: 1, images: 3)
  - Test gradient appearance matches aside pill component
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 1.1 Write property test for gradient background styling
  - **Property 1: Gradient background element exists with correct styling**
  - **Validates: Requirements 1.1, 1.4**

- [ ] 1.2 Write property test for gradient fixed positioning
  - **Property 2: Gradient background remains fixed during scroll**
  - **Validates: Requirements 1.2**

- [ ] 1.3 Write property test for gradient dimensions
  - **Property 3: Gradient background maintains correct dimensions**
  - **Validates: Requirements 1.3**

- [ ] 2. Set up animal carousel JavaScript module
  - Create new file `js/animal-carousel.js`
  - Define AnimalCarousel object with module pattern
  - Add images array with all 5 animal image paths (lion1.PNG, lion2.png, giraffe1.png, frog1.png, frog2.png)
  - Initialize state properties (currentIndex, idleTimer, sections, isAnimating)
  - Implement init() method to bootstrap the carousel
  - _Requirements: 2.1, 2.2, 2.5_

- [ ] 3. Implement image preloading system
  - Create preloadImages() method in AnimalCarousel
  - Use Image() constructor to preload all carousel images
  - Track loading state and handle load/error events
  - Filter out failed images from carousel array
  - Log preload status to console for debugging
  - _Requirements: 5.1, 5.3_

- [ ] 3.1 Write property test for image preloading
  - **Property 12: All images are preloaded**
  - **Validates: Requirements 5.1**

- [ ] 3.2 Write property test for image load error handling
  - **Property 14: Image load failures are handled gracefully**
  - **Validates: Requirements 5.3**

- [ ] 4. Implement image cycling logic
  - Create changeImage(direction) method accepting 1 (forward) or -1 (backward)
  - Calculate new index with wraparound: `(currentIndex + direction + length) % length`
  - Add isAnimating flag to prevent concurrent transitions
  - Update img src and alt attributes
  - Implement getAltText() helper to generate descriptive alt text for each animal
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 4.1 Write property test for image sequence cycling
  - **Property 4: Image sequence cycles correctly**
  - **Validates: Requirements 2.2**

- [ ] 4.2 Write property test for backward scrolling
  - **Property 6: Backward scrolling reverses image sequence**
  - **Validates: Requirements 2.4**

- [ ] 5. Integrate GSAP animations for image transitions
  - Add GSAP fade-out animation (opacity: 0, scale: 0.9, duration: 0.3s)
  - Swap image src in onComplete callback
  - Add GSAP fade-in animation (opacity: 1, scale: 1, duration: 0.3s)
  - Use power2 easing for smooth transitions
  - Release isAnimating lock after animation completes
  - _Requirements: 2.3_

- [ ] 5.1 Write property test for animation application
  - Verify GSAP animations are triggered during image changes
  - _Requirements: 2.3_

- [ ] 6. Implement idle timer system
  - Create startIdleTimer() method using setTimeout with 20000ms delay
  - Store timer ID in idleTimer property
  - On timer expiration, call changeImage(1) to advance to next image
  - Create resetIdleTimer() method to clear and restart timer
  - Call resetIdleTimer() after each image change
  - _Requirements: 3.1, 3.2_

- [ ] 6.1 Write property test for idle timer triggering
  - **Property 7: Idle timer triggers image change**
  - **Validates: Requirements 3.1**

- [ ] 7. Set up Intersection Observer for section detection
  - Create setupScrollObserver() method
  - Configure IntersectionObserver with rootMargin: '-50% 0px -50% 0px'
  - Query all section elements (.parallax-hero, .what-i-do-section, .skills-section, etc.)
  - Observe each section element
  - In callback, detect when section becomes visible and call changeImage(1)
  - Call resetIdleTimer() on each section transition
  - _Requirements: 2.1, 3.3_

- [ ] 7.1 Write property test for section transitions
  - **Property 5: Section transitions trigger image changes**
  - **Validates: Requirements 2.1**

- [ ] 7.2 Write property test for timer reset on scroll
  - **Property 8: Scroll events reset idle timer**
  - **Validates: Requirements 3.3**

- [ ] 8. Implement cleanup and memory management
  - Create cleanup() method
  - Clear idleTimer using clearTimeout()
  - Disconnect IntersectionObserver
  - Remove any event listeners
  - Add window.addEventListener('beforeunload', cleanup)
  - _Requirements: 3.5_

- [ ] 8.1 Write property test for cleanup
  - **Property 9: Timer cleanup prevents memory leaks**
  - **Validates: Requirements 3.5**

- [ ] 9. Update about.html structure
  - Add gradient background element: `<div class="gradient-background-element" aria-hidden="true"></div>`
  - Position before `.parallax-hero` section
  - Update hero-image img element to have id="carousel-image"
  - Add initial alt text: "Leon Madara - Lion portrait"
  - Add script tag for animal-carousel.js before about-parallax.js
  - _Requirements: 1.1, 4.1, 5.5_

- [ ] 10. Update about.css with new styles
  - Add .gradient-background-element styles with fixed positioning
  - Set gradient: `linear-gradient(135deg, rgba(0, 107, 63, 0.85) 0%, rgba(179, 0, 0, 0.85) 50%, rgba(255, 255, 255, 1) 100%)`
  - Update z-index values: gradient (1), hero-container (2), hero-image (3)
  - Remove or update .green-section styles (now replaced by gradient element)
  - Add will-change hints for performance
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.5_

- [ ] 10.1 Write property test for z-index layering
  - **Property 11: Images layer above gradient background**
  - **Validates: Requirements 4.5**

- [ ] 11. Integrate carousel with about-parallax.js
  - Add carousel initialization after GSAP setup
  - Check for AnimalCarousel existence before calling init()
  - Ensure carousel doesn't interfere with existing parallax animations
  - Test that initial lion slide animation works with carousel
  - _Requirements: 2.5, 4.4_

- [ ] 12. Implement accessibility features
  - Add prefers-reduced-motion media query detection
  - If reduced motion, set GSAP duration to 0.01s for instant transitions
  - Update aria-label on img element when image changes
  - Ensure gradient background has aria-hidden="true"
  - Test with screen readers (NVDA/JAWS)
  - _Requirements: 5.2, 5.5_

- [ ] 12.1 Write property test for reduced motion
  - **Property 13: Reduced motion disables animations**
  - **Validates: Requirements 5.2**

- [ ] 12.2 Write property test for ARIA updates
  - **Property 15: ARIA attributes update with image changes**
  - **Validates: Requirements 5.5**

- [ ] 13. Add responsive behavior
  - Add media query for mobile (< 768px) to hide gradient background
  - Disable carousel on mobile or simplify to static image
  - Test gradient scaling on tablet sizes (768px - 1024px)
  - Ensure gradient remains 20vw across all desktop sizes
  - _Requirements: 1.5_

- [ ] 14. Implement error handling and fallbacks
  - Add try-catch blocks around image preloading
  - Add feature detection for IntersectionObserver
  - Implement fallback to scroll event listener if IntersectionObserver unavailable
  - Add console.error logging for debugging
  - Test graceful degradation when images fail to load
  - _Requirements: 5.3_

- [ ] 14.1 Write property test for image positioning invariant
  - **Property 10: Image positioning remains consistent**
  - **Validates: Requirements 4.1, 4.2, 4.3**

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Final integration testing and polish
  - Test full page load with gradient and carousel
  - Verify smooth scrolling through all sections with image changes
  - Test idle timer by waiting 20 seconds on each section
  - Verify backward scrolling reverses image sequence
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Verify no console errors or warnings
  - Check performance with DevTools (no jank, smooth 60fps)
  - _Requirements: All_
