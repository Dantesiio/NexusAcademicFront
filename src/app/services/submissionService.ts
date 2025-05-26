import { api } from './api';
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

export const submissionService = {
    getSubmissions: async (): Promise<Submission[]> => {
        const response = await api.get('/submissions');
        return response.data;
    },

    getSubmission: async (id: string): Promise<Submission> => {
        const response = await api.get(`/submissions/${id}`);
        return response.data;
    },

    createSubmission: async (data: CreateSubmissionData): Promise<Submission> => {
        const response = await api.post('/submissions', data);
        return response.data;
    },

    gradeSubmission: async (id: string, data: GradeSubmissionData): Promise<Submission> => {
        const response = await api.put(`/submissions/${id}/grade`, data);
        return response.data;
    },

    deleteSubmission: async (id: string): Promise<void> => {
        await api.delete(`/submissions/${id}`);
    }
};