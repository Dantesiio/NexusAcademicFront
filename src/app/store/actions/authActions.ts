import { Dispatch } from 'redux';
import { authService, LoginData, RegisterData } from '../../services/authService';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  setError
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
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
        dispatch(setError(errorMessage));
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
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
        dispatch(setError(errorMessage));
    }
};

export const checkAuthStatus = () => async (dispatch: Dispatch) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
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
    } catch {
        dispatch(clearCredentials());
    }
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    try {
        await authService.logout();
    } catch {
        // Even if logout fails on server, clear local state
    } finally {
        dispatch(clearCredentials());
    }
};