'use client';

import { useState, useCallback } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IoTSimulation } from '@/components/iot/iot-simulation';
import { RealPaymentHandler } from '@/components/real-payment-handler';
import { TransactionSuccess } from '@/components/transaction-success';
import { EnhancedTransactionFlow } from '@/components/enhanced-transaction-flow';
import { ComprehensiveRewards } from '@/components/comprehensive-rewards';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { useSIWE } from '@/contexts/siwe-context';
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
  ExternalLink,
  Zap,
  Activity,
  DollarSign,
  Sparkles,
  Award,
  Users,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import type { TourPackage, TourService, TransactionRecord } from '@/app/types/contracts';

interface EnhancedJourneyDashboardProps {
  tourPackage: TourPackage;
  onServiceTrigger: (serviceId: number, txHash?: string) => void;
  onFinalizeTour: () => void;
  walletConnected: boolean;
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

export function EnhancedJourneyDashboard({ 
  tourPackage, 
  onServiceTrigger, 
  onFinalizeTour, 
  walletConnected 
}: EnhancedJourneyDashboardProps) {
  const [triggeringService, setTriggeringService] = useState<number | null>(null);
  const [iotActiveService, setIoTActiveService] = useState<number | null>(null);
  const [serviceErrors, setServiceErrors] = useState<ServiceError[]>([]);
  const [successfulTransactions, setSuccessfulTransactions] = useState<Map<number, TransactionRecord>>(new Map());
  const [showTransactionSuccess, setShowTransactionSuccess] = useState<number | null>(null);
  const [showRewards, setShowRewards] = useState<boolean>(false);
  const [enhancedTransactionActive, setEnhancedTransactionActive] = useState<number | null>(null);
  const { ethToUsd } = useCurrencyConverter();
  const { balance, refreshBalance } = useSIWE();

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
      
      // Start IoT simulation first
      setIoTActiveService(serviceId);
      
      // Wait for IoT completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      setServiceErrors(prev => [...prev, {
        serviceId,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'network'
      }]);
      setTriggeringService(null);
      setIoTActiveService(null);
    }
  };

  const handleIoTComplete = useCallback(async (): Promise<void> => {
    // IoT simulation complete - trigger will continue with real payment
    setIoTActiveService(null);
  }, []);

  const handlePaymentSuccess = (serviceId: number, transactionRecord: TransactionRecord): void => {
    setSuccessfulTransactions(prev => new Map(prev).set(serviceId, transactionRecord));
    setShowTransactionSuccess(serviceId);
    onServiceTrigger(serviceId, transactionRecord.txHash);
    setTriggeringService(null);
    
    // Refresh balance after successful payment
    setTimeout(refreshBalance, 2000);
  };

  const handlePaymentError = (serviceId: number, error: string): void => {
    setServiceErrors(prev => [...prev, {
      serviceId,
      error,
      type: 'contract'
    }]);
    setTriggeringService(null);
  };

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
      .toFixed(4);
  };

  const getRemainingAmount = (): string => {
    const total = parseFloat(tourPackage.totalAmount);
    const paid = parseFloat(getTotalPaid());
    return (total - paid).toFixed(4);
  };

  return (
    <RealPaymentHandler>
      {({ executeRealPayment, isProcessing }) => (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Show Transaction Success Modal */}
          {showTransactionSuccess && (() => {
            const service = tourPackage.services.find(s => s.id === showTransactionSuccess);
            const transaction = successfulTransactions.get(showTransactionSuccess);
            
            if (!service || !transaction) return null;
            
            return (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <TransactionSuccess
                  txHash={transaction.txHash}
                  serviceAmount={transaction.amount}
                  serviceName={transaction.serviceName}
                  blockNumber={transaction.blockNumber}
                  gasUsed={transaction.gasUsed}
                  onDismiss={() => setShowTransactionSuccess(null)}
                />
              </div>
            );
          })()}

          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Real Payment Journey Dashboard
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
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-green-400" />
                <span>{balance} ETH Available</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <NeonCard glowColor="green" intense={isCompleted}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-green-400" />
                  Real Payment Progress
                </h3>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">
                    {completedServices}/{totalServices}
                  </p>
                  <p className="text-sm text-gray-400">Blockchain Payments</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Payment Progress</span>
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
                  <p className="text-sm text-gray-400">Paid via Blockchain</p>
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
                    onClick={() => setShowRewards(true)}
                    className="w-full"
                  >
                    <Trophy className="h-5 w-5" />
                    View Comprehensive Rewards
                  </NeonButton>
                </div>
              )}
            </div>
          </NeonCard>

          {/* Contextual Integration Widgets - HCPS Tourism 5.0 */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* AI Suggestions Widget */}
            <NeonCard glowColor="purple" className="hover:scale-105 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                    HCPS 5.0
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-400">
                  Get personalized recommendations for your {tourPackage.destination} journey
                </p>
                
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-xs text-purple-300">💡 Best time to visit Temple: 8-10 AM</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-xs text-purple-300">🍽️ Local cuisine recommendation nearby</p>
                  </div>
                </div>
                
                <NeonButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/?role=tourist&hub=ai-trip-planner'}
                >
                  Open AI Trip Planner
                  <ArrowRight className="h-3 w-3 ml-2" />
                </NeonButton>
              </div>
            </NeonCard>

            {/* NFT Achievements Widget */}
            <NeonCard glowColor="cyan" className="hover:scale-105 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">NFT Progress</h3>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-xs">
                    HCPS 5.0
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-400">
                  Track your blockchain achievements
                </p>
                
                <div className="flex items-center justify-center py-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">
                      {completedServices}
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-cyan-300">
                  {completedServices} / {totalServices} NFTs earned
                </p>
                
                <NeonButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/?role=tourist&hub=nft-gallery'}
                >
                  View NFT Gallery
                  <ArrowRight className="h-3 w-3 ml-2" />
                </NeonButton>
              </div>
            </NeonCard>

            {/* Group Collaboration Widget */}
            <NeonCard glowColor="green" className="hover:scale-105 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Group Planning</h3>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                    HCPS 5.0
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-400">
                  Collaborate with friends on this journey
                </p>
                
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-xs text-green-300 font-medium">Real-time Chat Available</p>
                    <p className="text-xs text-gray-400">Plan together with your group</p>
                  </div>
                </div>
                
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white">
                    +3
                  </div>
                </div>
                
                <NeonButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/?role=tourist&hub=collaboration'}
                >
                  Join Collaboration
                  <ArrowRight className="h-3 w-3 ml-2" />
                </NeonButton>
              </div>
            </NeonCard>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {tourPackage.services.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon);
              const isTriggering = triggeringService === service.id;
              const isIoTActive = iotActiveService === service.id;
              const canTrigger = service.status === 'pending' && walletConnected;
              const serviceError = serviceErrors.find(error => error.serviceId === service.id);
              const transaction = successfulTransactions.get(service.id);

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
                          <p className="text-sm text-gray-400">Real Payment</p>
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

                      {/* Action Buttons */}
                      {canTrigger && !serviceError && (
                        <NeonButton
                          variant="primary"
                          className="w-full"
                          loading={isTriggering || isProcessing}
                          disabled={isTriggering || isIoTActive || isProcessing}
                          onClick={async () => {
                            await handleServiceTrigger(service.id);
                            if (!iotActiveService) {
                              try {
                                const transactionRecord = await executeRealPayment(service.id, service);
                                handlePaymentSuccess(service.id, transactionRecord);
                              } catch (error) {
                                handlePaymentError(service.id, error instanceof Error ? error.message : 'Payment failed');
                              }
                            }
                          }}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {isTriggering ? 'Processing IoT...' : isProcessing ? 'Processing Payment...' : `Pay ${service.amount} ETH`}
                        </NeonButton>
                      )}

                      {/* Error Handling */}
                      {serviceError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-red-300 font-medium">Payment Error</p>
                              <p className="text-xs text-red-400 mt-1">{serviceError.error}</p>
                            </div>
                            <NeonButton
                              size="sm"
                              variant="secondary"
                              onClick={() => retryServiceTrigger(service.id)}
                            >
                              Retry Payment
                            </NeonButton>
                          </div>
                        </div>
                      )}

                      {!walletConnected && service.status === 'pending' && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                          <Wallet className="h-4 w-4 text-orange-400" />
                          <p className="text-sm text-orange-300">Connect wallet for real payments</p>
                        </div>
                      )}

                      {/* Transaction Success Display */}
                      {service.status === 'completed' && transaction && (
                        <div className="space-y-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <div className="flex-1">
                              <p className="text-sm text-green-300 font-medium">
                                Blockchain Payment Confirmed! 
                              </p>
                              <p className="text-xs text-green-400 mt-1">
                                {service.amount} ETH sent to merchant
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">TX Hash:</span>
                              <p className="text-green-400 font-mono break-all">
                                {transaction.txHash.slice(0, 10)}...
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400">Block:</span>
                              <p className="text-green-400">#{transaction.blockNumber}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <NeonButton
                              size="sm"
                              variant="secondary"
                              onClick={() => setShowTransactionSuccess(service.id)}
                            >
                              <Activity className="h-3 w-3" />
                              View Details
                            </NeonButton>
                            <NeonButton
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transaction.txHash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Etherscan
                            </NeonButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </NeonCard>

                  {/* IoT Simulation Card */}
                  <IoTSimulation
                    serviceName={service.name}
                    serviceType={getServiceTypeForIoT(service)}
                    onComplete={async () => {
                      await handleIoTComplete();
                      // After IoT completes, trigger real payment
                      if (triggeringService === service.id) {
                        try {
                          const transactionRecord = await executeRealPayment(service.id, service);
                          handlePaymentSuccess(service.id, transactionRecord);
                        } catch (error) {
                          handlePaymentError(service.id, error instanceof Error ? error.message : 'Payment failed');
                        }
                      }
                    }}
                    isActive={isIoTActive}
                  />
                </div>
              );
            })}
          </div>

          {/* Contract Information */}
          <NeonCard glowColor="purple" className="text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Blockchain Contract Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Smart Contract</p>
                  <p className="text-sm text-purple-400 font-mono break-all">
                    {tourPackage.contractAddress || 'Contract deployed on Sepolia'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Network</p>
                  <p className="text-sm text-cyan-400">Sepolia Testnet (Real Transactions)</p>
                </div>
              </div>
              
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                <DollarSign className="h-3 w-3 mr-1" />
                Live Testnet Payments Active
              </Badge>
            </div>
          </NeonCard>

          {/* Comprehensive Rewards Modal */}
          {showRewards && isCompleted && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="w-full max-w-6xl mx-auto my-8">
                <div className="relative">
                  <ComprehensiveRewards
                    tourPackage={tourPackage}
                    completedServices={completedServices}
                    totalAmount={getTotalPaid()}
                    transactionHashes={Array.from(successfulTransactions.values()).map(tx => tx.txHash)}
                    walletAddress="0x742d35Cc6634C0532925a3b8D430d26e8b3Cb60e"
                    onClaimRewards={() => {
                      onFinalizeTour();
                      setShowRewards(false);
                    }}
                  />
                  
                  {/* Close Button */}
                  <NeonButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowRewards(false)}
                    className="absolute top-4 right-4 z-10"
                  >
                    ✕ Close
                  </NeonButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </RealPaymentHandler>
  );
}