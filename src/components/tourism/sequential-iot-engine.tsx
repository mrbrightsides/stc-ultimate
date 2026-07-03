'use client';

import { useState, useEffect, useCallback } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QRScanner } from './qr-scanner';
import type { DemoSpeed } from './demo-speed-toggle';
import { 
  CheckCircle2, 
  Clock, 
  Zap,
  Loader2,
  Radio,
  MapPin,
  Fingerprint,
  QrCode,
  Activity,
  ExternalLink
} from 'lucide-react';
import type { MilestoneStatus } from '@/lib/milestone-escrow';
import { createIPFSProof, type IPFSProof } from '@/lib/ipfs-proof-generator';

interface SequentialIoTEngineProps {
  milestones: MilestoneStatus[];
  currentMilestoneIndex: number;
  onMilestoneComplete: (milestoneIndex: number, iotProof: string, triggerStartTime: number, ipfsProof: IPFSProof) => Promise<void>;
  isActive: boolean;
  demoSpeed?: DemoSpeed;
}

interface IoTTriggerAnimation {
  stage: 'detecting' | 'verifying' | 'broadcasting' | 'confirming' | 'releasing';
  message: string;
  progress: number;
}

const getIoTIcon = (triggerType: string) => {
  switch (triggerType) {
    case 'RFID':
      return Radio;
    case 'GPS':
      return MapPin;
    case 'Biometric':
      return Fingerprint;
    case 'QR':
      return QrCode;
    default:
      return Activity;
  }
};

const triggerAnimations: IoTTriggerAnimation[] = [
  { stage: 'detecting', message: 'Detecting IoT device signal...', progress: 20 },
  { stage: 'verifying', message: 'Verifying location and authentication...', progress: 40 },
  { stage: 'broadcasting', message: 'Broadcasting to blockchain...', progress: 60 },
  { stage: 'confirming', message: 'Awaiting block confirmation...', progress: 80 },
  { stage: 'releasing', message: 'Releasing funds to vendor...', progress: 100 },
];

export function SequentialIoTEngine({
  milestones,
  currentMilestoneIndex,
  onMilestoneComplete,
  isActive,
  demoSpeed = 'realtime',
}: SequentialIoTEngineProps) {
  const [triggerProgress, setTriggerProgress] = useState<number>(0);
  const [currentAnimation, setCurrentAnimation] = useState<IoTTriggerAnimation | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMilestoneIndex, setProcessingMilestoneIndex] = useState<number | null>(null);
  const [realTimeLog, setRealTimeLog] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<string>('~30 seconds');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastFailedMilestone, setLastFailedMilestone] = useState<number | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [hasNetworkError, setHasNetworkError] = useState<boolean>(false);

  const currentMilestone = milestones[currentMilestoneIndex];
  const nextMilestones = milestones.slice(currentMilestoneIndex + 1, currentMilestoneIndex + 4);
  const completedMilestones = milestones.filter(m => m.isCompleted).length;

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRealTimeLog(prev => [`${timestamp} - ${message}`, ...prev.slice(0, 9)]);
  };

  const processMilestone = useCallback(async (milestoneIndex: number) => {
    // Prevent processing if already processing or in cooldown
    if (!isActive || isProcessing) return;
    
    // Check cooldown period
    const now = Date.now();
    if (now < cooldownUntil) {
      const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
      addLog(`⏳ Cooldown active: ${remainingSeconds}s remaining`);
      return;
    }
    
    // Check retry limit (max 3 attempts per milestone)
    if (lastFailedMilestone === milestoneIndex && retryCount >= 3) {
      addLog(`❌ Max retry attempts reached for this milestone`);
      addLog(`💡 Please check your wallet connection and try again later`);
      return;
    }
    
    const triggerStartTime = Date.now();
    
    setIsProcessing(true);
    setProcessingMilestoneIndex(milestoneIndex);
    setTriggerProgress(0);
    
    const milestone = milestones[milestoneIndex];
    
    addLog(`🎯 Starting ${milestone.serviceName} verification`);
    addLog(`📍 ${milestone.timing} - ${milestone.serviceType}`);
    
    // Simulate sequential IoT trigger process
    for (let i = 0; i < triggerAnimations.length; i++) {
      const animation = triggerAnimations[i];
      setCurrentAnimation(animation);
      setTriggerProgress(animation.progress);
      
      // Adjust timing based on demo speed
      const speedMultiplier = demoSpeed === 'instant' ? 0.15 : 1;
      
      // Stage-specific messages
      if (animation.stage === 'detecting') {
        addLog(`🔍 Scanning for ${milestone.iotTrigger} device...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * speedMultiplier));
        addLog(`✅ ${milestone.iotTrigger} device detected!`);
      } else if (animation.stage === 'verifying') {
        addLog(`🔐 Verifying user authentication...`);
        await new Promise(resolve => setTimeout(resolve, 2500 * speedMultiplier));
        addLog(`✅ Location verified: ${milestone.serviceName}`);
      } else if (animation.stage === 'broadcasting') {
        addLog(`📡 Preparing blockchain transaction...`);
        setEstimatedTime(demoSpeed === 'instant' ? '~3 seconds' : '~20 seconds');
        await new Promise(resolve => setTimeout(resolve, 2000 * speedMultiplier));
        addLog(`📤 Transaction broadcast to Sepolia testnet`);
      } else if (animation.stage === 'confirming') {
        addLog(`⏳ Waiting for block confirmation...`);
        setEstimatedTime(demoSpeed === 'instant' ? '~2 seconds' : '~10 seconds');
        await new Promise(resolve => setTimeout(resolve, 3000 * speedMultiplier));
        addLog(`✅ Block confirmed!`);
      } else if (animation.stage === 'releasing') {
        addLog(`💸 Releasing ${milestone.amount} ETH to vendor...`);
        setEstimatedTime(demoSpeed === 'instant' ? '~1 second' : '~5 seconds');
        await new Promise(resolve => setTimeout(resolve, 2000 * speedMultiplier));
      }
    }
    
    // Generate IPFS proof for IoT verification
    const ipfsProof = createIPFSProof(
      milestone.iotTrigger,
      milestone.serviceName,
      milestone.vendorAddress,
      'user-address' // Will be replaced with actual address in dashboard
    );
    
    const iotProof = ipfsProof.ipfsHash;
    
    addLog(`✅ Milestone completed! Escrow released.`);
    addLog(`📝 IPFS Proof: ${iotProof.slice(0, 20)}...`);
    addLog(`🔗 Gateway: ${ipfsProof.gatewayUrl}`);
    
    // Trigger milestone completion
    try {
      await onMilestoneComplete(milestoneIndex, iotProof, triggerStartTime, ipfsProof);
      addLog(`🎉 Payment confirmed on blockchain!`);
      
      // Reset retry counter on success
      setRetryCount(0);
      setLastFailedMilestone(null);
      setCooldownUntil(0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Transaction failed: ${errorMessage}`);
      
      // Check if it's a network/RPC error (don't retry these automatically)
      const isNetworkError = errorMessage.includes('Failed to fetch') || 
                            errorMessage.includes('network') || 
                            errorMessage.includes('RPC') ||
                            errorMessage.includes('timeout') ||
                            errorMessage.includes('Sepolia');
      
      if (isNetworkError) {
        setHasNetworkError(true);
        addLog(`🌐 Network/RPC error detected`);
        addLog(`💡 Please check: (1) MetaMask connected to Sepolia, (2) Internet connection, (3) Sufficient ETH balance`);
        addLog(`🔄 Refresh page to try again`);
      } else {
        // Only retry non-network errors
        const newRetryCount = lastFailedMilestone === milestoneIndex ? retryCount + 1 : 1;
        setRetryCount(newRetryCount);
        setLastFailedMilestone(milestoneIndex);
        
        // Exponential backoff: 5s, 10s, 20s
        const cooldownDuration = Math.min(5000 * Math.pow(2, newRetryCount - 1), 20000);
        const cooldownEnd = Date.now() + cooldownDuration;
        setCooldownUntil(cooldownEnd);
        
        addLog(`⏳ Retry ${newRetryCount}/3 in ${cooldownDuration / 1000}s`);
        
        if (newRetryCount >= 3) {
          addLog(`🚫 Maximum retries reached. Please refresh or check your connection.`);
        }
      }
    }
    
    setIsProcessing(false);
    setProcessingMilestoneIndex(null);
    setCurrentAnimation(null);
    setTriggerProgress(0);
    setEstimatedTime(demoSpeed === 'instant' ? '~5 seconds' : '~30 seconds');
    
    // Small delay before next milestone can start
    await new Promise(resolve => setTimeout(resolve, demoSpeed === 'instant' ? 500 : 1000));
  }, [isActive, isProcessing, milestones, onMilestoneComplete, demoSpeed, cooldownUntil, retryCount, lastFailedMilestone]);

  // Auto-trigger next milestone when active
  useEffect(() => {
    if (isActive && !isProcessing && currentMilestoneIndex < milestones.length) {
      // Don't auto-retry if network error detected
      if (hasNetworkError) {
        return;
      }
      
      // Check if we're in cooldown or max retries reached
      const now = Date.now();
      if (now < cooldownUntil) {
        // Wait until cooldown expires before retrying
        const cooldownRemaining = cooldownUntil - now;
        const timer = setTimeout(() => {
          processMilestone(currentMilestoneIndex);
        }, cooldownRemaining + 500);
        
        return () => clearTimeout(timer);
      }
      
      // Don't auto-retry if max attempts reached
      if (lastFailedMilestone === currentMilestoneIndex && retryCount >= 3) {
        return;
      }
      
      const timer = setTimeout(() => {
        processMilestone(currentMilestoneIndex);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, isProcessing, currentMilestoneIndex, milestones.length, processMilestone, cooldownUntil, retryCount, lastFailedMilestone, hasNetworkError]);

  if (!currentMilestone) {
    return (
      <NeonCard glowColor="green" intense className="text-center">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-green-400">All Milestones Completed!</h3>
          <p className="text-gray-300">
            {completedMilestones}/{milestones.length} payments successfully released to vendors
          </p>
        </div>
      </NeonCard>
    );
  }

  const IconComponent = getIoTIcon(currentMilestone.iotTrigger);
  const isProcessingCurrent = processingMilestoneIndex === currentMilestoneIndex;

  return (
    <div className="space-y-6">
      {/* Current Milestone Processing */}
      <NeonCard glowColor="cyan" intense={isProcessingCurrent}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-cyan-400" />
                </div>
                {isProcessingCurrent && (
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-cyan-400 animate-spin border-t-transparent" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">{currentMilestone.serviceName}</h3>
                <p className="text-gray-400">{currentMilestone.timing}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">{currentMilestone.amount} ETH</p>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 mt-2">
                Milestone {currentMilestoneIndex + 1}/{milestones.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessingCurrent && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{currentAnimation?.message || 'Waiting...'}</span>
                <span className="text-cyan-400 font-medium">{triggerProgress}%</span>
              </div>
              <Progress 
                value={triggerProgress} 
                className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>IoT Trigger: {currentMilestone.iotTrigger}</span>
                <span>Est. time: {estimatedTime}</span>
              </div>
            </div>
          )}

          {/* Milestone Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-black/30 border border-cyan-500/30">
            <div>
              <p className="text-xs text-gray-400">Service Type</p>
              <p className="text-sm text-cyan-300 font-medium">{currentMilestone.serviceType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">IoT Trigger</p>
              <p className="text-sm text-purple-300 font-medium">{currentMilestone.iotTrigger}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Vendor Address</p>
              <p className="text-xs text-green-300 font-mono">
                {currentMilestone.vendorAddress.slice(0, 6)}...{currentMilestone.vendorAddress.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Escrow Release</p>
              <p className="text-sm text-green-400 font-bold">{currentMilestone.amount} ETH</p>
            </div>
          </div>

          {/* Current Animation Display */}
          {currentAnimation && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/50">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                <div className="flex-1">
                  <p className="text-cyan-300 font-medium">{currentAnimation.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Stage {triggerAnimations.indexOf(currentAnimation) + 1}/{triggerAnimations.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </NeonCard>

      {/* Real-Time Event Log */}
      {realTimeLog.length > 0 && (
        <NeonCard glowColor="purple">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Event Stream
              </h4>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 animate-pulse">
                LIVE
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-purple-500/30 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
              {realTimeLog.map((log, index) => (
                <div 
                  key={`${log}-${index}`}
                  className={`transition-all duration-300 ${
                    index === 0 ? 'text-cyan-400' :
                    index === 1 ? 'text-green-400' :
                    index === 2 ? 'text-purple-400' :
                    'text-gray-400'
                  }`}
                  style={{ opacity: Math.max(0.3, 1 - (index * 0.1)) }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </NeonCard>
      )}

      {/* Upcoming Milestones Preview */}
      {nextMilestones.length > 0 && (
        <NeonCard glowColor="gray">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Milestones
            </h4>
            <div className="space-y-3">
              {nextMilestones.map((milestone, index) => {
                const NextIcon = getIoTIcon(milestone.iotTrigger);
                return (
                  <div 
                    key={milestone.sequence}
                    className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-gray-500/30"
                  >
                    <div className="p-2 rounded bg-gray-500/20">
                      <NextIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-300">{milestone.serviceName}</p>
                      <p className="text-xs text-gray-500">{milestone.timing}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-400">{milestone.amount} ETH</p>
                      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50 text-xs mt-1">
                        #{milestone.sequence + 1}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </NeonCard>
      )}

      {/* Escrow Progress Summary */}
      <NeonCard glowColor="green">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Escrow Distribution Progress</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{completedMilestones}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{isProcessingCurrent ? 1 : 0}</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{milestones.length - completedMilestones - (isProcessingCurrent ? 1 : 0)}</p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>
          </div>
          <Progress 
            value={(completedMilestones / milestones.length) * 100} 
            className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-cyan-500"
          />
        </div>
      </NeonCard>
    </div>
  );
}
