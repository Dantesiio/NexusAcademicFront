// src/app/services/studentService.ts
import { api } from './api';
import { mockService } from './mockService';
import { Student } from '../store/slices/studentSlice';

export interface CreateStudentData {
    name: string;
    age: number;
    email: string;
    gender: string;
    nickname?: string;
    enrollments?: Array<{
        courseId: string;
        enrolledAt: string;
        score?: number;
    }>;
}

export interface UpdateStudentData {
    name?: string;
    age?: number;
    email?: string;
    gender?: string;
    nickname?: string;
    enrollments?: Array<{
        courseId: string;
        enrolledAt: string;
        score?: number;
    }>;
}

export interface StudentListParams {
    limit?: number;
    offset?: number;
}

export const studentService = {
    getStudents: async (params?: StudentListParams): Promise<Student[]> => {
        try {
            const response = await api.get('/students', { params });
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.getStudents();
        }
    },

    getStudent: async (id: string): Promise<Student> => {
        try {
            const response = await api.get(`/students/${id}`);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            const students = await mockService.getStudents();
            const student = students.find(s => s.id === id);
            if (!student) throw new Error('Estudiante no encontrado');
            return student;
        }
    },

    createStudent: async (data: CreateStudentData): Promise<Student> => {
        try {
            const response = await api.post('/students', data);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.createStudent(data);
        }
    },

    updateStudent: async (id: string, data: UpdateStudentData): Promise<Student> => {
        try {
            const response = await api.patch(`/students/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.updateStudent(id, data);
        }
    },

    deleteStudent: async (id: string): Promise<void> => {
        try {
            await api.delete(`/students/${id}`);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            return await mockService.deleteStudent(id);
        }
    }
};