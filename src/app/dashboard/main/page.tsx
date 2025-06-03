'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getStudents } from '../../store/actions/studentActions';
import { getCourses } from '../../store/actions/courseActions';
import { getSubmissions } from '../../store/actions/submissionActions';
import { 
    IoPersonOutline, 
    IoBookOutline, 
    IoDocumentTextOutline,
    IoStatsChartOutline,
    IoCheckmarkCircleOutline
} from 'react-icons/io5';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}

const StatCard = ({ title, value, icon, color, subtitle }: StatCardProps) => (
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
                    {subtitle && (
                        <dd className="text-xs text-gray-500">
                            {subtitle}
                        </dd>
                    )}
                </dl>
            </div>
        </div>
    </div>
);

export default function MainPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { students } = useSelector((state: RootState) => state.students);
    const { courses } = useSelector((state: RootState) => state.courses);
    const { submissions } = useSelector((state: RootState) => state.submissions);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            // Cargar datos reales del backend
            dispatch(getStudents({ limit: 1000, offset: 0 }));
            dispatch(getCourses());
            dispatch(getSubmissions());
        }
    }, [isClient, dispatch]);

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Calcular estadísticas reales
    const totalStudents = students.length;
    const activeCourses = courses.filter(c => c.status === 'ACTIVE').length;
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.grade !== null).length;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-6">
                {/* Header de Bienvenida */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Bienvenido a Nexus<span className="text-blue-500">Academic</span>!
                    </h1>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xl text-gray-600 mb-4">
                            Sistema integral de gestión académica diseñado para facilitar la administración de cursos, estudiantes y entregas.
                        </p>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">¿Qué puedes hacer con NexusAcademic?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <IoPersonOutline className="h-5 w-5 text-blue-500 mr-2" />
                                    <span>Gestionar estudiantes y sus matrículas</span>
                                </div>
                                <div className="flex items-center">
                                    <IoBookOutline className="h-5 w-5 text-green-500 mr-2" />
                                    <span>Administrar cursos y profesores</span>
                                </div>
                                <div className="flex items-center">
                                    <IoDocumentTextOutline className="h-5 w-5 text-purple-500 mr-2" />
                                    <span>Revisar y calificar entregas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas Reales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Estudiantes"
                        value={totalStudents}
                        subtitle="Total registrados"
                        icon={<IoPersonOutline />}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Cursos Activos"
                        value={activeCourses}
                        subtitle={`${courses.length} total`}
                        icon={<IoBookOutline />}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Entregas"
                        value={totalSubmissions}
                        subtitle={`${pendingSubmissions} pendientes`}
                        icon={<IoDocumentTextOutline />}
                        color="text-purple-600"
                    />
                    <StatCard
                        title="Calificadas"
                        value={gradedSubmissions}
                        subtitle="Entregas revisadas"
                        icon={<IoCheckmarkCircleOutline />}
                        color="text-yellow-600"
                    />
                </div>

                {/* Información del Usuario Actual */}
                {user && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Información de tu cuenta
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Nombre</label>
                                <p className="text-lg text-gray-900">{user.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Roles</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.roles.map((role, index) => (
                                        <span 
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensaje motivacional */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Utiliza el menú lateral para navegar entre las diferentes secciones del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}