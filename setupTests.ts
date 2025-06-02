// src/setupTests.ts

import '@testing-library/jest-dom'; // Extiende expect con matchers como toBeInTheDocument
import { jest } from '@jest/globals';
import * as reactRedux from 'react-redux';

// Limpia los mocks antes de cada test para evitar interferencias entre ellos
beforeEach(() => {
  jest.clearAllMocks();
});

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
    const actual = jest.requireActual<typeof import('react-redux')>('react-redux');
    return {
      ...actual,
      useDispatch: () => mockDispatch,
      useSelector: jest.fn(() => ({ courses: [], loading: false })),
    };
  });
  


// Exporta mockDispatch para usarlo fácilmente en tus tests
export { mockDispatch };
