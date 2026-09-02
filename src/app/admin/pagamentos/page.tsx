"use client";

import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import PaymentGenerator from '@/components/admin/PaymentGenerator';
import { allPayments } from '@/data/mockPayments';

export default function AdminPagamentosPage() {
  const payablePayments = allPayments.filter(
    payment => payment.status === 'pending' || payment.status === 'overdue'
  );

  return (
    <AdminShell title="Pagamentos" subtitle="Gerar boleto e PIX presencial">
      <PaymentGenerator payments={payablePayments} />
    </AdminShell>
  );
}
