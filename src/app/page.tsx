"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-joaninha-off-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-joaninha-red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-joaninha-black font-display font-semibold">Carregando...</p>
      </div>
    </div>
  );
}
