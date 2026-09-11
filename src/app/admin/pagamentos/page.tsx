"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import PaymentGenerator from '@/components/admin/PaymentGenerator';
import { allPayments as fallbackPayments } from '@/data/mockPayments';
import type { Payment } from '@/types';

export default function AdminPagamentosPage() {
  const [payments, setPayments] = useState<Payment[]>(fallbackPayments);

  useEffect(() => {
    fetch('/api/payments/list', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.payments && Array.isArray(data.payments) && data.payments.length > 0) {
          setPayments(data.payments);
        }
      })
      .catch(err => console.warn('[Admin Pagamentos] Erro ao carregar pagamentos:', err));
  }, []);

  const payablePayments = payments.filter(
    payment => payment.status === 'pending' || payment.status === 'overdue'
  );

  return (
    <AdminShell title="Pagamentos" subtitle="Gerar boleto e PIX presencial">
      <PaymentGenerator payments={payablePayments} />
    </AdminShell>
  );
}
