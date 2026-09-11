"use client";

import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import PaymentCard from '@/components/payments/PaymentCard';
import AnnualPaymentCard from '@/components/payments/AnnualPaymentCard';
import { formatCurrency, cn } from '@/lib/utils';
import { FileText, Clock, CheckCircle, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Payment } from '@/types';

type FilterType = 'all' | 'pending' | 'paid' | 'overdue' | 'asaas';

export default function MensalidadesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingAsaas, setIsGeneratingAsaas] = useState(false);
  const [isAsaasLive, setIsAsaasLive] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsSyncing(true);
    try {
      const url = user?.id ? `/api/payments/list?parentId=${user.id}` : '/api/payments/list';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.payments && Array.isArray(data.payments)) {
          setPayments(data.payments);
          if (data.source === 'supabase_live' || data.source === 'asaas_live') {
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

  const handleGenerateAsaas = async () => {
    setIsGeneratingAsaas(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/payments/sync-asaas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: user?.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMessage(data.message);
        await fetchPayments();
      } else {
        setSyncMessage(data.error || 'Erro ao gerar cobranças no Asaas');
      }
    } catch {
      setSyncMessage('Erro de conexão ao gerar cobranças no Asaas');
    } finally {
      setIsGeneratingAsaas(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user?.id]);

  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const asaasPayments = payments.filter(p => p.isAsaas);

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'asaas') return p.isAsaas;
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-900 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <div>
                <p className="font-semibold text-sm text-emerald-950">
                  Sincronização com Asaas Sandbox Ativa
                </p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  <strong>{asaasPayments.length} cobranças reais no Asaas</strong> • {payments.length - asaasPayments.length} do histórico anterior
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleGenerateAsaas}
                disabled={isGeneratingAsaas || isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all text-xs disabled:opacity-50"
                title="Gera cobranças no Asaas Sandbox para mensalidades pendentes"
              >
                <Zap className={cn("w-3.5 h-3.5", isGeneratingAsaas && "animate-spin")} />
                <span>{isGeneratingAsaas ? "Gerando..." : "Gerar Restantes no Sandbox"}</span>
              </button>
              <button 
                onClick={fetchPayments}
                disabled={isSyncing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 font-medium transition-colors text-xs"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                <span>{isSyncing ? "..." : "Atualizar"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Sync Feedback Message */}
        {syncMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
            <span>{syncMessage}</span>
            <button onClick={() => setSyncMessage(null)} className="text-blue-600 font-bold ml-2">✕</button>
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
            { id: 'all', label: 'Todas as Mensalidades' },
            { id: 'pending', label: `Pendentes (${pendingPayments.length})` },
            { id: 'paid', label: `Pagas (${paidPayments.length})` },
            { id: 'overdue', label: `Vencidas (${overduePayments.length})` },
            { id: 'asaas', label: `🟢 No Asaas (${asaasPayments.length})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                filter === f.id
                  ? (f.id === 'asaas' ? "bg-emerald-600 text-white" : "bg-joaninha-red text-white")
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
            <div className="col-span-full py-12 px-4 text-center bg-white rounded-3xl border border-dashed border-stone-300 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-joaninha-black mb-1">
                Nenhuma mensalidade encontrada
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mb-4">
                {payments.length === 0 
                  ? "Este responsável ainda não possui faturas cadastradas no banco de dados. Você pode gerar cobranças de teste no Asaas Sandbox abaixo:" 
                  : "Nenhuma fatura corresponde ao filtro selecionado."}
              </p>
              {payments.length === 0 && (
                <button
                  type="button"
                  onClick={handleGenerateAsaas}
                  disabled={isGeneratingAsaas}
                  className="btn-primary py-2.5 px-5 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <Zap className={cn("w-4 h-4", isGeneratingAsaas && "animate-spin")} />
                  <span>{isGeneratingAsaas ? "Gerando Faturas no Sandbox..." : "Gerar Mensalidades de Teste no Asaas"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
