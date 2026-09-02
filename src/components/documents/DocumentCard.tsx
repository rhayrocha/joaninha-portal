import React from "react";
import { FileText, CheckCircle, XCircle, Clock, Upload } from "lucide-react";
import type { Document } from "@/types";
import { formatDate, getDocumentStatusConfig, cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const statusConfig = getDocumentStatusConfig(document.status);
  
  const getBorderColor = () => {
    switch (document.status) {
      case "approved": return "border-joaninha-green";
      case "rejected": return "border-joaninha-red";
      case "under_review": return "border-blue-400";
      default: return "border-amber-400";
    }
  };

  const getIcon = () => {
    switch (document.status) {
      case "approved": return <CheckCircle className="text-joaninha-green" size={24} />;
      case "rejected": return <XCircle className="text-joaninha-red" size={24} />;
      case "under_review": return <Clock className="text-blue-400" size={24} />;
      default: return <Upload className="text-amber-500" size={24} />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("card p-5 rounded-2xl border-l-4 transition-all", getBorderColor())}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-joaninha-gray-50 rounded-xl shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-joaninha-black">{document.label}</h3>
            <StatusBadge 
              status={document.status}
              label={statusConfig.label}
              colorClass={statusConfig.color}
              dotColor={statusConfig.dot}
            />
          </div>
          <p className="text-sm text-joaninha-gray-500 mb-2">{document.description}</p>

          {document.status === "rejected" && document.rejectionReason && (
            <div className="p-2.5 bg-red-50 text-joaninha-red text-xs rounded-lg border border-red-100 flex items-start gap-2 mb-2">
              <XCircle size={14} className="mt-0.5 shrink-0" />
              <p><strong>Motivo:</strong> {document.rejectionReason}</p>
            </div>
          )}

          {document.fileName && (document.status === "approved" || document.status === "under_review") && (
            <div className="flex items-center gap-2 text-xs text-joaninha-gray-500 bg-joaninha-gray-50 px-3 py-2 rounded-lg">
              <FileText size={14} className="shrink-0" />
              <span className="truncate font-medium">{document.fileName}</span>
              {document.fileSize && (
                <span className="text-joaninha-gray-400">• {formatFileSize(document.fileSize)}</span>
              )}
              {document.uploadedAt && (
                <span className="text-joaninha-gray-400 hidden sm:inline">• {formatDate(document.uploadedAt)}</span>
              )}
            </div>
          )}

          {document.status === "pending" && (
            <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
              <Upload size={14} />
              <span>Clique para enviar este documento</span>
            </div>
          )}

          {!document.required && (
            <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-joaninha-gray-400 font-semibold">
              Opcional
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
