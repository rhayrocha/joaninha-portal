"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileCheck, Users, Receipt, LogOut } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
      "text-white hover:bg-white/10",
      isActive && "bg-white/20 font-semibold"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/documentos', icon: FileCheck, label: 'Documentos' },
    { href: '/admin/alunos', icon: Users, label: 'Alunos' },
    { href: '/admin/pagamentos', icon: Receipt, label: 'Pagamentos' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-joaninha-bordeaux to-joaninha-black flex flex-col h-screen fixed md:relative z-40 shadow-xl overflow-y-auto hidden md:flex">
      <div className="p-6 flex flex-col items-center border-b border-white/10">
        <Logo whiteText className="scale-90 transform origin-top" />
        <span className="mt-2 text-[10px] font-bold tracking-wider text-joaninha-bordeaux bg-white px-2 py-0.5 rounded-full uppercase shadow-sm">
          Admin
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname?.startsWith(item.href) || false}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0 flex items-center justify-center text-white font-bold">
            {admin?.avatarUrl ? (
              <img src={admin.avatarUrl} alt={admin.name} className="w-full h-full object-cover" />
            ) : (
              admin?.name?.charAt(0) || 'A'
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-medium text-sm truncate">{admin?.name || 'Administrador'}</span>
            <span className="text-white/60 text-xs truncate">Diretoria</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 w-full p-2 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do painel</span>
        </button>
      </div>
    </aside>
  );
}
