'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Hotel,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { RealMNEETransactionHandler } from './real-mnee-transaction-handler';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

interface EscrowBookingFlowProps {
  userAddress: string | null;
  onEscrowCreated: (escrow: TourEscrow) => void;
  onSplitCreated: (split: RevenueSplit) => void;
  isProcessing?: boolean;
}

interface BookingDetails {
  destination: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: string;
}

export function EscrowBookingFlow({
  userAddress,
  onEscrowCreated,
  onSplitCreated,
  isProcessing = false
}: EscrowBookingFlowProps) {
  const { isConnected, chain } = useAccount();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [useRealTransaction, setUseRealTransaction] = useState<boolean>(false);
  const [booking, setBooking] = useState<BookingDetails>({
    destination: 'Bali, Indonesia',
    hotelName: 'Grand Hyatt Bali',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    guests: 2,
    totalAmount: '0.01', // MNEE (USD equivalent) - small amount for demo/testing
  });

  // Stakeholders for revenue split
  const stakeholders = {
    hotel: '0x8ba1f109551bd432803012645aac136c6d2d9b59',
    tourGuide: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db',
    platform: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf',
    treasury: '0x78731d3ca6b7e34ac0f824c42a7cc18a495cabab',
  };

  // Calculate revenue split
  const calculateSplit = () => {
    const total = parseFloat(booking.totalAmount);
    return [
      { 
        address: stakeholders.hotel, 
        name: 'Hotel', 
        role: 'Accommodation Provider',
        percentage: 70,
        amount: (total * 0.70).toFixed(2) 
      },
      { 
        address: stakeholders.tourGuide, 
        name: 'Tour Guide', 
        role: 'Guide Service',
        percentage: 15,
        amount: (total * 0.15).toFixed(2) 
      },
      { 
        address: stakeholders.platform, 
        name: 'Platform', 
        role: 'Service Fee',
        percentage: 10,
        amount: (total * 0.10).toFixed(2) 
      },
      { 
        address: stakeholders.treasury, 
        name: 'Treasury', 
        role: 'Platform Treasury',
        percentage: 5,
        amount: (total * 0.05).toFixed(2) 
      },
    ];
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBooking = async () => {
    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    // If using real transaction, skip to step 3 for transaction confirmation
    // Real transaction handler will handle the actual booking
    if (useRealTransaction) {
      return; // Real transaction is handled by RealMNEETransactionHandler component
    }

    try {
      toast.info('Creating escrow and revenue split...');
      
      // Simulate escrow creation (demo mode)
      const mockEscrow: TourEscrow = {
        escrowId: Math.random().toString(36).substring(7),
        tourist: userAddress,
        operator: stakeholders.hotel,
        amount: booking.totalAmount,
        amountUSD: booking.totalAmount,
        status: 0,
        statusText: 'Pending',
        createdAt: Date.now(),
        serviceId: `booking-${Date.now()}`,
        serviceName: `${booking.hotelName} - ${booking.destination}`,
        tokenAddress: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      };
      
      // Simulate split creation (demo mode)
      const mockSplit: RevenueSplit = {
        splitId: Math.random().toString(36).substring(7),
        bookingId: mockEscrow.serviceId,
        creator: userAddress,
        totalAmount: booking.totalAmount,
        totalAmountUSD: booking.totalAmount,
        recipients: calculateSplit().map(s => ({
          ...s,
          amountUSD: s.amount,
        })),
        status: 1, // Executed
        statusText: 'Executed',
        createdAt: Date.now(),
        executedAt: Date.now() + 2000,
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        executeTxHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      };

      // Notify parent components
      onEscrowCreated(mockEscrow);
      onSplitCreated(mockSplit);
      
      toast.success('Booking confirmed! Escrow created and payments distributed.');
      setStep(4);
      
    } catch (error) {
      toast.error('Booking failed. Please try again.');
      console.error('Booking error:', error);
    }
  };

  const handleRealTransactionSuccess = (escrow: TourEscrow, split: RevenueSplit) => {
    // Save to localStorage
    onEscrowCreated(escrow);
    onSplitCreated(split);
    
    // Move to confirmation step
    setStep(4);
  };

  const handleRealTransactionError = (error: string) => {
    console.error('Real transaction error:', error);
    toast.error(`Transaction failed: ${error}`);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            s < step ? 'bg-green-500 text-white' :
            s === step ? 'bg-cyan-500 text-white' :
            'bg-gray-700 text-gray-400'
          }`}>
            {s < step ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
          {s < 4 && (
            <div className={`flex-1 h-1 mx-2 ${
              s < step ? 'bg-green-500' : 'bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      {/* Step 1: Booking Details */}
      {step === 1 && (
        <NeonCard glowColor="cyan">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 rounded-full bg-cyan-500/20 mb-4">
                <Hotel className="h-8 w-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <p className="text-gray-400">Enter your travel information</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={booking.destination}
                    onChange={(e) => setBooking({...booking, destination: e.target.value})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Hotel Name</Label>
                <div className="relative">
                  <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={booking.hotelName}
                    onChange={(e) => setBooking({...booking, hotelName: e.target.value})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Check-in Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => setBooking({...booking, checkIn: e.target.value})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Check-out Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => setBooking({...booking, checkOut: e.target.value})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    value={booking.guests}
                    onChange={(e) => setBooking({...booking, guests: parseInt(e.target.value)})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Total Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    value={booking.totalAmount}
                    onChange={(e) => setBooking({...booking, totalAmount: e.target.value})}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-white"
                  />
                </div>
              </div>
            </div>

            <NeonButton
              variant="primary"
              className="w-full"
              onClick={handleNext}
            >
              Continue to Payment <ArrowRight className="h-4 w-4 ml-2" />
            </NeonButton>
          </div>
        </NeonCard>
      )}

      {/* Step 2: Review & Escrow */}
      {step === 2 && (
        <NeonCard glowColor="purple">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 rounded-full bg-purple-500/20 mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Secure Escrow</h2>
              <p className="text-gray-400">Your payment will be held safely until service completion</p>
            </div>

            {/* Booking Summary */}
            <div className="p-6 rounded-lg bg-black/30 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Destination</span>
                <span className="text-white font-semibold">{booking.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hotel</span>
                <span className="text-white font-semibold">{booking.hotelName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Dates</span>
                <span className="text-white font-semibold">
                  {booking.checkIn} to {booking.checkOut}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Guests</span>
                <span className="text-white font-semibold">{booking.guests}</span>
              </div>
              <div className="pt-4 border-t border-purple-500/30 flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-purple-400">
                  ${parseFloat(booking.totalAmount).toLocaleString()} MNEE
                </span>
              </div>
            </div>

            {/* Escrow Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 text-center">
                <Lock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Funds Locked</p>
                <p className="text-xs text-gray-500 mt-1">Until service verified</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 text-center">
                <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">100% Secure</p>
                <p className="text-xs text-gray-500 mt-1">Smart contract protected</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 text-center">
                <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Auto-Release</p>
                <p className="text-xs text-gray-500 mt-1">After verification</p>
              </div>
            </div>

            <div className="flex gap-4">
              <NeonButton
                variant="secondary"
                className="flex-1"
                onClick={handleBack}
              >
                Back
              </NeonButton>
              <NeonButton
                variant="primary"
                className="flex-1"
                onClick={handleNext}
              >
                Continue to Split <ArrowRight className="h-4 w-4 ml-2" />
              </NeonButton>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Step 3: Revenue Split */}
      {step === 3 && (
        <NeonCard glowColor="green">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 rounded-full bg-green-500/20 mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Automated Revenue Split</h2>
              <p className="text-gray-400">Payment will be automatically distributed to stakeholders</p>
            </div>

            {/* Split Breakdown */}
            <div className="space-y-3">
              {calculateSplit().map((recipient, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-black/30 border border-green-500/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{recipient.name}</p>
                      <p className="text-xs text-gray-400">{recipient.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">
                        ${parseFloat(recipient.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{recipient.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={recipient.percentage} className="h-2" />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total Distribution</span>
                <span className="text-2xl font-bold text-green-400">
                  ${parseFloat(booking.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Real Transaction Toggle */}
            <div className="p-6 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-white font-semibold">Transaction Mode</p>
                  <p className="text-sm text-gray-400">
                    {useRealTransaction 
                      ? '🔥 Real blockchain transaction with MNEE on Ethereum Mainnet' 
                      : '🎮 Demo mode - simulated transaction (no gas fees)'}
                  </p>
                </div>
                <button
                  onClick={() => setUseRealTransaction(!useRealTransaction)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    useRealTransaction ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      useRealTransaction ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {useRealTransaction && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Real MNEE will be transferred to stakeholders</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Transaction hash will be recorded on-chain</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Wallet className="h-4 w-4" />
                    <span>You must have MNEE balance + gas fees (ETH)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            {useRealTransaction ? (
              <div className="space-y-4">
                <RealMNEETransactionHandler
                  booking={booking}
                  onSuccess={handleRealTransactionSuccess}
                  onError={handleRealTransactionError}
                />
                <NeonButton
                  variant="secondary"
                  className="w-full"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </NeonButton>
              </div>
            ) : (
              <div className="flex gap-4">
                <NeonButton
                  variant="secondary"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Back
                </NeonButton>
                <NeonButton
                  variant="primary"
                  className="flex-1"
                  onClick={handleBooking}
                  loading={isProcessing}
                  disabled={!userAddress}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Confirm & Pay (Demo)
                </NeonButton>
              </div>
            )}
          </div>
        </NeonCard>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <NeonCard glowColor="green" intense>
          <div className="text-center space-y-6 py-8">
            <div className="inline-block p-6 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Booking Confirmed!</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Your payment has been secured in escrow and will be automatically distributed to all stakeholders upon service completion.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
              <div className="p-6 rounded-lg bg-black/30 border border-green-500/30">
                <Lock className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <p className="font-semibold text-white">Escrow Active</p>
                <p className="text-sm text-gray-400 mt-2">
                  ${booking.totalAmount} MNEE secured
                </p>
              </div>
              <div className="p-6 rounded-lg bg-black/30 border border-green-500/30">
                <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <p className="font-semibold text-white">Split Created</p>
                <p className="text-sm text-gray-400 mt-2">
                  {calculateSplit().length} recipients ready
                </p>
              </div>
            </div>

            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => setStep(1)}
            >
              Make Another Booking
            </NeonButton>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
