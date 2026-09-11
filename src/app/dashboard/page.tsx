"use client";

import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DocumentAlert from '@/components/dashboard/DocumentAlert';
import NextPaymentCard from '@/components/dashboard/NextPaymentCard';
import DailyRoutineCard from '@/components/dashboard/DailyRoutineCard';
import SchoolAgendaCard from '@/components/dashboard/SchoolAgendaCard';
import CameraPreview from '@/components/dashboard/CameraPreview';
import { useAuth } from '@/contexts/AuthContext';
import type { Payment, Document } from '@/types';

export default function DashboardPage() {
  const { user, children } = useAuth();
  const [nextPayment, setNextPayment] = useState<Payment | null>(null);
  const [pendingDocsCount, setPendingDocsCount] = useState(0);
  const [totalDocsCount, setTotalDocsCount] = useState(4);

  useEffect(() => {
    if (!user) return;

    // 1. Carrega faturas da família
    fetch(`/api/payments/list?parentId=${user.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.payments && Array.isArray(data.payments)) {
          const sorted = [...data.payments].sort(
            (a: Payment, b: Payment) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
          const next = sorted.find(p => p.status === 'pending' || p.status === 'overdue') || null;
          setNextPayment(next);
        }
      })
      .catch(err => console.warn('[Dashboard] Erro ao carregar fatura:', err));

    // 2. Carrega documentos da família
    fetch(`/api/documents/list?parentId=${user.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.documents && Array.isArray(data.documents)) {
          setTotalDocsCount(data.documents.length);
          const pending = data.documents.filter((d: Document) => d.status !== 'approved').length;
          setPendingDocsCount(pending);
        }
      })
      .catch(err => console.warn('[Dashboard] Erro ao carregar docs:', err));
  }, [user?.id]);

  return (
    <AppShell title="Dashboard" subtitle="Espaço Exclusivo da Família">
      <div className="space-y-6 sm:space-y-8 animate-in pb-12">
        {/* 1. Hero Spotlight: Parent & Child Overview */}
        <WelcomeCard />

        {/* 2. Primary Management Row: Finance & Cadastral Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="h-full">
            <NextPaymentCard payment={nextPayment} />
          </div>
          <div className="h-full">
            <DocumentAlert pendingCount={pendingDocsCount} totalCount={totalDocsCount} />
          </div>
        </div>

        {/* 3. Daily Pedagogical Experience, Nutrition & School Community Agenda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 h-full">
            <DailyRoutineCard />
          </div>
          <div className="lg:col-span-5 h-full">
            <SchoolAgendaCard />
          </div>
        </div>

        {/* 4. Closed-Circuit Security Monitoring */}
        <div>
          <CameraPreview />
        </div>
      </div>
    </AppShell>
  );
}
