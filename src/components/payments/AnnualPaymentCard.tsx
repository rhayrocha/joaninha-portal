"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AnnualPaymentCardProps {
  monthlyAmount?: number;
  discountPercent?: number;
}

export default function AnnualPaymentCard({ 
  monthlyAmount = 2200, 
  discountPercent = 10 
}: AnnualPaymentCardProps) {
  
  const annualTotal = monthlyAmount * 12;
  const discountedTotal = annualTotal * (1 - discountPercent / 100);
  const savings = annualTotal - discountedTotal;

  return (
    <div className="card p-6 md:p-7 rounded-3xl bg-gradient-to-br from-white via-joaninha-off-white to-joaninha-cream/40 border border-joaninha-gray-200/80 shadow-card hover:shadow-soft transition-all duration-300 relative overflow-hidden">
      {/* Subtle top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-joaninha-bordeaux via-joaninha-red to-joaninha-bordeaux"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left column: Badge, Title & Description */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-joaninha-cream text-joaninha-bordeaux border border-joaninha-bordeaux/20">
              <Sparkles className="w-3.5 h-3.5 text-joaninha-red" />
              Condição Especial • {discountPercent}% OFF
            </span>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-joaninha-black leading-snug">
              Plano Anual com 10% de Desconto
            </h3>
            <p className="text-sm text-joaninha-gray-600 mt-1 max-w-xl">
              Antecipe a anuidade de 12 meses do seu filho com desconto especial, garantindo a vaga do ano letivo com economia de {formatCurrency(savings)}.
            </p>
          </div>

          {/* Pricing summary */}
          <div className="flex flex-wrap items-baseline gap-3 pt-1">
            <span className="text-xs font-semibold text-gray-400 line-through">
              De {formatCurrency(annualTotal)}
            </span>
            <span className="text-2xl font-display font-bold text-joaninha-bordeaux">
              Por {formatCurrency(discountedTotal)}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              Economia de {formatCurrency(savings)}
            </span>
          </div>
        </div>

        {/* Right column: CTA button */}
        <div className="lg:text-right shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <Link href="/pagamento/annual" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-joaninha-bordeaux hover:bg-joaninha-bordeaux/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-soft hover:shadow-elevated flex items-center justify-center gap-2 group">
              <span>Optar pelo Plano Anual</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <span className="text-[11px] text-gray-400">
            Pagamento à vista via PIX ou Boleto
          </span>
        </div>

      </div>
    </div>
  );
}
