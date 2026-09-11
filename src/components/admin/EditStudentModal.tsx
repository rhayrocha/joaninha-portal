"use client";

import React, { useState, useEffect } from 'react';
import { X, Edit, CheckCircle, Loader2, Save, Trash2, AlertTriangle } from 'lucide-react';
import { CLASS_NAMES } from '@/data/mockStudents';
import type { Child } from '@/types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Child | null;
  parentInfo?: { name: string; phone: string; cpf?: string };
}

export default function EditStudentModal({
  isOpen,
  onClose,
  onSuccess,
  student,
  parentInfo,
}: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClassName: 'Maternal I',
    studentShift: 'integral',
    studentBirthDate: '',
    studentAllergies: '',
    parentName: '',
    parentPhone: '',
    parentCpf: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        studentName: student.name || '',
        studentClassName: student.className || 'Maternal I',
        studentShift: student.shift === 'morning' || student.shift === 'Manhã' 
          ? 'matutino' 
          : student.shift === 'afternoon' || student.shift === 'Tarde' 
          ? 'vespertino' 
          : 'integral',
        studentBirthDate: student.birthDate || '',
        studentAllergies: (student as any).allergies || '',
        parentName: parentInfo?.name || '',
        parentPhone: parentInfo?.phone || '',
        parentCpf: parentInfo?.cpf || '',
      });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [student, parentInfo]);

  if (!isOpen || !student) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName,
          className: formData.studentClassName,
          shift: formData.studentShift,
          birthDate: formData.studentBirthDate || undefined,
          allergies: formData.studentAllergies,
          parentId: student.parentId,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          parentCpf: formData.parentCpf,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Alterações salvas no Supabase com sucesso!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Erro ao atualizar dados');
      }
    } catch {
      setErrorMessage('Erro de conexão ao salvar alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Deseja realmente remover o aluno ${student.name} do sistema?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Erro ao remover aluno');
      }
    } catch {
      setErrorMessage('Erro ao remover aluno.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-joaninha-bordeaux/10 flex items-center justify-center text-joaninha-bordeaux">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-joaninha-black">
                Editar Aluno e Matrícula
              </h2>
              <p className="text-xs text-joaninha-gray-500">
                Altere a turma, turno ou dados cadastrais com persistência no Supabase
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção 1: Aluno */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-joaninha-bordeaux mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-joaninha-bordeaux"></span>
                1. Dados Pedagógicos do Aluno
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo do Aluno *</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="input-field w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Turma Atual *</label>
                  <select
                    name="studentClassName"
                    value={formData.studentClassName}
                    onChange={handleChange}
                    className="input-field w-full text-sm font-medium"
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
                    className="input-field w-full text-sm font-medium"
                  >
                    <option value="integral">Integral (07:30 às 18:30)</option>
                    <option value="matutino">Manhã (07:30 às 12:30)</option>
                    <option value="vespertino">Tarde (13:00 às 18:00)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Alergias ou Cuidados Especiais</label>
                  <input
                    type="text"
                    name="studentAllergies"
                    value={formData.studentAllergies}
                    onChange={handleChange}
                    placeholder="Ex: Alergia a leite de vaca, intolerância a glúten..."
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Responsável */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-joaninha-bordeaux mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-joaninha-bordeaux"></span>
                2. Contato do Responsável Vinculado
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do Responsável Legal</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
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
                    className="input-field w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF do Responsável</label>
                  <input
                    type="text"
                    name="parentCpf"
                    value={formData.parentCpf}
                    onChange={handleChange}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
                className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Remover aluno da base"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remover Aluno</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary py-2.5 px-4 text-sm font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary py-2.5 px-6 text-sm font-semibold rounded-xl flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Salvando no Banco...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
