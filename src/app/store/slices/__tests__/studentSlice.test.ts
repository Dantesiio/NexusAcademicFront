import {
    studentReducer,
    startFetchingStudents,
    setStudentsData,
    setCurrentStudent,
    addStudent,
    updateStudent,
    removeStudent,
    setPagination,
    fetchingDataFailure,
    StudentState, // Asumiendo que exportas estos tipos desde studentSlice.ts
    Student,
    Grade,
    Enrollment
  } from '../studentSlice'; // Ajusta la ruta según tu estructura de proyecto
  
  // Mock data para las pruebas
  const mockGrade1: Grade = {
    id: 'grade-1',
    subject: 'Matemáticas',
    grade: 'A'
  };
  
  const mockEnrollment1: Enrollment = {
    id: 'enroll-1',
    courseId: 'course-math101',
    enrolledAt: new Date().toISOString(),
    score: 95
  };
  
  const mockStudent1: Student = {
    id: 'student-1',
    name: 'Ana López',
    age: 20,
    email: 'ana.lopez@example.com',
    gender: 'Femenino',
    nickname: 'Anita',
    subjects: ['Matemáticas', 'Física'],
    grades: [mockGrade1],
    enrollments: [mockEnrollment1]
  };
  
  const mockStudent2: Student = {
    id: 'student-2',
    name: 'Carlos Ruiz',
    age: 22,
    email: 'carlos.ruiz@example.com',
    gender: 'Masculino',
    nickname: 'Charlie',
    subjects: ['Química', 'Biología']
  };
  
  const initialState: StudentState = {
    students: [],
    currentStudent: null,
    loading: false,
    error: null,
    pagination: {
      limit: 10,
      offset: 0,
      total: 0
    }
  };
  
  describe('studentSlice reducer', () => {
    it('debería devolver el estado inicial', () => {
      expect(studentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('debería manejar startFetchingStudents', () => {
      const stateWithError: StudentState = { ...initialState, error: 'Error previo', loading: false };
      const expectedState: StudentState = { ...initialState, loading: true, error: null };
      expect(studentReducer(stateWithError, startFetchingStudents())).toEqual(expectedState);
    });
  
    it('debería manejar setStudentsData', () => {
      const studentsPayload = [mockStudent1, mockStudent2];
      const previousState: StudentState = { ...initialState, loading: true };
      const expectedState: StudentState = { ...initialState, loading: false, students: studentsPayload };
      expect(studentReducer(previousState, setStudentsData(studentsPayload))).toEqual(expectedState);
    });
  
    it('debería manejar setCurrentStudent', () => {
      const expectedState: StudentState = { ...initialState, currentStudent: mockStudent1 };
      expect(studentReducer(initialState, setCurrentStudent(mockStudent1))).toEqual(expectedState);
    });
  
    it('debería manejar addStudent', () => {
      const stateWithOneStudent: StudentState = { ...initialState, students: [mockStudent1] };
      const expectedState: StudentState = { ...initialState, students: [mockStudent1, mockStudent2] };
      expect(studentReducer(stateWithOneStudent, addStudent(mockStudent2))).toEqual(expectedState);
    });
  
    describe('updateStudent', () => {
      it('debería actualizar un estudiante existente', () => {
        const stateWithStudents: StudentState = { ...initialState, students: [mockStudent1, mockStudent2] };
        const updatedStudent1: Student = { ...mockStudent1, name: 'Ana López Actualizada' };
        const expectedState: StudentState = { ...initialState, students: [updatedStudent1, mockStudent2] };
        expect(studentReducer(stateWithStudents, updateStudent(updatedStudent1))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si el estudiante a actualizar no existe', () => {
        const stateWithStudents: StudentState = { ...initialState, students: [mockStudent1] };
        const nonExistentStudent: Student = { ...mockStudent2, id: 'student-non-existent' };
        expect(studentReducer(stateWithStudents, updateStudent(nonExistentStudent))).toEqual(stateWithStudents);
      });
    });
  
    describe('removeStudent', () => {
      it('debería eliminar un estudiante existente por id', () => {
        const stateWithStudents: StudentState = { ...initialState, students: [mockStudent1, mockStudent2] };
        const expectedState: StudentState = { ...initialState, students: [mockStudent2] }; // Solo mockStudent2 queda
        expect(studentReducer(stateWithStudents, removeStudent(mockStudent1.id))).toEqual(expectedState);
      });
  
      it('no debería modificar el estado si el id del estudiante a eliminar no existe', () => {
        const stateWithStudents: StudentState = { ...initialState, students: [mockStudent1, mockStudent2] };
        expect(studentReducer(stateWithStudents, removeStudent('id-no-existente'))).toEqual(stateWithStudents);
      });
    });
  
    it('debería manejar setPagination', () => {
      const paginationPayload = { limit: 20, offset: 10, total: 100 };
      const expectedState: StudentState = { ...initialState, pagination: paginationPayload };
      expect(studentReducer(initialState, setPagination(paginationPayload))).toEqual(expectedState);
    });
  
    it('debería manejar fetchingDataFailure', () => {
      const errorPayload = 'Error al obtener los datos de estudiantes';
      const stateLoading: StudentState = { ...initialState, loading: true };
      const expectedState: StudentState = { ...initialState, loading: false, error: errorPayload };
      expect(studentReducer(stateLoading, fetchingDataFailure(errorPayload))).toEqual(expectedState);
    });
  });