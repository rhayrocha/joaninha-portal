"use client";

import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import DocumentProgressBar from '@/components/documents/DocumentProgressBar';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { mockDocuments } from '@/data/mockDocuments';
import { useAuth } from '@/contexts/AuthContext';
import type { Document } from '@/types';

export default function DocumentosPage() {
  const { user, children } = useAuth();
  const mainChild = children && children.length > 0 ? children[0] : null;

  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const url = user?.id ? `/api/documents/list?parentId=${user.id}` : '/api/documents/list';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.documents && Array.isArray(data.documents)) {
          setDocuments(data.documents);
        }
      }
    } catch (err) {
      console.error('[Documentos] Erro ao carregar documentos:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user?.id]);

  const parentDocs = documents.filter(doc => doc.category === 'parent');
  const childDocs = documents.filter(doc => doc.category === 'child');

  const requiredDocs = documents.filter(d => d.required);
  const completedDocs = requiredDocs.filter(d => d.status === 'approved' || d.status === 'under_review');

  const handleUpload = async (docId: string, file: File) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    // Atualização otimista imediata na interface
    setDocuments(prev => prev.map(d => 
      d.id === docId 
        ? { ...d, status: 'under_review' as const, uploadedAt: new Date().toISOString(), fileName: file.name, fileSize: file.size } 
        : d
    ));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentId', docId);
      formData.append('type', doc.type);
      formData.append('label', doc.label);
      formData.append('category', doc.category);
      if (mainChild?.id) formData.append('studentId', mainChild.id);
      if (user?.id) formData.append('parentId', user.id);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.document) {
          setDocuments(prev => prev.map(d => 
            d.id === docId ? { ...d, ...data.document } : d
          ));
        }
      }
    } catch (err) {
      console.error('[Upload Document Error]:', err);
    } finally {
      setUploadingDocId(null);
    }
  };

  const renderDocSection = (title: string, docs: Document[]) => (
    <section>
      <h2 className="text-xl font-display font-bold text-joaninha-black mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="space-y-3">
            <DocumentCard 
              document={doc}
              personName={doc.category === 'parent' ? (user?.name || "Responsável Legal") : (mainChild?.name || "Aluno(a)")}
              personSubtitle={doc.category === 'parent' ? "Responsável Legal" : `Aluno(a) • ${mainChild?.className || "Turma da Criança"}`}
              avatarUrl={doc.category === 'parent' ? user?.avatarUrl : mainChild?.photoUrl}
              onUploadClick={() => {
                if (doc.status === 'pending' || doc.status === 'rejected') {
                  setUploadingDocId(uploadingDocId === doc.id ? null : doc.id);
                }
              }}
            />
            {uploadingDocId === doc.id && (doc.status === 'pending' || doc.status === 'rejected') && (
              <DocumentUploader 
                documentId={doc.id}
                label={doc.label}
                onUpload={(file) => handleUpload(doc.id, file)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <AppShell title="Documentos">
      <div className="p-4 sm:p-6 space-y-8 animate-in max-w-5xl mx-auto">
        <DocumentProgressBar completed={completedDocs.length} total={requiredDocs.length} />

        {renderDocSection("Documentos do Responsável", parentDocs)}
        {renderDocSection("Documentos do Aluno", childDocs)}
      </div>
    </AppShell>
  );
}
