import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  label: string;
  colorClass: string;
  dotColor?: string;
  className?: string;
}

export default function StatusBadge({ label, colorClass, dotColor, className }: StatusBadgeProps) {
  return (
    <span className={cn('badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', colorClass, className)}>
      {dotColor && (
        <span 
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)} 
        />
      )}
      {label}
    </span>
  );
}
