/* src/app/auth/register/tests/RegisterPage.test.tsx */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import RegisterPage from '../page';

jest.useFakeTimers();

// Mock de useRouter de Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('no envía si falta algún campo y muestra mensaje de error tras el delay', async () => {
    render(<RegisterPage />);
  
    // Esperar hidratación
    await act(async () => {
      await Promise.resolve();
    });
  
    // Enviar formulario vacío
    await act(async () => {
      fireEvent.submit(screen.getByTestId('register-form'));
      jest.runAllTimers();
    });
  
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/todos los campos son requeridos/i)).toBeInTheDocument();
    });

    // 5) Verificamos que no hubo redirección ni guardado de token
    expect(mockPush).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  });
});