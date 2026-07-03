'use client';

/**
 * Performance Metrics and Analytics for Blockchain Escrow System
 * Tracks gas costs, transaction times, and system efficiency
 */

export interface TransactionMetrics {
  txHash: string;
  milestoneIndex: number;
  gasUsed: string;
  gasCost: string; // in ETH
  blockNumber: number;
  timestamp: number;
  duration: number; // milliseconds from IoT trigger to confirmation
  vendorAddress: string;
  amountReleased: string;
}

export interface PerformanceAnalytics {
  totalTransactions: number;
  totalGasUsed: string;
  totalGasCost: string;
  averageGasPerTx: number;
  averageTransactionTime: number; // milliseconds
  fastestTransaction: number;
  slowestTransaction: number;
  successRate: number;
  totalAmountDistributed: string;
  uniqueVendors: number;
  costEfficiency: {
    perMilestone: string;
    perVendor: string;
    vsTraditional: string; // comparison metric
  };
}

export interface VendorMetrics {
  vendorAddress: string;
  totalReceived: string;
  transactionCount: number;
  averageGasUsed: number;
  totalGasCost: string;
  firstPayment: number;
  lastPayment: number;
}

/**
 * Calculate gas cost from gas used
 */
export function calculateGasCost(gasUsed: string, gasPriceGwei: number = 30): string {
  const gasUsedBigInt = BigInt(gasUsed);
  const gasPriceWei = BigInt(gasPriceGwei) * BigInt(1e9); // Convert Gwei to Wei
  const costWei = gasUsedBigInt * gasPriceWei;
  const costEth = Number(costWei) / 1e18;
  return costEth.toFixed(9);
}

/**
 * Analyze transaction metrics from completed milestones
 */
export function analyzeTransactionMetrics(
  transactions: TransactionMetrics[]
): PerformanceAnalytics {
  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalGasUsed: '0',
      totalGasCost: '0',
      averageGasPerTx: 0,
      averageTransactionTime: 0,
      fastestTransaction: 0,
      slowestTransaction: 0,
      successRate: 100,
      totalAmountDistributed: '0',
      uniqueVendors: 0,
      costEfficiency: {
        perMilestone: '0',
        perVendor: '0',
        vsTraditional: '0',
      },
    };
  }

  const totalGasUsed = transactions.reduce(
    (sum, tx) => sum + BigInt(tx.gasUsed),
    BigInt(0)
  );

  const totalGasCost = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.gasCost),
    0
  );

  const totalAmountDistributed = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amountReleased),
    0
  );

  const averageTransactionTime =
    transactions.reduce((sum, tx) => sum + tx.duration, 0) / transactions.length;

  const durations = transactions.map(tx => tx.duration).sort((a, b) => a - b);
  const fastestTransaction = durations[0] || 0;
  const slowestTransaction = durations[durations.length - 1] || 0;

  const uniqueVendors = new Set(transactions.map(tx => tx.vendorAddress)).size;

  // Cost efficiency calculations
  const traditionalFees = totalAmountDistributed * 0.03; // Assume 3% traditional payment processor fee
  const savingsVsTraditional = ((traditionalFees - totalGasCost) / traditionalFees) * 100;

  return {
    totalTransactions: transactions.length,
    totalGasUsed: totalGasUsed.toString(),
    totalGasCost: totalGasCost.toFixed(6),
    averageGasPerTx: Math.round(Number(totalGasUsed) / transactions.length),
    averageTransactionTime: Math.round(averageTransactionTime),
    fastestTransaction,
    slowestTransaction,
    successRate: 100, // Assuming all transactions in array succeeded
    totalAmountDistributed: totalAmountDistributed.toFixed(6),
    uniqueVendors,
    costEfficiency: {
      perMilestone: (totalGasCost / transactions.length).toFixed(6),
      perVendor: (totalGasCost / uniqueVendors).toFixed(6),
      vsTraditional: `${savingsVsTraditional.toFixed(2)}% savings`,
    },
  };
}

/**
 * Generate vendor-specific metrics
 */
export function generateVendorMetrics(
  transactions: TransactionMetrics[]
): VendorMetrics[] {
  const vendorMap = new Map<string, TransactionMetrics[]>();

  // Group by vendor
  transactions.forEach(tx => {
    if (!vendorMap.has(tx.vendorAddress)) {
      vendorMap.set(tx.vendorAddress, []);
    }
    vendorMap.get(tx.vendorAddress)!.push(tx);
  });

  // Calculate metrics per vendor
  return Array.from(vendorMap.entries()).map(([vendor, txs]) => {
    const totalReceived = txs.reduce((sum, tx) => sum + parseFloat(tx.amountReleased), 0);
    const totalGasUsed = txs.reduce((sum, tx) => sum + BigInt(tx.gasUsed), BigInt(0));
    const totalGasCost = txs.reduce((sum, tx) => sum + parseFloat(tx.gasCost), 0);
    const timestamps = txs.map(tx => tx.timestamp).sort((a, b) => a - b);

    return {
      vendorAddress: vendor,
      totalReceived: totalReceived.toFixed(6),
      transactionCount: txs.length,
      averageGasUsed: Math.round(Number(totalGasUsed) / txs.length),
      totalGasCost: totalGasCost.toFixed(6),
      firstPayment: timestamps[0],
      lastPayment: timestamps[timestamps.length - 1],
    };
  });
}

/**
 * Export metrics to CSV format
 */
export function exportMetricsToCSV(transactions: TransactionMetrics[]): string {
  const headers = [
    'Milestone',
    'Tx Hash',
    'Block Number',
    'Timestamp',
    'Duration (ms)',
    'Gas Used',
    'Gas Cost (ETH)',
    'Amount Released (ETH)',
    'Vendor Address',
  ].join(',');

  const rows = transactions.map(tx => [
    tx.milestoneIndex + 1,
    tx.txHash,
    tx.blockNumber,
    new Date(tx.timestamp).toISOString(),
    tx.duration,
    tx.gasUsed,
    tx.gasCost,
    tx.amountReleased,
    tx.vendorAddress,
  ].join(','));

  return [headers, ...rows].join('\n');
}

/**
 * Calculate real-time efficiency score
 */
export function calculateEfficiencyScore(analytics: PerformanceAnalytics): number {
  // Score based on multiple factors (0-100)
  const gasEfficiency = Math.max(0, 100 - (Number(analytics.totalGasCost) * 1000)); // Lower gas = better
  const speedScore = Math.max(0, 100 - (analytics.averageTransactionTime / 1000)); // Faster = better
  const successScore = analytics.successRate;
  
  return Math.round((gasEfficiency * 0.4 + speedScore * 0.3 + successScore * 0.3));
}
