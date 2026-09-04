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
    <header className="bg-joaninha-red lg:bg-white text-white lg:text-joaninha-black border-b border-joaninha-red-dark/40 lg:border-gray-100 shadow-sm sticky top-0 z-30 pt-[env(safe-area-inset-top)] transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 lg:py-5">
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-white lg:text-joaninha-black leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-white/80 lg:text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <button 
            className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 lg:text-gray-400 lg:hover:text-joaninha-black lg:hover:bg-gray-50 transition-colors rounded-full"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-joaninha-cream lg:bg-joaninha-red border-2 border-joaninha-red lg:border-white rounded-full"></span>
          </button>
          
          <Link href="/perfil" className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-white lg:text-joaninha-black leading-tight">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-white/80 lg:text-gray-500">{user?.email || 'email@exemplo.com'}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-joaninha-cream text-joaninha-red flex items-center justify-center font-bold font-display shadow-soft ring-2 ring-white/40 lg:ring-white border border-white/20 lg:border-gray-100">
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
        <div className="lg:hidden border-t border-joaninha-red-dark/30 bg-white text-stone-900 absolute w-full shadow-2xl p-4 animate-in z-40">
          <nav className="flex flex-col gap-1.5">
            <Link 
              href="/dashboard" 
              className="px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-between" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Dashboard</span>
              <span className="text-xs text-stone-600 font-normal">Início</span>
            </Link>
            <Link 
              href="/documentos" 
              className="px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-between" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Documentos</span>
              <span className="text-xs text-stone-600 font-normal">Matrícula & Aluno</span>
            </Link>
            <Link 
              href="/mensalidades" 
              className="px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-between" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Mensalidades</span>
              <span className="text-xs text-stone-600 font-normal">Faturas & PIX</span>
            </Link>
            <Link 
              href="/perfil" 
              className="px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-between" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Perfil</span>
              <span className="text-xs text-stone-600 font-normal">Dados do Responsável</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
