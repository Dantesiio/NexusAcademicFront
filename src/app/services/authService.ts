import { api } from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
    token: string;
}

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    checkStatus: async (): Promise<AuthResponse> => {
        const response = await api.get('/auth/check-status');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    }
};