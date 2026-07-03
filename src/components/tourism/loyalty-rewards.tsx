'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Gift, 
  Star, 
  Award, 
  Target,
  Zap,
  Crown,
  Medal,
  Coins,
  Sparkles,
  CheckCircle,
  Lock,
  ArrowRight,
  Download
} from 'lucide-react';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import type { TourPackage } from '@/app/types/contracts';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Reward {
  id: string;
  type: 'nft' | 'token' | 'voucher' | 'badge';
  name: string;
  description: string;
  value: string;
  claimed: boolean;
  claimableAt: Date;
  image?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LoyaltyRewardsProps {
  tourPackage: TourPackage;
  completedServices: number;
  onClaimReward: (rewardId: string) => void;
  onMintNFT: (achievementId: string) => void;
  walletConnected: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-flight',
    name: 'Sky High',
    description: 'Complete your first flight service',
    icon: 'plane',
    unlocked: false,
    requirement: 'Complete flight booking service',
    points: 100,
    rarity: 'common'
  },
  {
    id: 'hotel-master',
    name: 'Home Away',
    description: 'Successfully check in to your hotel',
    icon: 'hotel',
    unlocked: false,
    requirement: 'Complete hotel check-in',
    points: 150,
    rarity: 'common'
  },
  {
    id: 'foodie-explorer',
    name: 'Culinary Explorer',
    description: 'Dine at a fine restaurant',
    icon: 'utensils',
    unlocked: false,
    requirement: 'Complete dining experience',
    points: 200,
    rarity: 'rare'
  },
  {
    id: 'full-journey',
    name: 'Journey Master',
    description: 'Complete your entire travel package',
    icon: 'trophy',
    unlocked: false,
    requirement: 'Complete all services in package',
    points: 500,
    rarity: 'epic'
  },
  {
    id: 'speed-runner',
    name: 'Lightning Traveler',
    description: 'Complete all services within 24 hours',
    icon: 'zap',
    unlocked: false,
    requirement: 'Complete journey in under 24 hours',
    points: 750,
    rarity: 'legendary'
  }
];

const LOYALTY_REWARDS: Reward[] = [
  {
    id: 'welcome-tokens',
    type: 'token',
    name: 'Welcome Tokens',
    description: '50 STC tokens for starting your journey',
    value: '50 STC',
    claimed: false,
    claimableAt: new Date(),
    rarity: 'common'
  },
  {
    id: 'journey-nft',
    type: 'nft',
    name: 'Journey NFT Passport',
    description: 'Unique NFT commemorating your travel experience',
    value: 'Dynamic NFT',
    claimed: false,
    claimableAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Available after full completion
    image: '/api/placeholder/200/200',
    rarity: 'epic'
  },
  {
    id: 'discount-voucher',
    type: 'voucher',
    name: '25% Discount Voucher',
    description: 'Use on your next travel package booking',
    value: '25% OFF',
    claimed: false,
    claimableAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    rarity: 'rare'
  },
  {
    id: 'vip-badge',
    type: 'badge',
    name: 'VIP Traveler Badge',
    description: 'Exclusive access to premium services',
    value: 'VIP Status',
    claimed: false,
    claimableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    rarity: 'legendary'
  }
];

export function LoyaltyRewards({ 
  tourPackage, 
  completedServices,
  onClaimReward,
  onMintNFT,
  walletConnected 
}: LoyaltyRewardsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [rewards, setRewards] = useState<Reward[]>(LOYALTY_REWARDS);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const { ethToUsd } = useCurrencyConverter();

  // Update achievements based on completed services
  useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      const wasUnlocked = achievement.unlocked;
      
      switch (achievement.id) {
        case 'first-flight':
          achievement.unlocked = tourPackage.services.some(s => 
            s.icon === 'plane' && s.status === 'completed'
          );
          break;
        case 'hotel-master':
          achievement.unlocked = tourPackage.services.some(s => 
            s.icon === 'hotel' && s.status === 'completed'
          );
          break;
        case 'foodie-explorer':
          achievement.unlocked = tourPackage.services.some(s => 
            s.icon === 'utensils' && s.status === 'completed'
          );
          break;
        case 'full-journey':
          achievement.unlocked = completedServices === tourPackage.services.length;
          break;
        case 'speed-runner':
          // Simulate speed completion check
          achievement.unlocked = completedServices === tourPackage.services.length && 
            Math.random() > 0.5; // 50% chance for demo
          break;
      }
      
      if (achievement.unlocked && !wasUnlocked) {
        achievement.unlockedAt = new Date();
      }
      
      return achievement;
    });

    setAchievements(updatedAchievements);
    
    // Update loyalty points
    const totalPoints = updatedAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setLoyaltyPoints(totalPoints);
    
    // Calculate user level (every 500 points = 1 level)
    setUserLevel(Math.floor(totalPoints / 500) + 1);
    
  }, [completedServices, tourPackage.services]);

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400 border-gray-500';
      case 'rare':
        return 'text-blue-400 border-blue-500';
      case 'epic':
        return 'text-purple-400 border-purple-500';
      case 'legendary':
        return 'text-yellow-400 border-yellow-500';
      default:
        return 'text-gray-400 border-gray-500';
    }
  };

  const getRarityGlow = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return 'gray';
      case 'rare':
        return 'blue';
      case 'epic':
        return 'purple';
      case 'legendary':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getAchievementIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'plane': '✈️',
      'hotel': '🏨',
      'utensils': '🍽️',
      'trophy': '🏆',
      'zap': '⚡'
    };
    return icons[iconName] || '🏆';
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'nft':
        return <Award className="h-6 w-6" />;
      case 'token':
        return <Coins className="h-6 w-6" />;
      case 'voucher':
        return <Gift className="h-6 w-6" />;
      case 'badge':
        return <Medal className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const claimReward = (rewardId: string): void => {
    setRewards(prev => prev.map(reward =>
      reward.id === rewardId
        ? { ...reward, claimed: true }
        : reward
    ));
    onClaimReward(rewardId);
  };

  const mintAchievementNFT = (achievementId: string): void => {
    onMintNFT(achievementId);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const claimableRewards = rewards.filter(r => 
    !r.claimed && new Date() >= r.claimableAt
  );
  const upcomingRewards = rewards.filter(r => 
    !r.claimed && new Date() < r.claimableAt
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
          Loyalty Rewards Program
        </h2>
        <p className="text-gray-300 text-lg">
          Earn exclusive NFTs, tokens, and perks by completing your travel journey
        </p>
      </div>

      {/* User Progress Overview */}
      <NeonCard glowColor="yellow" intense>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-yellow-500/20">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">Level {userLevel} Traveler</h3>
                <p className="text-yellow-300">Journey Master Status</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-400">{loyaltyPoints}</p>
              <p className="text-sm text-gray-400">Loyalty Points</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-yellow-400">{unlockedAchievements.length}</p>
              <p className="text-sm text-yellow-300">Achievements</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-400">{completedServices}/{tourPackage.services.length}</p>
              <p className="text-sm text-green-300">Services Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Gift className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-400">{claimableRewards.length}</p>
              <p className="text-sm text-purple-300">Rewards Available</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Star className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-cyan-400">{userLevel}</p>
              <p className="text-sm text-cyan-300">Traveler Level</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress to Level {userLevel + 1}</span>
              <span className="text-yellow-400">{loyaltyPoints % 500}/500 points</span>
            </div>
            <Progress 
              value={(loyaltyPoints % 500) / 5} 
              className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-orange-500"
            />
          </div>
        </div>
      </NeonCard>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="space-y-6">
          <NeonCard glowColor="purple">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Trophy className="h-6 w-6 text-purple-400" />
                Achievements
              </h3>

              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked
                        ? `bg-${getRarityGlow(achievement.rarity)}-500/10 border-${getRarityGlow(achievement.rarity)}-500/30`
                        : 'bg-gray-800/30 border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h4>
                            <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                            {achievement.description}
                          </p>
                          <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {achievement.requirement}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {achievement.unlocked ? (
                          <>
                            <div className="text-right">
                              <p className="text-yellow-400 font-bold">+{achievement.points}</p>
                              <p className="text-xs text-gray-400">points</p>
                            </div>
                            <NeonButton
                              size="sm"
                              variant="secondary"
                              onClick={() => mintAchievementNFT(achievement.id)}
                              disabled={!walletConnected}
                            >
                              <Download className="h-3 w-3" />
                              Mint NFT
                            </NeonButton>
                          </>
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-400">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Rewards */}
        <div className="space-y-6">
          {/* Claimable Rewards */}
          <NeonCard glowColor="green">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Gift className="h-6 w-6 text-green-400" />
                Available Rewards
                {claimableRewards.length > 0 && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                    {claimableRewards.length} Ready!
                  </Badge>
                )}
              </h3>

              {claimableRewards.length > 0 ? (
                <div className="space-y-3">
                  {claimableRewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-lg bg-${getRarityGlow(reward.rarity)}-500/10 border border-${getRarityGlow(reward.rarity)}-500/30`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-${getRarityGlow(reward.rarity)}-500/20`}>
                            {getRewardIcon(reward.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">{reward.name}</h4>
                              <Badge className={`text-xs ${getRarityColor(reward.rarity)}`}>
                                {reward.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300">{reward.description}</p>
                            <p className="text-sm font-medium text-cyan-400 mt-1">
                              Value: {reward.value}
                            </p>
                          </div>
                        </div>
                        
                        <NeonButton
                          size="sm"
                          variant="success"
                          onClick={() => claimReward(reward.id)}
                          disabled={!walletConnected}
                        >
                          <Download className="h-3 w-3" />
                          Claim
                        </NeonButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Complete more services to unlock rewards!</p>
                </div>
              )}
            </div>
          </NeonCard>

          {/* Upcoming Rewards */}
          {upcomingRewards.length > 0 && (
            <NeonCard glowColor="orange">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Target className="h-5 w-5 text-orange-400" />
                  Upcoming Rewards
                </h3>

                <div className="space-y-3">
                  {upcomingRewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-500/20 opacity-50">
                            {getRewardIcon(reward.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white opacity-75">{reward.name}</h4>
                            <p className="text-sm text-gray-400">{reward.value}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-orange-400">Unlocks in</p>
                          <p className="text-sm text-orange-300">
                            {Math.ceil((reward.claimableAt.getTime() - Date.now()) / (1000 * 60 * 60))}h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
          )}
        </div>
      </div>

      {/* Special Journey Completion Reward */}
      {completedServices === tourPackage.services.length && (
        <NeonCard glowColor="rainbow" intense className="text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Journey Complete!
              </h3>
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            
            <p className="text-gray-300 text-lg">
              Congratulations! You've completed your entire travel package and unlocked exclusive rewards!
            </p>
            
            <div className="flex justify-center gap-4">
              <NeonButton size="lg" variant="success">
                <Award className="h-5 w-5" />
                Mint Journey NFT
              </NeonButton>
              <NeonButton size="lg" variant="primary">
                <Coins className="h-5 w-5" />
                Claim Bonus Tokens
              </NeonButton>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}