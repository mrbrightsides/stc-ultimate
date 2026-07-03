'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, type Address, erc20Abi } from 'viem';
import { toast } from 'sonner';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

// MNEE Token Address on Ethereum Mainnet
const MNEE_ADDRESS = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as const;

interface BookingDetails {
  destination: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: string; // in MNEE (USD equivalent)
}

interface RealMNEETransactionHandlerProps {
  booking: BookingDetails;
  onSuccess: (escrow: TourEscrow, split: RevenueSplit) => void;
  onError: (error: string) => void;
}

/**
 * Real MNEE Transaction Handler using OnchainKit
 * Executes actual on-chain transactions with MNEE stablecoin
 */
export function RealMNEETransactionHandler({
  booking,
  onSuccess,
  onError,
}: RealMNEETransactionHandlerProps) {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stakeholders for revenue split
  const stakeholders = {
    hotel: '0x8ba1f109551bd432803012645aac136c6d2d9b59' as Address,
    tourGuide: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db' as Address,
    platform: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf' as Address,
    treasury: '0x78731d3ca6b7e34ac0f824c42a7cc18a495cabab' as Address,
  };

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  /**
   * Execute real MNEE transfer to hotel address
   * This is a simple transfer for demo - in production, this would use escrow contract
   */
  const handleRealTransaction = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      onError('Wallet not connected');
      return;
    }

    // Check if on correct network (Ethereum Mainnet)
    if (chain?.id !== 1) {
      toast.error('Please switch to Ethereum Mainnet');
      onError('Wrong network - switch to Ethereum Mainnet');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Parse amount in MNEE (18 decimals)
      const amountInWei = parseUnits(booking.totalAmount, 18);
      
      toast.loading('Preparing transaction...', { id: 'mnee-tx' });

      // Execute real MNEE transfer using wagmi with standard ERC-20 ABI
      writeContract({
        address: MNEE_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [stakeholders.hotel, amountInWei],
      });

      // Note: Transaction confirmation is handled by useWaitForTransactionReceipt
      
    } catch (error: any) {
      console.error('Transaction error:', error);
      const errorMessage = error?.message || 'Transaction failed';
      toast.error(errorMessage, { id: 'mnee-tx' });
      onError(errorMessage);
      setIsProcessing(false);
    }
  };

  /**
   * Handle transaction success
   */
  const handleSuccess = (txHash: string) => {
    toast.dismiss('mnee-tx');
    toast.success('Payment successful!', {
      description: `${booking.totalAmount} MNEE transferred`,
      action: {
        label: 'View on Etherscan',
        onClick: () => window.open(`https://etherscan.io/tx/${txHash}`, '_blank'),
      },
    });

    // Create escrow record
    const escrow: TourEscrow = {
      escrowId: Math.random().toString(36).substring(7),
      tourist: address!,
      operator: stakeholders.hotel,
      amount: booking.totalAmount,
      amountUSD: booking.totalAmount,
      status: 2, // Released (direct transfer)
      statusText: 'Released',
      createdAt: Date.now(),
      serviceId: `booking-${Date.now()}`,
      serviceName: `${booking.hotelName} - ${booking.destination}`,
      tokenAddress: MNEE_ADDRESS,
      txHash: txHash,
      releaseTxHash: txHash,
    };

    // Calculate split for record-keeping
    const total = parseFloat(booking.totalAmount);
    const split: RevenueSplit = {
      splitId: Math.random().toString(36).substring(7),
      bookingId: escrow.serviceId,
      creator: address!,
      totalAmount: booking.totalAmount,
      totalAmountUSD: booking.totalAmount,
      recipients: [
        { 
          address: stakeholders.hotel, 
          name: 'Hotel', 
          role: 'Accommodation Provider',
          percentage: 70,
          amount: (total * 0.70).toFixed(2),
          amountUSD: (total * 0.70).toFixed(2),
        },
        { 
          address: stakeholders.tourGuide, 
          name: 'Tour Guide', 
          role: 'Guide Service',
          percentage: 15,
          amount: (total * 0.15).toFixed(2),
          amountUSD: (total * 0.15).toFixed(2),
        },
        { 
          address: stakeholders.platform, 
          name: 'Platform', 
          role: 'Service Fee',
          percentage: 10,
          amount: (total * 0.10).toFixed(2),
          amountUSD: (total * 0.10).toFixed(2),
        },
        { 
          address: stakeholders.treasury, 
          name: 'Treasury', 
          role: 'Platform Treasury',
          percentage: 5,
          amount: (total * 0.05).toFixed(2),
          amountUSD: (total * 0.05).toFixed(2),
        },
      ],
      status: 1, // Executed
      statusText: 'Executed',
      createdAt: Date.now(),
      executedAt: Date.now(),
      txHash: txHash,
      executeTxHash: txHash,
    };

    // Notify parent
    onSuccess(escrow, split);
    setIsProcessing(false);
  };

  /**
   * Handle transaction confirmed - wrapped in useEffect to prevent React errors
   */
  useEffect(() => {
    if (isConfirmed && txHash) {
      handleSuccess(txHash);
    }
  }, [isConfirmed, txHash]);

  /**
   * Handle write error - wrapped in useEffect with user rejection detection
   */
  useEffect(() => {
    if (writeError) {
      // Check if user rejected the transaction
      const errorMessage = writeError.message || '';
      const isUserRejection = 
        errorMessage.includes('User rejected') || 
        errorMessage.includes('User denied') ||
        errorMessage.includes('rejected the request') ||
        errorMessage.includes('denied transaction');

      if (isUserRejection) {
        // User cancelled - show friendly message
        toast.dismiss('mnee-tx');
        toast.info('Transaction cancelled', {
          description: 'You cancelled the transaction. No gas fees were charged.',
        });
        onError('Transaction cancelled by user');
      } else {
        // Other error - show error message
        toast.error(errorMessage || 'Transaction failed', { id: 'mnee-tx' });
        onError(errorMessage || 'Transaction failed');
      }
      
      setIsProcessing(false);
    }
  }, [writeError]);

  return (
    <div className="space-y-4">
      {/* Transaction Status */}
      {isProcessing && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-400 text-sm font-medium">
            {isConfirming ? '⏳ Confirming transaction on-chain...' : '📝 Preparing transaction...'}
          </p>
        </div>
      )}

      {/* Error Display */}
      {writeError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm font-medium">
            ❌ {writeError.message}
          </p>
        </div>
      )}

      {/* Transaction Button */}
      <button
        onClick={handleRealTransaction}
        disabled={!isConnected || isProcessing || !address || chain?.id !== 1}
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white font-semibold hover:from-purple-600 hover:to-pink-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                   shadow-lg hover:shadow-xl"
      >
        {!isConnected ? 'Connect Wallet' :
         chain?.id !== 1 ? 'Switch to Ethereum Mainnet' :
         isProcessing ? 'Processing...' : 
         `Pay ${booking.totalAmount} MNEE`}
      </button>

      {/* Network Warning */}
      {isConnected && chain?.id !== 1 && (
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <p className="text-orange-400 text-xs">
            ⚠️ Please switch to <strong>Ethereum Mainnet</strong> to use real MNEE tokens
          </p>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 text-xs font-medium">
            ✅ Transaction Hash: 
            <a 
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline hover:text-green-300"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
