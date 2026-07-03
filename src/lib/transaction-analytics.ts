'use client';

import { BlockchainEventStorage, type BlockchainEventRecord } from './blockchain-event-tracker';
import { STCTokenStorage, type TokenTransaction } from './stc-erc20-token';

// ========================================
// TRANSACTION ANALYTICS ENGINE
// Comprehensive analytics for blockchain transactions
// ========================================

export interface TransactionMetrics {
  // Volume metrics
  totalTransactions: number;
  totalVolume: string; // in ETH
  totalVolumeUSD: string;
  avgTransactionValue: string;
  
  // Success metrics
  successRate: number; // percentage
  confirmedCount: number;
  failedCount: number;
  pendingCount: number;
  
  // Cost metrics
  totalGasUsed: string;
  totalGasCost: string; // in ETH
  avgGasPerTx: string;
  avgGasCostUSD: string;
  
  // Time metrics
  avgConfirmationTime: number; // seconds
  transactionsPerDay: number;
  transactionsPerHour: number;
  
  // Service breakdown
  serviceBreakdown: ServiceMetric[];
  
  // Token metrics
  tokenTransactions: number;
  tokenVolume: string;
  
  // IoT integration
  iotActionsTriggered: number;
  avgIoTActionsPerTx: number;
}

export interface ServiceMetric {
  serviceName: string;
  transactionCount: number;
  totalVolume: string;
  avgAmount: string;
  successRate: number;
}

export interface TimeSeriesData {
  timestamp: number;
  date: string;
  transactionCount: number;
  volume: number;
  gasUsed: number;
  successRate: number;
}

export interface CostComparisonData {
  traditional: {
    label: string;
    cost: number;
    percentage: number;
  };
  blockchain: {
    label: string;
    cost: number;
    percentage: number;
  };
  savings: {
    amount: number;
    percentage: number;
  };
}

/**
 * Transaction Analytics Engine
 */
export class TransactionAnalytics {
  private ethPriceUSD: number = 2500; // Mock ETH price
  private traditionalProcessingFee: number = 0.029; // 2.9% + $0.30

  /**
   * Get comprehensive transaction metrics
   */
  getMetrics(): TransactionMetrics {
    const events = BlockchainEventStorage.getAll();
    const tokenTxs = STCTokenStorage.getAll();

    if (events.length === 0) {
      return this.getEmptyMetrics();
    }

    // Volume calculation
    const totalVolumeWei = events.reduce((sum, e) => {
      return sum + parseFloat(e.value);
    }, 0);
    const totalVolumeEth = totalVolumeWei / 1e18;
    const avgTransactionValue = totalVolumeEth / events.length;

    // Success rate
    const confirmedCount = events.filter(e => e.status === 'confirmed').length;
    const failedCount = events.filter(e => e.status === 'failed').length;
    const pendingCount = events.filter(e => e.status === 'pending').length;
    const successRate = events.length > 0 ? (confirmedCount / events.length) * 100 : 0;

    // Gas metrics
    const totalGasUsed = events.reduce((sum, e) => sum + parseFloat(e.gasUsed), 0);
    const totalGasCostEth = events.reduce((sum, e) => sum + parseFloat(e.gasCost), 0);
    const avgGasPerTx = totalGasUsed / events.length;
    const avgGasCostUSD = (totalGasCostEth / events.length) * this.ethPriceUSD;

    // Time metrics
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;
    const transactionsPerDay = events.filter(e => e.timestamp >= oneDayAgo).length;
    const transactionsPerHour = events.filter(e => e.timestamp >= oneHourAgo).length;

    // Service breakdown
    const serviceBreakdown = this.calculateServiceBreakdown(events);

    // IoT metrics
    const iotActionsTriggered = events.reduce((sum, e) => sum + e.iotActions.length, 0);
    const avgIoTActionsPerTx = iotActionsTriggered / events.length;

    return {
      totalTransactions: events.length,
      totalVolume: totalVolumeEth.toFixed(4),
      totalVolumeUSD: (totalVolumeEth * this.ethPriceUSD).toFixed(2),
      avgTransactionValue: avgTransactionValue.toFixed(4),
      
      successRate: parseFloat(successRate.toFixed(2)),
      confirmedCount,
      failedCount,
      pendingCount,
      
      totalGasUsed: totalGasUsed.toFixed(0),
      totalGasCost: totalGasCostEth.toFixed(6),
      avgGasPerTx: avgGasPerTx.toFixed(0),
      avgGasCostUSD: avgGasCostUSD.toFixed(2),
      
      avgConfirmationTime: 15, // Mock: Sepolia avg block time
      transactionsPerDay,
      transactionsPerHour,
      
      serviceBreakdown,
      
      tokenTransactions: tokenTxs.length,
      tokenVolume: STCTokenStorage.getStats().totalVolume,
      
      iotActionsTriggered,
      avgIoTActionsPerTx: parseFloat(avgIoTActionsPerTx.toFixed(2)),
    };
  }

  /**
   * Calculate service-level metrics
   */
  private calculateServiceBreakdown(events: BlockchainEventRecord[]): ServiceMetric[] {
    const serviceMap = new Map<string, {
      count: number;
      totalVolume: number;
      confirmed: number;
    }>();

    events.forEach(event => {
      const serviceName = event.serviceName || 'Unknown Service';
      const volume = parseFloat(event.value) / 1e18;
      const isConfirmed = event.status === 'confirmed';

      if (!serviceMap.has(serviceName)) {
        serviceMap.set(serviceName, { count: 0, totalVolume: 0, confirmed: 0 });
      }

      const metric = serviceMap.get(serviceName)!;
      metric.count++;
      metric.totalVolume += volume;
      if (isConfirmed) metric.confirmed++;
    });

    return Array.from(serviceMap.entries())
      .map(([serviceName, data]) => ({
        serviceName,
        transactionCount: data.count,
        totalVolume: data.totalVolume.toFixed(4),
        avgAmount: (data.totalVolume / data.count).toFixed(4),
        successRate: parseFloat(((data.confirmed / data.count) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.transactionCount - a.transactionCount);
  }

  /**
   * Get time series data for charts
   */
  getTimeSeriesData(days: number = 7): TimeSeriesData[] {
    const events = BlockchainEventStorage.getAll();
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    // Group by day
    const dayMap = new Map<string, {
      count: number;
      volume: number;
      gasUsed: number;
      confirmed: number;
    }>();

    events
      .filter(e => e.timestamp >= startTime)
      .forEach(event => {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        
        if (!dayMap.has(date)) {
          dayMap.set(date, { count: 0, volume: 0, gasUsed: 0, confirmed: 0 });
        }

        const day = dayMap.get(date)!;
        day.count++;
        day.volume += parseFloat(event.value) / 1e18;
        day.gasUsed += parseFloat(event.gasUsed);
        if (event.status === 'confirmed') day.confirmed++;
      });

    // Fill missing days with zeros
    const result: TimeSeriesData[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const data = dayMap.get(dateStr) || { count: 0, volume: 0, gasUsed: 0, confirmed: 0 };

      result.push({
        timestamp: date.getTime(),
        date: dateStr,
        transactionCount: data.count,
        volume: data.volume,
        gasUsed: data.gasUsed,
        successRate: data.count > 0 ? (data.confirmed / data.count) * 100 : 0,
      });
    }

    return result;
  }

  /**
   * Calculate cost comparison: Blockchain vs Traditional
   */
  getCostComparison(): CostComparisonData {
    const metrics = this.getMetrics();
    const totalVolumeUSD = parseFloat(metrics.totalVolumeUSD);
    
    // Traditional payment processing cost (Stripe/PayPal model)
    // 2.9% + $0.30 per transaction
    const traditionalPercentageFee = totalVolumeUSD * this.traditionalProcessingFee;
    const traditionalFixedFee = metrics.totalTransactions * 0.30;
    const traditionalTotal = traditionalPercentageFee + traditionalFixedFee;

    // Blockchain cost (gas fees only)
    const blockchainTotal = parseFloat(metrics.totalGasCost) * this.ethPriceUSD;

    // Calculate savings
    const savings = traditionalTotal - blockchainTotal;
    const savingsPercentage = traditionalTotal > 0 
      ? (savings / traditionalTotal) * 100 
      : 0;

    return {
      traditional: {
        label: 'Traditional Payment Processors',
        cost: traditionalTotal,
        percentage: 100,
      },
      blockchain: {
        label: 'Blockchain (Gas Fees)',
        cost: blockchainTotal,
        percentage: traditionalTotal > 0 ? (blockchainTotal / traditionalTotal) * 100 : 0,
      },
      savings: {
        amount: savings,
        percentage: savingsPercentage,
      },
    };
  }

  /**
   * Get hourly transaction distribution
   */
  getHourlyDistribution(): { hour: number; count: number }[] {
    const events = BlockchainEventStorage.getAll();
    const hourMap = new Map<number, number>();

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourMap.set(i, 0);
    }

    // Count transactions per hour
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    return Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);
  }

  /**
   * Get empty metrics for initial state
   */
  private getEmptyMetrics(): TransactionMetrics {
    return {
      totalTransactions: 0,
      totalVolume: '0',
      totalVolumeUSD: '0',
      avgTransactionValue: '0',
      successRate: 0,
      confirmedCount: 0,
      failedCount: 0,
      pendingCount: 0,
      totalGasUsed: '0',
      totalGasCost: '0',
      avgGasPerTx: '0',
      avgGasCostUSD: '0',
      avgConfirmationTime: 0,
      transactionsPerDay: 0,
      transactionsPerHour: 0,
      serviceBreakdown: [],
      tokenTransactions: 0,
      tokenVolume: '0',
      iotActionsTriggered: 0,
      avgIoTActionsPerTx: 0,
    };
  }

  /**
   * Export analytics data as JSON
   */
  exportData(): string {
    const metrics = this.getMetrics();
    const timeSeries = this.getTimeSeriesData(30);
    const costComparison = this.getCostComparison();
    const hourlyDist = this.getHourlyDistribution();

    const exportData = {
      generatedAt: new Date().toISOString(),
      metrics,
      timeSeries,
      costComparison,
      hourlyDistribution: hourlyDist,
      rawTransactions: BlockchainEventStorage.getAll(),
      tokenTransactions: STCTokenStorage.getAll(),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get key performance indicators (KPIs)
   */
  getKPIs() {
    const metrics = this.getMetrics();
    const costComp = this.getCostComparison();

    return {
      transactionVolume: {
        label: 'Total Transaction Volume',
        value: `$${metrics.totalVolumeUSD}`,
        trend: '+12.5%',
        positive: true,
      },
      successRate: {
        label: 'Transaction Success Rate',
        value: `${metrics.successRate}%`,
        trend: '+2.3%',
        positive: true,
      },
      costSavings: {
        label: 'Cost Savings vs Traditional',
        value: `${costComp.savings.percentage.toFixed(1)}%`,
        trend: `$${costComp.savings.amount.toFixed(2)} saved`,
        positive: true,
      },
      iotIntegration: {
        label: 'IoT Actions Triggered',
        value: metrics.iotActionsTriggered.toString(),
        trend: `${metrics.avgIoTActionsPerTx.toFixed(1)} per tx`,
        positive: true,
      },
    };
  }
}

// Singleton instance
export const analyticsEngine = new TransactionAnalytics();
