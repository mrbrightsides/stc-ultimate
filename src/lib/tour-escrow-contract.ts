'use client';

import { ethers } from 'ethers';
import { MNEE_TOKEN_CONFIG, MNEE_TOKEN_ABI } from './mnee-token';

// ========================================
// TOUR ESCROW SMART CONTRACT
// Automated escrow for tourism bookings with MNEE
// ========================================

export const TOUR_ESCROW_ABI = [
  // Create escrow
  'function createEscrow(address _tokenAddress, uint256 _amount, address _operator, string memory _serviceId) external returns (uint256)',
  
  // Release escrow (by tourist after service completion)
  'function releaseEscrow(uint256 _escrowId) external',
  
  // Refund escrow (by operator if service cancelled)
  'function refundEscrow(uint256 _escrowId) external',
  
  // Verify service completion (by operator)
  'function verifyService(uint256 _escrowId) external',
  
  // Get escrow details
  'function getEscrow(uint256 _escrowId) view returns (address tourist, address operator, uint256 amount, uint8 status, uint256 createdAt, string memory serviceId)',
  
  // Events
  'event EscrowCreated(uint256 indexed escrowId, address indexed tourist, address indexed operator, uint256 amount, string serviceId)',
  'event EscrowReleased(uint256 indexed escrowId, address indexed operator, uint256 amount)',
  'event EscrowRefunded(uint256 indexed escrowId, address indexed tourist, uint256 amount)',
  'event ServiceVerified(uint256 indexed escrowId, address indexed operator)',
] as const;

// Tour Escrow Configuration
export const TOUR_ESCROW_CONFIG = {
  // Deployed contract address (placeholder for demo)
  // In production, this would be the actual deployed contract
  address: '0x1234567890123456789012345678901234567890' as const,
  
  // Supported tokens
  supportedTokens: [MNEE_TOKEN_CONFIG.address],
  
  // Escrow timeouts
  timeout: 7 * 24 * 60 * 60, // 7 days in seconds
  
  // Fee structure
  platformFee: 1.5, // 1.5% platform fee
} as const;

export enum EscrowStatus {
  PENDING = 0,
  VERIFIED = 1,
  RELEASED = 2,
  REFUNDED = 3,
  DISPUTED = 4,
}

export interface TourEscrow {
  escrowId: string;
  tourist: string;
  operator: string;
  amount: string;
  amountUSD: string;
  status: EscrowStatus;
  statusText: string;
  createdAt: number;
  serviceId: string;
  serviceName: string;
  tokenAddress: string;
  txHash?: string;
  releaseTxHash?: string;
  refundTxHash?: string;
}

export interface EscrowTransaction {
  type: 'create' | 'release' | 'refund' | 'verify';
  escrowId: string;
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
 * Tour Escrow Manager - Handles all escrow operations
 */
export class TourEscrowManager {
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
    
    // Create escrow contract instance
    this.contract = new ethers.Contract(
      TOUR_ESCROW_CONFIG.address,
      TOUR_ESCROW_ABI,
      this.signer
    );
    
    // Create MNEE token contract instance
    this.tokenContract = new ethers.Contract(
      MNEE_TOKEN_CONFIG.address,
      MNEE_TOKEN_ABI,
      this.signer
    );
    
    console.log('✅ Tour Escrow Manager initialized');
  }

  /**
   * Create new escrow for booking
   */
  async createEscrow(
    amount: string,
    operatorAddress: string,
    serviceId: string,
    serviceName: string
  ): Promise<EscrowTransaction> {
    if (!this.contract || !this.tokenContract || !this.signer) {
      throw new Error('Tour Escrow manager not initialized');
    }

    const touristAddress = await this.signer.getAddress();
    const amountInWei = ethers.utils.parseUnits(amount, MNEE_TOKEN_CONFIG.decimals);
    
    // Step 1: Approve escrow contract to spend MNEE
    console.log('Step 1: Approving MNEE spending...');
    const approveTx = await this.tokenContract.approve(
      TOUR_ESCROW_CONFIG.address,
      amountInWei,
      { gasLimit: 100000 }
    );
    await approveTx.wait();
    console.log('✅ Approval confirmed');

    // Step 2: Create escrow
    console.log('Step 2: Creating escrow...');
    const tx = await this.contract.createEscrow(
      MNEE_TOKEN_CONFIG.address,
      amountInWei,
      operatorAddress,
      serviceId,
      { gasLimit: 300000 }
    );

    const receipt = await tx.wait();
    
    // Parse escrow created event to get escrowId
    const escrowCreatedEvent = receipt.events?.find(
      (e: any) => e.event === 'EscrowCreated'
    );
    const escrowId = escrowCreatedEvent?.args?.escrowId?.toString() || '0';

    // Store escrow locally
    const escrow: TourEscrow = {
      escrowId,
      tourist: touristAddress,
      operator: operatorAddress,
      amount,
      amountUSD: amount, // 1:1 MNEE to USD
      status: EscrowStatus.PENDING,
      statusText: 'Pending',
      createdAt: Date.now(),
      serviceId,
      serviceName,
      tokenAddress: MNEE_TOKEN_CONFIG.address,
      txHash: tx.hash,
    };
    
    this.saveEscrow(escrow);

    return {
      type: 'create',
      escrowId,
      txHash: tx.hash,
      from: touristAddress,
      to: operatorAddress,
      amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Verify service completion (by operator)
   */
  async verifyService(escrowId: string): Promise<EscrowTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Tour Escrow manager not initialized');
    }

    const tx = await this.contract.verifyService(escrowId, {
      gasLimit: 150000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();
    
    // Update escrow status locally
    const escrow = this.getEscrow(escrowId);
    if (escrow) {
      escrow.status = EscrowStatus.VERIFIED;
      escrow.statusText = 'Verified';
      this.updateEscrow(escrow);
    }

    return {
      type: 'verify',
      escrowId,
      txHash: tx.hash,
      from: signerAddress,
      amount: escrow?.amount || '0',
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Release escrow (by tourist after service verified)
   */
  async releaseEscrow(escrowId: string): Promise<EscrowTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Tour Escrow manager not initialized');
    }

    const escrow = this.getEscrow(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    const tx = await this.contract.releaseEscrow(escrowId, {
      gasLimit: 200000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();
    
    // Update escrow status locally
    escrow.status = EscrowStatus.RELEASED;
    escrow.statusText = 'Released';
    escrow.releaseTxHash = tx.hash;
    this.updateEscrow(escrow);

    return {
      type: 'release',
      escrowId,
      txHash: tx.hash,
      from: signerAddress,
      to: escrow.operator,
      amount: escrow.amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Refund escrow (by operator if service cancelled)
   */
  async refundEscrow(escrowId: string): Promise<EscrowTransaction> {
    if (!this.contract || !this.signer) {
      throw new Error('Tour Escrow manager not initialized');
    }

    const escrow = this.getEscrow(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    const tx = await this.contract.refundEscrow(escrowId, {
      gasLimit: 200000,
    });

    const receipt = await tx.wait();
    const signerAddress = await this.signer.getAddress();
    
    // Update escrow status locally
    escrow.status = EscrowStatus.REFUNDED;
    escrow.statusText = 'Refunded';
    escrow.refundTxHash = tx.hash;
    this.updateEscrow(escrow);

    return {
      type: 'refund',
      escrowId,
      txHash: tx.hash,
      from: signerAddress,
      to: escrow.tourist,
      amount: escrow.amount,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: 'confirmed',
    };
  }

  /**
   * Get escrow details from blockchain
   */
  async getEscrowFromChain(escrowId: string): Promise<TourEscrow | null> {
    if (!this.contract) {
      throw new Error('Tour Escrow manager not initialized');
    }

    try {
      const escrowData = await this.contract.getEscrow(escrowId);
      
      return {
        escrowId,
        tourist: escrowData.tourist,
        operator: escrowData.operator,
        amount: ethers.utils.formatUnits(escrowData.amount, MNEE_TOKEN_CONFIG.decimals),
        amountUSD: ethers.utils.formatUnits(escrowData.amount, MNEE_TOKEN_CONFIG.decimals),
        status: escrowData.status,
        statusText: this.getStatusText(escrowData.status),
        createdAt: escrowData.createdAt.toNumber() * 1000,
        serviceId: escrowData.serviceId,
        serviceName: 'Unknown Service',
        tokenAddress: MNEE_TOKEN_CONFIG.address,
      };
    } catch (error) {
      console.error('Failed to get escrow from chain:', error);
      return null;
    }
  }

  /**
   * Get escrow status text
   */
  private getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      [EscrowStatus.PENDING]: 'Pending',
      [EscrowStatus.VERIFIED]: 'Verified',
      [EscrowStatus.RELEASED]: 'Released',
      [EscrowStatus.REFUNDED]: 'Refunded',
      [EscrowStatus.DISPUTED]: 'Disputed',
    };
    return statusMap[status] || 'Unknown';
  }

  /**
   * Local storage helpers
   */
  private saveEscrow(escrow: TourEscrow): void {
    try {
      const escrows = this.getAllEscrows();
      escrows.push(escrow);
      localStorage.setItem('tour_escrows', JSON.stringify(escrows));
    } catch (error) {
      console.error('Failed to save escrow:', error);
    }
  }

  private updateEscrow(escrow: TourEscrow): void {
    try {
      const escrows = this.getAllEscrows();
      const index = escrows.findIndex(e => e.escrowId === escrow.escrowId);
      if (index !== -1) {
        escrows[index] = escrow;
        localStorage.setItem('tour_escrows', JSON.stringify(escrows));
      }
    } catch (error) {
      console.error('Failed to update escrow:', error);
    }
  }

  getEscrow(escrowId: string): TourEscrow | null {
    try {
      const escrows = this.getAllEscrows();
      return escrows.find(e => e.escrowId === escrowId) || null;
    } catch (error) {
      return null;
    }
  }

  getAllEscrows(): TourEscrow[] {
    try {
      const data = localStorage.getItem('tour_escrows');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get escrows for specific user
   */
  getUserEscrows(userAddress: string): TourEscrow[] {
    const allEscrows = this.getAllEscrows();
    return allEscrows.filter(
      e => e.tourist.toLowerCase() === userAddress.toLowerCase() ||
           e.operator.toLowerCase() === userAddress.toLowerCase()
    );
  }

  /**
   * Get escrow statistics
   */
  getEscrowStats(): {
    totalEscrows: number;
    pendingEscrows: number;
    verifiedEscrows: number;
    releasedEscrows: number;
    refundedEscrows: number;
    totalVolumeUSD: string;
    averageEscrowUSD: string;
  } {
    const escrows = this.getAllEscrows();
    const pending = escrows.filter(e => e.status === EscrowStatus.PENDING).length;
    const verified = escrows.filter(e => e.status === EscrowStatus.VERIFIED).length;
    const released = escrows.filter(e => e.status === EscrowStatus.RELEASED).length;
    const refunded = escrows.filter(e => e.status === EscrowStatus.REFUNDED).length;
    
    const totalVolume = escrows.reduce((sum, e) => sum + parseFloat(e.amountUSD), 0);
    const avgEscrow = escrows.length > 0 ? totalVolume / escrows.length : 0;

    return {
      totalEscrows: escrows.length,
      pendingEscrows: pending,
      verifiedEscrows: verified,
      releasedEscrows: released,
      refundedEscrows: refunded,
      totalVolumeUSD: totalVolume.toFixed(2),
      averageEscrowUSD: avgEscrow.toFixed(2),
    };
  }
}
