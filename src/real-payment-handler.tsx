'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { CONTRACTS, TOUR_PACKAGE_ESCROW_ABI } from '@/app/types/contracts';
import { useSIWE } from '@/contexts/siwe-context';
import type { TourService, TransactionRecord } from '@/app/types/contracts';

interface RealPaymentHandlerProps {
  children: (props: {
    executeRealPayment: (serviceId: number, service: TourService) => Promise<TransactionRecord>;
    isProcessing: boolean;
    lastError: string | null;
  }) => React.ReactNode;
}

interface PaymentResult {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  timestamp: number;
}

export function RealPaymentHandler({ children }: RealPaymentHandlerProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { getProvider, address, refreshBalance } = useSIWE();

  const validatePayment = (service: TourService): void => {
    if (!address) {
      throw new Error('Wallet not connected');
    }
    
    if (!service.amount || parseFloat(service.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    if (!service.merchant || !ethers.utils.isAddress(service.merchant)) {
      throw new Error('Invalid merchant address');
    }
  };

  const handleTransactionError = (error: any): string => {
    console.error('Transaction error:', error);
    
    if (error.code === 4001) {
      return 'Transaction was rejected by user';
    } else if (error.code === -32603) {
      return 'Insufficient funds for gas fee';
    } else if (error.message?.includes('insufficient funds')) {
      return 'Insufficient ETH balance for transaction';
    } else if (error.message?.includes('network')) {
      return 'Network connection failed - please try again';
    } else if (error.message?.includes('gas')) {
      return 'Gas estimation failed - transaction may fail';
    } else {
      return `Transaction failed: ${error.message || 'Unknown error'}`;
    }
  };

  const executeRealPayment = async (serviceId: number, service: TourService): Promise<TransactionRecord> => {
    try {
      setIsProcessing(true);
      setLastError(null);
      
      // Validation
      validatePayment(service);
      
      const provider = getProvider();
      if (!provider) {
        throw new Error('No provider available');
      }
      
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACTS.TOUR_PACKAGE_ESCROW,
        TOUR_PACKAGE_ESCROW_ABI,
        signer
      );
      
      // Convert ETH amount to Wei
      const amountInWei = ethers.utils.parseEther(service.amount);
      
      // Estimate gas to check if transaction will succeed
      try {
        const gasEstimate = await contract.estimateGas.completeActivity(serviceId - 1, {
          value: amountInWei,
        });
        
        console.log(`Gas estimate: ${gasEstimate.toString()}`);
      } catch (gasError) {
        throw new Error('Transaction will likely fail - insufficient balance or contract error');
      }
      
      // Show processing notification
      toast.loading(`Processing payment of ${service.amount} ETH...`, {
        id: 'payment-processing'
      });
      
      // Execute the real blockchain transaction
      const tx = await contract.completeActivity(serviceId - 1, {
        value: amountInWei,
        gasLimit: 200000, // Set a reasonable gas limit
      });
      
      toast.loading(`Transaction submitted... waiting for confirmation`, {
        id: 'payment-processing'
      });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Dismiss loading toast
      toast.dismiss('payment-processing');
      
      if (receipt.status !== 1) {
        throw new Error('Transaction failed during execution');
      }
      
      // Create transaction record
      const transactionRecord: TransactionRecord = {
        serviceId,
        serviceName: service.name,
        amount: service.amount,
        txHash: tx.hash,
        timestamp: Date.now(),
        status: 'confirmed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
      };
      
      // Refresh wallet balance
      setTimeout(() => {
        refreshBalance();
      }, 2000);
      
      // Show success notification
      toast.success(
        `Payment successful! ${service.amount} ETH sent to merchant.`,
        {
          description: `Transaction: ${tx.hash.slice(0, 10)}...`,
          action: {
            label: 'View on Etherscan',
            onClick: () => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, '_blank'),
          },
        }
      );
      
      return transactionRecord;
      
    } catch (error: any) {
      const errorMessage = handleTransactionError(error);
      setLastError(errorMessage);
      
      toast.dismiss('payment-processing');
      toast.error('Payment Failed', {
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {children({
        executeRealPayment,
        isProcessing,
        lastError,
      })}
    </>
  );
}