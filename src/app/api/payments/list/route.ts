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
    const matchedAsaasIds = new Set<string>();

    // Clona os pagamentos base e mescla com os pagamentos reais do Asaas
    const mergedPayments: Payment[] = mockPayments.map((mock) => {
      const refMonth = mock.reference.split('/')[0].toLowerCase();
      const mockMonth = mock.dueDate.slice(0, 7);

      // Prioridade 1: Nome do mês na descrição (agosto, setembro, outubro)
      // Prioridade 2: Mês do vencimento
      let asaasMatch = asaasPayments.find((ap: any) => 
        !matchedAsaasIds.has(ap.id) && (ap.description || '').toLowerCase().includes(refMonth)
      );

      if (!asaasMatch) {
        asaasMatch = asaasPayments.find((ap: any) => 
          !matchedAsaasIds.has(ap.id) && ap.dueDate && ap.dueDate.startsWith(mockMonth)
        );
      }

      if (asaasMatch) {
        matchedAsaasIds.add(asaasMatch.id);
        const isPaid = asaasMatch.status === 'RECEIVED' || asaasMatch.status === 'CONFIRMED';
        const isOverdue = asaasMatch.status === 'OVERDUE';
        const discountVal = asaasMatch.discount?.value ?? (mock.discount || 0);
        const fineVal = asaasMatch.fine?.value ?? (mock.fine || 0);

        // Se tem desconto e não está vencido, valor a pagar é líquido; se pago, o valor pago
        let calculatedTotal = asaasMatch.value;
        if (discountVal > 0 && !isOverdue && !isPaid) {
          calculatedTotal = Math.max(0, asaasMatch.value - discountVal);
        } else if (isOverdue && fineVal > 0) {
          calculatedTotal = asaasMatch.value + fineVal;
        }

        return {
          ...mock,
          id: asaasMatch.id,
          dueDate: asaasMatch.dueDate || mock.dueDate,
          amount: asaasMatch.value,
          discount: discountVal,
          fine: fineVal,
          totalAmount: calculatedTotal,
          status: isPaid ? ('paid' as const) : isOverdue ? ('overdue' as const) : ('pending' as const),
          paidAt: isPaid ? (asaasMatch.paymentDate || asaasMatch.clientPaymentDate || new Date().toISOString()) : undefined,
          paidAmount: isPaid ? (asaasMatch.netValue || asaasMatch.value) : undefined,
          barcode: asaasMatch.identificationField || mock.barcode,
          pixCode: asaasMatch.pixQrCode || mock.pixCode,
          pixQrCodeData: asaasMatch.pixQrCode || mock.pixQrCodeData,
          isAsaas: true,
        };
      }

      return {
        ...mock,
        isAsaas: false,
      };
    });

    // Inclui eventuais cobranças extras que existam no Asaas e não estejam no mock
    const extraAsaasPayments = asaasPayments.filter((ap: any) => !matchedAsaasIds.has(ap.id));
    for (const ap of extraAsaasPayments) {
      const isPaid = ap.status === 'RECEIVED' || ap.status === 'CONFIRMED';
      const isOverdue = ap.status === 'OVERDUE';
      const discountVal = ap.discount?.value || 0;
      const fineVal = ap.fine?.value || 0;

      let calculatedTotal = ap.value;
      if (discountVal > 0 && !isOverdue && !isPaid) {
        calculatedTotal = Math.max(0, ap.value - discountVal);
      } else if (isOverdue && fineVal > 0) {
        calculatedTotal = ap.value + fineVal;
      }

      mergedPayments.push({
        id: ap.id,
        childId: 'child_001',
        childName: 'Pedro Henrique Santos',
        parentName: 'Maria Clara Santos',
        reference: ap.description || `Mensalidade ${ap.dueDate}`,
        dueDate: ap.dueDate,
        amount: ap.value,
        discount: discountVal,
        fine: fineVal,
        totalAmount: calculatedTotal,
        status: isPaid ? ('paid' as const) : isOverdue ? ('overdue' as const) : ('pending' as const),
        paymentPlan: 'monthly',
        paidAt: isPaid ? (ap.paymentDate || ap.clientPaymentDate) : undefined,
        paidAmount: isPaid ? ap.value : undefined,
        barcode: ap.identificationField,
        pixCode: ap.pixQrCode,
        pixQrCodeData: ap.pixQrCode,
        isAsaas: true,
      });
    }

    return NextResponse.json({
      payments: mergedPayments,
      source: 'asaas_live',
      asaasCount: asaasPayments.length,
      matchedCount: matchedAsaasIds.size,
    });
  } catch (error: any) {
    console.error('[API Payments List] Erro:', error);
    return NextResponse.json({ payments: mockPayments, source: 'mock_error' });
  }
}
