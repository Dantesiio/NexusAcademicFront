
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';
import * as reactRedux from 'react-redux';
import type { MockedFunction } from '@jest/globals';


// Configuración extendida de Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000
});

// Tipado para los mocks
const mockDispatch = jest.fn() as MockedFunction<typeof reactRedux.useDispatch>;
const mockUseSelector = jest.fn() as MockedFunction<typeof reactRedux.useSelector>;

// Mock de react-redux con tipado fuerte
jest.mock('react-redux', () => ({
  ...jest.requireActual<typeof import('react-redux')>('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: mockUseSelector.mockImplementation(() => ({ 
    courses: [], 
    loading: false 
  })),
}));

// Limpieza de mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  // Configuración por defecto para useSelector
  mockUseSelector.mockImplementation(() => ({ 
    courses: [], 
    loading: false 
  }));
});

export { mockDispatch, mockUseSelector };