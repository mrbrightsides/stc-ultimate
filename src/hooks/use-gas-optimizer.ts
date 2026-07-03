'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { TransactionSpeed, GasEstimate } from '@/lib/gas-optimizer';
import {
  estimateGasWithSpeed,
  getGasEstimatesForAllSpeeds,
  getEthPriceUSD,
  applyGasEstimate,
  saveGasHistory,
  getGasStats,
} from '@/lib/gas-optimizer';

// ========================================
// GAS OPTIMIZER HOOK
// React hook for gas estimation and optimization
// ========================================

export interface UseGasOptimizerOptions {
  transaction: ethers.providers.TransactionRequest;
  provider: ethers.providers.Provider | null;
  autoEstimate?: boolean;
}

export function useGasOptimizer(options: UseGasOptimizerOptions) {
  const { transaction, provider, autoEstimate = true } = options;

  const [estimates, setEstimates] = useState<Record<TransactionSpeed, GasEstimate> | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<TransactionSpeed>('medium');
  const [ethPrice, setEthPrice] = useState<number>(3000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch ETH price
  useEffect(() => {
    if (provider) {
      getEthPriceUSD(provider).then(setEthPrice).catch(console.error);
    }
  }, [provider]);

  // Estimate gas for all speeds
  const estimateGas = useCallback(async () => {
    if (!provider) {
      setError(new Error('Provider not available'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allEstimates = await getGasEstimatesForAllSpeeds(
        transaction,
        provider,
        ethPrice
      );
      setEstimates(allEstimates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Gas estimation failed');
      setError(error);
      console.error('Failed to estimate gas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, transaction, ethPrice]);

  // Auto-estimate on mount and when dependencies change
  useEffect(() => {
    if (autoEstimate && provider) {
      estimateGas();
    }
  }, [autoEstimate, provider, estimateGas]);

  // Get optimized transaction
  const getOptimizedTransaction = useCallback(() => {
    if (!estimates) return transaction;
    
    const estimate = estimates[selectedSpeed];
    return applyGasEstimate(transaction, estimate);
  }, [transaction, estimates, selectedSpeed]);

  // Execute transaction with selected gas settings
  const executeWithOptimizedGas = useCallback(async (
    signer: ethers.Signer
  ): Promise<ethers.providers.TransactionResponse> => {
    if (!estimates) {
      throw new Error('Gas not estimated yet');
    }

    const optimizedTx = getOptimizedTransaction();
    const tx = await signer.sendTransaction(optimizedTx);
    
    // Save gas history
    const estimate = estimates[selectedSpeed];
    saveGasHistory(estimate, tx.hash);

    return tx;
  }, [estimates, selectedSpeed, getOptimizedTransaction]);

  // Get current estimate
  const currentEstimate = estimates ? estimates[selectedSpeed] : null;

  // Get gas stats
  const stats = getGasStats();

  return {
    estimates,
    currentEstimate,
    selectedSpeed,
    setSelectedSpeed,
    ethPrice,
    isLoading,
    error,
    estimateGas,
    getOptimizedTransaction,
    executeWithOptimizedGas,
    stats,
  };
}
