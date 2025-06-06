'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createCourse, updateCourseAction } from '../store/actions/courseActions';
import { Course } from '../store/slices/courseSlice';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    course?: Course;
    onClose: () => void;
}

export const CourseForm = ({ course, onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.courses);
    const { user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code: '',
        teacherId: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        startDate: '',
        endDate: ''
    });

    const [teachers] = useState([
        // Mock teachers - En producción esto vendría de una API
        { id: user?.id || '1', name: user?.fullName || 'Usuario Actual', email: user?.email || '' }
    ]);

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name,
                description: course.description,
                code: course.code,
                teacherId: course.teacher.id, // Asegúrate que course.teacher exista si course existe
                status: course.status,
                startDate: course.startDate.split('T')[0],
                endDate: course.endDate.split('T')[0]
            });
        } else {
            // Set default teacher ID for new courses
            setFormData(prev => {
                const newTeacherId = user?.id || '';
                if (prev.teacherId === newTeacherId) {
                    return prev; // No hay cambio necesario, retorna el estado previo
                }
                return {
                    ...prev,
                    teacherId: newTeacherId
                };
            });
        }
    }, [course, user]); // Las dependencias están correctas

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }

        const submitData = {
            ...formData,
            teacherId: formData.teacherId || user?.id || '' // Asegura que teacherId tenga un valor
        };

        try {
            if (course) {
                await dispatch(updateCourseAction(course.id, submitData));
            } else {
                await dispatch(createCourse(submitData));
            }
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Considera mostrar un mensaje de error al usuario aquí
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-black-900">
                        {course ? 'Editar Curso' : 'Nuevo Curso'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-black-400 hover:text-black-600"
                        aria-label="Cerrar formulario" // ⭐ Buena práctica para accesibilidad
                    >
                        <IoCloseOutline className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="courseName" className="block text-sm font-medium text-black-700"> {/* ⭐ htmlFor */}
                                Nombre del Curso
                            </label>
                            <input
                                id="courseName" // ⭐ id
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Ej: Programación Avanzada"
                            />
                        </div>
                        <div>
                            <label htmlFor="courseCode" className="block text-sm font-medium text-black-700"> {/* ⭐ htmlFor */}
                                Código del Curso
                            </label>
                            <input
                                id="courseCode" // ⭐ id
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Ej: PRG-301"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="courseDescription" className="block text-sm font-medium text-black-700"> {/* ⭐ htmlFor */}
                            Descripción
                        </label>
                        <textarea
                            id="courseDescription" // ⭐ id
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Describe el contenido y objetivos del curso..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="courseStatus" className="block text-sm font-medium text-black-700"> {/* ⭐ htmlFor */}
                                Estado
                            </label>
                            <select
                                id="courseStatus" // ⭐ id
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="courseTeacher" className="block text-sm font-medium text-black-700"> {/* ⭐ htmlFor */}
                                Profesor
                            </label>
                            <select
                                id="courseTeacher" // ⭐ id
                                name="teacherId"
                                value={formData.teacherId}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Seleccionar profesor</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-black-700"> {/* ⭐ CORREGIDO: htmlFor */}
                                Fecha de Inicio
                            </label>
                            <input
                                id="startDate" // ⭐ CORREGIDO: id
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-black-700"> {/* ⭐ CORREGIDO: htmlFor */}
                                Fecha de Fin
                            </label>
                            <input
                                id="endDate" // ⭐ CORREGIDO: id
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black-300 rounded-md shadow-sm text-sm font-medium text-black-700 bg-white hover:bg-black-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : (course ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};