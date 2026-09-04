"use client";

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PaymentCard from '@/components/payments/PaymentCard';
import AnnualPaymentCard from '@/components/payments/AnnualPaymentCard';
import { mockPayments } from '@/data/mockPayments';
import { formatCurrency, cn } from '@/lib/utils';
import { FileText, Clock, CheckCircle } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'paid' | 'overdue';

export default function MensalidadesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  
  const paidPayments = mockPayments.filter(p => p.status === 'paid');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const overduePayments = mockPayments.filter(p => p.status === 'overdue');

  const filteredPayments = mockPayments.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const sortedPayments = filteredPayments.sort((a, b) => {
    const statusOrder: Record<string, number> = { overdue: 0, pending: 1, paid: 2, cancelled: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  });

  const hasAnnualPayment = mockPayments.some(p => p.paymentPlan === 'annual');

  return (
    <AppShell title="Mensalidades">
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto animate-in">
        
        {!hasAnnualPayment && <AnnualPaymentCard />}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-elevated bg-white p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-joaninha-gray-100 flex items-center justify-center text-joaninha-gray-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-joaninha-gray-500 font-medium">Mensalidades Pendentes</p>
              <p className="text-xl font-bold text-joaninha-black">{pendingPayments.length}</p>
            </div>
          </div>
          
          <div className="card-elevated bg-white p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-joaninha-red-light flex items-center justify-center text-joaninha-red">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-joaninha-gray-500 font-medium">Mensalidades Vencidas</p>
              <p className={cn("text-xl font-bold", overduePayments.length > 0 ? "text-joaninha-red" : "text-joaninha-black")}>
                {overduePayments.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'paid', label: 'Pagas' },
            { id: 'overdue', label: 'Vencidas' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                filter === f.id
                  ? "bg-joaninha-red text-white"
                  : "bg-white text-joaninha-gray-600 hover:bg-joaninha-gray-50 border border-joaninha-gray-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedPayments.length > 0 ? (
            sortedPayments.map(payment => (
              <PaymentCard key={payment.id} payment={payment} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-joaninha-gray-500 bg-white rounded-2xl border border-dashed border-joaninha-gray-300">
              Nenhuma mensalidade encontrada para este filtro.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
