// src/app/store/actions/__tests__/courseActions.test.ts
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourseAction,
    deleteCourse,
  } from '../courseActions'; // Ajusta la ruta si es necesario
  import { courseService, CreateCourseData, UpdateCourseData } from '../../../services/courseService'; // Ajusta la ruta
  import {
    startFetchingCourses,
    setCoursesData,
    setCurrentCourse,
    addCourse,
    updateCourse,
    removeCourse,
    fetchingCoursesFailure,
  } from '../../slices/courseSlice'; // Ajusta la ruta
  import { Course, Teacher } from '../../slices/courseSlice'; // Asumiendo que Course y Teacher se exportan desde courseSlice
  
  // Mockear el courseService completo
  jest.mock('../../../services/courseService');
  
  const mockDispatch = jest.fn();
  
  // Datos de prueba para Teacher y Course
  const mockTeacherData: Teacher = {
    id: 'teacher-1',
    email: 'prof@example.com',
    fullName: 'Profesor Ejemplo',
    roles: ['teacher'],
    // isActive: true, // Añade si tu tipo Teacher lo requiere
  };
  
  const mockCourseData: Course = {
    id: 'course-123',
    name: 'Curso de Testing con Jest',
    description: 'Aprende a escribir pruebas unitarias e de integración.',
    code: 'JEST101',
    teacher: mockTeacherData,
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días después
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const mockCourseList: Course[] = [
    mockCourseData,
    { ...mockCourseData, id: 'course-456', name: 'Curso Avanzado de React', code: 'REACT201' },
  ];
  
  describe('courseActions thunks', () => {
    beforeEach(() => {
      // Limpiar todos los mocks antes de cada prueba
      jest.clearAllMocks();
    });
  
    // Pruebas para getCourses
    describe('getCourses', () => {
      it('debería despachar startFetchingCourses y luego setCoursesData en caso de éxito', async () => {
        (courseService.getCourses as jest.Mock).mockResolvedValue(mockCourseList);
  
        await getCourses()(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.getCourses).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(setCoursesData(mockCourseList));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingCourses y luego fetchingCoursesFailure en caso de error', async () => {
        const errorMessage = 'Error al obtener cursos';
        (courseService.getCourses as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await getCourses()(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.getCourses).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería usar un mensaje de error por defecto si el error no es una instancia de Error', async () => {
          (courseService.getCourses as jest.Mock).mockRejectedValue('Unknown error object');
    
          await getCourses()(mockDispatch);
    
          expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
          expect(courseService.getCourses).toHaveBeenCalled();
          expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure('Error al obtener cursos'));
      });
    });
  
    // Pruebas para getCourse
    describe('getCourse', () => {
      const courseId = 'course-123';
  
      it('debería despachar startFetchingCourses y luego setCurrentCourse en caso de éxito', async () => {
        (courseService.getCourse as jest.Mock).mockResolvedValue(mockCourseData);
  
        await getCourse(courseId)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.getCourse).toHaveBeenCalledWith(courseId);
        expect(mockDispatch).toHaveBeenCalledWith(setCurrentCourse(mockCourseData));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingCourses y luego fetchingCoursesFailure en caso de error', async () => {
        const errorMessage = 'Curso no encontrado';
        (courseService.getCourse as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await getCourse(courseId)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.getCourse).toHaveBeenCalledWith(courseId);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para createCourse
    describe('createCourse', () => {
      const newCoursePayload: CreateCourseData = {
        name: 'Nuevo Curso Increíble',
        description: 'Descripción del nuevo curso.',
        code: 'NCI301',
        teacherId: 'teacher-1',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días después
        // status es opcional en CreateCourseData o se define por defecto
      };
      const createdCourseResponse: Course = { ...mockCourseData, ...newCoursePayload, id: 'new-course-789' };
  
      it('debería despachar startFetchingCourses y luego addCourse en caso de éxito', async () => {
        (courseService.createCourse as jest.Mock).mockResolvedValue(createdCourseResponse);
  
        await createCourse(newCoursePayload)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.createCourse).toHaveBeenCalledWith(newCoursePayload);
        expect(mockDispatch).toHaveBeenCalledWith(addCourse(createdCourseResponse));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingCourses y luego fetchingCoursesFailure en caso de error', async () => {
        const errorMessage = 'Error al crear el curso';
        (courseService.createCourse as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await createCourse(newCoursePayload)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.createCourse).toHaveBeenCalledWith(newCoursePayload);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para updateCourseAction
    describe('updateCourseAction', () => {
      const courseIdToUpdate = 'course-123';
      const updatedData: UpdateCourseData = { name: 'Curso de Testing Actualizado', description: 'Actualizado.' };
      const updatedCourseResponse: Course = { ...mockCourseData, ...updatedData };
  
      it('debería despachar startFetchingCourses y luego updateCourse en caso de éxito', async () => {
        (courseService.updateCourse as jest.Mock).mockResolvedValue(updatedCourseResponse);
  
        await updateCourseAction(courseIdToUpdate, updatedData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.updateCourse).toHaveBeenCalledWith(courseIdToUpdate, updatedData);
        expect(mockDispatch).toHaveBeenCalledWith(updateCourse(updatedCourseResponse));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingCourses y luego fetchingCoursesFailure en caso de error', async () => {
        const errorMessage = 'Error al actualizar el curso';
        (courseService.updateCourse as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await updateCourseAction(courseIdToUpdate, updatedData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.updateCourse).toHaveBeenCalledWith(courseIdToUpdate, updatedData);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para deleteCourse
    describe('deleteCourse', () => {
      const courseIdToDelete = 'course-123';
  
      it('debería despachar startFetchingCourses y luego removeCourse en caso de éxito', async () => {
        (courseService.deleteCourse as jest.Mock).mockResolvedValue(undefined); // delete puede no devolver nada
  
        await deleteCourse(courseIdToDelete)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.deleteCourse).toHaveBeenCalledWith(courseIdToDelete);
        expect(mockDispatch).toHaveBeenCalledWith(removeCourse(courseIdToDelete));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingCourses y luego fetchingCoursesFailure en caso de error', async () => {
        const errorMessage = 'Error al eliminar el curso';
        (courseService.deleteCourse as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await deleteCourse(courseIdToDelete)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingCourses());
        expect(courseService.deleteCourse).toHaveBeenCalledWith(courseIdToDelete);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingCoursesFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  });