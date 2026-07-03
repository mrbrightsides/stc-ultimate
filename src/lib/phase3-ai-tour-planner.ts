// Phase 3: AI-Powered Tour Planning System
// Intelligent itinerary generation with machine learning

export interface TourPreferences {
  destinations: string[];
  duration: number; // days
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  interests: string[];
  travelStyle: 'relaxed' | 'moderate' | 'packed';
  groupSize: number;
  accommodation: 'budget' | 'mid-range' | 'luxury';
  transportation: 'public' | 'private' | 'mixed';
  dietary: string[];
  accessibility: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  accommodation: Accommodation;
  transportation: Transportation[];
  estimatedCost: number;
  energyLevel: 'light' | 'moderate' | 'intensive';
  highlights: string[];
}

export interface Activity {
  id: string;
  name: string;
  location: string;
  type: 'cultural' | 'adventure' | 'relaxation' | 'dining' | 'shopping' | 'nature';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  cost: number;
  description: string;
  aiReason: string;
  bookingRequired: boolean;
  weatherDependent: boolean;
  crowdLevel: 'low' | 'medium' | 'high';
  coordinates: { lat: number; lng: number };
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  estimatedCost: number;
  location: string;
  specialDiet: string[];
}

export interface Accommodation {
  name: string;
  type: 'hotel' | 'resort' | 'guesthouse' | 'homestay';
  rating: number;
  pricePerNight: number;
  amenities: string[];
  location: string;
}

export interface Transportation {
  from: string;
  to: string;
  method: 'car' | 'bus' | 'train' | 'plane' | 'boat' | 'walk';
  duration: number; // minutes
  cost: number;
  departureTime: string;
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  generatedAt: Date;
  preferences: TourPreferences;
  days: ItineraryDay[];
  totalCost: number;
  aiConfidenceScore: number;
  optimizationMetrics: {
    timeEfficiency: number;
    costOptimization: number;
    interestMatch: number;
    varietyScore: number;
  };
  alternativeOptions: AlternativeOption[];
  weatherConsiderations: string[];
  travelTips: string[];
}

export interface AlternativeOption {
  activityId: string;
  originalActivity: string;
  alternatives: {
    name: string;
    reason: string;
    costDifference: number;
  }[];
}

export interface AITourPlannerStats {
  totalItinerariesGenerated: number;
  averageConfidenceScore: number;
  mostPopularDestinations: { name: string; count: number }[];
  averageTripDuration: number;
  userSatisfactionRate: number;
  aiModelVersion: string;
  processingSpeed: number; // ms
}

// Mock AI Tour Planner Service
class AITourPlannerService {
  private stats: AITourPlannerStats = {
    totalItinerariesGenerated: 3847,
    averageConfidenceScore: 91.5,
    mostPopularDestinations: [
      { name: 'Bali', count: 1423 },
      { name: 'Yogyakarta', count: 987 },
      { name: 'Raja Ampat', count: 654 },
      { name: 'Jakarta', count: 489 },
      { name: 'Lombok', count: 294 }
    ],
    averageTripDuration: 5.8,
    userSatisfactionRate: 94.2,
    aiModelVersion: 'GPT-4-Tourism-v2.1',
    processingSpeed: 1847
  };

  async generateItinerary(preferences: TourPreferences): Promise<GeneratedItinerary> {
    // Simulate AI processing
    await this.delay(2000);

    const days: ItineraryDay[] = [];
    const startDate = new Date();

    for (let i = 0; i < preferences.duration; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      days.push({
        day: i + 1,
        date: date.toISOString().split('T')[0],
        activities: this.generateActivities(preferences, i),
        meals: this.generateMeals(preferences),
        accommodation: this.generateAccommodation(preferences),
        transportation: this.generateTransportation(preferences),
        estimatedCost: this.calculateDailyCost(preferences),
        energyLevel: i % 3 === 0 ? 'light' : i % 3 === 1 ? 'moderate' : 'intensive',
        highlights: this.generateHighlights(preferences, i)
      });
    }

    const totalCost = days.reduce((sum, day) => sum + day.estimatedCost, 0);

    return {
      id: `itinerary-${Date.now()}`,
      title: `${preferences.destinations.join(' & ')} Adventure`,
      generatedAt: new Date(),
      preferences,
      days,
      totalCost,
      aiConfidenceScore: 88 + Math.random() * 10,
      optimizationMetrics: {
        timeEfficiency: 85 + Math.random() * 15,
        costOptimization: 80 + Math.random() * 20,
        interestMatch: 90 + Math.random() * 10,
        varietyScore: 75 + Math.random() * 25
      },
      alternativeOptions: this.generateAlternatives(),
      weatherConsiderations: [
        'Day 2-3: Light rain expected in the afternoon',
        'Day 4: Perfect weather for outdoor activities',
        'Day 5: High UV index, bring sunscreen'
      ],
      travelTips: [
        'Book Borobudur tickets in advance to skip lines',
        'Best sunset views at Tanah Lot around 6:15 PM',
        'Try local warungs for authentic Indonesian cuisine',
        'Download offline maps for better navigation',
        'Respect local customs when visiting temples'
      ]
    };
  }

  private generateActivities(preferences: TourPreferences, dayIndex: number): Activity[] {
    const activities: Activity[] = [
      {
        id: `act-${dayIndex}-1`,
        name: 'Borobudur Temple Sunrise Tour',
        location: 'Borobudur, Yogyakarta',
        type: 'cultural',
        startTime: '04:30',
        endTime: '08:00',
        duration: 210,
        cost: 450000,
        description: 'Experience the magical sunrise at the world\'s largest Buddhist temple',
        aiReason: 'Matches your interest in cultural heritage and photography',
        bookingRequired: true,
        weatherDependent: true,
        crowdLevel: 'medium',
        coordinates: { lat: -7.6079, lng: 110.2038 }
      },
      {
        id: `act-${dayIndex}-2`,
        name: 'Traditional Batik Workshop',
        location: 'Kotagede, Yogyakarta',
        type: 'cultural',
        startTime: '10:00',
        endTime: '13:00',
        duration: 180,
        cost: 250000,
        description: 'Learn the ancient art of batik making from local artisans',
        aiReason: 'Hands-on cultural experience aligned with your interests',
        bookingRequired: true,
        weatherDependent: false,
        crowdLevel: 'low',
        coordinates: { lat: -7.8278, lng: 110.4002 }
      },
      {
        id: `act-${dayIndex}-3`,
        name: 'Malioboro Street Shopping',
        location: 'Malioboro, Yogyakarta',
        type: 'shopping',
        startTime: '15:00',
        endTime: '18:00',
        duration: 180,
        cost: 300000,
        description: 'Explore the bustling shopping street with local crafts and souvenirs',
        aiReason: 'Balanced itinerary with leisure shopping time',
        bookingRequired: false,
        weatherDependent: false,
        crowdLevel: 'high',
        coordinates: { lat: -7.7926, lng: 110.3655 }
      }
    ];

    return activities.slice(0, 2 + dayIndex % 2);
  }

  private generateMeals(preferences: TourPreferences): Meal[] {
    return [
      {
        type: 'breakfast',
        restaurant: 'Via Via Café',
        cuisine: 'International',
        estimatedCost: 75000,
        location: 'Prawirotaman, Yogyakarta',
        specialDiet: []
      },
      {
        type: 'lunch',
        restaurant: 'Gudeg Yu Djum',
        cuisine: 'Traditional Indonesian',
        estimatedCost: 45000,
        location: 'Wijilan, Yogyakarta',
        specialDiet: preferences.dietary
      },
      {
        type: 'dinner',
        restaurant: 'House of Raminten',
        cuisine: 'Javanese Fusion',
        estimatedCost: 125000,
        location: 'Kotabaru, Yogyakarta',
        specialDiet: []
      }
    ];
  }

  private generateAccommodation(preferences: TourPreferences): Accommodation {
    const accommodations = {
      budget: {
        name: 'Puri Garden Hotel',
        type: 'guesthouse' as const,
        rating: 4.2,
        pricePerNight: 250000,
        amenities: ['WiFi', 'Breakfast', 'Pool'],
        location: 'Prawirotaman, Yogyakarta'
      },
      'mid-range': {
        name: 'The Phoenix Hotel Yogyakarta',
        type: 'hotel' as const,
        rating: 4.5,
        pricePerNight: 750000,
        amenities: ['WiFi', 'Breakfast', 'Pool', 'Spa', 'Restaurant'],
        location: 'Malioboro, Yogyakarta'
      },
      luxury: {
        name: 'The Royal Surakarta Heritage',
        type: 'resort' as const,
        rating: 4.8,
        pricePerNight: 1500000,
        amenities: ['WiFi', 'Breakfast', 'Pool', 'Spa', 'Restaurant', 'Butler Service', 'Airport Transfer'],
        location: 'Solo, Central Java'
      }
    };

    return accommodations[preferences.accommodation];
  }

  private generateTransportation(preferences: TourPreferences): Transportation[] {
    return [
      {
        from: 'Hotel',
        to: 'Borobudur Temple',
        method: 'car',
        duration: 60,
        cost: 300000,
        departureTime: '04:00'
      },
      {
        from: 'Borobudur Temple',
        to: 'Kotagede',
        method: 'car',
        duration: 45,
        cost: 150000,
        departureTime: '09:00'
      }
    ];
  }

  private calculateDailyCost(preferences: TourPreferences): number {
    const base = preferences.budget.min + (preferences.budget.max - preferences.budget.min) / 2;
    return base / preferences.duration;
  }

  private generateHighlights(preferences: TourPreferences, dayIndex: number): string[] {
    const highlights = [
      'UNESCO World Heritage Site visit',
      'Traditional craft workshop experience',
      'Local culinary adventure',
      'Stunning photography opportunities',
      'Cultural immersion activities'
    ];

    return highlights.slice(0, 2 + dayIndex % 2);
  }

  private generateAlternatives(): AlternativeOption[] {
    return [
      {
        activityId: 'act-0-1',
        originalActivity: 'Borobudur Temple Sunrise Tour',
        alternatives: [
          {
            name: 'Prambanan Temple Sunset Tour',
            reason: 'Less crowded, equally stunning views',
            costDifference: -50000
          },
          {
            name: 'Borobudur Regular Visit (10 AM)',
            reason: 'More budget-friendly, better weather',
            costDifference: -200000
          }
        ]
      }
    ];
  }

  getStats(): AITourPlannerStats {
    return { ...this.stats };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiTourPlanner = new AITourPlannerService();
