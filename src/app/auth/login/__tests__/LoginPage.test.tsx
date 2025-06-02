/* src/app/auth/login/tests/LoginPage.test.tsx */
import React from 'react';
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

// Mock de useSelector para que isInitialized sea true e isAuthenticated sea false,
// y permita que luego, tras dispatch, no bloquee el render inicial.
jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useSelector: jest.fn((selectorFn: any) =>
      selectorFn({
        auth: {
          loading: false,
          error: null,
          isAuthenticated: false,
          isInitialized: true,
        },
      })
    ),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('permite iniciar sesión exitosamente y guarda el token', async () => {
    // Mock del servicio de login para que devuelva token simulado.
    const mockLogin = jest
      .spyOn(authService, 'login')
      .mockResolvedValue({
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

    // Ahora los inputs ya están disponibles porque isInitialized es true.
    const emailInput = await screen.findByPlaceholderText('admin@nexusacademic.com');
    const passwordInput = await screen.findByPlaceholderText('admin123');

    // Simular llenado de formulario
    fireEvent.change(emailInput, { target: { value: 'admin@nexusacademic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });

    // Simular submit
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Esperar a que el login se complete y verificar efectos secundarios
    await waitFor(() => {
      // Verifica que se llamó al servicio de login con los datos correctos
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@nexusacademic.com',
        password: 'admin123',
      });

      // Verifica que el token se guardó en localStorage
      expect(localStorage.getItem('token')).toBe('mock_token_123');

      // Verifica que se usó router.push para redirigir
      expect(mockPush).toHaveBeenCalledWith('/dashboard/main');
    });
  });
});