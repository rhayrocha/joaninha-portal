"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Logo from '@/components/shared/Logo';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(email, password);
      router.replace('/admin/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-joaninha-off-white">
        <Loader2 className="h-10 w-10 animate-spin text-joaninha-bordeaux" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-joaninha-bordeaux to-joaninha-black p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-slide-up">
        <div className="mb-6 flex flex-col items-center">
          <Logo />
          <span className="mt-2 inline-flex items-center rounded-full bg-joaninha-gray-100 px-3 py-1 text-xs font-medium text-joaninha-gray-800">
            Painel Administrativo
          </span>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-joaninha-gray-700">Email Corporativo</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-joaninha-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 w-full rounded-xl border border-joaninha-gray-300 py-3 pr-4 outline-none focus:border-joaninha-bordeaux focus:ring-1 focus:ring-joaninha-bordeaux"
                placeholder="diretoria@joaninhacreche.com.br"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-joaninha-gray-700">Senha</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-joaninha-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 w-full rounded-xl border border-joaninha-gray-300 py-3 pr-4 outline-none focus:border-joaninha-bordeaux focus:ring-1 focus:ring-joaninha-bordeaux"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-joaninha-bordeaux px-4 py-3 font-semibold text-white transition-colors hover:bg-joaninha-black focus:outline-none focus:ring-2 focus:ring-joaninha-bordeaux focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Acessar Painel
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-joaninha-gray-400">
          Acesso restrito à diretoria e equipe pedagógica da Creche Escola Joaninha.
        </div>
      </div>
    </div>
  );
}
