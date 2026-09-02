"use client";

import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4 lg:py-5">
        
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-joaninha-black rounded-lg hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold font-display text-joaninha-black">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <button className="relative p-2 text-gray-400 hover:text-joaninha-black transition-colors rounded-full hover:bg-gray-50">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-joaninha-red border-2 border-white rounded-full"></span>
          </button>
          
          <Link href="/perfil" className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-joaninha-black">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'email@exemplo.com'}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-joaninha-cream text-joaninha-red flex items-center justify-center font-bold font-display shadow-soft ring-2 ring-white border border-gray-100">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
          </Link>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg p-4 animate-in">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/documentos" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Documentos</Link>
            <Link href="/mensalidades" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Mensalidades</Link>
            <Link href="/perfil" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
