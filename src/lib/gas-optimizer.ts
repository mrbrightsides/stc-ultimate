'use client';

import { ethers } from 'ethers';

// ========================================
// GAS OPTIMIZATION UTILITIES
// Dynamic gas estimation with EIP-1559 support
// ========================================

export type TransactionSpeed = 'slow' | 'medium' | 'fast' | 'instant';

export interface GasEstimate {
  gasLimit: ethers.BigNumber;
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas: ethers.BigNumber;
  totalCostWei: ethers.BigNumber;
  totalCostEth: string;
  totalCostUsd?: string;
  estimatedTime: string;
  speed: TransactionSpeed;
}

export interface GasEstimateOptions {
  speed?: TransactionSpeed;
  maxFeePerGasGwei?: number;
  maxPriorityFeePerGasGwei?: number;
  ethPriceUsd?: number;
}

export interface GasHistory {
  timestamp: number;
  baseFee: number;
  priorityFee: number;
  gasUsed: number;
  totalCost: string;
}

// Speed configurations (priority fee multipliers)
const SPEED_CONFIG: Record<TransactionSpeed, {
  priorityFeeMultiplier: number;
  maxFeeMultiplier: number;
  estimatedTime: string;
}> = {
  slow: {
    priorityFeeMultiplier: 1.0,
    maxFeeMultiplier: 1.1,
    estimatedTime: '2-5 minutes',
  },
  medium: {
    priorityFeeMultiplier: 1.5,
    maxFeeMultiplier: 1.3,
    estimatedTime: '1-2 minutes',
  },
  fast: {
    priorityFeeMultiplier: 2.0,
    maxFeeMultiplier: 1.5,
    estimatedTime: '30-60 seconds',
  },
  instant: {
    priorityFeeMultiplier: 3.0,
    maxFeeMultiplier: 2.0,
    estimatedTime: '15-30 seconds',
  },
};

/**
 * Get current network gas prices
 */
export async function getCurrentGasPrices(
  provider: ethers.providers.Provider
): Promise<{
  baseFee: ethers.BigNumber;
  priorityFee: ethers.BigNumber;
  maxFee: ethers.BigNumber;
}> {
  try {
    // Get latest block for base fee
    const block = await provider.getBlock('latest');
    const baseFee = block.baseFeePerGas || ethers.BigNumber.from(0);

    // Get suggested priority fee
    const feeData = await provider.getFeeData();
    const priorityFee = feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('2', 'gwei');
    const maxFee = feeData.maxFeePerGas || baseFee.add(priorityFee);

    return {
      baseFee,
      priorityFee,
      maxFee,
    };
  } catch (error) {
    console.error('Failed to get gas prices:', error);
    
    // Fallback values
    return {
      baseFee: ethers.utils.parseUnits('30', 'gwei'),
      priorityFee: ethers.utils.parseUnits('2', 'gwei'),
      maxFee: ethers.utils.parseUnits('35', 'gwei'),
    };
  }
}

/**
 * Estimate gas for transaction with dynamic pricing
 */
export async function estimateGasWithSpeed(
  transaction: ethers.providers.TransactionRequest,
  provider: ethers.providers.Provider,
  options: GasEstimateOptions = {}
): Promise<GasEstimate> {
  const speed = options.speed || 'medium';
  const speedConfig = SPEED_CONFIG[speed];

  try {
    // Estimate gas limit
    const gasLimit = await provider.estimateGas(transaction);
    
    // Add 20% buffer for safety
    const gasLimitWithBuffer = gasLimit.mul(120).div(100);

    // Get current gas prices
    const { baseFee, priorityFee } = await getCurrentGasPrices(provider);

    // Calculate fees based on speed
    let maxPriorityFeePerGas: ethers.BigNumber;
    let maxFeePerGas: ethers.BigNumber;

    if (options.maxPriorityFeePerGasGwei) {
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        options.maxPriorityFeePerGasGwei.toString(),
        'gwei'
      );
    } else {
      maxPriorityFeePerGas = priorityFee.mul(
        Math.floor(speedConfig.priorityFeeMultiplier * 100)
      ).div(100);
    }

    if (options.maxFeePerGasGwei) {
      maxFeePerGas = ethers.utils.parseUnits(
        options.maxFeePerGasGwei.toString(),
        'gwei'
      );
    } else {
      maxFeePerGas = baseFee.mul(
        Math.floor(speedConfig.maxFeeMultiplier * 100)
      ).div(100).add(maxPriorityFeePerGas);
    }

    // Calculate total cost
    const totalCostWei = gasLimitWithBuffer.mul(maxFeePerGas);
    const totalCostEth = ethers.utils.formatEther(totalCostWei);

    // Calculate USD cost if price provided
    let totalCostUsd: string | undefined;
    if (options.ethPriceUsd) {
      totalCostUsd = (parseFloat(totalCostEth) * options.ethPriceUsd).toFixed(2);
    }

    return {
      gasLimit: gasLimitWithBuffer,
      maxFeePerGas,
      maxPriorityFeePerGas,
      totalCostWei,
      totalCostEth,
      totalCostUsd,
      estimatedTime: speedConfig.estimatedTime,
      speed,
    };
  } catch (error) {
    console.error('Gas estimation failed:', error);
    throw new Error('Failed to estimate gas. Transaction may fail.');
  }
}

/**
 * Get gas estimates for all speeds
 */
export async function getGasEstimatesForAllSpeeds(
  transaction: ethers.providers.TransactionRequest,
  provider: ethers.providers.Provider,
  ethPriceUsd?: number
): Promise<Record<TransactionSpeed, GasEstimate>> {
  const speeds: TransactionSpeed[] = ['slow', 'medium', 'fast', 'instant'];
  
  const estimates = await Promise.all(
    speeds.map(speed => 
      estimateGasWithSpeed(transaction, provider, { speed, ethPriceUsd })
    )
  );

  return {
    slow: estimates[0],
    medium: estimates[1],
    fast: estimates[2],
    instant: estimates[3],
  };
}

/**
 * Optimize transaction with best gas settings
 */
export function applyGasEstimate(
  transaction: ethers.providers.TransactionRequest,
  estimate: GasEstimate
): ethers.providers.TransactionRequest {
  return {
    ...transaction,
    gasLimit: estimate.gasLimit,
    maxFeePerGas: estimate.maxFeePerGas,
    maxPriorityFeePerGas: estimate.maxPriorityFeePerGas,
    type: 2, // EIP-1559
  };
}

/**
 * Get ETH price in USD from Chainlink oracle (simplified)
 */
export async function getEthPriceUSD(
  provider: ethers.providers.Provider
): Promise<number> {
  try {
    // In production, use Chainlink price feed
    // For now, use a fallback API or fixed price
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum?.usd || 3000;
  } catch (error) {
    console.warn('Failed to fetch ETH price, using default:', error);
    return 3000; // Fallback price
  }
}

/**
 * Save gas usage history to localStorage
 */
export function saveGasHistory(estimate: GasEstimate, txHash: string): void {
  try {
    const history: GasHistory[] = JSON.parse(
      localStorage.getItem('stc_gas_history') || '[]'
    );

    history.unshift({
      timestamp: Date.now(),
      baseFee: parseFloat(ethers.utils.formatUnits(estimate.maxFeePerGas, 'gwei')),
      priorityFee: parseFloat(ethers.utils.formatUnits(estimate.maxPriorityFeePerGas, 'gwei')),
      gasUsed: estimate.gasLimit.toNumber(),
      totalCost: estimate.totalCostEth,
    });

    // Keep last 100 entries
    const limited = history.slice(0, 100);
    localStorage.setItem('stc_gas_history', JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save gas history:', error);
  }
}

/**
 * Get gas usage history
 */
export function getGasHistory(): GasHistory[] {
  try {
    return JSON.parse(localStorage.getItem('stc_gas_history') || '[]');
  } catch {
    return [];
  }
}

/**
 * Get gas statistics
 */
export function getGasStats(): {
  avgBaseFee: number;
  avgPriorityFee: number;
  avgTotalCost: number;
  totalTransactions: number;
} {
  const history = getGasHistory();
  
  if (history.length === 0) {
    return {
      avgBaseFee: 0,
      avgPriorityFee: 0,
      avgTotalCost: 0,
      totalTransactions: 0,
    };
  }

  const totalBaseFee = history.reduce((sum, h) => sum + h.baseFee, 0);
  const totalPriorityFee = history.reduce((sum, h) => sum + h.priorityFee, 0);
  const totalCost = history.reduce((sum, h) => sum + parseFloat(h.totalCost), 0);

  return {
    avgBaseFee: totalBaseFee / history.length,
    avgPriorityFee: totalPriorityFee / history.length,
    avgTotalCost: totalCost / history.length,
    totalTransactions: history.length,
  };
}

/**
 * Format gas price for display
 */
export function formatGasPrice(wei: ethers.BigNumber, decimals: number = 2): string {
  const gwei = ethers.utils.formatUnits(wei, 'gwei');
  return parseFloat(gwei).toFixed(decimals);
}

/**
 * Compare gas estimates
 */
export function compareGasEstimates(
  estimate1: GasEstimate,
  estimate2: GasEstimate
): {
  cheaperSpeed: TransactionSpeed;
  savingsWei: ethers.BigNumber;
  savingsEth: string;
  savingsPercent: number;
} {
  const diff = estimate1.totalCostWei.sub(estimate2.totalCostWei);
  const cheaper = diff.gt(0) ? estimate2 : estimate1;
  const savingsWei = diff.abs();
  const savingsEth = ethers.utils.formatEther(savingsWei);
  
  const higherCost = diff.gt(0) ? estimate1.totalCostWei : estimate2.totalCostWei;
  const savingsPercent = savingsWei.mul(10000).div(higherCost).toNumber() / 100;

  return {
    cheaperSpeed: cheaper.speed,
    savingsWei,
    savingsEth,
    savingsPercent,
  };
}
