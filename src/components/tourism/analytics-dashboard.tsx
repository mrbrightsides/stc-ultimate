'use client';

import { useMemo } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  DollarSign, 
  Target,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import type { TransactionMetrics, PerformanceAnalytics, VendorMetrics } from '@/lib/performance-metrics';
import { 
  analyzeTransactionMetrics, 
  generateVendorMetrics,
  calculateEfficiencyScore 
} from '@/lib/performance-metrics';

interface AnalyticsDashboardProps {
  transactions: TransactionMetrics[];
  isJourneyComplete: boolean;
}

export function AnalyticsDashboard({ transactions, isJourneyComplete }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => analyzeTransactionMetrics(transactions), [transactions]);
  const vendorMetrics = useMemo(() => generateVendorMetrics(transactions), [transactions]);
  const efficiencyScore = useMemo(() => calculateEfficiencyScore(analytics), [analytics]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <NeonCard glowColor="cyan">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Activity className="h-5 w-5 text-cyan-400" />
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-xs">
                Live
              </Badge>
            </div>
            <p className="text-3xl font-bold text-cyan-400">{analytics.totalTransactions}</p>
            <p className="text-xs text-gray-400">Total Transactions</p>
          </div>
        </NeonCard>

        {/* Total Gas Cost */}
        <NeonCard glowColor="purple">
          <div className="space-y-2">
            <Zap className="h-5 w-5 text-purple-400" />
            <p className="text-3xl font-bold text-purple-400">{analytics.totalGasCost}</p>
            <p className="text-xs text-gray-400">Total Gas Cost (ETH)</p>
          </div>
        </NeonCard>

        {/* Avg Transaction Time */}
        <NeonCard glowColor="orange">
          <div className="space-y-2">
            <Clock className="h-5 w-5 text-orange-400" />
            <p className="text-3xl font-bold text-orange-400">
              {(analytics.averageTransactionTime / 1000).toFixed(1)}s
            </p>
            <p className="text-xs text-gray-400">Avg Transaction Time</p>
          </div>
        </NeonCard>

        {/* Efficiency Score */}
        <NeonCard glowColor="green">
          <div className="space-y-2">
            <Target className="h-5 w-5 text-green-400" />
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-green-400">{efficiencyScore}</p>
              <p className="text-lg text-gray-400">/100</p>
            </div>
            <p className="text-xs text-gray-400">Efficiency Score</p>
          </div>
        </NeonCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gas Cost Analysis */}
        <NeonCard glowColor="purple">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Gas Cost Analysis
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average per Milestone</span>
                <span className="text-lg font-bold text-purple-400">
                  {analytics.costEfficiency.perMilestone} ETH
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average per Vendor</span>
                <span className="text-lg font-bold text-purple-400">
                  {analytics.costEfficiency.perVendor} ETH
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Gas Used</span>
                <span className="text-lg font-bold text-purple-400">
                  {analytics.averageGasPerTx.toLocaleString()} gas
                </span>
              </div>

              <div className="pt-3 border-t border-purple-500/30">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-300">vs Traditional Payment</span>
                    <span className="text-lg font-bold text-green-400">
                      {analytics.costEfficiency.vsTraditional}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Compared to 3% traditional processor fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </NeonCard>

        {/* Transaction Speed Analysis */}
        <NeonCard glowColor="orange">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Transaction Speed
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Fastest</span>
                  <span className="text-green-400 font-bold">
                    {(analytics.fastestTransaction / 1000).toFixed(1)}s
                  </span>
                </div>
                <Progress 
                  value={(analytics.fastestTransaction / analytics.slowestTransaction) * 100} 
                  className="h-2 bg-black/50 [&>div]:bg-green-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Average</span>
                  <span className="text-orange-400 font-bold">
                    {(analytics.averageTransactionTime / 1000).toFixed(1)}s
                  </span>
                </div>
                <Progress 
                  value={(analytics.averageTransactionTime / analytics.slowestTransaction) * 100} 
                  className="h-2 bg-black/50 [&>div]:bg-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Slowest</span>
                  <span className="text-red-400 font-bold">
                    {(analytics.slowestTransaction / 1000).toFixed(1)}s
                  </span>
                </div>
                <Progress 
                  value={100} 
                  className="h-2 bg-black/50 [&>div]:bg-red-500"
                />
              </div>

              <div className="pt-3 border-t border-orange-500/30">
                <p className="text-xs text-gray-400">
                  All times include IoT detection, verification, blockchain broadcast, and confirmation
                </p>
              </div>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Vendor Distribution */}
      {vendorMetrics.length > 0 && (
        <NeonCard glowColor="cyan">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Vendor Payment Distribution
            </h3>
            
            <div className="space-y-3">
              {vendorMetrics.map((vendor, index) => {
                const percentage = (parseFloat(vendor.totalReceived) / parseFloat(analytics.totalAmountDistributed)) * 100;
                
                return (
                  <div key={vendor.vendorAddress} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-cyan-400' :
                          index === 1 ? 'bg-purple-400' :
                          index === 2 ? 'bg-green-400' :
                          index === 3 ? 'bg-orange-400' :
                          index === 4 ? 'bg-pink-400' :
                          'bg-blue-400'
                        }`} />
                        <span className="text-sm font-mono text-gray-300">
                          {vendor.vendorAddress.slice(0, 6)}...{vendor.vendorAddress.slice(-4)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">{vendor.totalReceived} ETH</p>
                        <p className="text-xs text-gray-400">{vendor.transactionCount} tx</p>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 bg-black/50 [&>div]:${
                        index === 0 ? 'bg-cyan-500' :
                        index === 1 ? 'bg-purple-500' :
                        index === 2 ? 'bg-green-500' :
                        index === 3 ? 'bg-orange-500' :
                        index === 4 ? 'bg-pink-500' :
                        'bg-blue-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-cyan-500/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-cyan-400">{analytics.uniqueVendors}</p>
                  <p className="text-xs text-gray-400">Unique Vendors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{analytics.totalAmountDistributed}</p>
                  <p className="text-xs text-gray-400">Total Distributed (ETH)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{analytics.successRate}%</p>
                  <p className="text-xs text-gray-400">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Key Insights */}
      {isJourneyComplete && (
        <NeonCard glowColor="green">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Performance Insights
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-green-300 font-medium mb-1">Cost Efficiency</p>
                <p className="text-xs text-gray-400">
                  Your blockchain-based escrow system saved{' '}
                  <span className="text-green-400 font-bold">{analytics.costEfficiency.vsTraditional}</span>{' '}
                  compared to traditional payment processors
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-sm text-cyan-300 font-medium mb-1">Transaction Efficiency</p>
                <p className="text-xs text-gray-400">
                  Average milestone release completed in{' '}
                  <span className="text-cyan-400 font-bold">
                    {(analytics.averageTransactionTime / 1000).toFixed(1)}s
                  </span>{' '}
                  with IoT verification included
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm text-purple-300 font-medium mb-1">Multi-Vendor Distribution</p>
                <p className="text-xs text-gray-400">
                  Successfully distributed funds to{' '}
                  <span className="text-purple-400 font-bold">{analytics.uniqueVendors} vendors</span>{' '}
                  across {analytics.totalTransactions} sequential milestones
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <p className="text-sm text-orange-300 font-medium mb-1">System Reliability</p>
                <p className="text-xs text-gray-400">
                  Achieved{' '}
                  <span className="text-orange-400 font-bold">{analytics.successRate}% success rate</span>{' '}
                  with zero failed transactions or disputes
                </p>
              </div>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
