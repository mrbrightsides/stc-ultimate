'use client';

import { useState, useEffect } from 'react';
import { useSIWE } from '@/contexts/siwe-context';
import { AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { EnhancedError } from '@/components/ui/enhanced-error';

interface NetworkDetectorProps {
  requiredChainId?: number;
  children: React.ReactNode;
  showAlways?: boolean;
}

const SEPOLIA_CHAIN_ID = 11155111;

const SUPPORTED_NETWORKS = {
  [SEPOLIA_CHAIN_ID]: {
    name: 'Sepolia Testnet',
    symbol: 'SEP',
    color: 'purple',
    explorer: 'https://sepolia.etherscan.io',
    faucet: 'https://sepoliafaucet.com'
  }
};

export function NetworkDetector({ 
  requiredChainId = SEPOLIA_CHAIN_ID, 
  children,
  showAlways = false 
}: NetworkDetectorProps) {
  const { isConnected } = useSIWE();
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  // Get current network from MetaMask
  useEffect(() => {
    const getCurrentNetwork = async () => {
      if (window.ethereum && isConnected) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentChainId(parseInt(chainId, 16));
        } catch (error) {
          console.error('Failed to get current network:', error);
        }
      }
    };

    getCurrentNetwork();

    // Listen for network changes
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        setCurrentChainId(parseInt(chainId, 16));
        setSwitchError(null);
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      return () => window.ethereum?.removeListener('chainChanged', handleChainChanged);
    }
  }, [isConnected]);

  const isCorrectNetwork = currentChainId === requiredChainId;
  const currentNetwork = currentChainId ? SUPPORTED_NETWORKS[currentChainId as keyof typeof SUPPORTED_NETWORKS] : null;
  const requiredNetwork = SUPPORTED_NETWORKS[requiredChainId];

  const handleSwitchNetwork = async (): Promise<void> => {
    if (!window.ethereum) {
      setSwitchError('MetaMask not detected. Please install MetaMask.');
      return;
    }
    
    setIsRetrying(true);
    setSwitchError(null);
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${requiredChainId.toString(16)}` }],
      });
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      if (error.code === 4902) {
        // Chain not added to MetaMask
        setSwitchError('Sepolia network not found. Please add it to your wallet manually.');
      } else {
        setSwitchError(error.message || 'Failed to switch network');
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const openInExplorer = (): void => {
    if (requiredNetwork?.explorer) {
      window.open(requiredNetwork.explorer, '_blank');
    }
  };

  const getFaucetETH = (): void => {
    if (requiredNetwork && 'faucet' in requiredNetwork) {
      window.open(requiredNetwork.faucet, '_blank');
    }
  };

  // If wallet not connected, show children without network check
  if (!isConnected) {
    return <>{children}</>;
  }

  // If on correct network and not showing always, show children
  if (isCorrectNetwork && !showAlways) {
    return <>{children}</>;
  }

  // If there's a switch error, show enhanced error
  if (switchError) {
    return (
      <EnhancedError
        title="Network Switch Failed"
        description={switchError}
        errorType="network"
        errorCode="NETWORK_SWITCH_ERROR"
        onRetry={handleSwitchNetwork}
        suggestions={[
          'Try switching networks manually in your wallet',
          'Check if you have the Sepolia network added to your wallet',
          'Refresh the page and try again',
          'Make sure your wallet is unlocked'
        ]}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Status Card */}
      <NeonCard 
        glowColor={isCorrectNetwork ? 'green' : 'orange'} 
        intense={!isCorrectNetwork}
        className="transition-all duration-300"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isCorrectNetwork ? 'bg-green-500/20' : 'bg-orange-500/20'
              }`}>
                {isCorrectNetwork ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Network Status
                </h3>
                <p className="text-sm text-gray-400">
                  {isCorrectNetwork ? 'Connected to correct network' : 'Network switch required'}
                </p>
              </div>
            </div>
            <Badge className={`${
              isCorrectNetwork 
                ? 'bg-green-500/20 text-green-300 border-green-500/50' 
                : 'bg-orange-500/20 text-orange-300 border-orange-500/50'
            }`}>
              {isCorrectNetwork ? 'CONNECTED' : 'SWITCH NEEDED'}
            </Badge>
          </div>

          {/* Network Details */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400 mb-2">Current Network</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentNetwork ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-white font-medium">
                  {currentNetwork?.name || 'Unknown Network'}
                </span>
              </div>
              {currentChainId && (
                <p className="text-xs text-gray-500 mt-1">
                  Chain ID: {currentChainId}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-2">Required Network</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-white font-medium">
                  {requiredNetwork?.name || 'Sepolia Testnet'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Chain ID: {requiredChainId}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!isCorrectNetwork && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
              <NeonButton
                variant="primary"
                onClick={handleSwitchNetwork}
                disabled={isRetrying}
                loading={isRetrying}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isRetrying ? 'Switching...' : 'Switch Network'}
              </NeonButton>

              {requiredNetwork && (
                <>
                  <NeonButton
                    variant="secondary"
                    onClick={openInExplorer}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Explorer
                  </NeonButton>

                  <NeonButton
                    variant="secondary"
                    onClick={getFaucetETH}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Get Test ETH
                  </NeonButton>
                </>
              )}
            </div>
          )}

          {/* Instructions */}
          {!isCorrectNetwork && (
            <div className="p-4 rounded-lg bg-black/30 border border-orange-500/30">
              <h4 className="text-sm font-medium text-orange-300 mb-2">
                How to switch networks:
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Click "Switch Network" above to automatically switch</li>
                <li>• Or manually switch in your wallet to "{requiredNetwork?.name}"</li>
                <li>• Make sure you have test ETH for transactions</li>
                <li>• Contact support if you continue having issues</li>
              </ul>
            </div>
          )}
        </div>
      </NeonCard>

      {/* Content - only show if on correct network or forcing show */}
      {(isCorrectNetwork || showAlways) && (
        <div className={!isCorrectNetwork ? 'opacity-50 pointer-events-none' : ''}>
          {children}
        </div>
      )}

      {/* Overlay when wrong network */}
      {!isCorrectNetwork && !showAlways && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="max-w-md mx-auto p-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-orange-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Network Switch Required</h2>
              <p className="text-gray-300">
                Please switch to {requiredNetwork?.name} to continue using STC Ultimate.
              </p>
              <NeonButton
                variant="primary"
                size="lg"
                onClick={handleSwitchNetwork}
                disabled={isRetrying}
                loading={isRetrying}
              >
                Switch to {requiredNetwork?.name}
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}