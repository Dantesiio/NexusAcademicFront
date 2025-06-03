// src/app/store/actions/__tests__/studentActions.test.ts
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudentAction,
    deleteStudent,
  } from '../studentActions'; // Ajusta la ruta si es necesario
  import { studentService, CreateStudentData, UpdateStudentData, StudentListParams } from '../../../services/studentService'; // Ajusta la ruta
  import {
    startFetchingStudents,
    setStudentsData,
    setCurrentStudent,
    addStudent,
    updateStudent,
    removeStudent,
    fetchingDataFailure,
  } from '../../slices/studentSlice'; // Ajusta la ruta
  import { Student } from '../../slices/studentSlice'; // Asumiendo que Student se exporta desde studentSlice
  
  // Mockear el studentService completo
  jest.mock('../../../services/studentService');
  
  const mockDispatch = jest.fn();
  
  // Datos de prueba para Student
  const mockStudentData: Student = {
    id: 's1',
    name: 'John Doe',
    age: 20,
    email: 'john.doe@example.com',
    gender: 'Male',
    nickname: 'Johnny',
    // subjects, grades, enrollments pueden ser opcionales o definidos según sea necesario
  };
  
  const mockStudentList: Student[] = [
    mockStudentData,
    { id: 's2', name: 'Jane Smith', age: 22, email: 'jane.smith@example.com', gender: 'Female', nickname: 'Janie' },
  ];
  
  describe('studentActions thunks', () => {
    beforeEach(() => {
      // Limpiar todos los mocks antes de cada prueba
      jest.clearAllMocks();
    });
  
    // Pruebas para getStudents
    describe('getStudents', () => {
      const params: StudentListParams = { limit: 10, offset: 0 };
  
      it('debería despachar startFetchingStudents y luego setStudentsData en caso de éxito', async () => {
        (studentService.getStudents as jest.Mock).mockResolvedValue(mockStudentList);
  
        await getStudents(params)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.getStudents).toHaveBeenCalledWith(params);
        expect(mockDispatch).toHaveBeenCalledWith(setStudentsData(mockStudentList));
        expect(mockDispatch).toHaveBeenCalledTimes(2); // startFetchingStudents y setStudentsData
      });
  
      it('debería despachar startFetchingStudents y luego fetchingDataFailure en caso de error', async () => {
        const errorMessage = 'Error al obtener estudiantes';
        (studentService.getStudents as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
  
        await getStudents(params)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.getStudents).toHaveBeenCalledWith(params);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería usar un mensaje de error por defecto si el error no tiene la estructura esperada', async () => {
          (studentService.getStudents as jest.Mock).mockRejectedValue(new Error('Network Error'));
    
          await getStudents(params)(mockDispatch);
    
          expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
          expect(studentService.getStudents).toHaveBeenCalledWith(params);
          expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure('Error al obtener estudiantes'));
        });
    });
  
    // Pruebas para getStudent
    describe('getStudent', () => {
      const studentId = 's1';
  
      it('debería despachar startFetchingStudents y luego setCurrentStudent en caso de éxito', async () => {
        (studentService.getStudent as jest.Mock).mockResolvedValue(mockStudentData);
  
        await getStudent(studentId)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.getStudent).toHaveBeenCalledWith(studentId);
        expect(mockDispatch).toHaveBeenCalledWith(setCurrentStudent(mockStudentData));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingStudents y luego fetchingDataFailure en caso de error', async () => {
        const errorMessage = 'Estudiante no encontrado';
        (studentService.getStudent as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
  
        await getStudent(studentId)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.getStudent).toHaveBeenCalledWith(studentId);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para createStudent
    describe('createStudent', () => {
      const newStudentData: CreateStudentData = {
        name: 'New Kid',
        age: 19,
        email: 'new.kid@example.com',
        gender: 'Other',
        nickname: 'Newbie',
        password: 'password123',
        confirmPassword: 'password123',
        // ...otros campos necesarios para CreateStudentData
      };
  
      it('debería despachar startFetchingStudents y luego addStudent en caso de éxito', async () => {
        const createdStudentResponse = { ...mockStudentData, ...newStudentData, id: 's-new' };
        (studentService.createStudent as jest.Mock).mockResolvedValue(createdStudentResponse);
  
        await createStudent(newStudentData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.createStudent).toHaveBeenCalledWith(newStudentData);
        expect(mockDispatch).toHaveBeenCalledWith(addStudent(createdStudentResponse));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingStudents y luego fetchingDataFailure en caso de error', async () => {
        const errorMessage = 'Error al crear';
        (studentService.createStudent as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
  
        await createStudent(newStudentData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.createStudent).toHaveBeenCalledWith(newStudentData);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para updateStudentAction
    describe('updateStudentAction', () => {
      const studentIdToUpdate = 's1';
      const updatedData: UpdateStudentData = { name: 'John Doe Updated', age: 21 };
      const updatedStudentResponse = { ...mockStudentData, ...updatedData };
  
      it('debería despachar startFetchingStudents y luego updateStudent en caso de éxito', async () => {
        (studentService.updateStudent as jest.Mock).mockResolvedValue(updatedStudentResponse);
  
        await updateStudentAction(studentIdToUpdate, updatedData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.updateStudent).toHaveBeenCalledWith(studentIdToUpdate, updatedData);
        expect(mockDispatch).toHaveBeenCalledWith(updateStudent(updatedStudentResponse));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingStudents y luego fetchingDataFailure en caso de error', async () => {
        const errorMessage = 'Error al actualizar';
        (studentService.updateStudent as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
  
        await updateStudentAction(studentIdToUpdate, updatedData)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.updateStudent).toHaveBeenCalledWith(studentIdToUpdate, updatedData);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  
    // Pruebas para deleteStudent
    describe('deleteStudent', () => {
      const studentIdToDelete = 's1';
  
      it('debería despachar startFetchingStudents y luego removeStudent en caso de éxito', async () => {
        (studentService.deleteStudent as jest.Mock).mockResolvedValue(undefined); // delete puede no devolver nada
  
        await deleteStudent(studentIdToDelete)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.deleteStudent).toHaveBeenCalledWith(studentIdToDelete);
        expect(mockDispatch).toHaveBeenCalledWith(removeStudent(studentIdToDelete));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
  
      it('debería despachar startFetchingStudents y luego fetchingDataFailure en caso de error', async () => {
        const errorMessage = 'Error al eliminar';
        (studentService.deleteStudent as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
  
        await deleteStudent(studentIdToDelete)(mockDispatch);
  
        expect(mockDispatch).toHaveBeenCalledWith(startFetchingStudents());
        expect(studentService.deleteStudent).toHaveBeenCalledWith(studentIdToDelete);
        expect(mockDispatch).toHaveBeenCalledWith(fetchingDataFailure(errorMessage));
        expect(mockDispatch).toHaveBeenCalledTimes(2);
      });
    });
  });