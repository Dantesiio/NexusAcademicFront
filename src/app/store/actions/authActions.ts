import { Dispatch } from 'redux';
import { authService, LoginData, RegisterData } from '../../services/authService';
import {
  setCredentials as loginSuccess,
  clearCredentials as logoutAction,
  setLoading as startAuth,
  setError as authFailure
} from '../slices/authSlice';
export const loginUser = (data: LoginData) => async (dispatch: Dispatch) => {
    dispatch(startAuth(true));
    try {
        const response = await authService.login(data);
        dispatch(loginSuccess({
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
        dispatch(authFailure(error.response?.data?.message || 'Error al iniciar sesión'));
    }
};

export const registerUser = (data: RegisterData) => async (dispatch: Dispatch) => {
    dispatch(startAuth(true));
    try {
        const response = await authService.register(data);
        dispatch(loginSuccess({
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
        dispatch(authFailure(error.response?.data?.message || 'Error al registrar usuario'));
    }
};

export const checkAuthStatus = () => async (dispatch: Dispatch) => {
    try {
        const response = await authService.checkStatus();
        dispatch(loginSuccess({
            user: {
                id: response.id,
                email: response.email,
                fullName: response.fullName,
                roles: response.roles,
                isActive: response.isActive
            },
            token: response.token
        }));
    } catch (error) {
        dispatch(logoutAction());
    }
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    try {
        await authService.logout();
    } catch (error) {
        // Even if logout fails on server, clear local state
    } finally {
        dispatch(logoutAction());
    }
};