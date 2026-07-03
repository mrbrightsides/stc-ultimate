'use client';

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { 
  base, 
  sepolia, 
  baseSepolia,
  mainnet,
  linea,
  polygon,
  optimism,
  arbitrum,
  bsc
} from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Shape Mainnet
const shape = defineChain({
  id: 360,
  name: 'Shape',
  network: 'shape',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.shape.network'],
    },
    public: {
      http: ['https://mainnet.shape.network'],
    },
  },
  blockExplorers: {
    default: { name: 'ShapeExplorer', url: 'https://shapescan.xyz' },
  },
});

// Define Sei Network
const sei = defineChain({
  id: 1329,
  name: 'Sei Network',
  network: 'sei',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: { name: 'SeiScan', url: 'https://seitrace.com' },
  },
});

// Infura RPC endpoints
const INFURA_PROJECT_ID = 'f8d248f838ec4f12b0f01efd2b238206';
const INFURA_SEPOLIA_RPC = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_BASE_SEPOLIA_RPC = `https://base-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_LINEA_RPC = `https://linea-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_POLYGON_RPC = `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_OPTIMISM_RPC = `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_ARBITRUM_RPC = `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

// User's multi-chain wallet address
export const USER_WALLET_ADDRESS = '0x17A1e4875c125ad6e89388d9F042A361499495Da' as const;
import { ThemeProvider } from '@/contexts/theme-context';
import { SIWEProvider } from '@/contexts/siwe-context';
import { BlockchainEventsProvider } from '@/contexts/blockchain-events-context';
import { RoleProvider } from '@/contexts/role-context';
import { ZeroTrustProvider } from '@/contexts/zero-trust-context';
import { ONCHAINKIT_API_KEY, ONCHAINKIT_PROJECT_ID } from './config/onchainkit';

const wagmiConfig = createConfig({
  chains: [
    // Testnets
    sepolia,
    baseSepolia,
    // Mainnets
    mainnet,
    base,
    linea,
    shape,
    bsc,
    sei,
    polygon,
    optimism,
    arbitrum,
  ],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({
      projectId: '3c0fab6e5425e4d678026e1ae5fcc3fd',
      metadata: {
        name: 'STC Ultimate',
        description: 'Smart Tourism & Cultural Platform - Multi-chain Support',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://stc-ultimate.com',
        icons: ['https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=null'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    // Testnets with Infura
    [sepolia.id]: http(INFURA_SEPOLIA_RPC),
    [baseSepolia.id]: http(INFURA_BASE_SEPOLIA_RPC),
    // Mainnets with Infura
    [mainnet.id]: http(INFURA_MAINNET_RPC),
    [linea.id]: http(INFURA_LINEA_RPC),
    [polygon.id]: http(INFURA_POLYGON_RPC),
    [optimism.id]: http(INFURA_OPTIMISM_RPC),
    [arbitrum.id]: http(INFURA_ARBITRUM_RPC),
    // Default RPCs
    [base.id]: http(),
    [shape.id]: http(),
    [bsc.id]: http(),
    [sei.id]: http(),
  },
  ssr: false,
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

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ONCHAINKIT_API_KEY}
          projectId={ONCHAINKIT_PROJECT_ID}
          chain={base}
          config={{
            appearance: {
              name: 'STC Ultimate',
              logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84',
              mode: 'auto',
              theme: 'default',
            },
            analytics: {
              enabled: false,
            },
          }}
        >
          <ZeroTrustProvider>
            <ThemeProvider>
              <RoleProvider>
                <SIWEProvider>
                  <BlockchainEventsProvider>
                    {children}
                  </BlockchainEventsProvider>
                </SIWEProvider>
              </RoleProvider>
            </ThemeProvider>
          </ZeroTrustProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}