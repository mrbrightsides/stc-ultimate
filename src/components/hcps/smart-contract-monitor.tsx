'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CheckCircle2, 
  ExternalLink,
  Activity,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';
import { PHASE1_CONTRACTS } from '@/lib/phase1-smart-contracts';

interface ContractInfo {
  name: string;
  address: string;
  type: 'booking' | 'payment' | 'audit';
  status: 'deployed' | 'pending' | 'error';
  deployedAt: number;
  transactions: number;
  totalValue: string;
}

export function SmartContractMonitor() {
  const [contracts] = useState<ContractInfo[]>([
    {
      name: 'Booking Contract',
      address: PHASE1_CONTRACTS.BOOKING,
      type: 'booking',
      status: 'deployed',
      deployedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      transactions: 8523,
      totalValue: '125.8'
    },
    {
      name: 'Payment Contract',
      address: PHASE1_CONTRACTS.PAYMENT,
      type: 'payment',
      status: 'deployed',
      deployedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      transactions: 9876,
      totalValue: '342.5'
    },
    {
      name: 'Audit Trail Contract',
      address: PHASE1_CONTRACTS.AUDIT,
      type: 'audit',
      status: 'deployed',
      deployedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      transactions: 15234,
      totalValue: '0'
    }
  ]);

  const [recentTransactions] = useState([
    {
      id: '1',
      contract: 'Booking',
      action: 'createBooking',
      from: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
      value: '0.025',
      timestamp: Date.now() - 5 * 60 * 1000,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'confirmed'
    },
    {
      id: '2',
      contract: 'Payment',
      action: 'processPayment',
      from: '0x8B3D9F2E1C4A5F6D7E8C9B0A1F2E3D4C5B6A7F8E9',
      value: '0.018',
      timestamp: Date.now() - 12 * 60 * 1000,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'confirmed'
    },
    {
      id: '3',
      contract: 'Audit',
      action: 'logAction',
      from: '0x5F6E7D8C9B0A1F2E3D4C5B6A7F8E9D0C1B2A3F4E',
      value: '0',
      timestamp: Date.now() - 25 * 60 * 1000,
      txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
      status: 'confirmed'
    },
    {
      id: '4',
      contract: 'Booking',
      action: 'confirmBooking',
      from: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
      value: '0',
      timestamp: Date.now() - 45 * 60 * 1000,
      txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      status: 'confirmed'
    },
    {
      id: '5',
      contract: 'Payment',
      action: 'refundPayment',
      from: '0x9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4B3A2F1E0D',
      value: '0.012',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      txHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      status: 'confirmed'
    }
  ]);

  const getContractColor = (type: ContractInfo['type']): string => {
    const colors: Record<ContractInfo['type'], string> = {
      booking: 'cyan',
      payment: 'purple',
      audit: 'orange'
    };
    return colors[type];
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Contract Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <NeonCard glowColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Contracts</p>
              <p className="text-3xl font-bold text-cyan-400">{contracts.length}</p>
            </div>
            <Database className="h-12 w-12 text-cyan-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-purple-400">
                {contracts.reduce((sum, c) => sum + c.transactions, 0).toLocaleString()}
              </p>
            </div>
            <Activity className="h-12 w-12 text-purple-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value Locked</p>
              <p className="text-3xl font-bold text-green-400">
                {parseFloat(contracts.reduce((sum, c) => sum + parseFloat(c.totalValue), 0).toFixed(2))}
              </p>
              <p className="text-xs text-gray-400">ETH</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-400" />
          </div>
        </NeonCard>
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Deployed Contracts</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <NeonCard key={contract.address} glowColor={getContractColor(contract.type)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${getContractColor(contract.type)}-500/20`}>
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{contract.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">{contract.type}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {contract.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-gray-300 text-xs">{contract.address.slice(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transactions:</span>
                    <span className="text-white font-semibold">{contract.transactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value:</span>
                    <span className="text-white font-semibold">{contract.totalValue} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deployed:</span>
                    <span className="text-white">{formatTimeAgo(contract.deployedAt)}</span>
                  </div>
                </div>

                <NeonButton 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(`https://sepolia.etherscan.io/address/${contract.address}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Etherscan
                </NeonButton>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
          <Activity className="h-6 w-6 text-cyan-400" />
          Recent Contract Interactions
        </h3>

        <NeonCard glowColor="cyan">
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <FileText className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{tx.contract}</span>
                      <span className="text-gray-400">•</span>
                      <code className="text-sm text-cyan-400">{tx.action}</code>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>From: {tx.from.slice(0, 10)}...</span>
                      {tx.value !== '0' && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">{tx.value} ETH</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-1">
                      {tx.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(tx.timestamp)}</span>
                    </div>
                  </div>
                  <NeonButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.txHash}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </NeonButton>
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>

      {/* Contract Functions */}
      <NeonCard glowColor="purple">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Available Contract Functions</h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <h5 className="font-semibold text-cyan-400 mb-2">Booking Contract</h5>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• createBooking()</li>
                <li>• confirmBooking()</li>
                <li>• cancelBooking()</li>
                <li>• getBooking()</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <h5 className="font-semibold text-purple-400 mb-2">Payment Contract</h5>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• processPayment()</li>
                <li>• refundPayment()</li>
                <li>• getPaymentStatus()</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <h5 className="font-semibold text-orange-400 mb-2">Audit Contract</h5>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• logAction()</li>
                <li>• getAuditLog()</li>
                <li>• getAuditCount()</li>
              </ul>
            </div>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
