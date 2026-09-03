"use client";

import React, { useState } from "react";
import { Utensils, Sparkles, Moon, Sun, Apple, Heart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyRoutineCard() {
  const [activeTab, setActiveTab] = useState<"cardapio" | "pedagogico">("cardapio");

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 border border-joaninha-bordeaux/15 shadow-2xs">
              {activeTab === "cardapio" ? <Utensils className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Rotina do Dia • Maternal I
              </span>
              <h3 className="font-display font-bold text-lg text-joaninha-black leading-tight">
                {activeTab === "cardapio" ? "Nutrição & Alimentação do Dia" : "Vivência Pedagógica & Atividades"}
              </h3>
            </div>
          </div>

          {/* Elegant Pill Switcher */}
          <div className="flex p-1 bg-stone-100 rounded-xl self-start sm:self-auto border border-stone-200/60">
            <button
              onClick={() => setActiveTab("cardapio")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                activeTab === "cardapio"
                  ? "bg-white text-joaninha-bordeaux shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Cardápio</span>
            </button>
            <button
              onClick={() => setActiveTab("pedagogico")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                activeTab === "pedagogico"
                  ? "bg-white text-joaninha-bordeaux shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pedagógico</span>
            </button>
          </div>
        </div>

        {/* Content Tab: Cardápio Nutricional */}
        {activeTab === "cardapio" ? (
          <div className="space-y-3 animate-in">
            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Lanche da Manhã (09:00)</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">Consumido ✓</span>
                </div>
                <p className="text-xs text-stone-600">
                  Frutinhas selecionadas (mamão formosa e uvas sem sementes) acompanhadas de biscoitinho artesanal de aveia e mel.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Almoço Balanceado (11:30)</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">Apetite Excelente ✓</span>
                </div>
                <p className="text-xs text-stone-600">
                  Arroz integral orgânico, feijãozinho caseiro carioca, filé de frango grelhado em tiras, purê de abóbora cabotiá e saladinha fresca de alface baby.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 text-xs font-bold">
                <Apple className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Lanche da Tarde (15:30)</h4>
                  <span className="text-[11px] font-medium text-stone-600">Programado</span>
                </div>
                <p className="text-xs text-stone-600">
                  Iogurte natural batido com frutas vermelhas e pãozinho artesanal de mandioquinha servido quentinho.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Content Tab: Vivência Pedagógica */
          <div className="space-y-3 animate-in">
            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Ateliê Sensorial da Natureza</h4>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">Vivência Principal</span>
                </div>
                <p className="text-xs text-stone-600">
                  Exploração de tintas naturais produzidas com beterraba, cúrcuma e folhas no jardim da creche. Desenvolvimento da coordenação motora fina e percepção cromática.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 text-xs font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Bilingual Morning Circle</h4>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/50">Imersão em Inglês</span>
                </div>
                <p className="text-xs text-stone-600">
                  Músicas de boas-vindas e contação de histórias com fantoches em inglês (vocab: <em>colors, flowers & weather</em>). Pedro participou ativamente com entusiasmo!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
                <Moon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Soneca & Repouso (13:00 às 14:30)</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">Repouso Pleno ✓</span>
                </div>
                <p className="text-xs text-stone-600">
                  Dormiu tranquilamente durante 1h20 em ambiente climatizado com iluminação indireta e som suave de harpa.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Heart className="w-3.5 h-3.5 text-joaninha-red" />
          <span>Cardápio elaborado por <strong>Dra. Helena Prado</strong> (CRN-3 Nutricionista Infantil)</span>
        </div>
        <span className="text-[10px] text-stone-600 font-semibold uppercase tracking-wider hidden sm:inline">
          Atualizado hoje às 12:15
        </span>
      </div>
    </div>
  );
}
