"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Calendar, CheckCircle2, ChevronRight, Copy, Check, Sparkles, ArrowUpRight } from "lucide-react";
import type { Payment } from "@/types";
import { formatCurrency, formatDate, daysUntil, cn } from "@/lib/utils";

interface NextPaymentCardProps {
  payment: Payment | null;
}

export default function NextPaymentCard({ payment }: NextPaymentCardProps) {
  const [copied, setCopied] = useState(false);

  if (!payment) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card flex flex-col justify-between h-full">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-0.5">
              Situação Financeira
            </span>
            <h3 className="font-display font-bold text-lg text-joaninha-black">
              Tudo em dia!
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Todas as mensalidades do ano letivo estão devidamente quitadas. Nenhuma pendência financeira em aberto.
            </p>
          </div>
        </div>

        <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium">Obrigado pela pontualidade.</span>
          <Link href="/mensalidades" className="text-joaninha-bordeaux font-semibold hover:underline flex items-center gap-1">
            Ver histórico <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const isOverdue = payment.status === "overdue";
  const days = daysUntil(payment.dueDate);

  const handleCopyPix = () => {
    if (payment.pixCode) {
      navigator.clipboard.writeText(payment.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Subtle top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-joaninha-bordeaux via-joaninha-red to-joaninha-bordeaux"></div>

      <div>
        {/* Top Header: Badge and Title */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 border border-joaninha-bordeaux/15 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Gestão Financeira • Mensalidade
              </span>
              <h3 className="font-display font-bold text-lg text-joaninha-black leading-tight">
                {payment.reference}
              </h3>
            </div>
          </div>

          <span className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shrink-0",
            isOverdue
              ? "bg-red-50 text-joaninha-red border border-red-200"
              : "bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/20"
          )}>
            <Calendar className="w-3 h-3" />
            {isOverdue ? `Atrasada (${Math.abs(days)}d)` : `Vence em ${days} dias`}
          </span>
        </div>

        {/* Pricing Showcase */}
        <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-100 mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-0.5">
                Valor da Parcela
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-3xl text-joaninha-black">
                  {formatCurrency(payment.totalAmount)}
                </span>
                {payment.discount > 0 && (
                  <span className="text-xs text-stone-600 line-through">
                    {formatCurrency(payment.amount)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-medium text-stone-600 block">Vencimento</span>
              <span className="text-sm font-semibold text-stone-800">
                {formatDate(payment.dueDate)}
              </span>
            </div>
          </div>

          {payment.discount > 0 && (
            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Desconto de pontualidade de {formatCurrency(payment.discount)} já aplicado</span>
            </div>
          )}

          {isOverdue && payment.fine > 0 && (
            <p className="mt-2 pt-2 border-t border-stone-200/60 text-xs text-joaninha-red font-medium">
              Acréscimo de multa por atraso: {formatCurrency(payment.fine)}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {payment.pixCode && (
            <button
              onClick={handleCopyPix}
              className={cn(
                "w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 border",
                copied
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>PIX Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copiar Código PIX</span>
                </>
              )}
            </button>
          )}

          <Link href={`/pagamento/${payment.id}`} className={cn("w-full", !payment.pixCode && "sm:col-span-2")}>
            <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-joaninha-bordeaux hover:bg-joaninha-bordeaux/90 text-white shadow-soft transition-all duration-200 flex items-center justify-center gap-1.5">
              <span>Ver Fatura & Boleto</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Footer Link & Annual teaser */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 gap-1">
          <Link href="/mensalidades" className="hover:text-joaninha-bordeaux font-medium transition-colors flex items-center gap-1">
            Ver todas as mensalidades <ChevronRight className="w-3 h-3" />
          </Link>
          
          <Link href="/pagamento/annual" className="text-joaninha-bordeaux font-semibold hover:underline flex items-center gap-0.5">
            <span>Plano Anual (10% OFF)</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

