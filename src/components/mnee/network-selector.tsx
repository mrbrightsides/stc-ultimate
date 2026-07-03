'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { 
  mainnet, 
  sepolia, 
  baseSepolia, 
  base, 
  linea, 
  polygon, 
  optimism, 
  arbitrum, 
  bsc 
} from 'wagmi/chains';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Network, Check, ExternalLink } from 'lucide-react';

// Custom chains defined in providers
const SHAPE_CHAIN_ID = 360;
const SEI_CHAIN_ID = 1329;

const SUPPORTED_CHAINS = [
  // Testnets
  { 
    ...sepolia, 
    category: 'Testnet',
    logo: '🔷',
    description: 'Ethereum Test Network'
  },
  { 
    ...baseSepolia, 
    category: 'Testnet',
    logo: '🔵',
    description: 'Base Test Network'
  },
  // Mainnets
  { 
    ...mainnet, 
    category: 'Mainnet',
    logo: '⬥',
    description: 'Ethereum Mainnet'
  },
  { 
    ...base, 
    category: 'Mainnet',
    logo: '🔵',
    description: 'Base Network'
  },
  { 
    ...linea, 
    category: 'Mainnet',
    logo: '◆',
    description: 'Linea Network'
  },
  { 
    id: SHAPE_CHAIN_ID, 
    name: 'Shape',
    category: 'Mainnet',
    logo: '🔺',
    description: 'Shape Network',
    blockExplorers: {
      default: { name: 'ShapeExplorer', url: 'https://shapescan.xyz' }
    }
  },
  { 
    ...bsc, 
    category: 'Mainnet',
    logo: '🟡',
    description: 'BNB Chain'
  },
  { 
    id: SEI_CHAIN_ID, 
    name: 'Sei',
    category: 'Mainnet',
    logo: '🔴',
    description: 'Sei Network',
    blockExplorers: {
      default: { name: 'SeiScan', url: 'https://seitrace.com' }
    }
  },
  { 
    ...polygon, 
    category: 'Mainnet',
    logo: '🟣',
    description: 'Polygon Network'
  },
  { 
    ...optimism, 
    category: 'Mainnet',
    logo: '🔴',
    description: 'Optimism Network'
  },
  { 
    ...arbitrum, 
    category: 'Mainnet',
    logo: '🔵',
    description: 'Arbitrum Network'
  },
] as const;

export function NetworkSelector() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [showAll, setShowAll] = useState(false);

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
  const testnets = SUPPORTED_CHAINS.filter(c => c.category === 'Testnet');
  const mainnets = SUPPORTED_CHAINS.filter(c => c.category === 'Mainnet');

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg bg-black/30 border border-gray-500/20">
        <p className="text-sm text-gray-400 text-center">
          Connect wallet to switch networks
        </p>
      </div>
    );
  }

  const handleSwitchChain = (targetChainId: number) => {
    if (switchChain && targetChainId !== chainId) {
      switchChain({ chainId: targetChainId });
    }
  };

  const ChainButton = ({ chain }: { chain: typeof SUPPORTED_CHAINS[number] }) => {
    const isActive = chain.id === chainId;
    const explorer = 'blockExplorers' in chain ? chain.blockExplorers?.default?.url : undefined;

    return (
      <button
        onClick={() => handleSwitchChain(chain.id)}
        disabled={isPending || isActive}
        className={`
          w-full p-4 rounded-lg border transition-all
          ${isActive 
            ? 'bg-cyan-500/20 border-cyan-500/50' 
            : 'bg-black/30 border-gray-500/20 hover:border-cyan-500/30'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{chain.logo}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{chain.name}</p>
                {isActive && (
                  <Check className="h-4 w-4 text-cyan-400" />
                )}
              </div>
              <p className="text-xs text-gray-400">{chain.description}</p>
            </div>
          </div>
          
          {explorer && (
            <a
              href={`${explorer}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-cyan-400" />
            </a>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Network */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-cyan-400" />
          <div>
            <p className="text-sm text-gray-400">Current Network</p>
            <p className="font-semibold text-white flex items-center gap-2">
              {currentChain ? (
                <>
                  <span>{currentChain.logo}</span>
                  {currentChain.name}
                </>
              ) : (
                'Unknown Network'
              )}
            </p>
          </div>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
          Chain ID: {chainId}
        </Badge>
      </div>

      {/* Testnets */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/50">
            Testnets
          </Badge>
        </h3>
        <div className="grid gap-3">
          {testnets.map((chain) => (
            <ChainButton key={chain.id} chain={chain} />
          ))}
        </div>
      </div>

      {/* Mainnets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
              Mainnets
            </Badge>
          </h3>
          <NeonButton
            size="sm"
            variant="secondary"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${mainnets.length})`}
          </NeonButton>
        </div>
        <div className="grid gap-3">
          {(showAll ? mainnets : mainnets.slice(0, 3)).map((chain) => (
            <ChainButton key={chain.id} chain={chain} />
          ))}
        </div>
      </div>

      {/* Your Address */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
        <p className="text-xs text-gray-400 mb-1">Your Multi-Chain Address</p>
        <div className="flex items-center justify-between">
          <code className="text-sm font-mono text-cyan-400">
            {address?.slice(0, 10)}...{address?.slice(-8)}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(address || '')}
            className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
