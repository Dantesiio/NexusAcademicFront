import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Grade {
    id: string;
    subject: string;
    grade: string;
}

export interface Enrollment {
    id: string;
    courseId: string;
    enrolledAt: string;
    score?: number;
}

export interface Student {
    id: string;
    name: string;
    age: number;
    email: string;
    gender: string;
    nickname: string;
    subjects?: string[];
    grades?: Grade[];
    enrollments?: Enrollment[];
}

export interface StudentState {
    students: Student[];
    currentStudent: Student | null;
    loading: boolean;
    error: string | null;
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
}

const initialState: StudentState = {
    students: [],
    currentStudent: null,
    loading: false,
    error: null,
    pagination: {
        limit: 10,
        offset: 0,
        total: 0
    }
};

export const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        startFetchingStudents: (state) => {
            state.loading = true;
            state.error = null;
        },
        setStudentsData: (state, action: PayloadAction<Student[]>) => {
            state.loading = false;
            state.students = action.payload;
        },
        setCurrentStudent: (state, action: PayloadAction<Student>) => {
            state.currentStudent = action.payload;
        },
        addStudent: (state, action: PayloadAction<Student>) => {
            state.students.push(action.payload);
        },
        updateStudent: (state, action: PayloadAction<Student>) => {
            const index = state.students.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.students[index] = action.payload;
            }
        },
        removeStudent: (state, action: PayloadAction<string>) => {
            state.students = state.students.filter(s => s.id !== action.payload);
        },
        setPagination: (state, action: PayloadAction<{limit: number, offset: number, total: number}>) => {
            state.pagination = action.payload;
        },
        fetchingDataFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    startFetchingStudents,
    setStudentsData,
    setCurrentStudent,
    addStudent,
    updateStudent,
    removeStudent,
    setPagination,
    fetchingDataFailure
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;