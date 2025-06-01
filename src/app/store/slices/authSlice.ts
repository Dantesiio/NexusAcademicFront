// src/app/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('Setting credentials with:', action.payload);
      
      const user = action.payload.user;
      if (!user.roles || !Array.isArray(user.roles)) {
        console.warn('User roles missing or invalid, setting default roles');
        user.roles = ['teacher'];
      }
      
      state.user = user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.isInitialized = true;
      
      console.log('User set in state:', state.user);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    clearCredentials: (state) => {
      console.log('Clearing credentials from state');
      
      // Limpiar localStorage inmediatamente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        console.log('Token removed from localStorage');
      }
      
      // Resetear todo el estado
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.isInitialized = true;
      
      console.log('Auth state cleared');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.isInitialized = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    initializeAuth: (state) => {
      state.isInitialized = true;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
        }
      }
    }
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  setLoading, 
  setError, 
  setInitialized,
  initializeAuth 
} = authSlice.actions;

export default authSlice.reducer;