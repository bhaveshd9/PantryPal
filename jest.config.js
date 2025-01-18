const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app directory
});

const customJestConfig = {
  // Path to setup file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Specify the test environment
  testEnvironment: 'jest-environment-jsdom',

  // Map module aliases to match Next.js aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Transform configuration for Babel and TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Directories to ignore for tests
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  // Collect coverage and set the output directory
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Files to ignore from coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/jest.setup.ts',
  ],

  // Match test files with these patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)',
    '**/?(*.)+(test|spec).(ts|tsx|js|jsx)',
  ],
};

module.exports = createJestConfig(customJestConfig);
