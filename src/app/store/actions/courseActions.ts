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
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener cursos';
        dispatch(fetchingCoursesFailure(errorMessage));
    }
};

export const getCourse = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const course = await courseService.getCourse(id);
        dispatch(setCurrentCourse(course));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener curso';
        dispatch(fetchingCoursesFailure(errorMessage));
    }
};

export const createCourse = (data: CreateCourseData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const newCourse = await courseService.createCourse(data);
        dispatch(addCourse(newCourse));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al crear curso';
        dispatch(fetchingCoursesFailure(errorMessage));
    }
};

export const updateCourseAction = (id: string, data: UpdateCourseData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        const updatedCourse = await courseService.updateCourse(id, data);
        dispatch(updateCourse(updatedCourse));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al actualizar curso';
        dispatch(fetchingCoursesFailure(errorMessage));
    }
};

export const deleteCourse = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingCourses());
    try {
        await courseService.deleteCourse(id);
        dispatch(removeCourse(id));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar curso';
        dispatch(fetchingCoursesFailure(errorMessage));
    }
};