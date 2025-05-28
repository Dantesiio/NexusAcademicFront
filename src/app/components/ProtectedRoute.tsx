'use client'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '../store';
import { checkAuthStatus } from '../store/actions/authActions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            dispatch(checkAuthStatus());
        }
    }, [dispatch, isAuthenticated, loading]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && user && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
            if (!hasRequiredRole) {
                router.push('/dashboard/main');
            }
        }
    }, [isAuthenticated, user, requiredRoles, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
                <div className="min-h-screen bg-black-100 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-black-900">Acceso Denegado</h1>
                        <p className="text-black-600 mt-2">No tienes permisos para acceder a esta página.</p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};