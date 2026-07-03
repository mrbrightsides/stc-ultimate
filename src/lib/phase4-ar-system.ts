/**
 * Phase 4: Augmented Reality System
 * Provides AR experiences for enhanced tourism exploration
 */

export interface ARExperience {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'tour' | 'educational' | 'interactive' | 'game';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  rating: number;
  reviews: number;
  downloads: number;
  features: ARFeature[];
  systemRequirements: ARSystemRequirements;
  accessibility: ARAccessibility;
  previewImage: string;
}

export interface ARFeature {
  name: string;
  icon: string;
  description: string;
}

export interface ARSystemRequirements {
  minOS: string;
  minRAM: string;
  minStorage: string;
  arCore: boolean;
  arKit: boolean;
}

export interface ARAccessibility {
  motionSickness: 'low' | 'medium' | 'high';
  physicalActivity: 'low' | 'medium' | 'high';
  ageRating: string;
}

export interface ARStats {
  totalExperiences: number;
  totalSessions: number;
  totalDownloads: number;
  averageRating: number;
  activeUsers: number;
}

// Mock AR Experiences
const MOCK_AR_EXPERIENCES: ARExperience[] = [
  {
    id: 'ar-1',
    name: 'Borobudur Historical AR Tour',
    description: 'Explore Borobudur temple with augmented reality overlays showing historical reconstructions and cultural stories',
    location: 'Borobudur, Central Java',
    type: 'educational',
    difficulty: 'easy',
    duration: 60,
    rating: 4.8,
    reviews: 342,
    downloads: 15234,
    features: [
      { name: '3D Reconstruction', icon: '🏛️', description: 'See the temple in its original glory' },
      { name: 'Historical Timeline', icon: '📜', description: 'Interactive timeline of events' },
      { name: 'Audio Guides', icon: '🎧', description: 'Expert narration in multiple languages' },
      { name: 'Photo Mode', icon: '📸', description: 'Capture AR-enhanced photos' }
    ],
    systemRequirements: {
      minOS: 'iOS 14+ / Android 10+',
      minRAM: '4GB',
      minStorage: '500MB',
      arCore: true,
      arKit: true
    },
    accessibility: {
      motionSickness: 'low',
      physicalActivity: 'medium',
      ageRating: '8+'
    },
    previewImage: '🏯'
  },
  {
    id: 'ar-2',
    name: 'Raja Ampat Marine Life AR',
    description: 'Dive into an underwater AR experience showcasing Raja Ampat\'s incredible marine biodiversity',
    location: 'Raja Ampat, West Papua',
    type: 'interactive',
    difficulty: 'medium',
    duration: 45,
    rating: 4.9,
    reviews: 567,
    downloads: 23456,
    features: [
      { name: 'Marine Species ID', icon: '🐠', description: 'Identify fish and corals in real-time' },
      { name: 'Underwater Navigation', icon: '🧭', description: 'Navigate virtual dive sites' },
      { name: 'Conservation Info', icon: '🌊', description: 'Learn about marine conservation' },
      { name: 'Interactive Quests', icon: '🎯', description: 'Complete challenges to learn more' }
    ],
    systemRequirements: {
      minOS: 'iOS 15+ / Android 11+',
      minRAM: '6GB',
      minStorage: '800MB',
      arCore: true,
      arKit: true
    },
    accessibility: {
      motionSickness: 'medium',
      physicalActivity: 'low',
      ageRating: '10+'
    },
    previewImage: '🐟'
  },
  {
    id: 'ar-3',
    name: 'Komodo Dragon AR Tracker',
    description: 'Track and observe virtual Komodo dragons in their natural habitat using AR technology',
    location: 'Komodo National Park',
    type: 'game',
    difficulty: 'medium',
    duration: 30,
    rating: 4.7,
    reviews: 289,
    downloads: 12890,
    features: [
      { name: 'Animal Tracking', icon: '🦎', description: 'Follow virtual dragons using AR markers' },
      { name: 'Behavior Simulation', icon: '🎬', description: 'Watch realistic animal behaviors' },
      { name: 'Safety Education', icon: '⚠️', description: 'Learn safety protocols' },
      { name: 'Photo Safari', icon: '📷', description: 'Capture rare moments' }
    ],
    systemRequirements: {
      minOS: 'iOS 14+ / Android 10+',
      minRAM: '4GB',
      minStorage: '600MB',
      arCore: true,
      arKit: true
    },
    accessibility: {
      motionSickness: 'medium',
      physicalActivity: 'high',
      ageRating: '12+'
    },
    previewImage: '🦎'
  },
  {
    id: 'ar-4',
    name: 'Prambanan Temple AR Guide',
    description: 'Augmented reality guide revealing the mythology and architecture of Prambanan',
    location: 'Prambanan, Yogyakarta',
    type: 'tour',
    difficulty: 'easy',
    duration: 50,
    rating: 4.6,
    reviews: 421,
    downloads: 18234,
    features: [
      { name: 'Mythology Stories', icon: '📖', description: 'Hindu epic tales come to life' },
      { name: '3D Architecture', icon: '🏛️', description: 'Explore temple structures in detail' },
      { name: 'Cultural Context', icon: '🎭', description: 'Understand historical significance' },
      { name: 'Night Mode', icon: '🌙', description: 'Special night tour experience' }
    ],
    systemRequirements: {
      minOS: 'iOS 13+ / Android 9+',
      minRAM: '3GB',
      minStorage: '450MB',
      arCore: true,
      arKit: false
    },
    accessibility: {
      motionSickness: 'low',
      physicalActivity: 'medium',
      ageRating: '6+'
    },
    previewImage: '🏺'
  },
  {
    id: 'ar-5',
    name: 'Ubud Cultural AR Experience',
    description: 'Immersive AR experience of Balinese culture, arts, and traditional practices',
    location: 'Ubud, Bali',
    type: 'educational',
    difficulty: 'easy',
    duration: 40,
    rating: 4.8,
    reviews: 512,
    downloads: 21456,
    features: [
      { name: 'Dance Performances', icon: '💃', description: 'Watch traditional Balinese dances' },
      { name: 'Craft Workshops', icon: '🎨', description: 'Learn traditional crafts in AR' },
      { name: 'Temple Ceremonies', icon: '🕉️', description: 'Experience virtual ceremonies' },
      { name: 'Art Gallery', icon: '🖼️', description: 'Explore Balinese art collections' }
    ],
    systemRequirements: {
      minOS: 'iOS 14+ / Android 10+',
      minRAM: '4GB',
      minStorage: '550MB',
      arCore: true,
      arKit: true
    },
    accessibility: {
      motionSickness: 'low',
      physicalActivity: 'low',
      ageRating: 'All ages'
    },
    previewImage: '🎭'
  },
  {
    id: 'ar-6',
    name: 'Mount Bromo Geology AR',
    description: 'Geological AR tour explaining volcanic formation and landscape features of Mount Bromo',
    location: 'Mount Bromo, East Java',
    type: 'educational',
    difficulty: 'medium',
    duration: 35,
    rating: 4.7,
    reviews: 298,
    downloads: 14567,
    features: [
      { name: 'Geological Layers', icon: '🏔️', description: 'Visualize underground structures' },
      { name: 'Volcanic Activity', icon: '🌋', description: 'See eruption simulations' },
      { name: 'Time-lapse Formation', icon: '⏱️', description: 'Watch landscape evolution' },
      { name: 'Safety Zones', icon: '🚨', description: 'Learn about hazard areas' }
    ],
    systemRequirements: {
      minOS: 'iOS 15+ / Android 11+',
      minRAM: '6GB',
      minStorage: '700MB',
      arCore: true,
      arKit: true
    },
    accessibility: {
      motionSickness: 'medium',
      physicalActivity: 'high',
      ageRating: '10+'
    },
    previewImage: '🌋'
  },
  {
    id: 'ar-7',
    name: 'Tanah Lot Sunset AR',
    description: 'AR-enhanced sunset experience at Tanah Lot with cultural storytelling',
    location: 'Tanah Lot, Bali',
    type: 'tour',
    difficulty: 'easy',
    duration: 25,
    rating: 4.9,
    reviews: 678,
    downloads: 28934,
    features: [
      { name: 'Sunset Simulation', icon: '🌅', description: 'Experience perfect sunset timing' },
      { name: 'Legends & Myths', icon: '📚', description: 'Hear temple origin stories' },
      { name: 'Ocean Wildlife', icon: '🐚', description: 'Discover tidal pool creatures' },
      { name: 'Photography Tips', icon: '📸', description: 'Get perfect shot assistance' }
    ],
    systemRequirements: {
      minOS: 'iOS 13+ / Android 9+',
      minRAM: '3GB',
      minStorage: '400MB',
      arCore: false,
      arKit: true
    },
    accessibility: {
      motionSickness: 'low',
      physicalActivity: 'low',
      ageRating: 'All ages'
    },
    previewImage: '🏖️'
  },
  {
    id: 'ar-8',
    name: 'Jakarta Heritage AR Walk',
    description: 'Walk through Jakarta\'s old town with AR overlays showing historical buildings and events',
    location: 'Kota Tua, Jakarta',
    type: 'tour',
    difficulty: 'easy',
    duration: 55,
    rating: 4.5,
    reviews: 234,
    downloads: 9876,
    features: [
      { name: 'Historical Buildings', icon: '🏛️', description: 'See original Dutch colonial structures' },
      { name: 'Timeline Events', icon: '📅', description: 'Witness historical moments' },
      { name: 'Street Life', icon: '🚶', description: 'Experience past daily life' },
      { name: 'Museum Integration', icon: '🏛️', description: 'Connect with nearby museums' }
    ],
    systemRequirements: {
      minOS: 'iOS 14+ / Android 10+',
      minRAM: '4GB',
      minStorage: '500MB',
      arCore: true,
      arKit: false
    },
    accessibility: {
      motionSickness: 'low',
      physicalActivity: 'medium',
      ageRating: '8+'
    },
    previewImage: '🏙️'
  }
];

/**
 * Get all AR experiences
 */
export function getARExperiences(): ARExperience[] {
  return JSON.parse(JSON.stringify(MOCK_AR_EXPERIENCES));
}

/**
 * Get AR experience by ID
 */
export function getARExperienceById(id: string): ARExperience | null {
  const experience = MOCK_AR_EXPERIENCES.find(e => e.id === id);
  return experience ? JSON.parse(JSON.stringify(experience)) : null;
}

/**
 * Get AR experiences by type
 */
export function getARExperiencesByType(type: ARExperience['type']): ARExperience[] {
  return MOCK_AR_EXPERIENCES.filter(e => e.type === type).map(e => JSON.parse(JSON.stringify(e)));
}

/**
 * Get AR system statistics
 */
export function getARStats(): ARStats {
  return {
    totalExperiences: 8,
    totalSessions: 5234,
    totalDownloads: 456,
    averageRating: 4.7,
    activeUsers: 1247
  };
}

/**
 * Check if device meets system requirements
 */
export function checkSystemRequirements(experience: ARExperience): {
  compatible: boolean;
  missing: string[];
} {
  // Mock implementation - in real app, this would check actual device capabilities
  const mockDeviceSpecs = {
    os: 'iOS 15',
    ram: '6GB',
    storage: '10GB',
    hasARCore: true,
    hasARKit: true
  };

  const missing: string[] = [];

  // Check RAM
  const reqRAM = parseInt(experience.systemRequirements.minRAM);
  const devRAM = parseInt(mockDeviceSpecs.ram);
  if (devRAM < reqRAM) {
    missing.push('Insufficient RAM');
  }

  // Check storage
  const reqStorage = parseInt(experience.systemRequirements.minStorage);
  const devStorage = parseInt(mockDeviceSpecs.storage.replace('GB', '')) * 1024;
  if (devStorage < reqStorage) {
    missing.push('Insufficient storage');
  }

  // Check AR support
  if (experience.systemRequirements.arCore && !mockDeviceSpecs.hasARCore) {
    missing.push('ARCore not supported');
  }
  if (experience.systemRequirements.arKit && !mockDeviceSpecs.hasARKit) {
    missing.push('ARKit not supported');
  }

  return {
    compatible: missing.length === 0,
    missing
  };
}
