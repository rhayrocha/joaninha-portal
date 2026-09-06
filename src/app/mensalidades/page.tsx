"use client";

import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import PaymentCard from '@/components/payments/PaymentCard';
import AnnualPaymentCard from '@/components/payments/AnnualPaymentCard';
import { mockPayments } from '@/data/mockPayments';
import { formatCurrency, cn } from '@/lib/utils';
import { FileText, Clock, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import type { Payment } from '@/types';

type FilterType = 'all' | 'pending' | 'paid' | 'overdue';

export default function MensalidadesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAsaasLive, setIsAsaasLive] = useState(false);

  const fetchPayments = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/payments/list', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.payments && Array.isArray(data.payments)) {
          setPayments(data.payments);
          if (data.source === 'asaas_live') {
            setIsAsaasLive(true);
          }
        }
      }
    } catch (err) {
      console.error('[Mensalidades] Erro ao sincronizar com Asaas:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const filteredPayments = payments.filter(p => {
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

  const hasAnnualPayment = payments.some(p => p.paymentPlan === 'annual');

  return (
    <AppShell title="Mensalidades">
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto animate-in">
        
        {/* Sync Status Banner */}
        {isAsaasLive && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">Sincronização em Tempo Real com Asaas Sandbox Ativa</span>
            </div>
            <button 
              onClick={fetchPayments}
              disabled={isSyncing}
              className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
              <span>{isSyncing ? "Atualizando..." : "Atualizar Status"}</span>
            </button>
          </div>
        )}

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
