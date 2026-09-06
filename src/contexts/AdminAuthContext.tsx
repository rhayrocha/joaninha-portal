"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AdminUser } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const loadAdminProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && (profile.role === 'admin' || profile.role === 'coordinator')) {
        setAdmin({
          id: userId,
          name: profile.full_name || 'Coordenação Joaninha',
          email: profile.email || email,
          role: profile.role,
          avatarUrl: profile.avatar_url,
        });
      } else {
        setAdmin(null);
      }
    } catch (err) {
      console.error('[AdminAuthContext] Erro ao carregar perfil admin:', err);
    }
  }, [supabase]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadAdminProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('[AdminAuthContext] Erro ao restaurar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadAdminProfile(session.user.id, session.user.email || '');
      } else {
        setAdmin(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadAdminProfile]);

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
        .select('role, full_name, avatar_url')
        .eq('id', data.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'coordinator')) {
        await supabase.auth.signOut();
        throw new Error('Acesso negado: Este usuário não possui privilégios de administração.');
      }

      setAdmin({
        id: data.user.id,
        name: profile.full_name || 'Coordenação Joaninha',
        email: data.user.email || email,
        role: profile.role,
        avatarUrl: profile.avatar_url,
      });

      return true;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  }, [supabase]);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
