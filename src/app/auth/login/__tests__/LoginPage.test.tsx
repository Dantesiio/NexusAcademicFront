/* global jest */


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { authService } from '../../../services/authService';


// Mock de useRouter de Next.js
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/auth/login',
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Limpia localStorage y mocks antes de cada test
    localStorage.clear();
    mockPush.mockClear();
  });

  it('permite iniciar sesión exitosamente y guarda el token', async () => {
    // Mock del servicio de login
    const mockLogin = jest.spyOn(authService, 'login').mockResolvedValue({
      id: '1',
      email: 'admin@nexusacademic.com',
      fullName: 'Administrador',
      roles: ['admin'],
      isActive: true,
      token: 'mock_token_123',
    });

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    // Simular llenado de formulario
    fireEvent.change(screen.getByPlaceholderText('admin@nexusacademic.com'), {
      target: { value: 'admin@nexusacademic.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('admin123'), {
      target: { value: 'admin123' },
    });

    // Simular submit
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Esperar a que el login se complete y verificar efectos secundarios
    await waitFor(() => {
      // Verifica que se llamó al servicio de login
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@nexusacademic.com',
        password: 'admin123',
      });

      // Verifica que el token se guardó (ajusta si usas Redux puro)
      expect(localStorage.getItem('token')).toBe('mock_token_123');

      // Verifica que hubo redirección
      expect(mockReplace).toHaveBeenCalledWith('/dashboard/main');
    });
  });
}); 