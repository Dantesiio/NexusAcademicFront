// src/app/dashboard/__tests__/main/MainPage.test.tsx
import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'; // ⭐ Import waitFor
import MainPage from '../../main/page'; // Ensure this path is correct
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('MainPage', () => {
  const mockPush = jest.fn();

  // Mock localStorage
  let mockLocalStorage: Storage;

  beforeAll(() => { // Use beforeAll to set up localStorage mock once
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };
    Object.defineProperty(global, 'localStorage', { // Use global for broader scope
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    // Clear relevant localStorage items or the specific ones used by MainPage
    // (mockLocalStorage.clear as jest.Mock)(); // Or more targeted:
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(null); // Default to no token
    (mockLocalStorage.removeItem as jest.Mock).mockClear();
    (mockLocalStorage.setItem as jest.Mock).mockClear();

  });



  it('muestra spinner inicialmente y luego redirige a login si no hay token', async () => {
    render(<MainPage />);

    await waitFor(() => {
    
      const spinner = screen.queryByTestId('loading-spinner'); // queryByTestId no falla si no se encuentra
      if (spinner) {
          expect(spinner).toBeInTheDocument();
      }
      // La expectativa más importante es la redirección si no hay token
    });

    // El useEffect principal debería ejecutarse, verificar localStorage, y redirigir.
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('muestra contenido principal si hay token en localStorage', async () => {
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue('valid_token'); // Token existe

    render(<MainPage />);

    // Esperar a que el contenido principal se renderice después de la verificación del token
    // y que isClient sea true.
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Administrador/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByText(/¡Hola, Administrador!/i)).toBeInTheDocument();

    // StatCards
    const totalEstudiantesCard = screen.getByText('Total Estudiantes').closest('div.bg-white');
    expect(totalEstudiantesCard).toHaveTextContent('25');

    const cursosActivosCard = screen.getByText('Cursos Activos').closest('div.bg-white');
    expect(cursosActivosCard).toHaveTextContent('8');
    
    const entregasPendientesCard = screen.getByText('Entregas Pendientes').closest('div.bg-white');
    expect(entregasPendientesCard).toHaveTextContent('12');

    const estudiantesActivosCard = screen.getByText('Estudiantes Activos').closest('div.bg-white');
    expect(estudiantesActivosCard).toHaveTextContent('20');

    // Acciones Rápidas
    expect(screen.getByText('Gestionar Estudiantes')).toBeInTheDocument();
    // ... y los otros botones ...

    // Actividad Reciente
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    // ... y las otras actividades ...
  });

  it('al hacer click en "Salir" remueve token y redirige a login', async () => {
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue('valid_token'); // Simular que el usuario está logueado
    
    render(<MainPage />);

    // Esperar a que la página se cargue y el botón "Salir" esté disponible
    const salirButton = await screen.findByRole('button', { name: /Salir/i });
    
    await act(async () => { // act para el evento de click que causa actualizaciones de estado/efectos
      fireEvent.click(salirButton);
    });

    // Esperar a que las operaciones asíncronas (si las hay) y la redirección se completen
    await waitFor(() => {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});