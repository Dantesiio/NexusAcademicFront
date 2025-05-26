import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authReducer } from './slices/authSlice';
import { studentReducer } from './slices/studentSlice';
import { courseReducer } from './slices/courseSlice';
import { submissionReducer } from './slices/submissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        students: studentReducer,
        courses: courseReducer,
        submissions: submissionReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;