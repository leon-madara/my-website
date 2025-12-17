# Design Document

## Overview

The vanilla reversion design focuses on systematically converting the React-based portfolio back to its original vanilla HTML/CSS/JavaScript structure while preserving all functionality and visual appearance. The design leverages existing vanilla assets in the public folder and recreates React component functionality using standard web APIs.

## Architecture

### File Structure Transformation
```
Current React Structure:
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── components/
│       ├── FloatingNavigation.jsx
│       ├── HeroSection.jsx
│       ├── PillSidebar.jsx
│       └── Footer.jsx
├── public/
│   ├── css/styles.css (original)
│   └── images/ (original assets)
├── package.json (React dependencies)
└── vite.config.js

Target Vanilla Structure:
├── index.html (main entry point)
├── css/
│   └── styles.css (from public/css/)
├── js/
│   └── main.js (converted functionality)
├── images/ (from public/images/)
└── package.json (minimal/removed)
```

### Component Conversion Strategy

#### 1. HTML Structure Recreation
- Convert JSX components to semantic HTML elements
- Maintain existing class names and structure from React components
- Preserve accessibility attributes and ARIA labels
- Use the existing HTML structure from index.html as base

#### 2. CSS Integration
- Use the complete original CSS file from `public/css/styles.css`
- Remove any React-specific CSS imports or modules
- Ensure all existing animations and responsive design remain intact
- Maintain the floating header navigation system

#### 3. JavaScript Functionality Recreation
- Convert React state management to vanilla JavaScript variables
- Replace React event handlers with standard DOM event listeners
- Recreate component lifecycle effects using DOMContentLoaded and other events
- Implement the floating navigation elevation system in vanilla JS

## Components and Interfaces

### 1. Floating Navigation Component
**Original React Implementation:** `FloatingNavigation.jsx`
**Vanilla Implementation:** JavaScript class `FloatingNavigation`

**Key Features to Recreate:**
- Icon elevation animations on hover
- Circular halo materialization effects
- Smooth transitions between navigation states
- Keyboard accessibility support
- Touch-friendly mobile interactions

**JavaScript Interface:**
```javascript
class FloatingNavigation {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.icons = [];
    this.activeIcon = null;
    this.halo = null;
    this.init();
  }
  
  init() {
    this.createHalo();
    this.bindEvents();
    this.setupAccessibility();
  }
  
  elevateIcon(icon) { /* Animation logic */ }
  descendIcon(icon) { /* Animation logic */ }
  materializeHalo(position) { /* Halo animation */ }
  dematerializeHalo() { /* Halo removal */ }
}
```

### 2. Hero Section Component
**Original React Implementation:** `HeroSection.jsx`
**Vanilla Implementation:** Static HTML with JavaScript enhancements

**Key Features to Recreate:**
- Animated text entrance effects
- Responsive typography scaling
- Interactive hover effects on name and role
- Location display with icon

**HTML Structure:**
```html
<section class="hero-section">
  <div class="hero-content">
    <p class="greeting">Hello, I'm</p>
    <h1 class="name">Leon Madara</h1>
    <h2 class="role">Full Stack AI Developer</h2>
    <div class="location-container">
      <svg class="location-pin">...</svg>
      <p class="location">Nairobi, Kenya</p>
    </div>
  </div>
</section>
```

### 3. Pill Sidebar Component
**Original React Implementation:** `PillSidebar.jsx`
**Vanilla Implementation:** Static HTML with JavaScript interactions

**Key Features to Recreate:**
- Profile photo display
- Social media links with hover effects
- Responsive layout transformations
- Smooth entrance animations

### 4. Footer Component
**Original React Implementation:** `Footer.jsx`
**Vanilla Implementation:** Static HTML

**Key Features to Recreate:**
- Copyright information display
- Fade-in animation on scroll
- Responsive text sizing

## Data Models

### Navigation State Management
```javascript
const NavigationState = {
  activeIcon: null,
  haloVisible: false,
  animating: false,
  
  setActiveIcon(icon) {
    this.activeIcon = icon;
  },
  
  toggleHalo(visible) {
    this.haloVisible = visible;
  },
  
  setAnimating(state) {
    this.animating = state;
  }
};
```

### Animation Queue System
```javascript
const AnimationQueue = {
  queue: [],
  running: false,
  
  add(animation) {
    this.queue.push(animation);
    if (!this.running) this.process();
  },
  
  process() {
    // Process animations sequentially
  }
};
```

## Error Handling

### 1. Graceful Degradation
- Provide fallbacks for CSS animations when JavaScript is disabled
- Ensure core functionality works without advanced features
- Handle missing DOM elements gracefully

### 2. Browser Compatibility
- Use feature detection for modern JavaScript APIs
- Provide polyfills for older browsers where necessary
- Test across different viewport sizes and devices

### 3. Asset Loading
- Handle missing images with placeholder fallbacks
- Implement lazy loading for performance optimization
- Provide error states for failed resource loads

## Testing Strategy

### 1. Visual Regression Testing
- Compare screenshots between React and vanilla versions
- Verify responsive behavior across breakpoints
- Test animation timing and smoothness

### 2. Functionality Testing
- Verify all interactive elements work correctly
- Test keyboard navigation and accessibility
- Validate touch interactions on mobile devices

### 3. Performance Testing
- Measure page load times compared to React version
- Test animation performance across devices
- Verify memory usage and cleanup

### 4. Cross-Browser Testing
- Test in Chrome, Firefox, Safari, and Edge
- Verify mobile browser compatibility
- Test with different screen readers

## Implementation Phases

### Phase 1: Asset Migration
- Copy original CSS from public/css/styles.css to css/styles.css
- Move images from public/images/ to images/
- Create basic HTML structure in index.html

### Phase 2: Core HTML Structure
- Convert React components to HTML elements
- Implement semantic markup structure
- Add accessibility attributes and ARIA labels

### Phase 3: JavaScript Functionality
- Create FloatingNavigation class
- Implement animation systems
- Add event listeners and interaction handlers

### Phase 4: Integration and Polish
- Connect all components together
- Fine-tune animations and transitions
- Optimize performance and cleanup code

### Phase 5: Cleanup
- Remove React dependencies from package.json
- Delete React-specific files and folders
- Update any remaining configuration files