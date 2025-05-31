// src/app/store/actions/submissionActions.ts
import { Dispatch } from 'redux';
import { submissionService, CreateSubmissionData, GradeSubmissionData } from '../../services/submissionService';
import { 
    startFetchingSubmissions, 
    setSubmissionsData, 
    setCurrentSubmission, 
    addSubmission, 
    updateSubmission, 
    removeSubmission, 
    fetchingSubmissionsFailure 
} from '../slices/submissionSlice';

export const getSubmissions = () => async (dispatch: Dispatch) => {
    dispatch(startFetchingSubmissions());
    try {
        const submissions = await submissionService.getSubmissions();
        dispatch(setSubmissionsData(submissions));
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al obtener entregas';
        dispatch(fetchingSubmissionsFailure(errorMessage));
    }
};

export const getSubmission = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingSubmissions());
    try {
        const submission = await submissionService.getSubmission(id);
        dispatch(setCurrentSubmission(submission));
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al obtener entrega';
        dispatch(fetchingSubmissionsFailure(errorMessage));
    }
};

export const createSubmission = (data: CreateSubmissionData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingSubmissions());
    try {
        const newSubmission = await submissionService.createSubmission(data);
        dispatch(addSubmission(newSubmission));
        return newSubmission;
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al crear entrega';
        dispatch(fetchingSubmissionsFailure(errorMessage));
        throw error;
    }
};

export const gradeSubmission = (id: string, data: GradeSubmissionData) => async (dispatch: Dispatch) => {
    dispatch(startFetchingSubmissions());
    try {
        const gradedSubmission = await submissionService.gradeSubmission(id, data);
        dispatch(updateSubmission(gradedSubmission));
        return gradedSubmission;
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al calificar entrega';
        dispatch(fetchingSubmissionsFailure(errorMessage));
        throw error;
    }
};

export const deleteSubmission = (id: string) => async (dispatch: Dispatch) => {
    dispatch(startFetchingSubmissions());
    try {
        await submissionService.deleteSubmission(id);
        dispatch(removeSubmission(id));
    } catch (error: any) {
        const errorMessage = error?.message || 'Error al eliminar entrega';
        dispatch(fetchingSubmissionsFailure(errorMessage));
        throw error;
    }
};