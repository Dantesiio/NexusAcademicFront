import authReducer, {
    setCredentials,
    clearCredentials,
    setLoading,
    setError,
    setInitialized,
    initializeAuth,
    // Asegúrate de exportar User e AuthState si los necesitas directamente en las pruebas,
    // o define mocks para ellos aquí.
  } from '../authSlice'; // Ajusta la ruta según tu estructura
  
  // Define un tipo User para las pruebas o impórtalo si está disponible
  interface User {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
  }
  
  // Define AuthState para las pruebas o impórtalo
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
  
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    fullName: 'Test User',
    roles: ['teacher'],
    isActive: true,
  };
  
  describe('authSlice reducer', () => {
    // Mock localStorage
    let mockLocalStorage: Storage;
  
    beforeEach(() => {
      mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0,
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });
  
    it('debería devolver el estado inicial', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('debería manejar setCredentials', () => {
      const actionPayload = { user: mockUser, token: 'test-token' };
      const expectedState: AuthState = {
        ...initialState,
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        isInitialized: true, // setCredentials también inicializa
      };
      expect(authReducer(initialState, setCredentials(actionPayload))).toEqual(expectedState);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    });
    
    it('debería manejar setCredentials con roles por defecto si faltan', () => {
      const userWithoutRoles = { ...mockUser, roles: undefined as any };
      const actionPayload = { user: userWithoutRoles, token: 'test-token-roles' };
      const stateAfter = authReducer(initialState, setCredentials(actionPayload));
      
      expect(stateAfter.user?.roles).toEqual(['teacher']); // Verifica roles por defecto
      expect(stateAfter.token).toBe('test-token-roles');
      expect(stateAfter.isAuthenticated).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'test-token-roles');
    });
  
  
    it('debería manejar clearCredentials', () => {
      const loggedInState: AuthState = {
        ...initialState,
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        isInitialized: true,
      };
      const expectedState: AuthState = {
        ...initialState,
        isInitialized: true, // clearCredentials deja isInitialized en true
      };
      expect(authReducer(loggedInState, clearCredentials())).toEqual(expectedState);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });
  
    it('debería manejar setLoading', () => {
      let state = authReducer(initialState, setLoading(true));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull(); // setLoading(true) debería limpiar errores
  
      state = authReducer(state, setLoading(false));
      expect(state.loading).toBe(false);
    });
  
    it('debería manejar setError', () => {
      const errorPayload = 'Ocurrió un error';
      const expectedState: AuthState = {
        ...initialState,
        error: errorPayload,
        loading: false, // setError debería poner loading en false
        isInitialized: true, // setError también inicializa
      };
      expect(authReducer(initialState, setError(errorPayload))).toEqual(expectedState);
    });
  
    it('debería manejar setInitialized', () => {
      const state = authReducer(initialState, setInitialized(true));
      expect(state.isInitialized).toBe(true);
    });
  
    it('debería manejar initializeAuth sin token en localStorage', () => {
      (mockLocalStorage.getItem as jest.Mock).mockReturnValue(null);
      const state = authReducer(initialState, initializeAuth());
      expect(state.isInitialized).toBe(true);
      expect(state.token).toBeNull();
    });
  
    it('debería manejar initializeAuth con token en localStorage', () => {
      const mockToken = 'stored-token';
      (mockLocalStorage.getItem as jest.Mock).mockReturnValue(mockToken);
      const state = authReducer(initialState, initializeAuth());
      expect(state.isInitialized).toBe(true);
      expect(state.token).toBe(mockToken);
    });
  });