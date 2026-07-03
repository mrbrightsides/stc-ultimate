'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Lock,
  Unlock,
  ArrowRight,
  ExternalLink,
  Filter
} from 'lucide-react';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface ActivityTimelineFeedProps {
  escrows: TourEscrow[];
  splits: RevenueSplit[];
}

type ActivityEvent = {
  id: string;
  type: 'escrow_created' | 'escrow_verified' | 'escrow_released' | 'split_created' | 'split_executed';
  title: string;
  description: string;
  timestamp: number;
  amount?: string;
  parties: Array<{ address: string; role: string }>;
  status: 'pending' | 'verified' | 'completed';
  txHash?: string;
  icon: any;
  color: string;
};

export function ActivityTimelineFeed({ escrows, splits }: ActivityTimelineFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'escrow' | 'split'>('all');

  useEffect(() => {
    generateEvents();
  }, [escrows, splits, filter]);

  const generateEvents = () => {
    const allEvents: ActivityEvent[] = [];

    // Convert escrows to events
    escrows.forEach(escrow => {
      // Escrow created
      allEvents.push({
        id: `escrow-created-${escrow.escrowId}`,
        type: 'escrow_created',
        title: 'Escrow Created',
        description: `${escrow.serviceName} - Payment locked in smart contract`,
        timestamp: escrow.createdAt,
        amount: escrow.amountUSD,
        parties: [
          { address: escrow.tourist, role: 'Tourist' },
          { address: escrow.operator, role: 'Operator' }
        ],
        status: 'pending',
        txHash: escrow.txHash,
        icon: Lock,
        color: 'cyan'
      });

      // Escrow verified
      if (escrow.status >= 1) {
        allEvents.push({
          id: `escrow-verified-${escrow.escrowId}`,
          type: 'escrow_verified',
          title: 'Service Verified',
          description: `${escrow.serviceName} - Service completion confirmed`,
          timestamp: escrow.createdAt + 60000, // Mock timestamp
          amount: escrow.amountUSD,
          parties: [
            { address: escrow.operator, role: 'Operator' }
          ],
          status: 'verified',
          icon: CheckCircle,
          color: 'blue'
        });
      }

      // Escrow released
      if (escrow.status === 2) {
        allEvents.push({
          id: `escrow-released-${escrow.escrowId}`,
          type: 'escrow_released',
          title: 'Payment Released',
          description: `${escrow.serviceName} - Funds distributed to operator`,
          timestamp: escrow.createdAt + 120000, // Mock timestamp
          amount: escrow.amountUSD,
          parties: [
            { address: escrow.tourist, role: 'Tourist' },
            { address: escrow.operator, role: 'Operator' }
          ],
          status: 'completed',
          txHash: escrow.releaseTxHash,
          icon: Unlock,
          color: 'green'
        });
      }
    });

    // Convert splits to events
    splits.forEach(split => {
      // Split created
      allEvents.push({
        id: `split-created-${split.splitId}`,
        type: 'split_created',
        title: 'Revenue Split Created',
        description: `Multi-party payment to ${split.recipients.length} stakeholders`,
        timestamp: split.createdAt,
        amount: split.totalAmountUSD,
        parties: split.recipients.map(r => ({
          address: r.address,
          role: r.role
        })),
        status: 'pending',
        txHash: split.txHash,
        icon: Users,
        color: 'purple'
      });

      // Split executed
      if (split.status === 1) {
        allEvents.push({
          id: `split-executed-${split.splitId}`,
          type: 'split_executed',
          title: 'Revenue Split Executed',
          description: `Automated distribution: ${split.recipients.map(r => `${r.percentage}% to ${r.role}`).join(', ')}`,
          timestamp: split.executedAt || split.createdAt + 30000,
          amount: split.totalAmountUSD,
          parties: split.recipients.map(r => ({
            address: r.address,
            role: r.role
          })),
          status: 'completed',
          txHash: split.executeTxHash,
          icon: DollarSign,
          color: 'green'
        });
      }
    });

    // Filter and sort
    let filtered = allEvents;
    if (filter === 'escrow') {
      filtered = allEvents.filter(e => e.type.startsWith('escrow'));
    } else if (filter === 'split') {
      filtered = allEvents.filter(e => e.type.startsWith('split'));
    }

    filtered.sort((a, b) => b.timestamp - a.timestamp);
    setEvents(filtered);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/50', icon: Clock },
      verified: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/50', icon: AlertCircle },
      completed: { color: 'bg-green-500/20 text-green-300 border-green-500/50', icon: CheckCircle }
    };
    const { color, icon: Icon } = config[status as keyof typeof config] || config.pending;
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <NeonCard glowColor="cyan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
              <p className="text-sm text-gray-400">Real-time multi-party coordination feed</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {(['all', 'escrow', 'split'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No activity yet</p>
                <p className="text-sm text-gray-500 mt-2">Create a booking to see the coordination timeline</p>
              </div>
            ) : (
              events.map((event, index) => (
                <div
                  key={event.id}
                  className="relative pl-8 pb-6 border-l-2 border-gray-700 last:border-0"
                >
                  {/* Icon */}
                  <div
                    className={`absolute left-0 top-0 -translate-x-1/2 p-2 rounded-full bg-${event.color}-500/20 border-2 border-${event.color}-500/50`}
                  >
                    <event.icon className={`h-4 w-4 text-${event.color}-400`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{event.title}</h4>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-400">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.timestamp)}
                          </span>
                          {event.amount && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${parseFloat(event.amount).toLocaleString()} MNEE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Parties Involved */}
                    <div className="p-3 rounded-lg bg-black/30 border border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Parties Coordinated:</p>
                      <div className="flex flex-wrap gap-2">
                        {event.parties.map((party, idx) => (
                          <Badge
                            key={idx}
                            className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs"
                          >
                            {party.role}: {party.address.slice(0, 6)}...{party.address.slice(-4)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Hash */}
                    {event.txHash && (
                      <a
                        href={`https://etherscan.io/tx/${event.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Etherscan
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{events.length}</p>
              <p className="text-xs text-gray-400">Total Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {new Set(events.flatMap(e => e.parties.map(p => p.address))).size}
              </p>
              <p className="text-xs text-gray-400">Parties Coordinated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ${events.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0).toFixed(0)}
              </p>
              <p className="text-xs text-gray-400">Total Volume</p>
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}
