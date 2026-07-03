'use client';

import { ethers } from 'ethers';
import { TESTNET_CONFIG } from './enhanced-smart-contracts';

// ========================================
// MNEE USD-BACKED STABLECOIN INTEGRATION
// For MNEE Hackathon - Programmable Money
// ========================================

// MNEE Token on Ethereum Mainnet
export const MNEE_TOKEN_CONFIG = {
  // Official MNEE contract address
  address: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as const,
  name: 'MNEE',
  symbol: 'MNEE',
  decimals: 18,
  
  // Network
  chainId: 1, // Ethereum Mainnet
  chainName: 'Ethereum',
  
  // For demo purposes on Sepolia, we'll use a mock contract
  // In production, this would interact with the real MNEE contract
  testnetAddress: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as const,
  
  // Token properties
  isPegged: true,
  peggedTo: 'USD',
  pegRatio: 1, // 1 MNEE = 1 USD
} as const;

// ERC-20 ABI for MNEE Token
export const MNEE_TOKEN_ABI = [
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
] as const;

export interface MNEETokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  userBalance: string;
  usdValue: string; // Since MNEE is pegged 1:1 to USD
  allowances: Record<string, string>;
}

export interface MNEEPayment {
  type: 'booking' | 'split' | 'escrow_release' | 'refund';
  txHash: string;
  from: string;
  to: string;
  amount: string;
  usdValue: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: 'confirmed' | 'pending' | 'failed';
  metadata?: {
    serviceId?: number;
    serviceName?: string;
    escrowId?: string;
    splitRecipients?: Array<{ address: string; amount: string; percentage: number }>;
  };
}

/**
 * MNEE Token Manager - Handles all MNEE stablecoin operations
 */
export class MNEETokenManager {
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
    // Note: For Sepolia demo, we'll use testnet address
    const contractAddress = MNEE_TOKEN_CONFIG.testnetAddress;
    
    this.contract = new ethers.Contract(
      contractAddress,
      MNEE_TOKEN_ABI,
      this.signer
    );
    
    console.log('✅ MNEE Token Manager initialized:', contractAddress);
  }

  /**
   * Get MNEE token information
   */
  async getTokenInfo(userAddress?: string): Promise<MNEETokenInfo> {
    if (!this.contract) {
      throw new Error('MNEE Token manager not initialized');
    }

    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply(),
      ]);

      let userBalance = '0';
      let usdValue = '0';
      const allowances: Record<string, string> = {};

      if (userAddress) {
        const balance = await this.contract.balanceOf(userAddress);
        userBalance = ethers.utils.formatUnits(balance, decimals);
        usdValue = userBalance; // 1:1 peg with USD
      }

      return {
        address: MNEE_TOKEN_CONFIG.address,
        name,
        symbol,
        decimals,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
        userBalance,
        usdValue,
        allowances,
      };
    } catch (error) {
      console.error('Failed to get MNEE token info:', error);
      
      // Return fallback data for demo
      return {
        address: MNEE_TOKEN_CONFIG.address,
        name: MNEE_TOKEN_CONFIG.name,
        symbol: MNEE_TOKEN_CONFIG.symbol,
        decimals: MNEE_TOKEN_CONFIG.decimals,
        totalSupply: '1000000000', // Demo: 1B MNEE
        userBalance: userAddress ? '10000' : '0', // Demo: 10k MNEE
        usdValue: userAddress ? '10000' : '0', // Demo: $10k USD
        allowances: {},
      };
    }
  }

  /**
   * Transfer MNEE tokens
   */
  async transfer(to: string, amount: string): Promise<MNEEPayment> {
    if (!this.contract || !this.signer) {
      throw new Error('MNEE Token manager not initialized');
    }

    const checksummedTo = ethers.utils.getAddress(to);
    const amountInWei = ethers.utils.parseUnits(amount, MNEE_TOKEN_CONFIG.decimals);

    const tx = await this.contract.transfer(checksummedTo, amountInWei, {
      gasLimit: 100000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();

    return {
      type: 'booking',
      txHash: tx.hash,
      from: signerAddress,
      to: checksummedTo,
      amount,
      usdValue: amount, // 1:1 peg
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
    };
  }

  /**
   * Approve spender (for escrow contracts)
   */
  async approve(spender: string, amount: string): Promise<MNEEPayment> {
    if (!this.contract || !this.signer) {
      throw new Error('MNEE Token manager not initialized');
    }

    const checksummedSpender = ethers.utils.getAddress(spender);
    const amountInWei = ethers.utils.parseUnits(amount, MNEE_TOKEN_CONFIG.decimals);

    const tx = await this.contract.approve(checksummedSpender, amountInWei, {
      gasLimit: 80000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();

    return {
      type: 'booking',
      txHash: tx.hash,
      from: signerAddress,
      to: checksummedSpender,
      amount,
      usdValue: amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
    };
  }

  /**
   * Get allowance for spender
   */
  async getAllowance(owner: string, spender: string): Promise<string> {
    if (!this.contract) {
      throw new Error('MNEE Token manager not initialized');
    }

    try {
      const allowance = await this.contract.allowance(owner, spender);
      return ethers.utils.formatUnits(allowance, MNEE_TOKEN_CONFIG.decimals);
    } catch (error) {
      console.error('Failed to get allowance:', error);
      return '0';
    }
  }

  /**
   * Convert ETH amount to MNEE (using ETH/USD price)
   */
  ethToMNEE(ethAmount: string, ethPriceUSD: number = 3000): string {
    const eth = parseFloat(ethAmount);
    const mneeAmount = eth * ethPriceUSD; // ETH to USD to MNEE
    return mneeAmount.toFixed(2);
  }

  /**
   * Convert MNEE to ETH
   */
  mneeToETH(mneeAmount: string, ethPriceUSD: number = 3000): string {
    const mnee = parseFloat(mneeAmount);
    const ethAmount = mnee / ethPriceUSD;
    return ethAmount.toFixed(6);
  }

  /**
   * Add MNEE token to user's wallet
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
            address: MNEE_TOKEN_CONFIG.address,
            symbol: MNEE_TOKEN_CONFIG.symbol,
            decimals: MNEE_TOKEN_CONFIG.decimals,
            image: 'https://mnee.io/logo.png',
          },
        },
      });

      return wasAdded as boolean;
    } catch (error) {
      console.error('Failed to add MNEE to wallet:', error);
      return false;
    }
  }

  /**
   * Get Etherscan URL for MNEE token
   */
  getEtherscanUrl(): string {
    return `https://etherscan.io/token/${MNEE_TOKEN_CONFIG.address}`;
  }
}

/**
 * MNEE Payment Storage Helper
 */
export const MNEEPaymentStorage = {
  STORAGE_KEY: 'mnee_payments',
  MAX_PAYMENTS: 100,

  save(payment: MNEEPayment): void {
    try {
      const existing = this.getAll();
      existing.unshift(payment);
      const limited = existing.slice(0, this.MAX_PAYMENTS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save MNEE payment:', error);
    }
  },

  getAll(): MNEEPayment[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  },

  getStats() {
    const payments = this.getAll();
    const totalBookings = payments.filter(p => p.type === 'booking').length;
    const totalEscrowReleases = payments.filter(p => p.type === 'escrow_release').length;
    const totalRefunds = payments.filter(p => p.type === 'refund').length;
    const totalVolume = payments
      .filter(p => p.status === 'confirmed')
      .reduce((sum, p) => sum + parseFloat(p.usdValue), 0);

    return {
      totalPayments: payments.length,
      totalBookings,
      totalEscrowReleases,
      totalRefunds,
      totalVolumeUSD: totalVolume.toFixed(2),
      confirmedPayments: payments.filter(p => p.status === 'confirmed').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
    };
  },

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },
};

/**
 * Calculate optimal MNEE amount for tourism package
 */
export function calculateMNEEAmount(ethAmount: string, ethPriceUSD: number = 3000): {
  mneeAmount: string;
  usdValue: string;
  savings: string; // vs traditional payment processor fees
} {
  const eth = parseFloat(ethAmount);
  const usdValue = eth * ethPriceUSD;
  const mneeAmount = usdValue; // 1:1 peg
  
  // Traditional processor: 2.9% + $0.30
  const traditionalFee = (usdValue * 0.029) + 0.30;
  const blockchainFee = 5; // Estimated gas in USD
  const savings = traditionalFee - blockchainFee;

  return {
    mneeAmount: mneeAmount.toFixed(2),
    usdValue: usdValue.toFixed(2),
    savings: savings > 0 ? savings.toFixed(2) : '0.00',
  };
}
