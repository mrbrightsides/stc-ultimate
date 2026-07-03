/**
 * Phase 1: AI Recommendation Engine
 * Personalized tourism recommendations based on user preferences and real-time data
 */

import type { IoTDevice } from './phase1-iot-network';

export interface UserProfile {
  id: string;
  preferences: {
    interests: string[];
    budget: 'low' | 'medium' | 'high';
    travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'luxury';
    groupSize: number;
  };
  history: {
    visitedDestinations: string[];
    completedTours: number;
    totalSpent: number;
  };
}

export interface TourRecommendation {
  id: string;
  name: string;
  destination: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  matchScore: number;
  reasons: string[];
  currentConditions?: {
    crowdLevel: 'low' | 'medium' | 'high';
    weather: string;
    airQuality: string;
  };
}

/**
 * Available tour packages database
 */
const TOUR_DATABASE: Omit<TourRecommendation, 'matchScore' | 'reasons' | 'currentConditions'>[] = [
  {
    id: 'tour-001',
    name: 'Borobudur Sunrise Experience',
    destination: 'Borobudur Temple, Central Java',
    description: 'Witness the breathtaking sunrise from the ancient Borobudur temple',
    category: 'cultural',
    price: 0.015,
    duration: '4 hours'
  },
  {
    id: 'tour-002',
    name: 'Raja Ampat Diving Adventure',
    destination: 'Raja Ampat, West Papua',
    description: 'Explore the world\'s most biodiverse marine ecosystem',
    category: 'adventure',
    price: 0.08,
    duration: '3 days'
  },
  {
    id: 'tour-003',
    name: 'Ubud Cultural Immersion',
    destination: 'Ubud, Bali',
    description: 'Deep dive into Balinese arts, crafts, and traditional ceremonies',
    category: 'cultural',
    price: 0.025,
    duration: '2 days'
  },
  {
    id: 'tour-004',
    name: 'Komodo Dragon Expedition',
    destination: 'Komodo National Park, NTT',
    description: 'Trek to see the legendary Komodo dragons in their natural habitat',
    category: 'adventure',
    price: 0.055,
    duration: '2 days'
  },
  {
    id: 'tour-005',
    name: 'Luxury Beach Retreat',
    destination: 'Nusa Dua, Bali',
    description: 'Exclusive 5-star beachfront resort with private villa and spa',
    category: 'luxury',
    price: 0.12,
    duration: '5 days'
  },
  {
    id: 'tour-006',
    name: 'Prambanan Temple Discovery',
    destination: 'Prambanan, Yogyakarta',
    description: 'Explore the magnificent Hindu temple complex and Ramayana ballet',
    category: 'cultural',
    price: 0.018,
    duration: '3 hours'
  },
  {
    id: 'tour-007',
    name: 'Mount Rinjani Trek',
    destination: 'Mount Rinjani, Lombok',
    description: 'Challenge yourself with a summit trek to Indonesia\'s second-highest volcano',
    category: 'adventure',
    price: 0.045,
    duration: '3 days'
  },
  {
    id: 'tour-008',
    name: 'Tanah Lot Sunset & Dinner',
    destination: 'Tanah Lot Temple, Bali',
    description: 'Romantic sunset viewing at the iconic sea temple with gourmet dinner',
    category: 'relaxation',
    price: 0.032,
    duration: '4 hours'
  }
];

/**
 * Generate personalized tour recommendations using AI
 */
export function generateRecommendations(
  userProfile: UserProfile,
  iotDevices: IoTDevice[],
  limit: number = 5
): TourRecommendation[] {
  const recommendations = TOUR_DATABASE.map(tour => {
    const matchScore = calculateMatchScore(tour, userProfile);
    const reasons = generateReasons(tour, userProfile, matchScore);
    const currentConditions = getCurrentConditions(tour.destination, iotDevices);

    return {
      ...tour,
      matchScore,
      reasons,
      currentConditions
    };
  });

  // Sort by match score and return top N
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Calculate match score based on user preferences
 */
function calculateMatchScore(
  tour: Omit<TourRecommendation, 'matchScore' | 'reasons' | 'currentConditions'>,
  profile: UserProfile
): number {
  let score = 50; // Base score

  // Category match
  if (profile.preferences.travelStyle === tour.category) {
    score += 30;
  }

  // Budget match
  const budgetRanges = {
    low: { min: 0, max: 0.03 },
    medium: { min: 0.02, max: 0.06 },
    high: { min: 0.05, max: 1 }
  };
  const range = budgetRanges[profile.preferences.budget];
  if (tour.price >= range.min && tour.price <= range.max) {
    score += 20;
  } else if (tour.price < range.min) {
    score += 10; // Under budget is still okay
  }

  // Novelty bonus (haven't visited before)
  if (!profile.history.visitedDestinations.includes(tour.destination)) {
    score += 15;
  }

  // Experience level adjustment
  if (profile.history.completedTours > 10) {
    // Experienced travelers might prefer more adventurous options
    if (tour.category === 'adventure' || tour.category === 'cultural') {
      score += 10;
    }
  }

  // Normalize to 0-100 range
  return Math.min(100, Math.max(0, score));
}

/**
 * Generate human-readable reasons for recommendation
 */
function generateReasons(
  tour: Omit<TourRecommendation, 'matchScore' | 'reasons' | 'currentConditions'>,
  profile: UserProfile,
  score: number
): string[] {
  const reasons: string[] = [];

  if (profile.preferences.travelStyle === tour.category) {
    reasons.push(`Matches your ${tour.category} travel style`);
  }

  const budgetMatch = profile.preferences.budget;
  if (
    (budgetMatch === 'low' && tour.price <= 0.03) ||
    (budgetMatch === 'medium' && tour.price >= 0.02 && tour.price <= 0.06) ||
    (budgetMatch === 'high' && tour.price >= 0.05)
  ) {
    reasons.push('Fits your budget preferences');
  }

  if (!profile.history.visitedDestinations.includes(tour.destination)) {
    reasons.push('New destination you haven\'t explored yet');
  }

  if (score >= 80) {
    reasons.push('Highly recommended based on your profile');
  }

  return reasons;
}

/**
 * Get current conditions from IoT devices
 */
function getCurrentConditions(
  destination: string,
  iotDevices: IoTDevice[]
): TourRecommendation['currentConditions'] {
  const relevantDevices = iotDevices.filter(device =>
    device.location.includes(destination.split(',')[0])
  );

  const crowdDevice = relevantDevices.find(d => d.type === 'crowd');
  const tempDevice = relevantDevices.find(d => d.type === 'temperature');
  const airDevice = relevantDevices.find(d => d.type === 'air_quality');

  let crowdLevel: 'low' | 'medium' | 'high' = 'medium';
  if (crowdDevice) {
    const crowdValue = crowdDevice.data.value;
    const max = crowdDevice.data.threshold?.max || 1000;
    if (crowdValue < max * 0.4) crowdLevel = 'low';
    else if (crowdValue > max * 0.7) crowdLevel = 'high';
  }

  let weather = 'Pleasant';
  if (tempDevice) {
    const temp = tempDevice.data.value;
    if (temp < 20) weather = 'Cool';
    else if (temp > 30) weather = 'Hot';
  }

  let airQuality = 'Good';
  if (airDevice) {
    const aqi = airDevice.data.value;
    if (aqi > 100) airQuality = 'Moderate';
    else if (aqi > 150) airQuality = 'Poor';
  }

  return { crowdLevel, weather, airQuality };
}

/**
 * AI Chat Assistant - Generate contextual responses
 */
export function generateAIChatResponse(
  userMessage: string,
  userProfile?: UserProfile,
  iotDevices?: IoTDevice[]
): string {
  const message = userMessage.toLowerCase();

  // Greeting
  if (message.includes('hello') || message.includes('hi')) {
    return 'Hello! I\'m your AI tourism assistant. I can help you find the perfect destinations, check real-time conditions, or answer questions about Indonesian tourism. How can I assist you today?';
  }

  // Recommendations
  if (message.includes('recommend') || message.includes('suggest')) {
    if (!userProfile) {
      return 'I\'d love to recommend tours! Could you tell me about your travel preferences? Are you interested in adventure, culture, relaxation, or luxury experiences?';
    }
    return 'Based on your preferences, I recommend checking out our personalized tour recommendations. I\'ve analyzed your interests and current conditions to find the best options for you!';
  }

  // Weather/Conditions
  if (message.includes('weather') || message.includes('condition')) {
    if (!iotDevices || iotDevices.length === 0) {
      return 'Let me check the current conditions for you...';
    }
    const onlineDevices = iotDevices.filter(d => d.status === 'online');
    return `Currently monitoring ${onlineDevices.length} locations across Indonesia. All systems are operational. Which destination would you like to know about?`;
  }

  // Booking
  if (message.includes('book') || message.includes('reserve')) {
    return 'Great! To book a tour, please select a destination from our recommendations or use the Tour Package Builder. All bookings are secured with blockchain smart contracts for maximum transparency and security.';
  }

  // Price/Budget
  if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
    return 'Our tours range from budget-friendly cultural experiences (0.015 ETH) to luxury retreats (0.12 ETH). I can help you find options that match your budget. What\'s your preferred price range?';
  }

  // Default response
  return 'I\'m here to help with destination recommendations, real-time conditions, bookings, and any questions about Indonesian tourism. What would you like to know?';
}

/**
 * Predict optimal visit times based on historical data
 */
export function predictOptimalVisitTime(destination: string, iotDevices: IoTDevice[]): string[] {
  const predictions: string[] = [];

  const crowdDevice = iotDevices.find(d => 
    d.type === 'crowd' && d.location.includes(destination)
  );

  if (crowdDevice) {
    const currentCrowd = crowdDevice.data.value;
    const max = crowdDevice.data.threshold?.max || 1000;
    
    if (currentCrowd < max * 0.4) {
      predictions.push('Current crowd levels are low - great time to visit!');
    } else if (currentCrowd > max * 0.7) {
      predictions.push('High crowd levels detected - consider visiting early morning or late afternoon');
    } else {
      predictions.push('Moderate crowd levels - comfortable visit conditions');
    }
  }

  predictions.push('Recommended hours: 6-9 AM (least crowded)');
  predictions.push('Avoid: 11 AM - 2 PM (peak tourist hours)');

  return predictions;
}
