"use client";

import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({ title, subtitle, onMenuClick }: AdminHeaderProps) {
  const { admin } = useAdminAuth();
  
  return (
    <header className="bg-joaninha-red md:bg-white text-white md:text-joaninha-black border-b border-joaninha-red-dark/40 md:border-gray-100 shadow-card sticky top-0 z-30 min-h-[4.5rem] py-3.5 flex items-center px-4 md:px-8 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:pt-3.5 transition-colors">
      {onMenuClick && (
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-3.5 p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-lg md:text-2xl font-display font-bold text-white md:text-joaninha-black truncate leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-white/80 md:text-gray-500 truncate hidden sm:block mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4 ml-3">
        <button 
          className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 md:text-gray-400 md:hover:text-joaninha-black md:hover:bg-gray-100 transition-colors rounded-full"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-joaninha-cream md:bg-joaninha-red rounded-full border-2 border-joaninha-red md:border-white"></span>
        </button>

        <div className="hidden sm:block h-7 w-px bg-white/20 md:bg-gray-200"></div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-joaninha-black">{admin?.name || 'Administrador'}</span>
            <span className="text-xs text-gray-400">Diretoria</span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/40 md:border-white shadow-sm overflow-hidden bg-white/20 md:bg-gray-100 flex items-center justify-center text-white md:text-gray-500 font-bold">
            {admin?.avatarUrl ? (
              <img src={admin.avatarUrl} alt={admin.name} className="w-full h-full object-cover" />
            ) : (
              <span>{admin?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
