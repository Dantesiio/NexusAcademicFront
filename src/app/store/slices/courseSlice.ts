import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Teacher {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
}

export interface Course {
    id: string;
    name: string;
    description: string;
    code: string;
    teacher: Teacher;
    status: 'ACTIVE' | 'INACTIVE';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CourseState {
    courses: Course[];
    currentCourse: Course | null;
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null
};

export const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        startFetchingCourses: (state) => {
            state.loading = true;
            state.error = null;
        },
        setCoursesData: (state, action: PayloadAction<Course[]>) => {
            state.loading = false;
            state.courses = action.payload;
        },
        setCurrentCourse: (state, action: PayloadAction<Course>) => {
            state.currentCourse = action.payload;
        },
        addCourse: (state, action: PayloadAction<Course>) => {
            state.courses.push(action.payload);
        },
        updateCourse: (state, action: PayloadAction<Course>) => {
            const index = state.courses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
        },
        removeCourse: (state, action: PayloadAction<string>) => {
            state.courses = state.courses.filter(c => c.id !== action.payload);
        },
        fetchingCoursesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    startFetchingCourses,
    setCoursesData,
    setCurrentCourse,
    addCourse,
    updateCourse,
    removeCourse,
    fetchingCoursesFailure
} = courseSlice.actions;

export const courseReducer = courseSlice.reducer;