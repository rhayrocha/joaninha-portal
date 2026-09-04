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
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:shadow-card transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Discreet badge + text */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-joaninha-cream text-joaninha-bordeaux flex items-center justify-center shrink-0 border border-joaninha-bordeaux/15 shadow-2xs">
            <Sparkles className="w-4 h-4 text-joaninha-red" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-joaninha-bordeaux uppercase tracking-wider">
                Condição Especial • Plano Anual
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                10% OFF
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Economize <strong className="text-stone-900 font-semibold">{formatCurrency(savings)}</strong> antecipando a anuidade do ano letivo ({formatCurrency(discountedTotal)} à vista).
            </p>
          </div>
        </div>

        {/* Right: Compact Action */}
        <Link href="/pagamento/annual" className="shrink-0 self-end sm:self-center">
          <button className="py-2 px-4 rounded-xl text-xs font-semibold bg-joaninha-cream hover:bg-joaninha-bordeaux hover:text-white text-joaninha-bordeaux border border-joaninha-bordeaux/20 transition-all duration-200 flex items-center gap-1.5 shadow-2xs group">
            <span>Ver Condições</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>

      </div>
    </div>
  );
}
