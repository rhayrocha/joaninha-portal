"use client";

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import { CLASS_NAMES } from '@/data/mockStudents';

interface NewParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewParentModal({ isOpen, onClose, onSuccess }: NewParentModalProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentCpf: '',
    parentPhone: '',
    parentPassword: 'senha123',
    studentName: '',
    studentBirthDate: '',
    studentClassName: 'Maternal I',
    studentShift: 'integral',
    studentAllergies: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/parents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessData(data.credentials);
        onSuccess();
      } else {
        setErrorMessage(data.error || 'Erro ao cadastrar responsável');
      }
    } catch {
      setErrorMessage('Erro de conexão ao cadastrar responsável.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!successData) return;
    const text = `Olá! Seu acesso ao Portal Creche Escola Joaninha foi criado com sucesso:\n\n🌐 Acesse: https://joaninha-portal.vercel.app/login\n📧 E-mail: ${successData.email}\n🔑 Senha: ${successData.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setSuccessData(null);
    setErrorMessage(null);
    setFormData({
      parentName: '',
      parentEmail: '',
      parentCpf: '',
      parentPhone: '',
      parentPassword: 'senha123',
      studentName: '',
      studentBirthDate: '',
      studentClassName: 'Maternal I',
      studentShift: 'integral',
      studentAllergies: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-joaninha-bordeaux/10 flex items-center justify-center text-joaninha-bordeaux">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-joaninha-black">
                Novo Responsável & Matrícula
              </h2>
              <p className="text-xs text-joaninha-gray-500">
                Cadastra a conta no Supabase e vincula o aluno à turma
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-joaninha-black">
                Matrícula Realizada com Sucesso!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                O responsável foi criado no Supabase Auth e o aluno já está alocado na turma.
              </p>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left max-w-md mx-auto space-y-2 text-sm">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">E-mail de Login</span>
                  <p className="font-bold text-joaninha-black">{successData.email}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Senha Temporária</span>
                  <p className="font-bold text-joaninha-black">{successData.password}</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Acesso para WhatsApp'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-primary py-2.5 px-6 text-sm font-semibold rounded-xl"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Seção 1: Responsável */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-joaninha-bordeaux mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-joaninha-bordeaux"></span>
                  1. Dados do Responsável Legal (Família)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo do Responsável *</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Ex: Mariana Oliveira da Silva"
                      required
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail (Login no Portal) *</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="mariana@exemplo.com.br"
                      required
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Telefone</label>
                    <input
                      type="text"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="(11) 98765-4321"
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CPF do Responsável (Para emissão Asaas)</label>
                    <input
                      type="text"
                      name="parentCpf"
                      value={formData.parentCpf}
                      onChange={handleChange}
                      placeholder="123.456.789-00"
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Senha Inicial de Acesso</label>
                    <input
                      type="text"
                      name="parentPassword"
                      value={formData.parentPassword}
                      onChange={handleChange}
                      placeholder="senha123"
                      className="input-field w-full text-sm font-mono text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Aluno */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-joaninha-bordeaux mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-joaninha-bordeaux"></span>
                  2. Dados do Aluno (Criança)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo da Criança *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Ex: Lucas Oliveira da Silva"
                      required
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data de Nascimento *</label>
                    <input
                      type="date"
                      name="studentBirthDate"
                      value={formData.studentBirthDate}
                      onChange={handleChange}
                      required
                      className="input-field w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Turma de Matrícula *</label>
                    <select
                      name="studentClassName"
                      value={formData.studentClassName}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    >
                      {CLASS_NAMES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Turno *</label>
                    <select
                      name="studentShift"
                      value={formData.studentShift}
                      onChange={handleChange}
                      className="input-field w-full text-sm"
                    >
                      <option value="integral">Integral (07:30 às 18:30)</option>
                      <option value="matutino">Matutino (07:30 às 12:30)</option>
                      <option value="vespertino">Vespertino (13:00 às 18:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Alergias ou Cuidados Especiais</label>
                    <input
                      type="text"
                      name="studentAllergies"
                      value={formData.studentAllergies}
                      onChange={handleChange}
                      placeholder="Ex: Alergia a lactose, rinite..."
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary py-2.5 px-4 text-sm font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary py-2.5 px-6 text-sm font-semibold rounded-xl flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isLoading ? 'Cadastrando no Supabase...' : 'Confirmar Matrícula'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
