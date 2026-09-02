"use client";

import React from 'react';
import Link from 'next/link';
import { Gift, ChevronRight, Star } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-joaninha-red to-joaninha-bordeaux shadow-elevated p-1 md:p-1.5 animate-in">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-10 -translate-x-10 w-64 h-64 bg-joaninha-pink opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative bg-gradient-to-br from-joaninha-bordeaux/90 to-joaninha-black/40 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-white/10">
        
        {/* Badge */}
        <div className="absolute -top-3 -right-3 md:top-6 md:right-6 rotate-12 md:rotate-6 bg-joaninha-cream text-joaninha-bordeaux font-bold px-4 py-1.5 rounded-xl shadow-lg border border-white/50 text-sm flex items-center gap-1.5 transform hover:rotate-0 transition-transform">
           <Star className="w-4 h-4 fill-joaninha-red text-joaninha-red" />
           {discountPercent}% OFF
        </div>

        {/* Left Content */}
        <div className="flex-1 text-center md:text-left z-10 w-full">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/90 text-xs font-semibold mb-4 border border-white/10">
             <Gift className="w-3.5 h-3.5" />
             CONDIÇÃO ESPECIAL
           </div>
           
           <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
             Pague o ano todo com {discountPercent}% de desconto!
           </h3>
           
           <p className="text-joaninha-pink-light text-sm md:text-base mb-6 max-w-md mx-auto md:mx-0">
             Garanta a vaga para o ano inteiro, evite reajustes e ainda economize no orçamento familiar.
           </p>

           <div className="flex flex-col sm:flex-row items-center gap-4 text-left bg-black/20 rounded-2xl p-4 border border-white/5 w-full max-w-lg">
              <div className="flex-1">
                 <span className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1">De</span>
                 <span className="text-white/40 line-through font-semibold text-lg">{formatCurrency(annualTotal)}</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10"></div>
              <div className="flex-1">
                 <span className="text-white/80 text-xs font-medium uppercase tracking-wider block mb-1">Por apenas</span>
                 <span className="text-white font-bold text-2xl md:text-3xl text-gradient-to-r from-white to-joaninha-cream drop-shadow-sm">{formatCurrency(discountedTotal)}</span>
              </div>
           </div>
        </div>

        {/* Right Content - CTA */}
        <div className="flex flex-col items-center md:items-end z-10 w-full md:w-auto mt-2 md:mt-0">
           <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold px-4 py-2 rounded-xl mb-6 text-sm whitespace-nowrap flex items-center gap-2">
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             Economia de {formatCurrency(savings)}
           </div>

           <Link href="/pagamento/annual" className="w-full md:w-auto">
             <button className="w-full group bg-white text-joaninha-bordeaux hover:bg-joaninha-cream hover:text-joaninha-red px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
               Gerar pagamento anual
               <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </Link>
           <span className="text-white/40 text-xs mt-3 text-center block">
             Pagamento via PIX ou Boleto bancário
           </span>
        </div>
      </div>
    </div>
  );
}
