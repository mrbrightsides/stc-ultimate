'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileBottomNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  className?: string;
}

export function MobileBottomNav({ 
  items, 
  activeItem, 
  onItemClick,
  className 
}: MobileBottomNavProps) {
  return (
    <nav 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg',
        'md:hidden', // Hide on desktop
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'relative transition-colors duration-200',
                'min-w-0 px-2', // Prevent text overflow
                'active:scale-95 transition-transform',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'h-6 w-6 transition-all duration-200',
                  isActive && 'scale-110'
                )} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium truncate w-full text-center',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Wrapper component to add padding to content when bottom nav is visible
export function MobileBottomNavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-0 md:pb-0">
      {children}
      <div className="h-16 md:hidden" /> {/* Spacer for fixed bottom nav */}
    </div>
  );
}
