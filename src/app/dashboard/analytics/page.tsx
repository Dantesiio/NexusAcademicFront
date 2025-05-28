'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getStudents } from '../../store/actions/studentActions';
import { getCourses } from '../../store/actions/courseActions';
import { getSubmissions } from '../../store/actions/submissionActions';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { 
    IoStatsChartOutline, 
    IoTrendingUpOutline, 
    IoPersonOutline,
    IoBookOutline,
    IoDocumentTextOutline,
    IoCheckmarkCircleOutline
} from 'react-icons/io5';

interface MetricCardProps {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
}

const MetricCard = ({ title, value, subtitle, icon, color, trend }: MetricCardProps) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`text-2xl ${color}`}>
                        {icon}
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-black-500 truncate">
                            {title}
                        </dt>
                        <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-black-900">
                                {value}
                            </div>
                            {trend !== undefined && (
                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                    trend >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <IoTrendingUpOutline className="self-center flex-shrink-0 h-4 w-4" />
                                    <span className="sr-only">
                                        {trend >= 0 ? 'Increased' : 'Decreased'} by
                                    </span>
                                    {Math.abs(trend)}%
                                </div>
                            )}
                        </dd>
                        <dd className="text-sm text-black-500">
                            {subtitle}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

export default function AnalyticsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { students } = useSelector((state: RootState) => state.students);
    const { courses } = useSelector((state: RootState) => state.courses);
    const { submissions } = useSelector((state: RootState) => state.submissions);

    useEffect(() => {
        dispatch(getStudents({ limit: 1000, offset: 0 }));
        dispatch(getCourses());
        dispatch(getSubmissions());
    }, [dispatch]);

    // Calcular métricas
    const totalStudents = students.length;
    const activeCourses = courses.filter(c => c.status === 'ACTIVE').length;
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.grade !== null).length;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;
    
    // Promedio de calificaciones
    const grades = submissions.filter(s => s.grade !== null).map(s => s.grade as number);
    const averageGrade = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : '0';
    
    // Estudiantes activos (con al menos una matrícula)
    const activeStudents = students.filter(s => s.enrollments && s.enrollments.length > 0).length;
    
    // Distribución de calificaciones
    const gradeDistribution = {
        excellent: grades.filter(g => g >= 4.5).length,
        good: grades.filter(g => g >= 3.5 && g < 4.5).length,
        regular: grades.filter(g => g >= 3.0 && g < 3.5).length,
        poor: grades.filter(g => g < 3.0).length,
    };

    return (
        <ProtectedRoute requiredRoles={['admin', 'teacher']}>
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-black-900">Analytics</h1>
                    <p className="text-black-600">Panel de estadísticas y métricas del sistema</p>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Estudiantes"
                        value={totalStudents}
                        subtitle={`${activeStudents} activos`}
                        icon={<IoPersonOutline />}
                        color="text-blue-600"
                    />
                    <MetricCard
                        title="Cursos Activos"
                        value={activeCourses}
                        subtitle={`${courses.length} total`}
                        icon={<IoBookOutline />}
                        color="text-green-600"
                    />
                    <MetricCard
                        title="Entregas Totales"
                        value={totalSubmissions}
                        subtitle={`${pendingSubmissions} pendientes`}
                        icon={<IoDocumentTextOutline />}
                        color="text-purple-600"
                    />
                    <MetricCard
                        title="Promedio General"
                        value={parseFloat(averageGrade)}
                        subtitle="de 5.0"
                        icon={<IoStatsChartOutline />}
                        color="text-yellow-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribución de Calificaciones */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-black-900 mb-4">
                            Distribución de Calificaciones
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                    <span className="text-sm text-black-600">Excelente (4.5-5.0)</span>
                                </div>
                                <span className="text-sm font-medium text-black-900">
                                    {gradeDistribution.excellent} ({grades.length > 0 ? Math.round((gradeDistribution.excellent / grades.length) * 100) : 0}%)
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                    <span className="text-sm text-black-600">Bueno (3.5-4.4)</span>
                                </div>
                                <span className="text-sm font-medium text-black-900">
                                    {gradeDistribution.good} ({grades.length > 0 ? Math.round((gradeDistribution.good / grades.length) * 100) : 0}%)
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                                    <span className="text-sm text-black-600">Regular (3.0-3.4)</span>
                                </div>
                                <span className="text-sm font-medium text-black-900">
                                    {gradeDistribution.regular} ({grades.length > 0 ? Math.round((gradeDistribution.regular / grades.length) * 100) : 0}%)
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                    <span className="text-sm text-black-600">Deficiente (&lt;3.0)</span>
                                </div>
                                <span className="text-sm font-medium text-black-900">
                                    {gradeDistribution.poor} ({grades.length > 0 ? Math.round((gradeDistribution.poor / grades.length) * 100) : 0}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Cursos */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-black-900 mb-4">
                            Resumen de Cursos
                        </h2>
                        <div className="space-y-4">
                            {courses.slice(0, 5).map(course => {
                                const courseSubmissions = submissions.filter(s => s.course.id === course.id);
                                const courseGrades = courseSubmissions.filter(s => s.grade !== null);
                                const courseAverage = courseGrades.length > 0 
                                    ? (courseGrades.reduce((sum, s) => sum + (s.grade as number), 0) / courseGrades.length).toFixed(1)
                                    : '-';
                                
                                return (
                                    <div key={course.id} className="flex items-center justify-between p-3 bg-black-50 rounded-md">
                                        <div>
                                            <h3 className="text-sm font-medium text-black-900">
                                                {course.name}
                                            </h3>
                                            <p className="text-xs text-black-500">
                                                {course.code} - {courseSubmissions.length} entregas
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-black-900">
                                                {courseAverage !== '-' ? `${courseAverage}/5.0` : 'Sin calificar'}
                                            </div>
                                            <div className="text-xs text-black-500">
                                                Promedio
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Progreso */}
                <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-black-900 mb-4">
                        Estado de Entregas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <IoCheckmarkCircleOutline className="mx-auto h-8 w-8 text-green-600 mb-2" />
                            <div className="text-2xl font-bold text-green-600">{gradedSubmissions}</div>
                            <div className="text-sm text-green-700">Calificadas</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <IoDocumentTextOutline className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
                            <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions}</div>
                            <div className="text-sm text-yellow-700">Pendientes</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <IoStatsChartOutline className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                            <div className="text-2xl font-bold text-blue-600">
                                {totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0}%
                            </div>
                            <div className="text-sm text-blue-700">Completado</div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}