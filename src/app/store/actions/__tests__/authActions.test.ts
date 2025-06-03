import { loginUser, registerUser, checkAuthStatus, logoutUser, initializeAuthStatus } from '../authActions';
import { authService, LoginData, RegisterData } from '../../../services/authService';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  initializeAuth,
} from '../../slices/authSlice';

// Mockear solo el servicio de autenticación
jest.mock('../../../services/authService');

let mockLocalStorage: Storage;

beforeAll(() => {
  mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
  };
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });
  
  // Mockear console.error para evitar output en las pruebas
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const mockDispatch = jest.fn();
const mockUserResponse = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  roles: ['teacher'],
  isActive: true,
  token: 'fake-jwt-token',
};

describe('authActions thunks', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    (authService.login as jest.Mock).mockReset().mockResolvedValue(mockUserResponse);
    (authService.register as jest.Mock).mockReset().mockResolvedValue(mockUserResponse);
    (authService.checkStatus as jest.Mock).mockReset().mockResolvedValue(mockUserResponse);
    (authService.logout as jest.Mock).mockReset().mockResolvedValue(undefined);
    
    (mockLocalStorage.getItem as jest.Mock).mockReset().mockReturnValue(null);
    (mockLocalStorage.setItem as jest.Mock).mockReset();
    (mockLocalStorage.removeItem as jest.Mock).mockReset();
  });

  describe('checkAuthStatus', () => {
    it('debería despachar clearCredentials si hay token pero el status falla', async () => {
      (mockLocalStorage.getItem as jest.Mock).mockReturnValue('fake-token');
      (authService.checkStatus as jest.Mock).mockRejectedValue(new Error('Status check failed'));
      
      await checkAuthStatus()(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(authService.checkStatus).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());
    });

    it('debería despachar setCredentials si hay token y el status es válido', async () => {
      (mockLocalStorage.getItem as jest.Mock).mockReturnValue('valid-token');
      
      await checkAuthStatus()(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(authService.checkStatus).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setCredentials({
        user: {
          id: mockUserResponse.id,
          email: mockUserResponse.email,
          fullName: mockUserResponse.fullName,
          roles: mockUserResponse.roles,
          isActive: mockUserResponse.isActive,
        },
        token: mockUserResponse.token,
      }));
    });

    it('debería despachar clearCredentials si no hay token', async () => {
      await checkAuthStatus()(mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());
      expect(authService.checkStatus).not.toHaveBeenCalled();
    });
  });

  describe('initializeAuthStatus', () => {
    it('debería despachar initializeAuth y checkAuthStatus', async () => {
      await initializeAuthStatus()(mockDispatch);
      
      // Verificar que se llamó primero a initializeAuth
      expect(mockDispatch.mock.calls[0][0]).toEqual(initializeAuth());
      
      // Verificar que el segundo dispatch es una función (el thunk checkAuthStatus)
      expect(typeof mockDispatch.mock.calls[1][0]).toBe('function');
    });
  });

  // ... (mantén tus otras pruebas para loginUser, registerUser, logoutUser)
});