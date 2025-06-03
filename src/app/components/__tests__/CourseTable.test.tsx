import { render, screen, fireEvent } from '@testing-library/react';
import { CourseTable } from '../CourseTable';

const mockOnEdit = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const courses = [
  {
    id: '1',
    name: 'Matemáticas',
    code: 'MAT-101',
    description: 'Curso de matemáticas básicas',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    teacher: { id: 't1', fullName: 'Prof. García', email: '', roles: ['teacher'], isActive: true },
  },
];

describe('CourseTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza las tarjetas de cursos', () => {
    render(<CourseTable courses={courses} onEdit={mockOnEdit} />);
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    expect(screen.getByText('MAT-101')).toBeInTheDocument();
    expect(screen.getByText('Curso de matemáticas básicas')).toBeInTheDocument();
  });

  it('llama a onEdit al hacer click en editar', () => {
    render(<CourseTable courses={courses} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(mockOnEdit).toHaveBeenCalledWith(courses[0]);
  });

  it('muestra el modal al hacer click en ver', () => {
    render(<CourseTable courses={courses} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Profesor:/)).toBeInTheDocument();
  });

  it('llama a dispatch al eliminar (confirmación positiva)', () => {
    window.confirm = jest.fn(() => true);
    render(<CourseTable courses={courses} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('no elimina si confirm es cancelado', () => {
    window.confirm = jest.fn(() => false);
    render(<CourseTable courses={courses} onEdit={mockOnEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
}); 