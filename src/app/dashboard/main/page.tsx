'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    IoPersonOutline, 
    IoBookOutline, 
    IoDocumentTextOutline,
    IoStatsChartOutline,
    IoLogOutOutline
} from 'react-icons/io5';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
            <div className={`flex-shrink-0 ${color}`}>
                <div className="text-2xl">
                    {icon}
                </div>
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                        {title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                        {value}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
);

export default function MainPage() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState({ fullName: 'Administrador' });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
            }
        }
    }, [isClient, router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                Nexus<span className="text-blue-500">Academic</span>
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Bienvenido, {user.fullName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                <IoLogOutOutline className="h-4 w-4 mr-1" />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        ¡Hola, {user.fullName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Bienvenido al sistema de gestión académica
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Estudiantes"
                        value={25}
                        icon={<IoPersonOutline />}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Cursos Activos"
                        value={8}
                        icon={<IoBookOutline />}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Entregas Pendientes"
                        value={12}
                        icon={<IoDocumentTextOutline />}
                        color="text-yellow-600"
                    />
                    <StatCard
                        title="Estudiantes Activos"
                        value={20}
                        icon={<IoStatsChartOutline />}
                        color="text-purple-600"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Acciones Rápidas
                        </h2>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <div className="flex items-center">
                                    <IoPersonOutline className="h-5 w-5 text-blue-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-900">Gestionar Estudiantes</span>
                                </div>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <div className="flex items-center">
                                    <IoBookOutline className="h-5 w-5 text-green-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-900">Administrar Cursos</span>
                                </div>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                                <div className="flex items-center">
                                    <IoDocumentTextOutline className="h-5 w-5 text-yellow-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-900">Revisar Entregas</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Actividad Reciente
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Juan Pérez
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Entregó tarea de Programación
                                    </p>
                                </div>
                                <span className="text-sm text-yellow-600">
                                    Pendiente
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        María González
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Completó examen de Base de Datos
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-green-600">
                                    4.5/5.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}