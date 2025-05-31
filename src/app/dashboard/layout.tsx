// src/app/dashboard/layout.tsx
'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { initializeAuthStatus } from '../store/actions/authActions';
import { Sidebar } from "../components/Sidebar";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ClientOnlyWrapper } from '../components/ClientOnlyWrapper';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(initializeAuthStatus());
        }
    }, [dispatch, isInitialized]);

    return (
        <ClientOnlyWrapper>
            <ProtectedRoute>
                <div className="bg-slate-100 overflow-y-scroll w-screen h-screen antialiased text-slate-300 selection:bg-blue-600 selection:text-white">
                    <div className="flex">
                        <Sidebar />
                        <div className="p-2 w-full text-slate-900">
                            {children}
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </ClientOnlyWrapper>
    );
}