'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Table, 
  CheckCircle,
  Calendar,
  Hash,
  DollarSign
} from 'lucide-react';
import type { TransactionMetrics } from '@/lib/performance-metrics';
import { exportMetricsToCSV } from '@/lib/performance-metrics';
import type { IPFSProof } from '@/lib/ipfs-proof-generator';

interface AuditLogExporterProps {
  transactions: TransactionMetrics[];
  ipfsProofs: IPFSProof[];
  bookingId: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export function AuditLogExporter({ 
  transactions, 
  ipfsProofs,
  bookingId,
  destination,
  startDate,
  endDate
}: AuditLogExporterProps) {
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success'>('idle');

  const exportToCSV = () => {
    setExportStatus('exporting');
    
    try {
      const csv = exportMetricsToCSV(transactions);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `STC_Ultimate_Audit_${bookingId}_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('idle');
    }
  };

  const exportToJSON = () => {
    setExportStatus('exporting');
    
    try {
      const auditData = {
        bookingId,
        destination,
        travelDates: {
          start: startDate,
          end: endDate,
        },
        exportedAt: new Date().toISOString(),
        summary: {
          totalTransactions: transactions.length,
          totalGasUsed: transactions.reduce((sum, tx) => sum + BigInt(tx.gasUsed), BigInt(0)).toString(),
          totalGasCost: transactions.reduce((sum, tx) => sum + parseFloat(tx.gasCost), 0).toFixed(6),
          totalAmountDistributed: transactions.reduce((sum, tx) => sum + parseFloat(tx.amountReleased), 0).toFixed(6),
        },
        transactions: transactions.map(tx => ({
          milestoneIndex: tx.milestoneIndex,
          transactionHash: tx.txHash,
          blockNumber: tx.blockNumber,
          timestamp: new Date(tx.timestamp).toISOString(),
          duration: `${tx.duration}ms`,
          gasUsed: tx.gasUsed,
          gasCost: `${tx.gasCost} ETH`,
          amountReleased: `${tx.amountReleased} ETH`,
          vendorAddress: tx.vendorAddress,
          etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.txHash}`,
        })),
        iotProofs: ipfsProofs.map(proof => ({
          ipfsHash: proof.ipfsHash,
          timestamp: new Date(proof.generatedAt).toISOString(),
          deviceType: proof.metadata.deviceType,
          serviceName: proof.metadata.serviceName,
          deviceId: proof.metadata.deviceId,
          location: proof.metadata.location,
          signature: proof.signature,
          gatewayUrl: proof.gatewayUrl,
        })),
        networkInfo: {
          network: 'Sepolia Testnet',
          chainId: 11155111,
          explorerUrl: 'https://sepolia.etherscan.io',
        },
      };
      
      const json = JSON.stringify(auditData, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `STC_Ultimate_Audit_${bookingId}_${Date.now()}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('idle');
    }
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <NeonCard glowColor="cyan">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit Trail Export
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Export complete transaction history for compliance and verification
            </p>
          </div>
          {exportStatus === 'success' && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50 animate-pulse">
              <CheckCircle className="h-3 w-3 mr-1" />
              Exported!
            </Badge>
          )}
        </div>

        {/* Export Statistics */}
        <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-black/30 border border-cyan-500/30">
          <div className="text-center">
            <Hash className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-cyan-400">{transactions.length}</p>
            <p className="text-xs text-gray-400">Transactions</p>
          </div>
          <div className="text-center">
            <FileText className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-400">{ipfsProofs.length}</p>
            <p className="text-xs text-gray-400">IoT Proofs</p>
          </div>
          <div className="text-center">
            <Calendar className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-400">
              {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs text-gray-400">Days</p>
          </div>
          <div className="text-center">
            <DollarSign className="h-5 w-5 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-orange-400">
              {transactions.reduce((sum, tx) => sum + parseFloat(tx.amountReleased), 0).toFixed(4)}
            </p>
            <p className="text-xs text-gray-400">Total ETH</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <NeonButton
            variant="primary"
            onClick={exportToCSV}
            disabled={exportStatus === 'exporting'}
            loading={exportStatus === 'exporting'}
            className="w-full"
          >
            <Table className="h-5 w-5 mr-2" />
            Export as CSV
          </NeonButton>
          
          <NeonButton
            variant="secondary"
            onClick={exportToJSON}
            disabled={exportStatus === 'exporting'}
            loading={exportStatus === 'exporting'}
            className="w-full"
          >
            <Download className="h-5 w-5 mr-2" />
            Export as JSON
          </NeonButton>
        </div>

        {/* Export Info */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-300 font-medium mb-2">Export Includes:</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Complete transaction history with timestamps
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Gas usage and cost analysis per milestone
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              IoT proof hashes with IPFS links
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Vendor payment distribution records
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Etherscan transaction verification links
            </li>
          </ul>
        </div>

        {/* Booking Reference */}
        <div className="text-center p-3 rounded-lg bg-black/30 border border-gray-500/30">
          <p className="text-xs text-gray-400">Booking Reference</p>
          <p className="text-sm font-mono text-cyan-400 mt-1">{bookingId}</p>
        </div>
      </div>
    </NeonCard>
  );
}
