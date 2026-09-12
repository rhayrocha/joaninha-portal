"use client";

import React, { useState, useEffect } from "react";
import { getGreeting } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, MessageCircle, MapPin, Clock, Award, ShieldCheck, Heart, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WelcomeCard() {
  const { user, children } = useAuth();
  const greeting = getGreeting();
  const mainChild = children && children.length > 0 ? children[0] : null;

  const [attendanceSummary, setAttendanceSummary] = useState<{
    todayStatus: 'present' | 'absent' | 'pending';
    todayNotes?: string | null;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
    teacherName?: string;
  } | null>(null);

  useEffect(() => {
    if (!mainChild?.id) return;
    fetch(`/api/attendance/summary?studentId=${mainChild.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAttendanceSummary(data);
        }
      })
      .catch(err => console.warn('[WelcomeCard] Erro ao carregar presença:', err));
  }, [mainChild?.id]);

  const isAbsentToday = attendanceSummary?.todayStatus === 'absent';
  const isPresentToday = attendanceSummary?.todayStatus === 'present';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative subtle luxury background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-joaninha-cream to-joaninha-pink-light/30 rounded-full blur-3xl pointer-events-none opacity-60"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-joaninha-cream to-amber-50/40 rounded-full blur-3xl pointer-events-none opacity-50"></div>

      {/* Top institution tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-stone-100 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/15 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-joaninha-red" />
          <span>Creche Escola Joaninha • Educação Infantil Bilíngue & Afetiva</span>
        </div>
        <div className="text-xs text-stone-600 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ambiente Seguro & Monitorado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
        
        {/* Left column: Welcome & Child metadata */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3.5">
            {user?.avatarUrl && (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-joaninha-cream shadow-soft shrink-0">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-joaninha-black tracking-tight">
                {greeting}, {user?.name ? user.name.split(' ')[0] : "Responsável"}!
              </h1>
              {mainChild?.name ? (
                <p className="text-xs sm:text-sm text-stone-600">
                  Responsável Financeiro & Pedagógico de <strong className="text-joaninha-bordeaux font-semibold">{mainChild.name}</strong>
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
            Bem-vinda ao seu espaço exclusivo. Acompanhe a rotina de vivências, cardápio nutricional do dia e mantenha tudo em dia com facilidade e transparência.
          </p>

          {mainChild && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-medium text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-joaninha-bordeaux" />
                {mainChild.className} • Turma Amor-Perfeito
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-medium text-stone-700">
                <Clock className="w-3.5 h-3.5 text-joaninha-bordeaux" />
                Período {mainChild.shift} (07:30 às 18:30)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-medium text-stone-700">
                <Award className="w-3.5 h-3.5 text-joaninha-bordeaux" />
                {attendanceSummary?.teacherName || 'Profª Camila Valente'}
              </span>
            </div>
          )}
        </div>

        {/* Right column: Child Profile Spotlight with live status */}
        {mainChild && (
          <div className="lg:col-span-5 bg-gradient-to-br from-joaninha-cream/60 to-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-soft">
                {mainChild.photoUrl ? (
                  <img src={mainChild.photoUrl} alt={mainChild.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-joaninha-pink-light flex items-center justify-center font-bold text-joaninha-red text-xl">
                    {mainChild.name.charAt(0)}
                  </div>
                )}
              </div>
              <span 
                className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]",
                  isAbsentToday ? "bg-rose-500" : "bg-emerald-500"
                )} 
                title={isAbsentToday ? "Falta registrada hoje" : "Presença confirmada"}
              >
                {isAbsentToday ? "✕" : "✓"}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h3 className="font-display font-bold text-base text-joaninha-black truncate">
                  {mainChild.name}
                </h3>
              </div>
              
              {/* Live Attendance Status Badge */}
              {isAbsentToday ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/70 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>Ausente hoje {attendanceSummary?.todayNotes ? `• ${attendanceSummary.todayNotes}` : '• Falta registrada'}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Presente na escola • Presença confirmada hoje ✓</span>
                </div>
              )}

              <p className="text-xs text-stone-600 mb-3">
                {mainChild.age} anos • Matrícula ativa 2026
              </p>

              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá, gostaria de um recado sobre ${mainChild.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-stone-50 text-joaninha-bordeaux border border-stone-200 shadow-2xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Canal com a Coordenação</span>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Bottom row: Peaceful Quality Indicators */}
      <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 relative z-10">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50/70">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            {attendanceSummary ? `${attendanceSummary.attendanceRate}%` : '100%'}
          </div>
          <div>
            <p className="font-semibold text-stone-800">Frequência Escolar</p>
            <p className="text-[11px] text-stone-600">
              {attendanceSummary && attendanceSummary.absentDays > 0 
                ? `${attendanceSummary.absentDays} falta(s) no ano letivo`
                : 'Presença plena em todos os dias letivos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50/70">
          <div className="w-7 h-7 rounded-lg bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-joaninha-red" />
          </div>
          <div>
            <p className="font-semibold text-stone-800">Nutrição Balanceada</p>
            <p className="text-[11px] text-stone-600">Lanches e almoço 100% consumidos hoje</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50/70">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-stone-800">Vivência do Dia</p>
            <p className="text-[11px] text-stone-600">Ateliê das Cores & Exploração Sensorial</p>
          </div>
        </div>
      </div>

    </div>
  );
}

