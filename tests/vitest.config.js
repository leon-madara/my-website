import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup/test-setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'setup/',
        '**/*.config.js',
        '**/*.test.js'
      ]
    },
    // Property-based testing configuration
    testTimeout: 10000, // Allow more time for property tests
    hookTimeout: 5000
  },
  resolve: {
    alias: {
      '@': new URL('../', import.meta.url).pathname
    }
  }
});