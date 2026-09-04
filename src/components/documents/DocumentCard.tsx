import React from "react";
import { FileText, CheckCircle, XCircle, Clock, Upload, ExternalLink, Calendar } from "lucide-react";
import type { Document } from "@/types";
import { formatDate, cn } from "@/lib/utils";

interface DocumentCardProps {
  document: Document;
  personName?: string;
  personSubtitle?: string;
  avatarUrl?: string;
  onUploadClick?: () => void;
}

export default function DocumentCard({ 
  document, 
  personName, 
  personSubtitle, 
  avatarUrl,
  onUploadClick 
}: DocumentCardProps) {
  const isParent = document.category === "parent";
  
  const defaultName = isParent ? "Maria Clara Santos" : "Pedro Henrique Santos";
  const defaultSubtitle = isParent ? "Responsável Legal" : "Aluno(a) • Maternal I";
  const defaultAvatar = isParent 
    ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    : "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=150&h=150&fit=crop&crop=face";

  const name = personName || defaultName;
  const subtitle = personSubtitle || defaultSubtitle;
  const avatar = avatarUrl || defaultAvatar;

  const getStatusBadge = () => {
    switch (document.status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Aprovado
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Em Análise
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pendente
          </span>
        );
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="card p-4 sm:p-5 bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-elevated transition-all duration-300 overflow-hidden min-w-0">
      
      {/* Top Header: Avatar + Person Info + Status Badge */}
      <div className="flex items-start gap-3 sm:gap-3.5 mb-3.5 min-w-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-joaninha-cream flex-shrink-0 shadow-sm border border-gray-200">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-1.5 sm:gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-joaninha-black text-sm sm:text-base truncate" title={name}>
                {name}
              </h4>
              <p className="text-xs text-gray-500 truncate" title={subtitle}>
                {subtitle}
              </p>
            </div>
            <div className="shrink-0 self-start sm:self-center">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Box: Document Tile & Details */}
      <div className="bg-gray-50/90 rounded-xl p-3 mb-3.5 flex items-center gap-2.5 sm:gap-3 border border-gray-100 min-w-0">
        <div className="w-10 h-10 bg-white rounded-lg shadow-xs flex items-center justify-center flex-shrink-0 text-joaninha-bordeaux border border-gray-100">
          <FileText className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-sm text-joaninha-black truncate min-w-0" title={document.label}>
              {document.label}
            </span>
            {document.required && (
              <span className="text-[10px] font-bold text-joaninha-red shrink-0" title="Obrigatório">*</span>
            )}
          </div>

          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-0.5 gap-x-2 gap-y-0.5 min-w-0">
            {document.uploadedAt ? (
              <span className="flex items-center gap-1 min-w-0 truncate">
                <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">Enviado em {formatDate(document.uploadedAt)}</span>
              </span>
            ) : (
              <span className="text-amber-700 truncate">Aguardando envio do arquivo</span>
            )}
            {document.fileSize && (
              <span className="text-gray-400 hidden sm:inline">• {formatFileSize(document.fileSize)}</span>
            )}
          </div>
        </div>

        {document.fileUrl && (
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 text-gray-400 hover:text-joaninha-bordeaux transition-colors rounded-lg hover:bg-white shrink-0 ml-auto"
            title="Visualizar documento"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Rejection notice if applicable */}
      {document.status === "rejected" && document.rejectionReason && (
        <div className="p-3 bg-red-50 text-joaninha-red text-xs rounded-xl border border-red-100 flex items-start gap-2 mb-3">
          <XCircle size={15} className="mt-0.5 shrink-0 text-joaninha-red" />
          <div>
            <strong className="font-semibold">Motivo da recusa:</strong> {document.rejectionReason}
          </div>
        </div>
      )}

      {/* Bottom Action / Status Bar */}
      <div>
        {document.status === "pending" && (
          <button 
            type="button"
            onClick={onUploadClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs active:scale-[0.99]"
          >
            <Upload size={14} />
            Enviar Documento
          </button>
        )}

        {document.status === "rejected" && (
          <button 
            type="button"
            onClick={onUploadClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-joaninha-red hover:bg-joaninha-red-dark text-white transition-colors shadow-xs active:scale-[0.99]"
          >
            <Upload size={14} />
            Reenviar Documento
          </button>
        )}

        {document.status === "under_review" && (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-100/60">
            <Clock size={13} />
            <span>Documento enviado • Em análise pela secretaria</span>
          </div>
        )}

        {document.status === "approved" && (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100/60">
            <CheckCircle size={13} className="text-emerald-600" />
            <span>Documento verificado e aprovado</span>
          </div>
        )}
      </div>

    </div>
  );
}
