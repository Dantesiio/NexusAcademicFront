import { Dispatch } from 'redux';
import { studentService, CreateStudentData, UpdateStudentData, StudentListParams } from '../../services/studentService';
import { 
    startFetchingStudents, 
    setStudentsData, 
    setCurrentStudent, 
    addStudent, 
    updateStudent, 
    removeStudent, 
    fetchingDataFailure 
} from '../slices/studentSlice';

export const getStudents = (params?: StudentListParams) => async (dispatch: Dispatch) => {
    dispatch(startFetchingStudents());
    try {
        const students = await studentService.getStudents(params);
        dispatch(setStudentsData(students));
    } catch (error: any) {
        dispatch(fetchingDataFailure(error.response?.data?.message || 'Error al obtener estudiantes'));
    }
};

export const getStudent = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingStudents());
    try {
        const student = await studentService.getStudent(id);
        dispatch(setCurrentStudent(student));
    } catch (error: any) {
        dispatch(fetchingDataFailure(error.response?.data?.message || 'Error al obtener estudiante'));
    }
};

export const createStudent = (data: CreateStudentData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingStudents());
    try {
        const newStudent = await studentService.createStudent(data);
        dispatch(addStudent(newStudent));
    } catch (error: any) {
        dispatch(fetchingDataFailure(error.response?.data?.message || 'Error al crear estudiante'));
    }
};

export const updateStudentAction = (id: string, data: UpdateStudentData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingStudents());
    try {
        const updatedStudent = await studentService.updateStudent(id, data);
        dispatch(updateStudent(updatedStudent));
    } catch (error: any) {
        dispatch(fetchingDataFailure(error.response?.data?.message || 'Error al actualizar estudiante'));
    }
};

export const deleteStudent = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingStudents());
    try {
        await studentService.deleteStudent(id);
        dispatch(removeStudent(id));
    } catch (error: any) {
        dispatch(fetchingDataFailure(error.response?.data?.message || 'Error al eliminar estudiante'));
    }
};