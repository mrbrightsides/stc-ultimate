'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useSIWE } from '@/contexts/siwe-context';
import { 
  PaymentManager, 
  PaymentParams, 
  PaymentResult,
  validateNetwork,
  switchToSepolia,
  TESTNET_CONFIG,
  ENHANCED_CONTRACTS
} from '@/lib/enhanced-smart-contracts';
import type { TourService, TransactionRecord } from '@/app/types/contracts';

interface EnhancedRealPaymentHandlerProps {
  children: (props: {
    executeRealPayment: (serviceId: number, service: TourService) => Promise<TransactionRecord>;
    isProcessing: boolean;
    lastError: string | null;
    availableStrategies: string[];
    currentStrategy: string | null;
    networkStatus: 'checking' | 'valid' | 'invalid' | 'switching';
  }) => React.ReactNode;
}

export function EnhancedRealPaymentHandler({ children }: EnhancedRealPaymentHandlerProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [availableStrategies, setAvailableStrategies] = useState<string[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'valid' | 'invalid' | 'switching'>('checking');
  const { getProvider, address, refreshBalance } = useSIWE();
  
  const paymentManager = new PaymentManager();

  // Check network and available strategies on mount
  useEffect(() => {
    const checkNetworkAndStrategies = async () => {
      if (!address) {
        setNetworkStatus('invalid');
        return;
      }

      try {
        const provider = getProvider();
        if (!provider) {
          setNetworkStatus('invalid');
          return;
        }

        // Check if we're on Sepolia
        const isValidNetwork = await validateNetwork(provider);
        
        if (!isValidNetwork) {
          setNetworkStatus('invalid');
          toast.warning('Please switch to Sepolia testnet', {
            description: 'Click to switch network automatically',
            action: {
              label: 'Switch to Sepolia',
              onClick: handleNetworkSwitch,
            },
          });
          return;
        }

        setNetworkStatus('valid');
        
        // Get available payment strategies
        const strategies = await paymentManager.getAvailableStrategies();
        setAvailableStrategies(strategies);
        console.log('Available payment strategies:', strategies);
        
        // DirectTransferStrategy should always be available
        toast.success(`TESTNET Payment system ready!`, {
          description: `${strategies.length} payment method${strategies.length > 1 ? 's' : ''} available on Sepolia testnet`,
        });
        
      } catch (error) {
        console.error('Error checking network and strategies:', error);
        setNetworkStatus('invalid');
      }
    };

    if (address) {
      checkNetworkAndStrategies();
    }
  }, [address]);

  const handleNetworkSwitch = async () => {
    setNetworkStatus('switching');
    try {
      const success = await switchToSepolia();
      if (success) {
        setNetworkStatus('valid');
        toast.success('Successfully switched to Sepolia testnet!');
        
        // Refresh strategies after network switch
        const strategies = await paymentManager.getAvailableStrategies();
        setAvailableStrategies(strategies);
      } else {
        setNetworkStatus('invalid');
        toast.error('Failed to switch to Sepolia testnet');
      }
    } catch (error) {
      setNetworkStatus('invalid');
      toast.error('Network switch failed', {
        description: 'Please switch to Sepolia manually in MetaMask'
      });
    }
  };

  const getMerchantAddress = (serviceId: number): string => {
    // Map service IDs to merchant addresses (supporting all 15 milestones)
    // Based on service types from destinations-config.ts
    const merchantMap: Record<number, string> = {
      1: ENHANCED_CONTRACTS.MERCHANTS.FLIGHT,        // Departure Flight
      2: ENHANCED_CONTRACTS.MERCHANTS.FLIGHT,        // Arrival at Destination
      3: ENHANCED_CONTRACTS.MERCHANTS.HOTEL,         // Hotel Check-in
      4: ENHANCED_CONTRACTS.MERCHANTS.TRANSPORT,     // Airport Shuttle
      5: ENHANCED_CONTRACTS.MERCHANTS.RESTAURANT,    // Welcome Dinner
      6: ENHANCED_CONTRACTS.MERCHANTS.RESTAURANT,    // Daily Breakfast
      7: ENHANCED_CONTRACTS.MERCHANTS.RESTAURANT,    // Daily Lunch
      8: ENHANCED_CONTRACTS.MERCHANTS.TRANSPORT,     // Daily Ground Transport
      9: ENHANCED_CONTRACTS.MERCHANTS.ACTIVITY,      // Tourist Activity #1
      10: ENHANCED_CONTRACTS.MERCHANTS.ACTIVITY,     // Tourist Activity #2
      11: ENHANCED_CONTRACTS.MERCHANTS.RESTAURANT,   // Daily Dinner
      12: ENHANCED_CONTRACTS.MERCHANTS.TOUR_GUIDE,   // Souvenir Shopping
      13: ENHANCED_CONTRACTS.MERCHANTS.HOTEL,        // Hotel Checkout
      14: ENHANCED_CONTRACTS.MERCHANTS.TRANSPORT,    // Return Airport Transfer
      15: ENHANCED_CONTRACTS.MERCHANTS.FLIGHT,       // Return Flight
    };
    
    // Return mapped address or fallback to hotel if not found
    return merchantMap[serviceId] || ENHANCED_CONTRACTS.MERCHANTS.HOTEL;
  };

  const validatePayment = (service: TourService): void => {
    if (!address) {
      throw new Error('Wallet not connected');
    }
    
    if (networkStatus !== 'valid') {
      throw new Error('Please switch to Sepolia testnet first');
    }
    
    if (!service.amount || parseFloat(service.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    // DirectTransferStrategy should always be available, so don't block payment
    // The PaymentManager will handle fallback to DirectTransferStrategy
    console.log('Payment validation passed. Available strategies:', availableStrategies);
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
      return 'Gas estimation failed - trying alternative method';
    } else if (error.message?.includes('contract')) {
      return 'Smart contract error - using fallback payment method';
    } else {
      return `Transaction failed: ${error.message || 'Unknown error'}`;
    }
  };

  const executeRealPayment = async (serviceId: number, service: TourService): Promise<TransactionRecord> => {
    try {
      setIsProcessing(true);
      setLastError(null);
      setCurrentStrategy(null);
      
      // Validation
      validatePayment(service);
      
      const provider = getProvider();
      if (!provider) {
        throw new Error('No provider available');
      }
      
      // Check balance before transaction
      const balance = await provider.getBalance(address!);
      const requiredAmount = ethers.utils.parseEther(service.amount);
      const estimatedGas = ethers.utils.parseEther('0.001'); // Estimate gas cost
      
      if (balance.lt(requiredAmount.add(estimatedGas))) {
        throw new Error(`Insufficient balance. Need ${service.amount} ETH + gas fees, but only have ${ethers.utils.formatEther(balance)} ETH`);
      }
      
      // Show processing notification with clear testnet indication
      toast.loading(`Initiating TESTNET payment of ${service.amount} SEP ETH...`, {
        id: 'payment-processing',
        description: 'This is a Sepolia testnet transaction (no real money)'
      });
      
      // Prepare payment parameters
      const paymentParams: PaymentParams = {
        serviceId,
        serviceName: service.name,
        amount: service.amount,
        merchantAddress: getMerchantAddress(serviceId),
        provider,
        userAddress: address!
      };
      
      console.log('Payment params:', {
        serviceId,
        serviceName: service.name,
        amount: service.amount,
        merchantAddress: paymentParams.merchantAddress,
        userAddress: address
      });
      
      // Execute payment with smart strategy selection
      const result: PaymentResult = await paymentManager.executePayment(paymentParams);
      setCurrentStrategy(result.strategy);
      
      toast.loading(`Transaction submitted via ${result.strategy}... waiting for confirmation`, {
        id: 'payment-processing'
      });
      
      // Dismiss loading toast
      toast.dismiss('payment-processing');
      
      // BLOCKCHAIN EVENT TRACKING: Capture real transaction events
      try {
        const { createEventRecord, BlockchainEventStorage } = await import('@/lib/blockchain-event-tracker');
        
        // Get the actual transaction and receipt from the provider
        const tx = await provider.getTransaction(result.txHash);
        const receipt = await provider.getTransactionReceipt(result.txHash);
        
        if (tx && receipt) {
          // Create event record with service metadata
          const eventRecord = await createEventRecord(tx, receipt, {
            serviceId,
            serviceName: service.name,
          });
          
          // Save to storage
          BlockchainEventStorage.save(eventRecord);
          
          console.log('🎯 Blockchain events captured:', {
            txHash: result.txHash,
            events: eventRecord.events.length,
            iotActions: eventRecord.iotActions.length,
          });
          
          // Show IoT notification if actions were triggered
          if (eventRecord.iotActions.length > 0) {
            setTimeout(() => {
              toast.info('IoT Devices Triggered', {
                description: `${eventRecord.iotActions.length} device action(s) triggered by blockchain event`,
              });
            }, 1000);
          }
        }
      } catch (error) {
        console.warn('Failed to capture blockchain events:', error);
      }
      
      // Create transaction record
      const transactionRecord: TransactionRecord = {
        serviceId,
        serviceName: service.name,
        amount: service.amount,
        txHash: result.txHash,
        timestamp: result.timestamp,
        status: 'confirmed',
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        etherscanUrl: result.etherscanUrl
      };
      
      // Refresh wallet balance
      setTimeout(() => {
        refreshBalance();
      }, 2000);
      
      // Calculate and award STC token rewards
      try {
        const { calculateServiceReward } = await import('@/lib/stc-erc20-token');
        const rewardAmount = calculateServiceReward(service.amount);
        
        // Show reward notification
        setTimeout(() => {
          toast.success('STC Tokens Earned! 🎉', {
            description: `You earned ${rewardAmount} STC tokens as reward!`,
          });
        }, 1500);
      } catch (error) {
        console.warn('Failed to calculate token reward:', error);
      }
      
      // Show success notification with strategy info and clear testnet indication
      toast.success(
        `TESTNET Payment successful via ${result.strategy}!`,
        {
          description: `${service.amount} SEP ETH sent (Sepolia testnet) • TX: ${result.txHash.slice(0, 10)}...`,
          action: {
            label: 'View on Sepolia Etherscan',
            onClick: () => window.open(result.etherscanUrl, '_blank'),
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
        action: networkStatus !== 'valid' ? {
          label: 'Switch Network',
          onClick: handleNetworkSwitch,
        } : undefined,
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
      setCurrentStrategy(null);
    }
  };

  return (
    <>
      {children({
        executeRealPayment,
        isProcessing,
        lastError,
        availableStrategies,
        currentStrategy,
        networkStatus,
      })}
    </>
  );
}