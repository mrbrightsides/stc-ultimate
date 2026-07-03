'use client';

import { useState, useCallback } from 'react';
import { JourneyDashboard } from './journey-dashboard';
import { MilestoneJourneyDashboard } from './milestone-journey-dashboard';
import { GroupBooking } from './group-booking';
import { RefundDispute } from './refund-dispute';
import { LoyaltyRewards } from './loyalty-rewards';
import { ScenarioSelector, type TravelScenario } from './scenario-selector';
import { DESTINATIONS } from '@/lib/destinations-config';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Trophy, 
  Zap,
  CheckCircle,
  Settings,
  MapPin,
  Calendar
} from 'lucide-react';
import type { TourPackage } from '@/app/types/contracts';

interface EnhancedDashboardProps {
  tourPackage: TourPackage;
  onServiceTrigger: (serviceId: number, memberId?: string) => void;
  onFinalizeTour: () => void;
  onRefundIssued: (serviceId: number, amount: string) => void;
  onServiceSkipped: (serviceId: number) => void;
  onClaimReward: (rewardId: string) => void;
  onMintNFT: (achievementId: string) => void;
  onBackToBuilder: () => void;
  walletConnected: boolean;
}

export function EnhancedDashboard({
  tourPackage,
  onServiceTrigger,
  onFinalizeTour,
  onRefundIssued,
  onServiceSkipped,
  onClaimReward,
  onMintNFT,
  onBackToBuilder,
  walletConnected
}: EnhancedDashboardProps) {
  // Phase 4: Simplified - No scenario selector, directly to milestone journey
  const completedServices = tourPackage.services.filter(s => s.status === 'completed').length;
  const totalServices = tourPackage.services.length;
  const isCompleted = completedServices === totalServices;

  const getScenarioIcon = (scenario: TravelScenario) => {
    switch (scenario) {
      case 'full-journey':
        return <Zap className="h-4 w-4" />;
      case 'partial-selection':
        return <CheckCircle className="h-4 w-4" />;
      case 'group-booking':
        return <Users className="h-4 w-4" />;
      case 'refund-dispute':
        return <Shield className="h-4 w-4" />;
      case 'loyalty-rewards':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getScenarioName = (scenario: TravelScenario): string => {
    switch (scenario) {
      case 'full-journey':
        return 'Full Journey';
      case 'partial-selection':
        return 'Flexible Selection';
      case 'group-booking':
        return 'Group Travel';
      case 'refund-dispute':
        return 'Secure Protection';
      case 'loyalty-rewards':
        return 'Rewards Program';
      default:
        return 'Travel Experience';
    }
  };

  const getScenarioColor = (scenario: TravelScenario): string => {
    switch (scenario) {
      case 'full-journey':
        return 'cyan';
      case 'partial-selection':
        return 'purple';
      case 'group-booking':
        return 'green';
      case 'refund-dispute':
        return 'orange';
      case 'loyalty-rewards':
        return 'yellow';
      default:
        return 'cyan';
    }
  };

  // Phase 4: Directly show milestone journey dashboard (no scenario selector)
  return (
    <div className="space-y-8">
      <MilestoneJourneyDashboard
        destination={DESTINATIONS.find(d => d.id === tourPackage.destination) || DESTINATIONS[0]}
        startDate={tourPackage.startDate}
        endDate={tourPackage.endDate}
        duration={parseInt(tourPackage.endDate.split('/')[0]) - parseInt(tourPackage.startDate.split('/')[0]) || 3}
        onJourneyComplete={onFinalizeTour}
      />
    </div>
  );
}