import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { SidebarItemMenu } from '../SidebarItemMenu';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

// Mocks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: jest.fn(),
}));

// Mock para useLogout
const mockLogout = jest.fn();
jest.mock('../../hooks/useLogout', () => ({
  useLogout: () => mockLogout,
}));

describe('SidebarItemMenu', () => {
  it('resalta el item activo basado en usePathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/main');
    render(
      <SidebarItemMenu 
        href="/dashboard/main" 
        icon={<span>Icono</span>} 
        title="Principal" 
      />
    );
    const link = screen.getByRole('link', { name: /principal/i });
    expect(link).toHaveClass('bg-blue-100');
  });

  it('muestra estilo inactivo si href no coincide con la ruta', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/other');
    render(
      <SidebarItemMenu 
        href="/dashboard/main" 
        icon={<span>Icono</span>} 
        title="Principal" 
      />
    );
    const link = screen.getByRole('link', { name: /principal/i });
    expect(link).toHaveClass('hover:bg-black-100');
  });
});

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock por defecto para pruebas que necesitan usuario
    (useSelector as jest.Mock).mockImplementation((selector) => 
      selector({
        auth: { 
          user: { 
            id: 'u1', 
            fullName: 'Usuario Uno', 
            email: '', 
            roles: ['teacher'] 
          }, 
          loading: false 
        }
      })
    );
  });

  it('muestra spinner si no hay usuario en estado', () => {
    // Sobreescribimos el mock para esta prueba específica
    (useSelector as jest.Mock).mockImplementation((selector) => 
      selector({
        auth: { user: null, loading: false }
      })
    );
    
    render(<Sidebar />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('muestra menú filtrado según roles y renderiza items', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/courses');
    render(<Sidebar />);
    expect(screen.getByText(/cursos/i)).toBeInTheDocument();
  });

  it('al hacer click en Logout llama al hook useLogout', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText(/cerrar sesión/i));
    expect(mockLogout).toHaveBeenCalled();
  });
});