import React from "react";
import Link from "next/link";
import { FileWarning, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentAlertProps {
  pendingCount: number;
  totalCount: number;
}

export default function DocumentAlert({ pendingCount, totalCount }: DocumentAlertProps) {
  const isComplete = pendingCount === 0;

  return (
    <div className={cn(
      "card p-5 rounded-2xl flex items-center justify-between border-l-4 transition-all hover:shadow-md",
      isComplete
        ? "bg-joaninha-green-light border-joaninha-green"
        : "bg-amber-50 border-amber-500"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-full flex-shrink-0",
          isComplete ? "bg-joaninha-green text-white" : "bg-amber-100 text-amber-600"
        )}>
          {isComplete ? <CheckCircle size={24} /> : <FileWarning size={24} />}
        </div>
        <div>
          <h3 className={cn(
            "font-semibold font-display text-lg",
            isComplete ? "text-joaninha-green" : "text-amber-800"
          )}>
            {isComplete ? "Documentação Completa!" : "Documentos Pendentes"}
          </h3>
          <p className={cn(
            "text-sm",
            isComplete ? "text-joaninha-green" : "text-amber-700"
          )}>
            {isComplete
              ? "Todos os documentos foram enviados e aprovados."
              : `Você tem ${pendingCount} de ${totalCount} documentos aguardando envio.`}
          </p>
        </div>
      </div>
      <Link href="/documentos" className={cn(
        "flex items-center gap-1 text-sm font-medium hover:underline",
        isComplete ? "text-joaninha-green" : "text-amber-700"
      )}>
        Ver todos <ChevronRight size={16} />
      </Link>
    </div>
  );
}
