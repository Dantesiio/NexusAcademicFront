// src/app/components/Sidebar.tsx
'use client'
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logoutUser } from '../store/actions/authActions';
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
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    // Obtener roles de forma segura
    const userRoles = user?.roles || [];
    
    // Log para debug
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

    // Filtrar items de menú de forma segura
    const filteredMenuItems = menuItems.filter(item => {
        // Si no hay usuario o no tiene roles, mostrar solo dashboard
        if (!user || !userRoles || userRoles.length === 0) {
            return item.path === '/dashboard/main';
        }
        
        // Verificar si el usuario tiene al menos uno de los roles requeridos
        return item.roles.some(role => userRoles.includes(role));
    });

    // Mostrar loading si no hay usuario
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
                
                {/* Mostrar mensaje si no hay items filtrados */}
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
                    className="w-full px-2 inline-flex space-x-2 items-center border-t border-slate-700 py-3 hover:bg-red-600/10 transition ease-linear duration-150 text-red-400 hover:text-red-300"
                >
                    <IoLogOutOutline />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};