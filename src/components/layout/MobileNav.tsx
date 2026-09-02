"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documentos', href: '/documentos', icon: FileText },
  { name: 'Mensalidades', href: '/mensalidades', icon: CreditCard },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-elevated z-40 pb-safe pb-6 pt-2 px-4">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center p-2 min-w-[64px]"
            >
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 bg-joaninha-red rounded-full" />
              )}
              <Icon 
                className={cn(
                  'w-6 h-6 mb-1 transition-colors duration-200', 
                  isActive ? 'text-joaninha-red' : 'text-gray-400'
                )} 
              />
              <span 
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-joaninha-red' : 'text-gray-500'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
