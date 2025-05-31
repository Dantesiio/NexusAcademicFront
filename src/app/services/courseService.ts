// src/app/services/courseService.ts
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

export const courseService = {
    getCourses: async (): Promise<Course[]> => {
        try {
            const response = await api.get('/courses');
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.getCourses();
        }
    },

    getCourse: async (id: string): Promise<Course> => {
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            const courses = await mockService.getCourses();
            const course = courses.find(c => c.id === id);
            if (!course) throw new Error('Curso no encontrado');
            return course;
        }
    },

    createCourse: async (data: CreateCourseData): Promise<Course> => {
        try {
            const response = await api.post('/courses', data);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.createCourse(data);
        }
    },

    updateCourse: async (id: string, data: UpdateCourseData): Promise<Course> => {
        try {
            const response = await api.put(`/courses/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.updateCourse(id, data);
        }
    },

    deleteCourse: async (id: string): Promise<void> => {
        try {
            await api.delete(`/courses/${id}`);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.deleteCourse(id);
        }
    }
};