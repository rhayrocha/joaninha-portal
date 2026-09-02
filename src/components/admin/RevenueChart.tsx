"use client";

import React from 'react';

interface DataPoint {
  month: string;
  received: number;
  pending: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.received + d.pending));
  const scale = maxValue > 0 ? 100 / maxValue : 1;

  return (
    <div className="w-full flex flex-col">
      <div className="h-48 flex items-end gap-2 sm:gap-4 relative mt-4 px-2">
        {/* Y-axis grid lines (optional visual enhancement) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((percent) => (
             <div key={percent} className="w-full border-t border-gray-100 flex items-center">
                 {/* <span className="text-[10px] text-gray-400 absolute -left-8 -translate-y-1/2">{Math.round((maxValue * percent) / 100)}</span> */}
             </div>
          ))}
        </div>

        {/* Bars */}
        {data.map((item, index) => {
          const receivedHeight = item.received * scale;
          const pendingHeight = item.pending * scale;
          const totalHeight = receivedHeight + pendingHeight;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
              <div 
                className="w-full max-w-[40px] flex flex-col-reverse rounded-t-md overflow-hidden transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{ height: `${totalHeight}%`, minHeight: totalHeight > 0 ? '4px' : '0' }}
                title={`Recebido: R$ ${item.received}\nPendente: R$ ${item.pending}`}
              >
                {/* Received portion (bottom) */}
                <div 
                  className="w-full bg-joaninha-green" 
                  style={{ height: `${(item.received / (item.received + item.pending)) * 100}%` }}
                ></div>
                {/* Pending portion (top) */}
                <div 
                  className="w-full bg-amber-400" 
                  style={{ height: `${(item.pending / (item.received + item.pending)) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-3 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-joaninha-green"></div>
          <span className="text-sm font-medium text-gray-600">Recebido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <span className="text-sm font-medium text-gray-600">Pendente</span>
        </div>
      </div>
    </div>
  );
}
