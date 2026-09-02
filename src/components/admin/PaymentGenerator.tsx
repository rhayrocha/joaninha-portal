"use client";

import React, { useState } from 'react';
import type { Payment } from '@/types';
import { Search, Receipt, CreditCard, QrCode, X } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import BoletoView from '@/components/payments/BoletoView';
import PixView from '@/components/payments/PixView';

interface PaymentGeneratorProps {
  payments: Payment[];
}

export default function PaymentGenerator({ payments }: PaymentGeneratorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'boleto' | 'pix'>('pix');

  const filteredPayments = searchTerm.trim().length > 0 
    ? payments.filter(p => 
        (p.status === 'pending' || p.status === 'overdue') && 
        (p.childName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (p.parentName && p.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
         p.reference?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : payments.filter(p => p.status === 'pending' || p.status === 'overdue').slice(0, 6);

  const handleSelectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Left panel: Search and Select */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-5 border-b border-gray-100 bg-white">
           <h3 className="font-display font-bold text-lg mb-4">Buscar Pagamento</h3>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               className="input-field pl-10 bg-gray-50 border-gray-200"
               placeholder="Nome do responsável ou aluno..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {searchTerm.length <= 2 ? (
            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
               <Receipt className="w-10 h-10 mb-2 opacity-50" />
               <p className="text-sm">Digite pelo menos 3 caracteres<br/>para buscar pagamentos pendentes</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum pagamento pendente encontrado.</div>
          ) : (
            filteredPayments.map(payment => (
              <button
                key={payment.id}
                onClick={() => handleSelectPayment(payment)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200",
                  selectedPayment?.id === payment.id 
                    ? "bg-joaninha-bordeaux/5 border-joaninha-bordeaux/20 shadow-sm"
                    : "bg-white border-gray-100 hover:border-joaninha-bordeaux/30 hover:shadow-sm"
                )}
              >
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-joaninha-black">{payment.reference} - {payment.childName}</span>
                    <span className="font-bold text-joaninha-red">{formatCurrency(payment.totalAmount || payment.amount)}</span>
                 </div>
                 <div className="text-xs text-gray-500">Vencimento: {formatDate(payment.dueDate)}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel: Generate View */}
      <div className="flex-1 bg-white flex flex-col relative">
         {selectedPayment ? (
           <>
             <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setSelectedPayment(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col items-center pt-12 md:pt-8">
               <h2 className="text-2xl font-display font-bold text-center mb-2">Gerar Pagamento</h2>
               <p className="text-gray-500 text-center mb-8">{selectedPayment.reference} • {selectedPayment.childName}</p>
               
               <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-full max-w-sm mx-auto">
                 <button
                   onClick={() => setPaymentMethod('pix')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
                     paymentMethod === 'pix' ? "bg-white text-joaninha-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                   )}
                 >
                   <QrCode className="w-4 h-4" />
                   PIX
                 </button>
                 <button
                   onClick={() => setPaymentMethod('boleto')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
                     paymentMethod === 'boleto' ? "bg-white text-joaninha-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                   )}
                 >
                   <CreditCard className="w-4 h-4" />
                   Boleto
                 </button>
               </div>

               <div className="w-full max-w-xl mx-auto">
                 {paymentMethod === 'pix' ? (
                   <PixView payment={selectedPayment} />
                 ) : (
                   <BoletoView payment={selectedPayment} />
                 )}
               </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                 <Receipt className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">Nenhum pagamento selecionado</h3>
              <p className="text-sm max-w-xs">Busque um responsável ou aluno e selecione um pagamento pendente para gerar o boleto ou PIX para pagamento presencial.</p>
           </div>
         )}
      </div>
    </div>
  );
}
