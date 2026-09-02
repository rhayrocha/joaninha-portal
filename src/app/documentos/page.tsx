"use client";

import { useState } from 'react';
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

  const parentDocs = documents.filter(doc => doc.category === 'parent');
  const childDocs = documents.filter(doc => doc.category === 'child');

  const requiredDocs = documents.filter(d => d.required);
  const completedDocs = requiredDocs.filter(d => d.status === 'approved' || d.status === 'under_review');

  const handleUpload = (docId: string, _file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'under_review' as const, uploadedAt: new Date().toISOString(), fileName: _file.name, fileSize: _file.size } 
        : doc
    ));
    setUploadingDocId(null);
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
              personName={doc.category === 'parent' ? (user?.name || "Maria Clara Santos") : (mainChild?.name || "Pedro Henrique Santos")}
              personSubtitle={doc.category === 'parent' ? "Responsável Legal" : `Aluno(a) • ${mainChild?.className || "Maternal I"}`}
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
