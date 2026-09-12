"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, Child } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  children: Child[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateAvatar: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children: childrenProp }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Carrega os dados do responsável e de seus dependentes do Supabase
  const loadUserData = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: students } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', userId);

      const calculateAge = (birthDateStr?: string) => {
        if (!birthDateStr) return 3;
        const b = new Date(birthDateStr);
        const diff = Date.now() - b.getTime();
        return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
      };

      const mappedUser: User = {
        id: userId,
        name: profile?.full_name || email.split('@')[0] || 'Responsável',
        email: profile?.email || email,
        phone: profile?.phone || '',
        cpf: profile?.cpf || '',
        rg: (profile as any)?.rg || '',
        address: {
          street: (profile as any)?.address_street || '',
          number: (profile as any)?.address_number || '',
          neighborhood: (profile as any)?.address_neighborhood || '',
          city: (profile as any)?.address_city || 'São Paulo',
          state: (profile as any)?.address_state || 'SP',
          zipCode: (profile as any)?.address_zip || '',
        },
        avatarUrl: profile?.avatar_url,
      };

      const mappedChildren: Child[] = (students && students.length > 0)
        ? students.map((s: any) => ({
            id: s.id,
            name: s.full_name,
            birthDate: s.birth_date,
            age: calculateAge(s.birth_date),
            className: s.class_name || 'Maternal I',
            shift: s.shift === 'integral' ? 'Integral' : s.shift === 'matutino' ? 'Manhã' : 'Tarde',
            parentId: s.parent_id,
            enrollmentDate: s.created_at || new Date().toISOString(),
            photoUrl: s.avatar_url,
          }))
        : [];

      setUser(mappedUser);
      setChildren(mappedChildren);
    } catch (err) {
      console.error('[AuthContext] Erro ao carregar dados do usuário:', err);
    }
  }, [supabase]);

  // Restaura a sessão real do Supabase ao carregar a página
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserData(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('[AuthContext] Erro ao restaurar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setChildren([]);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadUserData]);

  // Login real contra o Supabase Auth
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

      // Valida se o perfil é de responsável
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile && profile.role !== 'parent') {
        await supabase.auth.signOut();
        if (profile.role === 'teacher') {
          throw new Error('Acesso de Professora detectado. Por favor, acesse pelo Portal do Professor (/professor/login).');
        }
        throw new Error('Este login é restrito aos responsáveis. Acesse pelo Portal Administrativo (/admin).');
      }

      await loadUserData(data.user.id, data.user.email || email);
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, loadUserData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChildren([]);
  }, [supabase]);

  const updateAvatar = useCallback((url: string) => {
    setUser(prev => prev ? { ...prev, avatarUrl: url } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        children,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateAvatar,
      }}
    >
      {childrenProp}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
