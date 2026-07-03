/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom to simulate a browser environment for unit/integration tests
  testEnvironment: 'jest-environment-jsdom',

  // Only pick up files in tests/unit and tests/integration
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js',
  ],

  // Exclude Playwright e2e specs from Jest
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
  ],

  // Show verbose output per test
  verbose: true,

  // Collect coverage from script.js and server.js
  collectCoverageFrom: [
    'assets/js/script.js',
    'server.js',
  ],

  coverageDirectory: 'tests/coverage',

  coverageReporters: ['text', 'lcov', 'html'],
};
