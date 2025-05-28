'use client'
import Image from 'next/image';
import { Student } from '../store/slices/studentSlice';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    student: Student;
    onClose: () => void;
}

export const StudentModal = ({ student, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-black-900">
                        Detalles del Estudiante
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-black-400 hover:text-black-600"
                    >
                        <IoCloseOutline className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Image 
                            className="h-16 w-16 rounded-full" 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt="Student avatar"
                            width={64}
                            height={64}
                        />
                        <div>
                            <h4 className="text-xl font-semibold text-black-900">{student.name}</h4>
                            <p className="text-black-500">@{student.nickname}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black-700">Edad</label>
                            <p className="text-sm text-black-900">{student.age} años</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black-700">Género</label>
                            <p className="text-sm text-black-900">{student.gender}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black-700">Email</label>
                        <p className="text-sm text-black-900">{student.email}</p>
                    </div>

                    {student.enrollments && student.enrollments.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-black-700 mb-2">
                                Matrículas ({student.enrollments.length})
                            </label>
                            <div className="space-y-2">
                                {student.enrollments.map((enrollment, index) => (
                                    <div key={index} className="bg-black-50 p-3 rounded-md">
                                        <p className="text-sm font-medium">Curso ID: {enrollment.courseId}</p>
                                        <p className="text-xs text-black-500">
                                            Matriculado: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </p>
                                        {enrollment.score && (
                                            <p className="text-xs text-green-600">
                                                Puntuación: {enrollment.score}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {student.grades && student.grades.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-black-700 mb-2">
                                Calificaciones
                            </label>
                            <div className="space-y-2">
                                {student.grades.map((grade) => (
                                    <div key={grade.id} className="bg-blue-50 p-3 rounded-md">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">{grade.subject}</span>
                                            <span className="text-sm text-blue-600">{grade.grade}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};