// src/app/dashboard/courses/__tests__/CoursesPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CoursesPage from '../../courses/page';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../../store/actions/courseActions'; // Correcto: ../../../ va a src/app/
import { CourseTable } from '../../../components/CourseTable';     // Correcto: ../../../ va a src/app/
import { CourseForm } from '../../../components/CourseForm';       // Correcto: ../../../ va a src/app/
import { Course, Teacher } from '../../../store/slices/courseSlice'; // Correcto: ../../../ va a src/app/
import { ProtectedRoute } from '../../../components/ProtectedRoute'; // Correcto: ../../../ va a src/app/
import { ClientOnlyWrapper } from '../../../components/ClientOnlyWrapper'; // Correcto: ../../../ va a src/app/


// Mocks
const mockActualDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockActualDispatch,
  useSelector: jest.fn(),
}));

jest.mock('../../../store/actions/courseActions', () => ({
  getCourses: jest.fn(),
}));

jest.mock('../../../components/CourseTable', () => ({
  CourseTable: jest.fn(({ courses, onEdit }) => (
    <div data-testid="mock-course-table">
      <p>Courses Rendered: {courses.length}</p>
      {/* Permitir simular la edición del primer curso para la prueba */}
      {courses.length > 0 && (
        <button onClick={() => onEdit(courses[0])}>
          Edit {courses[0].name}
        </button>
      )}
    </div>
  )),
}));

jest.mock('../../../components/CourseForm', () => ({
  CourseForm: jest.fn(({ course, onClose }) => (
    <div data-testid="mock-course-form">
      <span>{course ? `Editing: ${course.name}` : 'New Course Form'}</span>
      <button onClick={onClose}>Close Mock Form</button>
    </div>
  )),
}));

jest.mock('../../../components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div data-testid="protected-route">{children}</div>),
}));

jest.mock('../../../components/ClientOnlyWrapper', () => ({
  ClientOnlyWrapper: jest.fn(({ children }) => <div data-testid="client-wrapper">{children}</div>),
}));

// Mock de datos
const mockTeacherData: Teacher = { id: 't1', fullName: 'Profesor Mock', email: 'prof@mock.com', roles: ['teacher'], isActive: true };
const mockCoursesListData: Course[] = [
  {
    id: '1', name: 'Curso de React', code: 'REACT-101', description: 'Aprende React', status: 'ACTIVE',
    teacher: mockTeacherData, startDate: '2023-01-01', endDate: '2023-06-30', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2', name: 'Curso de Node.js', code: 'NODE-201', description: 'Backend con Node', status: 'INACTIVE',
    teacher: mockTeacherData, startDate: '2023-02-01', endDate: '2023-07-31', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3', name: 'Curso de Angular', code: 'ANG-301', description: 'Framework Angular', status: 'ACTIVE',
    teacher: mockTeacherData, startDate: '2023-03-01', endDate: '2023-08-31', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z'
  }
];

const MOCK_AUTH_USER_STATE = { user: { id: 'u1', roles: ['admin'] } };
let mockCurrentReduxState: any;

describe('CoursesPage', () => {
  beforeEach(() => {
    mockActualDispatch.mockClear();
    (getCourses as jest.Mock).mockClear();
    (CourseTable as jest.Mock).mockClear();
    (CourseForm as jest.Mock).mockClear();
    (useSelector as jest.Mock).mockClear();

    mockCurrentReduxState = {
      courses: {
        courses: [...mockCoursesListData],
        loading: false,
        error: null,
      },
      auth: MOCK_AUTH_USER_STATE,
    };
    (useSelector as jest.Mock).mockImplementation(selectorFn => selectorFn(mockCurrentReduxState));
  });

  it('renderiza correctamente el título y botón de nuevo curso', () => {
    render(<CoursesPage />);
    expect(screen.getByText('Gestión de Cursos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nuevo Curso/i })).toBeInTheDocument();
  });

  it('llama a getCourses al montar el componente', () => {
    render(<CoursesPage />);
    expect(mockActualDispatch).toHaveBeenCalledTimes(1);
    expect(getCourses).toHaveBeenCalledTimes(1);
  });

  it('muestra el loading spinner cuando está cargando y no hay cursos', () => {
    mockCurrentReduxState.courses = { courses: [], loading: true, error: null };
    (useSelector as jest.Mock).mockImplementation(selectorFn => selectorFn(mockCurrentReduxState));

    render(<CoursesPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando hay un error', () => {
    const errorMessage = 'Error al cargar cursos';
    mockCurrentReduxState.courses = { courses: [], loading: false, error: errorMessage };
    (useSelector as jest.Mock).mockImplementation(selectorFn => selectorFn(mockCurrentReduxState));

    render(<CoursesPage />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('filtra cursos por término de búsqueda', async () => {
    render(<CoursesPage />);
    const searchInput = screen.getByPlaceholderText('Buscar cursos...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'React' } });
    });

    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(2);
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses).toEqual([
        expect.objectContaining({ name: 'Curso de React', id: '1' })
      ]);
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Curso' } });
    });

    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses.length).toBe(3);
      expect(lastCallProps.courses).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Curso de React' }),
          expect.objectContaining({ name: 'Curso de Node.js' }),
          expect.objectContaining({ name: 'Curso de Angular' }),
        ])
      );
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } });
    });

    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses.length).toBe(mockCoursesListData.length);
    });
  });

  it('filtra cursos por estado', async () => {
    render(<CoursesPage />);
    const statusFilterSelect = screen.getByRole('combobox', { name: 'Filtrar por estado' });
    
    await act(async () => {
      fireEvent.change(statusFilterSelect, { target: { value: 'ACTIVE' } });
    });
    
    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses.length).toBe(2);
      expect(lastCallProps.courses).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ status: 'ACTIVE', name: 'Curso de React' }),
          expect.objectContaining({ status: 'ACTIVE', name: 'Curso de Angular' }),
        ])
      );
    });

    await act(async () => {
      fireEvent.change(statusFilterSelect, { target: { value: 'INACTIVE' } });
    });
    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses.length).toBe(1);
      expect(lastCallProps.courses).toEqual([
        expect.objectContaining({ status: 'INACTIVE', name: 'Curso de Node.js' }),
      ]);
    });

    await act(async () => {
      fireEvent.change(statusFilterSelect, { target: { value: 'ALL' } });
    });
    await waitFor(() => {
      const calls = (CourseTable as jest.Mock).mock.calls;
      const lastCallProps = calls[calls.length - 1][0];
      expect(lastCallProps.courses.length).toBe(mockCoursesListData.length);
    });
  });

  it('abre el formulario al hacer clic en "Nuevo Curso" y lo cierra', async () => {
    render(<CoursesPage />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Nuevo Curso/i }));
    });
    
    await screen.findByTestId('mock-course-form'); // Espera a que el formulario aparezca

    // Verificar las props pasadas a CourseForm
    const courseFormCalls = (CourseForm as jest.Mock).mock.calls;
    expect(courseFormCalls.length).toBe(1);
    const propsPassedToCourseForm = courseFormCalls[0][0];
    expect(propsPassedToCourseForm.course).toBeUndefined();
    expect(propsPassedToCourseForm).toHaveProperty('onClose');
    expect(typeof propsPassedToCourseForm.onClose).toBe('function');

    // Simular cierre del formulario
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Close Mock Form/i }));
    });

    await waitFor(() => {
      expect(screen.queryByTestId('mock-course-form')).not.toBeInTheDocument();
    });
  });

  it('abre el formulario en modo edición y lo cierra', async () => {
    render(<CoursesPage />);
    
    // Simular clic en el botón de editar del mock de CourseTable para el primer curso
    // Asegúrate que mockCoursesListData[0] exista.
    const courseToEdit = mockCoursesListData[0];
    await act(async () => {
      // El mock de CourseTable debería renderizar un botón con este nombre si courses tiene elementos
      fireEvent.click(screen.getByRole('button', { name: `Edit ${courseToEdit.name}` }));
    });
    
    await screen.findByTestId('mock-course-form'); // Espera a que aparezca

    // Verificar las props pasadas a CourseForm
    const courseFormCalls = (CourseForm as jest.Mock).mock.calls;
    expect(courseFormCalls.length).toBe(1); // Asumiendo que no se llamó antes en esta prueba
    const propsPassedToCourseForm = courseFormCalls[0][0];
    expect(propsPassedToCourseForm.course).toEqual(courseToEdit);
    expect(propsPassedToCourseForm).toHaveProperty('onClose');
    expect(typeof propsPassedToCourseForm.onClose).toBe('function');
    
    // Simular cierre del formulario
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Close Mock Form/i }));
    });

    await waitFor(() => {
      expect(screen.queryByTestId('mock-course-form')).not.toBeInTheDocument();
    });
  });

  it('muestra mensaje "No hay cursos registrados" cuando la lista de cursos está vacía y no está cargando', () => {
    mockCurrentReduxState.courses = { courses: [], loading: false, error: null };
    (useSelector as jest.Mock).mockImplementation(selectorFn => selectorFn(mockCurrentReduxState));

    render(<CoursesPage />);
    expect(screen.getByText('No hay cursos registrados')).toBeInTheDocument();
  });

  it('muestra mensaje "No se encontraron cursos..." cuando el filtro no devuelve resultados pero hay cursos originalmente', async () => {
    // El estado inicial ya tiene mockCoursesListData (3 cursos)
    render(<CoursesPage />);
    
    const searchInput = screen.getByPlaceholderText('Buscar cursos...');
    
    // Antes de filtrar, CourseTable existe y tiene cursos
    expect(screen.getByTestId('mock-course-table')).toBeInTheDocument();
    let initialCalls = (CourseTable as jest.Mock).mock.calls;
    expect(initialCalls[initialCalls.length - 1][0].courses.length).toBe(mockCoursesListData.length);

    // Aplicar un filtro que no devuelva resultados
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'CursoQueDefinitivamenteNoExisteEnLaLista' } });
    });
    
    await waitFor(() => {
      // Verificar que el mensaje correcto se muestre
      expect(screen.getByText('No se encontraron cursos con los filtros aplicados')).toBeInTheDocument();
      
      // Verificar que CourseTable ya NO esté en el documento (porque se muestra el mensaje en su lugar)
      expect(screen.queryByTestId('mock-course-table')).not.toBeInTheDocument();

    
    });
  });
});

