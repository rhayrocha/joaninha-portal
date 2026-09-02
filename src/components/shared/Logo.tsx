import React from 'react';
import { cn } from '@/lib/utils';
import LadybugIcon from './LadybugIcon';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  whiteText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, whiteText = false, className }: LogoProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 80,
  };

  const px = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <LadybugIcon size={px} />
      {showText && (
        <div className="mt-2 text-center flex flex-col items-center">
          <span className={cn("font-display font-bold", whiteText ? "text-white" : "text-joaninha-red")} style={{ fontSize: px * 0.5, lineHeight: 1.1 }}>
            Joaninha
          </span>
          <span className={cn("font-sans tracking-wide", whiteText ? "text-white/80" : "text-joaninha-black")} style={{ fontSize: px * 0.18, textTransform: 'uppercase', marginTop: '2px' }}>
            Creche Escola Bilíngue
          </span>
        </div>
      )}
    </div>
  );
}
