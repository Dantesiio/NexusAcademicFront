/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/setupTests$': '<rootDir>/setupTests.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**"
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'app/layout.tsx',
    'app/dashboard/layout.tsx',
    'app/hooks/useLogout.ts',
    'app/store/Providers.tsx',
    'app/store/slices',
    'app/services',
    'app/auth/register/page.tsx'
  ],

};