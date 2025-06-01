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
        throw error;
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
        throw error;
    }
};

export const checkAuthStatus = () => async (dispatch: Dispatch) => {
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

// ✅ Mejorar el logout - este es el problema principal
export const logoutUser = () => async (dispatch: Dispatch) => {
    console.log('Iniciando logout...');
    
    try {
        // Primero limpiar el estado local inmediatamente
        dispatch(clearCredentials());
        
        // Luego intentar logout en servidor (no blocking)
        try {
            await authService.logout();
            console.log('Logout del servidor exitoso');
        } catch (error) {
            console.warn('Error en logout del servidor:', error);
            // No importa si falla el logout del servidor
        }
        
    } catch (error) {
        console.error('Error en logout:', error);
        // Forzar limpieza del estado incluso si hay errores
        dispatch(clearCredentials());
    }
    
    console.log('Logout completado, redirigiendo...');
};

export const initializeAuthStatus = () => async (dispatch: Dispatch) => {
    if (typeof window !== 'undefined') {
        dispatch(initializeAuth());
        await dispatch(checkAuthStatus() as any);
    } else {
        dispatch(initializeAuth());
    }
};