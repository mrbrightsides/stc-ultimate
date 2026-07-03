/**
 * Wallet Risk Analyzer - Phase 2 Zero Trust Security
 * Analyzes wallet transaction patterns and calculates risk scores
 */

import type { Address } from 'viem';

export type TransactionPattern = {
  count: number;
  volume: bigint;
  avgAmount: bigint;
  frequency: number; // transactions per day
  lastActivity: Date | null;
};

export type WalletRiskMetrics = {
  overallScore: number; // 0-100, lower is better
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    accountAge: number; // days
    transactionCount: number;
    totalVolume: string;
    suspiciousPatterns: string[];
    trustIndicators: string[];
  };
  recommendations: string[];
};

export type WalletTransaction = {
  hash: string;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  blockNumber: number;
};

export class WalletRiskAnalyzer {
  private readonly HIGH_FREQUENCY_THRESHOLD = 50; // transactions per day
  private readonly SUSPICIOUS_AMOUNT_THRESHOLD = BigInt('1000000000000000000'); // 1 ETH
  private readonly NEW_ACCOUNT_DAYS = 30;

  /**
   * Analyze wallet risk based on transaction history
   */
  async analyzeWallet(address: Address, transactions: WalletTransaction[]): Promise<WalletRiskMetrics> {
    const now = Date.now();
    const patterns = this.extractPatterns(transactions);
    const accountAge = this.calculateAccountAge(transactions);
    const suspiciousPatterns = this.detectSuspiciousPatterns(transactions, patterns);
    const trustIndicators = this.identifyTrustIndicators(transactions, patterns, accountAge);

    let riskScore = 0;

    // Factor 1: Account Age (0-20 points)
    if (accountAge < this.NEW_ACCOUNT_DAYS) {
      riskScore += 20 - Math.floor((accountAge / this.NEW_ACCOUNT_DAYS) * 20);
    }

    // Factor 2: Transaction Frequency (0-20 points)
    if (patterns.frequency > this.HIGH_FREQUENCY_THRESHOLD) {
      riskScore += Math.min(20, Math.floor((patterns.frequency / this.HIGH_FREQUENCY_THRESHOLD) * 10));
    }

    // Factor 3: Suspicious Patterns (0-30 points)
    riskScore += Math.min(30, suspiciousPatterns.length * 10);

    // Factor 4: Low Activity (0-15 points)
    if (patterns.count < 5 && accountAge > 90) {
      riskScore += 15;
    }

    // Factor 5: Recent Inactivity (0-15 points)
    if (patterns.lastActivity) {
      const daysSinceActivity = (now - patterns.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > 180) {
        riskScore += 15;
      } else if (daysSinceActivity > 90) {
        riskScore += 10;
      }
    }

    // Reduce score for trust indicators
    riskScore = Math.max(0, riskScore - trustIndicators.length * 5);

    const riskLevel = this.calculateRiskLevel(riskScore);
    const recommendations = this.generateRecommendations(riskScore, suspiciousPatterns, trustIndicators);

    return {
      overallScore: Math.min(100, riskScore),
      riskLevel,
      factors: {
        accountAge,
        transactionCount: patterns.count,
        totalVolume: patterns.volume.toString(),
        suspiciousPatterns,
        trustIndicators,
      },
      recommendations,
    };
  }

  /**
   * Extract transaction patterns
   */
  private extractPatterns(transactions: WalletTransaction[]): TransactionPattern {
    if (transactions.length === 0) {
      return {
        count: 0,
        volume: BigInt(0),
        avgAmount: BigInt(0),
        frequency: 0,
        lastActivity: null,
      };
    }

    const totalVolume = transactions.reduce((sum: bigint, tx: WalletTransaction) => sum + tx.value, BigInt(0));
    const avgAmount = totalVolume / BigInt(transactions.length);

    const timestamps = transactions.map((tx: WalletTransaction) => tx.timestamp);
    const oldestTx = Math.min(...timestamps);
    const newestTx = Math.max(...timestamps);
    const daysDiff = (newestTx - oldestTx) / (1000 * 60 * 60 * 24);
    const frequency = daysDiff > 0 ? transactions.length / daysDiff : 0;

    return {
      count: transactions.length,
      volume: totalVolume,
      avgAmount,
      frequency,
      lastActivity: new Date(newestTx),
    };
  }

  /**
   * Calculate account age in days
   */
  private calculateAccountAge(transactions: WalletTransaction[]): number {
    if (transactions.length === 0) return 0;

    const oldestTx = Math.min(...transactions.map((tx: WalletTransaction) => tx.timestamp));
    const now = Date.now();
    return Math.floor((now - oldestTx) / (1000 * 60 * 60 * 24));
  }

  /**
   * Detect suspicious transaction patterns
   */
  private detectSuspiciousPatterns(transactions: WalletTransaction[], patterns: TransactionPattern): string[] {
    const suspicious: string[] = [];

    // High-frequency trading
    if (patterns.frequency > this.HIGH_FREQUENCY_THRESHOLD) {
      suspicious.push(`High transaction frequency: ${patterns.frequency.toFixed(2)} tx/day`);
    }

    // Large single transactions
    const largeTxCount = transactions.filter((tx: WalletTransaction) => tx.value > this.SUSPICIOUS_AMOUNT_THRESHOLD).length;
    if (largeTxCount > 0) {
      suspicious.push(`${largeTxCount} large transactions detected (>1 ETH)`);
    }

    // Round-trip patterns (sent and received similar amounts)
    const roundTrips = this.detectRoundTrips(transactions);
    if (roundTrips > 0) {
      suspicious.push(`${roundTrips} potential round-trip transactions`);
    }

    // Rapid sequential transactions
    const rapidSequences = this.detectRapidSequences(transactions);
    if (rapidSequences > 0) {
      suspicious.push(`${rapidSequences} rapid transaction sequences (<1 min apart)`);
    }

    return suspicious;
  }

  /**
   * Identify trust indicators
   */
  private identifyTrustIndicators(transactions: WalletTransaction[], patterns: TransactionPattern, accountAge: number): string[] {
    const indicators: string[] = [];

    // Mature account
    if (accountAge > 365) {
      indicators.push(`Mature account (${Math.floor(accountAge / 365)} years old)`);
    }

    // Consistent activity
    if (patterns.count > 50 && patterns.frequency > 0.5 && patterns.frequency < 10) {
      indicators.push('Consistent transaction activity');
    }

    // Diverse transaction amounts
    const uniqueAmounts = new Set(transactions.map((tx: WalletTransaction) => tx.value.toString())).size;
    if (uniqueAmounts > transactions.length * 0.7) {
      indicators.push('Diverse transaction amounts (less pattern-like)');
    }

    // Regular interaction with known contracts
    const uniqueRecipients = new Set(transactions.map((tx: WalletTransaction) => tx.to)).size;
    if (uniqueRecipients > 10) {
      indicators.push(`Interacts with ${uniqueRecipients} different addresses`);
    }

    return indicators;
  }

  /**
   * Detect round-trip transactions
   */
  private detectRoundTrips(transactions: WalletTransaction[]): number {
    let count = 0;
    const tolerance = BigInt('10000000000000000'); // 0.01 ETH tolerance

    for (let i = 0; i < transactions.length - 1; i++) {
      for (let j = i + 1; j < transactions.length; j++) {
        const tx1 = transactions[i];
        const tx2 = transactions[j];

        // Check if amounts are similar and addresses are swapped
        if (
          tx1.to === tx2.from &&
          tx1.from === tx2.to &&
          this.amountsSimilar(tx1.value, tx2.value, tolerance)
        ) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Detect rapid sequential transactions
   */
  private detectRapidSequences(transactions: WalletTransaction[]): number {
    if (transactions.length < 2) return 0;

    let count = 0;
    const sortedTxs = [...transactions].sort((a: WalletTransaction, b: WalletTransaction) => a.timestamp - b.timestamp);

    for (let i = 0; i < sortedTxs.length - 1; i++) {
      const timeDiff = sortedTxs[i + 1].timestamp - sortedTxs[i].timestamp;
      if (timeDiff < 60000) { // Less than 1 minute
        count++;
      }
    }

    return count;
  }

  /**
   * Check if two amounts are similar within tolerance
   */
  private amountsSimilar(amount1: bigint, amount2: bigint, tolerance: bigint): boolean {
    const diff = amount1 > amount2 ? amount1 - amount2 : amount2 - amount1;
    return diff <= tolerance;
  }

  /**
   * Calculate risk level from score
   */
  private calculateRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(score: number, suspicious: string[], trustIndicators: string[]): string[] {
    const recommendations: string[] = [];

    if (score >= 50) {
      recommendations.push('Enable multi-factor authentication (MFA) for all sensitive operations');
      recommendations.push('Limit transaction amounts for this session');
    }

    if (suspicious.length > 2) {
      recommendations.push('Additional identity verification required');
      recommendations.push('Manual review of recent transaction patterns');
    }

    if (trustIndicators.length === 0) {
      recommendations.push('Build trust score by maintaining consistent activity');
      recommendations.push('Verify identity through additional on-chain proof');
    }

    if (score < 30 && trustIndicators.length > 2) {
      recommendations.push('Good security posture maintained');
      recommendations.push('Continue regular transaction patterns');
    }

    return recommendations;
  }
}

export const walletRiskAnalyzer = new WalletRiskAnalyzer();
