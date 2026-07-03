/**
 * STC Ultimate - Tourism Data Library
 * Phase 3: Enhanced Content & Information
 */

export interface TourismLocation {
  id: string;
  name: string;
  region: string;
  description: string;
  longDescription: string;
  image: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  bestTimeToVisit: string;
  averageCost: string;
  tags: string[];
}

export interface LocationHotspot {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  audioNarration?: string; // Text for TTS
  images?: string[];
  facts?: string[];
  tips?: string[];
  links?: { label: string; url: string }[];
  category: 'cultural' | 'natural' | 'activity' | 'dining' | 'accommodation';
}

/**
 * Indonesian Tourism Locations Database
 * Phase 3 Enhancement: Rich content for immersive experience
 */
export const INDONESIA_LOCATIONS: TourismLocation[] = [
  {
    id: 'bali',
    name: 'Bali',
    region: 'Bali Province',
    description: 'Island of Gods - Tropical paradise with stunning beaches and rich culture',
    longDescription: 'Bali is Indonesia\'s most famous island, known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple, and its unique Hindu culture includes traditional dance performances and colorful ceremonies.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    coordinates: { lat: -8.3405, lng: 115.0920 },
    highlights: [
      'Uluwatu Temple & Kecak Dance',
      'Tegallalang Rice Terraces',
      'Sacred Monkey Forest Sanctuary',
      'Beautiful Beaches (Seminyak, Nusa Dua)',
      'Traditional Balinese Spa & Wellness'
    ],
    bestTimeToVisit: 'April to October (Dry Season)',
    averageCost: '$50-150 per day',
    tags: ['beach', 'culture', 'temples', 'surfing', 'wellness']
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    region: 'Special Region of Yogyakarta',
    description: 'Cultural heart of Java with ancient temples and royal heritage',
    longDescription: 'Yogyakarta is a bustling town of some 500,000 people and the most popular tourist destination in Java, largely thanks to its proximity to the temples of Borobudur and Prambanan. The city is the center of classical Javanese culture and heritage, featuring traditional arts, batik workshops, and the Sultan\'s Palace.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
    coordinates: { lat: -7.7956, lng: 110.3695 },
    highlights: [
      'Borobudur Temple (UNESCO)',
      'Prambanan Temple Complex',
      'Sultan\'s Palace (Kraton)',
      'Malioboro Street Shopping',
      'Mount Merapi Volcano Tours'
    ],
    bestTimeToVisit: 'May to September',
    averageCost: '$30-80 per day',
    tags: ['culture', 'temples', 'heritage', 'art', 'volcano']
  },
  {
    id: 'lombok',
    name: 'Lombok',
    region: 'West Nusa Tenggara',
    description: 'Pristine beaches and majestic Mount Rinjani',
    longDescription: 'Lombok is an island in West Nusa Tenggara province, Indonesia. It forms part of the chain of the Lesser Sunda Islands, with the Lombok Strait separating it from Bali to the west and the Alas Strait between it and Sumbawa to the east. The island is famous for its beaches, surf spots, and the massive Mount Rinjani volcano.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    coordinates: { lat: -8.6500, lng: 116.3247 },
    highlights: [
      'Mount Rinjani Trekking',
      'Gili Islands (Gili Trawangan, Meno, Air)',
      'Pink Beach (Pantai Merah)',
      'Traditional Sasak Villages',
      'Senggigi Beach Resort'
    ],
    bestTimeToVisit: 'April to October',
    averageCost: '$40-100 per day',
    tags: ['beach', 'trekking', 'diving', 'island', 'adventure']
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    region: 'DKI Jakarta',
    description: 'Indonesia\'s vibrant capital city - modern metropolis meets history',
    longDescription: 'Jakarta is Indonesia\'s massive capital city on the northwest coast of the island of Java. A historic mix of cultures – Javanese, Malay, Chinese, Arab, Indian and European – has influenced its architecture, language and cuisine. The old town, Kota Tua, is home to Dutch colonial buildings, Glodok (Jakarta\'s Chinatown) and the old port of Sunda Kelapa.',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800',
    coordinates: { lat: -6.2088, lng: 106.8456 },
    highlights: [
      'National Monument (Monas)',
      'Old Town (Kota Tua)',
      'Thousand Islands (Kepulauan Seribu)',
      'Modern Shopping Malls',
      'Diverse Culinary Scene'
    ],
    bestTimeToVisit: 'June to September',
    averageCost: '$40-120 per day',
    tags: ['city', 'culture', 'shopping', 'food', 'nightlife']
  }
];

/**
 * Detailed Hotspot Information
 * Phase 3: Rich content for each point of interest
 */
export const LOCATION_HOTSPOTS: Record<string, LocationHotspot[]> = {
  bali: [
    {
      id: 'uluwatu-temple',
      title: 'Uluwatu Temple',
      description: 'Ancient Hindu temple on clifftop with ocean views',
      longDescription: 'Pura Luhur Uluwatu is one of Bali\'s kayangan jagat (directional temples) and guards Bali from evil spirits from the south-west. Major Hindu deities dwell in Uluwatu such as - Bhatara Rudra, God of all directions and in his manifestation as Bhatara Bhatari Dang Hyang Nirartha as a sakti. It is definitely one of the top places to visit in Bali. The temple is built on the edge of a cliff with a dramatic 70m drop to the ocean.',
      audioNarration: 'Welcome to Uluwatu Temple, one of Bali\'s most sacred sea temples. Built in the 11th century, this magnificent temple sits 70 meters above the Indian Ocean on a steep cliff. The temple is dedicated to Sang Hyang Widhi Wasa in his manifestation as Rudra. Don\'t miss the stunning Kecak fire dance performance at sunset.',
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600',
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600'
      ],
      facts: [
        'Built in the 11th century by Mpu Kuturan',
        'Height: 70 meters above sea level',
        'Home to hundreds of monkeys',
        'Famous for Kecak fire dance at sunset',
        'One of six key temples protecting Bali'
      ],
      tips: [
        'Visit at sunset for the best views',
        'Watch out for the monkeys - they steal belongings',
        'Book Kecak dance tickets in advance',
        'Wear a sarong (provided at entrance)',
        'Best time: 4-6 PM'
      ],
      links: [
        { label: 'Book Tickets', url: 'https://www.uluwatu-temple.com' },
        { label: 'Kecak Dance Schedule', url: 'https://www.balikecak.com' }
      ],
      category: 'cultural'
    },
    {
      id: 'tegallalang-rice-terrace',
      title: 'Tegallalang Rice Terraces',
      description: 'Iconic verdant rice paddies with traditional Subak irrigation',
      longDescription: 'The Tegallalang Rice Terrace in Ubud is famous for its beautiful scenes of rice paddies involving the subak (traditional Balinese cooperative irrigation system). The high roadside location provides a good vantage point for viewing the terraces that make for a stunning natural backdrop. Visitors can walk through the terraces and learn about traditional farming methods.',
      audioNarration: 'You are now experiencing the breathtaking Tegallalang Rice Terraces, a UNESCO-listed cultural landscape. These emerald-green terraces showcase Bali\'s ancient Subak irrigation system, dating back to the 9th century. The terraces cascade down the hillside in a stunning display of agricultural artistry.',
      images: [
        'https://images.unsplash.com/photo-1537967370576-5c5b74e49b06?w=600'
      ],
      facts: [
        'Part of UNESCO World Heritage Site',
        'Uses 1000-year-old Subak irrigation system',
        'Terraces carved into hillside by hand',
        'Rice harvested 2-3 times per year',
        'Covers approximately 20 hectares'
      ],
      tips: [
        'Best light for photos: early morning',
        'Wear comfortable shoes for walking',
        'Respect the working farmers',
        'Entry fee: IDR 20,000',
        'Try the jungle swing nearby'
      ],
      links: [
        { label: 'Ubud Tourism Guide', url: 'https://www.ubud.id' }
      ],
      category: 'natural'
    },
    {
      id: 'seminyak-beach',
      title: 'Seminyak Beach',
      description: 'Upscale beach destination with beach clubs and dining',
      longDescription: 'Seminyak is Bali\'s most stylish and upscale beach resort area, featuring a wide stretch of grey sand and rolling surf. The beach is lined with luxury resorts, trendy beach clubs, and world-class restaurants. It\'s the perfect spot for sunset cocktails, surfing, and people-watching.',
      audioNarration: 'Welcome to Seminyak Beach, Bali\'s most sophisticated coastal destination. Known for its stunning sunsets, upscale beach clubs, and excellent surf breaks, Seminyak offers a perfect blend of relaxation and excitement. The beach stretches for several kilometers and is famous for its vibrant nightlife scene.',
      facts: [
        'One of Bali\'s longest beaches',
        'Home to La Plancha beach bar',
        'Great surf breaks for all levels',
        'Famous for sunset cocktails',
        'High-end shopping area nearby'
      ],
      tips: [
        'Best time: Sunset (5-7 PM)',
        'Book beach clubs in advance',
        'Watch for strong currents when swimming',
        'Try local warung food on the beach',
        'Rent surfboard: IDR 50,000/hour'
      ],
      category: 'natural'
    },
    {
      id: 'monkey-forest',
      title: 'Sacred Monkey Forest',
      description: 'Nature reserve and temple complex inhabited by grey long-tailed macaques',
      longDescription: 'The Sacred Monkey Forest Sanctuary, also known as the Ubud Monkey Forest, is a nature reserve and temple complex in Ubud. It houses approximately 700 grey long-tailed macaques and three Hindu temples dating from the 14th century. The forest covers about 12.5 hectares and contains 115 different species of trees.',
      audioNarration: 'Enter the mystical Sacred Monkey Forest, home to over 700 long-tailed macaques. This sacred sanctuary dates back to the 14th century and features three ancient Hindu temples hidden among towering trees and moss-covered statues. The forest represents the harmonious relationship between humans, animals, and nature in Balinese Hindu philosophy.',
      facts: [
        'Home to approximately 700 monkeys',
        'Contains 3 Hindu temples',
        'Over 115 species of trees',
        'Covers 12.5 hectares',
        'Monkeys are considered sacred guardians'
      ],
      tips: [
        'Don\'t carry food or shiny objects',
        'Don\'t make eye contact with monkeys',
        'Keep hands out of pockets',
        'Entry fee: IDR 80,000',
        'Best time: Early morning (8-10 AM)'
      ],
      category: 'natural'
    }
  ],
  yogyakarta: [
    {
      id: 'borobudur',
      title: 'Borobudur Temple',
      description: 'World\'s largest Buddhist temple - UNESCO World Heritage',
      longDescription: 'Borobudur is a 9th-century Mahayana Buddhist temple in Central Java, Indonesia. It is the world\'s largest Buddhist temple, and one of the greatest Buddhist monuments in the world. The monument consists of six square platforms topped by three circular platforms and is decorated with 2,672 relief panels and originally 504 Buddha statues.',
      audioNarration: 'Welcome to Borobudur, the world\'s largest Buddhist monument. Built in the 9th century during the reign of the Sailendra Dynasty, this magnificent structure consists of nine stacked platforms, six square and three circular, topped by a central dome. The temple is decorated with 2,672 relief panels telling the story of Buddha\'s life.',
      images: [
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600'
      ],
      facts: [
        'Built around 800 AD',
        'Contains 2,672 relief panels',
        'Originally had 504 Buddha statues',
        'UNESCO World Heritage Site since 1991',
        'Largest Buddhist temple in the world',
        'Hidden for centuries under volcanic ash'
      ],
      tips: [
        'Sunrise tour is highly recommended',
        'Wear comfortable shoes',
        'Bring sunscreen and water',
        'Hire a guide for detailed history',
        'Ticket: IDR 375,000 (adults)'
      ],
      links: [
        { label: 'Book Sunrise Tour', url: 'https://www.borobudurpark.com' }
      ],
      category: 'cultural'
    },
    {
      id: 'prambanan',
      title: 'Prambanan Temple',
      description: 'Magnificent 9th-century Hindu temple complex',
      longDescription: 'Prambanan is the largest Hindu temple site in Indonesia and one of the biggest in Southeast Asia. Built in the 9th century, it is characterized by its tall and pointed architecture, typical of Hindu architecture, and by the towering 47-meter-high central building inside a large complex of individual temples.',
      audioNarration: 'You\'re now at Prambanan, Indonesia\'s largest Hindu temple complex. Built in the 9th century and dedicated to the Trimurti: Brahma the creator, Vishnu the preserver, and Shiva the destroyer. The temple compound was designed in a mandala layout representing the cosmic universe in Hindu cosmology.',
      facts: [
        'Built around 850 AD',
        'Dedicated to the Hindu Trimurti',
        '47 meters tall main temple',
        'UNESCO World Heritage Site',
        'Originally had 240 temples',
        'Damaged by 2006 earthquake'
      ],
      tips: [
        'Visit at sunset for the best atmosphere',
        'Watch Ramayana Ballet performance',
        'Combined ticket with Borobudur available',
        'Entry: IDR 375,000',
        'Best time: Late afternoon'
      ],
      category: 'cultural'
    }
  ],
  lombok: [
    {
      id: 'mount-rinjani',
      title: 'Mount Rinjani',
      description: 'Sacred volcano with stunning crater lake',
      longDescription: 'Mount Rinjani is an active volcano on Lombok island. At 3,726 meters tall, it is the second highest volcano in Indonesia. The volcano features a 6 km wide crater containing the stunning crater lake Segara Anak, hot springs, and a new cone called Gunung Barujari formed in 1994.',
      audioNarration: 'Mount Rinjani stands majestically at 3,726 meters, making it Indonesia\'s second-highest volcano. The summit offers spectacular views of the turquoise crater lake Segara Anak, which means "Child of the Sea." This sacred mountain is deeply revered by the local Sasak people and Hindu communities.',
      facts: [
        'Height: 3,726 meters',
        'Second tallest volcano in Indonesia',
        'Crater lake: Segara Anak (2,000m above sea level)',
        'Last eruption: 2016',
        'Sacred to Hindu and Sasak people',
        'Part of Gunung Rinjani National Park'
      ],
      tips: [
        'Trek takes 2-4 days',
        'Best season: April-December',
        'Hire experienced guide mandatory',
        'Physical fitness required',
        'Bring warm clothing for summit'
      ],
      category: 'natural'
    },
    {
      id: 'gili-islands',
      title: 'Gili Islands',
      description: 'Three paradise islands with crystal-clear waters',
      longDescription: 'The Gili Islands are an archipelago of three small islands: Gili Trawangan, Gili Meno, and Gili Air. These islands are famous for their white sandy beaches, crystal-clear waters, and vibrant coral reefs. No motorized vehicles are allowed on the islands, making them peaceful retreats.',
      audioNarration: 'Welcome to the Gili Islands, three tropical paradises off Lombok\'s northwest coast. These car-free islands offer pristine beaches, world-class diving and snorkeling, and a laid-back atmosphere. Each island has its own character: Trawangan for parties, Meno for romance, and Air for a balance of both.',
      facts: [
        'Three islands: Trawangan, Meno, Air',
        'No motorized vehicles allowed',
        'Home to sea turtles',
        'Excellent diving and snorkeling',
        'Accessible by fast boat from Bali'
      ],
      tips: [
        'Rent bicycle or cidomo (horse cart)',
        'Best snorkeling at Turtle Point',
        'Book accommodation in advance (high season)',
        'Try night diving',
        'Watch sunset from west beaches'
      ],
      category: 'natural'
    }
  ],
  jakarta: [
    {
      id: 'monas',
      title: 'National Monument (Monas)',
      description: 'Iconic 132m tower symbolizing Indonesia\'s independence',
      longDescription: 'The National Monument, or Monas, is a 132-meter tower in the center of Merdeka Square, Central Jakarta. It symbolizes the fight for Indonesia\'s independence. The monument is topped with a flame covered with gold foil and the base houses a historical museum and a hall of independence.',
      audioNarration: 'Standing before you is Monas, the National Monument, a symbol of Indonesia\'s independence and pride. Built in 1961 under President Sukarno\'s direction, this 132-meter obelisk is topped with a 14.5-ton bronze flame covered in gold leaf. The monument represents the eternal flame of Indonesian independence.',
      facts: [
        'Height: 132 meters',
        'Flame covered with 35kg gold foil',
        'Built 1961-1975',
        'Foundation depth: 3 meters below sea level',
        'Observation deck at 115 meters',
        'National Museum at base'
      ],
      tips: [
        'Visit observation deck for city views',
        'Museum entrance at base',
        'Best time: Early morning or late afternoon',
        'Entry fee: IDR 10,000',
        'Closed on Mondays'
      ],
      category: 'cultural'
    },
    {
      id: 'kota-tua',
      title: 'Old Town (Kota Tua)',
      description: 'Historic colonial district with Dutch architecture',
      longDescription: 'Kota Tua (Old Town) is the historical heart of Jakarta, featuring colonial-era buildings and museums. The area includes Fatahillah Square, surrounded by Dutch colonial buildings that now house several museums including the Jakarta History Museum and the Wayang Museum.',
      audioNarration: 'Step back in time in Kota Tua, Jakarta\'s Old Town. This historic square was the administrative and commercial center of the Dutch East Indies. The surrounding colonial buildings, dating from the 17th century, have been preserved and now serve as museums, galleries, and cafes.',
      facts: [
        'Founded by Dutch in 1619',
        'Original name: Batavia',
        'Features 17th-19th century architecture',
        'Home to 5 major museums',
        'Popular for vintage photoshoots',
        'Weekend cultural performances'
      ],
      tips: [
        'Rent vintage bicycles',
        'Try traditional snacks from vendors',
        'Visit museums (closed Mondays)',
        'Best for photos: Morning light',
        'Weekend has street performances'
      ],
      category: 'cultural'
    }
  ]
};

/**
 * Get location by ID
 */
export function getLocationById(locationId: string): TourismLocation | null {
  return INDONESIA_LOCATIONS.find(loc => loc.id === locationId) || null;
}

/**
 * Get hotspots for a specific location
 */
export function getHotspotsForLocation(locationId: string): LocationHotspot[] {
  return LOCATION_HOTSPOTS[locationId] || [];
}

/**
 * Get all locations
 */
export function getAllLocations(): TourismLocation[] {
  return INDONESIA_LOCATIONS;
}
