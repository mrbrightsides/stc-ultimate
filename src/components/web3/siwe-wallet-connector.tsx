'use client';

import { useSIWE } from '@/contexts/siwe-context';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function SIWEWalletConnector() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    balance, 
    chainId, 
    connect, 
    disconnect, 
    error 
  } = useSIWE();

  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (id: number | null) => {
    switch (id) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 8453: return 'Base Mainnet';
      case 84532: return 'Base Sepolia';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      default: return `Chain ID: ${id}`;
    }
  };

  if (!isConnected) {
    return (
      <NeonCard glowColor="cyan" className="w-fit">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Wallet Connection</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-2 border-cyan-400 text-white font-semibold shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-xs text-gray-400 text-center">
              <p>Connect your wallet to start your smart tourism journey</p>
              <p className="mt-1">Make sure you have MetaMask or compatible wallet installed</p>
            </div>
          </div>
        </div>
      </NeonCard>
    );
  }

  return (
    <NeonCard glowColor="cyan" className="w-fit relative">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
            Connected
          </Badge>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-2 border-cyan-400 text-white font-semibold shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                {address ? address[2].toUpperCase() : 'W'}
              </div>
              <span>{address ? formatAddress(address) : 'Connected'}</span>
            </div>
            <div className="text-right text-xs">
              {balance ? `${balance} ETH` : ''}
            </div>
          </Button>

          {showDropdown && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-black/95 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/25">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {address ? address[2].toUpperCase() : 'W'}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {address ? formatAddress(address) : ''}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {address}
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-cyan-400 font-medium">
                      {balance ? `${balance} ETH` : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-cyan-400">
                      {getNetworkName(chainId)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Ready for transactions</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    disconnect();
                    setShowDropdown(false);
                  }}
                  variant="outline"
                  className="w-full text-red-400 border-red-500/50 hover:bg-red-500/20 hover:border-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Network:</span>
              <span className="text-cyan-400 ml-2">{getNetworkName(chainId)}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 ml-2">Ready for transactions</span>
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}