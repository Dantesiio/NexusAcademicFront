// src/app/store/slices/submissionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipos simplificados para la API
export interface SubmissionCourse {
    id: string;
    name: string;
    code: string;
}

export interface SubmissionStudent {
    id: string;
    name: string;
}

// Interface principal de Submission (lo que usa la aplicación)
export interface Submission {
    id: string;
    course: SubmissionCourse;
    student: SubmissionStudent;
    fileUrl: string;
    comments: string;
    grade: number | null;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubmissionState {
    submissions: Submission[];
    currentSubmission: Submission | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubmissionState = {
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null
};

export const submissionSlice = createSlice({
    name: "submissions",
    initialState,
    reducers: {
        startFetchingSubmissions: (state) => {
            state.loading = true;
            state.error = null;
        },
        setSubmissionsData: (state, action: PayloadAction<Submission[]>) => {
            state.loading = false;
            state.submissions = action.payload;
        },
        setCurrentSubmission: (state, action: PayloadAction<Submission>) => {
            state.loading = false;
            state.currentSubmission = action.payload;
        },
        addSubmission: (state, action: PayloadAction<Submission>) => {
            state.loading = false;
            state.submissions.push(action.payload);
        },
        updateSubmission: (state, action: PayloadAction<Submission>) => {
            state.loading = false;
            const index = state.submissions.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.submissions[index] = action.payload;
            }
        },
        removeSubmission: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.submissions = state.submissions.filter(s => s.id !== action.payload);
        },
        fetchingSubmissionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    startFetchingSubmissions,
    setSubmissionsData,
    setCurrentSubmission,
    addSubmission,
    updateSubmission,
    removeSubmission,
    fetchingSubmissionsFailure
} = submissionSlice.actions;

export const submissionReducer = submissionSlice.reducer;