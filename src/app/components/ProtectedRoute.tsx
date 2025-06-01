// src/app/components/ProtectedRoute.tsx

'use client'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '../store';
import { initializeAuthStatus } from '../store/actions/authActions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated, user, loading, isInitialized } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(initializeAuthStatus());
        }
    }, [dispatch, isInitialized]);

    useEffect(() => {
        if (isInitialized && !loading && !isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            router.replace('/auth/login');
        }
    }, [isInitialized, loading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && user && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
            if (!hasRequiredRole) {
                router.replace('/dashboard/main');
            }
        }
    }, [isAuthenticated, user, requiredRoles, router]);

    if (!isInitialized || loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
        if (!hasRequiredRole) {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Acceso Denegado</h1>
                        <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
                        <button
                            onClick={() => router.replace('/dashboard/main')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Ir al Dashboard
                        </button>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};