import { Dispatch } from 'redux';
import { courseService, CreateCourseData, UpdateCourseData } from '../../services/courseService';
import { 
    startFetchingCourses, 
    setCoursesData, 
    setCurrentCourse, 
    addCourse, 
    updateCourse, 
    removeCourse, 
    fetchingCoursesFailure 
} from '../slices/courseSlice';

export const getCourses = () => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const courses = await courseService.getCourses();
        dispatch(setCoursesData(courses));
    } catch (error: any) {
        dispatch(fetchingCoursesFailure(error.response?.data?.message || 'Error al obtener cursos'));
    }
};

export const getCourse = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const course = await courseService.getCourse(id);
        dispatch(setCurrentCourse(course));
    } catch (error: any) {
        dispatch(fetchingCoursesFailure(error.response?.data?.message || 'Error al obtener curso'));
    }
};

export const createCourse = (data: CreateCourseData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const newCourse = await courseService.createCourse(data);
        dispatch(addCourse(newCourse));
    } catch (error: any) {
        dispatch(fetchingCoursesFailure(error.response?.data?.message || 'Error al crear curso'));
    }
};

export const updateCourseAction = (id: string, data: UpdateCourseData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const updatedCourse = await courseService.updateCourse(id, data);
        dispatch(updateCourse(updatedCourse));
    } catch (error: any) {
        dispatch(fetchingCoursesFailure(error.response?.data?.message || 'Error al actualizar curso'));
    }
};

export const deleteCourse = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        await courseService.deleteCourse(id);
        dispatch(removeCourse(id));
    } catch (error: any) {
        dispatch(fetchingCoursesFailure(error.response?.data?.message || 'Error al eliminar curso'));
    }
};