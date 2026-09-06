"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ClassSection from '@/components/admin/ClassSection';
import NewParentModal from '@/components/admin/NewParentModal';
import { allStudents as initialStudents, parentInfo as initialParentInfo, CLASS_NAMES } from '@/data/mockStudents';
import { Search, UserPlus } from 'lucide-react';

export default function AdminAlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(initialStudents);
  const [parentMap, setParentMap] = useState(initialParentInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell title="Alunos" subtitle="Gestão de turmas e matrículas">
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
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white px-4 py-2.5 shadow-sm border border-joaninha-gray-100 text-sm">
            <span className="font-medium text-joaninha-gray-500">Total de Alunos:</span>
            <span className="ml-2 font-bold text-joaninha-black">{students.length}</span>
          </div>

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
            />
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-card border border-joaninha-gray-100">
            <h3 className="text-lg font-medium text-joaninha-black">Nenhum aluno encontrado</h3>
            <p className="mt-1 text-joaninha-gray-500">Tente buscar por outro nome.</p>
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
    </AdminShell>
  );
}
