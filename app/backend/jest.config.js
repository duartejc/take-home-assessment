module.exports = {
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest',
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.js',
    '!src/config/logger.ts',
    '!src/config/logger.js',
    '!src/middleware/**/*.ts',
    '!src/middleware/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testTimeout: 10000,
  maxWorkers: 1,
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
};
