/**
 * Wallet Security Hook - Phase 2 Zero Trust Security
 * Monitors wallet activity and calculates security metrics
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import { walletRiskAnalyzer, type WalletRiskMetrics, type WalletTransaction } from '@/lib/wallet-risk-analyzer';
import { smartContractAccessControl, type AccessLevel, type AccessCheckResult } from '@/lib/smart-contract-access';

export type WalletSecurityState = {
  isConnected: boolean;
  address: Address | null;
  riskMetrics: WalletRiskMetrics | null;
  accessLevel: AccessLevel;
  isLoading: boolean;
  lastChecked: Date | null;
  transactionHistory: WalletTransaction[];
};

export type UseWalletSecurityReturn = {
  security: WalletSecurityState;
  refreshSecurity: () => Promise<void>;
  checkAccess: (level: AccessLevel) => Promise<AccessCheckResult>;
  isSecure: boolean;
  trustScore: number; // 0-100, higher is better (inverse of risk score)
};

export function useWalletSecurity(): UseWalletSecurityReturn {
  const { address, isConnected } = useAccount();

  const [security, setSecurity] = useState<WalletSecurityState>({
    isConnected: false,
    address: null,
    riskMetrics: null,
    accessLevel: 'public',
    isLoading: false,
    lastChecked: null,
    transactionHistory: [],
  });

  /**
   * Fetch wallet transaction history
   */
  const fetchTransactionHistory = useCallback(async (walletAddress: Address): Promise<WalletTransaction[]> => {
    try {
      const response = await fetch('/api/zero-trust/wallet-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        console.error('Failed to fetch transaction history');
        return [];
      }

      const data = await response.json() as { transactions: WalletTransaction[] };
      return data.transactions || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }, []);

  /**
   * Analyze wallet security
   */
  const analyzeWalletSecurity = useCallback(async (walletAddress: Address): Promise<void> => {
    setSecurity((prev: WalletSecurityState) => ({ ...prev, isLoading: true }));

    try {
      // Fetch transaction history
      const transactions = await fetchTransactionHistory(walletAddress);

      // Analyze risk
      const riskMetrics = await walletRiskAnalyzer.analyzeWallet(walletAddress, transactions);

      // Determine access level
      const accessLevel = await smartContractAccessControl.getRecommendedAccessLevel(walletAddress);

      // Verify wallet with backend
      const verifyResponse = await fetch('/api/zero-trust/verify-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress,
          riskScore: riskMetrics.overallScore,
          transactionCount: riskMetrics.factors.transactionCount,
          accountAge: riskMetrics.factors.accountAge,
        }),
      });

      if (!verifyResponse.ok) {
        console.error('Wallet verification failed');
      }

      setSecurity({
        isConnected: true,
        address: walletAddress,
        riskMetrics,
        accessLevel,
        isLoading: false,
        lastChecked: new Date(),
        transactionHistory: transactions,
      });
    } catch (error) {
      console.error('Wallet security analysis error:', error);
      setSecurity((prev: WalletSecurityState) => ({
        ...prev,
        isLoading: false,
        lastChecked: new Date(),
      }));
    }
  }, [fetchTransactionHistory]);

  /**
   * Refresh security analysis
   */
  const refreshSecurity = useCallback(async (): Promise<void> => {
    if (address) {
      await analyzeWalletSecurity(address);
    }
  }, [address, analyzeWalletSecurity]);

  /**
   * Check specific access level
   */
  const checkAccess = useCallback(
    async (level: AccessLevel): Promise<AccessCheckResult> => {
      if (!address) {
        return {
          hasAccess: false,
          level,
          reasons: ['No wallet connected'],
          metadata: {
            verifiedAt: new Date().toISOString(),
          },
        };
      }

      return smartContractAccessControl.checkAccess(address, { level });
    },
    [address]
  );

  /**
   * Initialize security analysis on wallet connect
   */
  useEffect(() => {
    if (isConnected && address) {
      analyzeWalletSecurity(address);
    } else {
      setSecurity({
        isConnected: false,
        address: null,
        riskMetrics: null,
        accessLevel: 'public',
        isLoading: false,
        lastChecked: null,
        transactionHistory: [],
      });
    }
  }, [isConnected, address, analyzeWalletSecurity]);

  /**
   * Auto-refresh every 5 minutes
   */
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      refreshSecurity();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isConnected, address, refreshSecurity]);

  // Calculate trust score (inverse of risk score)
  const trustScore = security.riskMetrics
    ? Math.max(0, 100 - security.riskMetrics.overallScore)
    : 0;

  // Determine if wallet is secure (trust score > 70)
  const isSecure = trustScore >= 70;

  return {
    security,
    refreshSecurity,
    checkAccess,
    isSecure,
    trustScore,
  };
}
