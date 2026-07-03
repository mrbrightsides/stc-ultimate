'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Gift, 
  Zap,
  ArrowRight,
  CheckCircle,
  UsersRound,
  RefreshCcw,
  Trophy
} from 'lucide-react';

export type TravelScenario = 
  | 'full-journey' 
  | 'partial-selection' 
  | 'group-booking' 
  | 'refund-dispute' 
  | 'loyalty-rewards';

interface ScenarioSelectorProps {
  selectedScenario: TravelScenario;
  onScenarioChange: (scenario: TravelScenario) => void;
  onStartJourney: () => void;
}

const SCENARIOS = [
  {
    id: 'full-journey' as const,
    name: 'Full Journey',
    icon: Zap,
    description: 'Complete travel package with all services included',
    features: [
      'All services pre-selected',
      'Sequential trigger events',
      'Automatic escrow management',
      'Real-time payment tracking'
    ],
    color: 'cyan',
    badge: 'Standard',
    recommended: true
  },
  {
    id: 'partial-selection' as const,
    name: 'Flexible Selection',
    icon: UserCheck,
    description: 'Choose only the services you need for maximum flexibility',
    features: [
      'Customize service selection',
      'Pay only for chosen services',
      'Skip unwanted activities',
      'Optimal cost management'
    ],
    color: 'purple',
    badge: 'Flexible',
    recommended: false
  },
  {
    id: 'group-booking' as const,
    name: 'Group Travel',
    icon: UsersRound,
    description: 'Perfect for families and groups traveling together',
    features: [
      'Multi-person booking',
      'Individual activity triggers',
      'Shared payment escrow',
      'Group progress tracking'
    ],
    color: 'green',
    badge: 'Popular',
    recommended: false
  },
  {
    id: 'refund-dispute' as const,
    name: 'Secure Protection',
    icon: Shield,
    description: 'Built-in refund and dispute resolution system',
    features: [
      'Automatic refund logic',
      'Dispute resolution',
      'Service timeout handling',
      'Smart contract protection'
    ],
    color: 'orange',
    badge: 'Safe',
    recommended: false
  },
  {
    id: 'loyalty-rewards' as const,
    name: 'Rewards Program',
    icon: Trophy,
    description: 'Earn NFTs and tokens by completing your journey',
    features: [
      'Journey completion NFTs',
      'Loyalty token rewards',
      'Achievement system',
      'Exclusive perks'
    ],
    color: 'yellow',
    badge: 'Premium',
    recommended: false
  }
];

export function ScenarioSelector({ 
  selectedScenario, 
  onScenarioChange, 
  onStartJourney 
}: ScenarioSelectorProps) {
  const [hoveredScenario, setHoveredScenario] = useState<TravelScenario | null>(null);

  const getGlowColor = (scenarioId: TravelScenario): string => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    return scenario?.color || 'cyan';
  };

  const getBadgeStyle = (badge: string): string => {
    switch (badge) {
      case 'Standard':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      case 'Flexible':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'Popular':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'Safe':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'Premium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Choose Your Travel Experience
        </h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Select the perfect booking scenario for your needs. Each scenario is optimized for different travel styles and preferences.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {SCENARIOS.map((scenario) => {
          const IconComponent = scenario.icon;
          const isSelected = selectedScenario === scenario.id;
          const isHovered = hoveredScenario === scenario.id;
          
          return (
            <NeonCard
              key={scenario.id}
              glowColor={scenario.color as any}
              intense={isSelected || isHovered}
              className={`cursor-pointer transition-all duration-300 relative ${
                isSelected ? 'ring-2 ring-' + scenario.color + '-500' : ''
              }`}
              onMouseEnter={() => setHoveredScenario(scenario.id)}
              onMouseLeave={() => setHoveredScenario(null)}
              onClick={() => onScenarioChange(scenario.id)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${scenario.color}-500/20`}>
                      <IconComponent className={`h-6 w-6 text-${scenario.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{scenario.name}</h3>
                      <Badge className={`${getBadgeStyle(scenario.badge)} text-xs mt-1`}>
                        {scenario.badge}
                      </Badge>
                    </div>
                  </div>
                  
                  {scenario.recommended && (
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  )}

                  {isSelected && (
                    <div className={`p-1 rounded-full bg-${scenario.color}-500`}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {scenario.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {scenario.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className={`h-3 w-3 text-${scenario.color}-400 flex-shrink-0`} />
                      <span className="text-xs text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg bg-${scenario.color}-500/10 border border-${scenario.color}-500/30`}>
                    <CheckCircle className={`h-4 w-4 text-${scenario.color}-400`} />
                    <span className={`text-sm text-${scenario.color}-300 font-medium`}>
                      Selected - Ready to start your journey!
                    </span>
                  </div>
                )}
              </div>
            </NeonCard>
          );
        })}
      </div>

      {/* Scenario Details */}
      {selectedScenario && (
        <NeonCard glowColor={getGlowColor(selectedScenario)} intense>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">
                {SCENARIOS.find(s => s.id === selectedScenario)?.name} Experience
              </h3>
              <p className="text-gray-300">
                {SCENARIOS.find(s => s.id === selectedScenario)?.description}
              </p>
            </div>

            {/* Scenario-specific info */}
            {selectedScenario === 'group-booking' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-green-300 font-medium">Group Booking Ready</h4>
                    <p className="text-green-200 text-sm mt-1">
                      You'll be able to add multiple travelers and manage individual activity triggers for each group member.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedScenario === 'refund-dispute' && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-orange-300 font-medium">Protection Enabled</h4>
                    <p className="text-orange-200 text-sm mt-1">
                      Automatic refund logic and dispute resolution are activated for your journey.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedScenario === 'loyalty-rewards' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-300 font-medium">Rewards Active</h4>
                    <p className="text-yellow-200 text-sm mt-1">
                      Complete your journey to earn exclusive NFTs and loyalty tokens!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <NeonButton
                size="lg"
                onClick={onStartJourney}
                className="min-w-64"
              >
                Start Your {SCENARIOS.find(s => s.id === selectedScenario)?.name} Journey
                <ArrowRight className="h-5 w-5" />
              </NeonButton>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}