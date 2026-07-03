'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Search,
  ExternalLink,
  Shield,
  FileText,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface TransactionTransparencyPanelProps {
  escrows: TourEscrow[];
  splits: RevenueSplit[];
}

type Transaction = {
  id: string;
  type: 'escrow' | 'split';
  action: string;
  timestamp: number;
  amount: string;
  status: 'pending' | 'verified' | 'completed';
  txHash?: string;
  parties: Array<{ address: string; role: string }>;
  verificationLevel: 'low' | 'medium' | 'high';
};

export function TransactionTransparencyPanel({ 
  escrows, 
  splits 
}: TransactionTransparencyPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'completed'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Generate transaction audit trail
  useState(() => {
    const txs: Transaction[] = [];

    // From escrows
    escrows.forEach(escrow => {
      const verificationLevel: 'low' | 'medium' | 'high' = 
        escrow.status === 2 ? 'high' :
        escrow.status === 1 ? 'medium' : 'low';

      txs.push({
        id: `escrow-${escrow.escrowId}`,
        type: 'escrow',
        action: `Escrow: ${escrow.serviceName}`,
        timestamp: escrow.createdAt,
        amount: escrow.amountUSD,
        status: escrow.status === 2 ? 'completed' : escrow.status === 1 ? 'verified' : 'pending',
        txHash: escrow.txHash,
        parties: [
          { address: escrow.tourist, role: 'Tourist' },
          { address: escrow.operator, role: 'Operator' }
        ],
        verificationLevel
      });
    });

    // From splits
    splits.forEach(split => {
      const verificationLevel: 'low' | 'medium' | 'high' = 
        split.status === 1 ? 'high' : 'low';

      txs.push({
        id: `split-${split.splitId}`,
        type: 'split',
        action: `Revenue Split: ${split.recipients.length} recipients`,
        timestamp: split.createdAt,
        amount: split.totalAmountUSD,
        status: split.status === 1 ? 'completed' : 'pending',
        txHash: split.txHash,
        parties: split.recipients.map(r => ({
          address: r.address,
          role: r.role
        })),
        verificationLevel
      });
    });

    txs.sort((a, b) => b.timestamp - a.timestamp);
    setTransactions(txs);
  });

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchQuery === '' || 
      tx.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.parties.some(p => p.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
        icon: Clock,
        text: 'Pending'
      },
      verified: { 
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        icon: AlertCircle,
        text: 'Verified'
      },
      completed: { 
        color: 'bg-green-500/20 text-green-300 border-green-500/50',
        icon: CheckCircle,
        text: 'Completed'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getVerificationBadge = (level: string) => {
    const configs = {
      low: { color: 'bg-gray-500/20 text-gray-300', text: 'Basic', dots: 1 },
      medium: { color: 'bg-blue-500/20 text-blue-300', text: 'Verified', dots: 2 },
      high: { color: 'bg-green-500/20 text-green-300', text: 'Full', dots: 3 }
    };
    const config = configs[level as keyof typeof configs] || configs.low;
    return (
      <Badge className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.text}
        <span className="ml-1">
          {'•'.repeat(config.dots)}
        </span>
      </Badge>
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <NeonCard glowColor="cyan">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Transaction Audit Trail</h3>
              <p className="text-sm text-gray-400">Complete transparency & blockchain verification</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by action, tx hash, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-cyan-500/30 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              {(['all', 'pending', 'verified', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-cyan-500/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{transactions.length}</p>
              <p className="text-xs text-gray-400">Total Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {transactions.filter(t => t.verificationLevel === 'high').length}
              </p>
              <p className="text-xs text-gray-400">Fully Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">100%</p>
              <p className="text-xs text-gray-400">On-Chain</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                ${transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total Volume</p>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Transaction List */}
      <NeonCard glowColor="purple">
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No transactions found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const statusConfig = getStatusConfig(tx.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-lg bg-black/30 border border-gray-700 hover:border-purple-500/50 transition-colors space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={tx.type === 'escrow' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}>
                            {tx.type === 'escrow' ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                            {tx.type.toUpperCase()}
                          </Badge>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.text}
                          </Badge>
                          {getVerificationBadge(tx.verificationLevel)}
                        </div>
                        <h4 className="font-semibold text-white">{tx.action}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(tx.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">
                          ${parseFloat(tx.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">MNEE</p>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-300">Involved Parties:</p>
                      <div className="flex flex-wrap gap-2">
                        {tx.parties.map((party, idx) => (
                          <button
                            key={idx}
                            onClick={() => copyToClipboard(party.address)}
                            className="group flex items-center gap-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-colors"
                          >
                            <span className="text-xs text-gray-400">{party.role}:</span>
                            <span className="text-xs text-white font-mono">
                              {party.address.slice(0, 6)}...{party.address.slice(-4)}
                            </span>
                            <Copy className="h-3 w-3 text-gray-500 group-hover:text-purple-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Hash */}
                    {tx.txHash && (
                      <div className="pt-3 border-t border-gray-700">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <p className="text-xs text-gray-400">Transaction Hash:</p>
                            <p className="text-xs font-mono text-cyan-400 truncate">
                              {tx.txHash}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(tx.txHash!)}
                              className="p-1 rounded hover:bg-cyan-500/20 transition-colors"
                            >
                              <Copy className="h-3 w-3 text-cyan-400" />
                            </button>
                            <a
                              href={`https://etherscan.io/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-cyan-500/20 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3 text-cyan-400" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </NeonCard>

      {/* Trust Indicators */}
      <NeonCard glowColor="green">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Trust & Security Indicators</h3>
              <p className="text-sm text-gray-400">Blockchain-backed guarantees</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-sm font-semibold text-white">Immutable Records</p>
              <p className="text-xs text-gray-400 mt-1">All transactions stored on Ethereum blockchain</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-sm font-semibold text-white">Multi-Party Verification</p>
              <p className="text-xs text-gray-400 mt-1">All stakeholders can verify independently</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-sm font-semibold text-white">Smart Contract Enforcement</p>
              <p className="text-xs text-gray-400 mt-1">Automated execution, no intermediaries</p>
            </div>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
