import { courseReducer, // Cambiado de courseSlice.reducer para coincidir con tu exportación
    startFetchingCourses,
    setCoursesData,
    setCurrentCourse,
    addCourse,
    updateCourse,
    removeCourse,
    fetchingCoursesFailure,
    CourseState, // Asumiendo que exportas CourseState desde courseSlice.ts
    Course,      // Asumiendo que exportas Course desde courseSlice.ts
    Teacher      // Asumiendo que exportas Teacher desde courseSlice.ts
  } from '../courseSlice'; // Ajusta la ruta según tu estructura
  
  // Si Teacher, Course, y CourseState no se exportan directamente desde courseSlice.ts,
  // puedes definirlos aquí o importarlos desde donde estén definidos.
  // Por ahora, asumiré que los exportas o los copiamos aquí para la prueba.
  
  // Mock data para las pruebas
  const mockTeacher: Teacher = {
    id: 'teacher-1',
    email: 'teacher@example.com',
    fullName: 'Profesor Ejemplo',
    roles: ['teacher'],
  };
  
  const mockCourse1: Course = {
    id: 'course-1',
    name: 'Curso de TypeScript',
    description: 'Aprende TypeScript desde cero.',
    code: 'TS101',
    teacher: mockTeacher,
    status: 'ACTIVE',
    startDate: '2025-01-15T00:00:00.000Z',
    endDate: '2025-05-15T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
  
  const mockCourse2: Course = {
    id: 'course-2',
    name: 'Curso de React Avanzado',
    description: 'Profundiza en React.',
    code: 'REA201',
    teacher: mockTeacher,
    status: 'ACTIVE',
    startDate: '2025-02-01T00:00:00.000Z',
    endDate: '2025-06-01T00:00:00.000Z',
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  };
  
  const initialState: CourseState = {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
  };
  
  describe('courseSlice reducer', () => {
    it('debería devolver el estado inicial', () => {
      expect(courseReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('debería manejar startFetchingCourses', () => {
      const stateConError: CourseState = { ...initialState, error: 'Error previo', loading: false };
      const expectedState: CourseState = { ...initialState, loading: true, error: null };
      expect(courseReducer(stateConError, startFetchingCourses())).toEqual(expectedState);
    });
  
    it('debería manejar setCoursesData', () => {
      const coursesPayload = [mockCourse1, mockCourse2];
      const statePrevio: CourseState = { ...initialState, loading: true };
      const expectedState: CourseState = { ...initialState, loading: false, courses: coursesPayload };
      expect(courseReducer(statePrevio, setCoursesData(coursesPayload))).toEqual(expectedState);
    });
  
    it('debería manejar setCurrentCourse', () => {
      const expectedState: CourseState = { ...initialState, currentCourse: mockCourse1 };
      expect(courseReducer(initialState, setCurrentCourse(mockCourse1))).toEqual(expectedState);
    });
  
    it('debería manejar addCourse', () => {
      const stateConUnCurso: CourseState = { ...initialState, courses: [mockCourse1] };
      const expectedState: CourseState = { ...initialState, courses: [mockCourse1, mockCourse2] };
      expect(courseReducer(stateConUnCurso, addCourse(mockCourse2))).toEqual(expectedState);
    });
  
    describe('updateCourse', () => {
      it('debería actualizar un curso existente', () => {
        const stateConCursos: CourseState = { ...initialState, courses: [mockCourse1, mockCourse2] };
        const updatedCourse1: Course = { ...mockCourse1, name: 'Curso de TypeScript Actualizado' };
        const expectedState: CourseState = { ...initialState, courses: [updatedCourse1, mockCourse2] };
        expect(courseReducer(stateConCursos, updateCourse(updatedCourse1))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si el curso a actualizar no existe', () => {
        const stateConCursos: CourseState = { ...initialState, courses: [mockCourse1] };
        const cursoNoExistente: Course = { ...mockCourse2, id: 'course-non-existent' };
        expect(courseReducer(stateConCursos, updateCourse(cursoNoExistente))).toEqual(stateConCursos);
      });
    });
  
    describe('removeCourse', () => {
      it('debería eliminar un curso existente por id', () => {
        const stateConCursos: CourseState = { ...initialState, courses: [mockCourse1, mockCourse2] };
        const expectedState: CourseState = { ...initialState, courses: [mockCourse2] }; // Solo mockCourse2 queda
        expect(courseReducer(stateConCursos, removeCourse(mockCourse1.id))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si el id del curso a eliminar no existe', () => {
        const stateConCursos: CourseState = { ...initialState, courses: [mockCourse1, mockCourse2] };
        expect(courseReducer(stateConCursos, removeCourse('id-no-existente'))).toEqual(stateConCursos);
      });
    });
  
    it('debería manejar fetchingCoursesFailure', () => {
      const errorPayload = 'Error al obtener los cursos';
      const stateCargando: CourseState = { ...initialState, loading: true };
      const expectedState: CourseState = { ...initialState, loading: false, error: errorPayload };
      expect(courseReducer(stateCargando, fetchingCoursesFailure(errorPayload))).toEqual(expectedState);
    });
  });