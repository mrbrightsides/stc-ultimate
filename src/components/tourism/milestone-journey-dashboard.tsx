'use client';

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { SequentialIoTEngine } from './sequential-iot-engine';
import { MilestoneTimeline } from './milestone-timeline';
import { TransactionSuccess } from '@/components/transaction-success';
import { AnalyticsDashboard } from './analytics-dashboard';
import { AuditLogExporter } from './audit-log-exporter';
import { UserGuideOverlay } from './user-guide-overlay';
import { DemoSpeedToggle, type DemoSpeed } from './demo-speed-toggle';
import type { TransactionMetrics } from '@/lib/performance-metrics';
import type { IPFSProof } from '@/lib/ipfs-proof-generator';
import { useSIWE } from '@/contexts/siwe-context';
import { getEscrowManager, type MilestoneEscrowBooking, type MilestoneReleaseResult } from '@/lib/milestone-escrow';
import type { DestinationConfig, ServiceMilestone } from '@/lib/destinations-config';
import { 
  MapPin, 
  Calendar, 
  Wallet,
  Trophy,
  CheckCircle,
  ExternalLink,
  Activity,
  DollarSign,
  Lock,
  Unlock,
  AlertCircle,
  Filter
} from 'lucide-react';

interface MilestoneJourneyDashboardProps {
  destination: DestinationConfig;
  startDate: string;
  endDate: string;
  duration: number;
  onJourneyComplete: () => void;
}

export function MilestoneJourneyDashboard({ 
  destination,
  startDate,
  endDate,
  duration,
  onJourneyComplete
}: MilestoneJourneyDashboardProps) {
  const { address, balance, refreshBalance, isConnected } = useSIWE();
  const [booking, setBooking] = useState<MilestoneEscrowBooking | null>(null);
  const [isInitializingEscrow, setIsInitializingEscrow] = useState<boolean>(false);
  const [journeyStarted, setJourneyStarted] = useState<boolean>(false);
  const [lastTransaction, setLastTransaction] = useState<MilestoneReleaseResult | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionMetrics, setTransactionMetrics] = useState<TransactionMetrics[]>([]);
  const [ipfsProofs, setIpfsProofs] = useState<IPFSProof[]>([]);
  const [showUserGuide, setShowUserGuide] = useState<boolean>(false);
  const [demoSpeed, setDemoSpeed] = useState<DemoSpeed>('realtime');
  const [selectedMilestones, setSelectedMilestones] = useState<Set<number>>(new Set());
  const [showMilestoneSelector, setShowMilestoneSelector] = useState<boolean>(false);

  const escrowManager = getEscrowManager();

  // Show user guide on first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('stc_ultimate_guide_seen');
    if (!hasSeenGuide) {
      setShowUserGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowUserGuide(false);
    localStorage.setItem('stc_ultimate_guide_seen', 'true');
  };

  // Define all milestones FIRST
  const allMilestones = destination.milestones.map((m, idx) => ({
    ...m,
    isCompleted: false,
    milestoneIndex: idx,
  }));
  
  // Get active milestones (all if none selected, or only selected ones)
  const getActiveMilestones = (): ServiceMilestone[] => {
    if (selectedMilestones.size === 0) {
      return allMilestones;
    }
    return allMilestones.filter((_, idx) => selectedMilestones.has(idx));
  };
  
  const milestones = getActiveMilestones();
  
  // Calculate package total based on selected milestones
  const calculatePackageTotal = (): string => {
    const activeMilestones = getActiveMilestones();
    const total = activeMilestones.reduce((sum, m) => sum + parseFloat(m.amount), 0);
    return total.toFixed(6);
  };
  
  // Calculate realistic duration based on milestones
  const calculateRealisticDuration = (): number => {
    const activeMilestones = getActiveMilestones();
    // Estimate: ~3-4 milestones per day is realistic
    return Math.max(1, Math.ceil(activeMilestones.length / 3.5));
  };
  
  const packageTotal = calculatePackageTotal();
  const realisticDuration = calculateRealisticDuration();
  
  // Toggle milestone selection
  const toggleMilestone = (index: number): void => {
    setSelectedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  
  // Select all milestones
  const selectAllMilestones = (): void => {
    setSelectedMilestones(new Set(allMilestones.map((_, idx) => idx)));
  };
  
  // Clear all selections
  const clearAllMilestones = (): void => {
    setSelectedMilestones(new Set());
  };

  // Initialize escrow booking
  const initializeEscrow = async () => {
    if (!isConnected || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsInitializingEscrow(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Create escrow booking
      const newBooking = await escrowManager.createEscrowBooking(
        destination.name,
        milestones,
        provider,
        userAddress
      );

      setBooking(newBooking);
      console.log('✅ Escrow booking created:', newBooking.bookingId);
      
    } catch (err) {
      console.error('Failed to initialize escrow:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize escrow');
    } finally {
      setIsInitializingEscrow(false);
    }
  };

  // Handle milestone completion
  const handleMilestoneComplete = useCallback(async (
    milestoneIndex: number, 
    iotProof: string, 
    triggerStartTime: number, 
    ipfsProof: IPFSProof
  ) => {
    if (!booking || !window.ethereum) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Check network before proceeding
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        throw new Error('Please switch to Sepolia Testnet in your wallet');
      }

      // Trigger milestone release
      const result = await escrowManager.triggerMilestoneRelease(
        booking.bookingId,
        milestoneIndex,
        iotProof,
        provider,
        triggerStartTime
      );
      
      // Track metrics
      const metric: TransactionMetrics = {
        txHash: result.txHash,
        milestoneIndex: result.milestoneIndex,
        gasUsed: result.gasUsed,
        gasCost: result.gasCost,
        blockNumber: result.blockNumber,
        timestamp: result.timestamp,
        duration: result.duration,
        vendorAddress: result.vendorAddress,
        amountReleased: result.amountReleased,
      };
      
      setTransactionMetrics(prev => [...prev, metric]);
      setIpfsProofs(prev => [...prev, ipfsProof]);

      // Update booking state
      const updatedBooking = escrowManager.getBooking(booking.bookingId);
      if (updatedBooking) {
        setBooking(updatedBooking);
      }

      // Show transaction success
      setLastTransaction(result);
      setShowTransactionModal(true);
      
      // Auto-dismiss modal after 3 seconds
      setTimeout(() => {
        setShowTransactionModal(false);
      }, 3000);

      // Refresh balance
      setTimeout(refreshBalance, 2000);

      console.log('✅ Milestone released:', result);
      
    } catch (err) {
      console.error('Milestone release failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to release milestone funds';
      
      // Check if it's a network/RPC error
      const isNetworkError = errorMessage.includes('Failed to fetch') || 
                            errorMessage.includes('network') || 
                            errorMessage.includes('RPC') ||
                            errorMessage.includes('timeout');
      
      if (isNetworkError) {
        setError('Network error: Please check your internet connection and ensure MetaMask is connected to Sepolia Testnet. Refresh the page to try again.');
      } else {
        setError(errorMessage);
      }
      
      // Rethrow to let SequentialIoTEngine handle retry logic
      throw err;
    }
  }, [booking, escrowManager, refreshBalance]);

  // Start the journey
  const startJourney = () => {
    if (!booking) {
      initializeEscrow();
    }
    setJourneyStarted(true);
  };

  // Check if journey is complete
  const isJourneyComplete = booking?.status === 'completed';
  const progress = booking ? escrowManager.getEscrowProgress(booking.bookingId) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* User Guide Overlay */}
      {showUserGuide && (
        <UserGuideOverlay onClose={handleCloseGuide} />
      )}
      {/* Transaction Success Modal */}
      {showTransactionModal && lastTransaction && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTransactionModal(false)}
        >
          <div 
            className="relative"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <TransactionSuccess
              txHash={lastTransaction.txHash}
              serviceAmount={lastTransaction.amountReleased}
              serviceName={`Milestone ${lastTransaction.milestoneIndex + 1}`}
              blockNumber={lastTransaction.blockNumber}
              gasUsed={lastTransaction.gasUsed}
              onDismiss={() => setShowTransactionModal(false)}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {destination.name} Travel Package
        </h2>
        <div className="flex items-center justify-center gap-6 text-gray-300 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>{destination.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span>{startDate} - {endDate} (~{realisticDuration} hari untuk {milestones.length} milestone)</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-400" />
            <span>{balance} ETH Available</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <NeonCard glowColor="red">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <div>
              <p className="text-red-300 font-medium">Error</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Escrow Overview */}
      {!journeyStarted ? (
        <NeonCard glowColor="purple" intense>
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Lock className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Initialize Escrow Booking</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Your travel package will be secured in a blockchain escrow. Funds will be released to vendors 
                sequentially as you complete each milestone of your journey, verified by IoT devices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 rounded-lg bg-black/30 border border-purple-500/30">
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Package Details</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Destination:</span>
                    <span className="text-purple-300 font-medium">{destination.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-purple-300 font-medium">~{realisticDuration} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Milestones:</span>
                    <span className="text-purple-300 font-medium">{milestones.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Escrow Amount</p>
                <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <p className="text-4xl font-bold text-purple-400">{packageTotal} ETH</p>
                  <p className="text-sm text-gray-400 mt-2">
                    To be locked in smart contract escrow
                  </p>
                </div>
              </div>
            </div>
            
            {/* Milestone Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-cyan-400" />
                  <p className="text-sm text-gray-400">Customize Your Journey</p>
                </div>
                <NeonButton
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowMilestoneSelector(!showMilestoneSelector)}
                >
                  {showMilestoneSelector ? 'Hide' : 'Select'} Milestones
                </NeonButton>
              </div>
              
              {showMilestoneSelector && (
                <div className="p-4 rounded-lg bg-black/30 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-cyan-300">
                      {selectedMilestones.size === 0 ? 'All milestones selected' : `${selectedMilestones.size} of ${allMilestones.length} selected`}
                    </p>
                    <div className="flex gap-2">
                      <NeonButton
                        size="sm"
                        variant="secondary"
                        onClick={selectAllMilestones}
                      >
                        Select All
                      </NeonButton>
                      <NeonButton
                        size="sm"
                        variant="secondary"
                        onClick={clearAllMilestones}
                      >
                        Clear All
                      </NeonButton>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {allMilestones.map((milestone, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                        onClick={() => toggleMilestone(idx)}
                      >
                        <Checkbox
                          checked={selectedMilestones.size === 0 || selectedMilestones.has(idx)}
                          onCheckedChange={() => toggleMilestone(idx)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{milestone.serviceName}</p>
                          <p className="text-xs text-gray-400">{milestone.timing}</p>
                          <p className="text-xs text-cyan-400 font-mono">{milestone.amount} ETH</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    💡 Tip: Pilih milestone sesuai budget kamu. Estimasi durasi: ~{realisticDuration} hari untuk {milestones.length} milestone.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">How It Works:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">1</span>
                    </div>
                    <p className="text-cyan-300 font-medium">Escrow Lock</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Full package amount locked in blockchain escrow contract
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <p className="text-purple-300 font-medium">IoT Triggers</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Each service verified by RFID, GPS, QR, or biometric IoT devices
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <p className="text-green-300 font-medium">Auto Release</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Funds released to vendor automatically after IoT verification
                  </p>
                </div>
              </div>
            </div>

            <NeonButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={startJourney}
              loading={isInitializingEscrow}
              disabled={!isConnected || isInitializingEscrow}
            >
              {!isConnected ? (
                <>
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet to Start
                </>
              ) : isInitializingEscrow ? (
                'Initializing Escrow...'
              ) : (
                <>
                  <Unlock className="h-5 w-5 mr-2" />
                  Start Your {destination.name} Journey
                </>
              )}
            </NeonButton>
          </div>
        </NeonCard>
      ) : (
        <>
          {/* Journey Progress Overview */}
          <NeonCard glowColor={isJourneyComplete ? 'green' : 'cyan'} intense={isJourneyComplete}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                  {isJourneyComplete ? (
                    <>
                      <Trophy className="h-6 w-6 text-green-400" />
                      Journey Complete!
                    </>
                  ) : (
                    <>
                      <Activity className="h-6 w-6 text-cyan-400" />
                      Journey in Progress
                    </>
                  )}
                </h3>
                {progress && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-cyan-400">
                      {progress.completedMilestones}/{progress.totalMilestones}
                    </p>
                    <p className="text-sm text-gray-400">Milestones</p>
                  </div>
                )}
              </div>

              {progress && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Escrow Distribution Progress</span>
                      <span className="text-cyan-400 font-medium">{Math.round(progress.progressPercent)}%</span>
                    </div>
                    <Progress 
                      value={progress.progressPercent} 
                      className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-cyan-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-cyan-500/20">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{progress.releasedAmount} ETH</p>
                      <p className="text-sm text-gray-400">Released to Vendors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-400">{progress.remainingAmount} ETH</p>
                      <p className="text-sm text-gray-400">Locked in Escrow</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{progress.totalAmount} ETH</p>
                      <p className="text-sm text-gray-400">Total Package</p>
                    </div>
                  </div>
                </>
              )}

              {isJourneyComplete && (
                <div className="pt-4 border-t border-green-500/20">
                  <NeonButton
                    variant="success"
                    size="lg"
                    onClick={onJourneyComplete}
                    className="w-full"
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    Complete Journey & View Summary
                  </NeonButton>
                </div>
              )}
            </div>
          </NeonCard>

          {/* Demo Speed Toggle */}
          {booking && !isJourneyComplete && (
            <DemoSpeedToggle
              currentSpeed={demoSpeed}
              onSpeedChange={setDemoSpeed}
            />
          )}

          {/* Sequential IoT Engine */}
          {booking && !isJourneyComplete && (
            <SequentialIoTEngine
              milestones={booking.milestones}
              currentMilestoneIndex={booking.currentMilestoneIndex}
              onMilestoneComplete={handleMilestoneComplete}
              isActive={journeyStarted}
              demoSpeed={demoSpeed}
            />
          )}

          {/* Milestone Timeline */}
          {booking && (
            <MilestoneTimeline
              milestones={booking.milestones}
              completedMilestones={booking.milestones
                .filter(m => m.isCompleted)
                .map(m => m.id)}
              currentMilestone={booking.milestones[booking.currentMilestoneIndex]?.id}
              destinationName={destination.name}
              onGPSVerified={(milestoneId: string) => {
                console.log('GPS verified for milestone:', milestoneId);
              }}
            />
          )}

          {/* Vendor Payment Breakdown */}
          {booking && progress && progress.completedMilestones > 0 && (
            <NeonCard glowColor="purple">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Vendor Payment Distribution
                </h3>
                <div className="space-y-3">
                  {Array.from(escrowManager.getVendorPayments(booking.bookingId).entries()).map(([vendor, data]) => (
                    <div 
                      key={vendor}
                      className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/30"
                    >
                      <div>
                        <p className="text-sm font-mono text-purple-300">
                          {vendor.slice(0, 6)}...{vendor.slice(-4)}
                        </p>
                        <p className="text-xs text-gray-400">{data.transactions} transaction(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{data.totalPaid} ETH</p>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
          )}

          {/* Analytics Dashboard */}
          <AnalyticsDashboard
            transactions={transactionMetrics}
            isJourneyComplete={isJourneyComplete}
          />
          
          {/* Audit Log Exporter */}
          {isJourneyComplete && (
            <AuditLogExporter
              transactions={transactionMetrics}
              ipfsProofs={ipfsProofs}
              bookingId={booking.bookingId}
              destination={destination.name}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          
          {/* Blockchain Info */}
          <NeonCard glowColor="gray" className="text-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Blockchain Contract Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Network</p>
                  <p className="text-sm text-cyan-400">Sepolia Testnet (Real Transactions)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Booking ID</p>
                  <p className="text-sm text-purple-400 font-mono">{booking?.bookingId || 'Initializing...'}</p>
                </div>
              </div>
              
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                <Activity className="h-3 w-3 mr-1" />
                Live Milestone-Based Escrow Active
              </Badge>
            </div>
          </NeonCard>
        </>
      )}
    </div>
  );
}
