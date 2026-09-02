"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendUp = true,
  colorClass = "bg-white text-joaninha-black"
}: StatsCardProps) {
  return (
    <div className={cn("p-6 rounded-2xl shadow-card flex items-start gap-4 transition-all duration-300 hover:shadow-elevated", colorClass)}>
      <div className="p-4 rounded-xl bg-gray-50/50 backdrop-blur-sm shrink-0 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-500 mb-1 truncate">{title}</h3>
        <p className="text-3xl font-display font-bold mb-1 truncate">{value}</p>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {trend && (
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md",
              trendUp ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
            )}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-gray-500 truncate">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
