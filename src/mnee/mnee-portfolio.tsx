'use client';

import { useState, useEffect } from 'react';
import {
  Avatar,
  Name,
  Identity,
  Address,
} from '@coinbase/onchainkit/identity';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  DollarSign,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import type { MNEETokenInfo } from '@/lib/mnee-token';

interface MNEEPortfolioProps {
  mneeInfo: MNEETokenInfo | null;
  onRefresh?: () => void;
}

export function MNEEPortfolio({ mneeInfo, onRefresh }: MNEEPortfolioProps) {
  const { address, isConnected } = useAccount();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [priceChange, setPriceChange] = useState('+0.00');

  // Mock price data for demo (MNEE is pegged 1:1 to USD)
  const portfolio = {
    mneeBalance: mneeInfo?.userBalance || '0',
    usdValue: mneeInfo?.usdValue || '0',
    ethEquivalent: (parseFloat(mneeInfo?.usdValue || '0') / 3000).toFixed(6),
    priceUSD: '1.00',
    change24h: priceChange,
    allocation: {
      mnee: 100,
      other: 0,
    },
  };

  return (
    <NeonCard glowColor="green" className="max-w-2xl">
      <div className="space-y-6">
        {/* Header with Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <PieChart className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">MNEE Portfolio</h3>
              <p className="text-sm text-gray-400">USD-backed stablecoin holdings</p>
            </div>
          </div>
          
          {isConnected && (
            <Identity className="px-0" hasCopyAddressOnClick>
              <Avatar className="h-10 w-10" />
              <div className="ml-2">
                <Name className="text-sm font-semibold text-white" />
              </div>
            </Identity>
          )}
        </div>

        {/* Main Balance Card */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Total Balance</p>
              {!isBalanceHidden ? (
                <>
                  <p className="text-4xl font-bold text-white">
                    {parseFloat(portfolio.mneeBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} MNEE
                  </p>
                  <p className="text-xl text-green-400 mt-2">
                    ${parseFloat(portfolio.usdValue).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} USD
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ {portfolio.ethEquivalent} ETH
                  </p>
                </>
              ) : (
                <p className="text-4xl font-bold text-white">••••••••</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {portfolio.change24h}%
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-500/10">
            <div>
              <p className="text-xs text-gray-400">MNEE Price</p>
              <p className="text-lg font-bold text-white">${portfolio.priceUSD}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">24h Change</p>
              <p className="text-lg font-bold text-green-400">{portfolio.change24h}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">USD Peg</p>
              <p className="text-lg font-bold text-cyan-400">1:1</p>
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">Asset Allocation</h4>
          
          <div className="space-y-3">
            {/* MNEE Token */}
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20 hover:border-green-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">MNEE</p>
                    <p className="text-xs text-gray-400">USD-backed stablecoin</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {parseFloat(portfolio.mneeBalance).toLocaleString()} MNEE
                  </p>
                  <p className="text-sm text-green-400">
                    ${parseFloat(portfolio.usdValue).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Portfolio allocation</span>
                  <span className="text-white font-semibold">{portfolio.allocation.mnee}%</span>
                </div>
                <Progress value={portfolio.allocation.mnee} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Token Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-black/30 border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <p className="text-xs font-semibold text-gray-300">Stable Value</p>
            </div>
            <p className="text-xs text-gray-400">1 MNEE = 1 USD always</p>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-cyan-400" />
              <p className="text-xs font-semibold text-gray-300">ERC-20</p>
            </div>
            <p className="text-xs text-gray-400">Ethereum standard token</p>
          </div>
        </div>

        {/* Contract Address */}
        {isConnected && address && (
          <div className="p-3 rounded-lg bg-black/30 border border-green-500/10">
            <p className="text-xs text-gray-400 mb-2">MNEE Contract</p>
            <Address
              address="0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF"
              className="text-xs"
            />
          </div>
        )}
      </div>
    </NeonCard>
  );
}
