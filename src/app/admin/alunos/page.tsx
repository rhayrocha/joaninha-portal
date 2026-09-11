"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ClassSection from '@/components/admin/ClassSection';
import NewParentModal from '@/components/admin/NewParentModal';
import EditStudentModal from '@/components/admin/EditStudentModal';
import { CLASS_NAMES } from '@/data/mockStudents';
import { Search, UserPlus, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import type { Child } from '@/types';

export default function AdminAlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Child[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Child | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/students/list', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.students && Array.isArray(data.students)) {
          setStudents(data.students);
        }
        if (data.parentInfo) {
          setParentMap(data.parentInfo);
        }
      }
    } catch (err) {
      console.error('[Admin Alunos] Erro ao carregar alunos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Deseja popular o banco Supabase com 3 famílias completas de teste (Maria, Carlos e Fernanda)?')) {
      return;
    }
    setIsSeeding(true);
    setSeedNotice(null);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedNotice('✅ 3 Famílias de teste criadas no Supabase com sucesso!');
        await loadStudents();
      } else {
        setSeedNotice('Erro: ' + (data.error || 'Falha ao popular banco'));
      }
    } catch {
      setSeedNotice('Erro de conexão ao popular banco');
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSeedNotice(null), 5000);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell title="Alunos" subtitle="Gestão de turmas e matrículas">
      {seedNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{seedNotice}</span>
          </div>
          <button onClick={() => setSeedNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-joaninha-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full rounded-xl border border-joaninha-gray-300 py-3 pr-4 outline-none focus:border-joaninha-bordeaux focus:ring-1 focus:ring-joaninha-bordeaux"
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white px-4 py-2.5 shadow-sm border border-joaninha-gray-100 text-sm">
            <span className="font-medium text-joaninha-gray-500">Total de Alunos:</span>
            <span className="ml-2 font-bold text-joaninha-black">{students.length}</span>
          </div>

          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="btn-secondary py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm text-joaninha-bordeaux border-joaninha-bordeaux/20 hover:bg-joaninha-cream/50"
            title="Popula 3 famílias completas de teste no Supabase"
          >
            {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isSeeding ? 'Criando...' : 'Popular Dados de Teste'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Responsável</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {CLASS_NAMES.map(className => {
          const studentsInClass = filteredStudents.filter(s => s.className === className);
          
          if (studentsInClass.length === 0) return null;

          return (
            <ClassSection
              key={className}
              className={className}
              students={studentsInClass}
              parentInfoMap={parentMap}
              onEditStudent={(student) => {
                setEditingStudent(student);
                setIsEditModalOpen(true);
              }}
            />
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-card border border-joaninha-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-joaninha-bordeaux mb-3" />
            <p className="text-sm font-medium text-stone-600">Carregando turmas e alunos do Supabase...</p>
          </div>
        )}

        {!isLoading && filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-card border border-joaninha-gray-100">
            <h3 className="text-lg font-medium text-joaninha-black">Nenhum aluno encontrado</h3>
            <p className="mt-1 text-joaninha-gray-500">Tente buscar por outro nome ou cadastre uma nova família no botão acima.</p>
          </div>
        )}
      </div>

      <NewParentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadStudents();
        }}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStudent(null);
        }}
        onSuccess={() => {
          loadStudents();
        }}
        student={editingStudent}
        parentInfo={editingStudent ? parentMap[editingStudent.parentId] : undefined}
      />
    </AdminShell>
  );
}
