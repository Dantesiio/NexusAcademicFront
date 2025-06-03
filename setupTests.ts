import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';
import * as reactRedux from 'react-redux';

// Configuración extendida de Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000
});

// Tipado simplificado
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

// Mock de react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux') as typeof reactRedux,
  useDispatch: () => mockDispatch,
  useSelector: mockUseSelector.mockImplementation(() => ({ 
    courses: [], 
    loading: false 
  })),
}));

// Limpieza de mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  mockUseSelector.mockImplementation(() => ({ 
    courses: [], 
    loading: false 
  }));
});

export { mockDispatch, mockUseSelector };