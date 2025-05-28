import { api } from './api';
import { mockService } from './mockService';
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

export interface UpdateCourseData {
    name?: string;
    description?: string;
    code?: string;
    teacherId?: string;
    startDate?: string;
    endDate?: string;
    status?: 'ACTIVE' | 'INACTIVE';
}

// Flag to determine if we should use mock data
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export const courseService = {
    getCourses: async (): Promise<Course[]> => {
        if (USE_MOCK_DATA) {
            return await mockService.getCourses();
        }
        
        try {
            const response = await api.get('/courses');
            return response.data;
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('API failed, using mock data:', error.message);
                return await mockService.getCourses();
            }
            throw error;
        }
    },

    getCourse: async (id: string): Promise<Course> => {
        if (USE_MOCK_DATA) {
            const courses = await mockService.getCourses();
            const course = courses.find(c => c.id === id);
            if (!course) throw new Error('Curso no encontrado');
            return course;
        }
        
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data;
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('API failed, using mock data:', error.message);
                const courses = await mockService.getCourses();
                const course = courses.find(c => c.id === id);
                if (!course) throw new Error('Curso no encontrado');
                return course;
            }
            throw error;
        }
    },

    createCourse: async (data: CreateCourseData): Promise<Course> => {
        if (USE_MOCK_DATA) {
            return await mockService.createCourse(data);
        }
        
        try {
            const response = await api.post('/courses', data);
            return response.data;
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('API failed, using mock data:', error.message);
                return await mockService.createCourse(data);
            }
            throw error;
        }
    },

    updateCourse: async (id: string, data: UpdateCourseData): Promise<Course> => {
        if (USE_MOCK_DATA) {
            return await mockService.updateCourse(id, data);
        }
        
        try {
            const response = await api.put(`/courses/${id}`, data);
            return response.data;
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('API failed, using mock data:', error.message);
                return await mockService.updateCourse(id, data);
            }
            throw error;
        }
    },

    deleteCourse: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            return await mockService.deleteCourse(id);
        }
        
        try {
            await api.delete(`/courses/${id}`);
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('API failed, using mock data:', error.message);
                return await mockService.deleteCourse(id);
            }
            throw error;
        }
    }
};