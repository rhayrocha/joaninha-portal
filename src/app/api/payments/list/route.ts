import { NextResponse } from 'next/server';
import { mockPayments } from '@/data/mockPayments';
import type { Payment } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.ASAAS_API_KEY;
  const env = process.env.ASAAS_ENVIRONMENT || 'sandbox';

  // Se não houver chave do Asaas, retorna os dados base
  if (!apiKey) {
    return NextResponse.json({ payments: mockPayments, source: 'mock' });
  }

  try {
    const baseUrl = env === 'production'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';

    const res = await fetch(`${baseUrl}/payments?limit=50`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('[API Payments List] Falha ao consultar Asaas, usando fallback');
      return NextResponse.json({ payments: mockPayments, source: 'mock_fallback' });
    }

    const asaasData = await res.json();
    const asaasPayments = asaasData.data || [];

    // Clona os pagamentos base e mescla com os pagamentos reais do Asaas
    const mergedPayments: Payment[] = mockPayments.map((mock) => {
      const refMonth = mock.reference.split('/')[0].toLowerCase();
      const mockMonth = mock.dueDate.slice(0, 7);

      // Prioridade 1: Nome do mês na descrição (agosto, setembro, outubro)
      // Prioridade 2: Mês do vencimento
      let asaasMatch = asaasPayments.find((ap: any) => 
        (ap.description || '').toLowerCase().includes(refMonth)
      );

      if (!asaasMatch) {
        asaasMatch = asaasPayments.find((ap: any) => 
          ap.dueDate && ap.dueDate.startsWith(mockMonth)
        );
      }

      if (asaasMatch) {
        const isPaid = asaasMatch.status === 'RECEIVED' || asaasMatch.status === 'CONFIRMED';
        const isOverdue = asaasMatch.status === 'OVERDUE' || (mock.status === 'overdue' && !isPaid);

        return {
          ...mock,
          id: asaasMatch.id,
          amount: asaasMatch.value,
          totalAmount: asaasMatch.value,
          status: isPaid ? ('paid' as const) : isOverdue ? ('overdue' as const) : ('pending' as const),
          paidAt: isPaid ? (asaasMatch.paymentDate || asaasMatch.clientPaymentDate || new Date().toISOString()) : undefined,
          paidAmount: isPaid ? asaasMatch.value : undefined,
          barcode: asaasMatch.identificationField || mock.barcode,
          pixCode: asaasMatch.pixQrCode || mock.pixCode,
          pixQrCodeData: asaasMatch.pixQrCode || mock.pixQrCodeData,
        };
      }

      return mock;
    });

    return NextResponse.json({
      payments: mergedPayments,
      source: 'asaas_live',
      asaasCount: asaasPayments.length,
    });
  } catch (error: any) {
    console.error('[API Payments List] Erro:', error);
    return NextResponse.json({ payments: mockPayments, source: 'mock_error' });
  }
}
