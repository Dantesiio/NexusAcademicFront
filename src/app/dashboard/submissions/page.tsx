'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getSubmissions, gradeSubmission } from '../../store/actions/submissionActions';
import { getStudents } from '../../store/actions/studentActions';
import { getCourses } from '../../store/actions/courseActions';
import { Submission } from '../../store/slices/submissionSlice';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { 
    IoDocumentTextOutline, 
    IoSearchOutline, 
    IoStarOutline,
    IoTimeOutline,
    IoCheckmarkCircleOutline
} from 'react-icons/io5';

export default function SubmissionsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { submissions, loading, error } = useSelector((state: RootState) => state.submissions);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'GRADED' | 'PENDING'>('ALL');
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
    const [gradeData, setGradeData] = useState({ grade: '', comments: '' });

    useEffect(() => {
        dispatch(getSubmissions());
        dispatch(getCourses());
        dispatch(getStudents({ limit: 100, offset: 0 }));
    }, [dispatch]);

    useEffect(() => {
        let filtered = submissions;

        if (searchTerm) {
            filtered = filtered.filter(submission =>
                submission.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.course.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(submission => 
                statusFilter === 'GRADED' ? submission.grade !== null : submission.grade === null
            );
        }

        setFilteredSubmissions(filtered);
    }, [submissions, searchTerm, statusFilter]);

    const handleGradeSubmit = async (submissionId: string) => {
        if (!gradeData.grade) return;
        
        try {
            await dispatch(gradeSubmission(submissionId, {
                grade: parseFloat(gradeData.grade),
                comments: gradeData.comments
            }));
            
            setGradingSubmission(null);
            setGradeData({ grade: '', comments: '' });
        } catch (error) {
            console.error('Error grading submission:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES');
    };

    if (loading && submissions.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRoles={['admin', 'teacher']}>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black-900">Gestión de Entregas</h1>
                    <p className="text-black-600">Revisa y califica las entregas de los estudiantes</p>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoSearchOutline className="h-5 w-5 text-black-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar entregas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-black-300 rounded-md leading-5 bg-white placeholder-black-500 focus:outline-none focus:placeholder-black-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'GRADED' | 'PENDING')}
                        className="border border-black-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="ALL">Todas las entregas</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="GRADED">Calificadas</option>
                    </select>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubmissions.map((submission) => (
                        <div key={submission.id} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <IoDocumentTextOutline className="h-8 w-8 text-blue-500 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-black-900">
                                                {submission.student.name}
                                            </h3>
                                            <p className="text-sm text-black-500">
                                                {submission.course.name}
                                            </p>
                                        </div>
                                    </div>
                                    {submission.grade !== null ? (
                                        <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <IoCheckmarkCircleOutline className="h-4 w-4 mr-1" />
                                            {submission.grade}/5.0
                                        </span>
                                    ) : (
                                        <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <IoTimeOutline className="h-4 w-4 mr-1" />
                                            Pendiente
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-black-600 mb-2">
                                        <span className="font-medium">Curso:</span> {submission.course.code}
                                    </p>
                                    <p className="text-sm text-black-600 mb-2">
                                        <span className="font-medium">Entregado:</span> {formatDate(submission.submittedAt)}
                                    </p>
                                    {submission.comments && (
                                        <p className="text-sm text-black-600">
                                            <span className="font-medium">Comentarios:</span> {submission.comments}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <a
                                        href={submission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-3 py-2 border border-black-300 shadow-sm text-sm font-medium rounded-md text-black-700 bg-white hover:bg-black-50"
                                    >
                                        Ver Archivo
                                    </a>
                                    
                                    {submission.grade === null && (
                                        <button
                                            onClick={() => setGradingSubmission(submission.id)}
                                            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <IoStarOutline className="h-4 w-4 mr-1" />
                                            Calificar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSubmissions.length === 0 && (
                    <div className="text-center py-12">
                        <IoDocumentTextOutline className="mx-auto h-12 w-12 text-black-400" />
                        <h3 className="mt-2 text-sm font-medium text-black-900">No hay entregas</h3>
                        <p className="mt-1 text-sm text-black-500">
                            {submissions.length === 0 
                                ? 'No se han registrado entregas aún.' 
                                : 'No se encontraron entregas con los filtros aplicados.'
                            }
                        </p>
                    </div>
                )}

                {/* Modal de Calificación */}
                {gradingSubmission && (
                    <div className="fixed inset-0 bg-black-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
                            <h3 className="text-lg font-bold text-black-900 mb-4">
                                Calificar Entrega
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-black-700">
                                        Calificación (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={gradeData.grade}
                                        onChange={(e) => setGradeData(prev => ({...prev, grade: e.target.value}))}
                                        className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black-700">
                                        Comentarios
                                    </label>
                                    <textarea
                                        value={gradeData.comments}
                                        onChange={(e) => setGradeData(prev => ({...prev, comments: e.target.value}))}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Retroalimentación para el estudiante..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setGradingSubmission(null);
                                        setGradeData({ grade: '', comments: '' });
                                    }}
                                    className="px-4 py-2 border border-black-300 rounded-md shadow-sm text-sm font-medium text-black-700 bg-white hover:bg-black-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleGradeSubmit(gradingSubmission)}
                                    disabled={!gradeData.grade}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Calificar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}