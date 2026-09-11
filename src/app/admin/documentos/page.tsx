"use client";

import React, { useState, useMemo } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import DocumentReviewCard from '@/components/admin/DocumentReviewCard';
import type { Document as DocType } from '@/types';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

type Tab = 'Em Análise' | 'Aprovados' | 'Rejeitados' | 'Todos';

export default function AdminDocumentosPage() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('Em Análise');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/documents/list', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.documents && Array.isArray(data.documents)) {
          setDocuments(data.documents);
        }
      }
    } catch (err) {
      console.error('[Admin Documentos] Erro ao carregar documentos do Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const stats = useMemo(() => {
    return {
      pendentes: documents.filter(d => d.status === 'under_review').length,
      aprovados: documents.filter(d => d.status === 'approved').length,
      rejeitados: documents.filter(d => d.status === 'rejected').length,
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    switch (activeTab) {
      case 'Em Análise': return documents.filter(d => d.status === 'under_review');
      case 'Aprovados': return documents.filter(d => d.status === 'approved');
      case 'Rejeitados': return documents.filter(d => d.status === 'rejected');
      case 'Todos': return documents;
    }
  }, [documents, activeTab]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/admin/documents/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, action: 'approved' }),
      });
      if (res.ok) {
        setDocuments(prev => prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'Admin' } 
            : doc
        ));
        showToast('Documento aprovado no Supabase com sucesso!');
      } else {
        showToast('Erro ao aprovar documento no banco de dados.');
      }
    } catch {
      showToast('Erro de conexão ao aprovar documento.');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/documents/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, action: 'rejected', rejectionReason: reason }),
      });
      if (res.ok) {
        setDocuments(prev => prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString(), reviewedBy: 'Admin' } 
            : doc
        ));
        showToast('Documento rejeitado e registrado no Supabase!');
      } else {
        showToast('Erro ao rejeitar documento.');
      }
    } catch {
      showToast('Erro de conexão ao rejeitar documento.');
    }
  };

  const getParentName = (doc: any) => {
    return doc.parentName || 'Responsável';
  };

  const getStudentName = (doc: any) => {
    return doc.childName || 'Aluno(a)';
  };

  const getParentAvatar = (doc: any) => {
    return doc.avatarUrl;
  };

  return (
    <AdminShell title="Documentos" subtitle="Aprovação de documentos">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center rounded-xl bg-joaninha-black p-4 text-white shadow-elevated animate-slide-in-right">
          <CheckCircle className="mr-2 h-5 w-5 text-joaninha-green" />
          {toastMessage}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-joaninha-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-joaninha-black">{stats.pendentes}</p>
          </div>
        </div>
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-joaninha-green-light text-joaninha-green">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-joaninha-gray-500">Aprovados</p>
            <p className="text-2xl font-bold text-joaninha-black">{stats.aprovados}</p>
          </div>
        </div>
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-joaninha-red-light text-joaninha-red">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-joaninha-gray-500">Rejeitados</p>
            <p className="text-2xl font-bold text-joaninha-black">{stats.rejeitados}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['Em Análise', 'Aprovados', 'Rejeitados', 'Todos'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-joaninha-bordeaux text-white shadow-soft"
                : "bg-white text-joaninha-gray-600 hover:bg-joaninha-gray-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <DocumentReviewCard
              key={doc.id}
              document={doc}
              parentName={(doc as any).parentName || getParentName(doc)}
              childName={(doc as any).childName || getStudentName(doc)}
              avatarUrl={(doc as any).avatarUrl || getParentAvatar(doc)}
              onApprove={(id) => handleApprove(id)}
              onReject={(id, reason) => handleReject(id, reason)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-card">
            <FileText className="mb-4 h-12 w-12 text-joaninha-gray-300" />
            <h3 className="text-lg font-medium text-joaninha-black">Nenhum documento encontrado</h3>
            <p className="mt-1 text-joaninha-gray-500">Não há documentos com o status atual.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
