"use client";

import React, { useState, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { Edit2, MapPin, User, Mail, Phone, Hash, Calendar, Clock, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PerfilPage() {
  const { user, children: studentChildren, updateAvatar } = useAuth();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToastMessage('Por favor, selecione um arquivo de imagem válido (JPG ou PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage('A imagem não pode ultrapassar 5MB.');
      return;
    }

    setIsUploadingAvatar(true);
    setToastMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.avatarUrl) {
        updateAvatar(data.avatarUrl);
        setToastMessage('Foto de perfil atualizada com sucesso!');
      } else {
        setToastMessage(data.error || 'Erro ao atualizar foto.');
      }
    } catch {
      setToastMessage('Erro de conexão ao enviar foto.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <AppShell title="Perfil">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8 animate-in">
        
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">✕</button>
          </div>
        )}

        <section className="card-elevated bg-white rounded-3xl overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-joaninha-red to-joaninha-bordeaux"></div>
          
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-8 gap-4 sm:gap-6 relative">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-joaninha-cream overflow-hidden flex items-center justify-center text-4xl font-display font-bold text-joaninha-gray-600 shadow-soft z-10">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full z-20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1 right-1 z-20 p-2.5 bg-joaninha-red hover:bg-joaninha-bordeaux text-white rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 border-2 border-white"
                  title="Alterar foto de perfil"
                >
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                  accept="image/*"
                  className="hidden"
                />
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
