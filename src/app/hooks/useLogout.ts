// src/app/hooks/useLogout.ts

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { logoutUser } from '../store/actions/authActions';

export const useLogout = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const logout = async () => {
        try {
            console.log('Executing logout...');
            
            // Limpiar estado inmediatamente
            await dispatch(logoutUser());
            
            // Forzar navegación
            router.replace('/auth/login');
            
            // Backup con window.location
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
                    window.location.replace('/auth/login');
                }
            }, 500);
            
        } catch (error) {
            console.error('Error during logout:', error);
            // Forzar limpieza manual
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.replace('/auth/login');
            }
        }
    };

    return logout;
};