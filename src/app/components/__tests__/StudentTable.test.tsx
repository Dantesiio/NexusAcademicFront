import { render, screen, fireEvent } from '@testing-library/react';
import { StudentTable } from '../StudentTable';

const mockOnEdit = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('next/image', () => (props) => <img {...props} />);

const students = [
  {
    id: '1',
    name: 'Juan Pérez',
    age: 20,
    email: 'juan.perez@example.com',
    gender: 'Masculino',
    nickname: 'juanito',
    enrollments: [{ courseId: '1', enrolledAt: '2024-01-01', score: 90 }],
  },
];

describe('StudentTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza la tabla con estudiantes', () => {
    render(<StudentTable students={students} onEdit={mockOnEdit} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan.perez@example.com')).toBeInTheDocument();
    expect(screen.getByText('juanito')).toBeInTheDocument();
  });

  it('llama a onEdit al hacer click en editar', () => {
    render(<StudentTable students={students} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Editar es el segundo botón
    expect(mockOnEdit).toHaveBeenCalledWith(students[0]);
  });

  it('muestra el modal al hacer click en ver', () => {
    render(<StudentTable students={students} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Ver es el primer botón
    expect(screen.getByText(/detalles del estudiante/i)).toBeInTheDocument();
  });

  it('llama a dispatch al eliminar (confirmación positiva)', () => {
    window.confirm = jest.fn(() => true);
    render(<StudentTable students={students} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Eliminar es el tercer botón
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('no elimina si confirm es cancelado', () => {
    window.confirm = jest.fn(() => false);
    render(<StudentTable students={students} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Eliminar es el tercer botón
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  
}); 