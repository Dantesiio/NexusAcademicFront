import { api } from './api';
import { Course } from '../store/slices/courseSlice';

export interface CreateCourseData {
    name: string;
    description: string;
    code: string;
    teacherId: string;
    startDate: string;
    endDate: string;
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export const courseService = {
    getCourses: async (): Promise<Course[]> => {
        const response = await api.get('/courses');
        return response.data;
    },

    getCourse: async (id: string): Promise<Course> => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    createCourse: async (data: CreateCourseData): Promise<Course> => {
        const response = await api.post('/courses', data);
        return response.data;
    },

    updateCourse: async (id: string, data: UpdateCourseData): Promise<Course> => {
        const response = await api.put(`/courses/${id}`, data);
        return response.data;
    },

    deleteCourse: async (id: string): Promise<void> => {
        await api.delete(`/courses/${id}`);
    }
};