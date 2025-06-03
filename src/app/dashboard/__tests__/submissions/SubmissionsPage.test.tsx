// src/app/dashboard/__tests__/submissions/SubmissionsPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import SubmissionsPage from '../../submissions/page'; // Ajusta la ruta si es necesario
import {
  Submission,
  SubmissionCourse,
  SubmissionStudent,
} from '../../../store/slices/submissionSlice'; // Ajusta la ruta
import { getSubmissions, gradeSubmission } from '../../../store/actions/submissionActions'; // Ajusta la ruta
import { getStudents } from '../../../store/actions/studentActions'; // Ajusta la ruta
import { getCourses } from '../../../store/actions/courseActions'; // Ajusta la ruta

// Mocks
const mockAppDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockAppDispatch,
  useSelector: jest.fn(),
}));

jest.mock('../../../store/actions/submissionActions', () => ({
  getSubmissions: jest.fn(),
  gradeSubmission: jest.fn(),
}));
jest.mock('../../../store/actions/studentActions', () => ({ getStudents: jest.fn() }));
jest.mock('../../../store/actions/courseActions', () => ({ getCourses: jest.fn() }));

jest.mock('../../../components/ProtectedRoute', () => ({
  ProtectedRoute: jest.fn(({ children }) => <div data-testid="protected-route">{children}</div>),
}));

// Mock de datos
const mockCourseS1: SubmissionCourse = { id: 'c1', name: 'Programación I', code: 'PRG1' };
const mockCourseS2: SubmissionCourse = { id: 'c2', name: 'Diseño Web', code: 'WEB1' };
const mockStudentS1: SubmissionStudent = { id: 's1', name: 'Laura Diaz' };
const mockStudentS2: SubmissionStudent = { id: 's2', name: 'Pedro Pascal' };

const mockSubmissionsList: Submission[] = [
  {
    id: 'sub001', course: mockCourseS1, student: mockStudentS1, fileUrl: 'url.pdf',
    comments: 'Entrega tarea 1', grade: null, submittedAt: '2024-05-01T10:00:00Z',
    createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'sub002', course: mockCourseS2, student: mockStudentS2, fileUrl: 'url.zip',
    comments: 'Proyecto final Diseño', grade: 4.8, submittedAt: '2024-05-05T14:00:00Z',
    createdAt: '2024-05-05T14:00:00Z', updatedAt: '2024-05-06T09:00:00Z'
  },
  {
    id: 'sub003', course: mockCourseS1, student: mockStudentS2, fileUrl: 'url.docx',
    comments: 'Entrega tarea 2 Programación', grade: 3.5, submittedAt: '2024-05-10T11:00:00Z',
    createdAt: '2024-05-10T11:00:00Z', updatedAt: '2024-05-11T12:00:00Z'
  },
];

let currentMockReduxState: any;
const mockAlertGlobal = jest.fn();

describe('SubmissionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppDispatch.mockClear(); // Específicamente limpiar el mock de dispatch

    currentMockReduxState = {
      submissions: {
        submissions: [...mockSubmissionsList], // Usar copia para evitar mutación entre tests
        loading: false,
        error: null,
        currentSubmission: null,
      },
      courses: { courses: [], loading: false, error: null, currentCourse: null }, // Simular estado para otros slices
      students: { students: [], loading: false, error: null, currentStudent: null, pagination: {} },
      auth: { user: { id: 'u1', roles: ['admin'] }, isInitialized: true, loading: false, isAuthenticated: true },
    };
    (useSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(currentMockReduxState));

    global.alert = mockAlertGlobal;
    mockAlertGlobal.mockClear();
  });

  it('debería renderizar el título y despachar acciones de carga inicial', () => {
    render(<SubmissionsPage />);
    expect(screen.getByText('Gestión de Entregas')).toBeInTheDocument();
    expect(mockAppDispatch).toHaveBeenCalledTimes(3);
    expect(getSubmissions).toHaveBeenCalledTimes(1);
    expect(getCourses).toHaveBeenCalledTimes(1);
    expect(getStudents).toHaveBeenCalledWith({ limit: 100, offset: 0 });
  });

  it('debería mostrar el spinner si está cargando y no hay entregas', () => {
    currentMockReduxState.submissions = { submissions: [], loading: true, error: null, currentSubmission: null };
    (useSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(currentMockReduxState));
    render(<SubmissionsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('debería mostrar un mensaje de error si existe', () => {
    const errorMsg = 'Fallo al cargar entregas';
    currentMockReduxState.submissions = { submissions: [], loading: false, error: errorMsg, currentSubmission: null };
    (useSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(currentMockReduxState));
    render(<SubmissionsPage />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('debería mostrar las tarjetas de entregas', () => {
    render(<SubmissionsPage />);
    // ⭐ Asegúrate de que el div que envuelve el .map tenga data-testid="submissions-grid"
    const submissionsGrid = screen.getByTestId('submissions-grid');

    expect(within(submissionsGrid).getByText('Laura Diaz')).toBeInTheDocument();
    expect(within(submissionsGrid).getAllByText('Pedro Pascal').length).toBe(2); // Pedro tiene 2 entregas

    // "Curso de Programación I" aparece para sub001 y sub003
    expect(within(submissionsGrid).getAllByText('Programación I').length).toBe(2);
    expect(within(submissionsGrid).getByText('Diseño Web')).toBeInTheDocument(); // Para sub002

    const pendingElementsInGrid = within(submissionsGrid).getAllByText(/Pendiente/i);
    expect(pendingElementsInGrid.length).toBe(1);

    expect(within(submissionsGrid).getByText(`${mockSubmissionsList[1].grade}/5.0`)).toBeInTheDocument();
    expect(within(submissionsGrid).getByText(`${mockSubmissionsList[2].grade}/5.0`)).toBeInTheDocument();
  });

  it('debería filtrar entregas por término de búsqueda (nombre de estudiante)', async () => {
    render(<SubmissionsPage />);
    const searchInput = screen.getByPlaceholderText('Buscar entregas...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Laura Diaz' } });
    });
    await waitFor(() => {
      const submissionsGrid = screen.getByTestId('submissions-grid');
      expect(within(submissionsGrid).getByText('Laura Diaz')).toBeInTheDocument();
      expect(within(submissionsGrid).queryByText('Pedro Pascal')).not.toBeInTheDocument();
    });
  });

  it('debería filtrar entregas por estado "Pendientes"', async () => {
    render(<SubmissionsPage />);
    // ⭐ Asegúrate que tu select tenga este aria-label en SubmissionsPage.tsx
    const statusSelect = screen.getByRole('combobox', { name: /Filtrar por estado de entrega/i }); 
    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: 'PENDING' } });
    });
    await waitFor(() => {
      const submissionsGrid = screen.getByTestId('submissions-grid');
      expect(within(submissionsGrid).getByText('Laura Diaz')).toBeInTheDocument();
      expect(within(submissionsGrid).queryByText('Pedro Pascal')).not.toBeInTheDocument();
      const pendingElementsInGrid = within(submissionsGrid).getAllByText(/Pendiente/i);
      expect(pendingElementsInGrid.length).toBe(1);
    });
  });
  
  it('debería filtrar entregas por estado "Calificadas"', async () => {
    render(<SubmissionsPage />);
    const statusSelect = screen.getByRole('combobox', {name: /Filtrar por estado de entrega/i});
    await act(async () => {
        fireEvent.change(statusSelect, { target: { value: 'GRADED' } });
    });
    await waitFor(() => {
        const submissionsGrid = screen.getByTestId('submissions-grid');
        expect(within(submissionsGrid).queryByText('Laura Diaz')).not.toBeInTheDocument();
        const pedroPascalCardsInGrid = within(submissionsGrid).getAllByText('Pedro Pascal');
        expect(pedroPascalCardsInGrid.length).toBe(2);
        const gradedMarksInGrid = within(submissionsGrid).getAllByText(/\d\.\d\/5\.0/i);
        expect(gradedMarksInGrid.length).toBe(2);
    });
  });

  it('debería mostrar "No se han registrado entregas aún." si la lista original está vacía', () => {
    currentMockReduxState.submissions = { submissions: [], loading: false, error: null, currentSubmission: null };
    (useSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(currentMockReduxState));
    render(<SubmissionsPage />);
    expect(screen.getByText('No se han registrado entregas aún.')).toBeInTheDocument();
  });

  it('debería mostrar "No se encontraron entregas con los filtros aplicados." si el filtro no devuelve nada', async () => {
    render(<SubmissionsPage />);
    const searchInput = screen.getByPlaceholderText('Buscar entregas...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'ESTUDIANTEINEXISTENTE123' } });
    });
    await waitFor(() => {
      expect(screen.getByText('No se encontraron entregas con los filtros aplicados.')).toBeInTheDocument();
    });
  });

  describe('Modal de Calificación', () => {
    const submissionToGrade = mockSubmissionsList[0]; // sub001, está pendiente

    const findSubmissionCardElement = (submission: Submission): HTMLElement | null => {
      const studentNameElements = screen.getAllByText(submission.student.name);
      for (const el of studentNameElements) {
        // Ajustar selector para que sea más probable que encuentre el contenedor correcto de la tarjeta
        const cardCandidate = el.closest('div.bg-white.overflow-hidden.shadow.rounded-lg');
        if (cardCandidate && within(cardCandidate).queryByText(submission.course.name)) {
          return cardCandidate as HTMLElement;
        }
      }
      // Fallback si el nombre del estudiante no es suficiente para desambiguar por curso
      // Esto podría necesitar data-testid en las tarjetas si la estructura es compleja
      // o si un estudiante tiene múltiples entregas para el mismo curso (poco probable aquí).
      if (studentNameElements.length === 1) { // Si solo hay una tarjeta con ese nombre de estudiante
        return studentNameElements[0].closest('div.bg-white.overflow-hidden.shadow.rounded-lg') as HTMLElement | null;
      }
      return null; 
    };

    it('debería abrir, rellenar, cancelar y cerrar el modal de calificación', async () => {
      render(<SubmissionsPage />);
      const submissionCard = findSubmissionCardElement(submissionToGrade);
      expect(submissionCard).toBeInTheDocument();

      const gradeButtonOnCard = within(submissionCard!).getByRole('button', { name: /Calificar/i });
      await act(async () => { fireEvent.click(gradeButtonOnCard); });

      const gradingModal = await screen.findByTestId('grading-modal');
      expect(gradingModal).toBeInTheDocument();
      
      // ⭐ Asegúrate de que el label "Calificación (0-5)" esté asociado con htmlFor="submissionGrade" en el JSX.
      const gradeInput = within(gradingModal).getByLabelText('Calificación (0-5)');
      const commentsInput = within(gradingModal).getByPlaceholderText('Retroalimentación para el estudiante...');
      const cancelButton = within(gradingModal).getByRole('button', { name: 'Cancelar' });

      await act(async () => {
        fireEvent.change(gradeInput, { target: { value: '4.2' } });
        fireEvent.change(commentsInput, { target: { value: 'Buen esfuerzo.' } });
      });
      expect((gradeInput as HTMLInputElement).value).toBe('4.2');

      await act(async () => { fireEvent.click(cancelButton); });
      await waitFor(() => {
        expect(screen.queryByTestId('grading-modal')).not.toBeInTheDocument();
      });
      expect(gradeSubmission).not.toHaveBeenCalled();
    });

    it('debería enviar calificación y cerrar modal', async () => {
        render(<SubmissionsPage />);
        const submissionCard = findSubmissionCardElement(submissionToGrade);
        expect(submissionCard).toBeInTheDocument();
  
        const gradeButtonOnCard = within(submissionCard!).getByRole('button', { name: /Calificar/i });
        await act(async () => { fireEvent.click(gradeButtonOnCard); });
  
        const gradingModal = await screen.findByTestId('grading-modal');
        const gradeInput = within(gradingModal).getByLabelText('Calificación (0-5)');
        const commentsInput = within(gradingModal).getByPlaceholderText('Retroalimentación para el estudiante...');
        const submitButtonInModal = within(gradingModal).getByRole('button', { name: 'Calificar' }); 
  
        await act(async () => {
          fireEvent.change(gradeInput, { target: { value: '4.7' } });
          fireEvent.change(commentsInput, { target: { value: 'Excelente!' } });
        });
        expect(submitButtonInModal).toBeEnabled();

        await act(async () => { fireEvent.click(submitButtonInModal); });
  
        expect(gradeSubmission).toHaveBeenCalledWith(submissionToGrade.id, {
          grade: 4.7,
          comments: 'Excelente!',
        });
        await waitFor(() => {
          expect(screen.queryByTestId('grading-modal')).not.toBeInTheDocument();
        });
      });

      it('debería tener el botón "Calificar" del modal deshabilitado y no llamar a alert si la calificación está vacía', async () => {
        render(<SubmissionsPage />);
        const submissionCard = findSubmissionCardElement(submissionToGrade);
        expect(submissionCard).toBeInTheDocument();
  
        const gradeButtonOnCard = within(submissionCard!).getByRole('button', { name: /Calificar/i });
        await act(async () => { fireEvent.click(gradeButtonOnCard); });
  
        const gradingModal = await screen.findByTestId('grading-modal');
        const submitButtonInModal = within(gradingModal).getByRole('button', { name: 'Calificar' });
        
        expect(submitButtonInModal).toBeDisabled(); 
  
        // Intentar hacer clic en un botón deshabilitado no debería disparar el onClick
        // No es necesario envolver en act si no esperamos cambios de estado por este click
        fireEvent.click(submitButtonInModal); 
  
        expect(mockAlertGlobal).not.toHaveBeenCalled(); 
        expect(gradeSubmission).not.toHaveBeenCalled();
        expect(within(gradingModal).getByText('Calificar Entrega')).toBeInTheDocument();
      });
  });
});

// Recordatorios para tu SubmissionsPage.tsx:
// 1. Añade data-testid="loading-spinner" a tu div de spinner.
// 2. Añade aria-label="Filtrar por estado de entrega" a tu <select> para el filtro de estado.
// 3. Añade data-testid="grading-modal" al div principal de tu modal de calificación.
// 4. Para el input de calificación en el modal, asegúrate de que <label htmlFor="submissionGrade">Calificación (0-5)</label>
//    y <input id="submissionGrade" ... /> estén correctamente vinculados.
// 5. Añade data-testid="submissions-grid" al div que envuelve el .map(submission => ...)