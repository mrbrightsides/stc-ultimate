'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  Trophy,
  Info,
  CheckCircle,
  Zap,
  ExternalLink
} from 'lucide-react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { base } from 'wagmi/chains';
import { formatEther } from 'viem';

interface BaseWalletHubProps {
  onBack?: () => void;
}

export default function BaseWalletHub({ onBack }: BaseWalletHubProps): JSX.Element {
  const { address, status } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    chainId: base.id
  });
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [farcasterUsername, setFarcasterUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'swap' | 'nft' | 'cast'>('overview');
  const [isInFarcaster, setIsInFarcaster] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const loadFarcasterContext = async (): Promise<void> => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (!cancelled) {
          setFarcasterUsername(context?.user?.username ?? null);
          setIsInFarcaster(true);
        }
      } catch (error) {
        if (!cancelled) {
          setFarcasterUsername(null);
          setIsInFarcaster(false);
        }
      }
    };

    loadFarcasterContext();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCastToWarpcast = async (): Promise<void> => {
    const text = '🌏 Planning my next adventure with STC Ultimate on Base! Seamless payments, instant rewards, and blockchain-secured journeys. ⚡';
    const embedUrl = window.location.origin;

    try {
      await sdk.actions.ready();
      await sdk.actions.composeCast({
        text,
        embeds: [embedUrl],
      });
    } catch (composeError) {
      const fallbackUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="container mx-auto px-6 py-12">
        <NeonCard glowColor="cyan" className="text-center">
          <div className="py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
              <Wallet className="h-8 w-8 text-cyan-400" />
            </div>
            <p className="text-xl text-gray-300">Connecting to Base Smart Wallet...</p>
          </div>
        </NeonCard>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container mx-auto px-6 py-12">
        <NeonCard glowColor="purple" className="text-center">
          <div className="py-12 space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-purple-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {isInFarcaster ? 'Base Smart Wallet Required' : 'Connect Your Wallet'}
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                {isInFarcaster 
                  ? 'Open this experience inside Warpcast to access your Base smart wallet and enjoy seamless onchain tourism payments.'
                  : 'Connect your wallet to access Base Wallet Hub features including token swaps, NFT rewards, and onchain tourism payments.'}
              </p>
            </div>
            
            {isInFarcaster ? (
              <Alert className="max-w-md mx-auto bg-purple-900/20 border-purple-500/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-gray-400">
                  This feature requires a Base smart wallet connection through Warpcast MiniKit
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <Alert className="bg-cyan-900/20 border-cyan-500/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-gray-400">
                    💡 For the best experience, open this app in Warpcast to use Base Smart Wallet. Otherwise, connect any wallet below.
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-3">
                  {connectors
                    .filter((connector, index, self) => 
                      index === self.findIndex((c) => c.name === connector.name)
                    )
                    .map((connector) => (
                      <NeonButton
                        key={connector.id}
                        variant="primary"
                        size="lg"
                        onClick={() => connect({ connector })}
                        disabled={isPending}
                        className="w-full text-lg"
                      >
                        <Wallet className="h-5 w-5" />
                        {isPending ? 'Connecting...' : `Connect ${connector.name}`}
                      </NeonButton>
                    ))}
                </div>
              </div>
            )}
          </div>
        </NeonCard>
        
        {onBack && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={onBack}>
              Back to Landing
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 bg-opacity-20 border border-cyan-500/30">
          <p className="text-lg font-semibold text-white">
            <Wallet className="inline-block h-5 w-5 mr-2 text-cyan-400" />
            Base Smart Wallet Hub
          </p>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Onchain Tourism Wallet
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your Base smart wallet powers instant payments, token swaps, NFT achievements, and seamless travel experiences—all secured by blockchain technology.
        </p>
      </div>

      {/* Wallet Info Card */}
      <NeonCard glowColor="cyan" intense>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono text-cyan-400">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </code>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Balance on Base</p>
            <p className="text-2xl font-bold text-green-400">
              {balance ? formatEther(balance.value) : '0.00'} ETH
            </p>
          </div>

          {farcasterUsername && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Farcaster Identity</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-lg text-white">@{farcasterUsername}</span>
              </div>
            </div>
          )}
        </div>
      </NeonCard>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        <NeonButton
          variant={activeTab === 'overview' ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => setActiveTab('overview')}
        >
          <Wallet className="h-5 w-5" />
          Overview
        </NeonButton>
        <NeonButton
          variant={activeTab === 'swap' ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => setActiveTab('swap')}
        >
          <ArrowRightLeft className="h-5 w-5" />
          Token Swaps
        </NeonButton>
        <NeonButton
          variant={activeTab === 'nft' ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => setActiveTab('nft')}
        >
          <Trophy className="h-5 w-5" />
          NFT Rewards
        </NeonButton>
        <NeonButton
          variant={activeTab === 'cast' ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => setActiveTab('cast')}
        >
          <Zap className="h-5 w-5" />
          Share
        </NeonButton>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <NeonCard glowColor="purple">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Smart Wallet</h3>
                </div>
                <p className="text-gray-400">
                  Your Base smart wallet is auto-connected via Warpcast—no manual connection needed!
                </p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </NeonCard>

            <NeonCard glowColor="cyan">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <ArrowRightLeft className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Instant Swaps</h3>
                </div>
                <p className="text-gray-400">
                  Swap tokens instantly for booking payments with best rates from Base DEXs.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('swap')}
                  className="w-full"
                >
                  Explore Swaps
                </Button>
              </div>
            </NeonCard>

            <NeonCard glowColor="orange">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">NFT Achievements</h3>
                </div>
                <p className="text-gray-400">
                  Mint commemorative NFTs for completed journeys and unlock rewards.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('nft')}
                  className="w-full"
                >
                  View NFTs
                </Button>
              </div>
            </NeonCard>
          </div>

          <NeonCard glowColor="green">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">Why Base + OnchainKit?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Gas-Free Transactions</h4>
                    <p className="text-sm text-gray-400">Enjoy subsidized gas for tourism payments on Base</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Instant Settlements</h4>
                    <p className="text-sm text-gray-400">Lightning-fast confirmations with Base L2</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Built-in Identity</h4>
                    <p className="text-sm text-gray-400">Farcaster authentication provides seamless social proof</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">NFT Rewards</h4>
                    <p className="text-sm text-gray-400">Mint achievement badges and earn loyalty tokens</p>
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>
      )}

      {activeTab === 'swap' && (
        <div className="space-y-6">
          <NeonCard glowColor="cyan">
            <div className="text-center space-y-6 py-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <ArrowRightLeft className="h-10 w-10 text-cyan-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Token Swaps for Bookings
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Swap any token to ETH or USDC instantly for your tourism payments. OnchainKit provides the best rates from Base DEXs.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
                <Card className="p-4 bg-gray-900/50 border-cyan-500/30">
                  <Coins className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">USDC → ETH</h4>
                  <p className="text-xs text-gray-400 mt-1">Convert stablecoins to ETH</p>
                </Card>
                <Card className="p-4 bg-gray-900/50 border-cyan-500/30">
                  <Coins className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Token → USDC</h4>
                  <p className="text-xs text-gray-400 mt-1">Swap any token to stable</p>
                </Card>
                <Card className="p-4 bg-gray-900/50 border-cyan-500/30">
                  <Coins className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">ETH → USDC</h4>
                  <p className="text-xs text-gray-400 mt-1">Lock in stable value</p>
                </Card>
              </div>
              <Alert className="max-w-2xl mx-auto bg-cyan-900/20 border-cyan-500/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-gray-400">
                  Token swaps are powered by Base aggregators for optimal pricing. Integration coming soon!
                </AlertDescription>
              </Alert>
            </div>
          </NeonCard>
        </div>
      )}

      {activeTab === 'nft' && (
        <div className="space-y-6">
          <NeonCard glowColor="orange">
            <div className="text-center space-y-6 py-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-orange-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Collectible Journey NFTs
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Mint commemorative NFTs for every completed journey. Each NFT represents your unique travel story on the Base blockchain.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-6">
                <NeonCard glowColor="purple">
                  <div className="space-y-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                      🏆 Achievement
                    </Badge>
                    <h4 className="text-xl font-semibold text-white">Bali Explorer</h4>
                    <p className="text-gray-400">Commemorative NFT for completing 5 services in Bali</p>
                    <div className="pt-3 border-t border-purple-500/20">
                      <p className="text-sm text-gray-500">Status: Ready to mint after journey completion</p>
                    </div>
                  </div>
                </NeonCard>
                <NeonCard glowColor="green">
                  <div className="space-y-3">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      ⭐ Loyalty
                    </Badge>
                    <h4 className="text-xl font-semibold text-white">Frequent Traveler</h4>
                    <p className="text-gray-400">Special NFT badge for completing 10+ journeys</p>
                    <div className="pt-3 border-t border-green-500/20">
                      <p className="text-sm text-gray-500">Status: Unlocks exclusive benefits</p>
                    </div>
                  </div>
                </NeonCard>
              </div>
              <Alert className="max-w-2xl mx-auto bg-orange-900/20 border-orange-500/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-gray-400">
                  NFT minting will use OnchainKit mint capabilities. Complete a journey to earn your first NFT!
                </AlertDescription>
              </Alert>
            </div>
          </NeonCard>
        </div>
      )}

      {activeTab === 'cast' && (
        <div className="space-y-6">
          <NeonCard glowColor="purple">
            <div className="text-center space-y-6 py-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="h-10 w-10 text-purple-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Share on Warpcast
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Share your amazing travel experiences with the Farcaster community. Your journeys inspire others!
                </p>
              </div>
              <div className="pt-6">
                <NeonButton
                  variant="primary"
                  size="lg"
                  onClick={handleCastToWarpcast}
                  className="text-xl px-8"
                >
                  <Zap className="h-5 w-5" />
                  Cast to Warpcast
                </NeonButton>
              </div>
              <Alert className="max-w-2xl mx-auto bg-purple-900/20 border-purple-500/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-gray-400">
                  Share your STC Ultimate journey and earn social reputation tokens!
                </AlertDescription>
              </Alert>
            </div>
          </NeonCard>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {onBack && (
          <Button variant="outline" size="lg" onClick={onBack}>
            Back to Landing
          </Button>
        )}
        {!isInFarcaster && (
          <Button 
            variant="destructive" 
            size="lg" 
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
