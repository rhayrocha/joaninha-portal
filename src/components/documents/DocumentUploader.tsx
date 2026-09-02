"use client";

import React, { useState, useRef } from "react";
import { Upload, File as FileIcon, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  documentId: string;
  label: string;
  onUpload: (file: File) => void;
}

export default function DocumentUploader({ documentId, label, onUpload }: DocumentUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Formato inválido. Use PDF, JPG ou PNG.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. O tamanho máximo é 10MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    
    // Simulate upload
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setIsSuccess(true);
        onUpload(file);
      }
    }, 200);
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-joaninha-green-light border border-joaninha-green rounded-xl text-center">
        <CheckCircle className="text-joaninha-green w-12 h-12 mb-2" />
        <h4 className="font-semibold text-joaninha-green">Enviado com sucesso!</h4>
        <p className="text-sm text-joaninha-green mt-1">O documento está em análise.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!file ? (
        <div 
          className={cn(
            "dropzone",
            isDragActive ? "dropzone-active" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={inputRef} 
            onChange={handleChange} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Upload className="w-10 h-10 text-joaninha-gray-400 mb-3" />
          <p className="font-medium text-joaninha-black">Arraste o arquivo aqui</p>
          <p className="text-sm text-joaninha-gray-500 mt-1">ou clique para selecionar</p>
          <p className="text-xs text-joaninha-gray-400 mt-4">Formatos aceitos: PDF, JPG, PNG (Max 10MB)</p>
        </div>
      ) : (
        <div className="border border-joaninha-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="w-8 h-8 text-joaninha-red shrink-0" />
              <div className="truncate">
                <p className="font-medium text-sm text-joaninha-black truncate">{file.name}</p>
                <p className="text-xs text-joaninha-gray-500">{formatSize(file.size)}</p>
              </div>
            </div>
            {!isUploading && (
              <button 
                onClick={() => setFile(null)}
                className="text-joaninha-gray-400 hover:text-joaninha-red"
              >
                Cancelar
              </button>
            )}
          </div>
          
          {isUploading ? (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-joaninha-gray-500">Enviando...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-joaninha-gray-200 rounded-full h-2">
                <div 
                  className="bg-joaninha-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleUpload}
              className="btn-primary w-full"
            >
              Confirmar Envio
            </button>
          )}
        </div>
      )}
    </div>
  );
}
