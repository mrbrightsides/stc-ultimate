/**
 * STC Ultimate - Weather & Atmosphere System
 * Dynamic weather effects for immersive experience
 */

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'fog' | 'sunset' | 'sunrise';

export interface WeatherSettings {
  type: WeatherType;
  intensity: number; // 0-1
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface WeatherPreset {
  id: string;
  name: string;
  description: string;
  settings: WeatherSettings;
  skyColor: string;
  ambientLightIntensity: number;
  fogDensity: number;
}

/**
 * Weather presets for different atmospheric conditions
 */
export const WEATHER_PRESETS: WeatherPreset[] = [
  {
    id: 'clear-day',
    name: 'Clear Day',
    description: 'Bright sunny day with blue skies',
    settings: {
      type: 'clear',
      intensity: 1.0,
      timeOfDay: 'afternoon'
    },
    skyColor: '#87CEEB',
    ambientLightIntensity: 1.2,
    fogDensity: 0.0
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm sunset lighting',
    settings: {
      type: 'sunset',
      intensity: 0.8,
      timeOfDay: 'evening'
    },
    skyColor: '#FF6B35',
    ambientLightIntensity: 0.9,
    fogDensity: 0.01
  },
  {
    id: 'blue-hour',
    name: 'Blue Hour',
    description: 'Twilight with deep blue tones',
    settings: {
      type: 'evening',
      intensity: 0.6,
      timeOfDay: 'evening'
    },
    skyColor: '#1E3A8A',
    ambientLightIntensity: 0.6,
    fogDensity: 0.02
  },
  {
    id: 'misty-morning',
    name: 'Misty Morning',
    description: 'Soft morning light with fog',
    settings: {
      type: 'fog',
      intensity: 0.7,
      timeOfDay: 'morning'
    },
    skyColor: '#B8C5D6',
    ambientLightIntensity: 0.7,
    fogDensity: 0.05
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    description: 'Overcast with diffused light',
    settings: {
      type: 'cloudy',
      intensity: 0.6,
      timeOfDay: 'afternoon'
    },
    skyColor: '#9CA3AF',
    ambientLightIntensity: 0.8,
    fogDensity: 0.01
  },
  {
    id: 'rainy',
    name: 'Rainy',
    description: 'Rain with dramatic atmosphere',
    settings: {
      type: 'rain',
      intensity: 0.8,
      timeOfDay: 'afternoon'
    },
    skyColor: '#4B5563',
    ambientLightIntensity: 0.5,
    fogDensity: 0.03
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    description: 'Clear night with stars',
    settings: {
      type: 'clear',
      intensity: 0.3,
      timeOfDay: 'night'
    },
    skyColor: '#0F172A',
    ambientLightIntensity: 0.3,
    fogDensity: 0.0
  }
];

/**
 * Location-specific weather suggestions
 */
export const LOCATION_WEATHER_MAP: Record<string, string[]> = {
  bali: ['clear-day', 'golden-hour', 'rainy'],
  yogyakarta: ['clear-day', 'misty-morning', 'cloudy'],
  lombok: ['clear-day', 'golden-hour', 'blue-hour'],
  jakarta: ['cloudy', 'rainy', 'clear-day']
};

/**
 * Get weather preset by ID
 */
export function getWeatherPreset(presetId: string): WeatherPreset | null {
  return WEATHER_PRESETS.find(p => p.id === presetId) || null;
}

/**
 * Get suggested weather presets for location
 */
export function getSuggestedWeatherForLocation(locationId: string): WeatherPreset[] {
  const presetIds = LOCATION_WEATHER_MAP[locationId] || ['clear-day'];
  return presetIds
    .map(id => getWeatherPreset(id))
    .filter((p): p is WeatherPreset => p !== null);
}

/**
 * Get default weather for location
 */
export function getDefaultWeatherForLocation(locationId: string): WeatherPreset {
  const suggested = getSuggestedWeatherForLocation(locationId);
  return suggested[0] || WEATHER_PRESETS[0];
}

/**
 * Calculate time-of-day lighting based on hour (0-23)
 */
export function calculateTimeOfDayLighting(hour: number): {
  skyColor: string;
  ambientIntensity: number;
  fogDensity: number;
} {
  // Sunrise: 5-7
  if (hour >= 5 && hour < 7) {
    return {
      skyColor: '#FFA07A',
      ambientIntensity: 0.7,
      fogDensity: 0.02
    };
  }
  // Morning: 7-12
  if (hour >= 7 && hour < 12) {
    return {
      skyColor: '#87CEEB',
      ambientIntensity: 1.0,
      fogDensity: 0.0
    };
  }
  // Afternoon: 12-17
  if (hour >= 12 && hour < 17) {
    return {
      skyColor: '#4A90E2',
      ambientIntensity: 1.1,
      fogDensity: 0.0
    };
  }
  // Sunset: 17-19
  if (hour >= 17 && hour < 19) {
    return {
      skyColor: '#FF6B35',
      ambientIntensity: 0.8,
      fogDensity: 0.01
    };
  }
  // Night: 19-5
  return {
    skyColor: '#0F172A',
    ambientIntensity: 0.3,
    fogDensity: 0.0
  };
}
