'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Hotel, 
  Car, 
  Utensils, 
  ShoppingBag, 
  Sparkles,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  QrCode,
  Fingerprint,
  Radio,
  MapPin
} from 'lucide-react';
import type { ServiceMilestone } from '@/lib/destinations-config';
import MockGPSVerifier from '@/components/mock-gps-verifier';
import { MockBiometricVerifier } from '@/components/mock-biometric-verifier';
import { MockRFIDScanner } from '@/components/mock-rfid-scanner';

interface MilestoneTimelineProps {
  milestones: ServiceMilestone[];
  completedMilestones?: string[]; // Array of completed milestone IDs
  currentMilestone?: string; // Currently active milestone ID
  showDetails?: boolean;
  onGPSVerified?: (milestoneId: string) => void; // Callback when GPS is verified
  onBiometricVerified?: (milestoneId: string) => void; // Callback when biometric is verified
  onRFIDScanned?: (milestoneId: string) => void; // Callback when RFID is scanned
  destinationName?: string; // For GPS verifier context
  userName?: string; // For biometric verifier context
}

const getServiceIcon = (type: string) => {
  const icons = {
    'flight': Plane,
    'hotel': Hotel,
    'transport': Car,
    'meal': Utensils,
    'souvenir': ShoppingBag,
    'activity': Sparkles,
  };
  return icons[type as keyof typeof icons] || Sparkles;
};

const getTriggerIcon = (triggerEvent: string) => {
  const icons = {
    'qr_scan': QrCode,
    'rfid_scan': Radio,
    'biometric': Fingerprint,
    'gps': MapPin,
  };
  return icons[triggerEvent as keyof typeof icons] || QrCode;
};

const getTriggerLabel = (triggerEvent: string): string => {
  const labels = {
    'qr_scan': 'QR Code Scan',
    'rfid_scan': 'RFID Card',
    'biometric': 'Biometric Auth',
    'gps': 'GPS Location',
  };
  return labels[triggerEvent as keyof typeof labels] || 'Verification';
};

const getTypeColor = (type: string): string => {
  const colors = {
    'flight': 'blue',
    'hotel': 'purple',
    'transport': 'green',
    'meal': 'orange',
    'activity': 'pink',
    'souvenir': 'yellow',
  };
  return colors[type as keyof typeof colors] || 'gray';
};

export function MilestoneTimeline({ 
  milestones, 
  completedMilestones = [], 
  currentMilestone,
  showDetails = true,
  onGPSVerified,
  onBiometricVerified,
  onRFIDScanned,
  destinationName = 'Destination',
  userName = 'User'
}: MilestoneTimelineProps) {
  const [verifiedGPS, setVerifiedGPS] = useState<Set<string>>(new Set());
  const [verifiedBiometric, setVerifiedBiometric] = useState<Set<string>>(new Set());
  const [scannedRFID, setScannedRFID] = useState<Set<string>>(new Set());

  const handleGPSVerified = (milestoneId: string): void => {
    setVerifiedGPS(prev => new Set(prev).add(milestoneId));

    if (onGPSVerified) {
      onGPSVerified(milestoneId);
    }
  };

  const handleBiometricVerified = (milestoneId: string): void => {
    setVerifiedBiometric(prev => new Set(prev).add(milestoneId));

    if (onBiometricVerified) {
      onBiometricVerified(milestoneId);
    }
  };

  const handleRFIDScanned = (milestoneId: string): void => {
    setScannedRFID(prev => new Set(prev).add(milestoneId));

    if (onRFIDScanned) {
      onRFIDScanned(milestoneId);
    }
  };

  const isGPSVerified = (milestoneId: string): boolean => {
    return verifiedGPS.has(milestoneId);
  };

  const isBiometricVerified = (milestoneId: string): boolean => {
    return verifiedBiometric.has(milestoneId);
  };

  const isRFIDScanned = (milestoneId: string): boolean => {
    return scannedRFID.has(milestoneId);
  };
  
  const isCompleted = (milestoneId: string): boolean => {
    return completedMilestones.includes(milestoneId);
  };

  const isCurrent = (milestoneId: string): boolean => {
    return currentMilestone === milestoneId;
  };

  const isPending = (milestoneId: string): boolean => {
    return !isCompleted(milestoneId) && !isCurrent(milestoneId);
  };

  // Sort milestones by sequence order
  const sortedMilestones = [...milestones].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Sequential Milestones</h3>
          <p className="text-gray-400 text-sm mt-1">
            Escrow akan dirilis secara bertahap setelah setiap milestone terverifikasi
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Milestones</p>
          <p className="text-2xl font-bold text-cyan-400">{sortedMilestones.length}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-xs text-gray-300">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-gray-300">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-300">Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <Unlock className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-gray-300">Released</span>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-gray-700" />

        <div className="space-y-4">
          {sortedMilestones.map((milestone, index) => {
            const ServiceIcon = getServiceIcon(milestone.type);
            const TriggerIcon = getTriggerIcon(milestone.triggerEvent);
            const typeColor = getTypeColor(milestone.type);
            const completed = isCompleted(milestone.id);
            const current = isCurrent(milestone.id);
            const pending = isPending(milestone.id);

            return (
              <div key={milestone.id} className="relative pl-16">
                {/* Timeline Dot */}
                <div 
                  className={`absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${completed ? 'bg-green-500 border-green-400' : ''}
                    ${current ? 'bg-cyan-500 border-cyan-400 animate-pulse' : ''}
                    ${pending ? 'bg-gray-700 border-gray-600' : ''}
                  `}
                >
                  {completed && <CheckCircle className="h-3 w-3 text-white" />}
                  {current && <Clock className="h-3 w-3 text-white" />}
                  {pending && <Lock className="h-3 w-3 text-gray-400" />}
                </div>

                {/* Milestone Card */}
                <NeonCard 
                  glowColor={completed ? 'green' : current ? 'cyan' : 'gray'} 
                  intense={current}
                  className={`transition-all ${current ? 'ring-2 ring-cyan-500' : ''}`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-${typeColor}-500/20 flex-shrink-0`}>
                          <ServiceIcon className={`h-5 w-5 text-${typeColor}-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-white">{milestone.name}</h4>
                            <Badge className={`text-xs bg-${typeColor}-500/20 text-${typeColor}-300 border-${typeColor}-500/50`}>
                              {milestone.type}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                        </div>
                      </div>

                      {/* Amount Badge */}
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                          completed ? 'bg-green-500/20' : 'bg-gray-700'
                        }`}>
                          {completed ? (
                            <Unlock className="h-3 w-3 text-green-400" />
                          ) : (
                            <Lock className="h-3 w-3 text-gray-500" />
                          )}
                          <span className={`font-semibold text-sm ${
                            completed ? 'text-green-400' : 'text-gray-300'
                          }`}>
                            {milestone.amount} ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    {showDetails && (
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                        {/* Timing */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Waktu</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-300">{milestone.estimatedTime}</span>
                          </div>
                        </div>

                        {/* Trigger Type */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Trigger IoT</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <TriggerIcon className="h-3 w-3 text-cyan-400" />
                            <span className="text-sm text-gray-300">{getTriggerLabel(milestone.triggerEvent)}</span>
                          </div>
                        </div>

                        {/* Vendor Address */}
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Vendor Address</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">
                              {milestone.vendorAddress.slice(0, 10)}...{milestone.vendorAddress.slice(-8)}
                            </code>
                            {milestone.isDailyCharge && (
                              <Badge className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/50">
                                Daily Charge
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Indicator */}
                    {completed && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-300">
                          ✅ Milestone complete - Vendor received payment
                        </span>
                      </div>
                    )}

                    {current && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 animate-pulse">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm text-cyan-300">
                            ⏳ Waiting for IoT verification...
                          </span>
                        </div>
                        
                        {/* GPS Verify Button for GPS-triggered milestones */}
                        {milestone.triggerEvent === 'gps' && !isGPSVerified(milestone.id) && (
                          <MockGPSVerifier
                            milestoneName={milestone.name}
                            destinationName={destinationName}
                            onVerificationComplete={() => handleGPSVerified(milestone.id)}
                            compact={false}
                          />
                        )}

                        {milestone.triggerEvent === 'gps' && isGPSVerified(milestone.id) && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-300">
                              ✓ GPS Location Verified
                            </span>
                          </div>
                        )}

                        {/* Biometric Verify for biometric-triggered milestones */}
                        {milestone.triggerEvent === 'biometric' && !isBiometricVerified(milestone.id) && (
                          <MockBiometricVerifier
                            onVerified={() => handleBiometricVerified(milestone.id)}
                            userName={userName}
                          />
                        )}

                        {milestone.triggerEvent === 'biometric' && isBiometricVerified(milestone.id) && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-300">
                              ✓ Biometric Identity Verified
                            </span>
                          </div>
                        )}

                        {/* RFID Scanner for RFID-triggered milestones */}
                        {milestone.triggerEvent === 'rfid_scan' && !isRFIDScanned(milestone.id) && (
                          <MockRFIDScanner
                            onScanned={() => handleRFIDScanned(milestone.id)}
                            locationName={destinationName}
                          />
                        )}

                        {milestone.triggerEvent === 'rfid_scan' && isRFIDScanned(milestone.id) && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-300">
                              ✓ RFID Access Card Verified
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </NeonCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <NeonCard glowColor="purple" intense>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-400 text-sm">Total Escrow</p>
            <p className="text-2xl font-bold text-purple-400">
              {sortedMilestones.reduce((sum, m) => sum + parseFloat(m.amount), 0).toFixed(3)} ETH
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {completedMilestones.length} / {sortedMilestones.length}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Released</p>
            <p className="text-2xl font-bold text-cyan-400">
              {sortedMilestones
                .filter(m => isCompleted(m.id))
                .reduce((sum, m) => sum + parseFloat(m.amount), 0)
                .toFixed(3)} ETH
            </p>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
