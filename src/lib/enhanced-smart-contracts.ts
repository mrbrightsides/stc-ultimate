'use client';

import { ethers } from 'ethers';
import { TOUR_PACKAGE_ESCROW_ABI, MY_TOUR_ESCROW_ABI } from '@/app/types/contracts';

// Enhanced testnet configuration with multiple fallback options
export const TESTNET_CONFIG = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpc: 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206',
    explorerUrl: 'https://sepolia.etherscan.io'
  }
} as const;

// Simple Payment Contract ABI - for direct payments
export const SIMPLE_PAYMENT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "serviceId",
        "type": "string"
      }
    ],
    "name": "payForService",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Enhanced contract addresses with fallback options
export const ENHANCED_CONTRACTS = {
  // Primary contracts
  TOUR_PACKAGE_ESCROW: '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613' as const,
  MY_TOUR_ESCROW: '0xCAF91105884175585e22AceD113F00569547a229' as const,
  
  // Fallback simple payment contract (deployed on Sepolia)
  SIMPLE_PAYMENT: '0x1234567890123456789012345678901234567890' as const,
  
  // Merchant addresses for different services (Sepolia testnet valid checksummed addresses)
  MERCHANTS: {
    FLIGHT: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf' as const,
    HOTEL: '0x8ba1f109551bd432803012645aac136c6d2d9b59' as const, 
    TRANSPORT: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db' as const,
    RESTAURANT: '0x78731d3ca6b7e34ac0f824c42a7cc18a495cabab' as const,
    TOUR_GUIDE: '0x617f2e2fd72fd9d5503197092ac168c91465e7f2' as const,
    ACTIVITY: '0x17f6ad8ef982297579c203069c1dbffe4348c372' as const,
  }
} as const;

// Payment strategy interface
export interface PaymentStrategy {
  name: string;
  execute: (params: PaymentParams) => Promise<PaymentResult>;
  canExecute: () => Promise<boolean>;
}

export interface PaymentParams {
  serviceId: number;
  serviceName: string;
  amount: string;
  merchantAddress: string;
  provider: ethers.providers.Web3Provider;
  userAddress: string;
}

export interface PaymentResult {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  timestamp: number;
  strategy: string;
  etherscanUrl: string;
}

// Strategy 1: Tour Package Escrow Contract
export class TourPackageEscrowStrategy implements PaymentStrategy {
  name = 'Tour Package Escrow';
  
  async canExecute(): Promise<boolean> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(TESTNET_CONFIG.SEPOLIA.rpc);
      const contract = new ethers.Contract(
        ENHANCED_CONTRACTS.TOUR_PACKAGE_ESCROW,
        TOUR_PACKAGE_ESCROW_ABI,
        provider
      );
      
      // Check if contract exists and is initialized
      const initialized = await contract.initialized();
      return initialized;
    } catch (error) {
      console.log('Tour Package Escrow not available:', error);
      return false;
    }
  }
  
  async execute(params: PaymentParams): Promise<PaymentResult> {
    const signer = params.provider.getSigner();
    const contract = new ethers.Contract(
      ENHANCED_CONTRACTS.TOUR_PACKAGE_ESCROW,
      TOUR_PACKAGE_ESCROW_ABI,
      signer
    );
    
    const amountInWei = ethers.utils.parseEther(params.amount);
    
    const tx = await contract.completeActivity(params.serviceId - 1, {
      value: amountInWei,
      gasLimit: 200000,
    });
    
    const receipt = await tx.wait();
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: Date.now(),
      strategy: this.name,
      etherscanUrl: `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/tx/${tx.hash}`
    };
  }
}

// Strategy 2: My Tour Escrow Contract
export class MyTourEscrowStrategy implements PaymentStrategy {
  name = 'My Tour Escrow';
  
  async canExecute(): Promise<boolean> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(TESTNET_CONFIG.SEPOLIA.rpc);
      const contract = new ethers.Contract(
        ENHANCED_CONTRACTS.MY_TOUR_ESCROW,
        MY_TOUR_ESCROW_ABI,
        provider
      );
      
      // Check if contract exists
      const maxServices = await contract.maxServices();
      return maxServices.toNumber() > 0;
    } catch (error) {
      console.log('My Tour Escrow not available:', error);
      return false;
    }
  }
  
  async execute(params: PaymentParams): Promise<PaymentResult> {
    const signer = params.provider.getSigner();
    const contract = new ethers.Contract(
      ENHANCED_CONTRACTS.MY_TOUR_ESCROW,
      MY_TOUR_ESCROW_ABI,
      signer
    );
    
    const tx = await contract.triggerEvent(params.serviceId - 1, {
      value: ethers.utils.parseEther(params.amount),
      gasLimit: 150000,
    });
    
    const receipt = await tx.wait();
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: Date.now(),
      strategy: this.name,
      etherscanUrl: `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/tx/${tx.hash}`
    };
  }
}

// Strategy 3: Simple Payment Contract
export class SimplePaymentStrategy implements PaymentStrategy {
  name = 'Simple Payment Contract';
  
  async canExecute(): Promise<boolean> {
    // Disable this strategy since we're using a placeholder address
    // In production, this would check a real deployed contract
    console.log('Simple Payment Contract not available: using placeholder address');
    return false;
  }
  
  async execute(params: PaymentParams): Promise<PaymentResult> {
    const signer = params.provider.getSigner();
    const contract = new ethers.Contract(
      ENHANCED_CONTRACTS.SIMPLE_PAYMENT,
      SIMPLE_PAYMENT_ABI,
      signer
    );
    
    const amountInWei = ethers.utils.parseEther(params.amount);
    
    const tx = await contract.payForService(
      params.merchantAddress,
      params.serviceId.toString(),
      {
        value: amountInWei,
        gasLimit: 100000,
      }
    );
    
    const receipt = await tx.wait();
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: Date.now(),
      strategy: this.name,
      etherscanUrl: `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/tx/${tx.hash}`
    };
  }
}

// Strategy 4: Direct ETH Transfer (Always available fallback)
export class DirectTransferStrategy implements PaymentStrategy {
  name = 'Direct ETH Transfer';
  
  async canExecute(): Promise<boolean> {
    return true; // Always available
  }
  
  async execute(params: PaymentParams): Promise<PaymentResult> {
    const signer = params.provider.getSigner();
    
    // Ensure address is properly checksummed
    const checksummedAddress = ethers.utils.getAddress(params.merchantAddress);
    
    const tx = await signer.sendTransaction({
      to: checksummedAddress,
      value: ethers.utils.parseEther(params.amount),
      gasLimit: 21000,
      // Explicitly set chainId for Sepolia
      chainId: TESTNET_CONFIG.SEPOLIA.chainId,
    });
    
    const receipt = await tx.wait();
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: Date.now(),
      strategy: this.name,
      etherscanUrl: `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/tx/${tx.hash}`
    };
  }
}

// Payment manager that tries strategies in order
export class PaymentManager {
  private strategies: PaymentStrategy[];
  
  constructor() {
    this.strategies = [
      new TourPackageEscrowStrategy(),
      new MyTourEscrowStrategy(),
      new SimplePaymentStrategy(),
      new DirectTransferStrategy() // Always last as fallback
    ];
  }
  
  async executePayment(params: PaymentParams): Promise<PaymentResult> {
    console.log('Attempting payment with multiple strategies...');
    
    // First try strategies in order, but skip validation for faster execution
    for (const strategy of this.strategies) {
      try {
        console.log(`Trying strategy: ${strategy.name}`);
        
        // For DirectTransferStrategy, skip validation and execute directly
        if (strategy.name === 'Direct ETH Transfer') {
          console.log(`Using fallback strategy: ${strategy.name}`);
          return await strategy.execute(params);
        }
        
        // For contract strategies, validate first
        const canExecute = await strategy.canExecute();
        if (canExecute) {
          console.log(`Using strategy: ${strategy.name}`);
          return await strategy.execute(params);
        }
      } catch (error) {
        console.warn(`Strategy ${strategy.name} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All payment strategies failed');
  }
  
  async getAvailableStrategies(): Promise<string[]> {
    const available: string[] = [];
    
    for (const strategy of this.strategies) {
      try {
        const canExecute = await strategy.canExecute();
        if (canExecute) {
          available.push(strategy.name);
        }
      } catch (error) {
        console.warn(`Strategy ${strategy.name} validation failed:`, error);
        // For DirectTransferStrategy, always include it as it should always work
        if (strategy.name === 'Direct ETH Transfer') {
          available.push(strategy.name);
        }
      }
    }
    
    // Ensure DirectTransferStrategy is always included as fallback
    if (!available.includes('Direct ETH Transfer')) {
      available.push('Direct ETH Transfer');
    }
    
    console.log('Available payment strategies:', available);
    return available;
  }
}

// Network validation
export const validateNetwork = async (provider: ethers.providers.Web3Provider): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    return network.chainId === TESTNET_CONFIG.SEPOLIA.chainId;
  } catch (error) {
    console.error('Network validation failed:', error);
    return false;
  }
};

// Switch to Sepolia if needed
export const switchToSepolia = async (): Promise<boolean> => {
  try {
    if (!window.ethereum) return false;
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TESTNET_CONFIG.SEPOLIA.chainId.toString(16)}` }],
    });
    
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, add it
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${TESTNET_CONFIG.SEPOLIA.chainId.toString(16)}`,
            chainName: TESTNET_CONFIG.SEPOLIA.name,
            rpcUrls: [TESTNET_CONFIG.SEPOLIA.rpc],
            blockExplorerUrls: [TESTNET_CONFIG.SEPOLIA.explorerUrl],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'SEP',
              decimals: 18,
            },
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Sepolia network:', addError);
        return false;
      }
    }
    console.error('Failed to switch to Sepolia:', error);
    return false;
  }
};