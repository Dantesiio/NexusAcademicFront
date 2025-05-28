import { api } from './api';
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
        const response = await api.get('/students', { params });
        return response.data;
    },

    getStudent: async (id: string): Promise<Student> => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    createStudent: async (data: CreateStudentData): Promise<Student> => {
        const response = await api.post('/students', data);
        return response.data;
    },

    updateStudent: async (id: string, data: UpdateStudentData): Promise<Student> => {
        const response = await api.patch(`/students/${id}`, data);
        return response.data;
    },

    deleteStudent: async (id: string): Promise<void> => {
        await api.delete(`/students/${id}`);
    }
};