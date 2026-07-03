'use client';

import { ethers } from 'ethers';
import { TESTNET_CONFIG } from './enhanced-smart-contracts';
import type { ServiceMilestone } from './destinations-config';

// Milestone Escrow Contract Interface
export interface MilestoneEscrowBooking {
  bookingId: string;
  destination: string;
  totalAmount: string;
  depositedAmount: string;
  releasedAmount: string;
  milestones: MilestoneStatus[];
  currentMilestoneIndex: number;
  status: 'pending' | 'active' | 'completed' | 'disputed';
  createdAt: number;
}

export interface MilestoneStatus extends ServiceMilestone {
  isCompleted: boolean;
  transactionHash?: string;
  completedAt?: number;
  iotProofHash?: string;
  blockNumber?: number;
  gasUsed?: string;
}

export interface MilestoneReleaseResult {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  timestamp: number;
  vendorAddress: string;
  amountReleased: string;
  etherscanUrl: string;
  milestoneIndex: number;
  gasCost: string; // in ETH
  duration: number; // milliseconds from trigger to confirmation
}

// Simulated Escrow Manager (In production, this would interact with a smart contract)
export class MilestoneEscrowManager {
  private bookings: Map<string, MilestoneEscrowBooking> = new Map();
  
  /**
   * Create escrow booking with full deposit
   */
  async createEscrowBooking(
    destination: string,
    milestones: ServiceMilestone[],
    provider: ethers.providers.Web3Provider,
    userAddress: string
  ): Promise<MilestoneEscrowBooking> {
    const bookingId = this.generateBookingId();
    const totalAmount = this.calculateTotalAmount(milestones);
    
    // Convert milestones to status tracking
    const milestoneStatuses: MilestoneStatus[] = milestones.map((m, index) => ({
      ...m,
      sequence: index,
      isCompleted: false,
    }));
    
    // In production, this would be a smart contract transaction
    // For now, we'll simulate the deposit
    console.log(`📦 Creating escrow booking ${bookingId}`);
    console.log(`💰 Total escrow amount: ${totalAmount} ETH`);
    console.log(`🎯 Milestones: ${milestones.length}`);
    console.log(`👤 User: ${userAddress}`);
    
    const booking: MilestoneEscrowBooking = {
      bookingId,
      destination,
      totalAmount,
      depositedAmount: totalAmount,
      releasedAmount: '0',
      milestones: milestoneStatuses,
      currentMilestoneIndex: 0,
      status: 'active',
      createdAt: Date.now(),
    };
    
    this.bookings.set(bookingId, booking);
    
    return booking;
  }
  
  /**
   * Trigger milestone completion and release funds to vendor
   */
  async triggerMilestoneRelease(
    bookingId: string,
    milestoneIndex: number,
    iotProofHash: string,
    provider: ethers.providers.Web3Provider,
    triggerStartTime?: number
  ): Promise<MilestoneReleaseResult> {
    const booking = this.bookings.get(bookingId);
    
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }
    
    if (milestoneIndex !== booking.currentMilestoneIndex) {
      throw new Error(`Milestone ${milestoneIndex} cannot be triggered. Current milestone is ${booking.currentMilestoneIndex}`);
    }
    
    const milestone = booking.milestones[milestoneIndex];
    
    if (milestone.isCompleted) {
      throw new Error(`Milestone ${milestoneIndex} already completed`);
    }
    
    console.log(`🚀 Triggering milestone ${milestoneIndex + 1}/${booking.milestones.length}`);
    console.log(`💸 Releasing ${milestone.amount} ETH to ${milestone.vendorAddress}`);
    console.log(`📝 IoT Proof: ${iotProofHash}`);
    
    // Execute real blockchain transaction
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const checksummedAddress = ethers.utils.getAddress(milestone.vendorAddress);
    
    // 1. Check network
    const network = await provider.getNetwork();
    if (network.chainId !== TESTNET_CONFIG.SEPOLIA.chainId) {
      throw new Error(`Wrong network! Please switch to Sepolia Testnet (chainId: ${TESTNET_CONFIG.SEPOLIA.chainId})`);
    }
    
    // 2. Check user balance
    const userBalance = await provider.getBalance(userAddress);
    const transferAmount = ethers.utils.parseEther(milestone.amount);
    const estimatedGas = ethers.BigNumber.from(21000);
    const gasPrice = await provider.getGasPrice();
    const estimatedGasCost = estimatedGas.mul(gasPrice);
    const totalRequired = transferAmount.add(estimatedGasCost);
    
    console.log(`💰 Balance check:`);
    console.log(`  - Your balance: ${ethers.utils.formatEther(userBalance)} ETH`);
    console.log(`  - Transfer amount: ${milestone.amount} ETH`);
    console.log(`  - Estimated gas: ${ethers.utils.formatEther(estimatedGasCost)} ETH`);
    console.log(`  - Total required: ${ethers.utils.formatEther(totalRequired)} ETH`);
    
    if (userBalance.lt(totalRequired)) {
      const deficit = totalRequired.sub(userBalance);
      throw new Error(
        `Insufficient balance! You need ${ethers.utils.formatEther(deficit)} more ETH. ` +
        `Get Sepolia testnet ETH from: https://sepoliafaucet.com/`
      );
    }
    
    // 3. Estimate gas to catch contract errors early
    try {
      await signer.estimateGas({
        to: checksummedAddress,
        value: transferAmount,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Transaction will likely fail: ${errorMessage}`);
    }
    
    // 4. Execute transaction
    console.log(`✅ All checks passed - sending transaction...`);
    const tx = await signer.sendTransaction({
      to: checksummedAddress,
      value: transferAmount,
      gasLimit: estimatedGas,
      chainId: TESTNET_CONFIG.SEPOLIA.chainId,
    });
    
    console.log(`📤 Transaction sent: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    const completionTime = Date.now();
    const duration = triggerStartTime ? completionTime - triggerStartTime : 0;
    
    // Calculate gas cost (assuming 30 Gwei gas price on Sepolia)
    const gasPriceGwei = 30;
    const gasPriceWei = BigInt(gasPriceGwei) * BigInt(1e9);
    const costWei = receipt.gasUsed.mul(gasPriceWei);
    const gasCost = ethers.utils.formatEther(costWei);
    
    // Update milestone status
    milestone.isCompleted = true;
    milestone.transactionHash = tx.hash;
    milestone.completedAt = completionTime;
    milestone.iotProofHash = iotProofHash;
    milestone.blockNumber = receipt.blockNumber;
    milestone.gasUsed = receipt.gasUsed.toString();
    
    // Update booking status
    const releasedAmount = parseFloat(booking.releasedAmount) + parseFloat(milestone.amount);
    booking.releasedAmount = releasedAmount.toFixed(6);
    booking.currentMilestoneIndex = milestoneIndex + 1;
    
    // Check if all milestones completed
    if (booking.currentMilestoneIndex >= booking.milestones.length) {
      booking.status = 'completed';
      console.log(`🎉 All milestones completed for booking ${bookingId}`);
    }
    
    this.bookings.set(bookingId, booking);
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: completionTime,
      vendorAddress: checksummedAddress,
      amountReleased: milestone.amount,
      etherscanUrl: `${TESTNET_CONFIG.SEPOLIA.explorerUrl}/tx/${tx.hash}`,
      milestoneIndex,
      gasCost,
      duration,
    };
  }
  
  /**
   * Get booking status
   */
  getBooking(bookingId: string): MilestoneEscrowBooking | undefined {
    return this.bookings.get(bookingId);
  }
  
  /**
   * Get current milestone
   */
  getCurrentMilestone(bookingId: string): MilestoneStatus | null {
    const booking = this.bookings.get(bookingId);
    if (!booking) return null;
    
    if (booking.currentMilestoneIndex >= booking.milestones.length) {
      return null; // All completed
    }
    
    return booking.milestones[booking.currentMilestoneIndex];
  }
  
  /**
   * Get next milestones (for preview)
   */
  getUpcomingMilestones(bookingId: string, count: number = 3): MilestoneStatus[] {
    const booking = this.bookings.get(bookingId);
    if (!booking) return [];
    
    const startIndex = booking.currentMilestoneIndex;
    return booking.milestones.slice(startIndex, startIndex + count);
  }
  
  /**
   * Get completed milestones
   */
  getCompletedMilestones(bookingId: string): MilestoneStatus[] {
    const booking = this.bookings.get(bookingId);
    if (!booking) return [];
    
    return booking.milestones.filter(m => m.isCompleted);
  }
  
  /**
   * Calculate escrow progress
   */
  getEscrowProgress(bookingId: string): {
    totalMilestones: number;
    completedMilestones: number;
    progressPercent: number;
    totalAmount: string;
    releasedAmount: string;
    remainingAmount: string;
  } {
    const booking = this.bookings.get(bookingId);
    
    if (!booking) {
      return {
        totalMilestones: 0,
        completedMilestones: 0,
        progressPercent: 0,
        totalAmount: '0',
        releasedAmount: '0',
        remainingAmount: '0',
      };
    }
    
    const completedMilestones = booking.milestones.filter(m => m.isCompleted).length;
    const progressPercent = (completedMilestones / booking.milestones.length) * 100;
    const remainingAmount = (parseFloat(booking.totalAmount) - parseFloat(booking.releasedAmount)).toFixed(6);
    
    return {
      totalMilestones: booking.milestones.length,
      completedMilestones,
      progressPercent,
      totalAmount: booking.totalAmount,
      releasedAmount: booking.releasedAmount,
      remainingAmount,
    };
  }
  
  /**
   * Get vendor payment breakdown
   */
  getVendorPayments(bookingId: string): Map<string, { totalPaid: string; transactions: number }> {
    const booking = this.bookings.get(bookingId);
    if (!booking) return new Map();
    
    const vendorPayments = new Map<string, { totalPaid: string; transactions: number }>();
    
    booking.milestones.forEach(milestone => {
      if (milestone.isCompleted) {
        const existing = vendorPayments.get(milestone.vendorAddress);
        if (existing) {
          vendorPayments.set(milestone.vendorAddress, {
            totalPaid: (parseFloat(existing.totalPaid) + parseFloat(milestone.amount)).toFixed(6),
            transactions: existing.transactions + 1,
          });
        } else {
          vendorPayments.set(milestone.vendorAddress, {
            totalPaid: milestone.amount,
            transactions: 1,
          });
        }
      }
    });
    
    return vendorPayments;
  }
  
  // Helper methods
  private generateBookingId(): string {
    return `BOOKING_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
  
  private calculateTotalAmount(milestones: ServiceMilestone[]): string {
    return milestones
      .reduce((sum, m) => sum + parseFloat(m.amount), 0)
      .toFixed(6);
  }
}

// Singleton instance
let escrowManagerInstance: MilestoneEscrowManager | null = null;

export function getEscrowManager(): MilestoneEscrowManager {
  if (!escrowManagerInstance) {
    escrowManagerInstance = new MilestoneEscrowManager();
  }
  return escrowManagerInstance;
}
