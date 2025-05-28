'use client'
import { Course } from '../store/slices/courseSlice';
import { IoCloseOutline, IoCalendarOutline, IoPersonOutline, IoCodeOutline } from 'react-icons/io5';

interface Props {
    course: Course;
    onClose: () => void;
}

export const CourseModal = ({ course, onClose }: Props) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black-900">
                        Detalles del Curso
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-black-400 hover:text-black-600"
                    >
                        <IoCloseOutline className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-2xl font-bold">{course.name}</h4>
                                <div className="flex items-center mt-2">
                                    <IoCodeOutline className="h-5 w-5 mr-2" />
                                    <span className="text-lg font-mono">{course.code}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                course.status === 'ACTIVE' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-black-500 text-white'
                            }`}>
                                {course.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-lg font-semibold text-black-900 mb-3">Descripción</h5>
                        <p className="text-black-700 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <IoPersonOutline className="h-5 w-5 text-black-600 mr-2" />
                                <h6 className="font-semibold text-black-900">Profesor</h6>
                            </div>
                            <p className="text-black-700">{course.teacher.fullName}</p>
                            <p className="text-sm text-black-500">{course.teacher.email}</p>
                        </div>

                        <div className="bg-black-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <IoCalendarOutline className="h-5 w-5 text-black-600 mr-2" />
                                <h6 className="font-semibold text-black-900">Duración</h6>
                            </div>
                            <p className="text-sm text-black-700">
                                <span className="font-medium">Inicio:</span> {formatDate(course.startDate)}
                            </p>
                            <p className="text-sm text-black-700">
                                <span className="font-medium">Fin:</span> {formatDate(course.endDate)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h6 className="font-semibold text-blue-900 mb-2">Información Adicional</h6>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700 font-medium">Creado:</span>
                                <p className="text-blue-600">{formatDate(course.createdAt)}</p>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Actualizado:</span>
                                <p className="text-blue-600">{formatDate(course.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black-600 text-white rounded-md hover:bg-black-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};