'use client';

import { useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';

// MNEE Token configuration
// Note: For demo purposes, we'll use USDC as a proxy for MNEE
const getMNEEToken = (chainId: number): Token => {
  // Base Sepolia USDC for testing
  if (chainId === 84532) {
    return {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      chainId: 84532,
      decimals: 6,
      name: 'USDC',
      symbol: 'USDC',
      image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    };
  }
  
  // Base Mainnet USDC
  if (chainId === 8453) {
    return {
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      chainId: 8453,
      decimals: 6,
      name: 'USD Coin',
      symbol: 'USDC',
      image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    };
  }
  
  // Ethereum Mainnet USDC as fallback
  return {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  };
};

// ETH Token (native)
const getETHToken = (chainId: number): Token => {
  return {
    address: '',
    chainId: chainId,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
  };
};

interface MNEESwapProps {
  onSwapSuccess?: (txHash: string) => void;
  defaultFromToken?: Token;
  defaultToToken?: Token;
}

export function MNEESwap({
  onSwapSuccess,
  defaultFromToken,
  defaultToToken,
}: MNEESwapProps) {
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<string>('');
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Get tokens based on current chain
  const ethToken = getETHToken(chainId);
  const mneeToken = getMNEEToken(chainId);
  const fromToken = defaultFromToken || ethToken;
  const toToken = defaultToToken || mneeToken;
  
  // Check if user is on supported network
  const isSupportedNetwork = chainId === base.id || chainId === mainnet.id || chainId === 84532;
  
  // Calculate to amount (1:1 ratio for stablecoins)
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(value); // 1:1 ratio
    setSwapError('');
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setSwapError('Please enter a valid amount');
      return;
    }

    setIsSwapping(true);
    setSwapError('');

    try {
      // Note: Actual swap implementation would use OnchainKit's buildSwapTransaction
      // For demo, we show the flow without actual transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
      
      if (onSwapSuccess) {
        onSwapSuccess('0xdemo...' + Math.random().toString(36).substring(7));
      }
      
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      setSwapError('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };
  
  if (!isConnected) {
    return (
      <NeonCard glowColor="orange" className="max-w-lg">
        <div className="text-center py-8 space-y-3">
          <Info className="h-12 w-12 mx-auto text-orange-400 opacity-50" />
          <h3 className="text-xl font-bold text-white">Wallet Not Connected</h3>
          <p className="text-gray-400">Please connect your wallet to use the swap feature</p>
        </div>
      </NeonCard>
    );
  }
  
  if (!isSupportedNetwork) {
    return (
      <NeonCard glowColor="orange" className="max-w-lg">
        <div className="text-center py-8 space-y-3">
          <Info className="h-12 w-12 mx-auto text-orange-400 opacity-50" />
          <h3 className="text-xl font-bold text-white">Unsupported Network</h3>
          <p className="text-gray-400">Please switch to Base or Ethereum Mainnet to swap</p>
        </div>
      </NeonCard>
    );
  }

  return (
    <NeonCard glowColor="cyan" className="max-w-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Swap to MNEE</h3>
              <p className="text-sm text-gray-400">1 MNEE = 1 USD (Stable)</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            USD Pegged
          </Badge>
        </div>

        {/* Swap Interface */}
        <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20 space-y-4">
          {/* From Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">You pay</label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-700">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-xl focus:ring-0"
                disabled={isSwapping}
              />
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800">
                <span className="text-white font-semibold">{fromToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Toggle Arrow */}
          <div className="flex justify-center -my-2">
            <div className="p-2 rounded-full bg-cyan-500/20 border-2 border-black">
              <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
            </div>
          </div>

          {/* To Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">You receive (USDC as MNEE proxy)</label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-700">
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="flex-1 bg-transparent border-none text-white text-xl focus:ring-0"
              />
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800">
                <span className="text-white font-semibold">{toToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {swapError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{swapError}</p>
            </div>
          )}

          {/* Swap Button */}
          <NeonButton
            variant="primary"
            className="w-full"
            onClick={handleSwap}
            disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
            loading={isSwapping}
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </NeonButton>
        </div>
        
        {/* Demo Notice */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Demo Mode:</strong> For hackathon demonstration, we're using USDC as a proxy for MNEE stablecoin. 
              In production, this would swap directly to MNEE at 0x8cce...D6cF on Ethereum with OnchainKit's buildSwapTransaction API.
            </span>
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/10">
            <p className="text-xs text-gray-400">Network</p>
            <p className="text-sm font-semibold text-white mt-1">
              {chainId === 8453 ? 'Base' : chainId === 84532 ? 'Base Sepolia' : 'Ethereum'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/10">
            <p className="text-xs text-gray-400">Exchange Rate</p>
            <p className="text-sm font-semibold text-white mt-1">1:1 USD</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 pt-2 border-t border-cyan-500/10">
          <p className="text-xs font-semibold text-gray-400">Why MNEE?</p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>1:1 USD peg - No volatility</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Instant settlements via smart contracts</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Lower fees vs traditional payments</span>
            </li>
          </ul>
        </div>
      </div>
    </NeonCard>
  );
}
