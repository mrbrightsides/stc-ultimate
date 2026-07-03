'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  Hotel,
  MapPin,
  Building,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Network
} from 'lucide-react';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface StakeholderCoordinationDashboardProps {
  escrows: TourEscrow[];
  splits: RevenueSplit[];
}

type Stakeholder = {
  role: string;
  name: string;
  icon: any;
  color: string;
  totalReceived: number;
  pendingPayments: number;
  completedPayments: number;
  trustScore: number;
  status: 'active' | 'pending' | 'inactive';
};

export function StakeholderCoordinationDashboard({ 
  escrows, 
  splits 
}: StakeholderCoordinationDashboardProps) {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);

  // Calculate stakeholder metrics
  const calculateStakeholderMetrics = (): Stakeholder[] => {
    const metrics: Record<string, Stakeholder> = {
      tourist: {
        role: 'Tourist',
        name: 'Booking Creator',
        icon: Users,
        color: 'cyan',
        totalReceived: 0,
        pendingPayments: escrows.filter(e => e.status === 0).length,
        completedPayments: escrows.filter(e => e.status === 2).length,
        trustScore: 95,
        status: escrows.length > 0 ? 'active' : 'inactive'
      },
      hotel: {
        role: 'Hotel',
        name: 'Accommodation Provider',
        icon: Hotel,
        color: 'purple',
        totalReceived: 0,
        pendingPayments: 0,
        completedPayments: 0,
        trustScore: 98,
        status: 'active'
      },
      guide: {
        role: 'Tour Guide',
        name: 'Guide Service',
        icon: MapPin,
        color: 'orange',
        totalReceived: 0,
        pendingPayments: 0,
        completedPayments: 0,
        trustScore: 92,
        status: 'active'
      },
      platform: {
        role: 'Platform',
        name: 'Service Fee',
        icon: Building,
        color: 'blue',
        totalReceived: 0,
        pendingPayments: 0,
        completedPayments: 0,
        trustScore: 100,
        status: 'active'
      },
      treasury: {
        role: 'Treasury',
        name: 'Platform Treasury',
        icon: Shield,
        color: 'green',
        totalReceived: 0,
        pendingPayments: 0,
        completedPayments: 0,
        trustScore: 100,
        status: 'active'
      }
    };

    // Calculate from splits
    splits.forEach(split => {
      split.recipients.forEach(recipient => {
        const role = recipient.role.toLowerCase().includes('hotel') ? 'hotel' :
                     recipient.role.toLowerCase().includes('guide') ? 'guide' :
                     recipient.role.toLowerCase().includes('platform') && !recipient.role.toLowerCase().includes('treasury') ? 'platform' :
                     recipient.role.toLowerCase().includes('treasury') ? 'treasury' : 'platform';
        
        if (metrics[role]) {
          metrics[role].totalReceived += parseFloat(recipient.amountUSD);
          if (split.status === 1) {
            metrics[role].completedPayments += 1;
          } else {
            metrics[role].pendingPayments += 1;
          }
        }
      });
    });

    return Object.values(metrics);
  };

  const stakeholders = calculateStakeholderMetrics();

  // Calculate coordination stats
  const coordinationStats = {
    totalStakeholders: stakeholders.filter(s => s.status !== 'inactive').length,
    activeCoordinations: escrows.filter(e => e.status < 2).length,
    completedCoordinations: escrows.filter(e => e.status === 2).length,
    averageTrustScore: (stakeholders.reduce((sum, s) => sum + s.trustScore, 0) / stakeholders.length).toFixed(1),
    totalVolumeDistributed: stakeholders.reduce((sum, s) => sum + s.totalReceived, 0).toFixed(2)
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-500/20 text-green-300 border-green-500/50', text: 'Active' },
      pending: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/50', text: 'Pending' },
      inactive: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/50', text: 'Inactive' }
    };
    const { color, text } = config[status as keyof typeof config] || config.inactive;
    return <Badge className={color}>{text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <NeonCard glowColor="purple">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Network className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Multi-Party Coordination</h3>
              <p className="text-sm text-gray-400">Real-time stakeholder coordination & payment flow</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{coordinationStats.totalStakeholders}</p>
              <p className="text-xs text-gray-400 mt-1">Active Parties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{coordinationStats.activeCoordinations}</p>
              <p className="text-xs text-gray-400 mt-1">Active Flows</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{coordinationStats.completedCoordinations}</p>
              <p className="text-xs text-gray-400 mt-1">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">{coordinationStats.averageTrustScore}%</p>
              <p className="text-xs text-gray-400 mt-1">Avg Trust</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">${parseFloat(coordinationStats.totalVolumeDistributed).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Distributed</p>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Stakeholder Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholders.map((stakeholder) => (
          <NeonCard 
            key={stakeholder.role}
            glowColor={stakeholder.color as any}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedStakeholder(
              selectedStakeholder === stakeholder.role ? null : stakeholder.role
            )}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stakeholder.color}-500/20`}>
                    <stakeholder.icon className={`h-5 w-5 text-${stakeholder.color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{stakeholder.role}</h4>
                    <p className="text-xs text-gray-400">{stakeholder.name}</p>
                  </div>
                </div>
                {getStatusBadge(stakeholder.status)}
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Received</span>
                  <span className="text-lg font-bold text-white">
                    ${stakeholder.totalReceived.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Pending</span>
                    <span className="text-orange-400">{stakeholder.pendingPayments}</span>
                  </div>
                  <Progress 
                    value={(stakeholder.pendingPayments / (stakeholder.pendingPayments + stakeholder.completedPayments + 1)) * 100} 
                    className="h-1 bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Completed</span>
                    <span className="text-green-400">{stakeholder.completedPayments}</span>
                  </div>
                  <Progress 
                    value={(stakeholder.completedPayments / (stakeholder.pendingPayments + stakeholder.completedPayments + 1)) * 100} 
                    className="h-1 bg-gray-700"
                  />
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={stakeholder.trustScore} 
                        className="h-2 w-20"
                      />
                      <span className={`text-sm font-semibold text-${stakeholder.color}-400`}>
                        {stakeholder.trustScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedStakeholder === stakeholder.role && (
                <div className="pt-3 border-t border-gray-700 space-y-2">
                  <p className="text-xs font-semibold text-gray-300">Payment Distribution</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Avg per transaction</span>
                      <span className="text-white">
                        ${(stakeholder.totalReceived / (stakeholder.completedPayments + 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Total transactions</span>
                      <span className="text-white">
                        {stakeholder.pendingPayments + stakeholder.completedPayments}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </NeonCard>
        ))}
      </div>

      {/* Payment Flow Diagram */}
      <NeonCard glowColor="green">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <ArrowRight className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Automated Payment Flow</h3>
              <p className="text-sm text-gray-400">Multi-stakeholder revenue distribution</p>
            </div>
          </div>

          {/* Flow Visualization */}
          <div className="grid grid-cols-7 gap-2 items-center">
            {/* Tourist */}
            <div className="col-span-1 text-center">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 mb-2">
                <Users className="h-6 w-6 text-cyan-400 mx-auto" />
              </div>
              <p className="text-xs font-semibold text-white">Tourist</p>
              <p className="text-xs text-gray-500">$1,500</p>
            </div>

            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Smart Contract */}
            <div className="col-span-1 text-center">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/50 mb-2">
                <Shield className="h-6 w-6 text-purple-400 mx-auto" />
              </div>
              <p className="text-xs font-semibold text-white">Escrow</p>
              <p className="text-xs text-gray-500">Locked</p>
            </div>

            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Distribution */}
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-white">Hotel (70%)</span>
                </div>
                <span className="text-xs font-semibold text-purple-400">$1,050</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="text-xs text-white">Guide (15%)</span>
                </div>
                <span className="text-xs font-semibold text-orange-400">$225</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-white">Platform (10%)</span>
                </div>
                <span className="text-xs font-semibold text-blue-400">$150</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-white">Treasury (5%)</span>
                </div>
                <span className="text-xs font-semibold text-green-400">$75</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Instant Settlement</p>
                <p className="text-xs text-gray-400">No 30-60 day delays</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Transparent</p>
                <p className="text-xs text-gray-400">All parties see flows</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Automated</p>
                <p className="text-xs text-gray-400">Zero manual work</p>
              </div>
            </div>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
