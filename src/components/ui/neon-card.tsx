'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'pink';
  intense?: boolean;
  onClick?: () => void;
}

export function NeonCard({ 
  children, 
  className, 
  glowColor = 'cyan', 
  intense = false,
  onClick
}: NeonCardProps) {
  const glowClasses = {
    cyan: 'shadow-cyan-500/50 border-cyan-500/50 hover:shadow-cyan-500/75 hover:border-cyan-500/75',
    purple: 'shadow-purple-500/50 border-purple-500/50 hover:shadow-purple-500/75 hover:border-purple-500/75',
    green: 'shadow-green-500/50 border-green-500/50 hover:shadow-green-500/75 hover:border-green-500/75',
    orange: 'shadow-orange-500/50 border-orange-500/50 hover:shadow-orange-500/75 hover:border-orange-500/75',
    pink: 'shadow-pink-500/50 border-pink-500/50 hover:shadow-pink-500/75 hover:border-pink-500/75',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-2 bg-black/40 backdrop-blur-sm transition-all duration-300',
        'shadow-lg hover:shadow-xl',
        intense ? 'shadow-2xl hover:shadow-3xl' : '',
        glowClasses[glowColor],
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-black/20" />
      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
}