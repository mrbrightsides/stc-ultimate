import type { ethers } from 'ethers';

export type DisputeReason = 
  | 'service_not_delivered'
  | 'quality_issue'
  | 'timeout_exceeded'
  | 'iot_verification_failed'
  | 'vendor_unavailable';

export interface DisputeCase {
  disputeId: string;
  bookingId: string;
  milestoneIndex: number;
  milestoneName: string;
  reason: DisputeReason;
  description: string;
  amount: string;
  vendorAddress: string;
  timestamp: number;
  status: 'pending' | 'investigating' | 'resolved_refund' | 'resolved_release' | 'rejected';
  resolutionTimestamp?: number;
  refundTxHash?: string;
  evidence?: string[];
}

export interface RefundResult {
  success: boolean;
  disputeId: string;
  refundAmount: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  gasUsed: string;
  gasCost: string;
}

class DisputeResolutionManager {
  private disputes: Map<string, DisputeCase> = new Map();

  /**
   * Create a dispute case for a failed milestone
   */
  createDispute(
    bookingId: string,
    milestoneIndex: number,
    milestoneName: string,
    reason: DisputeReason,
    description: string,
    amount: string,
    vendorAddress: string
  ): DisputeCase {
    const disputeId = `DISPUTE_${bookingId}_M${milestoneIndex}_${Date.now()}`;
    
    const dispute: DisputeCase = {
      disputeId,
      bookingId,
      milestoneIndex,
      milestoneName,
      reason,
      description,
      amount,
      vendorAddress,
      timestamp: Date.now(),
      status: 'pending',
      evidence: []
    };

    this.disputes.set(disputeId, dispute);
    
    console.log('🚨 Dispute created:', dispute);
    
    return dispute;
  }

  /**
   * Automatically resolve dispute based on timeout
   * If milestone not completed within expected timeframe, auto-refund
   */
  async autoResolveTimeout(disputeId: string): Promise<'refund' | 'release' | 'investigate'> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) return 'investigate';

    // Automatic resolution logic
    switch (dispute.reason) {
      case 'timeout_exceeded':
      case 'service_not_delivered':
      case 'vendor_unavailable':
        // Auto-refund for clear non-delivery cases
        return 'refund';
        
      case 'iot_verification_failed':
        // Investigate - might be device issue vs actual non-delivery
        return 'investigate';
        
      case 'quality_issue':
        // Investigate - subjective complaint
        return 'investigate';
        
      default:
        return 'investigate';
    }
  }

  /**
   * Process refund for disputed milestone
   * In real implementation, this would interact with smart contract
   */
  async processRefund(
    disputeId: string,
    provider: ethers.providers.Web3Provider,
    touristAddress: string
  ): Promise<RefundResult> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) {
      throw new Error('Dispute not found');
    }

    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    // Simulate blockchain refund transaction
    console.log('💰 Processing refund for dispute:', disputeId);
    
    // In real implementation, call smart contract refund function
    // For now, simulate transaction
    const tx = await signer.sendTransaction({
      to: touristAddress,
      value: '0', // Simulate - would be actual refund amount from escrow
      gasLimit: 100000,
    });

    const receipt = await tx.wait();
    
    const gasUsed = receipt.gasUsed.toString();
    const gasPrice = receipt.effectiveGasPrice.toString();
    const gasCostWei = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const gasCost = (parseInt(gasCostWei.toString()) / 1e18).toFixed(6);

    // Update dispute status
    dispute.status = 'resolved_refund';
    dispute.resolutionTimestamp = Date.now();
    dispute.refundTxHash = receipt.transactionHash;

    const result: RefundResult = {
      success: true,
      disputeId,
      refundAmount: dispute.amount,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      timestamp: Date.now(),
      gasUsed,
      gasCost,
    };

    console.log('✅ Refund processed:', result);
    
    return result;
  }

  /**
   * Get all disputes for a booking
   */
  getBookingDisputes(bookingId: string): DisputeCase[] {
    return Array.from(this.disputes.values())
      .filter(d => d.bookingId === bookingId);
  }

  /**
   * Get dispute statistics
   */
  getDisputeStats() {
    const allDisputes = Array.from(this.disputes.values());
    
    return {
      total: allDisputes.length,
      pending: allDisputes.filter(d => d.status === 'pending').length,
      investigating: allDisputes.filter(d => d.status === 'investigating').length,
      refunded: allDisputes.filter(d => d.status === 'resolved_refund').length,
      released: allDisputes.filter(d => d.status === 'resolved_release').length,
      rejected: allDisputes.filter(d => d.status === 'rejected').length,
    };
  }

  /**
   * Check if milestone should timeout
   */
  shouldTimeout(
    milestoneScheduledTime: number,
    currentTime: number,
    timeoutMinutes: number = 60
  ): boolean {
    const timeoutMs = timeoutMinutes * 60 * 1000;
    return (currentTime - milestoneScheduledTime) > timeoutMs;
  }

  /**
   * Get timeout remaining for milestone
   */
  getTimeoutRemaining(
    milestoneScheduledTime: number,
    currentTime: number,
    timeoutMinutes: number = 60
  ): number {
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const elapsed = currentTime - milestoneScheduledTime;
    const remaining = timeoutMs - elapsed;
    return Math.max(0, remaining);
  }
}

// Singleton instance
let disputeManager: DisputeResolutionManager | null = null;

export function getDisputeResolutionManager(): DisputeResolutionManager {
  if (!disputeManager) {
    disputeManager = new DisputeResolutionManager();
  }
  return disputeManager;
}

/**
 * Helper: Generate dispute reason description in Indonesian
 */
export function getDisputeReasonText(reason: DisputeReason): string {
  switch (reason) {
    case 'service_not_delivered':
      return 'Layanan tidak diterima';
    case 'quality_issue':
      return 'Masalah kualitas layanan';
    case 'timeout_exceeded':
      return 'Waktu tunggu habis';
    case 'iot_verification_failed':
      return 'Verifikasi IoT gagal';
    case 'vendor_unavailable':
      return 'Vendor tidak tersedia';
    default:
      return 'Alasan tidak diketahui';
  }
}
