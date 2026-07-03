'use client';

import { useState } from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Zap,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAccount } from 'wagmi';

interface MNEEBuyFundProps {
  onPurchaseComplete?: (amount: string) => void;
}

export function MNEEBuyFund({ onPurchaseComplete }: MNEEBuyFundProps) {
  const { address, isConnected } = useAccount();
  const [selectedAmount, setSelectedAmount] = useState<string>('100');

  const quickAmounts = ['50', '100', '250', '500', '1000'];

  return (
    <NeonCard glowColor="purple" className="max-w-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Buy MNEE</h3>
              <p className="text-sm text-gray-400">Fund your wallet with USD</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Instant
          </Badge>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="p-6 rounded-lg bg-black/30 border border-purple-500/20 text-center space-y-4">
            <CreditCard className="h-12 w-12 mx-auto text-purple-400 opacity-50" />
            <div>
              <p className="text-white font-semibold mb-2">Connect Wallet to Continue</p>
              <p className="text-sm text-gray-400 mb-4">
                Connect your wallet to buy MNEE with fiat currency
              </p>
            </div>
            <Wallet>
              <ConnectWallet className="w-full">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownBasename />
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownFundLink />
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        ) : (
          <>
            {/* Connected Wallet Info */}
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20">
              <Identity className="px-0" hasCopyAddressOnClick={false}>
                <Avatar className="h-10 w-10" />
                <div className="flex flex-col ml-3">
                  <Name className="text-white font-semibold" />
                  <Address className="text-gray-400 text-sm" />
                </div>
              </Identity>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-300">
                Select Amount (USD)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((amount) => (
                  <NeonButton
                    key={amount}
                    size="sm"
                    variant={selectedAmount === amount ? 'primary' : 'secondary'}
                    onClick={() => setSelectedAmount(amount)}
                  >
                    ${amount}
                  </NeonButton>
                ))}
              </div>
              
              {/* Custom Amount Input */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You pay</span>
                <span className="text-white font-semibold">${selectedAmount} USD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You receive</span>
                <span className="text-purple-400 font-semibold">{selectedAmount} MNEE</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-purple-500/10">
                <span className="text-gray-400">Exchange rate</span>
                <span className="text-white font-semibold">1 MNEE = 1 USD</span>
              </div>
            </div>

            {/* OnchainKit Fund Button */}
            <Wallet>
              <WalletDropdownFundLink
                className="w-full"
                text={`Buy ${selectedAmount} MNEE`}
              />
            </Wallet>

            {/* Payment Methods */}
            <div className="space-y-2 pt-2 border-t border-purple-500/10">
              <p className="text-xs font-semibold text-gray-400">Accepted Payment Methods</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-purple-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Credit Card</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-purple-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Debit Card</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-purple-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Bank Transfer</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-purple-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Apple Pay</span>
                </div>
              </div>
            </div>

            {/* Learn More Link */}
            <a
              href="https://mnee.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Learn more about MNEE</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </>
        )}
      </div>
    </NeonCard>
  );
}
