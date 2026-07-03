'use client';

import { Skeleton } from './skeleton';
import { NeonCard } from './neon-card';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'dashboard' | 'service' | 'stats';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant, count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <NeonCard glowColor="gray" className="opacity-60">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg bg-gray-700/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-gray-700/50" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-gray-700/50" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700/50" />
                <Skeleton className="h-4 w-2/3 bg-gray-700/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-1/2 bg-gray-700/50" />
                  <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-1/2 bg-gray-700/50" />
                  <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded bg-gray-700/50" />
            </div>
          </NeonCard>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-700 bg-gray-800/20">
                <Skeleton className="h-10 w-10 rounded bg-gray-700/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
                  <Skeleton className="h-3 w-1/2 bg-gray-700/50" />
                </div>
                <Skeleton className="h-8 w-20 rounded bg-gray-700/50" />
              </div>
            ))}
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-2/3 mx-auto bg-gray-700/50" />
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded bg-gray-700/50" />
                  <Skeleton className="h-4 w-24 bg-gray-700/50" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded bg-gray-700/50" />
                  <Skeleton className="h-4 w-32 bg-gray-700/50" />
                </div>
              </div>
            </div>

            {/* Progress Card Skeleton */}
            <NeonCard glowColor="gray" className="opacity-60">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded bg-gray-700/50" />
                    <Skeleton className="h-6 w-40 bg-gray-700/50" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-8 w-16 bg-gray-700/50" />
                    <Skeleton className="h-4 w-24 bg-gray-700/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 bg-gray-700/50" />
                    <Skeleton className="h-4 w-12 bg-gray-700/50" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full bg-gray-700/50" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-8 w-20 mx-auto bg-gray-700/50" />
                      <Skeleton className="h-3 w-16 mx-auto bg-gray-700/50" />
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>

            {/* Services Grid Skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <LoadingSkeleton key={i} variant="service" />
              ))}
            </div>
          </div>
        );

      case 'service':
        return (
          <NeonCard glowColor="gray" className="opacity-60">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg bg-gray-700/50" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-gray-700/50" />
                    <Skeleton className="h-4 w-48 bg-gray-700/50" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-gray-700/50" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 bg-gray-700/50" />
                  <Skeleton className="h-5 w-20 bg-gray-700/50" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 bg-gray-700/50" />
                  <Skeleton className="h-4 w-24 bg-gray-700/50" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded bg-gray-700/50" />
            </div>
          </NeonCard>
        );

      case 'stats':
        return (
          <NeonCard glowColor="gray" className="opacity-60">
            <div className="grid md:grid-cols-3 divide-x divide-gray-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-8 space-y-2 text-center">
                  <Skeleton className="h-10 w-20 mx-auto bg-gray-700/50" />
                  <Skeleton className="h-4 w-24 mx-auto bg-gray-700/50" />
                </div>
              ))}
            </div>
          </NeonCard>
        );

      default:
        return <Skeleton className="h-20 w-full bg-gray-700/50" />;
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 && index < count - 1 ? 'mb-6' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

// Specialized loading components
export function ServiceLoadingCard() {
  return (
    <NeonCard glowColor="cyan" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-shimmer" />
      <div className="relative space-y-4 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm text-cyan-400 font-medium">Activating Service...</p>
          <p className="text-xs text-gray-400 mt-1">Processing blockchain transaction</p>
        </div>
      </div>
    </NeonCard>
  );
}

export function WalletConnectingSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
      <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
      <span className="text-sm text-purple-300">Connecting wallet...</span>
    </div>
  );
}

export function TransactionPendingSkeleton({ transactionType }: { transactionType: string }) {
  return (
    <NeonCard glowColor="orange" className="text-center">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Transaction Pending</h3>
          <p className="text-sm text-gray-400">{transactionType} in progress...</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-orange-300">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </NeonCard>
  );
}