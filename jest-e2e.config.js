module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/e2e/**/*.test.[jt]s?(x)'],
    globalSetup: '<rootDir>/tests/e2e/config/setup.ts',
    globalTeardown: '<rootDir>/tests/e2e/config/teardown.ts',
    setupFilesAfterEnv: ['<rootDir>/tests/e2e/config/jest.setup.ts'],
  };