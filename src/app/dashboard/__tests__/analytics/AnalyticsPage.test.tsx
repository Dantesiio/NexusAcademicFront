// src/app/dashboard/__tests__/analytics/AnalyticsPage.test.tsx
import React from 'react';
import { render, screen, act, within, waitFor } from '@testing-library/react'; // Added waitFor
import AnalyticsPage from '../../analytics/page'; // Adjust path if needed
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../../../store/actions/studentActions'; // Adjust path
import { getCourses } from '../../../store/actions/courseActions';   // Adjust path
import { getSubmissions } from '../../../store/actions/submissionActions'; // Adjust path
// Import your types if not already (Student, Course, Submission etc.)
// For example:
// import { Student, Enrollment } from '../../../store/slices/studentSlice';
// import { Course } from '../../../store/slices/courseSlice';
// import { Submission, SubmissionCourse, SubmissionStudent } from '../../../store/slices/submissionSlice';


// Mocks (as you had them, ensure paths are correct)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Keep other exports if any
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('../../../store/actions/studentActions', () => ({ getStudents: jest.fn() }));
jest.mock('../../../store/actions/courseActions', () => ({ getCourses: jest.fn() }));
jest.mock('../../../store/actions/submissionActions', () => ({ getSubmissions: jest.fn() }));
jest.mock('../../../components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div data-testid="protected">{children}</div>),
}));
// Assuming MetricCard is part of AnalyticsPage.tsx and not a separate import to mock here.
// If MetricCard was a separate component, you might mock it too for isolation.

describe('AnalyticsPage', () => {
  const mockDispatchFn = jest.fn(); // Consistent dispatch mock

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatchFn);
    // Default useSelector mock (can be overridden per test)
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        students: { students: [], loading: false, error: null, pagination: {} },
        courses: { courses: [], loading: false, error: null, currentCourse: null },
        submissions: { submissions: [], loading: false, error: null, currentSubmission: null },
        auth: { isInitialized: true, loading: false, isAuthenticated: true, user: { id: 'u1', roles: ['admin'] } },
      })
    );
  });

  // ... (your 'despacha getStudents...' test) ...
  it('despacha getStudents, getCourses y getSubmissions al montar', async () => {
    // Using default useSelector from beforeEach which returns empty arrays initially
    render(<AnalyticsPage />);
    
    // useEffect dispatches these
    await waitFor(() => { // Wait for dispatches to occur
        expect(getStudents).toHaveBeenCalledWith({ limit: 1000, offset: 0 });
        expect(getCourses).toHaveBeenCalled();
        expect(getSubmissions).toHaveBeenCalled();
    });
  });

  it('muestra métricas correctamente con datos de ejemplo', async () => {
    const mockTeacher = { id: 't1', fullName: 'Profesor Test', email: 't@e.com', roles: ['teacher'] as string[], isActive: true };
    const mockStudentsData = [
      { id: 's1', name: 'Student A', age: 20, gender: 'F', nickname: 'AA', enrollments: [{ id: 'e1', courseId: 'c1', enrolledAt: 'date', score: 80 }] },
      { id: 's2', name: 'Student B', age: 21, gender: 'M', nickname: 'BB', enrollments: [] },
      { id: 's3', name: 'Student C', age: 22, gender: 'F', nickname: 'CC', enrollments: [{ id: 'e2', courseId: 'c2', enrolledAt: 'date', score: 90 }] },
    ];
    const mockCoursesData = [
      { id: 'c1', status: 'ACTIVE' as 'ACTIVE', name: 'Curso Activo 1', code: 'CA1', description: 'Desc C1', teacher: mockTeacher, startDate: '2023-01-01', endDate: '2023-01-02', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: 'c2', status: 'INACTIVE' as 'INACTIVE', name: 'Curso Inactivo 1', code: 'CI1', description: 'Desc C2', teacher: mockTeacher, startDate: '2023-01-01', endDate: '2023-01-02', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    ];
    const mockSubmissionsData = [
      { id: 'sub1', course: { id: 'c1', name: 'Curso Activo 1', code: 'CA1' }, student: {id: 's1', name: 'Student A'}, fileUrl: '', comments: '', grade: 4.0, submittedAt: 'date', createdAt: 'date', updatedAt: 'date' },
      { id: 'sub2', course: { id: 'c2', name: 'Curso Inactivo 1', code: 'CI1' }, student: {id: 's2', name: 'Student B'}, fileUrl: '', comments: '', grade: null, submittedAt: 'date', createdAt: 'date', updatedAt: 'date' },
      { id: 'sub3', course: { id: 'c1', name: 'Curso Activo 1', code: 'CA1' }, student: {id: 's3', name: 'Student C'}, fileUrl: '', comments: '', grade: 3.0, submittedAt: 'date', createdAt: 'date', updatedAt: 'date' },
    ];

    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        students: { students: mockStudentsData, loading: false, error: null, pagination: {limit:10, offset:0, total: mockStudentsData.length} },
        courses: { courses: mockCoursesData, loading: false, error: null, currentCourse: null },
        submissions: { submissions: mockSubmissionsData, loading: false, error: null, currentSubmission: null },
        auth: { isInitialized: true, loading: false, isAuthenticated: true, user: { id: 'u1', roles: ['teacher'] } },
      })
    );

    render(<AnalyticsPage />);

    // Total Estudiantes
    const totalStudentsCard = await screen.findByText('Total Estudiantes');
    const studentCardContainer = totalStudentsCard.closest('div.bg-white');
    await waitFor(() => {
        expect(within(studentCardContainer!).getByText(/^3$/)).toBeInTheDocument();
    });
    expect(within(studentCardContainer!).getByText('2 activos')).toBeInTheDocument();

    // Cursos Activos
    const activeCoursesCardTitle = await screen.findByText('Cursos Activos');
    const coursesCardContainer = activeCoursesCardTitle.closest('div.bg-white');
    await waitFor(() => {
        expect(within(coursesCardContainer!).getByText(/^1$/)).toBeInTheDocument();
    });
    expect(within(coursesCardContainer!).getByText('2 total')).toBeInTheDocument();

    // Entregas Totales
    const totalSubmissionsCardTitle = await screen.findByText('Entregas Totales');
    const submissionsCardContainer = totalSubmissionsCardTitle.closest('div.bg-white');
    await waitFor(() => {
        expect(within(submissionsCardContainer!).getByText(/^3$/)).toBeInTheDocument();
    });
    expect(within(submissionsCardContainer!).getByText('1 pendientes')).toBeInTheDocument();

    // Promedio General
    const averageGradeCardTitle = await screen.findByText('Promedio General');
    const gradeCardContainer = averageGradeCardTitle.closest('div.bg-white');
    await waitFor(() => {
        expect(within(gradeCardContainer!).getByText(/^3\.5$/)).toBeInTheDocument();
    });
    expect(within(gradeCardContainer!).getByText('de 5.0')).toBeInTheDocument();
    
    // Distribución de Calificaciones
    const gradeDistributionSection = (await screen.findByText('Distribución de Calificaciones')).closest('div.bg-white');
    expect(gradeDistributionSection).toBeInTheDocument();
    
    const excellentRow = within(gradeDistributionSection!).getByText('Excelente (4.5-5.0)').closest('div.flex.items-center.justify-between');
    expect(excellentRow).toBeInTheDocument();
    await waitFor(() => {
      expect(within(excellentRow!).getByText(/0\s*\(0%\)/)).toBeInTheDocument();
    });

    const goodRow = within(gradeDistributionSection!).getByText('Bueno (3.5-4.4)').closest('div.flex.items-center.justify-between');
    expect(goodRow).toBeInTheDocument();
    await waitFor(() => {
      expect(within(goodRow!).getByText(/1\s*\(50%\)/)).toBeInTheDocument();
    });
    
    const regularRow = within(gradeDistributionSection!).getByText('Regular (3.0-3.4)').closest('div.flex.items-center.justify-between');
    expect(regularRow).toBeInTheDocument();
    await waitFor(() => {
      expect(within(regularRow!).getByText(/1\s*\(50%\)/)).toBeInTheDocument();
    });

    const poorRow = within(gradeDistributionSection!).getByText('Deficiente (<3.0)').closest('div.flex.items-center.justify-between');
    expect(poorRow).toBeInTheDocument();
    await waitFor(() => {
      expect(within(poorRow!).getByText(/0\s*\(0%\)/)).toBeInTheDocument();
    });

    // Resumen de Cursos
    const coursesSummarySection = (await screen.findByText('Resumen de Cursos')).closest('div.bg-white');
    expect(coursesSummarySection).toBeInTheDocument();
    
    // Para Curso Activo 1 (C1)
    const c1Row = within(coursesSummarySection!).getByText('Curso Activo 1').closest('div.flex.items-center.justify-between');
    expect(c1Row).toBeInTheDocument();
    // Busca el <p> que contiene el código y el número de entregas
    // Asumiendo que el código 'CA1' es único para identificar el <p> dentro de c1Row si es necesario
    const c1DetailsParagraph = within(c1Row!).getByText(/CA1/i); // Encuentra el <p> usando parte de su texto
    expect(c1DetailsParagraph).toHaveTextContent(/2\s*entregas/); // Verifica que contenga "2 entregas"
    expect(within(c1Row!).getByText('3.5/5.0')).toBeInTheDocument();
    
    // Para Curso Inactivo 1 (C2)
    const c2Row = within(coursesSummarySection!).getByText('Curso Inactivo 1').closest('div.flex.items-center.justify-between');
    expect(c2Row).toBeInTheDocument();
    const c2DetailsParagraph = within(c2Row!).getByText(/CI1/i); // Encuentra el <p> usando parte de su texto
    expect(c2DetailsParagraph).toHaveTextContent(/1\s*entregas/); // Verifica que contenga "1 entregas"
    expect(within(c2Row!).getByText('Sin calificar')).toBeInTheDocument();
  });
});
