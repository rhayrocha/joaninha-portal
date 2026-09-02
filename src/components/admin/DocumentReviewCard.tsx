"use client";

import React, { useState } from 'react';
import type { Document } from '@/types';
import { CheckCircle, XCircle, FileText, User, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DocumentReviewCardProps {
  document: Document;
  parentName: string;
  childName?: string;
  avatarUrl?: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function DocumentReviewCard({
  document,
  parentName,
  childName,
  avatarUrl,
  onApprove,
  onReject
}: DocumentReviewCardProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    onApprove(document.id);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      onReject(document.id, rejectReason);
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  return (
    <div className="card p-5 bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-elevated transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-joaninha-cream flex-shrink-0 shadow-sm border border-gray-200 flex items-center justify-center">
          <img 
            src={avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"} 
            alt={parentName} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-joaninha-black truncate">{parentName}</h4>
              {childName && <p className="text-sm text-gray-500 truncate">Resp. por {childName}</p>}
            </div>
            <span className="badge bg-amber-100 text-amber-800 border-amber-200">
              Pendente
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 text-joaninha-bordeaux">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
               <span className="font-medium text-sm text-joaninha-black truncate">{document.label || document.type}</span>
               <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <Calendar className="w-3 h-3 mr-1" />
                  Enviado em {document.uploadedAt ? formatDate(document.uploadedAt) : 'Aguardando envio'}
               </div>
            </div>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="ml-auto p-2 text-gray-400 hover:text-joaninha-bordeaux transition-colors rounded-lg hover:bg-white" title="Visualizar documento">
               <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Actions or Reject Form */}
          {!isRejecting ? (
             <div className="flex gap-2">
               <button 
                 onClick={handleApprove}
                 className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-sm font-semibold transition-colors border border-emerald-200"
               >
                 <CheckCircle className="w-4 h-4" />
                 Aprovar
               </button>
               <button 
                 onClick={() => setIsRejecting(true)}
                 className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 rounded-lg text-sm font-semibold transition-colors border border-rose-200"
               >
                 <XCircle className="w-4 h-4" />
                 Rejeitar
               </button>
             </div>
          ) : (
            <div className="animate-fade-in bg-rose-50 rounded-xl p-3 border border-rose-100">
              <label className="block text-xs font-semibold text-rose-800 mb-1">Motivo da Rejeição</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Documento ilegível, data vencida..."
                className="w-full text-sm p-2 rounded-lg border-rose-200 focus:ring-rose-500 focus:border-rose-500 mb-2 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-rose-600 text-white hover:bg-rose-700 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => { setIsRejecting(false); setRejectReason(''); }}
                  className="flex-1 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
