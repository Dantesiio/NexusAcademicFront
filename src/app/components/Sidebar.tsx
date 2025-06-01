// src/app/components/Sidebar.tsx

'use client'
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../store';
import { logoutUser } from '../store/actions/authActions';
import { useLogout } from '../hooks/useLogout'; // Importar el hook
import { SidebarItemMenu } from './SidebarItemMenu';
import { 
    IoBrowsersOutline, 
    IoBookOutline, 
    IoDocumentTextOutline,
    IoPersonOutline,
    IoLogOutOutline,
    IoStatsChartOutline
} from 'react-icons/io5';

export const Sidebar = () => {
    const logout = useLogout(); // Usar el hook
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const token = localStorage.getItem('token');
            if (!token) {
                // Si no hay token, usar el hook de logout que maneja todo
                logout();
            }
        }
    }, [isClient, logout]);

    const handleLogout = () => {
        logout(); // Simplificar usando el hook
    };

    /*const handleLogout = async () => {
        console.log('Logout button clicked');
        
        try {
            // Dispatch logout action
            await dispatch(logoutUser());
            
            // Forzar navegación inmediata
            console.log('Navegando a login...');
            router.replace('/auth/login');
            
            // Como backup, usar window.location si router no funciona
            setTimeout(() => {
                if (window.location.pathname !== '/auth/login') {
                    console.log('Router falló, usando window.location');
                    window.location.replace('/auth/login');
                }
            }, 100);
            
        } catch (error) {
            console.error('Error en logout:', error);
            // Forzar limpieza manual si todo falla
            localStorage.removeItem('token');
            window.location.replace('/auth/login');
        }
    };*/

    // Obtener roles de forma segura
    const userRoles = user?.roles || [];
    
    console.log('User in sidebar:', user);
    console.log('User roles:', userRoles);

    const menuItems = [
        {
            path: '/dashboard/main',
            icon: <IoBrowsersOutline />,
            title: 'Dashboard',
            subTitle: 'Página Principal',
            roles: ['admin', 'teacher', 'student', 'superUser']
        },
        {
            path: '/dashboard/students',
            icon: <IoPersonOutline />,
            title: 'Estudiantes',
            subTitle: 'Gestión de Estudiantes',
            roles: ['admin', 'teacher', 'superUser']
        },
        {
            path: '/dashboard/courses',
            icon: <IoBookOutline />,
            title: 'Cursos',
            subTitle: 'Gestión de Cursos',
            roles: ['admin', 'teacher', 'superUser']
        },
        {
            path: '/dashboard/submissions',
            icon: <IoDocumentTextOutline />,
            title: 'Entregas',
            subTitle: 'Gestión de Entregas',
            roles: ['admin', 'teacher', 'superUser']
        },
        {
            path: '/dashboard/analytics',
            icon: <IoStatsChartOutline />,
            title: 'Analytics',
            subTitle: 'Estadísticas',
            roles: ['admin', 'teacher', 'superUser']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => {
        if (!user || !userRoles || userRoles.length === 0) {
            return item.path === '/dashboard/main';
        }
        return item.roles.some(role => userRoles.includes(role));
    });

    if (!user) {
        return (
            <div
                style={{ width: '400px' }}
                className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 h-screen flex items-center justify-center"
            >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div
            style={{ width: '400px' }}
            id="menu" 
            className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 h-screen overflow-y-scroll"
        >
            <div id="logo" className="my-4 px-6">
                <h1 className="text-lg md:text-2xl font-bold text-white">
                    Nexus<span className="text-blue-500">Academic</span>
                </h1>
                <p className="text-slate-500 text-sm">Sistema de Gestión Académica</p>
            </div>

            <div id="profile" className="px-6 py-10">
                <p className="text-slate-500">Bienvenido,</p>
                <div className="inline-flex space-x-2 items-center">
                    <span>
                        <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                            className="rounded-full w-8 h-8"
                            width={50}
                            height={50}
                            alt="avatar" 
                        />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm md:text-base font-bold text-white">
                            {user.fullName || 'Usuario'}
                        </span>
                        <span className="text-xs text-slate-400">
                            {userRoles.length > 0 ? userRoles.join(', ') : 'Sin roles'}
                        </span>
                    </div>
                </div>
            </div>

            <div id="nav" className="w-full px-6">
                {filteredMenuItems.map(item => (
                    <SidebarItemMenu 
                        key={item.path} 
                        href={item.path} 
                        icon={item.icon} 
                        title={item.title} 
                    />
                ))}
                
                {filteredMenuItems.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">No hay opciones disponibles</p>
                        <p className="text-slate-600 text-xs mt-1">
                            Roles actuales: {userRoles.length > 0 ? userRoles.join(', ') : 'Ninguno'}
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 w-full px-6 py-4">
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full px-2 inline-flex space-x-2 items-center border-t border-slate-700 py-3 hover:bg-red-600/10 transition ease-linear duration-150 text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                    <IoLogOutOutline />
                    <span className="text-sm font-medium">
                        {loading ? 'Cerrando...' : 'Cerrar Sesión'}
                    </span>
                </button>
            </div>
        </div>
    );
};