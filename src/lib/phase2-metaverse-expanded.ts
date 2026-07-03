/**
 * Phase 2: Expanded Metaverse Hub System
 * 3D Virtual Tourism Destinations with Avatar Interactions
 */

export interface Destination3D {
  id: string;
  name: string;
  location: string;
  description: string;
  coordinates: { x: number; y: number; z: number };
  modelUrl: string;
  thumbnailUrl: string;
  category: 'cultural' | 'nature' | 'adventure' | 'urban' | 'beach';
  visitors: number;
  rating: number;
  features: string[];
  interactionPoints: InteractionPoint[];
  realTimeData: {
    temperature: number;
    crowdDensity: number;
    weather: string;
    visibility: number;
  };
}

export interface InteractionPoint {
  id: string;
  type: 'info' | 'shop' | 'photo' | 'activity' | 'quest';
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  reward?: {
    type: 'nft' | 'token' | 'badge';
    value: number;
  };
}

export interface Avatar {
  id: string;
  userId: string;
  name: string;
  appearance: {
    skin: string;
    hair: string;
    outfit: string;
    accessories: string[];
  };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  status: 'online' | 'away' | 'busy';
  achievements: string[];
  level: number;
}

export interface MetaverseSession {
  id: string;
  userId: string;
  avatarId: string;
  destinationId: string;
  startTime: number;
  duration: number;
  interactions: number;
  photosToken: number;
  questsCompleted: number;
  socialConnections: string[];
}

// Mock 3D Destinations Database
export const METAVERSE_DESTINATIONS: Destination3D[] = [
  {
    id: 'dest-borobudur-3d',
    name: 'Borobudur Temple VR',
    location: 'Central Java, Indonesia',
    description: 'Explore the magnificent 9th-century Buddhist temple in full 3D with guided tours',
    coordinates: { x: 0, y: 0, z: 0 },
    modelUrl: '/models/borobudur.glb',
    thumbnailUrl: '/thumbnails/borobudur.jpg',
    category: 'cultural',
    visitors: 15234,
    rating: 4.9,
    features: ['Guided Tour', 'Photo Mode', 'Historical Info', '360° View'],
    interactionPoints: [
      {
        id: 'bp1',
        type: 'info',
        position: { x: 0, y: 2, z: 5 },
        title: 'Temple History',
        description: 'Learn about the construction and significance of Borobudur',
        reward: { type: 'badge', value: 1 }
      },
      {
        id: 'bp2',
        type: 'photo',
        position: { x: 10, y: 5, z: 0 },
        title: 'Panoramic View Point',
        description: 'Capture the best view of the temple',
        reward: { type: 'nft', value: 1 }
      },
      {
        id: 'bp3',
        type: 'quest',
        position: { x: -5, y: 1, z: 8 },
        title: 'Find the Hidden Stupas',
        description: 'Discover all 72 stupas in the temple',
        reward: { type: 'token', value: 50 }
      }
    ],
    realTimeData: {
      temperature: 28,
      crowdDensity: 45,
      weather: 'Partly Cloudy',
      visibility: 95
    }
  },
  {
    id: 'dest-komodo-3d',
    name: 'Komodo Island Expedition',
    location: 'East Nusa Tenggara, Indonesia',
    description: 'Virtual expedition to see Komodo dragons in their natural habitat',
    coordinates: { x: 100, y: 0, z: 0 },
    modelUrl: '/models/komodo.glb',
    thumbnailUrl: '/thumbnails/komodo.jpg',
    category: 'nature',
    visitors: 12890,
    rating: 4.8,
    features: ['Wildlife Safari', 'Drone View', 'Marine Life', 'Underwater Exploration'],
    interactionPoints: [
      {
        id: 'kp1',
        type: 'activity',
        position: { x: 5, y: 0, z: 10 },
        title: 'Komodo Dragon Encounter',
        description: 'Observe a Komodo dragon up close in VR',
        reward: { type: 'nft', value: 1 }
      },
      {
        id: 'kp2',
        type: 'info',
        position: { x: 15, y: 0, z: 5 },
        title: 'Conservation Efforts',
        description: 'Learn about protecting Komodo dragons',
        reward: { type: 'badge', value: 1 }
      },
      {
        id: 'kp3',
        type: 'photo',
        position: { x: 0, y: 10, z: 0 },
        title: 'Aerial Island View',
        description: 'Capture stunning aerial photography',
        reward: { type: 'token', value: 75 }
      }
    ],
    realTimeData: {
      temperature: 32,
      crowdDensity: 20,
      weather: 'Sunny',
      visibility: 100
    }
  },
  {
    id: 'dest-raja-ampat-3d',
    name: 'Raja Ampat Underwater World',
    location: 'West Papua, Indonesia',
    description: 'Dive into the world\'s most biodiverse marine ecosystem',
    coordinates: { x: 200, y: -10, z: 50 },
    modelUrl: '/models/raja-ampat.glb',
    thumbnailUrl: '/thumbnails/raja-ampat.jpg',
    category: 'beach',
    visitors: 18456,
    rating: 4.95,
    features: ['Underwater VR', 'Marine Biology', 'Coral Reefs', 'Scuba Simulation'],
    interactionPoints: [
      {
        id: 'rp1',
        type: 'activity',
        position: { x: 0, y: -5, z: 20 },
        title: 'Coral Reef Exploration',
        description: 'Swim through vibrant coral formations',
        reward: { type: 'nft', value: 1 }
      },
      {
        id: 'rp2',
        type: 'quest',
        position: { x: 10, y: -8, z: 15 },
        title: 'Marine Species Hunt',
        description: 'Find and photograph 10 different fish species',
        reward: { type: 'token', value: 100 }
      },
      {
        id: 'rp3',
        type: 'info',
        position: { x: -5, y: -3, z: 25 },
        title: 'Ecosystem Facts',
        description: 'Learn about Raja Ampat\'s biodiversity',
        reward: { type: 'badge', value: 1 }
      }
    ],
    realTimeData: {
      temperature: 29,
      crowdDensity: 15,
      weather: 'Clear',
      visibility: 98
    }
  },
  {
    id: 'dest-bromo-3d',
    name: 'Mount Bromo Sunrise',
    location: 'East Java, Indonesia',
    description: 'Experience the magical sunrise over an active volcano',
    coordinates: { x: -100, y: 50, z: 100 },
    modelUrl: '/models/bromo.glb',
    thumbnailUrl: '/thumbnails/bromo.jpg',
    category: 'adventure',
    visitors: 14567,
    rating: 4.85,
    features: ['Sunrise Simulation', 'Volcano Exploration', 'Time-lapse', '4K Photography'],
    interactionPoints: [
      {
        id: 'brp1',
        type: 'photo',
        position: { x: 0, y: 30, z: 50 },
        title: 'Sunrise Viewpoint',
        description: 'Capture the iconic Bromo sunrise',
        reward: { type: 'nft', value: 1 }
      },
      {
        id: 'brp2',
        type: 'activity',
        position: { x: 10, y: 5, z: 60 },
        title: 'Crater Rim Walk',
        description: 'Walk along the volcano crater rim',
        reward: { type: 'token', value: 80 }
      },
      {
        id: 'brp3',
        type: 'info',
        position: { x: -10, y: 15, z: 40 },
        title: 'Volcanic Activity',
        description: 'Learn about Mount Bromo\'s geology',
        reward: { type: 'badge', value: 1 }
      }
    ],
    realTimeData: {
      temperature: 15,
      crowdDensity: 60,
      weather: 'Foggy',
      visibility: 70
    }
  },
  {
    id: 'dest-ubud-3d',
    name: 'Ubud Cultural Center',
    location: 'Bali, Indonesia',
    description: 'Immerse yourself in traditional Balinese arts and crafts',
    coordinates: { x: 50, y: 5, z: -50 },
    modelUrl: '/models/ubud.glb',
    thumbnailUrl: '/thumbnails/ubud.jpg',
    category: 'cultural',
    visitors: 20123,
    rating: 4.7,
    features: ['Art Gallery', 'Traditional Dance', 'Craft Workshops', 'Rice Terrace Walk'],
    interactionPoints: [
      {
        id: 'up1',
        type: 'activity',
        position: { x: 5, y: 2, z: 0 },
        title: 'Balinese Dance Performance',
        description: 'Watch a traditional Legong dance',
        reward: { type: 'nft', value: 1 }
      },
      {
        id: 'up2',
        type: 'shop',
        position: { x: 10, y: 1, z: 5 },
        title: 'Art Market',
        description: 'Browse local handicrafts and art',
        reward: { type: 'token', value: 25 }
      },
      {
        id: 'up3',
        type: 'quest',
        position: { x: 0, y: 0, z: 15 },
        title: 'Rice Terrace Journey',
        description: 'Complete the Tegallalang rice terrace trail',
        reward: { type: 'badge', value: 1 }
      }
    ],
    realTimeData: {
      temperature: 27,
      crowdDensity: 55,
      weather: 'Sunny',
      visibility: 90
    }
  }
];

// Avatar Management
export function createAvatar(userId: string, name: string): Avatar {
  return {
    id: `avatar-${Date.now()}`,
    userId,
    name,
    appearance: {
      skin: 'default',
      hair: 'short-black',
      outfit: 'casual',
      accessories: []
    },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    status: 'online',
    achievements: [],
    level: 1
  };
}

export function updateAvatarPosition(
  avatar: Avatar,
  position: { x: number; y: number; z: number }
): Avatar {
  return { ...avatar, position };
}

// Metaverse Session Management
export function startMetaverseSession(
  userId: string,
  avatarId: string,
  destinationId: string
): MetaverseSession {
  return {
    id: `session-${Date.now()}`,
    userId,
    avatarId,
    destinationId,
    startTime: Date.now(),
    duration: 0,
    interactions: 0,
    photosToken: 0,
    questsCompleted: 0,
    socialConnections: []
  };
}

export function completeInteraction(
  session: MetaverseSession,
  interactionType: 'info' | 'shop' | 'photo' | 'activity' | 'quest'
): MetaverseSession {
  const updated = { ...session, interactions: session.interactions + 1 };
  
  if (interactionType === 'photo') {
    updated.photosToken += 1;
  } else if (interactionType === 'quest') {
    updated.questsCompleted += 1;
  }
  
  return updated;
}

// Get destination by ID
export function getDestination(id: string): Destination3D | undefined {
  return METAVERSE_DESTINATIONS.find(dest => dest.id === id);
}

// Get all destinations by category
export function getDestinationsByCategory(category: string): Destination3D[] {
  return METAVERSE_DESTINATIONS.filter(dest => dest.category === category);
}

// Search destinations
export function searchDestinations(query: string): Destination3D[] {
  const lowerQuery = query.toLowerCase();
  return METAVERSE_DESTINATIONS.filter(dest =>
    dest.name.toLowerCase().includes(lowerQuery) ||
    dest.location.toLowerCase().includes(lowerQuery) ||
    dest.description.toLowerCase().includes(lowerQuery)
  );
}

// Calculate session stats
export function calculateSessionStats(session: MetaverseSession) {
  const duration = Math.floor((Date.now() - session.startTime) / 1000 / 60); // minutes
  
  return {
    duration,
    interactions: session.interactions,
    photosToken: session.photosToken,
    questsCompleted: session.questsCompleted,
    socialConnections: session.socialConnections.length,
    averageInteractionRate: duration > 0 ? (session.interactions / duration).toFixed(2) : '0',
    completionScore: ((session.questsCompleted * 20) + (session.photosToken * 10) + (session.interactions * 5))
  };
}
