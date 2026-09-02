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
    <header className="bg-white border-b border-gray-100 shadow-card sticky top-0 z-30 h-20 flex items-center px-4 md:px-8">
      {onMenuClick && (
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-display font-bold text-joaninha-black truncate">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 truncate hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-gray-400 hover:text-joaninha-black transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-joaninha-red rounded-full border-2 border-white"></span>
        </button>

        <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-joaninha-black">{admin?.name || 'Administrador'}</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
            {admin?.avatarUrl ? (
              <img src={admin.avatarUrl} alt={admin.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 font-bold">{admin?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
