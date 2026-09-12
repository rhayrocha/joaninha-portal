"use client";

import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import { CLASS_NAMES } from '@/data/mockStudents';

interface NewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTeacherModal({ isOpen, onClose, onSuccess }: NewTeacherModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'senha123',
    phone: '',
    classes: ['Maternal I'] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ email: string; password: string; classes: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleClass = (className: string) => {
    setFormData(prev => {
      const exists = prev.classes.includes(className);
      if (exists) {
        if (prev.classes.length === 1) return prev; // Mantém ao menos 1 turma
        return { ...prev, classes: prev.classes.filter(c => c !== className) };
      } else {
        return { ...prev, classes: [...prev.classes, className] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao cadastrar professora.');
      }

      setSuccessData({
        email: formData.email,
        password: formData.password,
        classes: formData.classes,
      });

      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccess = () => {
    if (!successData) return;
    const text = `Acesso Portal do Educador - Creche Joaninha:\nE-mail: ${successData.email}\nSenha: ${successData.password}\nTurmas: ${successData.classes.join(', ')}\nLink: https://joaninha-portal.vercel.app/professor/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-joaninha-black">
                Cadastrar Professora
              </h2>
              <p className="text-xs text-joaninha-gray-500">
                Acesso ao diário de classe e controle de presença
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="space-y-5 py-4">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-display font-bold text-lg text-emerald-900">
                Professora Cadastrada com Sucesso!
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                A conta foi criada no Supabase e já está habilitada para realizar a chamada.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Login / E-mail:</span>
                <span className="font-semibold text-gray-900 font-mono">{successData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Senha Padrão:</span>
                <span className="font-semibold text-gray-900 font-mono">{successData.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Turmas Atribuídas:</span>
                <span className="font-semibold text-joaninha-bordeaux">{successData.classes.join(', ')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyAccess}
                className="btn-secondary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado para o WhatsApp!' : 'Copiar Credenciais'}</span>
              </button>
              <button
                onClick={onClose}
                className="btn-primary flex-1 py-3 text-xs font-semibold"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-joaninha-black mb-1">
                Nome Completo da Professora *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Profª Camila Valente"
                className="input-field w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-joaninha-black mb-1">
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="camila@joaninhacreche.com.br"
                  className="input-field w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-joaninha-black mb-1">
                  WhatsApp / Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98888-7777"
                  className="input-field w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-joaninha-black mb-1">
                Senha Provisória
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full text-sm font-mono"
              />
            </div>

            {/* Turmas Atribuídas */}
            <div>
              <label className="block text-xs font-semibold text-joaninha-black mb-1.5">
                Turmas sob Responsabilidade da Professora:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLASS_NAMES.map(cls => {
                  const isChecked = formData.classes.includes(cls);
                  return (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => handleToggleClass(cls)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-joaninha-cream text-joaninha-bordeaux border-joaninha-bordeaux/30 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{cls}</span>
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-joaninha-bordeaux text-white' : 'border border-stone-300'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary py-2.5 px-4 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary py-2.5 px-5 text-xs font-semibold flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <span>Cadastrar Professora</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
