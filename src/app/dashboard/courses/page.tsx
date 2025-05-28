'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getCourses } from '../../store/actions/courseActions';
import { Course } from '../../store/slices/courseSlice';
import { CourseTable } from '../../components/CourseTable';
import { CourseForm } from '../../components/CourseForm';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { ClientOnlyWrapper } from '../../components/ClientOnlyWrapper';
import { IoAddOutline, IoSearchOutline, IoFilterOutline } from 'react-icons/io5';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function CoursesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error } = useSelector((state: RootState) => state.courses);
    
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

    useEffect(() => {
        dispatch(getCourses());
    }, [dispatch]);

    useEffect(() => {
        let filtered = courses;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(course => course.status === statusFilter);
        }

        setFilteredCourses(filtered);
    }, [courses, searchTerm, statusFilter]);

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCourse(undefined);
    };

    if (loading && courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <ClientOnlyWrapper>
            <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-black-900">Gestión de Cursos</h1>
                                <p className="text-black-600">Administra los cursos del sistema</p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <IoAddOutline className="h-5 w-5 mr-2" />
                                Nuevo Curso
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoSearchOutline className="h-5 w-5 text-black-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar cursos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-black-300 rounded-md leading-5 bg-white placeholder-black-500 focus:outline-none focus:placeholder-black-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoFilterOutline className="h-5 w-5 text-black-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                                className="border border-black-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">Todos los estados</option>
                                <option value="ACTIVE">Activos</option>
                                <option value="INACTIVE">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="text-sm text-black-600">
                            Mostrando {filteredCourses.length} de {courses.length} cursos
                        </div>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-black-500">
                                {courses.length === 0 ? 'No hay cursos registrados' : 'No se encontraron cursos con los filtros aplicados'}
                            </div>
                        </div>
                    ) : (
                        <CourseTable 
                            courses={filteredCourses} 
                            onEdit={handleEdit}
                        />
                    )}

                    {showForm && (
                        <CourseForm
                            course={editingCourse}
                            onClose={handleCloseForm}
                        />
                    )}
                </div>
            </ProtectedRoute>
        </ClientOnlyWrapper>
    );
}