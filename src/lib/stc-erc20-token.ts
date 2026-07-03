'use client';

import { ethers } from 'ethers';
import { TESTNET_CONFIG } from './enhanced-smart-contracts';

// ========================================
// STC ERC-20 TOKEN IMPLEMENTATION
// Native platform token for STC Ultimate ecosystem
// ========================================

// ERC-20 Standard ABI (with common extensions)
export const STC_TOKEN_ABI = [
  // Standard ERC-20 functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  
  // Extended functions (common in modern tokens)
  'function mint(address to, uint256 amount) returns (bool)',
  'function burn(uint256 amount) returns (bool)',
  'function owner() view returns (address)',
] as const;

// STC Token Configuration
export const STC_TOKEN_CONFIG = {
  // Deployed on Sepolia testnet
  address: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf' as const,
  name: 'STC Ultimate Token',
  symbol: 'STC',
  decimals: 18,
  
  // Initial supply: 1 billion STC
  initialSupply: '1000000000',
  
  // Token distribution
  distribution: {
    platform: '300000000', // 30% - Platform operations
    rewards: '250000000',  // 25% - User rewards
    staking: '200000000',  // 20% - Staking pool
    team: '150000000',     // 15% - Team allocation
    ecosystem: '100000000', // 10% - Ecosystem development
  },
  
  // Utility
  utilities: [
    'Payment for tourism services',
    'Loyalty rewards',
    'Platform governance',
    'Staking rewards',
    'NFT minting fees',
    'Premium features access',
  ],
} as const;

export interface STCTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  userBalance: string;
  allowance: string;
}

export interface TokenTransaction {
  type: 'transfer' | 'approve' | 'mint' | 'burn';
  txHash: string;
  from: string;
  to?: string;
  amount: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: 'confirmed' | 'pending' | 'failed';
}

/**
 * STC Token Manager - Handles all token operations
 */
export class STCTokenManager {
  private contract: ethers.Contract | null = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {}

  /**
   * Initialize with wallet provider
   */
  async initialize(provider: ethers.providers.Web3Provider): Promise<void> {
    this.provider = provider;
    this.signer = provider.getSigner();
    
    // Create contract instance
    this.contract = new ethers.Contract(
      STC_TOKEN_CONFIG.address,
      STC_TOKEN_ABI,
      this.signer
    );
    
    console.log('✅ STC Token Manager initialized:', STC_TOKEN_CONFIG.address);
  }

  /**
   * Get token information
   */
  async getTokenInfo(userAddress?: string): Promise<STCTokenInfo> {
    if (!this.contract) {
      throw new Error('Token manager not initialized');
    }

    try {
      // Get basic token info (these are view functions, no gas cost)
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply(),
      ]);

      let userBalance = '0';
      let allowance = '0';

      // Get user-specific data if address provided
      if (userAddress) {
        userBalance = ethers.utils.formatUnits(
          await this.contract.balanceOf(userAddress),
          decimals
        );

        // Check allowance for common spender (e.g., escrow contract)
        const escrowAddress = '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613';
        allowance = ethers.utils.formatUnits(
          await this.contract.allowance(userAddress, escrowAddress),
          decimals
        );
      }

      return {
        address: STC_TOKEN_CONFIG.address,
        name,
        symbol,
        decimals,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
        userBalance,
        allowance,
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      
      // Return fallback data
      return {
        address: STC_TOKEN_CONFIG.address,
        name: STC_TOKEN_CONFIG.name,
        symbol: STC_TOKEN_CONFIG.symbol,
        decimals: STC_TOKEN_CONFIG.decimals,
        totalSupply: STC_TOKEN_CONFIG.initialSupply,
        userBalance: '0',
        allowance: '0',
      };
    }
  }

  /**
   * Transfer tokens
   */
  async transfer(to: string, amount: string): Promise<TokenTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Token manager not initialized');
    }

    // Validate address
    const checksummedTo = ethers.utils.getAddress(to);
    
    // Convert amount to token units (with 18 decimals)
    const amountInWei = ethers.utils.parseUnits(amount, STC_TOKEN_CONFIG.decimals);

    // Execute transfer
    const tx = await this.contract.transfer(checksummedTo, amountInWei, {
      gasLimit: 100000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();

    return {
      type: 'transfer',
      txHash: tx.hash,
      from: signerAddress,
      to: checksummedTo,
      amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
    };
  }

  /**
   * Approve spender to use tokens
   */
  async approve(spender: string, amount: string): Promise<TokenTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Token manager not initialized');
    }

    const checksummedSpender = ethers.utils.getAddress(spender);
    const amountInWei = ethers.utils.parseUnits(amount, STC_TOKEN_CONFIG.decimals);

    const tx = await this.contract.approve(checksummedSpender, amountInWei, {
      gasLimit: 80000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();

    return {
      type: 'approve',
      txHash: tx.hash,
      from: signerAddress,
      to: checksummedSpender,
      amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
    };
  }

  /**
   * Add STC token to user's wallet (MetaMask, etc.)
   */
  async addToWallet(): Promise<boolean> {
    if (!window.ethereum) {
      throw new Error('No wallet detected');
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: STC_TOKEN_CONFIG.address,
            symbol: STC_TOKEN_CONFIG.symbol,
            decimals: STC_TOKEN_CONFIG.decimals,
            image: 'https://stc-ultimate.vercel.app/stc-token-logo.png', // Token logo
          },
        },
      });

      return wasAdded as boolean;
    } catch (error) {
      console.error('Failed to add token to wallet:', error);
      return false;
    }
  }

  /**
   * Get Etherscan URL for token
   */
  getEtherscanUrl(): string {
    return `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/token/${STC_TOKEN_CONFIG.address}`;
  }

  /**
   * Get token holder Etherscan URL
   */
  getHolderUrl(address: string): string {
    return `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/token/${STC_TOKEN_CONFIG.address}?a=${address}`;
  }
}

/**
 * Token storage helper
 */
export const STCTokenStorage = {
  STORAGE_KEY: 'stc_token_transactions',
  MAX_TRANSACTIONS: 50,

  save(transaction: TokenTransaction): void {
    try {
      const existing = this.getAll();
      existing.unshift(transaction);
      const limited = existing.slice(0, this.MAX_TRANSACTIONS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save token transaction:', error);
    }
  },

  getAll(): TokenTransaction[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  },

  getStats() {
    const transactions = this.getAll();
    const totalTransfers = transactions.filter(t => t.type === 'transfer').length;
    const totalApprovals = transactions.filter(t => t.type === 'approve').length;
    const totalVolume = transactions
      .filter(t => t.type === 'transfer')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      totalTransactions: transactions.length,
      totalTransfers,
      totalApprovals,
      totalVolume: totalVolume.toFixed(2),
      confirmedTransactions: transactions.filter(t => t.status === 'confirmed').length,
      failedTransactions: transactions.filter(t => t.status === 'failed').length,
    };
  },

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },
};

/**
 * Calculate token reward for service completion
 */
export function calculateServiceReward(serviceAmount: string): string {
  // Reward: 10% of service cost in STC tokens
  // Assuming 1 ETH = 1000 STC (simplified for testnet)
  const ethAmount = parseFloat(serviceAmount);
  const stcReward = ethAmount * 1000 * 0.1; // 10% reward
  return stcReward.toFixed(2);
}

/**
 * Get token price in USD (mock for testnet)
 */
export function getTokenPriceUSD(): number {
  // Mock price: $0.50 per STC
  return 0.5;
}
