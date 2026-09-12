"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { TeacherUser } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface TeacherAuthContextType {
  teacher: TeacherUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export function TeacherAuthProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const loadTeacherProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && profile.role === 'teacher') {
        // Busca as turmas atribuídas
        let classes: string[] = profile.full_name?.toLowerCase().includes('luciana')
          ? ['Berçário']
          : ['Maternal I', 'Maternal II'];
        try {
          const { data: classRows } = await supabase
            .from('teacher_classes')
            .select('class_name')
            .eq('teacher_id', userId);

          if (classRows && classRows.length > 0) {
            classes = classRows.map(r => r.class_name);
          }
        } catch {}

        setTeacher({
          id: userId,
          name: profile.full_name || 'Professora',
          email: profile.email || email,
          phone: profile.phone || '',
          role: 'teacher',
          classes,
          avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
          createdAt: profile.created_at,
        });
      } else {
        setTeacher(null);
      }
    } catch (err) {
      console.error('[TeacherAuthContext] Erro ao carregar perfil do professor:', err);
    }
  }, [supabase]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadTeacherProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('[TeacherAuthContext] Erro ao restaurar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadTeacherProfile(session.user.id, session.user.email || '');
      } else {
        setTeacher(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadTeacherProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos.' 
          : error.message);
      }

      if (!data.user) {
        throw new Error('Falha ao autenticar.');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role !== 'teacher') {
        await supabase.auth.signOut();
        throw new Error('Acesso negado: Este usuário não possui perfil de professor(a).');
      }

      await loadTeacherProfile(data.user.id, data.user.email || email);
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, loadTeacherProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setTeacher(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (teacher?.id) {
      await loadTeacherProfile(teacher.id, teacher.email);
    }
  }, [teacher, loadTeacherProfile]);

  return (
    <TeacherAuthContext.Provider value={{ teacher, isAuthenticated: !!teacher, isLoading, login, logout, refreshProfile }}>
      {children}
    </TeacherAuthContext.Provider>
  );
}

export function useTeacherAuth() {
  const context = useContext(TeacherAuthContext);
  if (context === undefined) {
    throw new Error("useTeacherAuth must be used within a TeacherAuthProvider");
  }
  return context;
}
