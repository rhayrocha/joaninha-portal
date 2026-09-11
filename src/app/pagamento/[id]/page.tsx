"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import BoletoView from '@/components/payments/BoletoView';
import PixView from '@/components/payments/PixView';
import { mockPayments } from '@/data/mockPayments';
import { formatCurrency, formatDateLong, cn } from '@/lib/utils';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Payment, PaymentMethod } from '@/types';

export default function PagamentoPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;
  const { user } = useAuth();
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>('pix');

  useEffect(() => {
    async function loadPayment() {
      try {
        setIsLoading(true);
        const url = user?.id ? `/api/payments/list?parentId=${user.id}` : '/api/payments/list';
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.payments && Array.isArray(data.payments)) {
            const found = data.payments.find((p: Payment) => p.id === paymentId);
            if (found) {
              if (found.id.startsWith('pay_') && (!found.pixCode || found.pixCode.includes('seed'))) {
                try {
                  const pixRes = await fetch(`/api/payments/${found.id}/pix`);
                  if (pixRes.ok) {
                    const pixData = await pixRes.json();
                    if (pixData.payload) {
                      found.pixCode = pixData.payload;
                    }
                  }
                } catch (e) {
                  console.warn('[Pagamento] Falha ao obter pix em tempo real:', e);
                }
              }
              setPayment(found);
            }
          }
        }
      } catch (err) {
        console.error('[Pagamento] Erro ao buscar pagamento:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPayment();
  }, [paymentId, user?.id]);

  if (isLoading) {
    return (
      <AppShell title="Carregando Pagamento">
        <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 text-joaninha-bordeaux animate-spin mb-3" />
          <p className="text-sm font-medium text-stone-600">Consultando fatura no Asaas...</p>
        </div>
      </AppShell>
    );
  }

  if (!payment) {
    return (
      <AppShell title="Pagamento">
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-joaninha-red mb-4" />
          <h2 className="text-xl font-bold text-joaninha-black mb-2">Pagamento não encontrado</h2>
          <button onClick={() => router.push('/mensalidades')} className="btn-secondary mt-4">
            Voltar para Mensalidades
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Pagamento">
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 animate-in">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-joaninha-gray-600 hover:text-joaninha-black mb-2 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Mensalidades
        </button>

        <div className="card-elevated bg-white p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-joaninha-red"></div>
          <p className="text-sm font-semibold text-joaninha-gray-500 uppercase tracking-wider mb-2">
            {payment.reference}
          </p>
          <h1 className="text-4xl font-display font-bold text-joaninha-black mb-2">
            {formatCurrency(payment.totalAmount || payment.amount)}
          </h1>
          {payment.discount > 0 && payment.status !== 'overdue' && (
            <p className="text-xs text-joaninha-green font-semibold mb-2">
              Desconto de pontualidade aplicado: -{formatCurrency(payment.discount)}
            </p>
          )}
          <p className="text-joaninha-gray-600 font-medium">
            Vencimento: <span className="text-joaninha-black">{formatDateLong(payment.dueDate)}</span>
          </p>
          <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-joaninha-gray-100 text-joaninha-gray-700">
            {payment.status === 'pending' ? 'Pendente' : payment.status === 'overdue' ? 'Vencido' : 'Pago'}
          </div>
        </div>

        {payment.status !== 'paid' && (
          <>
            <div className="flex p-1 bg-joaninha-gray-100 rounded-xl">
              <button
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'pix' ? "bg-white text-joaninha-black shadow-sm" : "text-joaninha-gray-500 hover:text-joaninha-black"
                )}
                onClick={() => setMethod('pix')}
              >
                PIX
              </button>
              <button
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'boleto' ? "bg-white text-joaninha-black shadow-sm" : "text-joaninha-gray-500 hover:text-joaninha-black"
                )}
                onClick={() => setMethod('boleto')}
              >
                Boleto
              </button>
            </div>

            <div className="mt-6">
              {method === 'pix' ? (
                <PixView payment={payment} />
              ) : (
                <BoletoView payment={payment} />
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
