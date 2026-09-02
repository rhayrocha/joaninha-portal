"use client";

import React, { useState } from "react";
import { Payment } from "@/types";
import { Copy, Download, Check } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BoletoViewProps {
  payment: Payment;
}

export default function BoletoView({ payment }: BoletoViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (payment.barcode) {
      navigator.clipboard.writeText(payment.barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    alert("PDF gerado com sucesso!");
  };

  return (
    <div className="card border border-joaninha-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-joaninha-gray-200 p-4 flex items-center justify-between bg-joaninha-gray-50">
        <h3 className="font-display font-bold text-lg text-joaninha-black">Banco Joaninha S.A.</h3>
        <span className="font-bold text-lg tracking-widest text-joaninha-black">001-9</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-joaninha-gray-500 mb-2">Código de barras</p>
          <div className="font-mono text-sm md:text-base p-4 bg-joaninha-gray-50 rounded-xl border border-joaninha-gray-200 break-all text-center tracking-widest text-joaninha-black">
            {payment.barcode || "34191.09008 61713.957308 71444.640008 5 91870000000000"}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {/* Fake barcode visualization */}
          <div className="h-16 flex items-end gap-[2px] opacity-80">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-joaninha-black h-full"
                style={{ width: `${Math.max(1, Math.floor(Math.random() * 4))}px` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 md:col-span-2">
            <p className="text-xs text-joaninha-gray-500">Beneficiário</p>
            <p className="font-medium text-joaninha-black">Joaninha Creche Escola Bilíngue</p>
          </div>
          <div className="col-span-1">
            <p className="text-xs text-joaninha-gray-500">Vencimento</p>
            <p className="font-medium text-joaninha-black">{formatDate(payment.dueDate)}</p>
          </div>
          <div className="col-span-1">
            <p className="text-xs text-joaninha-gray-500">Valor Total</p>
            <p className="font-medium text-joaninha-black">{formatCurrency(payment.totalAmount)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleCopy}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copiado!" : "Copiar código de barras"}
          </button>
          <button 
            onClick={handleDownload}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
