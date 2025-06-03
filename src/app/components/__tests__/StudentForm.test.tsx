import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentForm } from '../StudentForm';
import { mockDispatch } from '@/setupTests';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(() => ({ courses: [], loading: false })),
}));

const mockOnClose = jest.fn();

describe('StudentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los campos obligatorios', () => {
    render(<StudentForm onClose={mockOnClose} />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nickname/i)).toBeInTheDocument();
  });

  it('no envía si falta un campo requerido', async () => {
    render(<StudentForm onClose={mockOnClose} />);

    // Limpiamos cualquier dispatch que haya ocurrido durante el render
    mockDispatch.mockClear();

    // Solo llenamos "edad" (dejamos "nombre completo" y "email" vacíos a propósito)
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: '20' } });

    // Disparamos el submit en el form que tiene data-testid="student-form"
    fireEvent.submit(screen.getByTestId('student-form'));

    // Esperamos a que React procese el handleSubmit y verifique la validación
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('envía el formulario correctamente', async () => {
    render(<StudentForm onClose={mockOnClose} />);

    // Limpiamos cualquier dispatch que haya ocurrido durante el render
    mockDispatch.mockClear();

    // Llenamos todos los campos requeridos y opcionales
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan.perez@example.com' } });
    fireEvent.change(screen.getByLabelText(/género/i), { target: { value: 'Male' } });
    fireEvent.change(screen.getByLabelText(/nickname/i), { target: { value: 'juanito' } });

    // Disparamos el submit
    fireEvent.submit(screen.getByTestId('student-form'));

    // Esperamos a que React procese el handleSubmit y llame a dispatch y onClose
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('cierra el formulario al hacer click en cerrar', () => {
    render(<StudentForm onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});