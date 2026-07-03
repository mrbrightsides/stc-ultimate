'use client';

import { ethers } from 'ethers';
import { MNEE_TOKEN_CONFIG, MNEE_TOKEN_ABI } from './mnee-token';

// ========================================
// REVENUE SPLIT SMART CONTRACT
// Automated multi-stakeholder payment distribution
// ========================================

export const REVENUE_SPLIT_ABI = [
  // Create split payment
  'function createSplit(address _tokenAddress, uint256 _totalAmount, address[] memory _recipients, uint256[] memory _percentages, string memory _bookingId) external returns (uint256)',
  
  // Execute split
  'function executeSplit(uint256 _splitId) external',
  
  // Get split details
  'function getSplit(uint256 _splitId) view returns (address creator, uint256 totalAmount, uint8 status, uint256 recipientCount)',
  
  // Events
  'event SplitCreated(uint256 indexed splitId, address indexed creator, uint256 totalAmount, string bookingId)',
  'event SplitExecuted(uint256 indexed splitId, address[] recipients, uint256[] amounts)',
  'event PaymentSent(uint256 indexed splitId, address indexed recipient, uint256 amount)',
] as const;

// Revenue Split Configuration
export const REVENUE_SPLIT_CONFIG = {
  // Deployed contract address (placeholder for demo)
  address: '0x2345678901234567890123456789012345678901' as const,
  
  // Standard split percentages for tourism
  standardSplits: {
    hotelBooking: {
      hotel: 70,
      tourGuide: 15,
      platform: 10,
      treasury: 5,
    },
    tourPackage: {
      operator: 60,
      guide: 20,
      platform: 12,
      treasury: 8,
    },
    activityBooking: {
      provider: 75,
      coordinator: 10,
      platform: 10,
      treasury: 5,
    },
  },
  
  // Platform fee (taken from platform percentage)
  platformFeeRate: 10, // 10% of transaction
  treasuryRate: 5, // 5% to treasury
} as const;

export enum SplitStatus {
  PENDING = 0,
  EXECUTED = 1,
  FAILED = 2,
}

export interface SplitRecipient {
  address: string;
  name: string;
  role: string;
  percentage: number;
  amount: string;
  amountUSD: string;
}

export interface RevenueSplit {
  splitId: string;
  bookingId: string;
  creator: string;
  totalAmount: string;
  totalAmountUSD: string;
  recipients: SplitRecipient[];
  status: SplitStatus;
  statusText: string;
  createdAt: number;
  executedAt?: number;
  txHash?: string;
  executeTxHash?: string;
}

export interface SplitTransaction {
  type: 'create' | 'execute';
  splitId: string;
  txHash: string;
  from: string;
  totalAmount: string;
  recipients: Array<{ address: string; amount: string }>;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: 'confirmed' | 'pending' | 'failed';
}

/**
 * Revenue Split Manager - Handles automated payment distribution
 */
export class RevenueSplitManager {
  private contract: ethers.Contract | null = null;
  private tokenContract: ethers.Contract | null = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {}

  /**
   * Initialize with wallet provider
   */
  async initialize(provider: ethers.providers.Web3Provider): Promise<void> {
    this.provider = provider;
    this.signer = provider.getSigner();
    
    // Create revenue split contract instance
    this.contract = new ethers.Contract(
      REVENUE_SPLIT_CONFIG.address,
      REVENUE_SPLIT_ABI,
      this.signer
    );
    
    // Create MNEE token contract instance
    this.tokenContract = new ethers.Contract(
      MNEE_TOKEN_CONFIG.address,
      MNEE_TOKEN_ABI,
      this.signer
    );
    
    console.log('✅ Revenue Split Manager initialized');
  }

  /**
   * Create new revenue split
   */
  async createSplit(
    totalAmount: string,
    recipients: Array<{ address: string; name: string; role: string; percentage: number }>,
    bookingId: string
  ): Promise<SplitTransaction> {
    if (!this.contract || !this.tokenContract || !this.signer) {
      throw new Error('Revenue Split manager not initialized');
    }

    // Validate percentages sum to 100
    const totalPercentage = recipients.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Percentages must sum to 100, got ${totalPercentage}`);
    }

    const creatorAddress = await this.signer.getAddress();
    const amountInWei = ethers.utils.parseUnits(totalAmount, MNEE_TOKEN_CONFIG.decimals);
    
    // Step 1: Approve split contract to spend MNEE
    console.log('Step 1: Approving MNEE spending for split...');
    const approveTx = await this.tokenContract.approve(
      REVENUE_SPLIT_CONFIG.address,
      amountInWei,
      { gasLimit: 100000 }
    );
    await approveTx.wait();
    console.log('✅ Approval confirmed');

    // Prepare recipients and percentages arrays
    const recipientAddresses = recipients.map(r => r.address);
    const percentages = recipients.map(r => Math.floor(r.percentage * 100)); // Convert to basis points

    // Step 2: Create split
    console.log('Step 2: Creating revenue split...');
    const tx = await this.contract.createSplit(
      MNEE_TOKEN_CONFIG.address,
      amountInWei,
      recipientAddresses,
      percentages,
      bookingId,
      { gasLimit: 400000 }
    );

    const receipt = await tx.wait();
    
    // Parse split created event
    const splitCreatedEvent = receipt.events?.find(
      (e: any) => e.event === 'SplitCreated'
    );
    const splitId = splitCreatedEvent?.args?.splitId?.toString() || '0';

    // Calculate recipient amounts
    const recipientsWithAmounts: SplitRecipient[] = recipients.map(r => {
      const amount = (parseFloat(totalAmount) * r.percentage / 100).toFixed(2);
      return {
        ...r,
        amount,
        amountUSD: amount, // 1:1 MNEE to USD
      };
    });

    // Store split locally
    const split: RevenueSplit = {
      splitId,
      bookingId,
      creator: creatorAddress,
      totalAmount,
      totalAmountUSD: totalAmount,
      recipients: recipientsWithAmounts,
      status: SplitStatus.PENDING,
      statusText: 'Pending',
      createdAt: Date.now(),
      txHash: tx.hash,
    };
    
    this.saveSplit(split);

    return {
      type: 'create',
      splitId,
      txHash: tx.hash,
      from: creatorAddress,
      totalAmount,
      recipients: recipientsWithAmounts.map(r => ({
        address: r.address,
        amount: r.amount,
      })),
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Execute revenue split
   */
  async executeSplit(splitId: string): Promise<SplitTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Revenue Split manager not initialized');
    }

    const split = this.getSplit(splitId);
    if (!split) {
      throw new Error('Split not found');
    }

    const tx = await this.contract.executeSplit(splitId, {
      gasLimit: 500000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();
    
    // Update split status locally
    split.status = SplitStatus.EXECUTED;
    split.statusText = 'Executed';
    split.executedAt = Date.now();
    split.executeTxHash = tx.hash;
    this.updateSplit(split);

    return {
      type: 'execute',
      splitId,
      txHash: tx.hash,
      from: signerAddress,
      totalAmount: split.totalAmount,
      recipients: split.recipients.map(r => ({
        address: r.address,
        amount: r.amount,
      })),
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Calculate split amounts for standard booking types
   */
  calculateStandardSplit(
    bookingType: keyof typeof REVENUE_SPLIT_CONFIG.standardSplits,
    totalAmount: string,
    stakeholders: {
      hotel?: string;
      tourGuide?: string;
      operator?: string;
      guide?: string;
      provider?: string;
      coordinator?: string;
    }
  ): Array<{ address: string; name: string; role: string; percentage: number }> {
    const splitConfig = REVENUE_SPLIT_CONFIG.standardSplits[bookingType];
    const recipients: Array<{ address: string; name: string; role: string; percentage: number }> = [];

    // Platform address (treasury)
    const platformAddress = '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf';
    const treasuryAddress = '0x8ba1f109551bd432803012645aac136c6d2d9b59';

    switch (bookingType) {
      case 'hotelBooking':
        if (stakeholders.hotel) {
          recipients.push({
            address: stakeholders.hotel,
            name: 'Hotel',
            role: 'Accommodation Provider',
            percentage: splitConfig.hotel,
          });
        }
        if (stakeholders.tourGuide) {
          recipients.push({
            address: stakeholders.tourGuide,
            name: 'Tour Guide',
            role: 'Guide Service',
            percentage: splitConfig.tourGuide,
          });
        }
        recipients.push({
          address: platformAddress,
          name: 'Platform',
          role: 'Service Fee',
          percentage: splitConfig.platform,
        });
        recipients.push({
          address: treasuryAddress,
          name: 'Treasury',
          role: 'Platform Treasury',
          percentage: splitConfig.treasury,
        });
        break;

      case 'tourPackage':
        if (stakeholders.operator) {
          recipients.push({
            address: stakeholders.operator,
            name: 'Tour Operator',
            role: 'Package Provider',
            percentage: splitConfig.operator,
          });
        }
        if (stakeholders.guide) {
          recipients.push({
            address: stakeholders.guide,
            name: 'Tour Guide',
            role: 'Guide Service',
            percentage: splitConfig.guide,
          });
        }
        recipients.push({
          address: platformAddress,
          name: 'Platform',
          role: 'Service Fee',
          percentage: splitConfig.platform,
        });
        recipients.push({
          address: treasuryAddress,
          name: 'Treasury',
          role: 'Platform Treasury',
          percentage: splitConfig.treasury,
        });
        break;

      case 'activityBooking':
        if (stakeholders.provider) {
          recipients.push({
            address: stakeholders.provider,
            name: 'Activity Provider',
            role: 'Service Provider',
            percentage: splitConfig.provider,
          });
        }
        if (stakeholders.coordinator) {
          recipients.push({
            address: stakeholders.coordinator,
            name: 'Coordinator',
            role: 'Activity Coordinator',
            percentage: splitConfig.coordinator,
          });
        }
        recipients.push({
          address: platformAddress,
          name: 'Platform',
          role: 'Service Fee',
          percentage: splitConfig.platform,
        });
        recipients.push({
          address: treasuryAddress,
          name: 'Treasury',
          role: 'Platform Treasury',
          percentage: splitConfig.treasury,
        });
        break;
    }

    return recipients;
  }

  /**
   * Local storage helpers
   */
  private saveSplit(split: RevenueSplit): void {
    try {
      const splits = this.getAllSplits();
      splits.push(split);
      localStorage.setItem('revenue_splits', JSON.stringify(splits));
    } catch (error) {
      console.error('Failed to save split:', error);
    }
  }

  private updateSplit(split: RevenueSplit): void {
    try {
      const splits = this.getAllSplits();
      const index = splits.findIndex(s => s.splitId === split.splitId);
      if (index !== -1) {
        splits[index] = split;
        localStorage.setItem('revenue_splits', JSON.stringify(splits));
      }
    } catch (error) {
      console.error('Failed to update split:', error);
    }
  }

  getSplit(splitId: string): RevenueSplit | null {
    try {
      const splits = this.getAllSplits();
      return splits.find(s => s.splitId === splitId) || null;
    } catch (error) {
      return null;
    }
  }

  getAllSplits(): RevenueSplit[] {
    try {
      const data = localStorage.getItem('revenue_splits');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get splits for specific user
   */
  getUserSplits(userAddress: string): RevenueSplit[] {
    const allSplits = this.getAllSplits();
    return allSplits.filter(
      s => s.creator.toLowerCase() === userAddress.toLowerCase() ||
           s.recipients.some(r => r.address.toLowerCase() === userAddress.toLowerCase())
    );
  }

  /**
   * Get split statistics
   */
  getSplitStats(): {
    totalSplits: number;
    pendingSplits: number;
    executedSplits: number;
    totalVolumeUSD: string;
    totalPlatformFeeUSD: string;
    averageSplitUSD: string;
  } {
    const splits = this.getAllSplits();
    const pending = splits.filter(s => s.status === SplitStatus.PENDING).length;
    const executed = splits.filter(s => s.status === SplitStatus.EXECUTED).length;
    
    const totalVolume = splits.reduce((sum, s) => sum + parseFloat(s.totalAmountUSD), 0);
    const avgSplit = splits.length > 0 ? totalVolume / splits.length : 0;
    
    // Calculate platform fees (sum of platform + treasury recipients)
    const totalPlatformFee = splits.reduce((sum, s) => {
      const platformRecipients = s.recipients.filter(
        r => r.role === 'Service Fee' || r.role === 'Platform Treasury'
      );
      return sum + platformRecipients.reduce((rSum, r) => rSum + parseFloat(r.amountUSD), 0);
    }, 0);

    return {
      totalSplits: splits.length,
      pendingSplits: pending,
      executedSplits: executed,
      totalVolumeUSD: totalVolume.toFixed(2),
      totalPlatformFeeUSD: totalPlatformFee.toFixed(2),
      averageSplitUSD: avgSplit.toFixed(2),
    };
  }
}
