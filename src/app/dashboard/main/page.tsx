'use client'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../../store';
import { getStudents } from '../../store/actions/studentActions';
import { getCourses } from '../../store/actions/courseActions';
import { getSubmissions } from '../../store/actions/submissionActions';
import { 
    IoPersonOutline, 
    IoBookOutline, 
    IoDocumentTextOutline,
    IoStatsChartOutline
} from 'react-icons/io5';

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
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { students } = useSelector((state: RootState) => state.students);
    const { courses } = useSelector((state: RootState) => state.courses);
    const { submissions } = useSelector((state: RootState) => state.submissions);

    useEffect(() => {
        if (user?.roles.includes('admin') || user?.roles.includes('teacher')) {
            dispatch(getStudents({ limit: 100, offset: 0 }));
            dispatch(getCourses());
            dispatch(getSubmissions());
        }
    }, [dispatch, user]);

    const pendingSubmissions = submissions.filter(s => s.grade === null).length;
    const activeStudents = students.filter(s => s.enrollments && s.enrollments.length > 0).length;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    ¡Hola, {user?.fullName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Bienvenido al sistema de gestión académica
                </p>
            </div>

            {(user?.roles.includes('admin') || user?.roles.includes('teacher')) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Estudiantes"
                        value={students.length}
                        icon={<IoPersonOutline />}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Cursos Activos"
                        value={courses.filter(c => c.status === 'ACTIVE').length}
                        icon={<IoBookOutline />}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Entregas Pendientes"
                        value={pendingSubmissions}
                        icon={<IoDocumentTextOutline />}
                        color="text-yellow-600"
                    />
                    <StatCard
                        title="Estudiantes Activos"
                        value={activeStudents}
                        icon={<IoStatsChartOutline />}
                        color="text-purple-600"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Cursos Recientes
                    </h2>
                    <div className="space-y-4">
                        {courses.slice(0, 5).map(course => (
                            <div key={course.id} className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {course.code} - {course.teacher.fullName}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    course.status === 'ACTIVE' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Actividad Reciente
                    </h2>
                    <div className="space-y-4">
                        {submissions.slice(0, 5).map(submission => (
                            <div key={submission.id} className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {submission.student.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {submission.course.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {submission.grade ? (
                                        <span className="text-sm font-medium text-green-600">
                                            {submission.grade}/5.0
                                        </span>
                                    ) : (
                                        <span className="text-sm text-yellow-600">
                                            Pendiente
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}