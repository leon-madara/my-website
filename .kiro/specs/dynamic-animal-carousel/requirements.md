# Requirements Document

## Introduction

This feature enhances the about page's visual experience by implementing a dynamic animal carousel system. The green section background will be replaced with the gradient from the aside pill (gradient top, plain bottom), and the static lion image will be replaced with a rotating collection of animal images that change based on scroll position and time spent on each section.

## Glossary

- **Green Section**: The visual element positioned from 0vw to 20vw on the left side of the about page that currently has a solid green background; will be replaced with a persistent gradient background element
- **Gradient Background Element**: A fixed visual element that remains visible throughout scrolling, featuring a gradient at the top transitioning to plain white at the bottom, matching the aside pill design
- **Aside Pill**: The profile card sidebar component that contains a gradient background (gradient at top, plain at bottom)
- **Animal Carousel**: A collection of animal images (lion1.png, lion2.png, giraffe1.png, frog1.png, frog2.png) that rotate based on user interaction
- **Section**: A distinct content area on the about page (hero, what-i-do, skills, experience, education, etc.)
- **Scroll Transition**: The event when a user scrolls from one section to another
- **Idle Timer**: A mechanism that tracks how long a user remains on a specific section without scrolling

## Requirements

### Requirement 1

**User Story:** As a user viewing the about page, I want to see a visually appealing gradient background element that persists throughout scrolling, so that the design is more cohesive with the aside pill component.

#### Acceptance Criteria

1. WHEN the about page loads THEN the system SHALL display a fixed background element with a gradient (gradient at top, plain white at bottom) matching the aside pill design
2. WHEN the user scrolls through sections THEN the system SHALL keep the gradient background element visible and fixed in position
3. WHEN the gradient background is rendered THEN the system SHALL maintain the same dimensions (0vw to 20vw width) as the current green section
4. WHEN the gradient is applied THEN the system SHALL use the same color values and gradient direction as the aside pill header gradient (linear-gradient 135deg, rgba(0, 107, 63, 0.85) 0%, rgba(179, 0, 0, 0.85) 100%)
5. WHEN the page is viewed on different screen sizes THEN the system SHALL maintain the gradient appearance responsively

### Requirement 2

**User Story:** As a user scrolling through the about page, I want to see different animal images as I move between sections, so that the experience feels dynamic and engaging.

#### Acceptance Criteria

1. WHEN a user scrolls from one section to another THEN the system SHALL change the animal image to the next image in the sequence
2. WHEN the image changes THEN the system SHALL cycle through the images in this order: lion1.png, lion2.png, giraffe1.png, frog1.png, frog2.png, then back to lion1.png
3. WHEN a section transition occurs THEN the system SHALL animate the image change smoothly
4. WHEN the user scrolls backward through sections THEN the system SHALL display the previous image in the sequence
5. WHEN the page initially loads THEN the system SHALL display lion1.png as the default starting image

### Requirement 3

**User Story:** As a user who pauses to read content on a section, I want the animal image to change automatically after 20 seconds, so that I experience visual variety even when not scrolling.

#### Acceptance Criteria

1. WHEN a user remains on a section for 20 seconds without scrolling THEN the system SHALL automatically change to the next animal image in the sequence
2. WHEN the idle timer triggers an image change THEN the system SHALL reset the timer and start counting again
3. WHEN a user scrolls to a new section THEN the system SHALL reset the idle timer
4. WHEN multiple idle timer cycles occur on the same section THEN the system SHALL continue cycling through all animal images in sequence
5. WHEN the user leaves the page THEN the system SHALL clear the idle timer to prevent memory leaks

### Requirement 4

**User Story:** As a user viewing the about page, I want the animal images to be positioned and scaled correctly on top of the gradient background element, so that they appear visually balanced and professional.

#### Acceptance Criteria

1. WHEN an animal image is displayed THEN the system SHALL position it at the same location as the current lion image (20vw from left, on top of the gradient background)
2. WHEN an animal image is displayed THEN the system SHALL scale it to 50% as per the current implementation
3. WHEN an image transition occurs THEN the system SHALL maintain consistent positioning and scaling across all animal images
4. WHEN the page loads THEN the system SHALL apply the initial slide and scale animation to the first animal image
5. WHEN the gradient background element is visible THEN the system SHALL layer animal images above it with appropriate z-index values

### Requirement 5

**User Story:** As a developer maintaining the codebase, I want the animal carousel system to be performant and accessible, so that all users have a smooth experience.

#### Acceptance Criteria

1. WHEN images are loaded THEN the system SHALL preload all animal images to prevent loading delays during transitions
2. WHEN a user has reduced motion preferences enabled THEN the system SHALL disable image transition animations
3. WHEN an image fails to load THEN the system SHALL handle the error gracefully and continue with available images
4. WHEN the carousel is active THEN the system SHALL use efficient event listeners that do not cause performance degradation
5. WHEN images change THEN the system SHALL update appropriate ARIA attributes for screen reader users
