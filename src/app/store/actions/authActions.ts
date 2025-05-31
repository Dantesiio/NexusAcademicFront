// src/app/store/actions/authActions.ts
import { Dispatch } from 'redux';
import { authService, LoginData, RegisterData } from '../../services/authService';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  initializeAuth
} from '../slices/authSlice';

export const loginUser = (data: LoginData) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await authService.login(data);
        dispatch(setCredentials({
            user: {
                id: response.id,
                email: response.email,
                fullName: response.fullName,
                roles: response.roles,
                isActive: response.isActive
            },
            token: response.token
        }));
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al iniciar sesión';
        dispatch(setError(errorMessage));
        throw error; // Re-throw para manejar en el componente
    }
};

export const registerUser = (data: RegisterData) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await authService.register(data);
        dispatch(setCredentials({
            user: {
                id: response.id,
                email: response.email,
                fullName: response.fullName,
                roles: response.roles,
                isActive: response.isActive
            },
            token: response.token
        }));
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al registrar usuario';
        dispatch(setError(errorMessage));
        throw error; // Re-throw para manejar en el componente
    }
};

export const checkAuthStatus = () => async (dispatch: Dispatch) => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
        dispatch(initializeAuth());
        return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
        dispatch(clearCredentials());
        return;
    }

    dispatch(setLoading(true));
    try {
        const response = await authService.checkStatus();
        dispatch(setCredentials({
            user: {
                id: response.id,
                email: response.email,
                fullName: response.fullName,
                roles: response.roles,
                isActive: response.isActive
            },
            token: response.token
        }));
    } catch (error: any) {
        console.error('Error verificando estado de autenticación:', error);
        dispatch(clearCredentials());
    }
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    try {
        await authService.logout();
    } catch (error) {
        console.error('Error en logout:', error);
        // Even if logout fails on server, clear local state
    } finally {
        dispatch(clearCredentials());
        // Redirigir al login
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }
};

// Acción para inicializar la autenticación en el cliente
export const initializeAuthStatus = () => async (dispatch: Dispatch) => {
    if (typeof window !== 'undefined') {
        dispatch(initializeAuth());
        // Verificar el token actual
        await dispatch(checkAuthStatus() as any);
    } else {
        dispatch(initializeAuth());
    }
};