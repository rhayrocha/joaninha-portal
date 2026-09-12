"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherAuthProvider, useTeacherAuth } from '@/contexts/TeacherAuthContext';
import Logo from '@/components/shared/Logo';
import { Eye, EyeOff, Loader2, UserCheck, BookOpen } from 'lucide-react';

function TeacherLoginContent() {
  const router = useRouter();
  const { login, isAuthenticated } = useTeacherAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/professor');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(email, password);
      router.push('/professor');
    } catch (error: any) {
      setErrorMessage(error.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-joaninha-cream bg-pattern p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-elevated p-8 sm:p-10 relative overflow-hidden animate-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-joaninha-bordeaux via-joaninha-red to-amber-500"></div>
        
        <div className="flex justify-center mb-6">
          <Logo className="w-32 h-auto" />
        </div>
        
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/15 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-joaninha-red" />
            Portal do Educador
          </span>
          <h1 className="text-2xl font-display font-bold text-joaninha-black">
            Diário de Classe & Chamada
          </h1>
          <p className="text-joaninha-gray-500 text-xs mt-1">
            Acesso exclusivo para professoras e equipe pedagógica
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-joaninha-black mb-1" htmlFor="email">
              E-mail Institucional
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              placeholder="professora@joaninhacreche.com.br"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-joaninha-black" htmlFor="password">
                Senha de Acesso
              </label>
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
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Acessar Diário de Classe"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-stone-600">
          <p className="font-semibold text-stone-600 mb-1">Conta de Demonstração:</p>
          <code className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-joaninha-bordeaux font-mono">
            camila.valente@joaninhacreche.com.br / senha123
          </code>
        </div>
      </div>
    </div>
  );
}

export default function TeacherLoginPage() {
  return (
    <TeacherAuthProvider>
      <TeacherLoginContent />
    </TeacherAuthProvider>
  );
}
