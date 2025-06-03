import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import React from 'react';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const useSelector = require('react-redux').useSelector;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loader si loading o no inicializado', () => {
    useSelector.mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      loading: true,
      isInitialized: false,
    }));
    render(<ProtectedRoute><div>Contenido</div></ProtectedRoute>);
    expect(screen.getByText(/Verificando autenticación/i)).toBeInTheDocument();
  });

  it('renderiza hijos si autenticado y rol correcto', () => {
    useSelector.mockImplementation(() => ({
      isAuthenticated: true,
      user: { roles: ['admin'] },
      loading: false,
      isInitialized: true,
    }));
    render(<ProtectedRoute requiredRoles={['admin']}><div>Contenido</div></ProtectedRoute>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('redirige si no autenticado', () => {
    useSelector.mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      isInitialized: true,
    }));
    render(<ProtectedRoute><div>Contenido</div></ProtectedRoute>);
    expect(mockReplace).toHaveBeenCalledWith('/auth/login');
  });

  it('redirige si no tiene el rol requerido', () => {
    useSelector.mockImplementation(() => ({
      isAuthenticated: true,
      user: { roles: ['student'] },
      loading: false,
      isInitialized: true,
    }));
    render(<ProtectedRoute requiredRoles={['admin']}><div>Contenido</div></ProtectedRoute>);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard/main');
  });
}); 