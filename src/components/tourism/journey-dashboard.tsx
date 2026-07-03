'use client';

import { useState, useCallback, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton, ServiceLoadingCard } from '@/components/ui/loading-skeleton';
import { EnhancedError } from '@/components/ui/enhanced-error';
import { IoTSimulation } from '@/components/iot/iot-simulation';
import { EnhancedRealPaymentHandler } from '@/components/enhanced-real-payment-handler';
import { TransactionSuccess } from '@/components/transaction-success';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { useSIWE } from '@/contexts/siwe-context';
import { toast } from 'sonner';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Trophy,
  Wallet,
  Plane,
  Hotel,
  Car,
  Utensils,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { TourPackage, TourService } from '@/app/types/contracts';

interface JourneyDashboardProps {
  tourPackage: TourPackage;
  onServiceTrigger: (serviceId: number, txHash?: string) => void;
  onFinalizeTour: () => void;
  walletConnected: boolean;
}

interface TransactionProgress {
  serviceId: number;
  stage: 'iot' | 'payment' | 'confirmation' | 'completed';
  progress: number;
  message: string;
  txHash?: string;
  gasUsed?: string;
  blockNumber?: number;
}

interface ServiceError {
  serviceId: number;
  error: string;
  type: 'network' | 'contract' | 'wallet' | 'validation';
}

const getServiceIcon = (iconName: string) => {
  const icons = {
    'plane': Plane,
    'hotel': Hotel,
    'car': Car,
    'utensils': Utensils,
    'shopping-bag': ShoppingBag,
  };
  return icons[iconName as keyof typeof icons] || Car;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'border-orange-500/50 bg-orange-500/10 text-orange-300';
    case 'active':
      return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300';
    case 'completed':
      return 'border-green-500/50 bg-green-500/10 text-green-300';
    default:
      return 'border-gray-500/50 bg-gray-500/10 text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <AlertCircle className="h-4 w-4" />;
    case 'active':
      return <Play className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function JourneyDashboard({ 
  tourPackage, 
  onServiceTrigger, 
  onFinalizeTour, 
  walletConnected 
}: JourneyDashboardProps) {
  const [triggeringService, setTriggeringService] = useState<number | null>(null);
  const [iotActiveService, setIoTActiveService] = useState<number | null>(null);
  const [serviceErrors, setServiceErrors] = useState<ServiceError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionProgress, setTransactionProgress] = useState<Record<number, TransactionProgress>>({});
  const [completedTransactions, setCompletedTransactions] = useState<Record<number, any>>({});
  const [showTransactionSuccess, setShowTransactionSuccess] = useState<number | null>(null);
  const { ethToUsd } = useCurrencyConverter();
  const { address, balance, refreshBalance } = useSIWE();
  
  // Real-time balance monitoring
  useEffect(() => {
    if (address && Object.keys(transactionProgress).length > 0) {
      const interval = setInterval(refreshBalance, 3000);
      return () => clearInterval(interval);
    }
  }, [address, transactionProgress, refreshBalance]);

  const completedServices = tourPackage.services.filter(s => s.status === 'completed').length;
  const totalServices = tourPackage.services.length;
  const progress = (completedServices / totalServices) * 100;
  const isCompleted = completedServices === totalServices;

  const handleServiceTrigger = async (serviceId: number): Promise<void> => {
    const service = tourPackage.services.find(s => s.id === serviceId);
    if (!service) return;
    
    try {
      setTriggeringService(serviceId);
      setServiceErrors(prev => prev.filter(error => error.serviceId !== serviceId));
      
      // Initialize transaction progress
      setTransactionProgress(prev => ({
        ...prev,
        [serviceId]: {
          serviceId,
          stage: 'iot',
          progress: 0,
          message: 'Starting IoT device connection...'
        }
      }));
      
      // Start IoT simulation
      setIoTActiveService(serviceId);
      
    } catch (error) {
      setServiceErrors(prev => [...prev, {
        serviceId,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'network'
      }]);
      setTriggeringService(null);
      setIoTActiveService(null);
      setTransactionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[serviceId];
        return newProgress;
      });
    }
  };

  const handleIoTComplete = useCallback(async (): Promise<void> => {
    if (!iotActiveService) return;
    
    const service = tourPackage.services.find(s => s.id === iotActiveService);
    if (!service) return;
    
    try {
      // Update progress to payment stage
      setTransactionProgress(prev => ({
        ...prev,
        [iotActiveService]: {
          ...prev[iotActiveService],
          stage: 'payment',
          progress: 30,
          message: 'IoT validation complete. Initiating blockchain payment...'
        }
      }));
      
      // Short delay before payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // The payment will be handled by the RealPaymentHandler component
      setIoTActiveService(null);
      
    } catch (error) {
      console.error('IoT completion error:', error);
      setTransactionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[iotActiveService];
        return newProgress;
      });
      setTriggeringService(null);
      setIoTActiveService(null);
    }
  }, [iotActiveService, tourPackage.services]);

  const retryServiceTrigger = (serviceId: number): void => {
    setServiceErrors(prev => prev.filter(error => error.serviceId !== serviceId));
    handleServiceTrigger(serviceId);
  };

  const getServiceTypeForIoT = (service: TourService): string => {
    const iconToType: Record<string, string> = {
      'plane': 'flight',
      'hotel': 'hotel',
      'car': 'transport',
      'utensils': 'restaurant',
      'shopping-bag': 'shopping'
    };
    return iconToType[service.icon] || 'transport';
  };

  const getTotalPaid = (): string => {
    return tourPackage.services
      .filter(s => s.status === 'completed')
      .reduce((sum, service) => sum + parseFloat(service.amount), 0)
      .toFixed(2);
  };

  const getRemainingAmount = (): string => {
    const total = parseFloat(tourPackage.totalAmount);
    const paid = parseFloat(getTotalPaid());
    return (total - paid).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Journey Dashboard
        </h2>
        <div className="flex items-center justify-center gap-6 text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>{tourPackage.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span>{tourPackage.startDate} - {tourPackage.endDate}</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <NeonCard glowColor="green" intense={isCompleted}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Trophy className="h-6 w-6 text-green-400" />
              Journey Progress
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-400">
                {completedServices}/{totalServices}
              </p>
              <p className="text-sm text-gray-400">Services Completed</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Overall Progress</span>
              <span className="text-green-400 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-cyan-500"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-green-500/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{getTotalPaid()} ETH</p>
              <p className="text-xs text-cyan-300">{ethToUsd(getTotalPaid())}</p>
              <p className="text-sm text-gray-400">Total Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{getRemainingAmount()} ETH</p>
              <p className="text-xs text-orange-300">{ethToUsd(getRemainingAmount())}</p>
              <p className="text-sm text-gray-400">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{tourPackage.totalAmount} ETH</p>
              <p className="text-xs text-purple-300">{ethToUsd(tourPackage.totalAmount)}</p>
              <p className="text-sm text-gray-400">Package Total</p>
            </div>
          </div>

          {isCompleted && (
            <div className="pt-4 border-t border-green-500/20">
              <NeonButton
                variant="success"
                size="lg"
                onClick={onFinalizeTour}
                className="w-full"
              >
                <Trophy className="h-5 w-5" />
                Finalize Journey & Claim Rewards
              </NeonButton>
            </div>
          )}
        </div>
      </NeonCard>

      {/* Services Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {tourPackage.services.map((service, index) => {
          const IconComponent = getServiceIcon(service.icon);
          const isTriggering = triggeringService === service.id;
          const isIoTActive = iotActiveService === service.id;
          const canTrigger = service.status === 'pending' && walletConnected;
          const serviceError = serviceErrors.find(error => error.serviceId === service.id);

          return (
            <div key={service.id} className="space-y-4">
              {/* Main Service Card */}
              <NeonCard 
                glowColor={service.status === 'completed' ? 'green' : service.status === 'active' ? 'cyan' : 'orange'}
                className="transition-all duration-500"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-black/50">
                        <IconComponent className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(service.status)} flex items-center gap-2`}>
                      {getStatusIcon(service.status)}
                      {service.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Service Fee</p>
                      <p className="text-lg font-bold text-cyan-400">{service.amount} ETH</p>
                      <p className="text-xs text-cyan-300">{ethToUsd(service.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Merchant</p>
                      <p className="text-sm text-purple-400 font-mono">
                        {service.merchant.slice(0, 6)}...{service.merchant.slice(-4)}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Progress */}
                  {transactionProgress[service.id] && (
                    <div className="space-y-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-300">
                          {transactionProgress[service.id].message}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                          {transactionProgress[service.id].stage.toUpperCase()}
                        </Badge>
                      </div>
                      <Progress 
                        value={transactionProgress[service.id].progress} 
                        className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
                      />
                      {transactionProgress[service.id].txHash && (
                        <p className="text-xs text-blue-400 font-mono">
                          TX: {transactionProgress[service.id].txHash?.slice(0, 10)}...
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {(canTrigger && !serviceError && (!transactionProgress[service.id] || transactionProgress[service.id]?.stage === 'payment')) && (
                    <EnhancedRealPaymentHandler>
                      {({ executeRealPayment, isProcessing, lastError, availableStrategies, networkStatus }) => {
                        const currentProgress = transactionProgress[service.id];
                        
                        const startService = async () => {
                          try {
                            await handleServiceTrigger(service.id);
                          } catch (error) {
                            console.error('Service trigger error:', error);
                          }
                        };
                        
                        const executePayment = async () => {
                          try {
                            setTransactionProgress(prev => ({
                              ...prev,
                              [service.id]: {
                                ...prev[service.id],
                                stage: 'payment',
                                progress: 50,
                                message: 'Processing blockchain payment...'
                              }
                            }));
                            
                            const txRecord = await executeRealPayment(service.id, service);
                            
                            // Update progress to confirmation stage
                            setTransactionProgress(prev => ({
                              ...prev,
                              [service.id]: {
                                ...prev[service.id],
                                stage: 'confirmation',
                                progress: 80,
                                message: 'Waiting for blockchain confirmation...',
                                txHash: txRecord.txHash,
                                gasUsed: txRecord.gasUsed,
                                blockNumber: txRecord.blockNumber
                              }
                            }));
                            
                            // Complete transaction
                            setTimeout(() => {
                              setTransactionProgress(prev => ({
                                ...prev,
                                [service.id]: {
                                  ...prev[service.id],
                                  stage: 'completed',
                                  progress: 100,
                                  message: 'Payment confirmed! Service activated.'
                                }
                              }));
                              
                              setCompletedTransactions(prev => ({
                                ...prev,
                                [service.id]: txRecord
                              }));
                              
                              // Show success modal
                              setShowTransactionSuccess(service.id);
                              
                              // Call the parent callback
                              onServiceTrigger(service.id, txRecord.txHash);
                              
                              // Clean up
                              setTimeout(() => {
                                setTransactionProgress(prev => {
                                  const newProgress = { ...prev };
                                  delete newProgress[service.id];
                                  return newProgress;
                                });
                                setTriggeringService(null);
                              }, 3000);
                              
                            }, 2000);
                            
                          } catch (error) {
                            console.error('Payment execution error:', error);
                            setTransactionProgress(prev => {
                              const newProgress = { ...prev };
                              delete newProgress[service.id];
                              return newProgress;
                            });
                            setTriggeringService(null);
                          }
                        };
                        
                        // Different button states based on current stage
                        if (currentProgress?.stage === 'payment') {
                          return (
                            <NeonButton
                              variant="primary"
                              className="w-full bg-green-500/20 border-green-500/50 hover:bg-green-500/30"
                              loading={isProcessing}
                              disabled={isProcessing}
                              onClick={executePayment}
                            >
                              <Wallet className="h-4 w-4 mr-2" />
                              {isProcessing ? 'Processing Payment...' : `Pay ${service.amount} ETH`}
                            </NeonButton>
                          );
                        }
                        
                        return (
                          <NeonButton
                            variant="primary"
                            className="w-full"
                            loading={isTriggering}
                            disabled={isTriggering || isIoTActive}
                            onClick={startService}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            {isTriggering ? 'Activating IoT...' : `Activate ${service.name}`}
                          </NeonButton>
                        );
                      }}
                    </EnhancedRealPaymentHandler>
                  )}

                  {/* Error Handling */}
                  {serviceError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-red-300 font-medium">Service Error</p>
                          <p className="text-xs text-red-400 mt-1">{serviceError.error}</p>
                        </div>
                        <NeonButton
                          size="sm"
                          variant="secondary"
                          onClick={() => retryServiceTrigger(service.id)}
                        >
                          Retry
                        </NeonButton>
                      </div>
                    </div>
                  )}

                  {!walletConnected && service.status === 'pending' && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <Wallet className="h-4 w-4 text-orange-400" />
                      <p className="text-sm text-orange-300">Connect wallet to trigger services</p>
                    </div>
                  )}

                  {service.status === 'completed' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <div className="flex-1">
                          <p className="text-sm text-green-300 font-medium">
                            Payment completed! {service.amount} ETH sent to merchant.
                          </p>
                          <p className="text-xs text-green-400 mt-1">
                            USD Value: {ethToUsd(service.amount)}
                          </p>
                        </div>
                      </div>
                      
                      {completedTransactions[service.id] && (
                        <div className="p-3 rounded-lg bg-black/30 border border-green-500/30">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Transaction Hash</span>
                              <NeonButton
                                size="sm"
                                variant="secondary"
                                onClick={() => setShowTransactionSuccess(service.id)}
                              >
                                View Details
                              </NeonButton>
                            </div>
                            <p className="text-xs text-green-400 font-mono break-all">
                              {completedTransactions[service.id].txHash}
                            </p>
                            <div className="flex justify-between text-xs">
                              {completedTransactions[service.id].blockNumber && (
                                <span className="text-gray-400">
                                  Block: #{completedTransactions[service.id].blockNumber}
                                </span>
                              )}
                              {completedTransactions[service.id].gasUsed && (
                                <span className="text-gray-400">
                                  Gas: {completedTransactions[service.id].gasUsed}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </NeonCard>

              {/* IoT Simulation Card */}
              <IoTSimulation
                serviceName={service.name}
                serviceType={getServiceTypeForIoT(service)}
                onComplete={handleIoTComplete}
                isActive={isIoTActive}
              />
            </div>
          );
        })}
      </div>

      {/* Contract Information */}
      <NeonCard glowColor="purple" className="text-center">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Smart Contract Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Package Contract</p>
              <p className="text-sm text-purple-400 font-mono break-all">
                {tourPackage.contractAddress || 'Not deployed yet'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-sm text-cyan-400">Sepolia Testnet</p>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Transaction Success Modal */}
      {showTransactionSuccess && completedTransactions[showTransactionSuccess] && (() => {
        const service = tourPackage.services.find(s => s.id === showTransactionSuccess);
        const txData = completedTransactions[showTransactionSuccess];
        
        return service && txData ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="max-w-lg w-full mx-4">
              <TransactionSuccess
                txHash={txData.txHash}
                serviceAmount={service.amount}
                serviceName={service.name}
                blockNumber={txData.blockNumber}
                gasUsed={txData.gasUsed}
                onDismiss={() => setShowTransactionSuccess(null)}
              />
            </div>
          </div>
        ) : null;
      })()}

      {/* Real-time Balance Display */}
      {walletConnected && balance && (
        <div className="fixed bottom-6 right-6 z-40">
          <NeonCard glowColor="cyan" className="p-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Current Balance</p>
                <p className="text-lg font-bold text-cyan-400">{balance} ETH</p>
                <p className="text-xs text-cyan-300">{ethToUsd(balance)}</p>
              </div>
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}