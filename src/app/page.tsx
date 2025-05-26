'use client'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from './store';
import { checkAuthStatus } from './store/actions/authActions';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuthStatus());
    } else {
      router.push('/auth/login');
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard/main');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}