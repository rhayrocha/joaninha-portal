"use client";

import React, { useState, useEffect, useCallback } from "react";
import TeacherShell from "@/components/teacher/TeacherShell";
import { TeacherAuthProvider, useTeacherAuth } from "@/contexts/TeacherAuthContext";
import { useRouter } from "next/navigation";
import { 
  Check, 
  X, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentAttendanceItem {
  studentId: string;
  studentName: string;
  className: string;
  shift: string;
  avatarUrl?: string;
  status: "present" | "absent" | "justified";
  notes: string;
  isRecorded?: boolean;
}

const COMMON_ABSENCE_REASONS = [
  "🤒 Gripado / Febre",
  "🏥 Consulta Médica",
  "✈️ Viagem em Família",
  "🏠 Motivo Pessoal",
  "🦷 Dentista",
];

function TeacherChamadaContent() {
  const { teacher, isAuthenticated, isLoading: isAuthLoading } = useTeacherAuth();
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/professor/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Define a turma inicial do professor assim que o perfil carrega
  useEffect(() => {
    if (teacher?.classes && teacher.classes.length > 0) {
      if (!selectedClass || !teacher.classes.includes(selectedClass)) {
        setSelectedClass(teacher.classes[0]);
      }
    }
  }, [teacher, selectedClass]);

  // Carrega alunos e chamada da data e turma com cancelamento de requisição anterior
  useEffect(() => {
    let isCancelled = false;
    if (!isAuthenticated || !selectedClass) return;

    setIsLoadingStudents(true);
    setSaveFeedback(null);

    fetch(
      `/api/attendance?className=${encodeURIComponent(selectedClass)}&date=${selectedDate}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {
          if (data.records && Array.isArray(data.records)) {
            setStudents(data.records);
          } else {
            setStudents([]);
          }
        }
      })
      .catch(err => {
        if (!isCancelled) console.error("[Chamada] Erro ao carregar alunos:", err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingStudents(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, selectedClass, selectedDate]);

  // Alterna status de presença
  const handleToggleStatus = (studentId: string, newStatus: "present" | "absent") => {
    setStudents(prev =>
      prev.map(s => {
        if (s.studentId === studentId) {
          const updated = { ...s, status: newStatus };
          // Se marcou falta e não tem observação, abre o campo de notas
          if (newStatus === "absent" && !s.notes) {
            setExpandedNotesId(studentId);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Atualiza observação de falta
  const handleUpdateNotes = (studentId: string, notes: string) => {
    setStudents(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, notes } : s))
    );
  };

  // Marcar todos como presentes
  const handleMarkAllPresent = () => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        status: "present",
      }))
    );
    setExpandedNotesId(null);
  };

  // Salvar chamada no Supabase
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          date: selectedDate,
          teacherId: teacher?.id,
          records: students.map(s => ({
            studentId: s.studentId,
            status: s.status,
            notes: s.notes,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveFeedback("✅ Chamada salva com sucesso no sistema!");
        setTimeout(() => setSaveFeedback(null), 4000);
      } else {
        setSaveFeedback("Erro: " + (data.error || "Falha ao salvar"));
      }
    } catch {
      setSaveFeedback("Erro de conexão ao salvar chamada.");
    } finally {
      setIsSaving(false);
    }
  };

  // Navegação de datas
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate + "T12:00:00");
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  // Formatação amigável da data
  const formatDateTitle = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return "Hoje";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent" || s.status === "justified").length;

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-joaninha-bordeaux" />
      </div>
    );
  }

  return (
    <TeacherShell activeTurma={selectedClass}>
      <div className="space-y-6 pb-24 animate-in">
        
        {/* Top Control Bar: Class Tabs & Date Selector */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Turmas Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-1 hidden sm:inline">
              Turma:
            </span>
            {(teacher?.classes || ["Maternal I"]).map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs",
                  selectedClass === cls
                    ? "bg-joaninha-bordeaux text-white shadow-soft"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                )}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end bg-stone-50 p-1.5 rounded-2xl border border-stone-200/70">
            <button
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors"
              title="Dia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-4 h-4 text-joaninha-bordeaux" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-joaninha-black outline-none cursor-pointer"
              />
              <span className="text-xs font-semibold text-joaninha-bordeaux bg-joaninha-cream px-2 py-0.5 rounded-full hidden sm:inline">
                {formatDateTitle(selectedDate)}
              </span>
            </div>

            <button
              onClick={() => handleShiftDate(1)}
              className="p-1.5 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors"
              title="Próximo dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Summary & Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">Total de Alunos</span>
              <span className="font-display font-bold text-2xl text-joaninha-black">{students.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Presentes Hoje</span>
              <span className="font-display font-bold text-2xl text-emerald-700">{presentCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Faltas Registradas</span>
              <span className="font-display font-bold text-2xl text-rose-700">{absentCount}</span>
            </div>
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Marca todos os alunos da turma como presentes"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Todos Presentes</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveFeedback && (
          <div className={cn(
            "p-4 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-xs animate-in",
            saveFeedback.startsWith("✅")
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          )}>
            <span>{saveFeedback}</span>
            <button onClick={() => setSaveFeedback(null)} className="font-bold opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Students List */}
        {isLoadingStudents ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-card flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-joaninha-bordeaux mb-3" />
            <p className="text-sm text-stone-600 font-medium">Carregando alunos da turma {selectedClass}...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-card">
            <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-joaninha-black">Nenhum aluno matriculado nesta turma</h3>
            <p className="text-xs text-stone-500 mt-1">Verifique o cadastro de alunos no painel administrativo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, idx) => {
              const isPresent = student.status === "present";
              const isNotesOpen = expandedNotesId === student.studentId || (student.status === "absent" && !!student.notes);

              return (
                <div
                  key={student.studentId}
                  className={cn(
                    "bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs",
                    isPresent 
                      ? "border-stone-200/80 hover:border-emerald-200" 
                      : "border-rose-200/80 bg-rose-50/20"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs shrink-0">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt={student.studentName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-joaninha-cream text-joaninha-bordeaux font-bold flex items-center justify-center text-sm">
                            {student.studentName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-joaninha-black leading-tight">
                          {student.studentName}
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Período {student.shift} • {student.className}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Attendance Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      
                      {/* Button Presente */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(student.studentId, "present")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs",
                          isPresent
                            ? "bg-emerald-600 text-white shadow-soft"
                            : "bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"
                        )}
                      >
                        <Check className="w-4 h-4" />
                        <span>Presente</span>
                      </button>

                      {/* Button Faltou */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(student.studentId, "absent")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs",
                          !isPresent
                            ? "bg-rose-600 text-white shadow-soft"
                            : "bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-800"
                        )}
                      >
                        <X className="w-4 h-4" />
                        <span>Faltou</span>
                      </button>

                      {/* Botão de Observação */}
                      <button
                        type="button"
                        onClick={() => setExpandedNotesId(isNotesOpen ? null : student.studentId)}
                        className={cn(
                          "p-2 rounded-xl border transition-all text-xs flex items-center justify-center",
                          student.notes
                            ? "bg-amber-50 border-amber-200 text-amber-800"
                            : "bg-stone-50 border-stone-200/70 text-stone-600 hover:text-stone-900"
                        )}
                        title="Adicionar ou ver observação da falta"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                    </div>
                  </div>

                  {/* Absence / Note Drawer */}
                  {isNotesOpen && (
                    <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2.5 animate-in">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-stone-600">Motivos rápidos:</span>
                        {COMMON_ABSENCE_REASONS.map(reason => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => handleUpdateNotes(student.studentId, reason)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-joaninha-cream hover:text-joaninha-bordeaux text-stone-700 transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={student.notes}
                          onChange={e => handleUpdateNotes(student.studentId, e.target.value)}
                          placeholder="Observação da falta (ex: A mãe avisou que está com tosse e volta amanhã)..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-joaninha-bordeaux focus:ring-1 focus:ring-joaninha-bordeaux outline-none bg-white text-stone-800"
                        />
                        {student.notes && (
                          <button
                            type="button"
                            onClick={() => handleUpdateNotes(student.studentId, "")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-600 hover:text-stone-900"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:p-4 shadow-elevated">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-stone-600 hidden sm:block">
            Chamada de <strong>{formatDateTitle(selectedDate)}</strong> • Turma <strong>{selectedClass}</strong> ({presentCount} presentes / {absentCount} faltas)
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
            className="w-full sm:w-auto ml-auto px-6 py-3 rounded-2xl bg-joaninha-bordeaux hover:bg-joaninha-bordeaux/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-soft active:scale-98 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando presença...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Chamada</span>
              </>
            )}
          </button>
        </div>
      </div>
    </TeacherShell>
  );
}

export default function TeacherChamadaPage() {
  return (
    <TeacherAuthProvider>
      <TeacherChamadaContent />
    </TeacherAuthProvider>
  );
}
