'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getStudents } from '../../store/actions/studentActions';
import { Student } from '../../store/slices/studentSlice';
import { StudentTable } from '../../components/StudentTable';
import { StudentForm } from '../../components/StudentForm';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { ClientOnlyWrapper } from '../../components/ClientOnlyWrapper';
import { IoAddOutline, IoSearchOutline } from 'react-icons/io5';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default function StudentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { students, loading, error } = useSelector((state: RootState) => state.students);
    
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    useEffect(() => {
        dispatch(getStudents({ limit: 50, offset: 0 }));
    }, [dispatch]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredStudents(
                students.filter(student =>
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredStudents(students);
        }
    }, [students, searchTerm]);

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingStudent(undefined);
    };

    if (loading && students.length === 0) {
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
                                <h1 className="text-2xl font-bold text-black-900">Gestión de Estudiantes</h1>
                                <p className="text-black-600">Administra los estudiantes del sistema</p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <IoAddOutline className="h-5 w-5 mr-2" />
                                Nuevo Estudiante
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoSearchOutline className="h-5 w-5 text-black-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar estudiantes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-black-300 rounded-md leading-5 bg-white placeholder-black-500 focus:outline-none focus:placeholder-black-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <StudentTable 
                        students={filteredStudents} 
                        onEdit={handleEdit}
                    />

                    {showForm && (
                        <StudentForm
                            student={editingStudent}
                            onClose={handleCloseForm}
                        />
                    )}
                </div>
            </ProtectedRoute>
        </ClientOnlyWrapper>
    );
}