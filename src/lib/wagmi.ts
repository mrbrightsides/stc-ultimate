import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, injected } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query'

// Infura RPC endpoints
const INFURA_SEPOLIA_RPC = 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206';
const INFURA_BASE_SEPOLIA_RPC = 'https://base-sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206';
const INFURA_MAINNET_RPC = 'https://mainnet.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206';

const chainId = process.env.NEXT_PUBLIC_SDK_CHAIN_ID
  ? Number(process.env.NEXT_PUBLIC_SDK_CHAIN_ID)
  : sepolia.id
  
export const activeChain = chainId === 11155111 ? sepolia : chainId === 84532 ? baseSepolia : chainId === 1 ? mainnet : base
  
export const config = createConfig({
  chains: [sepolia, baseSepolia, mainnet, base],
  connectors: [
    // Coinbase Wallet - supports both TBA and EOA
    coinbaseWallet({
      appName: 'Ohara',
      preference: 'all',
    }),
    // MetaMask
    metaMask({
      dappMetadata: {
        name: 'Ohara',
      },
    }),
    injected({ target: 'phantom' }),  
    injected({ target: 'rabby' }),  
    injected({ target: 'trust' }),  
  ],
  transports: {  
    [sepolia.id]: http(INFURA_SEPOLIA_RPC),
    [baseSepolia.id]: http(INFURA_BASE_SEPOLIA_RPC),
    [mainnet.id]: http(INFURA_MAINNET_RPC),
    [base.id]: http(),
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5_000,
    },
  },
});