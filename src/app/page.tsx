'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, ir al dashboard
      router.push('/dashboard/main');
    } else {
      // Si no hay token, ir al login
      router.push('/auth/login');
    }
  }, [router, isClient]);

  return (
    <div className="min-h-screen bg-black-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-black-600">Cargando...</p>
      </div>
    </div>
  );
}