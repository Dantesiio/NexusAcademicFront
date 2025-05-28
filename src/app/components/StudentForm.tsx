'use client'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createStudent, updateStudentAction } from '../store/actions/studentActions';
import { getCourses } from '../store/actions/courseActions';
import { Student } from '../store/slices/studentSlice';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    student?: Student;
    onClose: () => void;
}

export const StudentForm = ({ student, onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses } = useSelector((state: RootState) => state.courses);
    const { loading } = useSelector((state: RootState) => state.students);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        gender: 'Male',
        nickname: '',
        enrollments: [] as Array<{
            courseId: string;
            enrolledAt: string;
            score: string;
        }>
    });

    useEffect(() => {
        dispatch(getCourses());
    }, [dispatch]);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                age: student.age.toString(),
                email: student.email,
                gender: student.gender,
                nickname: student.nickname || '',
                enrollments: student.enrollments?.map(e => ({
                    courseId: e.courseId,
                    enrolledAt: e.enrolledAt,
                    score: e.score?.toString() || ''
                })) || []
            });
        }
    }, [student]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            name: formData.name,
            age: parseInt(formData.age),
            email: formData.email,
            gender: formData.gender,
            nickname: formData.nickname || undefined,
            enrollments: formData.enrollments.map(e => ({
                courseId: e.courseId,
                enrolledAt: e.enrolledAt,
                score: e.score ? parseInt(e.score) : undefined
            }))
        };

        if (student) {
            await dispatch(updateStudentAction(student.id, submitData));
        } else {
            await dispatch(createStudent(submitData));
        }
        
        if (!loading) {
            onClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addEnrollment = () => {
        setFormData(prev => ({
            ...prev,
            enrollments: [...prev.enrollments, {
                courseId: '',
                enrolledAt: new Date().toISOString().split('T')[0],
                score: ''
            }]
        }));
    };

    const removeEnrollment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            enrollments: prev.enrollments.filter((_, i) => i !== index)
        }));
    };

    const updateEnrollment = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            enrollments: prev.enrollments.map((enrollment, i) => 
                i === index ? { ...enrollment, [field]: value } : enrollment
            )
        }));
    };

    return (
        <div className="fixed inset-0 bg-black-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-black-900">
                        {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-black-400 hover:text-black-600"
                    >
                        <IoCloseOutline className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black-700">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black-700">
                                Edad
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                min="1"
                                required
                                className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black-700">
                                Género
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="Male">Masculino</option>
                                <option value="Female">Femenino</option>
                                <option value="Other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black-700">
                                Nickname (Opcional)
                            </label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-black-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-black-700">
                                Matrículas
                            </label>
                            <button
                                type="button"
                                onClick={addEnrollment}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Agregar Matrícula
                            </button>
                        </div>
                        
                        {formData.enrollments.map((enrollment, index) => (
                            <div key={index} className="mt-2 p-3 border rounded-md bg-black-50">
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <select
                                            value={enrollment.courseId}
                                            onChange={(e) => updateEnrollment(index, 'courseId', e.target.value)}
                                            className="block w-full text-xs border-black-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Seleccionar curso</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            value={enrollment.enrolledAt}
                                            onChange={(e) => updateEnrollment(index, 'enrolledAt', e.target.value)}
                                            className="block w-full text-xs border-black-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            placeholder="Puntuación"
                                            value={enrollment.score}
                                            onChange={(e) => updateEnrollment(index, 'score', e.target.value)}
                                            className="block w-full text-xs border-black-300 rounded-md shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeEnrollment(index)}
                                            className="ml-2 text-red-600 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            {loading ? 'Guardando...' : (student ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};