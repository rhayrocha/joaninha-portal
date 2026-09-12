"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import NewTeacherModal from '@/components/admin/NewTeacherModal';
import type { TeacherUser } from '@/types';
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Edit3, 
  Loader2, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminProfessoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherUser | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/teachers', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.teachers && Array.isArray(data.teachers)) {
          setTeachers(data.teachers);
        }
      }
    } catch (err) {
      console.error('[Admin Professores] Erro ao carregar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleDeleteTeacher = async (teacherId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cadastro de ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/teachers?teacherId=${teacherId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionNotice(`✅ Professor(a) ${name} removido(a) com sucesso.`);
        loadTeachers();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch {
      alert('Erro ao excluir professor.');
    }
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.classes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalClassesCovered = new Set(teachers.flatMap(t => t.classes)).size;

  return (
    <AdminShell title="Professores" subtitle="Gestão do corpo docente e turmas">
      
      {/* Notice */}
      {actionNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs animate-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-joaninha-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full rounded-xl border border-joaninha-gray-300 py-3 pr-4 outline-none focus:border-joaninha-bordeaux focus:ring-1 focus:ring-joaninha-bordeaux"
            placeholder="Buscar por nome, e-mail ou turma..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white px-4 py-2.5 shadow-sm border border-joaninha-gray-100 text-sm">
            <span className="font-medium text-joaninha-gray-500">Docentes Ativos:</span>
            <span className="ml-2 font-bold text-joaninha-black">{teachers.length}</span>
          </div>

          <div className="rounded-xl bg-white px-4 py-2.5 shadow-sm border border-joaninha-gray-100 text-sm hidden sm:inline-flex">
            <span className="font-medium text-joaninha-gray-500">Turmas Atendidas:</span>
            <span className="ml-2 font-bold text-joaninha-bordeaux">{totalClassesCovered}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Professora</span>
          </button>
        </div>
      </div>

      {/* Teachers List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-card border border-joaninha-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-joaninha-bordeaux mb-3" />
          <p className="text-sm font-medium text-stone-600">Carregando corpo docente do Supabase...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-card border border-joaninha-gray-100">
          <GraduationCap className="w-12 h-12 text-stone-300 mb-3" />
          <h3 className="text-lg font-medium text-joaninha-black">Nenhum professor encontrado</h3>
          <p className="mt-1 text-joaninha-gray-500 text-sm">Cadastre a equipe docente usando o botão acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs shrink-0">
                      {teacher.avatarUrl ? (
                        <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-joaninha-cream text-joaninha-bordeaux font-bold flex items-center justify-center text-base">
                          {teacher.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-joaninha-black leading-tight">
                        {teacher.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 mt-1 inline-block">
                        Educadora Ativa
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                    className="p-2 text-stone-400 hover:text-joaninha-red hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir professora"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 py-3 border-y border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>

                {/* Turmas Badges */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-2">
                    Turmas Vinculadas ({teacher.classes.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.classes.map(cls => (
                      <span
                        key={cls}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/15 shadow-2xs"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Quick Actions */}
              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <Link
                  href={`/professor`}
                  className="text-joaninha-bordeaux font-semibold hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Diário</span>
                </Link>

                <span className="text-stone-600 text-[11px]">
                  ID: {teacher.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cadastro */}
      <NewTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadTeachers();
        }}
      />
    </AdminShell>
  );
}
