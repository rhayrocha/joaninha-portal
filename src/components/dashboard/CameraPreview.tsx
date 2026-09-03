"use client";

import React, { useState } from "react";
import { Camera, ShieldCheck, Lock, Play, Eye, Clock, Radio, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CameraPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-300 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 border border-joaninha-bordeaux/15 shadow-2xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Segurança & Monitoramento
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                AO VIVO
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-joaninha-black leading-tight">
              Circuito Fechado • Maternal I (Ateliê das Cores)
            </h3>
          </div>
        </div>

        <div className="text-xs text-stone-600 flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          <span>Horário de Transmissão: <strong>08:00 às 17:30</strong></span>
        </div>
      </div>

      {/* Camera Live Stream Area */}
      <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center border border-stone-200 shadow-inner group">
        {/* Background preschool room simulation image with subtle blur */}
        <img 
          src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&auto=format&fit=crop&q=80" 
          alt="Sala de Aula da Creche Joaninha" 
          className="w-full h-full object-cover opacity-40 blur-[1px] group-hover:scale-105 transition-transform duration-700" 
        />

        {/* Live overlay badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-medium border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            REC • CÂM 02 - SALA PRINCIPAL
          </span>
          <span className="hidden sm:inline-block bg-black/40 backdrop-blur-md text-stone-300 px-2.5 py-1 rounded-lg text-xs font-mono border border-white/10">
            1080p HD • 60 FPS
          </span>
        </div>

        {/* Security / Access Modal Trigger */}
        <div className="z-10 max-w-md mx-4 p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-elevated text-center">
          <div className="w-12 h-12 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux mx-auto mb-3 flex items-center justify-center border border-joaninha-bordeaux/15 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-joaninha-bordeaux" />
          </div>

          <h4 className="font-display font-bold text-base text-joaninha-black mb-1">
            Transmissão Segura & Criptografada
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            Em conformidade com o protocolo de privacidade da educação infantil, o acesso ao sinal de vídeo é exclusivo para os pais devidamente autenticados.
          </p>

          <button 
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold bg-joaninha-bordeaux hover:bg-joaninha-bordeaux/90 text-white shadow-soft transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <Eye className="w-4 h-4" />
            <span>Acessar Câmera em Tempo Real</span>
          </button>
        </div>

        {/* Bottom stream ticker */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-stone-300 font-mono">
          <span>Servidor Seguro Brasil • Criptografia TLS 1.3</span>
          <span className="hidden sm:inline">Proteção LGPD Escolar</span>
        </div>
      </div>

      {/* Reassurance Features Bar */}
      <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Protocolo de Segurança Escolar 24h</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-joaninha-bordeaux shrink-0" />
          <span>Acesso individual autenticado por família</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-stone-600 shrink-0" />
          <span>Equipe com supervisão presencial contínua</span>
        </div>
      </div>

      {/* Access Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
              <Eye className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-xl text-joaninha-black">
                Sessão de Monitoramento Conectada
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Você está conectada ao circuito seguro da sala <strong>Ateliê das Cores (Maternal I)</strong>. Neste momento, os alunos estão participando da roda de contação de histórias com a <strong>Profª Camila</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs space-y-1.5 text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-600">Aluno:</span>
                <strong className="text-stone-900">Pedro Henrique Santos</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Turma:</span>
                <strong className="text-stone-900">Maternal I • Período Integral</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Autenticação:</span>
                <span className="text-emerald-700 font-semibold">Criptografia Ativa ✓</span>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-joaninha-bordeaux hover:bg-joaninha-bordeaux/90 text-white shadow-soft transition-all"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

