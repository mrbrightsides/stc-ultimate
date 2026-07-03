'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ExternalLink, 
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Database,
  Hash,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface TransactionProofSystemProps {
  transactions?: TransactionRecord[];
  isLiveMode?: boolean;
}

interface TransactionRecord {
  id: string;
  serviceId: number;
  serviceName: string;
  amount: string;
  txHash: string;
  blockNumber?: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  gasPrice?: string;
  from: string;
  to: string;
  confirmations: number;
}

interface ProofMetrics {
  totalTransactions: number;
  confirmedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalVolume: string;
  averageConfirmationTime: number;
  successRate: number;
}

const TransactionProofSystem: React.FC<TransactionProofSystemProps> = ({
  transactions = [],
  isLiveMode = false
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [proofMetrics, setProofMetrics] = useState<ProofMetrics>({
    totalTransactions: 0,
    confirmedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalVolume: '0.000',
    averageConfirmationTime: 0,
    successRate: 0
  });

  const [mockTransactions] = useState<TransactionRecord[]>([
    {
      id: '1',
      serviceId: 1,
      serviceName: 'Flight Booking - Jakarta to Bali',
      amount: '0.012',
      txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      blockNumber: 18750234,
      timestamp: Date.now() - 300000,
      status: 'confirmed',
      gasUsed: '42,156',
      gasPrice: '20.5',
      from: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
      to: '0x123456789abcdef123456789abcdef123456789ab',
      confirmations: 15
    },
    {
      id: '2', 
      serviceId: 2,
      serviceName: 'Luxury Hotel - Grand Indonesia',
      amount: '0.015',
      txHash: '0xb2c3d4e5f6a789012345678901234567890abcdef1234567890abcdef123457',
      blockNumber: 18750267,
      timestamp: Date.now() - 180000,
      status: 'confirmed',
      gasUsed: '38,924',
      gasPrice: '22.1',
      from: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
      to: '0x234567890bcdef234567890bcdef234567890bcd',
      confirmations: 12
    },
    {
      id: '3',
      serviceId: 3,
      serviceName: 'Airport Transfer - Premium Car',
      amount: '0.003',
      txHash: '0xc3d4e5f6a7b89012345678901234567890abcdef1234567890abcdef123458',
      blockNumber: undefined,
      timestamp: Date.now() - 30000,
      status: 'pending',
      gasUsed: undefined,
      gasPrice: '21.0',
      from: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
      to: '0x345678901cdef345678901cdef345678901cdef3',
      confirmations: 0
    }
  ]);

  const activeTransactions = transactions.length > 0 ? transactions : mockTransactions;

  useEffect(() => {
    const calculateMetrics = (): void => {
      const total = activeTransactions.length;
      const confirmed = activeTransactions.filter(tx => tx.status === 'confirmed').length;
      const pending = activeTransactions.filter(tx => tx.status === 'pending').length;
      const failed = activeTransactions.filter(tx => tx.status === 'failed').length;
      
      const volume = activeTransactions
        .filter(tx => tx.status === 'confirmed')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      const confirmedTxs = activeTransactions.filter(tx => tx.status === 'confirmed');
      const avgConfirmationTime = confirmedTxs.length > 0 
        ? confirmedTxs.reduce((sum, tx) => sum + (tx.confirmations * 12), 0) / confirmedTxs.length
        : 0;

      const successRate = total > 0 ? (confirmed / total) * 100 : 0;

      setProofMetrics({
        totalTransactions: total,
        confirmedTransactions: confirmed,
        pendingTransactions: pending,
        failedTransactions: failed,
        totalVolume: volume.toFixed(3),
        averageConfirmationTime: avgConfirmationTime,
        successRate
      });
    };

    calculateMetrics();
  }, [activeTransactions]);

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  const openEtherscan = (txHash: string): void => {
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-green-500/50 text-green-300 bg-green-500/10';
      case 'pending': return 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10';
      case 'failed': return 'border-red-500/50 text-red-300 bg-red-500/10';
      default: return 'border-gray-500/50 text-gray-300 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Transaction Proof System
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-500/50 text-green-300">
                Sepolia Testnet
              </Badge>
              {isLiveMode && (
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-300 animate-pulse">
                  Live Mode
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Sistem pembuktian transaksi blockchain yang menyediakan audit trail lengkap untuk setiap 
            pembayaran dalam platform STC Ultimate. Semua transaksi dapat diverifikasi di Sepolia Etherscan.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-500/30 bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-blue-300 text-sm">Total Transaksi</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {proofMetrics.totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-300 text-sm">Terkonfirmasi</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {proofMetrics.confirmedTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-purple-300 text-sm">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {proofMetrics.totalVolume} <span className="text-sm text-gray-400">ETH</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="font-medium text-cyan-300 text-sm">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {proofMetrics.successRate.toFixed(1)}<span className="text-sm text-gray-400">%</span>
            </div>
            <Progress value={proofMetrics.successRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="border-gray-600/30 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeTransactions.map((tx) => (
              <div key={tx.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(tx.status)}
                    <div>
                      <h4 className="font-medium text-gray-300">{tx.serviceName}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{tx.amount} ETH</p>
                    <Badge size="sm" className={getStatusColor(tx.status)}>
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Transaction Hash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs text-cyan-300 break-all">
                        {tx.txHash}
                      </p>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(tx.txHash)}
                        className="h-6 w-6 p-0 hover:bg-gray-700"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Block Details</span>
                    </div>
                    <div className="space-y-1">
                      {tx.blockNumber ? (
                        <p className="text-sm text-gray-300">
                          Block: {tx.blockNumber.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-yellow-300">Pending confirmation...</p>
                      )}
                      <p className="text-sm text-gray-300">
                        Confirmations: {tx.confirmations}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <QRCode 
                        value={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        size={60}
                        bgColor="transparent"
                        fgColor="#00d4ff"
                        level="M"
                      />
                      <p className="text-xs text-gray-400 mt-1">Scan for Etherscan</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Gas Used: {tx.gasUsed || 'Pending'}</p>
                      <p>Gas Price: {tx.gasPrice} Gwei</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTransaction(tx)}
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => openEtherscan(tx.txHash)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Etherscan
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Card className="border-cyan-500/50 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-300">Transaction Details</CardTitle>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Service:</span> {selectedTransaction.serviceName}</p>
                    <p><span className="text-gray-400">Amount:</span> {selectedTransaction.amount} ETH</p>
                    <p><span className="text-gray-400">Status:</span> 
                      <Badge size="sm" className={`ml-2 ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status.toUpperCase()}
                      </Badge>
                    </p>
                    <p><span className="text-gray-400">Timestamp:</span> {new Date(selectedTransaction.timestamp).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Network Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">From:</span> 
                      <span className="font-mono text-xs ml-2 text-cyan-300">{selectedTransaction.from}</span>
                    </p>
                    <p><span className="text-gray-400">To:</span> 
                      <span className="font-mono text-xs ml-2 text-cyan-300">{selectedTransaction.to}</span>
                    </p>
                    <p><span className="text-gray-400">Gas Used:</span> {selectedTransaction.gasUsed || 'Pending'}</p>
                    <p><span className="text-gray-400">Gas Price:</span> {selectedTransaction.gasPrice} Gwei</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Blockchain Proof</h4>
                  <div className="text-center space-y-3">
                    <QRCode 
                      value={`https://sepolia.etherscan.io/tx/${selectedTransaction.txHash}`}
                      size={150}
                      bgColor="transparent"
                      fgColor="#00d4ff"
                      level="M"
                    />
                    <p className="text-xs text-gray-400">
                      Scan QR code untuk membuka di Sepolia Etherscan
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => openEtherscan(selectedTransaction.txHash)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka di Etherscan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionProofSystem;