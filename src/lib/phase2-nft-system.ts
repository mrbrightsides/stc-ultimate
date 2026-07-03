/**
 * Phase 2: NFT Achievement System
 * Mintable Tourism Badges and Digital Collectibles
 */

import { ethers } from 'ethers';

// NFT Achievement Contract ABI
export const NFT_ACHIEVEMENT_ABI = [
  'event AchievementMinted(uint256 indexed tokenId, address indexed recipient, string achievementType, uint256 timestamp)',
  'event BadgeUpgraded(uint256 indexed tokenId, uint8 newLevel, uint256 timestamp)',
  'function mintAchievement(address recipient, string memory achievementType, string memory metadataURI) external returns (uint256)',
  'function upgradeBadge(uint256 tokenId) external',
  'function getAchievement(uint256 tokenId) external view returns (address, string, uint8, uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function tokenURI(uint256 tokenId) external view returns (string)'
];

// NFT Contract Address (Sepolia Testnet)
export const NFT_CONTRACT_ADDRESS = '0xC8B7A6F5E4D3C2B1A9F8E7D6C5B4A3F2E1D9C8B7';

export interface NFTAchievement {
  id: string | number;
  tokenId?: number;
  name: string;
  description: string;
  type: 'destination' | 'activity' | 'milestone' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  attributes?: NFTAttribute[];
  level?: number;
  earned: boolean;
  minted?: boolean;
  earnedDate?: number;
  txHash?: string;
  metadataUri?: string;
  requirements: string[];
  rewardPoints: number;
  rewardTokens?: number;
  rewardBadge?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface TourismBadge {
  id: string;
  name: string;
  description: string;
  requirement?: string;
  category: 'explorer' | 'photographer' | 'cultural' | 'adventure' | 'social';
  points?: number;
  icon?: string;
  color?: string;
  currentLevel: number;
  maxLevel?: number;
  progress: number;
  currentProgress: number;
  requiredProgress: number;
  isUnlocked: boolean;
  rewards?: {
    points?: number;
    tokens?: number;
    nft?: boolean;
  };
}

// Pre-defined NFT Achievements
export const NFT_ACHIEVEMENTS: NFTAchievement[] = [
  {
    id: 1,
    name: 'Borobudur Explorer',
    description: 'Successfully visited Borobudur Temple in the metaverse',
    type: 'destination',
    rarity: 'common',
    imageUrl: '/nft/borobudur-badge.png',
    attributes: [
      { trait_type: 'Location', value: 'Borobudur Temple' },
      { trait_type: 'Type', value: 'Cultural Heritage' },
      { trait_type: 'Difficulty', value: 'Easy' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 2,
    name: 'Komodo Dragon Spotter',
    description: 'Encountered a Komodo dragon in VR expedition',
    type: 'activity',
    rarity: 'rare',
    imageUrl: '/nft/komodo-badge.png',
    attributes: [
      { trait_type: 'Activity', value: 'Wildlife Safari' },
      { trait_type: 'Species', value: 'Komodo Dragon' },
      { trait_type: 'Rarity', value: 'Rare' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 3,
    name: 'Raja Ampat Diver',
    description: 'Completed underwater exploration in Raja Ampat',
    type: 'activity',
    rarity: 'epic',
    imageUrl: '/nft/raja-ampat-badge.png',
    attributes: [
      { trait_type: 'Activity', value: 'Scuba Diving' },
      { trait_type: 'Depth', value: '20 meters' },
      { trait_type: 'Marine Life', value: '50+ species' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 4,
    name: 'Bromo Sunrise Witness',
    description: 'Witnessed the magical sunrise at Mount Bromo',
    type: 'milestone',
    rarity: 'epic',
    imageUrl: '/nft/bromo-badge.png',
    attributes: [
      { trait_type: 'Event', value: 'Sunrise' },
      { trait_type: 'Altitude', value: '2,329m' },
      { trait_type: 'Time', value: '05:30 AM' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 5,
    name: 'Cultural Ambassador',
    description: 'Completed 5 cultural heritage tours',
    type: 'milestone',
    rarity: 'rare',
    imageUrl: '/nft/cultural-badge.png',
    attributes: [
      { trait_type: 'Category', value: 'Cultural' },
      { trait_type: 'Tours Completed', value: '5' },
      { trait_type: 'Knowledge Level', value: 'Expert' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 6,
    name: 'Social Butterfly',
    description: 'Connected with 10+ travelers in the metaverse',
    type: 'social',
    rarity: 'common',
    imageUrl: '/nft/social-badge.png',
    attributes: [
      { trait_type: 'Connections', value: '10+' },
      { trait_type: 'Type', value: 'Social' },
      { trait_type: 'Network', value: 'Active' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 7,
    name: 'Master Photographer',
    description: 'Captured 100+ photos in virtual tourism',
    type: 'activity',
    rarity: 'epic',
    imageUrl: '/nft/photographer-badge.png',
    attributes: [
      { trait_type: 'Photos Taken', value: '100+' },
      { trait_type: 'Skill', value: 'Master' },
      { trait_type: 'Equipment', value: 'Pro Camera' }
    ],
    level: 1,
    earned: false
  },
  {
    id: 8,
    name: 'Indonesia Champion',
    description: 'Visited all major Indonesian destinations',
    type: 'special',
    rarity: 'legendary',
    imageUrl: '/nft/champion-badge.png',
    attributes: [
      { trait_type: 'Destinations', value: 'All' },
      { trait_type: 'Status', value: 'Champion' },
      { trait_type: 'Achievement', value: '100% Complete' }
    ],
    level: 1,
    earned: false
  }
];

// Tourism Badge System
export const TOURISM_BADGES: TourismBadge[] = [
  {
    id: 'explorer-bronze',
    name: 'Bronze Explorer',
    description: 'Visit 3 destinations',
    requirement: 'Complete 3 virtual tours',
    category: 'explorer',
    points: 10,
    icon: '🥉',
    color: 'bronze'
  },
  {
    id: 'explorer-silver',
    name: 'Silver Explorer',
    description: 'Visit 10 destinations',
    requirement: 'Complete 10 virtual tours',
    category: 'explorer',
    points: 25,
    icon: '🥈',
    color: 'silver'
  },
  {
    id: 'explorer-gold',
    name: 'Gold Explorer',
    description: 'Visit 25 destinations',
    requirement: 'Complete 25 virtual tours',
    category: 'explorer',
    points: 50,
    icon: '🥇',
    color: 'gold'
  },
  {
    id: 'photographer-novice',
    name: 'Novice Photographer',
    description: 'Take 50 photos',
    requirement: 'Capture 50 moments',
    category: 'photographer',
    points: 15,
    icon: '📷',
    color: 'blue'
  },
  {
    id: 'photographer-pro',
    name: 'Pro Photographer',
    description: 'Take 200 photos',
    requirement: 'Capture 200 moments',
    category: 'photographer',
    points: 40,
    icon: '📸',
    color: 'purple'
  },
  {
    id: 'cultural-enthusiast',
    name: 'Cultural Enthusiast',
    description: 'Complete 5 cultural tours',
    requirement: 'Visit 5 cultural heritage sites',
    category: 'cultural',
    points: 30,
    icon: '🏛️',
    color: 'amber'
  },
  {
    id: 'adventure-seeker',
    name: 'Adventure Seeker',
    description: 'Complete 5 adventure activities',
    requirement: 'Participate in 5 adventures',
    category: 'adventure',
    points: 35,
    icon: '⛰️',
    color: 'red'
  },
  {
    id: 'social-connector',
    name: 'Social Connector',
    description: 'Connect with 20 travelers',
    requirement: 'Make 20 connections',
    category: 'social',
    points: 20,
    icon: '🤝',
    color: 'green'
  }
];

/**
 * Mint NFT Achievement
 */
export async function mintNFTAchievement(
  provider: ethers.providers.Web3Provider,
  achievementType: string,
  metadataUri: string
): Promise<{ success: boolean; tokenId?: number; txHash?: string; error?: string }> {
  try {
    const signer = provider.getSigner();
    const recipientAddress = await signer.getAddress();
    
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ACHIEVEMENT_ABI,
      signer
    );

    const tx = await contract.mintAchievement(
      recipientAddress,
      achievementType,
      metadataUri,
      { gasLimit: 300000 }
    );

    const receipt = await tx.wait();
    
    const event = receipt.events?.find((e: any) => e.event === 'AchievementMinted');
    const tokenId = event?.args?.tokenId?.toNumber();

    return {
      success: true,
      tokenId,
      txHash: receipt.transactionHash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'NFT minting failed'
    };
  }
}

/**
 * Upgrade Badge Level
 */
export async function upgradeBadgeLevel(
  provider: ethers.providers.Web3Provider,
  tokenId: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ACHIEVEMENT_ABI,
      signer
    );

    const tx = await contract.upgradeBadge(tokenId, { gasLimit: 200000 });
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.transactionHash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Badge upgrade failed'
    };
  }
}

/**
 * Get user's NFT balance
 */
export async function getUserNFTBalance(
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
  address: string
): Promise<number> {
  try {
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ACHIEVEMENT_ABI,
      provider
    );

    const balance = await contract.balanceOf(address);
    return balance.toNumber();
  } catch (error) {
    console.error('Failed to get NFT balance:', error);
    return 0;
  }
}

/**
 * Check if achievement is earned
 */
export function checkAchievementEarned(
  achievementId: number,
  userStats: {
    destinations: number;
    photos: number;
    culturalTours: number;
    adventures: number;
    connections: number;
  }
): boolean {
  const achievement = NFT_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;

  switch (achievementId) {
    case 1: // Borobudur Explorer
      return userStats.destinations >= 1;
    case 2: // Komodo Dragon Spotter
      return userStats.adventures >= 1;
    case 3: // Raja Ampat Diver
      return userStats.adventures >= 3;
    case 4: // Bromo Sunrise Witness
      return userStats.destinations >= 5;
    case 5: // Cultural Ambassador
      return userStats.culturalTours >= 5;
    case 6: // Social Butterfly
      return userStats.connections >= 10;
    case 7: // Master Photographer
      return userStats.photos >= 100;
    case 8: // Indonesia Champion
      return userStats.destinations >= 25 && userStats.culturalTours >= 10;
    default:
      return false;
  }
}

/**
 * Get earned achievements
 */
export function getEarnedAchievements(userStats: any): NFTAchievement[] {
  return NFT_ACHIEVEMENTS.filter(achievement =>
    checkAchievementEarned(achievement.id, userStats)
  );
}

/**
 * Calculate total achievement points
 */
export function calculateAchievementPoints(earnedAchievements: NFTAchievement[]): number {
  const rarityPoints: Record<string, number> = {
    common: 10,
    rare: 25,
    epic: 50,
    legendary: 100
  };

  return earnedAchievements.reduce((total, achievement) => {
    const basePoints = rarityPoints[achievement.rarity] || 0;
    const levelMultiplier = achievement.level;
    return total + (basePoints * levelMultiplier);
  }, 0);
}

/**
 * Get NFT system stats
 */
export function getNFTSystem(): {
  totalMinted: number;
  achievementsEarned: number;
  achievementPoints: number;
  destinationsVisited: number;
  photosCaptured: number;
} {
  return {
    totalMinted: 1247,
    achievementsEarned: 18,
    achievementPoints: 3450,
    destinationsVisited: 12,
    photosCaptured: 567
  };
}

/**
 * Get achievements for gallery
 */
export function getAchievements(): NFTAchievement[] {
  return [
    {
      id: 'ach-1',
      name: 'Borobudur Explorer',
      description: 'Visit the magnificent Borobudur Temple',
      type: 'destination',
      rarity: 'common',
      imageUrl: '/nft/borobudur.png',
      earned: true,
      minted: true,
      requirements: ['Visit Borobudur Temple', 'Complete virtual tour'],
      rewardPoints: 100,
      rewardTokens: 50
    },
    {
      id: 'ach-2',
      name: 'Raja Ampat Diver',
      description: 'Explore the underwater paradise of Raja Ampat',
      type: 'activity',
      rarity: 'epic',
      imageUrl: '/nft/raja-ampat.png',
      earned: true,
      minted: false,
      requirements: ['Complete diving experience', 'Find 10 marine species'],
      rewardPoints: 500,
      rewardTokens: 200,
      rewardBadge: 'Marine Explorer'
    },
    {
      id: 'ach-3',
      name: 'Komodo Dragon Spotter',
      description: 'Encounter a Komodo dragon in the wild',
      type: 'activity',
      rarity: 'rare',
      imageUrl: '/nft/komodo.png',
      earned: false,
      requirements: ['Visit Komodo National Park', 'Spot a Komodo dragon'],
      rewardPoints: 250,
      rewardTokens: 100
    },
    {
      id: 'ach-4',
      name: 'Cultural Ambassador',
      description: 'Master Indonesian cultural heritage',
      type: 'milestone',
      rarity: 'epic',
      imageUrl: '/nft/cultural.png',
      earned: false,
      requirements: ['Visit 5 cultural sites', 'Complete cultural quiz', 'Share 3 cultural posts'],
      rewardPoints: 600,
      rewardTokens: 300,
      rewardBadge: 'Culture Expert'
    },
    {
      id: 'ach-5',
      name: 'Indonesia Champion',
      description: 'Complete all major Indonesian destinations',
      type: 'special',
      rarity: 'legendary',
      imageUrl: '/nft/champion.png',
      earned: false,
      requirements: ['Visit 25 destinations', 'Earn 50 achievements', 'Mint 10 NFTs'],
      rewardPoints: 2000,
      rewardTokens: 1000,
      rewardBadge: 'Indonesia Legend'
    },
    {
      id: 'ach-6',
      name: 'Social Butterfly',
      description: 'Connect with fellow travelers',
      type: 'social',
      rarity: 'common',
      imageUrl: '/nft/social.png',
      earned: true,
      minted: false,
      requirements: ['Connect with 10 travelers', 'Join 5 group tours'],
      rewardPoints: 150,
      rewardTokens: 75
    }
  ];
}

/**
 * Get badges for gallery
 */
export function getBadges(): TourismBadge[] {
  return [
    {
      id: 'badge-1',
      name: 'Explorer Bronze',
      description: 'Visit 5 destinations',
      category: 'explorer',
      currentLevel: 1,
      maxLevel: 3,
      progress: 60,
      currentProgress: 3,
      requiredProgress: 5,
      isUnlocked: true,
      rewards: {
        points: 100,
        tokens: 50
      }
    },
    {
      id: 'badge-2',
      name: 'Photographer Pro',
      description: 'Capture 100 moments',
      category: 'photographer',
      currentLevel: 2,
      maxLevel: 5,
      progress: 85,
      currentProgress: 85,
      requiredProgress: 100,
      isUnlocked: true,
      rewards: {
        points: 250,
        tokens: 150,
        nft: true
      }
    },
    {
      id: 'badge-3',
      name: 'Cultural Enthusiast',
      description: 'Complete 10 cultural tours',
      category: 'cultural',
      currentLevel: 1,
      progress: 30,
      currentProgress: 3,
      requiredProgress: 10,
      isUnlocked: false,
      rewards: {
        points: 300,
        tokens: 200
      }
    },
    {
      id: 'badge-4',
      name: 'Adventure Seeker',
      description: 'Complete 15 adventure activities',
      category: 'adventure',
      currentLevel: 1,
      progress: 46,
      currentProgress: 7,
      requiredProgress: 15,
      isUnlocked: true,
      rewards: {
        points: 400,
        tokens: 250
      }
    },
    {
      id: 'badge-5',
      name: 'Social Connector',
      description: 'Connect with 50 travelers',
      category: 'social',
      currentLevel: 3,
      maxLevel: 10,
      progress: 110,
      currentProgress: 55,
      requiredProgress: 50,
      isUnlocked: true,
      rewards: {
        points: 500,
        tokens: 300,
        nft: true
      }
    },
    {
      id: 'badge-6',
      name: 'Master Photographer',
      description: 'Capture 500 stunning moments',
      category: 'photographer',
      currentLevel: 1,
      progress: 20,
      currentProgress: 100,
      requiredProgress: 500,
      isUnlocked: false,
      rewards: {
        points: 1000,
        tokens: 600,
        nft: true
      }
    }
  ];
}

/**
 * Mint NFT for achievement
 */
export function mintNFT(achievementId: string): boolean {
  console.log(`Minting NFT for achievement ${achievementId}`);
  // In a real app, this would call the smart contract
  return true;
}

/**
 * Get badge progress
 */
export function getBadgeProgress(badgeId: string, userStats: any): number {
  const badge = TOURISM_BADGES.find(b => b.id === badgeId);
  if (!badge) return 0;

  let current = 0;
  let target = 0;

  if (badgeId.includes('explorer')) {
    current = userStats.destinations || 0;
    if (badgeId === 'explorer-bronze') target = 3;
    else if (badgeId === 'explorer-silver') target = 10;
    else if (badgeId === 'explorer-gold') target = 25;
  } else if (badgeId.includes('photographer')) {
    current = userStats.photos || 0;
    if (badgeId === 'photographer-novice') target = 50;
    else if (badgeId === 'photographer-pro') target = 200;
  } else if (badgeId === 'cultural-enthusiast') {
    current = userStats.culturalTours || 0;
    target = 5;
  } else if (badgeId === 'adventure-seeker') {
    current = userStats.adventures || 0;
    target = 5;
  } else if (badgeId === 'social-connector') {
    current = userStats.connections || 0;
    target = 20;
  }

  return Math.min(100, Math.floor((current / target) * 100));
}
