'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Check, Zap, DollarSign, Shield, Clock } from 'lucide-react'

interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  gasPrice: string
  confirmationTime: string
  features: string[]
  logo: string
  description: string
}

const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 11155111, // Sepolia
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206',
    blockExplorer: 'https://sepolia.etherscan.io',
    gasPrice: '~$0.01',
    confirmationTime: '12 seconds',
    features: ['Testnet', 'Ethereum Compatible', 'Free Gas'],
    logo: '🔧',
    description: 'Ethereum testnet for development and testing'
  },
  {
    id: 8453, // Base
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    gasPrice: '~$0.001',
    confirmationTime: '2 seconds',
    features: ['L2 Scaling', 'Low Cost', 'Coinbase Built'],
    logo: '🔵',
    description: 'Coinbase L2 for fast, cheap transactions'
  },
  {
    id: 137, // Polygon
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    gasPrice: '~$0.01',
    confirmationTime: '2 seconds',
    features: ['Fast', 'Cheap', 'EVM Compatible'],
    logo: '🟣',
    description: 'High-speed, low-cost scaling solution'
  },
  {
    id: 42161, // Arbitrum
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    gasPrice: '~$0.1',
    confirmationTime: '15 seconds',
    features: ['L2 Scaling', 'Ethereum Compatible', 'Secure'],
    logo: '🔷',
    description: 'Optimistic rollup for Ethereum scaling'
  },
  {
    id: 10, // Optimism
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    gasPrice: '~$0.1',
    confirmationTime: '24 seconds',
    features: ['L2 Scaling', 'Fast Finality', 'Low Cost'],
    logo: '🔴',
    description: 'Optimistic rollup for faster transactions'
  }
]

interface MultiChainSelectorProps {
  currentChainId: number
  onChainChange: (chain: ChainConfig) => void
  onClose?: () => void
}

export function MultiChainSelector({ currentChainId, onChainChange, onClose }: MultiChainSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(
    SUPPORTED_CHAINS.find(chain => chain.id === currentChainId) || SUPPORTED_CHAINS[0]
  )
  const [switchingChain, setSwitchingChain] = useState<number | null>(null)

  useEffect(() => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === currentChainId)
    if (chain) setSelectedChain(chain)
  }, [currentChainId])

  const handleChainSelect = async (chain: ChainConfig): Promise<void> => {
    if (chain.id === selectedChain.id) return

    setSwitchingChain(chain.id)
    
    try {
      // Simulate chain switching (in real app, use wallet APIs)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSelectedChain(chain)
      onChainChange(chain)
      setIsOpen(false)
      onClose?.()
    } catch (error) {
      console.error('Failed to switch chain:', error)
    } finally {
      setSwitchingChain(null)
    }
  }

  const getChainIcon = (feature: string): JSX.Element => {
    switch (feature.toLowerCase()) {
      case 'fast': case 'l2 scaling': return <Zap className="h-3 w-3" />
      case 'low cost': case 'cheap': case 'free gas': return <DollarSign className="h-3 w-3" />
      case 'secure': case 'ethereum compatible': case 'evm compatible': return <Shield className="h-3 w-3" />
      case 'fast finality': return <Clock className="h-3 w-3" />
      default: return <Check className="h-3 w-3" />
    }
  }

  return (
    <div className="relative">
      {/* Chain Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-all duration-200 min-w-[200px]"
      >
        <span className="text-2xl">{selectedChain.logo}</span>
        <div className="flex-1 text-left">
          <div className="text-white font-medium text-sm">{selectedChain.name}</div>
          <div className="text-gray-400 text-xs">{selectedChain.gasPrice} gas</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <div className="text-white font-medium text-sm px-3 py-2">Select Network</div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                  disabled={switchingChain === chain.id}
                  className={`w-full text-left p-3 hover:bg-gray-800/50 transition-colors relative ${
                    chain.id === selectedChain.id ? 'bg-cyan-900/20 border-l-2 border-l-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{chain.logo}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{chain.name}</span>
                        {chain.id === selectedChain.id && (
                          <Check className="h-4 w-4 text-cyan-400" />
                        )}
                        {switchingChain === chain.id && (
                          <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
                        )}
                      </div>
                      
                      <div className="text-gray-400 text-xs mt-1">{chain.description}</div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="h-3 w-3" />
                          {chain.gasPrice}
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Clock className="h-3 w-3" />
                          {chain.confirmationTime}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {chain.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                          >
                            {getChainIcon(feature)}
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <div className="text-gray-400 text-xs text-center">
                More chains coming soon. Current focus on testnet and L2 scaling solutions.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Chain Status Indicator Component
export function ChainStatusIndicator({ chainId }: { chainId: number }) {
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId)
  
  if (!chain) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-white text-sm">{chain.name}</span>
      <span className="text-gray-400 text-xs">({chain.gasPrice})</span>
    </div>
  )
}

// Chain Utilities
export const chainUtils = {
  getChainById: (id: number): ChainConfig | undefined => 
    SUPPORTED_CHAINS.find(chain => chain.id === id),
  
  getAllChains: (): ChainConfig[] => SUPPORTED_CHAINS,
  
  isTestnet: (chainId: number): boolean => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId)
    return chain?.features.includes('Testnet') || false
  },
  
  getOptimalChain: (criteria: 'cost' | 'speed' | 'security'): ChainConfig => {
    switch (criteria) {
      case 'cost':
        return SUPPORTED_CHAINS.find(c => c.name === 'Base') || SUPPORTED_CHAINS?.[1] || SUPPORTED_CHAINS[0]
      case 'speed':
        return SUPPORTED_CHAINS.find(c => c.name === 'Polygon') || SUPPORTED_CHAINS?.[2] || SUPPORTED_CHAINS[0]
      case 'security':
        return SUPPORTED_CHAINS.find(c => c.name === 'Arbitrum One') || SUPPORTED_CHAINS?.[3] || SUPPORTED_CHAINS[0]
      default:
        return SUPPORTED_CHAINS[0]
    }
  }
}