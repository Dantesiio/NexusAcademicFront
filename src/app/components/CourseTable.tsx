'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { deleteCourse } from '../store/actions/courseActions';
import { Course } from '../store/slices/courseSlice';
import { IoEyeOutline, IoPencilOutline, IoTrashBinOutline, IoCalendarOutline } from "react-icons/io5";
import { CourseModal } from './CourseModal';

interface Props {
    courses: Course[];
    onEdit: (course: Course) => void;
}

export const CourseTable = ({ courses, onEdit }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
            await dispatch(deleteCourse(id));
        }
    };

    const handleView = (course: Course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-black-900 truncate">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-black-500 font-mono">
                                        {course.code}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    course.status === 'ACTIVE' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-black-100 text-black-800'
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                            
                            <p className="mt-2 text-sm text-black-600 line-clamp-2">
                                {course.description}
                            </p>
                            
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-black-500">
                                    <IoCalendarOutline className="h-4 w-4 mr-1" />
                                    {formatDate(course.startDate)} - {formatDate(course.endDate)}
                                </div>
                                <div className="mt-1 text-sm text-black-600">
                                    <span className="font-medium">Profesor:</span> {course.teacher.fullName}
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleView(course)}
                                    className="inline-flex items-center px-3 py-1.5 border border-black-300 shadow-sm text-xs font-medium rounded text-black-700 bg-white hover:bg-black-50"
                                >
                                    <IoEyeOutline className="h-4 w-4 mr-1" />
                                    Ver
                                </button>
                                <button
                                    onClick={() => onEdit(course)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-yellow-500 hover:bg-yellow-600"
                                >
                                    <IoPencilOutline className="h-4 w-4 mr-1" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                >
                                    <IoTrashBinOutline className="h-4 w-4 mr-1" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedCourse && (
                <CourseModal
                    course={selectedCourse}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedCourse(null);
                    }}
                />
            )}
        </>
    );
};