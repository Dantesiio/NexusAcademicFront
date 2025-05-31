// src/app/services/authService.ts
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

// Función helper para normalizar la respuesta del backend
const normalizeAuthResponse = (backendResponse: any): AuthResponse => {
    // Si viene del backend real
    if (backendResponse.token && backendResponse.id) {
        return {
            id: backendResponse.id,
            email: backendResponse.email,
            fullName: backendResponse.fullName || 'Usuario',
            roles: backendResponse.roles || ['teacher'], // Default role si no viene
            isActive: backendResponse.isActive !== false, // Default true
            token: backendResponse.token
        };
    }
    
    // Si viene con estructura user/token separada
    if (backendResponse.user && backendResponse.token) {
        return {
            id: backendResponse.user.id,
            email: backendResponse.user.email,
            fullName: backendResponse.user.fullName || 'Usuario',
            roles: backendResponse.user.roles || ['teacher'],
            isActive: backendResponse.user.isActive !== false,
            token: backendResponse.token
        };
    }
    
    // Fallback para datos mock
    return backendResponse;
};

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/login', data);
            console.log('Backend login response:', response.data);
            return normalizeAuthResponse(response.data);
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Si el backend no está disponible, usar mock temporal
            if (error.status === 0 || !error.status) {
                console.warn('Backend no disponible, usando datos mock');
                if (data.email === 'admin@nexusacademic.com' && data.password === 'admin123') {
                    return {
                        id: '1',
                        email: data.email,
                        fullName: 'Administrador',
                        roles: ['admin', 'teacher'],
                        isActive: true,
                        token: 'mock_token_' + Math.random().toString(36).substr(2, 9)
                    };
                }
                // Agregar credenciales del backend real para testing
                if (data.email === 'admin@nexus.com' && data.password === 'Admin123') {
                    return {
                        id: '1',
                        email: data.email,
                        fullName: 'Administrador Nexus',
                        roles: ['admin', 'superUser'],
                        isActive: true,
                        token: 'mock_token_' + Math.random().toString(36).substr(2, 9)
                    };
                }
            }
            throw error;
        }
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/register', data);
            console.log('Backend register response:', response.data);
            return normalizeAuthResponse(response.data);
        } catch (error: any) {
            console.error('Register error:', error);
            
            // Si el backend no está disponible, usar mock temporal
            if (error.status === 0 || !error.status) {
                console.warn('Backend no disponible, usando datos mock');
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    email: data.email,
                    fullName: data.fullName,
                    roles: ['teacher'],
                    isActive: true,
                    token: 'mock_token_' + Math.random().toString(36).substr(2, 9)
                };
            }
            throw error;
        }
    },

    checkStatus: async (): Promise<AuthResponse> => {
        try {
            const response = await api.get('/auth/check-status');
            console.log('Backend check-status response:', response.data);
            
            // El backend puede devolver solo el user o user con token
            const responseData = response.data.user || response.data;
            const token = response.data.token || localStorage.getItem('token');
            
            return normalizeAuthResponse({
                ...responseData,
                token: token
            });
        } catch (error: any) {
            console.error('Check status error:', error);
            
            // Si el backend no está disponible y hay token mock
            const token = localStorage.getItem('token');
            if (token && token.startsWith('mock_token_')) {
                console.warn('Backend no disponible, usando datos mock para verificación');
                return {
                    id: '1',
                    email: 'admin@nexusacademic.com',
                    fullName: 'Administrador',
                    roles: ['admin', 'teacher'],
                    isActive: true,
                    token: token
                };
            }
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Even if logout fails on server, we still want to clear local state
            console.warn('Error en logout del servidor, limpiando estado local');
        }
    }
};