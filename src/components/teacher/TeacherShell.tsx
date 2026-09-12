"use client";

import React, { type ReactNode } from "react";
import Logo from "@/components/shared/Logo";
import { useTeacherAuth } from "@/contexts/TeacherAuthContext";
import { LogOut, Sparkles, UserCheck, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface TeacherShellProps {
  children: ReactNode;
  activeTurma?: string;
}

export default function TeacherShell({ children, activeTurma }: TeacherShellProps) {
  const { teacher, logout } = useTeacherAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/professor/login");
  };

  return (
    <div className="min-h-screen bg-stone-50/70 text-joaninha-black flex flex-col font-sans selection:bg-joaninha-cream selection:text-joaninha-bordeaux">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Logo className="w-28 sm:w-32 h-auto" />
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/15 shadow-2xs">
              <UserCheck className="w-3 h-3 text-joaninha-red" />
              Diário de Classe
            </span>
          </div>

          {/* Teacher Profile & Actions */}
          <div className="flex items-center gap-3">
            {teacher && (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-joaninha-bordeaux/20 shadow-2xs shrink-0">
                  {teacher.avatarUrl ? (
                    <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-joaninha-cream text-joaninha-bordeaux font-bold flex items-center justify-center text-xs">
                      {teacher.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-joaninha-black leading-tight">{teacher.name}</p>
                  <p className="text-[10px] text-stone-500 font-medium">Educadora • {activeTurma || teacher.classes.join(', ')}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-stone-500 hover:text-joaninha-red hover:bg-red-50 border border-stone-200/70 transition-all text-xs flex items-center gap-1.5"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-600 border-t border-stone-200/60 mt-auto bg-white">
        Creche Escola Joaninha • Sistema Integrado de Presença e Vivência Escolar
      </footer>
    </div>
  );
}
