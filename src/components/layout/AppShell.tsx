"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AppShell({ children, title, subtitle, className }: AppShellProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-joaninha-off-white">
        <div className="w-12 h-12 border-4 border-joaninha-red/30 border-t-joaninha-red rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-joaninha-off-white font-sans text-joaninha-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />
        
        <main className={cn('flex-1 p-4 lg:p-8 overflow-y-auto bg-pattern pb-24 lg:pb-8', className)}>
          <div className="max-w-6xl mx-auto animate-in">
            {title && title !== 'Dashboard' && (
              <div className="lg:hidden mb-4">
                <h1 className="text-xl font-display font-bold text-joaninha-black leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
