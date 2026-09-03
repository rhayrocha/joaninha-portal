"use client";

import React from "react";
import { Calendar, ChevronRight, MessageCircle, MapPin, Sparkles } from "lucide-react";

export default function SchoolAgendaCard() {
  const events = [
    {
      day: "15",
      month: "SET",
      title: "Encontro Pedagógico Individual",
      time: "Agendamento flexível de 20 min",
      tag: "Presencial ou Online",
      tagColor: "bg-joaninha-cream text-joaninha-bordeaux border-joaninha-bordeaux/20",
    },
    {
      day: "26",
      month: "SET",
      title: "Festa da Primavera no Bosque",
      time: "Sábado • 09:30 às 13:00",
      tag: "Famílias Convidadas",
      tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      day: "08",
      month: "OUT",
      title: "Oficina de Mini Chef Infantil",
      time: "Atividade curricular especial",
      tag: "Alunos Maternal I",
      tagColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 border border-joaninha-bordeaux/15 shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Comunidade & Calendário
              </span>
              <h3 className="font-display font-bold text-lg text-joaninha-black leading-tight">
                Próximos Eventos
              </h3>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            2026
          </span>
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {events.map((evt, idx) => (
            <div 
              key={idx} 
              className="p-3 rounded-2xl bg-stone-50/80 border border-stone-100/90 flex items-center gap-3 hover:bg-stone-50 transition-colors"
            >
              {/* Date square */}
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 flex flex-col items-center justify-center shrink-0 shadow-2xs text-center">
                <span className="font-display font-bold text-base text-joaninha-bordeaux leading-none">
                  {evt.day}
                </span>
                <span className="text-[9px] font-bold text-stone-600 uppercase tracking-wider mt-0.5">
                  {evt.month}
                </span>
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {evt.title}
                  </h4>
                </div>
                <p className="text-[11px] text-stone-600 truncate mb-1">
                  {evt.time}
                </p>
                <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md border ${evt.tagColor}`}>
                  {evt.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge contact footer */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <a
          href="https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20secretaria%20da%20Creche%20Joaninha"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 text-emerald-800 border border-emerald-200/60 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">Atendimento Exclusivo WhatsApp</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
