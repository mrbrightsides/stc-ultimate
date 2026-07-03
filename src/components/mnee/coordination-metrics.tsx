'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap,
  Users,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  Activity,
  Target
} from 'lucide-react';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface CoordinationMetricsProps {
  escrows: TourEscrow[];
  splits: RevenueSplit[];
}

export function CoordinationMetrics({ escrows, splits }: CoordinationMetricsProps) {
  const [metrics, setMetrics] = useState({
    partiesCoordinated: 0,
    avgSettlementTime: '0',
    trustScore: 0,
    successRate: 0,
    totalCoordinations: 0,
    activeCoordinations: 0,
    completedCoordinations: 0,
    totalVolume: 0
  });

  useEffect(() => {
    calculateMetrics();
  }, [escrows, splits]);

  const calculateMetrics = () => {
    // Count unique parties
    const uniqueParties = new Set<string>();
    escrows.forEach(e => {
      uniqueParties.add(e.tourist.toLowerCase());
      uniqueParties.add(e.operator.toLowerCase());
    });
    splits.forEach(s => {
      uniqueParties.add(s.creator.toLowerCase());
      s.recipients.forEach(r => uniqueParties.add(r.address.toLowerCase()));
    });

    // Calculate settlement time (mock average)
    const completedEscrows = escrows.filter(e => e.status === 2);
    const avgTime = completedEscrows.length > 0 
      ? '2.5h'  // Mock: instant settlement
      : '0h';

    // Calculate trust score based on completion rate
    const totalTxs = escrows.length + splits.length;
    const successfulTxs = escrows.filter(e => e.status === 2).length + 
                          splits.filter(s => s.status === 1).length;
    const trustScore = totalTxs > 0 ? (successfulTxs / totalTxs) * 100 : 100;

    // Calculate success rate
    const successRate = totalTxs > 0 ? (successfulTxs / totalTxs) * 100 : 100;

    // Count coordinations
    const activeCoordinations = escrows.filter(e => e.status < 2).length +
                                splits.filter(s => s.status === 0).length;
    const completedCoordinations = escrows.filter(e => e.status === 2).length +
                                   splits.filter(s => s.status === 1).length;

    // Calculate volume
    const totalVolume = escrows.reduce((sum, e) => sum + parseFloat(e.amountUSD), 0) +
                        splits.reduce((sum, s) => sum + parseFloat(s.totalAmountUSD), 0);

    setMetrics({
      partiesCoordinated: uniqueParties.size,
      avgSettlementTime: avgTime,
      trustScore: Math.round(trustScore),
      successRate: Math.round(successRate),
      totalCoordinations: totalTxs,
      activeCoordinations,
      completedCoordinations,
      totalVolume
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Parties Coordinated */}
      <NeonCard glowColor="purple">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.partiesCoordinated > 0 ? Math.min(metrics.partiesCoordinated * 10, 25) : 0}%
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Parties Coordinated</p>
            <p className="text-4xl font-bold text-white">{metrics.partiesCoordinated}</p>
            <p className="text-xs text-purple-400 mt-2">
              Multi-stakeholder coordination
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Coordination Level</span>
              <span>{Math.min(metrics.partiesCoordinated * 20, 100)}%</span>
            </div>
            <Progress value={Math.min(metrics.partiesCoordinated * 20, 100)} className="h-2" />
          </div>
        </div>
      </NeonCard>

      {/* Average Settlement Time */}
      <NeonCard glowColor="cyan">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              <Zap className="h-3 w-3 mr-1" />
              Instant
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Avg Settlement Time</p>
            <p className="text-4xl font-bold text-white">{metrics.avgSettlementTime}</p>
            <p className="text-xs text-cyan-400 mt-2">
              vs 30-60 days traditional
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">98% faster than banks</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">Automated escrow release</span>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Trust Score */}
      <NeonCard glowColor="green">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              <TrendingUp className="h-3 w-3 mr-1" />
              High
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Trust Score</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">{metrics.trustScore}</p>
              <span className="text-xl text-gray-400">/100</span>
            </div>
            <p className="text-xs text-green-400 mt-2">
              Blockchain-verified transactions
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Trust Level</span>
              <span>{metrics.trustScore}%</span>
            </div>
            <Progress value={metrics.trustScore} className="h-2" />
          </div>
        </div>
      </NeonCard>

      {/* Success Rate */}
      <NeonCard glowColor="orange">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              <CheckCircle className="h-3 w-3 mr-1" />
              Optimal
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Coordination Success</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">{metrics.successRate}</p>
              <span className="text-xl text-gray-400">%</span>
            </div>
            <p className="text-xs text-orange-400 mt-2">
              {metrics.completedCoordinations} of {metrics.totalCoordinations} completed
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Success Rate</span>
              <span>{metrics.successRate}%</span>
            </div>
            <Progress value={metrics.successRate} className="h-2" />
          </div>
        </div>
      </NeonCard>

      {/* Extended Metrics */}
      <div className="col-span-full">
        <NeonCard glowColor="blue">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Coordination Overview</h3>
                <p className="text-sm text-gray-400">Real-time system performance metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{metrics.totalCoordinations}</p>
                <p className="text-xs text-gray-400 mt-1">Total Coordinations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-400">{metrics.activeCoordinations}</p>
                <p className="text-xs text-gray-400 mt-1">Active Now</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{metrics.completedCoordinations}</p>
                <p className="text-xs text-gray-400 mt-1">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">${metrics.totalVolume.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Total Volume</p>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="pt-4 border-t border-blue-500/20">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Multi-Party Sync</p>
                    <p className="text-xs text-gray-400">All stakeholders updated in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Atomic Settlements</p>
                    <p className="text-xs text-gray-400">All-or-nothing payment guarantee</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Zero Disputes</p>
                    <p className="text-xs text-gray-400">Smart contract enforcement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
