/**
 * NFT Gallery Hub Library
 * Integrated from Phase 2 NFT achievement features
 */

export interface NFTAchievement {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'destination' | 'activity' | 'milestone' | 'social' | 'special';
  earned: boolean;
  earnedDate?: Date;
  requirements: string;
  reward: {
    points: number;
    tokens?: number;
    badge?: string;
  };
  mintable: boolean;
  minted: boolean;
  tokenId?: number;
  contractAddress?: string;
}

export interface TourismBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  progress: number;
  category: 'explorer' | 'photographer' | 'cultural' | 'adventure' | 'social';
  benefits: string[];
  nextLevelRequirement: string;
}

export interface NFTStats {
  totalAchievements: number;
  earnedAchievements: number;
  mintedNFTs: number;
  totalPoints: number;
  destinationsVisited: number;
  photosCaptured: number;
  completionRate: number;
}

export function getNFTGallery(): {
  achievements: NFTAchievement[];
  badges: TourismBadge[];
  stats: NFTStats;
} {
  const achievements: NFTAchievement[] = [
    {
      id: 'achieve-001',
      name: 'Borobudur Explorer',
      description: 'Visit the magnificent Borobudur Temple and complete the virtual tour',
      image: '🛕',
      rarity: 'epic',
      category: 'destination',
      earned: true,
      earnedDate: new Date('2024-01-15'),
      requirements: 'Complete Borobudur virtual tour and visit in real life',
      reward: {
        points: 500,
        tokens: 100,
        badge: 'Temple Master'
      },
      mintable: true,
      minted: false
    },
    {
      id: 'achieve-002',
      name: 'Komodo Spotter',
      description: 'Spot a Komodo dragon in its natural habitat',
      image: '🦎',
      rarity: 'legendary',
      category: 'activity',
      earned: true,
      earnedDate: new Date('2024-01-10'),
      requirements: 'Visit Komodo National Park and spot a Komodo dragon',
      reward: {
        points: 1000,
        tokens: 250,
        badge: 'Dragon Whisperer'
      },
      mintable: true,
      minted: true,
      tokenId: 12345,
      contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    {
      id: 'achieve-003',
      name: 'Raja Ampat Diver',
      description: 'Explore the underwater paradise of Raja Ampat',
      image: '🤿',
      rarity: 'epic',
      category: 'activity',
      earned: true,
      earnedDate: new Date('2024-01-12'),
      requirements: 'Complete a diving session in Raja Ampat',
      reward: {
        points: 750,
        tokens: 150,
        badge: 'Ocean Explorer'
      },
      mintable: true,
      minted: false
    },
    {
      id: 'achieve-004',
      name: 'Cultural Ambassador',
      description: 'Visit 5 different cultural sites across Indonesia',
      image: '🎭',
      rarity: 'rare',
      category: 'milestone',
      earned: false,
      requirements: 'Visit Borobudur, Prambanan, Tanah Lot, Uluwatu, and Ubud Palace',
      reward: {
        points: 1500,
        tokens: 300,
        badge: 'Culture Keeper'
      },
      mintable: false,
      minted: false
    },
    {
      id: 'achieve-005',
      name: 'Sunrise Chaser',
      description: 'Witness sunrise at Mount Bromo',
      image: '🌅',
      rarity: 'epic',
      category: 'destination',
      earned: true,
      earnedDate: new Date('2024-01-08'),
      requirements: 'Visit Mount Bromo viewpoint at sunrise',
      reward: {
        points: 600,
        tokens: 120,
        badge: 'Early Riser'
      },
      mintable: true,
      minted: false
    },
    {
      id: 'achieve-006',
      name: 'Social Butterfly',
      description: 'Connect with 10 other travelers on the platform',
      image: '🦋',
      rarity: 'common',
      category: 'social',
      earned: true,
      earnedDate: new Date('2024-01-18'),
      requirements: 'Connect and interact with 10 travelers',
      reward: {
        points: 200,
        tokens: 50,
        badge: 'Friend Maker'
      },
      mintable: true,
      minted: false
    },
    {
      id: 'achieve-007',
      name: 'Ubud Artist',
      description: 'Participate in a traditional art workshop in Ubud',
      image: '🎨',
      rarity: 'rare',
      category: 'activity',
      earned: false,
      requirements: 'Complete a traditional Balinese art workshop',
      reward: {
        points: 400,
        tokens: 80,
        badge: 'Creative Soul'
      },
      mintable: false,
      minted: false
    },
    {
      id: 'achieve-008',
      name: 'Indonesia Champion',
      description: 'Complete all destination achievements',
      image: '🏆',
      rarity: 'legendary',
      category: 'special',
      earned: false,
      requirements: 'Earn all destination-specific achievements',
      reward: {
        points: 5000,
        tokens: 1000,
        badge: 'Grand Master'
      },
      mintable: false,
      minted: false
    }
  ];

  const badges: TourismBadge[] = [
    {
      id: 'badge-001',
      name: 'Bronze Explorer',
      description: 'Visit 3 destinations',
      icon: '🥉',
      level: 1,
      maxLevel: 3,
      progress: 100,
      category: 'explorer',
      benefits: ['5% discount on bookings', 'Early access to new tours'],
      nextLevelRequirement: 'Visit 5 more destinations for Silver'
    },
    {
      id: 'badge-002',
      name: 'Novice Photographer',
      description: 'Capture 10 moments',
      icon: '📷',
      level: 1,
      maxLevel: 3,
      progress: 60,
      category: 'photographer',
      benefits: ['Photo contest entry', 'Featured in gallery'],
      nextLevelRequirement: 'Capture 15 more photos for Pro level'
    },
    {
      id: 'badge-003',
      name: 'Cultural Enthusiast',
      description: 'Attend 2 cultural events',
      icon: '🎭',
      level: 2,
      maxLevel: 5,
      progress: 40,
      category: 'cultural',
      benefits: ['Priority cultural event booking', 'Local guide discounts'],
      nextLevelRequirement: 'Attend 3 more events for next level'
    },
    {
      id: 'badge-004',
      name: 'Adventure Seeker',
      description: 'Complete 1 adventure activity',
      icon: '⛰️',
      level: 1,
      maxLevel: 5,
      progress: 20,
      category: 'adventure',
      benefits: ['Adventure gear rental discount', 'Safety training access'],
      nextLevelRequirement: 'Complete 4 more activities'
    },
    {
      id: 'badge-005',
      name: 'Social Connector',
      description: 'Connect with 10 travelers',
      icon: '🤝',
      level: 2,
      maxLevel: 3,
      progress: 100,
      category: 'social',
      benefits: ['Group tour discounts', 'Community event access'],
      nextLevelRequirement: 'Connect with 20 more for level 3'
    }
  ];

  const stats: NFTStats = {
    totalAchievements: 8,
    earnedAchievements: 5,
    mintedNFTs: 1,
    totalPoints: 3050,
    destinationsVisited: 5,
    photosCaptured: 12,
    completionRate: 62.5
  };

  return {
    achievements,
    badges,
    stats
  };
}

export async function mintNFT(achievementId: string): Promise<{ success: boolean; tokenId?: number; txHash?: string }> {
  // Simulate minting process
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const tokenId = Math.floor(Math.random() * 100000);
  const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
  
  console.log(`Minted NFT for achievement ${achievementId}: Token ID ${tokenId}`);
  
  return {
    success: true,
    tokenId,
    txHash
  };
}

export function canMintAchievement(achievementId: string): boolean {
  const gallery = getNFTGallery();
  const achievement = gallery.achievements.find(a => a.id === achievementId);
  return achievement ? achievement.earned && achievement.mintable && !achievement.minted : false;
}

export function getAchievementsByRarity(rarity: string): NFTAchievement[] {
  const gallery = getNFTGallery();
  return gallery.achievements.filter(a => a.rarity === rarity);
}

export function getBadgeProgress(badgeId: string): number {
  const gallery = getNFTGallery();
  const badge = gallery.badges.find(b => b.id === badgeId);
  return badge ? badge.progress : 0;
}
