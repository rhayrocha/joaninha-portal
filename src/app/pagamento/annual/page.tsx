"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import PixView from '@/components/payments/PixView';
import BoletoView from '@/components/payments/BoletoView';
import { ArrowLeft, Tag } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import type { Payment, PaymentMethod } from '@/types';

export default function AnnualPaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('pix');

  const annualPayment: Payment = {
    id: 'annual_001',
    childId: 'child_001',
    childName: 'Pedro Henrique Santos',
    reference: 'Anual 2026',
    dueDate: '2026-09-20',
    amount: 26400,
    discount: 2640,
    fine: 0,
    totalAmount: 23760,
    status: 'pending',
    paymentPlan: 'annual',
    barcode: '23793.38128 60000.000003 00000.000400 1 90260000237600',
    pixCode: '00020126580014br.gov.bcb.pix0136annual-2026-joaninha-creche520400005303986540523760.005802BR5925JOANINHA CRECHE ESCOLA BI6014SAO PAULO SP62070503***6304ANNU',
    pixQrCodeData: '00020126580014br.gov.bcb.pix0136annual-2026-joaninha-creche520400005303986540523760.005802BR5925JOANINHA CRECHE ESCOLA BI6014SAO PAULO SP62070503***6304ANNU',
  };

  return (
    <AppShell title="Pagamento Anual">
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 animate-in">
        <button 
          onClick={() => router.push('/mensalidades')}
          className="flex items-center gap-2 text-joaninha-gray-600 hover:text-joaninha-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para Mensalidades</span>
        </button>

        <div className="card-elevated bg-white p-6 rounded-2xl border border-joaninha-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-joaninha-green-light rounded-bl-full opacity-50 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-joaninha-green text-white rounded-full flex items-center justify-center mb-2 shadow-soft">
              <Tag size={32} />
            </div>
            
            <h2 className="text-2xl font-display font-bold text-joaninha-black">Pagamento Anual</h2>
            <p className="text-joaninha-gray-600">12 meses com 10% de desconto</p>
            
            <div className="pt-4 flex flex-col items-center">
              <span className="text-lg text-joaninha-gray-400 line-through">
                {formatCurrency(26400)}
              </span>
              <span className="text-4xl font-bold text-joaninha-green my-2">
                {formatCurrency(23760)}
              </span>
              <div className="bg-joaninha-green-light text-joaninha-green px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                <span>Economia de {formatCurrency(2640)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-joaninha-gray-50 p-1 rounded-xl">
          <button
            onClick={() => setMethod('pix')}
            className={cn(
              "flex-1 py-3 text-center rounded-lg font-medium transition-all",
              method === 'pix' ? "bg-white text-joaninha-black shadow-sm" : "text-joaninha-gray-500 hover:text-joaninha-gray-700"
            )}
          >
            PIX
          </button>
          <button
            onClick={() => setMethod('boleto')}
            className={cn(
              "flex-1 py-3 text-center rounded-lg font-medium transition-all",
              method === 'boleto' ? "bg-white text-joaninha-black shadow-sm" : "text-joaninha-gray-500 hover:text-joaninha-gray-700"
            )}
          >
            Boleto
          </button>
        </div>

        <div className="mt-6">
          {method === 'pix' ? (
            <PixView payment={annualPayment} />
          ) : (
            <BoletoView payment={annualPayment} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
