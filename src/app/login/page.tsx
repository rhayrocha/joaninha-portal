"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/shared/Logo';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-joaninha-cream bg-pattern p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-elevated p-8 sm:p-10 relative overflow-hidden animate-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-joaninha-red to-joaninha-bordeaux"></div>
        
        <div className="flex justify-center mb-8">
          <Logo className="w-32 h-auto" />
        </div>
        
        <h1 className="text-2xl font-display font-bold text-center text-joaninha-black mb-2">
          Bem-vindo ao Portal
        </h1>
        <p className="text-center text-joaninha-gray-500 mb-6 text-sm">
          Acesse as informações do seu filho(a)
        </p>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-joaninha-black mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-joaninha-black" htmlFor="password">
                Senha
              </label>
              <span className="text-xs text-joaninha-gray-400">
                Acesso seguro Supabase
              </span>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-joaninha-gray-400 hover:text-joaninha-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 flex items-center justify-center mt-2 font-semibold shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Portal"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-joaninha-gray-400">
          Dúvidas no acesso? Entre em contato com a secretaria da escola.
        </div>
      </div>
    </div>
  );
}
