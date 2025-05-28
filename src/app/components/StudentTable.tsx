'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { AppDispatch } from '../store';
import { deleteStudent } from '../store/actions/studentActions';
import { Student } from '../store/slices/studentSlice';
import { IoEyeOutline, IoPencilOutline, IoTrashBinOutline } from "react-icons/io5";
import { StudentModal } from './StudentModal';

interface Props {
    students: Student[];
    onEdit: (student: Student) => void;
}

export const StudentTable = ({ students, onEdit }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            await dispatch(deleteStudent(id));
        }
    };

    const handleView = (student: Student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    return (
        <>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-black-200">
                        <thead className="bg-black-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Estudiante
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Edad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Género
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Nickname
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Matrículas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-black-200">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-black-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image 
                                                className="h-10 w-10 rounded-full" 
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                alt="Student avatar"
                                                width={40}
                                                height={40}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-black-900">
                                                    {student.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-900">
                                        {student.age}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-900">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-900">
                                        {student.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-900">
                                        {student.nickname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-900">
                                        {student.enrollments ? student.enrollments.length : 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(student)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <IoEyeOutline className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(student)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                                <IoPencilOutline className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <IoTrashBinOutline className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </>
    );
};