/**
 * Phase 1: Enhanced Smart Contract System
 * Booking, Payment, and Audit Trail Contracts
 */

import { ethers } from 'ethers';

// Booking Contract ABI
export const BOOKING_CONTRACT_ABI = [
  'event BookingCreated(uint256 indexed bookingId, address indexed tourist, string destination, uint256 totalAmount, uint256 timestamp)',
  'event BookingConfirmed(uint256 indexed bookingId, uint256 timestamp)',
  'event BookingCancelled(uint256 indexed bookingId, uint256 refundAmount, uint256 timestamp)',
  'function createBooking(string memory destination, uint256 serviceCount) external payable returns (uint256)',
  'function confirmBooking(uint256 bookingId) external',
  'function cancelBooking(uint256 bookingId) external',
  'function getBooking(uint256 bookingId) external view returns (address, string, uint256, uint256, uint8)'
];

// Payment Contract ABI
export const PAYMENT_CONTRACT_ABI = [
  'event PaymentProcessed(uint256 indexed paymentId, address indexed from, address indexed to, uint256 amount, uint256 timestamp)',
  'event PaymentRefunded(uint256 indexed paymentId, uint256 refundAmount, uint256 timestamp)',
  'function processPayment(address merchant, uint256 bookingId) external payable returns (uint256)',
  'function refundPayment(uint256 paymentId) external',
  'function getPaymentStatus(uint256 paymentId) external view returns (uint8, uint256, uint256)'
];

// Audit Trail Contract ABI
export const AUDIT_CONTRACT_ABI = [
  'event AuditLogCreated(uint256 indexed logId, string action, address indexed actor, uint256 timestamp, bytes32 dataHash)',
  'function logAction(string memory action, bytes32 dataHash) external returns (uint256)',
  'function getAuditLog(uint256 logId) external view returns (string, address, uint256, bytes32)',
  'function getAuditCount() external view returns (uint256)'
];

// Contract Addresses (Sepolia Testnet)
export const PHASE1_CONTRACTS = {
  BOOKING: '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613',
  PAYMENT: '0xA7C8d5F6E9B4D3C2A1F8E7D6C5B4A3F2E1D9C8B7',
  AUDIT: '0xF8E7D6C5B4A3F2E1D9C8B7A6F5E4D3C2B1A9F8E7'
};

export interface BookingData {
  id: number;
  tourist: string;
  destination: string;
  totalAmount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  txHash?: string;
}

export interface PaymentData {
  id: number;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'processed' | 'refunded';
  txHash?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  actor: string;
  timestamp: number;
  dataHash: string;
  txHash?: string;
}

/**
 * Create a new booking on the blockchain
 */
export async function createBooking(
  provider: ethers.providers.Web3Provider,
  destination: string,
  serviceCount: number,
  totalAmount: string
): Promise<{ success: boolean; bookingId?: number; txHash?: string; error?: string }> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      PHASE1_CONTRACTS.BOOKING,
      BOOKING_CONTRACT_ABI,
      signer
    );

    const amountInWei = ethers.utils.parseEther(totalAmount);
    const tx = await contract.createBooking(destination, serviceCount, {
      value: amountInWei,
      gasLimit: 300000
    });

    const receipt = await tx.wait();
    
    // Extract bookingId from event logs
    const event = receipt.events?.find((e: any) => e.event === 'BookingCreated');
    const bookingId = event?.args?.bookingId?.toNumber();

    return {
      success: true,
      bookingId,
      txHash: receipt.transactionHash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Booking creation failed'
    };
  }
}

/**
 * Process a payment to a merchant
 */
export async function processPayment(
  provider: ethers.providers.Web3Provider,
  merchantAddress: string,
  bookingId: number,
  amount: string
): Promise<{ success: boolean; paymentId?: number; txHash?: string; error?: string }> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      PHASE1_CONTRACTS.PAYMENT,
      PAYMENT_CONTRACT_ABI,
      signer
    );

    const amountInWei = ethers.utils.parseEther(amount);
    const tx = await contract.processPayment(merchantAddress, bookingId, {
      value: amountInWei,
      gasLimit: 250000
    });

    const receipt = await tx.wait();
    
    const event = receipt.events?.find((e: any) => e.event === 'PaymentProcessed');
    const paymentId = event?.args?.paymentId?.toNumber();

    return {
      success: true,
      paymentId,
      txHash: receipt.transactionHash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
}

/**
 * Log an action to the audit trail
 */
export async function logAuditAction(
  provider: ethers.providers.Web3Provider,
  action: string,
  data?: any
): Promise<{ success: boolean; logId?: number; txHash?: string; error?: string }> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      PHASE1_CONTRACTS.AUDIT,
      AUDIT_CONTRACT_ABI,
      signer
    );

    // Create data hash
    const dataHash = data 
      ? ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(data)))
      : ethers.constants.HashZero;

    const tx = await contract.logAction(action, dataHash, {
      gasLimit: 150000
    });

    const receipt = await tx.wait();
    
    const event = receipt.events?.find((e: any) => e.event === 'AuditLogCreated');
    const logId = event?.args?.logId?.toNumber();

    return {
      success: true,
      logId,
      txHash: receipt.transactionHash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Audit logging failed'
    };
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
  bookingId: number
): Promise<BookingData | null> {
  try {
    const contract = new ethers.Contract(
      PHASE1_CONTRACTS.BOOKING,
      BOOKING_CONTRACT_ABI,
      provider
    );

    const result = await contract.getBooking(bookingId);
    
    return {
      id: bookingId,
      tourist: result[0],
      destination: result[1],
      totalAmount: ethers.utils.formatEther(result[2]),
      timestamp: result[3].toNumber(),
      status: ['pending', 'confirmed', 'cancelled'][result[4]] as any
    };
  } catch (error) {
    console.error('Failed to get booking details:', error);
    return null;
  }
}

/**
 * Get audit log count
 */
export async function getAuditLogCount(
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
): Promise<number> {
  try {
    const contract = new ethers.Contract(
      PHASE1_CONTRACTS.AUDIT,
      AUDIT_CONTRACT_ABI,
      provider
    );

    const count = await contract.getAuditCount();
    return count.toNumber();
  } catch (error) {
    console.error('Failed to get audit count:', error);
    return 0;
  }
}
