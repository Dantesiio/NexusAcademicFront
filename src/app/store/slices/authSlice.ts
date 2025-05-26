import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,
    loading: false,
    error: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        startAuth: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{user: User, token: string}>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload.token);
            }
        },
        authFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { startAuth, loginSuccess, authFailure, logout, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;