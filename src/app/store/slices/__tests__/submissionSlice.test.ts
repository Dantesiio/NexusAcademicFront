import {
    submissionReducer,
    startFetchingSubmissions,
    setSubmissionsData,
    setCurrentSubmission,
    addSubmission,
    updateSubmission,
    removeSubmission,
    fetchingSubmissionsFailure,
    SubmissionState, // Asumiendo que exportas estos tipos desde submissionSlice.ts
    Submission,
    SubmissionCourse,
    SubmissionStudent
  } from '../submissionSlice'; // Ajusta la ruta según tu estructura de proyecto
  
  // Mock data para las pruebas
  const mockSubmissionCourse: SubmissionCourse = {
    id: 'course-prog101',
    name: 'Programación Básica',
    code: 'PROG101'
  };
  
  const mockSubmissionStudent: SubmissionStudent = {
    id: 'student-jane123',
    name: 'Jane Doe'
  };
  
  const mockSubmission1: Submission = {
    id: 'submission-1',
    course: mockSubmissionCourse,
    student: mockSubmissionStudent,
    fileUrl: 'http://example.com/entrega1.pdf',
    comments: 'Primera entrega del proyecto.',
    grade: 95,
    submittedAt: new Date('2025-03-10T10:00:00.000Z').toISOString(),
    createdAt: new Date('2025-03-10T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2025-03-11T11:00:00.000Z').toISOString(),
  };
  
  const mockSubmission2: Submission = {
    id: 'submission-2',
    course: { ...mockSubmissionCourse, id: 'course-advdata202', name: 'Bases de Datos Avanzadas', code: 'DATA202'},
    student: { ...mockSubmissionStudent, id: 'student-john456', name: 'John Smith'},
    fileUrl: 'http://example.com/entrega-final-db.zip',
    comments: 'Entrega final de bases de datos.',
    grade: null, // Aún no calificada
    submittedAt: new Date('2025-04-15T14:30:00.000Z').toISOString(),
    createdAt: new Date('2025-04-15T14:30:00.000Z').toISOString(),
    updatedAt: new Date('2025-04-15T14:30:00.000Z').toISOString(),
  };
  
  const initialState: SubmissionState = {
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null
  };
  
  describe('submissionSlice reducer', () => {
    it('debería devolver el estado inicial', () => {
      expect(submissionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('debería manejar startFetchingSubmissions', () => {
      const stateWithError: SubmissionState = { ...initialState, error: 'Error anterior', loading: false };
      const expectedState: SubmissionState = { ...initialState, loading: true, error: null };
      expect(submissionReducer(stateWithError, startFetchingSubmissions())).toEqual(expectedState);
    });
  
    it('debería manejar setSubmissionsData', () => {
      const submissionsPayload = [mockSubmission1, mockSubmission2];
      const previousState: SubmissionState = { ...initialState, loading: true };
      const expectedState: SubmissionState = { ...initialState, loading: false, submissions: submissionsPayload };
      expect(submissionReducer(previousState, setSubmissionsData(submissionsPayload))).toEqual(expectedState);
    });
  
    it('debería manejar setCurrentSubmission', () => {
      const previousState: SubmissionState = { ...initialState, loading: true }; // loading se pone false en este reducer
      const expectedState: SubmissionState = { ...initialState, loading: false, currentSubmission: mockSubmission1 };
      expect(submissionReducer(previousState, setCurrentSubmission(mockSubmission1))).toEqual(expectedState);
    });
  
    it('debería manejar addSubmission', () => {
      const previousState: SubmissionState = { ...initialState, submissions: [mockSubmission1], loading: true };
      const expectedState: SubmissionState = { ...initialState, submissions: [mockSubmission1, mockSubmission2], loading: false };
      expect(submissionReducer(previousState, addSubmission(mockSubmission2))).toEqual(expectedState);
    });
  
    describe('updateSubmission', () => {
      it('debería actualizar una entrega existente', () => {
        const stateWithSubmissions: SubmissionState = { ...initialState, submissions: [mockSubmission1, mockSubmission2], loading: true };
        const updatedSubmission1: Submission = { ...mockSubmission1, comments: 'Comentario actualizado.', grade: 98 };
        const expectedState: SubmissionState = { ...initialState, submissions: [updatedSubmission1, mockSubmission2], loading: false };
        expect(submissionReducer(stateWithSubmissions, updateSubmission(updatedSubmission1))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si la entrega a actualizar no existe', () => {
        const stateWithSubmissions: SubmissionState = { ...initialState, submissions: [mockSubmission1], loading: true };
        const nonExistentSubmission: Submission = { ...mockSubmission2, id: 'submission-non-existent' };
        // El estado devuelto debe ser el mismo que el anterior, pero con loading: false
        const expectedState: SubmissionState = { ...stateWithSubmissions, loading: false };
        expect(submissionReducer(stateWithSubmissions, updateSubmission(nonExistentSubmission))).toEqual(expectedState);
      });
    });
  
    describe('removeSubmission', () => {
      it('debería eliminar una entrega existente por id', () => {
        const stateWithSubmissions: SubmissionState = { ...initialState, submissions: [mockSubmission1, mockSubmission2], loading: true };
        const expectedState: SubmissionState = { ...initialState, submissions: [mockSubmission2], loading: false };
        expect(submissionReducer(stateWithSubmissions, removeSubmission(mockSubmission1.id))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si el id de la entrega a eliminar no existe', () => {
        const stateWithSubmissions: SubmissionState = { ...initialState, submissions: [mockSubmission1, mockSubmission2], loading: true };
        const expectedState: SubmissionState = { ...stateWithSubmissions, loading: false };
        expect(submissionReducer(stateWithSubmissions, removeSubmission('id-no-existente'))).toEqual(expectedState);
      });
    });
  
    it('debería manejar fetchingSubmissionsFailure', () => {
      const errorPayload = 'Error al obtener las entregas';
      const stateLoading: SubmissionState = { ...initialState, loading: true };
      const expectedState: SubmissionState = { ...initialState, loading: false, error: errorPayload };
      expect(submissionReducer(stateLoading, fetchingSubmissionsFailure(errorPayload))).toEqual(expectedState);
    });
  });