import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentAlertProps {
  pendingCount: number;
  totalCount: number;
}

export default function DocumentAlert({ pendingCount, totalCount }: DocumentAlertProps) {
  const approvedCount = totalCount - pendingCount;
  const isComplete = pendingCount === 0;
  const percentage = Math.round((approvedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Subtle top accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        isComplete 
          ? "bg-emerald-500" 
          : "bg-gradient-to-r from-amber-400 via-joaninha-bordeaux to-amber-500"
      )}></div>

      <div>
        {/* Top Header: Badge and Title */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs",
              isComplete
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-joaninha-cream text-joaninha-bordeaux border-joaninha-bordeaux/15"
            )}>
              {isComplete ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Secretaria Digital • Conformidade
              </span>
              <h3 className="font-display font-bold text-lg text-joaninha-black leading-tight">
                Pasta Cadastral
              </h3>
            </div>
          </div>

          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 border",
            isComplete
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          )}>
            {isComplete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Regular</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{percentage}% Concluído</span>
              </>
            )}
          </span>
        </div>

        {/* Progress Box */}
        <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-100 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-stone-700">Progresso da Documentação</span>
            <span className="text-stone-600 font-medium">
              <strong className="text-joaninha-black font-bold">{approvedCount}</strong> de {totalCount} validados
            </span>
          </div>

          {/* Elegant Progress bar track */}
          <div className="w-full bg-stone-200/70 h-2.5 rounded-full overflow-hidden p-0.5">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete 
                  ? "bg-emerald-500" 
                  : "bg-gradient-to-r from-joaninha-bordeaux to-amber-500"
              )}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="text-xs text-stone-600 mt-3 leading-relaxed">
            {isComplete
              ? "Parabéns! Todos os documentos obrigatórios do aluno e responsável foram analisados e aprovados pela secretaria."
              : "Documentos pessoais da mãe aprovados. Falta apenas enviar a carteira de vacinação de Pedro atualizada para o 2º semestre."}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-600 font-medium">
          Envio 100% digital em PDF ou foto
        </span>

        <Link href="/documentos">
          <button className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-joaninha-bordeaux border border-stone-200 shadow-2xs hover:shadow-soft transition-all duration-200 flex items-center gap-1.5">
            <span>Acessar Documentos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}

