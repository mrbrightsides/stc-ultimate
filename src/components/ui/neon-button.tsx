'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function NeonButton({ 
  children, 
  onClick,
  className, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false
}: NeonButtonProps) {
  const variants = {
    primary: 'border-cyan-500 text-cyan-400 shadow-cyan-500/50 hover:shadow-cyan-500/75 hover:text-cyan-300',
    secondary: 'border-purple-500 text-purple-400 shadow-purple-500/50 hover:shadow-purple-500/75 hover:text-purple-300',
    success: 'border-green-500 text-green-400 shadow-green-500/50 hover:shadow-green-500/75 hover:text-green-300',
    warning: 'border-orange-500 text-orange-400 shadow-orange-500/50 hover:shadow-orange-500/75 hover:text-orange-300',
    danger: 'border-red-500 text-red-400 shadow-red-500/50 hover:shadow-red-500/75 hover:text-red-300',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative rounded-lg border-2 bg-black/60 backdrop-blur-sm font-medium transition-all duration-300',
        'shadow-lg hover:shadow-xl active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </span>
    </button>
  );
}