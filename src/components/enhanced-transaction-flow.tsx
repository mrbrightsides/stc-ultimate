'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Coins, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  Activity,
  DollarSign,
  TrendingUp,
  Smartphone,
  Radio,
  Satellite
} from 'lucide-react';

interface TransactionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  color: string;
  details: string[];
}

interface EnhancedTransactionFlowProps {
  serviceName: string;
  amount: string;
  isActive: boolean;
  onComplete: () => void;
  onError: (error: string) => void;
}

const transactionSteps: TransactionStep[] = [
  {
    id: 'device-detection',
    title: 'IoT Device Detection',
    description: 'Scanning for nearby IoT devices and sensors',
    icon: Radio,
    duration: 2000,
    color: 'cyan',
    details: [
      'Bluetooth beacons detected',
      'NFC terminal found',
      'RFID reader active',
      'GPS location verified'
    ]
  },
  {
    id: 'authentication',
    title: 'Multi-Factor Authentication',
    description: 'Verifying user identity and location',
    icon: Shield,
    duration: 2500,
    color: 'purple',
    details: [
      'Biometric scan initiated',
      'Wallet signature requested',
      'Location coordinates verified',
      'Identity confirmed'
    ]
  },
  {
    id: 'gas-calculation',
    title: 'Gas Fee Optimization',
    description: 'Calculating optimal gas fees for transaction',
    icon: DollarSign,
    duration: 1800,
    color: 'yellow',
    details: [
      'Network congestion analyzed',
      'Gas price optimization',
      'Fee estimation complete',
      'Transaction cost locked'
    ]
  },
  {
    id: 'contract-execution',
    title: 'Smart Contract Execution',
    description: 'Broadcasting transaction to Sepolia network',
    icon: Zap,
    duration: 3000,
    color: 'blue',
    details: [
      'Contract method called',
      'Transaction broadcasted',
      'Mempool entry confirmed',
      'Miners processing'
    ]
  },
  {
    id: 'confirmation',
    title: 'Blockchain Confirmation',
    description: 'Waiting for network confirmations',
    icon: Activity,
    duration: 4000,
    color: 'green',
    details: [
      'Block confirmation 1/3',
      'Block confirmation 2/3', 
      'Block confirmation 3/3',
      'Transaction finalized'
    ]
  },
  {
    id: 'activation',
    title: 'Service Activation',
    description: 'Notifying merchants and unlocking access',
    icon: CheckCircle2,
    duration: 1500,
    color: 'green',
    details: [
      'Merchant notification sent',
      'Service access unlocked',
      'Payment distributed',
      'Activation complete'
    ]
  }
];

export function EnhancedTransactionFlow({
  serviceName,
  amount,
  isActive,
  onComplete,
  onError
}: EnhancedTransactionFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [gasEstimate, setGasEstimate] = useState<string>('Calculating...');
  const [networkTps, setNetworkTps] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(12345670);
  const [confirmations, setConfirmations] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [estimatedTime, setEstimatedTime] = useState<string>('~3 minutes');

  const currentStep = transactionSteps[currentStepIndex];
  
  useEffect(() => {
    if (!isActive || isComplete || hasError) return;

    const executeStep = async () => {
      if (currentStepIndex >= transactionSteps.length) {
        setIsComplete(true);
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 1000);
        return;
      }

      const step = transactionSteps[currentStepIndex];
      const detailDuration = step.duration / step.details.length;
      
      // Execute each detail in the step
      for (let i = 0; i < step.details.length; i++) {
        setCurrentDetailIndex(i);
        
        // Step-specific enhancements
        if (step.id === 'gas-calculation') {
          if (i === 0) {
            setGasEstimate('Analyzing...');
            setNetworkTps(42);
            setEstimatedTime('~4 minutes');
          } else if (i === 1) {
            setGasEstimate('0.0018 ETH');
            setNetworkTps(55);
            setEstimatedTime('~2.5 minutes');
          } else if (i === 2) {
            setGasEstimate('0.0014 ETH');
            setNetworkTps(68);
            setEstimatedTime('~90 seconds');
          } else if (i === 3) {
            setGasEstimate('0.0012 ETH (optimized)');
            setNetworkTps(72);
            setEstimatedTime('~60 seconds');
          }
        }
        
        if (step.id === 'confirmation') {
          const confNumber = i + 1;
          if (confNumber <= 3) {
            setConfirmations(confNumber);
            setBlockHeight(prev => prev + 1);
          }
        }
        
        // Update progress
        const stepProgress = ((currentStepIndex * step.details.length + i + 1) / (transactionSteps.length * 4)) * 100;
        setProgress(stepProgress);
        
        await new Promise(resolve => setTimeout(resolve, detailDuration));
      }
      
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
    };

    executeStep().catch((error) => {
      setHasError(true);
      onError(error.message || 'Transaction failed');
    });
  }, [isActive, currentStepIndex, onComplete, onError, isComplete, hasError]);

  if (!isActive) {
    return (
      <NeonCard glowColor="gray" className="opacity-50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-400">Transaction Flow Ready</h3>
          <p className="text-sm text-gray-500">Waiting for service activation</p>
        </div>
      </NeonCard>
    );
  }

  if (hasError) {
    return (
      <NeonCard glowColor="red" intense>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-red-400">Transaction Failed</h3>
          <p className="text-sm text-red-300">Please retry the transaction</p>
        </div>
      </NeonCard>
    );
  }

  if (isComplete) {
    return (
      <NeonCard glowColor="green" intense>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-green-400">Transaction Complete!</h3>
          <p className="text-sm text-green-300">
            {serviceName} activated successfully
          </p>
          <div className="space-y-2">
            <p className="text-green-400 font-bold text-lg">{amount} ETH</p>
            <p className="text-xs text-green-300">Payment confirmed on blockchain</p>
          </div>
        </div>
      </NeonCard>
    );
  }

  return (
    <NeonCard 
      glowColor={currentStep?.color as any} 
      intense 
      className="transition-all duration-500"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-${currentStep.color}-500/20 flex items-center justify-center`}>
                <currentStep.icon className={`h-6 w-6 text-${currentStep.color}-400`} />
              </div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-cyan-400 animate-spin border-t-transparent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Enhanced Transaction Flow</h3>
              <p className="text-sm text-gray-400">{serviceName} - {amount} ETH</p>
            </div>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 animate-pulse">
            PROCESSING
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Transaction Progress</span>
            <span className="text-sm font-medium text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500"
          />
          <div className="text-xs text-gray-400 text-center">
            Step {currentStepIndex + 1} of {transactionSteps.length} • {estimatedTime} remaining
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-${currentStep.color}-500/20 flex items-center justify-center`}>
              <currentStep.icon className={`h-4 w-4 text-${currentStep.color}-400`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{currentStep.title}</h4>
              <p className="text-sm text-gray-400">{currentStep.description}</p>
            </div>
            <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
          </div>

          {/* Current Detail */}
          <div className="ml-11 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">
                {currentStep.details[currentDetailIndex]}
              </span>
            </div>
            
            {/* Enhanced Info for specific steps */}
            {currentStep.id === 'gas-calculation' && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-yellow-300">Gas Estimate:</span>
                    <p className="text-yellow-400 font-mono text-sm">{gasEstimate}</p>
                  </div>
                  <div>
                    <span className="text-yellow-300">Network TPS:</span>
                    <p className="text-yellow-400 font-mono text-sm">{networkTps}/sec</p>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep.id === 'confirmation' && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-green-300">Block Confirmations:</span>
                  <span className="text-green-400 font-mono text-sm">{confirmations}/3</span>
                </div>
                
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3].map((conf) => (
                    <div
                      key={conf}
                      className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                        confirmations >= conf 
                          ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Block Height:</span>
                    <p className="text-green-400 font-mono">#{blockHeight}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Finality:</span>
                    <p className="text-green-400 font-mono">{confirmations}/3</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step Timeline */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-300">Transaction Timeline</h5>
          <div className="space-y-2">
            {transactionSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const isPending = index > currentStepIndex;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-2 rounded transition-all duration-300 ${
                    isActive 
                      ? 'bg-cyan-500/10 border border-cyan-500/30' 
                      : isCompleted
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-gray-500/5 border border-gray-500/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-cyan-500/20 border-2 border-cyan-400' 
                      : isCompleted
                      ? 'bg-green-500/20'
                      : 'bg-gray-500/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                    ) : isActive ? (
                      <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                    ) : (
                      <step.icon className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-cyan-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {isActive && (
                    <ArrowRight className="h-4 w-4 text-cyan-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </NeonCard>
  );
}