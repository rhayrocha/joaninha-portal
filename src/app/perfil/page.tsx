"use client";

import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { Edit2, MapPin, User, Mail, Phone, Hash, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PerfilPage() {
  const { user, children: studentChildren } = useAuth();

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <AppShell title="Perfil">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8 animate-in">
        
        <section className="card-elevated bg-white rounded-3xl overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-joaninha-red to-joaninha-bordeaux"></div>
          
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-8 gap-4 sm:gap-6 relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-joaninha-cream overflow-hidden flex items-center justify-center text-4xl font-display font-bold text-joaninha-gray-600 shadow-soft z-10">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 text-center sm:text-left mb-2">
                <h2 className="text-2xl font-display font-bold text-joaninha-black">{user.name}</h2>
                <p className="text-joaninha-gray-500">Responsável Financeiro</p>
              </div>
              <button disabled className="btn-secondary flex items-center gap-2 group relative">
                <Edit2 size={16} />
                <span className="hidden sm:inline">Editar Dados</span>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-joaninha-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Em breve
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-joaninha-gray-400 mt-1" size={18} />
                  <div>
                    <label className="text-xs font-bold text-joaninha-gray-400 uppercase tracking-wider">Email</label>
                    <p className="font-medium text-joaninha-black">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-joaninha-gray-400 mt-1" size={18} />
                  <div>
                    <label className="text-xs font-bold text-joaninha-gray-400 uppercase tracking-wider">Telefone</label>
                    <p className="font-medium text-joaninha-black">{user.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="text-joaninha-gray-400 mt-1" size={18} />
                  <div>
                    <label className="text-xs font-bold text-joaninha-gray-400 uppercase tracking-wider">CPF</label>
                    <p className="font-medium text-joaninha-black">{user.cpf}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-joaninha-gray-400 mt-1" size={18} />
                  <div>
                    <label className="text-xs font-bold text-joaninha-gray-400 uppercase tracking-wider">Endereço</label>
                    <p className="font-medium text-joaninha-black">{user.address.street}, {user.address.number}</p>
                    <p className="text-sm text-joaninha-gray-600">{user.address.neighborhood} - {user.address.city}/{user.address.state}</p>
                    <p className="text-sm text-joaninha-gray-600">CEP: {user.address.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-display font-bold text-joaninha-black mb-4 px-2">Aluno(s) Matriculado(s)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {studentChildren.map(child => {
              const childInitials = child.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <div key={child.id} className="card-elevated bg-white p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-joaninha-pink-light flex items-center justify-center text-xl font-display font-bold text-joaninha-red shrink-0 shadow-sm border border-gray-100">
                    {child.photoUrl ? (
                      <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      childInitials
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg font-display font-bold text-joaninha-black">{child.name}</h4>
                      <p className="text-sm text-joaninha-gray-500">{child.age} anos</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-left bg-joaninha-off-white p-3 rounded-xl">
                      <div>
                        <label className="text-[10px] font-bold text-joaninha-gray-400 uppercase tracking-wider">Turma</label>
                        <p className="text-sm font-medium text-joaninha-black">{child.className}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-joaninha-gray-400 uppercase tracking-wider">Turno</label>
                        <p className="text-sm font-medium text-joaninha-black">{child.shift}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-joaninha-gray-400 uppercase tracking-wider">Data de Matrícula</label>
                        <p className="text-sm font-medium text-joaninha-black">{formatDate(child.enrollmentDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
