"use client";

import AppShell from '@/components/layout/AppShell';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DocumentAlert from '@/components/dashboard/DocumentAlert';
import NextPaymentCard from '@/components/dashboard/NextPaymentCard';
import DailyRoutineCard from '@/components/dashboard/DailyRoutineCard';
import SchoolAgendaCard from '@/components/dashboard/SchoolAgendaCard';
import CameraPreview from '@/components/dashboard/CameraPreview';
import { mockDocuments } from '@/data/mockDocuments';
import { mockPayments } from '@/data/mockPayments';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const pendingDocsCount = mockDocuments.filter(doc => doc.status !== 'approved').length;
  
  const sortedPayments = [...mockPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextPayment = sortedPayments.find(p => p.status === 'pending' || p.status === 'overdue') || null;

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
            <DocumentAlert pendingCount={pendingDocsCount} totalCount={mockDocuments.length} />
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
