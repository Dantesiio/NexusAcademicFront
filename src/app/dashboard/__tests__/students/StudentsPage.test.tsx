import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import StudentsPage from '../../students/page';

import { Student } from '../../../store/slices/studentSlice';
import { getStudents } from '../../../store/actions/studentActions'; 

// Mockear los módulos y componentes necesarios
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../store/actions/studentActions', () => ({

  getStudents: jest.fn(),
}));


jest.mock('../../../components/StudentTable', () => ({
  StudentTable: jest.fn(({ students, onEdit }) => (
    <div data-testid="student-table">
      <p>{`Total Students: ${students.length}`}</p>
      {students.map((student: Student) => (
        <button key={student.id} onClick={() => onEdit(student)}>
          {`Edit ${student.name}`}
        </button>
      ))}
    </div>
  )),
}));

jest.mock('../../../components/StudentForm', () => ({
  StudentForm: jest.fn(({ student, onClose }) => (
    <div data-testid="student-form">
      <h2>{student ? `Edit Student: ${student.name}` : 'Create New Student'}</h2>
      <button onClick={onClose}>Close Form</button>
    </div>
  )),
}));

jest.mock('../../../components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div data-testid="protected-route">{children}</div>),
}));

jest.mock('../../../components/ClientOnlyWrapper', () => ({
  ClientOnlyWrapper: jest.fn(({ children }) => <div data-testid="client-only-wrapper">{children}</div>),
}));

// Mock de datos
const mockStudentList: Student[] = [
  { id: '1', name: 'Alice Wonderland', age: 20, email: 'alice@example.com', gender: 'F', nickname: 'AliW' },
  { id: '2', name: 'Bob The Builder', age: 22, email: 'bob@example.com', gender: 'M', nickname: 'BTB' },
  { id: '3', name: 'Charlie Brown', age: 21, email: 'charlie@example.com', gender: 'M', nickname: 'Chuck' },
];

describe('StudentsPage', () => {
  let mockAppDispatch: jest.Mock; // Renombrado para claridad

  beforeEach(() => {
    mockAppDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    // Configuración por defecto para useSelector, se puede sobrescribir por prueba
    (useSelector as jest.Mock).mockReturnValue({
      students: [],
      loading: false,
      error: null,
    });
    (getStudents as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el título y despachar getStudents al montar', () => {
    render(<StudentsPage />);
    expect(screen.getByText('Gestión de Estudiantes')).toBeInTheDocument();
    expect(mockAppDispatch).toHaveBeenCalledTimes(1); // El dispatch del useEffect
    expect(getStudents).toHaveBeenCalledWith({ limit: 50, offset: 0 });
  });

  it('debería mostrar el indicador de carga cuando loading es true y no hay estudiantes', () => {
    (useSelector as jest.Mock).mockReturnValue({
      students: [],
      loading: true,
      error: null,
    });
    render(<StudentsPage />);
    // Asegúrate de que tu spinner tenga data-testid="loading-spinner" o role="status"
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('no debería mostrar el indicador de carga si loading es true PERO ya hay estudiantes', () => {
    (useSelector as jest.Mock).mockReturnValue({
      students: [mockStudentList[0]],
      loading: true,
      error: null,
    });
    render(<StudentsPage />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('student-table')).toBeInTheDocument();
  });

  it('debería mostrar un mensaje de error si existe un error en el estado', () => {
    const errorMessage = 'Fallo al cargar estudiantes';
    (useSelector as jest.Mock).mockReturnValue({
      students: [],
      loading: false,
      error: errorMessage,
    });
    render(<StudentsPage />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('debería renderizar StudentTable con los estudiantes del estado', () => {
    (useSelector as jest.Mock).mockReturnValue({
      students: mockStudentList,
      loading: false,
      error: null,
    });
    render(<StudentsPage />);
    expect(screen.getByTestId('student-table')).toBeInTheDocument();
    expect(screen.getByText(`Total Students: ${mockStudentList.length}`)).toBeInTheDocument();
  });

  it('debería filtrar estudiantes al escribir en el campo de búsqueda', async () => {
    (useSelector as jest.Mock).mockReturnValue({
      students: mockStudentList,
      loading: false,
      error: null,
    });
    render(<StudentsPage />);

    const searchInput = screen.getByPlaceholderText('Buscar estudiantes...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Alice' } });
    });
    await waitFor(() => {
      // Asumiendo que el mock de StudentTable se actualiza con la nueva longitud
      expect(screen.getByText('Total Students: 1')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'example.com' } });
    });
    await waitFor(() => {
      expect(screen.getByText(`Total Students: ${mockStudentList.length}`)).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } });
    });
    await waitFor(() => {
      expect(screen.getByText(`Total Students: ${mockStudentList.length}`)).toBeInTheDocument();
    });
  });

  it('debería mostrar StudentForm al hacer clic en "Nuevo Estudiante" y ocultarlo al simular cierre', async () => {
    render(<StudentsPage />);
    
    const newStudentButton = screen.getByRole('button', { name: /Nuevo Estudiante/i });
    await act(async () => {
      fireEvent.click(newStudentButton);
    });
    
    expect(screen.getByTestId('student-form')).toBeInTheDocument();
    expect(screen.getByText('Create New Student')).toBeInTheDocument(); // Del mock de StudentForm

    // Simular el cierre del formulario a través de la prop onClose
    const closeButtonInFormMock = screen.getByRole('button', { name: /Close Form/i }); // Botón en el mock de StudentForm
    await act(async () => {
      fireEvent.click(closeButtonInFormMock);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('student-form')).not.toBeInTheDocument();
    });
  });

  it('debería mostrar StudentForm con datos al editar y ocultarlo al simular cierre', async () => {
     (useSelector as jest.Mock).mockReturnValue({
      students: mockStudentList,
      loading: false,
      error: null,
    });
    render(<StudentsPage />);

    // Simular clic en el botón de editar del primer estudiante (del mock de StudentTable)
    const editAliceButton = screen.getByRole('button', { name: `Edit ${mockStudentList[0].name}` });
     await act(async () => {
      fireEvent.click(editAliceButton);
    });

    expect(screen.getByTestId('student-form')).toBeInTheDocument();
    expect(screen.getByText(`Edit Student: ${mockStudentList[0].name}`)).toBeInTheDocument(); // Del mock de StudentForm

    const closeButtonInFormMock = screen.getByRole('button', { name: /Close Form/i });
    await act(async () => {
      fireEvent.click(closeButtonInFormMock);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('student-form')).not.toBeInTheDocument();
    });
  });
});
