/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Transformación únicamente para TypeScript/TSX
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        // Usa un tsconfig especializado para Jest (si lo necesitas)
        tsconfig: '<rootDir>/tsconfig.jest.json',
        isolatedModules: true,
        diagnostics: {
          ignoreCodes: [151001]
        }
      }
    ]
  },

  // Extensiones que Jest debe reconocer
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // ----------------------------------------------------------
  //  Esta parte es clave para que import { mockDispatch } from '@/setupTests'
  //  resuelva correctamente a <rootDir>/setupTests.ts
  // ----------------------------------------------------------
  moduleNameMapper: {
    // Mapeo explícito para "@/setupTests" → "<rootDir>/setupTests.ts"
    '^@/setupTests$': '<rootDir>/setupTests.ts',

    // Luego, el alias genérico "@/algo" → "<rootDir>/src/algo"
    '^@/(.*)$': '<rootDir>/src/$1',

    // Mockeo de estilos e imágenes (si los importas en componentes)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/_mocks_/fileMock.ts'
  },

  // Hooks que Jest ejecuta después de levantar el entorno (setupTests.ts)
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  // Ignorar transformaciones dentro de node_modules y .next
  transformIgnorePatterns: ['/node_modules/'],

  // No correr tests dentro de .next o node_modules
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/tests/e2e/'
  ],

  // Configuración de cobertura (opcional)
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/tests/',
    '!src/**/mocks/'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'app/layout.tsx',
    'app/dashboard/layout.tsx',
    'app/store/Providers.tsx',
    'app/store/slices',
    'app/services',
    'app/auth/register/page.tsx'
  ]
};