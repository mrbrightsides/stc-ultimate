/**
 * STC Ultimate - Destination Configuration System
 * 
 * Defines all-inclusive travel packages with destination-based pricing tiers.
 * Each package includes complete travel services from departure to return.
 */

export interface ServiceMilestone {
  sequence: number;
  serviceName: string;
  serviceType: string;
  vendorAddress: string;
  amount: string;
  iotTrigger: string;
  timing: string;
  // Legacy fields for compatibility
  id?: string;
  name?: string;
  type?: 'flight' | 'hotel' | 'transport' | 'meal' | 'activity' | 'souvenir';
  icon?: string;
  description?: string;
  isDailyCharge?: boolean;
  estimatedTime?: string;
  triggerEvent?: string;
  sequenceOrder?: number;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  radius: number; // verification radius in meters
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  emoji: string;
  description: string;
  tier: 'budget' | 'standard' | 'premium' | 'luxury';
  basePrice: string; // Base price in ETH for 3-day package
  priceMultipliers: {
    '3-day': number;
    '5-day': number;
    '7-day': number;
  };
  coordinates: GPSCoordinates; // GPS coordinates for location verification
  includedServices: ServiceMilestone[];
  milestones: ServiceMilestone[]; // Alias for includedServices
  highlights: string[];
}

// Vendor Addresses (untuk multi-vendor escrow)
const VENDORS = {
  airline: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf', // Airline vendor
  hotel: '0x8b5c9f3e2a4d1b6c7e8f9a0b1c2d3e4f5a6b7c8d', // Hotel chain
  transport: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', // Ground transport
  restaurant: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e', // Restaurant group
  tourism: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', // Tourism activities
  retail: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e', // Souvenir shops
};

/**
 * All-Inclusive Service Templates
 * These are the same across all destinations, only prices vary
 */
const createServiceMilestones = (destination: string): ServiceMilestone[] => [
  // Day 1 - Departure & Arrival
  {
    sequence: 1,
    serviceName: 'Departure Flight',
    serviceType: 'flight',
    vendorAddress: VENDORS.airline,
    amount: '0.03',
    iotTrigger: 'qr_scan',
    timing: 'Day 1 - Morning',
    // Legacy compatibility fields
    id: `${destination}-flight-departure`,
    name: 'Departure Flight',
    type: 'flight',
    icon: 'plane',
    description: 'Outbound flight to destination',
    isDailyCharge: false,
    estimatedTime: 'Day 1 - Morning',
    triggerEvent: 'qr_scan',
    sequenceOrder: 1,
  },
  {
    sequence: 2,
    serviceName: 'Arrival at Destination',
    serviceType: 'flight',
    vendorAddress: VENDORS.airline,
    amount: '0.03',
    iotTrigger: 'qr_scan',
    timing: 'Day 1 - Afternoon',
    // Legacy compatibility fields
    id: `${destination}-flight-arrival`,
    name: 'Arrival at Destination',
    type: 'flight',
    icon: 'plane',
    description: 'Arrival confirmation at destination airport',
    isDailyCharge: false,
    estimatedTime: 'Day 1 - Afternoon',
    triggerEvent: 'qr_scan',
    sequenceOrder: 2,
  },
  {
    sequence: 3,
    serviceName: 'Hotel Check-in',
    serviceType: 'hotel',
    vendorAddress: VENDORS.hotel,
    amount: '0.012',
    iotTrigger: 'rfid_scan',
    timing: 'Day 1 - Evening',
    // Legacy compatibility fields
    id: `${destination}-hotel-checkin`,
    name: 'Hotel Check-in',
    type: 'hotel',
    icon: 'hotel',
    description: 'Luxury hotel accommodation check-in',
    isDailyCharge: true,
    estimatedTime: 'Day 1 - Evening',
    triggerEvent: 'rfid_scan',
    sequenceOrder: 3,
  },
  {
    sequence: 4,
    serviceName: 'Airport Shuttle',
    serviceType: 'transport',
    vendorAddress: VENDORS.transport,
    amount: '0.004',
    iotTrigger: 'qr_scan',
    timing: 'Day 1 - Afternoon',
    // Legacy compatibility fields
    id: `${destination}-airport-shuttle`,
    name: 'Airport Shuttle',
    type: 'transport',
    icon: 'car',
    description: 'Private transfer from airport to hotel',
    isDailyCharge: false,
    estimatedTime: 'Day 1 - Afternoon',
    triggerEvent: 'qr_scan',
    sequenceOrder: 4,
  },
  {
    sequence: 5,
    serviceName: 'Welcome Dinner',
    serviceType: 'meal',
    vendorAddress: VENDORS.restaurant,
    amount: '0.008',
    iotTrigger: 'biometric',
    timing: 'Day 1 - Night',
    // Legacy compatibility fields
    id: `${destination}-welcome-dinner`,
    name: 'Welcome Dinner',
    type: 'meal',
    icon: 'utensils',
    description: 'Premium dining experience',
    isDailyCharge: false,
    estimatedTime: 'Day 1 - Night',
    triggerEvent: 'biometric',
    sequenceOrder: 5,
  },

  // Daily Services (multiply by days - 1 for middle days)
  {
    sequence: 6,
    serviceName: 'Daily Breakfast',
    serviceType: 'meal',
    vendorAddress: VENDORS.restaurant,
    amount: '0.003',
    iotTrigger: 'qr_scan',
    timing: 'Daily - Morning',
    // Legacy compatibility fields
    id: `${destination}-daily-breakfast`,
    name: 'Daily Breakfast',
    type: 'meal',
    icon: 'utensils',
    description: 'Hotel breakfast buffet',
    isDailyCharge: true,
    estimatedTime: 'Daily - Morning',
    triggerEvent: 'qr_scan',
    sequenceOrder: 6,
  },
  {
    sequence: 7,
    serviceName: 'Daily Lunch',
    serviceType: 'meal',
    vendorAddress: VENDORS.restaurant,
    amount: '0.005',
    iotTrigger: 'biometric',
    timing: 'Daily - Afternoon',
    // Legacy compatibility fields
    id: `${destination}-daily-lunch`,
    name: 'Daily Lunch',
    type: 'meal',
    icon: 'utensils',
    description: 'Local cuisine experience',
    isDailyCharge: true,
    estimatedTime: 'Daily - Afternoon',
    triggerEvent: 'biometric',
    sequenceOrder: 7,
  },
  {
    sequence: 8,
    serviceName: 'Daily Ground Transport',
    serviceType: 'transport',
    vendorAddress: VENDORS.transport,
    amount: '0.004',
    iotTrigger: 'qr_scan',
    timing: 'Daily - Throughout Day',
    // Legacy compatibility fields
    id: `${destination}-daily-transport`,
    name: 'Daily Ground Transport',
    type: 'transport',
    icon: 'car',
    description: 'Local transportation for sightseeing',
    isDailyCharge: true,
    estimatedTime: 'Daily - Throughout Day',
    triggerEvent: 'qr_scan',
    sequenceOrder: 8,
  },
  {
    sequence: 9,
    serviceName: 'Tourist Activity #1',
    serviceType: 'activity',
    vendorAddress: VENDORS.tourism,
    amount: '0.010',
    iotTrigger: 'gps',
    timing: 'Daily - Morning',
    // Legacy compatibility fields
    id: `${destination}-tourist-activity-1`,
    name: 'Tourist Activity #1',
    type: 'activity',
    icon: 'activity',
    description: 'Guided tour of main attractions',
    isDailyCharge: true,
    estimatedTime: 'Daily - Morning',
    triggerEvent: 'gps',
    sequenceOrder: 9,
  },
  {
    sequence: 10,
    serviceName: 'Tourist Activity #2',
    serviceType: 'activity',
    vendorAddress: VENDORS.tourism,
    amount: '0.012',
    iotTrigger: 'gps',
    timing: 'Daily - Afternoon',
    // Legacy compatibility fields
    id: `${destination}-tourist-activity-2`,
    name: 'Tourist Activity #2',
    type: 'activity',
    icon: 'activity',
    description: 'Cultural or adventure experience',
    isDailyCharge: true,
    estimatedTime: 'Daily - Afternoon',
    triggerEvent: 'gps',
    sequenceOrder: 10,
  },
  {
    sequence: 11,
    serviceName: 'Daily Dinner',
    serviceType: 'meal',
    vendorAddress: VENDORS.restaurant,
    amount: '0.008',
    iotTrigger: 'biometric',
    timing: 'Daily - Night',
    // Legacy compatibility fields
    id: `${destination}-daily-dinner`,
    name: 'Daily Dinner',
    type: 'meal',
    icon: 'utensils',
    description: 'Evening dining experience',
    isDailyCharge: true,
    estimatedTime: 'Daily - Night',
    triggerEvent: 'biometric',
    sequenceOrder: 11,
  },

  // Final Day - Checkout & Departure
  {
    sequence: 12,
    serviceName: 'Souvenir Shopping',
    serviceType: 'souvenir',
    vendorAddress: VENDORS.retail,
    amount: '0.006',
    iotTrigger: 'qr_scan',
    timing: 'Final Day - Morning',
    // Legacy compatibility fields
    id: `${destination}-souvenir-shopping`,
    name: 'Souvenir Shopping',
    type: 'souvenir',
    icon: 'shopping-bag',
    description: 'Local crafts and gift shopping voucher',
    isDailyCharge: false,
    estimatedTime: 'Final Day - Morning',
    triggerEvent: 'qr_scan',
    sequenceOrder: 12,
  },
  {
    sequence: 13,
    serviceName: 'Hotel Checkout',
    serviceType: 'hotel',
    vendorAddress: VENDORS.hotel,
    amount: '0.012',
    iotTrigger: 'rfid_scan',
    timing: 'Final Day - Morning',
    // Legacy compatibility fields
    id: `${destination}-hotel-checkout`,
    name: 'Hotel Checkout',
    type: 'hotel',
    icon: 'hotel',
    description: 'Final checkout and room inspection',
    isDailyCharge: false,
    estimatedTime: 'Final Day - Morning',
    triggerEvent: 'rfid_scan',
    sequenceOrder: 13,
  },
  {
    sequence: 14,
    serviceName: 'Return Airport Transfer',
    serviceType: 'transport',
    vendorAddress: VENDORS.transport,
    amount: '0.004',
    iotTrigger: 'qr_scan',
    timing: 'Final Day - Afternoon',
    // Legacy compatibility fields
    id: `${destination}-return-shuttle`,
    name: 'Return Airport Transfer',
    type: 'transport',
    icon: 'car',
    description: 'Private transfer to airport',
    isDailyCharge: false,
    estimatedTime: 'Final Day - Afternoon',
    triggerEvent: 'qr_scan',
    sequenceOrder: 14,
  },
  {
    sequence: 15,
    serviceName: 'Return Flight',
    serviceType: 'flight',
    vendorAddress: VENDORS.airline,
    amount: '0.06',
    iotTrigger: 'qr_scan',
    timing: 'Final Day - Evening',
    // Legacy compatibility fields
    id: `${destination}-return-flight`,
    name: 'Return Flight',
    type: 'flight',
    icon: 'plane',
    description: 'Return flight to origin',
    isDailyCharge: false,
    estimatedTime: 'Final Day - Evening',
    triggerEvent: 'qr_scan',
    sequenceOrder: 15,
  },
];

/**
 * Available Destinations with All-Inclusive Packages
 */
export const DESTINATIONS: Destination[] = [
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    country: 'Indonesia',
    emoji: '🏛️',
    description: 'Explore ancient temples and vibrant Javanese culture',
    tier: 'budget',
    basePrice: '0.15', // ~$500 for 3-day package
    priceMultipliers: {
      '3-day': 1.0,
      '5-day': 1.6,
      '7-day': 2.1,
    },
    coordinates: {
      latitude: -7.7956,
      longitude: 110.3695,
      radius: 150, // 150m verification radius
    },
    includedServices: createServiceMilestones('yogyakarta'),
    milestones: createServiceMilestones('yogyakarta'),
    highlights: [
      'Borobudur Temple sunrise tour',
      'Traditional batik workshop',
      'Prambanan Temple complex',
      'Local Javanese cuisine',
      'Street food culinary tour',
      'Cultural performance shows',
    ],
  },
  {
    id: 'lombok',
    name: 'Lombok',
    country: 'Indonesia',
    emoji: '🌋',
    description: 'Adventure and pristine beaches in an untouched paradise',
    tier: 'standard',
    basePrice: '0.17', // ~$570 for 3-day package
    priceMultipliers: {
      '3-day': 1.0,
      '5-day': 1.65,
      '7-day': 2.2,
    },
    coordinates: {
      latitude: -8.5833,
      longitude: 116.1167,
      radius: 200, // 200m verification radius
    },
    includedServices: createServiceMilestones('lombok'),
    milestones: createServiceMilestones('lombok'),
    highlights: [
      'Mount Rinjani trekking',
      'Gili Islands snorkeling',
      'Pink Beach exploration',
      'Traditional Sasak village',
      'Waterfall adventures',
      'Beachfront seafood dining',
    ],
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    country: 'Indonesia',
    emoji: '🏙️',
    description: 'Modern metropolitan experience with cultural diversity',
    tier: 'standard',
    basePrice: '0.18', // ~$600 for 3-day package
    priceMultipliers: {
      '3-day': 1.0,
      '5-day': 1.7,
      '7-day': 2.3,
    },
    coordinates: {
      latitude: -6.2088,
      longitude: 106.8456,
      radius: 100, // 100m verification radius
    },
    includedServices: createServiceMilestones('jakarta'),
    milestones: createServiceMilestones('jakarta'),
    highlights: [
      'National Monument (Monas)',
      'Old Town (Kota Tua) heritage',
      'Modern mall shopping',
      'Sky dining experiences',
      'Museum tours',
      'Nightlife entertainment',
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    emoji: '🏝️',
    description: 'Tropical paradise with world-class beaches and resorts',
    tier: 'premium',
    basePrice: '0.20', // ~$670 for 3-day package
    priceMultipliers: {
      '3-day': 1.0,
      '5-day': 1.8,
      '7-day': 2.5,
    },
    coordinates: {
      latitude: -8.4095,
      longitude: 115.1889,
      radius: 150, // 150m verification radius
    },
    includedServices: createServiceMilestones('bali'),
    milestones: createServiceMilestones('bali'),
    highlights: [
      'Luxury beach resort stay',
      'Uluwatu Temple sunset',
      'Ubud rice terrace tours',
      'Spa and wellness treatments',
      'Water sports activities',
      'Fine dining experiences',
    ],
  },
];

/**
 * Calculate total package price based on destination and duration
 */
export function calculatePackagePrice(
  destinationId: string,
  durationDays: number
): string {
  const destination = DESTINATIONS.find(d => d.id === destinationId);
  if (!destination) return '0.00';

  const basePrice = parseFloat(destination.basePrice);
  
  // Get multiplier based on duration
  let multiplier = 1.0;
  if (durationDays <= 3) {
    multiplier = destination.priceMultipliers['3-day'];
  } else if (durationDays <= 5) {
    multiplier = destination.priceMultipliers['5-day'];
  } else {
    multiplier = destination.priceMultipliers['7-day'];
  }

  const totalPrice = basePrice * multiplier;
  return totalPrice.toFixed(2);
}

/**
 * Get all milestone services for a package with calculated prices
 */
export function getPackageMilestones(
  destinationId: string,
  durationDays: number
): ServiceMilestone[] {
  const destination = DESTINATIONS.find(d => d.id === destinationId);
  if (!destination) return [];

  return destination.includedServices.map(service => {
    // Calculate actual amount based on duration
    let calculatedAmount = parseFloat(service.amount);
    
    if (service.isDailyCharge) {
      // For daily charges, multiply by number of days
      calculatedAmount = calculatedAmount * durationDays;
    }

    return {
      ...service,
      amount: calculatedAmount.toFixed(3), // Return calculated amount
    };
  });
}

/**
 * Get destination tier badge color
 */
export function getDestinationTierColor(tier: Destination['tier']): string {
  const colors = {
    budget: 'green',
    standard: 'blue',
    premium: 'purple',
    luxury: 'yellow',
  };
  return colors[tier];
}

/**
 * Get destination tier label
 */
export function getDestinationTierLabel(tier: Destination['tier']): string {
  const labels = {
    budget: 'Budget Friendly',
    standard: 'Standard',
    premium: 'Premium',
    luxury: 'Luxury',
  };
  return labels[tier];
}
