"use client";

import React, { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ClassSection from '@/components/admin/ClassSection';
import { allStudents, parentInfo, CLASS_NAMES } from '@/data/mockStudents';
import { Search } from 'lucide-react';

export default function AdminAlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = allStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminShell title="Alunos" subtitle="Gestão de turmas e alunos">
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
        <div className="flex gap-4">
          <div className="rounded-xl bg-white px-4 py-2 shadow-sm border border-joaninha-gray-100">
            <span className="text-sm font-medium text-joaninha-gray-500">Total de Alunos:</span>
            <span className="ml-2 font-bold text-joaninha-black">{allStudents.length}</span>
          </div>
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
              parentInfoMap={parentInfo}
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
    </AdminShell>
  );
}
