/**
 * Phase 2: Enhanced VR Integration System
 * Immersive Virtual Reality Experiences
 */

export interface VRExperience {
  id: string;
  name: string;
  description: string;
  destination: string;
  type: 'tour' | 'activity' | 'educational' | 'entertainment';
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  thumbnailUrl: string;
  vrSceneUrl: string;
  features: VRFeature[];
  requirements: string[];
  rating: number;
  reviews: number;
  accessibility: {
    motionSickness: 'low' | 'medium' | 'high';
    ageRating: string;
    physicalRequirement: string;
  };
}

export interface VRFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface VRSession {
  id: string;
  userId: string;
  experienceId: string;
  startTime: number;
  duration: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  interactionCount: number;
  waypoints: VRWaypoint[];
  screenshots: string[];
  performance: VRPerformance;
}

export interface VRWaypoint {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  timestamp: number;
  visited: boolean;
}

export interface VRPerformance {
  fps: number;
  latency: number;
  renderQuality: number;
  deviceType: string;
  headset: string;
}

export interface VRControls {
  movement: 'teleport' | 'smooth' | 'snap';
  rotation: 'snap' | 'smooth';
  handTracking: boolean;
  voiceCommands: boolean;
  gestureControls: boolean;
}

// VR Experiences Database
export const VR_EXPERIENCES: VRExperience[] = [
  {
    id: 'vr-borobudur-sunrise',
    name: 'Borobudur Sunrise Experience',
    description: 'Witness the majestic sunrise over Borobudur Temple in immersive VR',
    destination: 'Borobudur, Central Java',
    type: 'tour',
    duration: 45,
    difficulty: 'easy',
    thumbnailUrl: '/vr/borobudur-thumb.jpg',
    vrSceneUrl: '/vr/scenes/borobudur-sunrise.json',
    features: [
      { id: 'f1', name: 'Time-lapse', icon: '⏱️', description: 'Watch sunrise in accelerated time', enabled: true },
      { id: 'f2', name: 'Audio Guide', icon: '🎧', description: 'Expert narration throughout', enabled: true },
      { id: 'f3', name: 'Photo Mode', icon: '📷', description: 'Capture VR screenshots', enabled: true },
      { id: 'f4', name: '360° View', icon: '🔄', description: 'Full panoramic exploration', enabled: true }
    ],
    requirements: ['VR Headset', '4GB RAM', 'Stable Internet'],
    rating: 4.9,
    reviews: 3456,
    accessibility: {
      motionSickness: 'low',
      ageRating: 'All Ages',
      physicalRequirement: 'None'
    }
  },
  {
    id: 'vr-underwater-raja-ampat',
    name: 'Raja Ampat Underwater Adventure',
    description: 'Dive deep into the world\'s most biodiverse marine ecosystem',
    destination: 'Raja Ampat, West Papua',
    type: 'activity',
    duration: 60,
    difficulty: 'medium',
    thumbnailUrl: '/vr/raja-ampat-thumb.jpg',
    vrSceneUrl: '/vr/scenes/raja-ampat-dive.json',
    features: [
      { id: 'f5', name: 'Scuba Simulation', icon: '🤿', description: 'Realistic diving mechanics', enabled: true },
      { id: 'f6', name: 'Marine Life', icon: '🐠', description: 'Interact with 100+ species', enabled: true },
      { id: 'f7', name: 'Hand Tracking', icon: '👋', description: 'Natural hand movements', enabled: true },
      { id: 'f8', name: 'Guided Tour', icon: '🗺️', description: 'Follow marine biologist', enabled: true }
    ],
    requirements: ['VR Headset with Controllers', '6GB RAM', 'High-Speed Internet'],
    rating: 4.95,
    reviews: 2890,
    accessibility: {
      motionSickness: 'medium',
      ageRating: '12+',
      physicalRequirement: 'Standing/Room-Scale'
    }
  },
  {
    id: 'vr-komodo-safari',
    name: 'Komodo Island Safari',
    description: 'Experience a thrilling safari to observe Komodo dragons',
    destination: 'Komodo National Park',
    type: 'activity',
    duration: 40,
    difficulty: 'easy',
    thumbnailUrl: '/vr/komodo-thumb.jpg',
    vrSceneUrl: '/vr/scenes/komodo-safari.json',
    features: [
      { id: 'f9', name: 'Wildlife AI', icon: '🦎', description: 'Realistic animal behavior', enabled: true },
      { id: 'f10', name: 'Safety Mode', icon: '🛡️', description: 'Safe distance maintained', enabled: true },
      { id: 'f11', name: 'Educational', icon: '📚', description: 'Learn about conservation', enabled: true },
      { id: 'f12', name: 'Photo Safari', icon: '📸', description: 'Capture wildlife shots', enabled: true }
    ],
    requirements: ['VR Headset', '4GB RAM', 'Stable Internet'],
    rating: 4.85,
    reviews: 4123,
    accessibility: {
      motionSickness: 'low',
      ageRating: '10+',
      physicalRequirement: 'Seated/Standing'
    }
  },
  {
    id: 'vr-cultural-ubud',
    name: 'Ubud Cultural Immersion',
    description: 'Participate in traditional Balinese ceremonies and crafts',
    destination: 'Ubud, Bali',
    type: 'educational',
    duration: 50,
    difficulty: 'easy',
    thumbnailUrl: '/vr/ubud-thumb.jpg',
    vrSceneUrl: '/vr/scenes/ubud-culture.json',
    features: [
      { id: 'f13', name: 'Interactive Crafts', icon: '🎨', description: 'Try traditional art forms', enabled: true },
      { id: 'f14', name: 'Dance Performance', icon: '💃', description: 'Watch traditional dances', enabled: true },
      { id: 'f15', name: 'Voice Guide', icon: '🎤', description: 'Voice-activated information', enabled: true },
      { id: 'f16', name: 'Social VR', icon: '👥', description: 'Join with other visitors', enabled: true }
    ],
    requirements: ['VR Headset', '4GB RAM', 'Microphone (optional)'],
    rating: 4.75,
    reviews: 2567,
    accessibility: {
      motionSickness: 'low',
      ageRating: 'All Ages',
      physicalRequirement: 'Seated'
    }
  },
  {
    id: 'vr-volcano-bromo',
    name: 'Mount Bromo Volcanic Experience',
    description: 'Explore an active volcano and witness its raw power',
    destination: 'Mount Bromo, East Java',
    type: 'tour',
    duration: 35,
    difficulty: 'hard',
    thumbnailUrl: '/vr/bromo-thumb.jpg',
    vrSceneUrl: '/vr/scenes/bromo-volcano.json',
    features: [
      { id: 'f17', name: 'Environmental FX', icon: '🌋', description: 'Realistic smoke and heat', enabled: true },
      { id: 'f18', name: 'Crater Descent', icon: '⬇️', description: 'Get close to the crater', enabled: true },
      { id: 'f19', name: 'Geology Tour', icon: '⛏️', description: 'Learn about volcanology', enabled: true },
      { id: 'f20', name: 'Safety Warnings', icon: '⚠️', description: 'Real-time hazard alerts', enabled: true }
    ],
    requirements: ['VR Headset with Controllers', '8GB RAM', 'High-Speed Internet'],
    rating: 4.8,
    reviews: 1934,
    accessibility: {
      motionSickness: 'high',
      ageRating: '16+',
      physicalRequirement: 'Room-Scale'
    }
  },
  {
    id: 'vr-prambanan-night',
    name: 'Prambanan Night Temple Tour',
    description: 'Experience the mystical atmosphere of Prambanan at night',
    destination: 'Prambanan, Yogyakarta',
    type: 'entertainment',
    duration: 30,
    difficulty: 'easy',
    thumbnailUrl: '/vr/prambanan-thumb.jpg',
    vrSceneUrl: '/vr/scenes/prambanan-night.json',
    features: [
      { id: 'f21', name: 'Lighting Effects', icon: '💡', description: 'Dramatic temple lighting', enabled: true },
      { id: 'f22', name: 'Ramayana Ballet', icon: '🎭', description: 'Watch traditional performance', enabled: true },
      { id: 'f23', name: 'Ambient Sound', icon: '🔊', description: 'Immersive audio design', enabled: true },
      { id: 'f24', name: 'Meditation Mode', icon: '🧘', description: 'Peaceful exploration', enabled: true }
    ],
    requirements: ['VR Headset', '4GB RAM', 'Headphones (recommended)'],
    rating: 4.7,
    reviews: 2234,
    accessibility: {
      motionSickness: 'low',
      ageRating: 'All Ages',
      physicalRequirement: 'Seated/Standing'
    }
  }
];

/**
 * Start VR Session
 */
export function startVRSession(
  userId: string,
  experienceId: string,
  quality: VRSession['quality']
): VRSession {
  const experience = VR_EXPERIENCES.find(e => e.id === experienceId);
  
  return {
    id: `vr-session-${Date.now()}`,
    userId,
    experienceId,
    startTime: Date.now(),
    duration: 0,
    quality,
    interactionCount: 0,
    waypoints: [],
    screenshots: [],
    performance: {
      fps: quality === 'ultra' ? 90 : quality === 'high' ? 72 : quality === 'medium' ? 60 : 30,
      latency: quality === 'ultra' ? 5 : quality === 'high' ? 10 : quality === 'medium' ? 15 : 25,
      renderQuality: quality === 'ultra' ? 100 : quality === 'high' ? 80 : quality === 'medium' ? 60 : 40,
      deviceType: 'Unknown',
      headset: 'Generic VR'
    }
  };
}

/**
 * Update VR Session
 */
export function updateVRSession(
  session: VRSession,
  updates: Partial<VRSession>
): VRSession {
  return { ...session, ...updates };
}

/**
 * Add Waypoint to Session
 */
export function addWaypoint(
  session: VRSession,
  waypoint: Omit<VRWaypoint, 'timestamp' | 'visited'>
): VRSession {
  const newWaypoint: VRWaypoint = {
    ...waypoint,
    timestamp: Date.now(),
    visited: true
  };
  
  return {
    ...session,
    waypoints: [...session.waypoints, newWaypoint]
  };
}

/**
 * Calculate Session Stats
 */
export function calculateVRStats(session: VRSession) {
  const duration = Math.floor((Date.now() - session.startTime) / 1000 / 60); // minutes
  const experience = VR_EXPERIENCES.find(e => e.id === session.experienceId);
  const completionRate = experience 
    ? Math.min(100, (duration / experience.duration) * 100)
    : 0;
  
  return {
    duration,
    completionRate: completionRate.toFixed(1),
    waypointsVisited: session.waypoints.filter(w => w.visited).length,
    totalWaypoints: session.waypoints.length,
    screenshots: session.screenshots.length,
    interactions: session.interactionCount,
    averageFPS: session.performance.fps,
    averageLatency: session.performance.latency,
    qualityScore: session.performance.renderQuality
  };
}

/**
 * Get Recommended VR Experiences
 */
export function getRecommendedVRExperiences(
  userPreferences: {
    difficulty?: string;
    type?: string;
    maxDuration?: number;
  }
): VRExperience[] {
  let filtered = [...VR_EXPERIENCES];
  
  if (userPreferences.difficulty) {
    filtered = filtered.filter(e => e.difficulty === userPreferences.difficulty);
  }
  
  if (userPreferences.type) {
    filtered = filtered.filter(e => e.type === userPreferences.type);
  }
  
  if (userPreferences.maxDuration) {
    filtered = filtered.filter(e => e.duration <= userPreferences.maxDuration);
  }
  
  // Sort by rating
  return filtered.sort((a, b) => b.rating - a.rating);
}

/**
 * Check VR System Requirements
 */
export function checkVRRequirements(experienceId: string): {
  supported: boolean;
  missing: string[];
  recommendations: string[];
} {
  const experience = VR_EXPERIENCES.find(e => e.id === experienceId);
  if (!experience) {
    return { supported: false, missing: ['Experience not found'], recommendations: [] };
  }
  
  // Mock system check (in real implementation, this would check actual hardware)
  const hasVRHeadset = true;
  const ram = 8; // GB
  const internetSpeed = 50; // Mbps
  
  const missing: string[] = [];
  const recommendations: string[] = [];
  
  if (!hasVRHeadset) {
    missing.push('VR Headset required');
  }
  
  if (experience.requirements.includes('6GB RAM') && ram < 6) {
    missing.push('Insufficient RAM (6GB required)');
  }
  
  if (experience.requirements.includes('8GB RAM') && ram < 8) {
    missing.push('Insufficient RAM (8GB required)');
  }
  
  if (experience.requirements.includes('High-Speed Internet') && internetSpeed < 25) {
    missing.push('Faster internet connection recommended');
    recommendations.push('25 Mbps or higher for best experience');
  }
  
  if (experience.accessibility.motionSickness === 'high') {
    recommendations.push('Motion sickness warning: Take breaks if needed');
  }
  
  return {
    supported: missing.length === 0,
    missing,
    recommendations
  };
}

/**
 * Export VR Session Data
 */
export function exportVRSessionData(session: VRSession): string {
  const stats = calculateVRStats(session);
  const experience = VR_EXPERIENCES.find(e => e.id === session.experienceId);
  
  return JSON.stringify({
    session: {
      id: session.id,
      experience: experience?.name || 'Unknown',
      startTime: new Date(session.startTime).toISOString(),
      ...stats
    },
    waypoints: session.waypoints,
    performance: session.performance
  }, null, 2);
}
