"use client";

import AppShell from '@/components/layout/AppShell';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DocumentAlert from '@/components/dashboard/DocumentAlert';
import NextPaymentCard from '@/components/dashboard/NextPaymentCard';
import CameraPreview from '@/components/dashboard/CameraPreview';
import { mockDocuments } from '@/data/mockDocuments';
import { mockPayments } from '@/data/mockPayments';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const pendingDocsCount = mockDocuments.filter(doc => doc.status !== 'approved').length;
  
  const sortedPayments = [...mockPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextPayment = sortedPayments.find(p => p.status === 'pending' || p.status === 'overdue');

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 animate-in">
        <div className="col-span-1 md:col-span-2">
          <WelcomeCard />
        </div>
        
        <div className="col-span-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <DocumentAlert pendingCount={pendingDocsCount} totalCount={mockDocuments.length} />
        </div>
        
        <div className="col-span-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {nextPayment ? (
            <NextPaymentCard payment={nextPayment} />
          ) : (
            <div className="card h-full flex items-center justify-center bg-white p-6 rounded-2xl shadow-soft">
              <p className="text-joaninha-gray-500 font-medium">Nenhuma mensalidade pendente!</p>
            </div>
          )}
        </div>
        
        <div className="col-span-1 md:col-span-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CameraPreview />
        </div>
      </div>
    </AppShell>
  );
}
