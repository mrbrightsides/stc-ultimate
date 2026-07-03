'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import type { MNEETokenInfo } from '@/lib/mnee-token';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface TreasuryDashboardProps {
  mneeInfo: MNEETokenInfo | null;
  escrows: TourEscrow[];
  splits: RevenueSplit[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export function TreasuryDashboard({
  mneeInfo,
  escrows,
  splits,
  onRefresh,
  isLoading = false
}: TreasuryDashboardProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Calculate treasury statistics
  const stats = {
    totalBalance: mneeInfo?.userBalance || '0',
    totalBalanceUSD: mneeInfo?.usdValue || '0',
    
    // Escrow stats
    totalEscrows: escrows.length,
    activeEscrows: escrows.filter(e => e.status === 0 || e.status === 1).length,
    completedEscrows: escrows.filter(e => e.status === 2).length,
    escrowVolumeUSD: escrows.reduce((sum, e) => sum + parseFloat(e.amountUSD), 0).toFixed(2),
    
    // Split stats
    totalSplits: splits.length,
    executedSplits: splits.filter(s => s.status === 1).length,
    splitVolumeUSD: splits.reduce((sum, s) => sum + parseFloat(s.totalAmountUSD), 0).toFixed(2),
    
    // Revenue breakdown
    totalRevenueUSD: (
      escrows.filter(e => e.status === 2).reduce((sum, e) => sum + parseFloat(e.amountUSD), 0) +
      splits.filter(s => s.status === 1).reduce((sum, s) => sum + parseFloat(s.totalAmountUSD), 0)
    ).toFixed(2),
  };

  // Calculate growth (mock for demo)
  const growth = {
    balance: '+12.5%',
    escrows: '+8.3%',
    splits: '+15.7%',
    revenue: '+18.2%',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Treasury Dashboard
          </h2>
          <p className="text-gray-400 mt-2">
            Manage MNEE stablecoin funds and automated financial workflows
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Timeframe selector */}
          <div className="flex gap-2">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <NeonButton
                key={tf}
                size="sm"
                variant={timeframe === tf ? 'primary' : 'secondary'}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </NeonButton>
            ))}
          </div>
          
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            loading={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </NeonButton>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Total Balance */}
        <NeonCard glowColor="cyan">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Wallet className="h-5 w-5 text-cyan-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {growth.balance}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-white mt-1">
                {parseFloat(stats.totalBalance).toLocaleString()} MNEE
              </p>
              <p className="text-sm text-cyan-400">
                ${parseFloat(stats.totalBalanceUSD).toLocaleString()} USD
              </p>
            </div>
          </div>
        </NeonCard>

        {/* Total Revenue */}
        <NeonCard glowColor="green">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {growth.revenue}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${parseFloat(stats.totalRevenueUSD).toLocaleString()}
              </p>
              <p className="text-sm text-green-400">
                {timeframe} period
              </p>
            </div>
          </div>
        </NeonCard>

        {/* Active Escrows */}
        <NeonCard glowColor="purple">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {growth.escrows}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Escrows</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.activeEscrows}
              </p>
              <p className="text-sm text-purple-400">
                {stats.totalEscrows} total
              </p>
            </div>
          </div>
        </NeonCard>

        {/* Revenue Splits */}
        <NeonCard glowColor="orange">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {growth.splits}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Revenue Splits</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.executedSplits}
              </p>
              <p className="text-sm text-orange-400">
                ${parseFloat(stats.splitVolumeUSD).toLocaleString()} distributed
              </p>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Activity Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Escrow Activity */}
        <NeonCard glowColor="cyan">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Escrow Activity
              </h3>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                {stats.totalEscrows} total
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Escrow breakdown */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-300">Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {escrows.filter(e => e.status === 0).length}
                  </span>
                  <div className="w-32">
                    <Progress 
                      value={(escrows.filter(e => e.status === 0).length / stats.totalEscrows) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {escrows.filter(e => e.status === 1).length}
                  </span>
                  <div className="w-32">
                    <Progress 
                      value={(escrows.filter(e => e.status === 1).length / stats.totalEscrows) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Released</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {stats.completedEscrows}
                  </span>
                  <div className="w-32">
                    <Progress 
                      value={(stats.completedEscrows / stats.totalEscrows) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cyan-500/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Volume</span>
                <span className="text-xl font-bold text-cyan-400">
                  ${parseFloat(stats.escrowVolumeUSD).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </NeonCard>

        {/* Recent Transactions */}
        <NeonCard glowColor="purple">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-400" />
                Recent Activity
              </h3>
            </div>

            <div className="space-y-3">
              {/* Recent escrows */}
              {escrows.slice(0, 5).map((escrow, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      escrow.status === 2 ? 'bg-green-500/20' : 
                      escrow.status === 1 ? 'bg-blue-500/20' : 
                      'bg-orange-500/20'
                    }`}>
                      {escrow.status === 2 ? <CheckCircle className="h-4 w-4 text-green-400" /> :
                       escrow.status === 1 ? <AlertCircle className="h-4 w-4 text-blue-400" /> :
                       <Clock className="h-4 w-4 text-orange-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{escrow.serviceName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(escrow.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-400">
                      ${parseFloat(escrow.amountUSD).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{escrow.statusText}</p>
                  </div>
                </div>
              ))}

              {escrows.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Split Distribution */}
      <NeonCard glowColor="green">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-400" />
              Revenue Distribution
            </h3>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              ${parseFloat(stats.splitVolumeUSD).toLocaleString()} total
            </Badge>
          </div>

          {splits.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Calculate total by role */}
              {(() => {
                const roleDistribution: Record<string, { total: number; count: number }> = {};
                
                splits.forEach(split => {
                  split.recipients.forEach(recipient => {
                    if (!roleDistribution[recipient.role]) {
                      roleDistribution[recipient.role] = { total: 0, count: 0 };
                    }
                    roleDistribution[recipient.role].total += parseFloat(recipient.amountUSD);
                    roleDistribution[recipient.role].count += 1;
                  });
                });

                return Object.entries(roleDistribution).slice(0, 6).map(([role, data], index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-black/30 border border-green-500/20"
                  >
                    <p className="text-sm text-gray-400">{role}</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                      ${data.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.count} payments
                    </p>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No revenue splits yet</p>
            </div>
          )}
        </div>
      </NeonCard>
    </div>
  );
}
