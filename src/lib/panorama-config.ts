/**
 * STC Ultimate - 360° Panorama Configuration
 * 
 * Centralized configuration for managing 360° panoramic images
 * across all destinations and venues.
 */

export interface PanoramaImage {
  id: string;
  name: string;
  description: string;
  imagePath: string; // Path relative to /public OR external URL (https://)
  fallbackColor: string; // Fallback color if image fails to load
  hotspots: PanoramaHotspot[];
}

export interface PanoramaHotspot {
  position: [number, number, number];
  label: string;
  color: string;
  description?: string;
  linkedPanoramaId?: string; // For navigation between panoramas
}

export interface DestinationPanoramas {
  destinationId: string;
  destinationName: string;
  panoramas: PanoramaImage[];
}

/**
 * 360° Panorama Library
 * 
 * USING EXTERNAL URLS:
 * Images are loaded from external sources (Poly Haven, sample panoramas)
 * These are equirectangular 360° images in 2:1 aspect ratio
 * 
 * TO ADD YOUR OWN:
 * 1. Host your 360° images online (CDN, cloud storage, etc.)
 * 2. Update imagePath with the full URL
 * 3. Or upload to /public/panoramas/ and use local paths
 */
export const PANORAMA_LIBRARY: DestinationPanoramas[] = [
  {
    destinationId: 'bali',
    destinationName: 'Bali',
    panoramas: [
      {
        id: 'bali-hotel-room',
        name: 'Luxury Hotel Room',
        description: 'Premium ocean-view suite with traditional Balinese decor',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/modern_buildings_2.jpg',
        fallbackColor: '#06b6d4',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Balcony View',
            color: '#06b6d4',
            description: 'Ocean view balcony',
          },
          {
            position: [-10, 3, -10],
            label: 'Bathroom',
            color: '#8b5cf6',
            description: 'Luxury bathroom',
          },
          {
            position: [0, 8, -15],
            label: 'Bed',
            color: '#10b981',
            description: 'King-size bed',
          },
          {
            position: [15, 0, 0],
            label: 'Living Area',
            color: '#f59e0b',
            description: 'Seating area',
          },
        ],
      },
      {
        id: 'bali-restaurant',
        name: 'Beachfront Restaurant',
        description: 'Fine dining with panoramic ocean views',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/outdoor_umbrellas.jpg',
        fallbackColor: '#8b5cf6',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Bar Area',
            color: '#06b6d4',
            description: 'Cocktail bar',
          },
          {
            position: [-10, 3, -10],
            label: 'Dining Tables',
            color: '#8b5cf6',
            description: 'Main dining area',
          },
          {
            position: [0, 8, -15],
            label: 'Kitchen View',
            color: '#10b981',
            description: 'Open kitchen',
          },
          {
            position: [15, 0, 0],
            label: 'Beach View',
            color: '#f59e0b',
            description: 'Ocean sunset view',
          },
        ],
      },
      {
        id: 'bali-beach',
        name: 'Pristine Beach',
        description: 'White sand beach with crystal clear waters',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/sunny_vondelpark.jpg',
        fallbackColor: '#10b981',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Beach Bar',
            color: '#06b6d4',
            description: 'Refreshments',
          },
          {
            position: [-10, 3, -10],
            label: 'Water Sports',
            color: '#8b5cf6',
            description: 'Activities area',
          },
          {
            position: [0, 8, -15],
            label: 'Sun Loungers',
            color: '#10b981',
            description: 'Relaxation zone',
          },
          {
            position: [15, 0, 0],
            label: 'Ocean View',
            color: '#f59e0b',
            description: 'Surfing spot',
          },
        ],
      },
      {
        id: 'bali-temple',
        name: 'Uluwatu Temple',
        description: 'Ancient clifftop temple with ocean backdrop',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/brown_photostudio_02.jpg',
        fallbackColor: '#f59e0b',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Main Shrine',
            color: '#06b6d4',
            description: 'Sacred temple',
          },
          {
            position: [-10, 3, -10],
            label: 'Cliff Edge',
            color: '#8b5cf6',
            description: 'Sunset viewpoint',
          },
          {
            position: [0, 8, -15],
            label: 'Prayer Area',
            color: '#10b981',
            description: 'Meditation spot',
          },
          {
            position: [15, 0, 0],
            label: 'Ocean Panorama',
            color: '#f59e0b',
            description: 'Indian Ocean view',
          },
        ],
      },
    ],
  },
  {
    destinationId: 'yogyakarta',
    destinationName: 'Yogyakarta',
    panoramas: [
      {
        id: 'yogya-hotel-room',
        name: 'Heritage Hotel Room',
        description: 'Traditional Javanese-style luxury accommodation',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/studio_small_09.jpg',
        fallbackColor: '#06b6d4',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Balcony',
            color: '#06b6d4',
            description: 'City view',
          },
          {
            position: [-10, 3, -10],
            label: 'Bathroom',
            color: '#8b5cf6',
            description: 'Modern bathroom',
          },
          {
            position: [0, 8, -15],
            label: 'Sleeping Area',
            color: '#10b981',
            description: 'Queen bed',
          },
          {
            position: [15, 0, 0],
            label: 'Seating',
            color: '#f59e0b',
            description: 'Reading nook',
          },
        ],
      },
      {
        id: 'yogya-restaurant',
        name: 'Javanese Restaurant',
        description: 'Authentic local cuisine in traditional setting',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/restaurant.jpg',
        fallbackColor: '#8b5cf6',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Buffet Area',
            color: '#06b6d4',
            description: 'Local dishes',
          },
          {
            position: [-10, 3, -10],
            label: 'Dining Tables',
            color: '#8b5cf6',
            description: 'Traditional seating',
          },
          {
            position: [0, 8, -15],
            label: 'Kitchen',
            color: '#10b981',
            description: 'Cooking area',
          },
          {
            position: [15, 0, 0],
            label: 'Garden View',
            color: '#f59e0b',
            description: 'Outdoor seating',
          },
        ],
      },
      {
        id: 'yogya-borobudur',
        name: 'Borobudur Temple',
        description: 'UNESCO World Heritage Buddhist temple',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/thatch_chapel.jpg',
        fallbackColor: '#10b981',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Main Stupa',
            color: '#06b6d4',
            description: 'Central monument',
          },
          {
            position: [-10, 3, -10],
            label: 'Buddha Statues',
            color: '#8b5cf6',
            description: 'Sacred sculptures',
          },
          {
            position: [0, 8, -15],
            label: 'Relief Carvings',
            color: '#10b981',
            description: 'Historical art',
          },
          {
            position: [15, 0, 0],
            label: 'Mountain View',
            color: '#f59e0b',
            description: 'Sunrise panorama',
          },
        ],
      },
      {
        id: 'yogya-prambanan',
        name: 'Prambanan Temple',
        description: 'Magnificent Hindu temple complex',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/quattro_canti.jpg',
        fallbackColor: '#f59e0b',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Main Temple',
            color: '#06b6d4',
            description: 'Shiva temple',
          },
          {
            position: [-10, 3, -10],
            label: 'Temple Grounds',
            color: '#8b5cf6',
            description: 'Complex layout',
          },
          {
            position: [0, 8, -15],
            label: 'Stone Carvings',
            color: '#10b981',
            description: 'Ancient reliefs',
          },
          {
            position: [15, 0, 0],
            label: 'Sunset View',
            color: '#f59e0b',
            description: 'Golden hour',
          },
        ],
      },
    ],
  },
  {
    destinationId: 'lombok',
    destinationName: 'Lombok',
    panoramas: [
      {
        id: 'lombok-hotel-room',
        name: 'Beach Resort Room',
        description: 'Modern beachfront accommodation',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/hotel_room.jpg',
        fallbackColor: '#06b6d4',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Ocean View',
            color: '#06b6d4',
            description: 'Private balcony',
          },
          {
            position: [-10, 3, -10],
            label: 'Bathroom',
            color: '#8b5cf6',
            description: 'Spa bathroom',
          },
          {
            position: [0, 8, -15],
            label: 'Bedroom',
            color: '#10b981',
            description: 'King bed',
          },
          {
            position: [15, 0, 0],
            label: 'Living Space',
            color: '#f59e0b',
            description: 'Lounge area',
          },
        ],
      },
      {
        id: 'lombok-restaurant',
        name: 'Seafood Restaurant',
        description: 'Fresh catch with beach ambiance',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/chinese_garden.jpg',
        fallbackColor: '#8b5cf6',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Bar',
            color: '#06b6d4',
            description: 'Beach bar',
          },
          {
            position: [-10, 3, -10],
            label: 'Dining Area',
            color: '#8b5cf6',
            description: 'Table service',
          },
          {
            position: [0, 8, -15],
            label: 'BBQ Station',
            color: '#10b981',
            description: 'Grilled seafood',
          },
          {
            position: [15, 0, 0],
            label: 'Beach View',
            color: '#f59e0b',
            description: 'Sunset dining',
          },
        ],
      },
      {
        id: 'lombok-gili',
        name: 'Gili Islands',
        description: 'Paradise islands with turquoise waters',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/beach_parking_2.jpg',
        fallbackColor: '#10b981',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Snorkeling Spot',
            color: '#06b6d4',
            description: 'Coral reefs',
          },
          {
            position: [-10, 3, -10],
            label: 'Beach Area',
            color: '#8b5cf6',
            description: 'White sand',
          },
          {
            position: [0, 8, -15],
            label: 'Boat Dock',
            color: '#10b981',
            description: 'Island hopping',
          },
          {
            position: [15, 0, 0],
            label: 'Ocean View',
            color: '#f59e0b',
            description: 'Crystal waters',
          },
        ],
      },
      {
        id: 'lombok-rinjani',
        name: 'Mount Rinjani',
        description: 'Majestic volcano with crater lake',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/kloppenheim_02.jpg',
        fallbackColor: '#f59e0b',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Summit View',
            color: '#06b6d4',
            description: 'Peak panorama',
          },
          {
            position: [-10, 3, -10],
            label: 'Crater Lake',
            color: '#8b5cf6',
            description: 'Segara Anak',
          },
          {
            position: [0, 8, -15],
            label: 'Hiking Trail',
            color: '#10b981',
            description: 'Trekking path',
          },
          {
            position: [15, 0, 0],
            label: 'Mountain Range',
            color: '#f59e0b',
            description: 'Lombok vista',
          },
        ],
      },
    ],
  },
  {
    destinationId: 'jakarta',
    destinationName: 'Jakarta',
    panoramas: [
      {
        id: 'jakarta-hotel-room',
        name: 'City Hotel Suite',
        description: 'Modern luxury in the heart of Jakarta',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/studio_small_08.jpg',
        fallbackColor: '#06b6d4',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'City View',
            color: '#06b6d4',
            description: 'Skyline panorama',
          },
          {
            position: [-10, 3, -10],
            label: 'Bathroom',
            color: '#8b5cf6',
            description: 'Luxury bathroom',
          },
          {
            position: [0, 8, -15],
            label: 'Bedroom',
            color: '#10b981',
            description: 'King suite',
          },
          {
            position: [15, 0, 0],
            label: 'Work Desk',
            color: '#f59e0b',
            description: 'Business area',
          },
        ],
      },
      {
        id: 'jakarta-restaurant',
        name: 'Sky Restaurant',
        description: 'Fine dining with city lights',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/lilienstein.jpg',
        fallbackColor: '#8b5cf6',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Bar Area',
            color: '#06b6d4',
            description: 'Premium drinks',
          },
          {
            position: [-10, 3, -10],
            label: 'Dining Tables',
            color: '#8b5cf6',
            description: 'Window seating',
          },
          {
            position: [0, 8, -15],
            label: 'Chef Station',
            color: '#10b981',
            description: 'Live cooking',
          },
          {
            position: [15, 0, 0],
            label: 'City View',
            color: '#f59e0b',
            description: 'Night skyline',
          },
        ],
      },
      {
        id: 'jakarta-monas',
        name: 'National Monument',
        description: 'Iconic landmark of Jakarta',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/cape_hill.jpg',
        fallbackColor: '#10b981',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Monument',
            color: '#06b6d4',
            description: 'Monas tower',
          },
          {
            position: [-10, 3, -10],
            label: 'Park Area',
            color: '#8b5cf6',
            description: 'City park',
          },
          {
            position: [0, 8, -15],
            label: 'Fountain',
            color: '#10b981',
            description: 'Water feature',
          },
          {
            position: [15, 0, 0],
            label: 'City Skyline',
            color: '#f59e0b',
            description: 'Urban view',
          },
        ],
      },
      {
        id: 'jakarta-kota-tua',
        name: 'Old Town (Kota Tua)',
        description: 'Historic colonial district',
        imagePath: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/old_hall.jpg',
        fallbackColor: '#f59e0b',
        hotspots: [
          {
            position: [10, 5, -10],
            label: 'Museum',
            color: '#06b6d4',
            description: 'Jakarta History',
          },
          {
            position: [-10, 3, -10],
            label: 'Square',
            color: '#8b5cf6',
            description: 'Fatahillah Square',
          },
          {
            position: [0, 8, -15],
            label: 'Colonial Buildings',
            color: '#10b981',
            description: 'Dutch architecture',
          },
          {
            position: [15, 0, 0],
            label: 'Street View',
            color: '#f59e0b',
            description: 'Historic district',
          },
        ],
      },
    ],
  },
];

/**
 * Get all panoramas for a specific destination
 */
export function getPanoramasForDestination(destinationId: string): PanoramaImage[] {
  const destination = PANORAMA_LIBRARY.find(d => d.destinationId === destinationId);
  return destination?.panoramas || [];
}

/**
 * Get a specific panorama by ID
 */
export function getPanoramaById(panoramaId: string): PanoramaImage | null {
  for (const destination of PANORAMA_LIBRARY) {
    const panorama = destination.panoramas.find(p => p.id === panoramaId);
    if (panorama) return panorama;
  }
  return null;
}

/**
 * Check if a panorama image exists (for production use)
 * This would typically be done on the backend
 */
export function isPanoramaImageAvailable(imagePath: string): boolean {
  // In production, this would check if the file actually exists
  // For now, we'll assume all configured images are available
  return true;
}
