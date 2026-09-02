import React from "react";

interface DocumentProgressBarProps {
  completed: number;
  total: number;
}

export default function DocumentProgressBar({ completed, total }: DocumentProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-joaninha-gray-600">Progresso da documentação</span>
        <span className="text-sm font-bold text-joaninha-green">{completed} de {total} enviados</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-joaninha-green h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
