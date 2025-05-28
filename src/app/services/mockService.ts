// src/app/services/mockService.ts
// Servicio temporal para desarrollo cuando el backend no esté disponible

export const mockService = {
    // Mock data
    mockUser: {
        id: '1',
        email: 'admin@nexusacademic.com',
        fullName: 'Administrador',
        roles: ['admin', 'teacher'],
        isActive: true
    },

    mockCourses: [
        {
            id: '1',
            name: 'Programación Avanzada',
            description: 'Curso de programación con conceptos avanzados',
            code: 'PRG-301',
            teacher: {
                id: '1',
                email: 'admin@nexusacademic.com',
                fullName: 'Administrador',
                roles: ['admin', 'teacher']
            },
            status: 'ACTIVE' as const,
            startDate: '2024-01-15T00:00:00.000Z',
            endDate: '2024-06-15T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: '2',
            name: 'Base de Datos',
            description: 'Fundamentos de bases de datos relacionales',
            code: 'BD-201',
            teacher: {
                id: '1',
                email: 'admin@nexusacademic.com',
                fullName: 'Administrador',
                roles: ['admin', 'teacher']
            },
            status: 'ACTIVE' as const,
            startDate: '2024-02-01T00:00:00.000Z',
            endDate: '2024-07-01T00:00:00.000Z',
            createdAt: '2024-01-15T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z'
        }
    ],

    mockStudents: [
        {
            id: '1',
            name: 'Juan Pérez',
            age: 20,
            email: 'juan.perez@student.com',
            gender: 'Male',
            nickname: 'juanito',
            enrollments: [
                {
                    id: '1',
                    courseId: '1',
                    enrolledAt: '2024-01-20T00:00:00.000Z',
                    score: 85
                }
            ]
        },
        {
            id: '2',
            name: 'María González',
            age: 19,
            email: 'maria.gonzalez@student.com',
            gender: 'Female',
            nickname: 'mari',
            enrollments: [
                {
                    id: '2',
                    courseId: '2',
                    enrolledAt: '2024-02-05T00:00:00.000Z',
                    score: 92
                }
            ]
        }
    ],

    mockSubmissions: [
        {
            id: '1',
            course: {
                id: '1',
                name: 'Programación Avanzada',
                code: 'PRG-301'
            },
            student: {
                id: '1',
                name: 'Juan Pérez'
            },
            fileUrl: 'https://example.com/file1.pdf',
            comments: 'Entrega del proyecto final',
            grade: null,
            submittedAt: '2024-03-15T10:30:00.000Z',
            createdAt: '2024-03-15T10:30:00.000Z',
            updatedAt: '2024-03-15T10:30:00.000Z'
        },
        {
            id: '2',
            course: {
                id: '2',
                name: 'Base de Datos',
                code: 'BD-201'
            },
            student: {
                id: '2',
                name: 'María González'
            },
            fileUrl: 'https://example.com/file2.pdf',
            comments: 'Tarea de normalización',
            grade: 4.5,
            submittedAt: '2024-03-10T14:20:00.000Z',
            createdAt: '2024-03-10T14:20:00.000Z',
            updatedAt: '2024-03-12T09:15:00.000Z'
        }
    ],

    // Utility functions
    delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

    generateId: () => Math.random().toString(36).substr(2, 9),

    // Auth methods
    async login(email: string, password: string) {
        await this.delay();
        if (email === 'admin@nexusacademic.com' && password === 'admin123') {
            return {
                ...this.mockUser,
                token: 'mock_token_' + this.generateId()
            };
        }
        throw new Error('Credenciales inválidas');
    },

    async register(email: string, password: string, fullName: string) {
        await this.delay();
        return {
            id: this.generateId(),
            email,
            fullName,
            roles: ['student'],
            isActive: true,
            token: 'mock_token_' + this.generateId()
        };
    },

    async checkStatus() {
        await this.delay();
        const token = localStorage.getItem('token');
        if (token && token.startsWith('mock_token_')) {
            return {
                ...this.mockUser,
                token
            };
        }
        throw new Error('Token inválido');
    },

    // Course methods
    async getCourses() {
        await this.delay();
        return [...this.mockCourses];
    },

    async createCourse(data: any) {
        await this.delay();
        const newCourse = {
            id: this.generateId(),
            ...data,
            teacher: this.mockUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.mockCourses.push(newCourse);
        return newCourse;
    },

    async updateCourse(id: string, data: any) {
        await this.delay();
        const index = this.mockCourses.findIndex(c => c.id === id);
        if (index !== -1) {
            this.mockCourses[index] = {
                ...this.mockCourses[index],
                ...data,
                updatedAt: new Date().toISOString()
            };
            return this.mockCourses[index];
        }
        throw new Error('Curso no encontrado');
    },

    async deleteCourse(id: string) {
        await this.delay();
        const index = this.mockCourses.findIndex(c => c.id === id);
        if (index !== -1) {
            this.mockCourses.splice(index, 1);
            return;
        }
        throw new Error('Curso no encontrado');
    },

    // Student methods
    async getStudents() {
        await this.delay();
        return [...this.mockStudents];
    },

    async createStudent(data: any) {
        await this.delay();
        const newStudent = {
            id: this.generateId(),
            ...data,
            enrollments: data.enrollments || []
        };
        this.mockStudents.push(newStudent);
        return newStudent;
    },

    async updateStudent(id: string, data: any) {
        await this.delay();
        const index = this.mockStudents.findIndex(s => s.id === id);
        if (index !== -1) {
            this.mockStudents[index] = {
                ...this.mockStudents[index],
                ...data
            };
            return this.mockStudents[index];
        }
        throw new Error('Estudiante no encontrado');
    },

    async deleteStudent(id: string) {
        await this.delay();
        const index = this.mockStudents.findIndex(s => s.id === id);
        if (index !== -1) {
            this.mockStudents.splice(index, 1);
            return;
        }
        throw new Error('Estudiante no encontrado');
    },

    // Submission methods
    async getSubmissions() {
        await this.delay();
        return [...this.mockSubmissions];
    },

    async gradeSubmission(id: string, gradeData: any) {
        await this.delay();
        const index = this.mockSubmissions.findIndex(s => s.id === id);
        if (index !== -1) {
            this.mockSubmissions[index] = {
                ...this.mockSubmissions[index],
                grade: gradeData.grade,
                comments: gradeData.comments || this.mockSubmissions[index].comments,
                updatedAt: new Date().toISOString()
            };
            return this.mockSubmissions[index];
        }
        throw new Error('Entrega no encontrada');
    }
};