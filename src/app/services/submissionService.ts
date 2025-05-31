// src/app/services/submissionService.ts
import { api } from './api';
import { mockService } from './mockService';
import { Submission } from '../store/slices/submissionSlice';

export interface CreateSubmissionData {
    courseId: string;
    studentId: string;
    fileUrl: string;
    comments?: string;
}

export interface GradeSubmissionData {
    grade: number;
    comments?: string;
}

// Función helper para normalizar datos de la API al formato esperado
const normalizeSubmissionData = (data: any): Submission => {
    return {
        id: data.id,
        course: {
            id: data.course?.id || data.courseId,
            name: data.course?.name || 'Curso',
            code: data.course?.code || 'N/A'
        },
        student: {
            id: data.student?.id || data.studentId,
            name: data.student?.name || 'Estudiante'
        },
        fileUrl: data.fileUrl,
        comments: data.comments || '',
        grade: data.grade,
        submittedAt: data.submittedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

export const submissionService = {
    getSubmissions: async (): Promise<Submission[]> => {
        try {
            const response = await api.get('/submissions');
            // Normalizar cada submission de la respuesta
            return response.data.map(normalizeSubmissionData);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            const mockData = await mockService.getSubmissions();
            return mockData.map(normalizeSubmissionData);
        }
    },

    getSubmission: async (id: string): Promise<Submission> => {
        try {
            const response = await api.get(`/submissions/${id}`);
            return normalizeSubmissionData(response.data);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            const submissions = await mockService.getSubmissions();
            const submission = submissions.find(s => s.id === id);
            if (!submission) throw new Error('Entrega no encontrada');
            return normalizeSubmissionData(submission);
        }
    },

    createSubmission: async (data: CreateSubmissionData): Promise<Submission> => {
        try {
            const response = await api.post('/submissions', data);
            return normalizeSubmissionData(response.data);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            // Crear una submission mock con estructura correcta
            const mockSubmission = {
                id: Math.random().toString(36).substr(2, 9),
                course: {
                    id: data.courseId,
                    name: 'Curso Ejemplo',
                    code: 'EX-101'
                },
                student: {
                    id: data.studentId,
                    name: 'Estudiante Ejemplo'
                },
                fileUrl: data.fileUrl,
                comments: data.comments || '',
                grade: null,
                submittedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            return normalizeSubmissionData(mockSubmission);
        }
    },

    gradeSubmission: async (id: string, data: GradeSubmissionData): Promise<Submission> => {
        try {
            const response = await api.put(`/submissions/${id}/grade`, data);
            return normalizeSubmissionData(response.data);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            const gradedSubmission = await mockService.gradeSubmission(id, data);
            return normalizeSubmissionData(gradedSubmission);
        }
    },

    deleteSubmission: async (id: string): Promise<void> => {
        try {
            await api.delete(`/submissions/${id}`);
        } catch (error: any) {
            console.warn('API no disponible, usando datos mock:', error.message);
            // Mock delete - no operation needed
        }
    }
};