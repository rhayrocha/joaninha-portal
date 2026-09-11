"use client";

import React from 'react';
import type { Child } from '@/types';
import { User, Phone, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: Child;
  parentName: string;
  parentPhone: string;
  parentAvatarUrl?: string;
  onEdit?: (student: Child) => void;
}

export default function StudentCard({ 
  student, 
  parentName, 
  parentPhone, 
  parentAvatarUrl,
  onEdit,
}: StudentCardProps) {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative">
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(student)}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-joaninha-bordeaux rounded-lg hover:bg-joaninha-cream/50 transition-colors z-10"
          title="Editar dados e matrícula"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      <div className="flex flex-col items-center text-center">
        {/* Child Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm bg-joaninha-lavender/30 flex items-center justify-center text-joaninha-bordeaux font-display text-xl font-bold group-hover:scale-105 transition-transform">
           {student.photoUrl ? (
             <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
           ) : (
             getInitials(student.name)
           )}
        </div>
        
        <h4 className="font-bold text-joaninha-black text-lg mb-1">{student.name}</h4>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
           <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
             {student.className}
           </span>
           <span className="text-xs font-semibold px-2 py-1 bg-joaninha-cream text-joaninha-bordeaux rounded-md">
             {student.shift === 'full' || student.shift === 'Integral' ? 'Integral' : student.shift === 'morning' || student.shift === 'Manhã' ? 'Manhã' : 'Tarde'}
           </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full overflow-hidden bg-joaninha-cream flex-shrink-0 flex items-center justify-center border border-gray-200">
             <img 
               src={parentAvatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"} 
               alt={parentName} 
               className="w-full h-full object-cover" 
             />
           </div>
           <div className="flex flex-col min-w-0 flex-1">
             <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Responsável</span>
             <span className="text-sm font-semibold text-joaninha-black truncate">{parentName}</span>
           </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-500 gap-1.5 ml-11">
           <Phone className="w-3.5 h-3.5" />
           {parentPhone}
        </div>
      </div>
    </div>
  );
}
