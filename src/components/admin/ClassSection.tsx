"use client";

import React, { useState } from 'react';
import type { Child } from '@/types';
import StudentCard from './StudentCard';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassSectionProps {
  className: string;
  students: Child[];
  parentInfoMap: Record<string, { name: string; phone: string; avatarUrl?: string }>;
  onEditStudent?: (student: Child) => void;
}

export default function ClassSection({ className, students, parentInfoMap, onEditStudent }: ClassSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!students || students.length === 0) return null;

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-joaninha-bordeaux border border-gray-100">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-left">
             <h3 className="text-lg font-display font-bold text-joaninha-black">{className}</h3>
             <p className="text-sm text-gray-500">{students.length} {students.length === 1 ? 'aluno' : 'alunos'}</p>
          </div>
        </div>
        <div className="p-2 text-gray-400 bg-white rounded-full shadow-sm">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <div className={cn(
        "transition-all duration-300 ease-in-out origin-top",
        isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white">
          {students.map(student => {
            const parent = parentInfoMap[student.parentId];
            return (
              <StudentCard
                key={student.id}
                student={student}
                parentName={parent?.name || 'Não informado'}
                parentPhone={parent?.phone || 'Não informado'}
                parentAvatarUrl={parent?.avatarUrl}
                onEdit={onEditStudent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
