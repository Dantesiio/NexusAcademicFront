import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "./courseSlice";
import { Student } from "./studentSlice";

export interface Submission {
    id: string;
    course: Course;
    student: Student;
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
            state.currentSubmission = action.payload;
        },
        addSubmission: (state, action: PayloadAction<Submission>) => {
            state.submissions.push(action.payload);
        },
        updateSubmission: (state, action: PayloadAction<Submission>) => {
            const index = state.submissions.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.submissions[index] = action.payload;
            }
        },
        removeSubmission: (state, action: PayloadAction<string>) => {
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