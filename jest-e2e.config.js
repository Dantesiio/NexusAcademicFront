module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/app/tests/e2e'],
    testMatch: ['**/*.test.ts'],
    testTimeout: 180000, // 3 minutos
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: '<rootDir>/tsconfig.json'
        }
      ]
    },
    setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.ts'],
    reporters: [
      'default',
      ['jest-html-reporters', {
        publicPath: './e2e-test-results',
        filename: 'report.html',
        openReport: false
      }]
    ]
  };