"use client";

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import { DollarSign, Clock, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalStudents: number;
    receivedThisMonth: number;
    pendingThisMonth: number;
    overdueTotal: number;
    pendingDocsCount: number;
    pendingDocsList: any[];
    chartData: { month: string; received: number; pending: number }[];
    lastPaidPayments: any[];
  }>({
    totalStudents: 0,
    receivedThisMonth: 0,
    pendingThisMonth: 0,
    overdueTotal: 0,
    pendingDocsCount: 0,
    pendingDocsList: [],
    chartData: [
      { month: 'Abr', received: 0, pending: 0 },
      { month: 'Mai', received: 0, pending: 0 },
      { month: 'Jun', received: 0, pending: 0 },
      { month: 'Jul', received: 0, pending: 0 },
      { month: 'Ago', received: 0, pending: 0 },
      { month: 'Set', received: 0, pending: 0 },
    ],
    lastPaidPayments: [],
  });

  useEffect(() => {
    fetch('/api/admin/dashboard/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(err => console.warn('[Admin Dashboard] Erro ao carregar métricas:', err));
  }, []);

  return (
    <AdminShell title="Dashboard" subtitle="Visão geral financeira">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Recebido no Mês"
          value={formatCurrency(stats.receivedThisMonth)}
          icon={<DollarSign className="h-6 w-6 text-joaninha-green" />}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Pendente"
          value={formatCurrency(stats.pendingThisMonth)}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
        />
        <StatsCard
          title="Vencido"
          value={formatCurrency(stats.overdueTotal)}
          icon={<AlertTriangle className="h-6 w-6 text-joaninha-red" />}
          trend="-5%"
          trendUp={false}
        />
        <StatsCard
          title="Total Alunos"
          value={stats.totalStudents.toString()}
          icon={<Users className="h-6 w-6 text-blue-500" />}
        />
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-card">
        <h3 className="mb-6 font-display text-lg font-bold text-joaninha-black">Receita nos últimos 6 meses</h3>
        <div className="h-80 w-full">
          <RevenueChart data={stats.chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-6 font-display text-lg font-bold text-joaninha-black">Últimos Pagamentos</h3>
          <div className="space-y-4">
            {stats.lastPaidPayments && stats.lastPaidPayments.length > 0 ? (
              stats.lastPaidPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between rounded-xl border border-joaninha-gray-100 p-4">
                  <div>
                    <p className="font-semibold text-joaninha-black">{payment.parentName || 'Responsável'}</p>
                    <p className="text-xs text-joaninha-gray-400">{payment.childName}</p>
                    <p className="text-sm text-joaninha-gray-500">{formatDate(payment.paidAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-joaninha-green">{formatCurrency(payment.amount)}</p>
                    <span className="inline-flex rounded-full bg-joaninha-green-light px-2 py-1 text-xs font-semibold text-joaninha-green">
                      Pago
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-joaninha-gray-400 py-6 text-center">Nenhum pagamento liquidado registrado ainda.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-joaninha-black">Documentos Pendentes</h3>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-joaninha-red-light text-sm font-bold text-joaninha-red">
              {stats.pendingDocsCount}
            </span>
          </div>
          
          <div className="space-y-4">
            {stats.pendingDocsList && stats.pendingDocsList.length > 0 ? (
              stats.pendingDocsList.slice(0, 3).map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl border border-joaninha-gray-100 p-4">
                  <div>
                    <p className="font-semibold text-joaninha-black">{doc.label}</p>
                    <p className="text-xs text-joaninha-gray-400">{doc.childName} • {doc.parentName}</p>
                    <p className="text-sm text-joaninha-gray-500">Enviado em {doc.uploadedAt ? formatDate(doc.uploadedAt) : 'Data não informada'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      Em Análise
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-joaninha-gray-400 py-6 text-center">Nenhum documento pendente de análise.</p>
            )}
          </div>

          <Link href="/admin/documentos" className="mt-6 flex items-center justify-center text-sm font-medium text-joaninha-bordeaux hover:underline">
            Ver todos os documentos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
