import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentForm } from '../StudentForm';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(fn => ({ courses: [], loading: false })),
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
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/género/i), { target: { value: 'Male' } });
    fireEvent.submit(screen.getByTestId('student-form'));
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('envía el formulario correctamente', async () => {
    render(<StudentForm onClose={mockOnClose} />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan.perez@example.com' } });
    fireEvent.change(screen.getByLabelText(/género/i), { target: { value: 'Male' } });
    fireEvent.change(screen.getByLabelText(/nickname/i), { target: { value: 'juanito' } });
    fireEvent.submit(screen.getByTestId('student-form'));
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