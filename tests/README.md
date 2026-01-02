# Portfolio Clickability Testing Framework

This testing framework provides comprehensive testing capabilities for diagnosing and validating portfolio page interactions.

## Setup

The testing framework is set up with the following structure:

```
tests/
├── package.json              # Test dependencies and scripts
├── vitest.config.js          # Vitest configuration
├── setup/
│   └── test-setup.js         # Global test setup and utilities
├── utils/
│   ├── test-generators.js    # Property-based test generators
│   └── test-helpers.js       # Test utility functions
├── core/
│   └── test-framework.test.js # Framework validation tests
└── README.md                 # This file
```

## Dependencies

- **vitest**: Modern testing framework with fast execution
- **fast-check**: Property-based testing library for generating test data
- **jsdom**: DOM environment for testing browser interactions
- **c8**: Code coverage reporting

## Configuration

### Test Environment
- Uses jsdom for DOM simulation
- Configured for 100 iterations per property-based test
- Includes global test utilities and configuration

### Key Features
- Property-based test generators for element configurations
- CSS blocking detection utilities
- Interaction simulation helpers
- Comprehensive test reporting
- Mock portfolio page creation

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Utilities

### Global Configuration
- `TEST_CONFIG.PBT_ITERATIONS`: Number of property test iterations (100)
- `TEST_CONFIG.SELECTORS`: CSS selectors for portfolio elements
- `TEST_CONFIG.ELEMENT_TYPES`: Supported interactive element types

### Test Generators
- `elementConfigGenerator`: Generates random element configurations
- `cssBlockingGenerator`: Creates CSS property combinations
- `testScenarioGenerator`: Complete test scenario generation

### Test Helpers
- `validateTestElement()`: Validates element properties
- `simulateInteraction()`: Simulates user interactions
- `analyzeCSSBlocking()`: Detects CSS interaction blocking
- `createElementTestReport()`: Generates comprehensive test reports

### Mock Utilities
- `TestUtils.createMockElement()`: Creates test elements
- `TestUtils.createMockPortfolioPage()`: Sets up mock portfolio structure
- `TestUtils.simulateClick()`: Simulates click events
- `TestUtils.waitFor()`: Waits for conditions

## Property-Based Testing

The framework uses fast-check for property-based testing to validate interactions across many generated scenarios:

- **Element Generation**: Creates random interactive elements with various configurations
- **CSS Testing**: Tests different CSS property combinations that might block interactions
- **Performance Testing**: Validates response times across different scenarios
- **Browser Compatibility**: Tests across different browser configurations

## Next Steps

This framework provides the foundation for implementing the portfolio clickability testing system. The next tasks will build upon this infrastructure to create:

1. Element Scanner component
2. Event Listener Validator
3. CSS Analyzer
4. Interaction Tester
5. Real-Time Monitor
6. Test Reporter

Each component will use the utilities and generators provided by this framework to ensure comprehensive testing coverage.