'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart,
  BarChart,
  TrendingUp,
  DollarSign,
  ArrowDown,
  ArrowUp,
  Hotel,
  MapPin,
  Building,
  Shield
} from 'lucide-react';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface BudgetAllocationVizProps {
  escrows: TourEscrow[];
  splits: RevenueSplit[];
}

type AllocationData = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: any;
  transactions: number;
};

export function BudgetAllocationViz({ escrows, splits }: BudgetAllocationVizProps) {
  const [viewMode, setViewMode] = useState<'pie' | 'waterfall'>('pie');

  // Calculate allocation breakdown
  const calculateAllocations = (): AllocationData[] => {
    const allocations: Record<string, AllocationData> = {
      hotel: {
        category: 'Hotel',
        amount: 0,
        percentage: 0,
        color: 'purple',
        icon: Hotel,
        transactions: 0
      },
      guide: {
        category: 'Tour Guide',
        amount: 0,
        percentage: 0,
        color: 'orange',
        icon: MapPin,
        transactions: 0
      },
      platform: {
        category: 'Platform Fee',
        amount: 0,
        percentage: 0,
        color: 'blue',
        icon: Building,
        transactions: 0
      },
      treasury: {
        category: 'Treasury',
        amount: 0,
        percentage: 0,
        color: 'green',
        icon: Shield,
        transactions: 0
      }
    };

    let totalAmount = 0;

    // Calculate from splits
    splits.forEach(split => {
      split.recipients.forEach(recipient => {
        const key = recipient.role.toLowerCase().includes('hotel') ? 'hotel' :
                    recipient.role.toLowerCase().includes('guide') ? 'guide' :
                    recipient.role.toLowerCase().includes('platform') && !recipient.role.toLowerCase().includes('treasury') ? 'platform' :
                    recipient.role.toLowerCase().includes('treasury') ? 'treasury' : 'platform';
        
        if (allocations[key]) {
          allocations[key].amount += parseFloat(recipient.amountUSD);
          allocations[key].transactions += 1;
          totalAmount += parseFloat(recipient.amountUSD);
        }
      });
    });

    // Calculate percentages
    Object.values(allocations).forEach(alloc => {
      alloc.percentage = totalAmount > 0 ? (alloc.amount / totalAmount) * 100 : 0;
    });

    return Object.values(allocations).sort((a, b) => b.amount - a.amount);
  };

  const allocations = calculateAllocations();
  const totalBudget = allocations.reduce((sum, a) => sum + a.amount, 0);

  // Waterfall data
  const generateWaterfallData = () => {
    const data = [{ label: 'Tourist Payment', value: totalBudget, cumulative: totalBudget, type: 'start' }];
    let cumulative = totalBudget;

    allocations.forEach((alloc, index) => {
      cumulative -= alloc.amount;
      data.push({
        label: alloc.category,
        value: alloc.amount,
        cumulative,
        type: 'decrease'
      });
    });

    return data;
  };

  const waterfallData = generateWaterfallData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <NeonCard glowColor="green">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <PieChart className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Budget Allocation & Flow</h3>
              <p className="text-sm text-gray-400">Treasury transparency & fund distribution</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('pie')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'pie'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <PieChart className="h-4 w-4" />
              Pie Chart
            </button>
            <button
              onClick={() => setViewMode('waterfall')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'waterfall'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <BarChart className="h-4 w-4" />
              Waterfall
            </button>
          </div>
        </div>
      </NeonCard>

      {/* Pie Chart View */}
      {viewMode === 'pie' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Pie */}
          <NeonCard glowColor="purple">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Revenue Distribution</h4>
              
              {/* Simplified Pie Visualization */}
              <div className="relative w-64 h-64 mx-auto">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {allocations.map((alloc, index) => {
                    const previousPercentage = allocations
                      .slice(0, index)
                      .reduce((sum, a) => sum + a.percentage, 0);
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const offset = (previousPercentage / 100) * circumference;
                    const dashArray = `${(alloc.percentage / 100) * circumference} ${circumference}`;

                    return (
                      <circle
                        key={alloc.category}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={`var(--${alloc.color}-500)`}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-offset}
                        opacity="0.8"
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-white">
                    ${totalBudget.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total</p>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {allocations.map((alloc) => (
                  <div
                    key={alloc.category}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-${alloc.color}-500`} />
                      <div>
                        <p className="text-sm font-medium text-white">{alloc.category}</p>
                        <p className="text-xs text-gray-400">{alloc.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold text-${alloc.color}-400`}>
                        {alloc.percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400">${alloc.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>

          {/* Allocation Details */}
          <NeonCard glowColor="cyan">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Breakdown by Category</h4>
              
              <div className="space-y-4">
                {allocations.map((alloc) => (
                  <div key={alloc.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <alloc.icon className={`h-4 w-4 text-${alloc.color}-400`} />
                        <span className="text-sm font-medium text-white">{alloc.category}</span>
                      </div>
                      <span className={`text-sm font-semibold text-${alloc.color}-400`}>
                        ${alloc.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <Progress 
                        value={alloc.percentage} 
                        className="h-3"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{alloc.percentage.toFixed(1)}% of total</span>
                        <span>Avg: ${(alloc.amount / (alloc.transactions || 1)).toFixed(2)}/tx</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Distributed</span>
                  <span className="font-semibold text-white">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Transactions</span>
                  <span className="font-semibold text-white">
                    {allocations.reduce((sum, a) => sum + a.transactions, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Avg per Transaction</span>
                  <span className="font-semibold text-white">
                    ${(totalBudget / allocations.reduce((sum, a) => sum + a.transactions, 0) || 1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>
      )}

      {/* Waterfall Chart View */}
      {viewMode === 'waterfall' && (
        <NeonCard glowColor="blue">
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Payment Waterfall</h4>
            <p className="text-sm text-gray-400">Visual flow of funds from tourist to stakeholders</p>
            
            <div className="space-y-4">
              {waterfallData.map((item, index) => {
                const isStart = item.type === 'start';
                const maxValue = totalBudget;
                const barWidth = (item.value / maxValue) * 100;
                const offsetWidth = ((item.cumulative) / maxValue) * 100;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isStart ? (
                          <ArrowUp className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-sm font-medium text-white">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${isStart ? 'text-cyan-400' : 'text-orange-400'}`}>
                          ${item.value.toLocaleString()}
                        </span>
                        {!isStart && (
                          <Badge className="bg-gray-700 text-gray-300">
                            Remaining: ${item.cumulative.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${
                          isStart ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
                        } transition-all duration-300`}
                        style={{ 
                          width: `${barWidth}%`,
                          marginLeft: isStart ? '0%' : `${offsetWidth}%`
                        }}
                      >
                        <div className="h-full flex items-center justify-center text-xs font-semibold text-white">
                          {((item.value / maxValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Waterfall Summary */}
            <div className="pt-4 border-t border-blue-500/20 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Starting Balance</p>
                <p className="text-lg font-bold text-cyan-400">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Distributed</p>
                <p className="text-lg font-bold text-orange-400">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Final Balance</p>
                <p className="text-lg font-bold text-green-400">$0</p>
              </div>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
