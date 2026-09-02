"use client";

import React, { useState } from "react";
import { Payment } from "@/types";
import { Copy, Check } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { QRCodeSVG } from 'qrcode.react';

interface PixViewProps {
  payment: Payment;
  className?: string;
}

export default function PixView({ payment, className }: PixViewProps) {
  const [copied, setCopied] = useState(false);
  const pixCode = payment.pixCode || "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Joaninha Ltda6009Sao Paulo62070503***6304E123";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("card p-6 sm:p-8 rounded-2xl border border-joaninha-gray-200 bg-white overflow-hidden w-full max-w-full shadow-card", className)}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        {/* QR Code Section */}
        <div className="w-full md:w-64 md:shrink-0 flex flex-col items-center justify-center p-4 bg-joaninha-gray-50/60 rounded-2xl border border-joaninha-gray-100">
          <h3 className="font-display font-bold text-base text-joaninha-black mb-4 text-center">
            Pague via QR Code
          </h3>
          
          <div className="p-3 bg-white border-2 border-joaninha-green-light rounded-2xl mb-4 shadow-sm inline-block">
            <QRCodeSVG value={pixCode} size={180} />
          </div>
          
          <p className="text-sm font-bold text-joaninha-black text-center">
            {formatCurrency(payment.totalAmount || payment.amount)}
          </p>
          <p className="text-[11px] text-joaninha-gray-500 text-center mt-0.5">
            Joaninha Creche Escola Bilíngue
          </p>
        </div>

        {/* Instructions & Copy Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pt-4 md:pt-0">
          <div>
            <h4 className="font-semibold text-joaninha-black mb-3 text-base">Instruções para pagamento</h4>
            
            <ul className="space-y-2.5 mb-5">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-joaninha-gray-600">
                <span className="flex items-center justify-center bg-joaninha-red text-white rounded-full w-5 h-5 text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <span>Abra o app do seu banco e acesse a área <strong>PIX</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-joaninha-gray-600">
                <span className="flex items-center justify-center bg-joaninha-red text-white rounded-full w-5 h-5 text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <span>Escolha <strong>Ler QR Code</strong> ou <strong>Pix Copia e Cola</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-joaninha-gray-600">
                <span className="flex items-center justify-center bg-joaninha-red text-white rounded-full w-5 h-5 text-[11px] font-bold shrink-0 mt-0.5">3</span>
                <span>Confira os dados da <strong>Joaninha Creche</strong> e conclua.</span>
              </li>
            </ul>

            {/* Pix Code Container with strict boundary containment */}
            <div className="bg-joaninha-gray-50 p-3.5 rounded-xl border border-joaninha-gray-200 mb-4 w-full overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-joaninha-gray-600">Código PIX (Copia e Cola)</span>
                <span className="text-[10px] text-joaninha-gray-400">Validade: 24h</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 max-h-24 overflow-y-auto w-full">
                <p className="font-mono text-[11px] text-joaninha-black [overflow-wrap:anywhere] break-all leading-relaxed select-all">
                  {pixCode}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCopy}
            className="w-full py-3 px-4 bg-joaninha-red hover:bg-joaninha-red-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-soft active:scale-[0.99]"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Código PIX Copiado com Sucesso!" : "Copiar Código PIX"}
          </button>
        </div>
      </div>
    </div>
  );
}
