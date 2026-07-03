'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Gift, 
  Coins, 
  Medal, 
  Award, 
  Crown, 
  Zap,
  MapPin,
  Plane,
  Hotel,
  Car,
  Utensils,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Shield
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { TourPackage } from '@/app/types/contracts';

interface ComprehensiveRewardsProps {
  tourPackage: TourPackage;
  completedServices: number;
  totalAmount: string;
  transactionHashes: string[];
  onClaimRewards: () => void;
  walletAddress: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  type: 'journey' | 'spending' | 'exploration' | 'social';
}

interface STCReward {
  type: 'completion' | 'early_bird' | 'premium' | 'loyalty';
  amount: number;
  description: string;
  multiplier?: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-journey',
    title: 'First Steps',
    description: 'Completed your first Web3 tourism journey',
    icon: Plane,
    rarity: 'common',
    points: 100,
    unlocked: true,
    type: 'journey'
  },
  {
    id: 'luxury-traveler',
    title: 'Luxury Traveler',
    description: 'Spent over 0.05 ETH on premium services',
    icon: Crown,
    rarity: 'rare',
    points: 250,
    unlocked: true,
    type: 'spending'
  },
  {
    id: 'destination-explorer',
    title: 'Destination Explorer',
    description: 'Visited an exotic destination',
    icon: Globe,
    rarity: 'epic',
    points: 500,
    unlocked: true,
    type: 'exploration'
  },
  {
    id: 'blockchain-pioneer',
    title: 'Blockchain Pioneer',
    description: 'Completed all services using smart contracts',
    icon: Shield,
    rarity: 'legendary',
    points: 1000,
    unlocked: true,
    type: 'social'
  },
  {
    id: 'perfect-execution',
    title: 'Perfect Execution',
    description: 'Zero failed transactions in journey',
    icon: Target,
    rarity: 'epic',
    points: 750,
    unlocked: true,
    type: 'journey'
  },
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Among first 1000 users of STC Ultimate',
    icon: Star,
    rarity: 'legendary',
    points: 1500,
    unlocked: false,
    type: 'social'
  }
];

const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
    case 'rare': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    case 'epic': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
    case 'legendary': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
  }
};

const getRarityGlow = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'gray';
    case 'rare': return 'blue';
    case 'epic': return 'purple'; 
    case 'legendary': return 'yellow';
  }
};

export function ComprehensiveRewards({
  tourPackage,
  completedServices,
  totalAmount,
  transactionHashes,
  onClaimRewards,
  walletAddress
}: ComprehensiveRewardsProps) {
  const [showNFTPreview, setShowNFTPreview] = useState<boolean>(false);
  const [claimedRewards, setClaimedRewards] = useState<boolean>(false);
  const [totalSTCTokens, setTotalSTCTokens] = useState<number>(0);
  const [achievementPoints, setAchievementPoints] = useState<number>(0);
  const [certificateUrl, setCertificateUrl] = useState<string>('');

  const stcRewards: STCReward[] = [
    {
      type: 'completion',
      amount: Math.floor(parseFloat(totalAmount) * 1000), // 1000 STC per ETH
      description: 'Journey completion bonus'
    },
    {
      type: 'premium',
      amount: 500,
      description: 'Premium service usage bonus'
    },
    {
      type: 'early_bird',
      amount: 250,
      description: 'Early platform adopter bonus'
    },
    {
      type: 'loyalty',
      amount: 150,
      description: 'Loyalty program rewards',
      multiplier: 1.2
    }
  ];

  useEffect(() => {
    const points = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setAchievementPoints(points);

    const tokens = stcRewards.reduce((sum, reward) => {
      const amount = reward.multiplier ? reward.amount * reward.multiplier : reward.amount;
      return sum + amount;
    }, 0);
    setTotalSTCTokens(Math.floor(tokens));

    // Generate certificate URL (mock)
    setCertificateUrl(`https://stc-ultimate.vercel.app/certificate/${tourPackage.id}`);
  }, [tourPackage.id, totalAmount]);

  const handleClaimRewards = (): void => {
    setClaimedRewards(true);
    onClaimRewards();
    
    // Simulate NFT minting and token transfer
    setTimeout(() => {
      setShowNFTPreview(true);
    }, 2000);
  };

  const downloadCertificate = (): void => {
    // In a real app, this would generate and download a PDF certificate
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `stc-certificate-${tourPackage.destination.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  const shareAchievement = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'STC Ultimate Journey Complete!',
          text: `Just completed an amazing Web3 journey to ${tourPackage.destination} earning ${totalSTCTokens} STC tokens!`,
          url: certificateUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Journey Completion Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-purple-400/20 flex items-center justify-center animate-pulse">
          <Trophy className="h-12 w-12 text-yellow-400" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Journey Complete! 🎉
        </h2>
        <p className="text-gray-300 text-lg">
          Congratulations on completing your Web3 tourism journey to <span className="text-cyan-400 font-semibold">{tourPackage.destination}</span>
        </p>
      </div>

      {/* Rewards Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* STC Token Rewards */}
        <NeonCard glowColor="yellow" intense className="text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Coins className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-400">{totalSTCTokens.toLocaleString()}</h3>
              <p className="text-yellow-300 font-semibold">STC Tokens Earned</p>
              <p className="text-xs text-gray-400 mt-1">
                Est. value: ${(totalSTCTokens * 0.05).toFixed(2)} USD
              </p>
            </div>
            
            {/* Token Breakdown */}
            <div className="space-y-2 text-left">
              {stcRewards.map((reward, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-400">{reward.description}</span>
                  <span className="text-yellow-300 font-medium">
                    +{Math.floor(reward.multiplier ? reward.amount * reward.multiplier : reward.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </NeonCard>

        {/* Achievement Points */}
        <NeonCard glowColor="purple" intense className="text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Medal className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-400">{achievementPoints.toLocaleString()}</h3>
              <p className="text-purple-300 font-semibold">Achievement Points</p>
              <p className="text-xs text-gray-400 mt-1">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} achievements unlocked
              </p>
            </div>
            
            {/* Achievement Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Progress to next tier</span>
                <span className="text-purple-300">2,350 / 5,000</span>
              </div>
              <Progress 
                value={47} 
                className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500"
              />
            </div>
          </div>
        </NeonCard>

        {/* NFT Certificate */}
        <NeonCard glowColor="cyan" intense className="text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Award className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-400">Digital Certificate</h3>
              <p className="text-cyan-300 font-medium">Journey NFT Minted</p>
              <p className="text-xs text-gray-400 mt-1">
                Unique blockchain certificate
              </p>
            </div>
            
            <NeonButton
              size="sm"
              variant="secondary"
              onClick={() => setShowNFTPreview(true)}
              className="w-full"
            >
              <Sparkles className="h-4 w-4" />
              View Certificate
            </NeonButton>
          </div>
        </NeonCard>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-400" />
            Achievements Unlocked
          </h3>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
            {achievements.filter(a => a.unlocked).length} of {achievements.length}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <NeonCard 
              key={achievement.id} 
              glowColor={getRarityGlow(achievement.rarity) as any}
              className={`transition-all duration-300 ${achievement.unlocked ? '' : 'opacity-50'}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium text-yellow-400">
                    +{achievement.points} pts
                  </span>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* Journey Statistics */}
      <NeonCard glowColor="green">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Journey Statistics
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{completedServices}</p>
              <p className="text-sm text-gray-400">Services Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{totalAmount} ETH</p>
              <p className="text-sm text-gray-400">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{transactionHashes.length}</p>
              <p className="text-sm text-gray-400">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">100%</p>
              <p className="text-sm text-gray-400">Success Rate</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-green-500/20">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-2">Journey Timeline</p>
                <div className="space-y-1">
                  <p className="text-green-300">Start: {tourPackage.startDate}</p>
                  <p className="text-green-300">End: {tourPackage.endDate}</p>
                  <p className="text-green-300">Completion: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Blockchain Data</p>
                <div className="space-y-1">
                  <p className="text-cyan-300">Network: Sepolia Testnet</p>
                  <p className="text-cyan-300">Gas Saved: ~0.003 ETH</p>
                  <p className="text-cyan-300">Carbon Neutral: ✅</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Next Journey Recommendations */}
      <NeonCard glowColor="purple">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
              <MapPin className="h-6 w-6 text-purple-400" />
              Recommended Next Destinations
            </h3>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              PERSONALIZED
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {['Tokyo, Japan', 'Santorini, Greece', 'Dubai, UAE'].map((destination, index) => (
              <div key={destination} className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{destination}</h4>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50 text-xs">
                      {['NEW', 'POPULAR', 'TRENDING'][index]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span>Perfect match for your preferences</span>
                  </div>
                  <div className="text-xs text-purple-300">
                    Estimated cost: {['0.08', '0.06', '0.12'][index]} ETH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NeonCard>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!claimedRewards ? (
          <NeonButton
            size="lg"
            variant="primary"
            onClick={handleClaimRewards}
            className="min-w-48"
          >
            <Gift className="h-5 w-5" />
            Claim All Rewards
          </NeonButton>
        ) : (
          <>
            <NeonButton
              size="lg"
              variant="secondary"
              onClick={downloadCertificate}
            >
              <Download className="h-5 w-5" />
              Download Certificate
            </NeonButton>
            <NeonButton
              size="lg"
              variant="secondary"
              onClick={shareAchievement}
            >
              <Share2 className="h-5 w-5" />
              Share Achievement
            </NeonButton>
          </>
        )}
      </div>

      {/* NFT Certificate Modal */}
      {showNFTPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <NeonCard glowColor="cyan" intense>
              <div className="space-y-6 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-cyan-400">Digital Certificate</h3>
                  <p className="text-gray-300 mt-2">Journey Completion NFT</p>
                </div>
                
                {/* Mock NFT Preview */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-6 rounded-lg border border-cyan-500/50">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">STC Journey Certificate</h4>
                      <p className="text-cyan-300">{tourPackage.destination}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {tourPackage.startDate} - {tourPackage.endDate}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <QRCodeSVG
                        value={certificateUrl}
                        size={120}
                        bgColor="transparent"
                        fgColor="#22d3ee"
                      />
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Token ID: #{tourPackage.id}</p>
                      <p>Owner: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</p>
                      <p>Minted: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <NeonButton
                    variant="secondary"
                    onClick={() => setShowNFTPreview(false)}
                    className="flex-1"
                  >
                    Close
                  </NeonButton>
                  <NeonButton
                    variant="primary"
                    onClick={() => window.open(`https://testnets.opensea.io/assets/ethereum/${walletAddress}/${tourPackage.id}`, '_blank')}
                    className="flex-1"
                  >
                    View on OpenSea
                  </NeonButton>
                </div>
              </div>
            </NeonCard>
          </div>
        </div>
      )}
    </div>
  );
}