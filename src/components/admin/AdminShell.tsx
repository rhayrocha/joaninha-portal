"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

interface AdminShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-joaninha-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-joaninha-bordeaux"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-joaninha-off-white overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-sm bg-gradient-to-b from-joaninha-bordeaux to-joaninha-black flex-1 flex flex-col shadow-2xl transform transition-transform animate-slide-in-right">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-full overflow-y-auto">
               <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setMobileMenuOpen(true)} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 custom-scrollbar relative">
          <div className="absolute inset-0 bg-pattern opacity-30 pointer-events-none"></div>
          <div className="container mx-auto px-4 py-8 md:px-8 max-w-7xl relative z-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
