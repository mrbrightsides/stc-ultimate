/**
 * STC Ultimate - Achievement System
 * Gamification for exploration and engagement
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: 'explorer' | 'photographer' | 'cultural' | 'social' | 'collector';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // 0-100
  maxProgress?: number;
}

export interface AchievementTier {
  name: string;
  minPoints: number;
  badge: string;
  benefits: string[];
}

/**
 * All available achievements
 */
export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Explorer Achievements
  {
    id: 'first-visit',
    name: 'First Steps',
    description: 'Visit your first 360° panorama',
    icon: '🎯',
    category: 'explorer',
    points: 10
  },
  {
    id: 'location-master-bali',
    name: 'Bali Explorer',
    description: 'Visit all hotspots in Bali',
    icon: '🏖️',
    category: 'explorer',
    points: 50,
    maxProgress: 4
  },
  {
    id: 'location-master-yogyakarta',
    name: 'Yogyakarta Scholar',
    description: 'Visit all hotspots in Yogyakarta',
    icon: '🏛️',
    category: 'explorer',
    points: 50,
    maxProgress: 2
  },
  {
    id: 'location-master-lombok',
    name: 'Lombok Adventurer',
    description: 'Visit all hotspots in Lombok',
    icon: '🏝️',
    category: 'explorer',
    points: 50,
    maxProgress: 2
  },
  {
    id: 'location-master-jakarta',
    name: 'Jakarta Navigator',
    description: 'Visit all hotspots in Jakarta',
    icon: '🏙️',
    category: 'explorer',
    points: 50,
    maxProgress: 2
  },
  {
    id: 'globe-trotter',
    name: 'Globe Trotter',
    description: 'Visit all 4 locations',
    icon: '🌍',
    category: 'explorer',
    points: 100,
    maxProgress: 4
  },
  {
    id: 'hotspot-hunter',
    name: 'Hotspot Hunter',
    description: 'Click on 10 different hotspots',
    icon: '📍',
    category: 'explorer',
    points: 30,
    maxProgress: 10
  },

  // Photographer Achievements
  {
    id: 'first-photo',
    name: 'Say Cheese!',
    description: 'Take your first photo in Photo Mode',
    icon: '📸',
    category: 'photographer',
    points: 15
  },
  {
    id: 'photo-collector',
    name: 'Photo Collector',
    description: 'Take 10 photos',
    icon: '📷',
    category: 'photographer',
    points: 40,
    maxProgress: 10
  },
  {
    id: 'sunset-photographer',
    name: 'Golden Hour Master',
    description: 'Take a photo during sunset weather',
    icon: '🌅',
    category: 'photographer',
    points: 25
  },
  {
    id: 'weather-photographer',
    name: 'Weather Enthusiast',
    description: 'Take photos in 5 different weather conditions',
    icon: '🌦️',
    category: 'photographer',
    points: 50,
    maxProgress: 5
  },

  // Cultural Achievements
  {
    id: 'audio-guide-listener',
    name: 'Audio Guide Listener',
    description: 'Listen to 5 audio narrations',
    icon: '🎧',
    category: 'cultural',
    points: 35,
    maxProgress: 5
  },
  {
    id: 'temple-visitor',
    name: 'Temple Visitor',
    description: 'Visit all temple hotspots',
    icon: '⛩️',
    category: 'cultural',
    points: 60,
    maxProgress: 3
  },
  {
    id: 'culture-buff',
    name: 'Culture Buff',
    description: 'Read all facts and tips for 5 locations',
    icon: '📚',
    category: 'cultural',
    points: 45,
    maxProgress: 5
  },

  // Social Achievements
  {
    id: 'vr-pioneer',
    name: 'VR Pioneer',
    description: 'Enter VR mode',
    icon: '🥽',
    category: 'social',
    points: 30
  },
  {
    id: 'immersion-master',
    name: 'Immersion Master',
    description: 'Enable all immersive features at once',
    icon: '✨',
    category: 'social',
    points: 50
  },

  // Collector Achievements
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Experience 4 different times of day',
    icon: '⏰',
    category: 'collector',
    points: 40,
    maxProgress: 4
  },
  {
    id: 'weather-watcher',
    name: 'Weather Watcher',
    description: 'Try all weather presets',
    icon: '🌈',
    category: 'collector',
    points: 60,
    maxProgress: 7
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock all other achievements',
    icon: '👑',
    category: 'collector',
    points: 200
  }
];

/**
 * Achievement tiers based on total points
 */
export const ACHIEVEMENT_TIERS: AchievementTier[] = [
  {
    name: 'Tourist',
    minPoints: 0,
    badge: '🎫',
    benefits: ['Access to basic features']
  },
  {
    name: 'Traveler',
    minPoints: 100,
    badge: '🎒',
    benefits: ['Photo Mode filters', 'Custom weather']
  },
  {
    name: 'Explorer',
    minPoints: 300,
    badge: '🗺️',
    benefits: ['VR Mode access', 'All sound effects']
  },
  {
    name: 'Master Tourist',
    minPoints: 600,
    badge: '🏆',
    benefits: ['All features unlocked', 'Special badges', 'Priority support']
  },
  {
    name: 'Legend',
    minPoints: 1000,
    badge: '👑',
    benefits: ['Exclusive content', 'Beta features', 'Hall of Fame']
  }
];

/**
 * Get current tier based on points
 */
export function getCurrentTier(points: number): AchievementTier {
  return [...ACHIEVEMENT_TIERS]
    .reverse()
    .find(tier => points >= tier.minPoints) || ACHIEVEMENT_TIERS[0];
}

/**
 * Get next tier based on points
 */
export function getNextTier(points: number): AchievementTier | null {
  return ACHIEVEMENT_TIERS.find(tier => points < tier.minPoints) || null;
}

/**
 * Calculate progress to next tier
 */
export function getProgressToNextTier(points: number): number {
  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(points);
  
  if (!nextTier) return 100; // Max tier reached
  
  const tierRange = nextTier.minPoints - currentTier.minPoints;
  const currentProgress = points - currentTier.minPoints;
  
  return Math.min(100, (currentProgress / tierRange) * 100);
}
