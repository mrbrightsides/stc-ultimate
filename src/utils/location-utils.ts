/**
 * Location Utilities - GPS & Geofencing Functions
 * 
 * Provides GPS verification, distance calculation, and anti-spoofing measures
 * for location-based payment triggers in STC Ultimate.
 */

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // meters
  altitude?: number; // meters
  timestamp?: number;
}

export interface GeofenceConfig {
  center: GPSCoordinates;
  radius: number; // meters
  minAccuracy?: number; // minimum required GPS accuracy
}

export interface LocationVerificationResult {
  isValid: boolean;
  distance: number; // meters from destination
  accuracy: number;
  withinGeofence: boolean;
  message: string;
  suspiciousActivity?: string[];
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  point1: GPSCoordinates,
  point2: GPSCoordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if a point is within a geofence
 */
export function isWithinGeofence(
  userLocation: GPSCoordinates,
  geofence: GeofenceConfig
): boolean {
  const distance = calculateDistance(userLocation, geofence.center);
  return distance <= geofence.radius;
}

/**
 * Verify GPS location with anti-spoofing checks
 */
export function verifyLocation(
  userLocation: GPSCoordinates,
  destinationLocation: GPSCoordinates,
  radiusMeters: number = 100,
  minAccuracy: number = 50
): LocationVerificationResult {
  const suspiciousActivity: string[] = [];
  
  // Check 1: GPS Accuracy
  const accuracy = userLocation.accuracy || 999;
  if (accuracy > minAccuracy) {
    return {
      isValid: false,
      distance: 0,
      accuracy,
      withinGeofence: false,
      message: `GPS signal terlalu lemah (akurasi: ${Math.round(accuracy)}m). Silakan coba di tempat terbuka.`,
      suspiciousActivity: ['poor_gps_signal']
    };
  }

  // Check 2: Calculate distance
  const distance = calculateDistance(userLocation, destinationLocation);

  // Check 3: Geofence validation
  const withinGeofence = distance <= radiusMeters;

  if (!withinGeofence) {
    return {
      isValid: false,
      distance: Math.round(distance),
      accuracy,
      withinGeofence: false,
      message: `Anda berada ${Math.round(distance)}m dari lokasi (diperlukan ≤${radiusMeters}m). Mohon mendekati lokasi check-in.`,
      suspiciousActivity: []
    };
  }

  // Success
  return {
    isValid: true,
    distance: Math.round(distance),
    accuracy,
    withinGeofence: true,
    message: `✅ Lokasi terverifikasi! Anda berada ${Math.round(distance)}m dari lokasi.`,
    suspiciousActivity: []
  };
}

/**
 * Detect unrealistic movement (anti-teleportation)
 */
export function detectSuspiciousMovement(
  previousLocation: GPSCoordinates & { timestamp: number },
  currentLocation: GPSCoordinates & { timestamp: number }
): { suspicious: boolean; reason?: string; speedKmh?: number } {
  const distance = calculateDistance(previousLocation, currentLocation);
  const timeDiffSeconds = (currentLocation.timestamp - previousLocation.timestamp) / 1000;

  if (timeDiffSeconds <= 0) {
    return { suspicious: false };
  }

  const speedMs = distance / timeDiffSeconds; // meters per second
  const speedKmh = speedMs * 3.6; // convert to km/h

  // Max realistic speed for tourist: 100 km/h (considering fast car/train)
  const MAX_TOURIST_SPEED_KMH = 100;

  if (speedKmh > MAX_TOURIST_SPEED_KMH) {
    return {
      suspicious: true,
      reason: `Kecepatan tidak realistis: ${Math.round(speedKmh)} km/jam`,
      speedKmh: Math.round(speedKmh)
    };
  }

  return { suspicious: false, speedKmh: Math.round(speedKmh) };
}

/**
 * Format GPS coordinates for display
 */
export function formatCoordinates(coords: GPSCoordinates): string {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(
  options?: PositionOptions
): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh browser Anda'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let message = 'Gagal mendapatkan lokasi GPS';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Izin akses lokasi ditolak. Mohon izinkan akses lokasi.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Lokasi GPS tidak tersedia. Pastikan GPS aktif.';
            break;
          case error.TIMEOUT:
            message = 'Timeout mendapatkan lokasi. Silakan coba lagi.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );
  });
}

/**
 * Watch user's location continuously
 */
export function watchLocation(
  callback: (location: GPSCoordinates) => void,
  errorCallback?: (error: Error) => void,
  options?: PositionOptions
): number {
  if (!navigator.geolocation) {
    if (errorCallback) {
      errorCallback(new Error('Geolocation tidak didukung'));
    }
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      if (errorCallback) {
        errorCallback(new Error(error.message));
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
      ...options,
    }
  );
}

/**
 * Clear location watch
 */
export function clearLocationWatch(watchId: number): void {
  if (navigator.geolocation && watchId >= 0) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Create a cryptographic hash of GPS data for blockchain proof
 */
export async function hashGPSData(
  location: GPSCoordinates,
  additionalData?: Record<string, any>
): Promise<string> {
  const data = JSON.stringify({
    lat: location.latitude.toFixed(6),
    lng: location.longitude.toFixed(6),
    accuracy: location.accuracy,
    timestamp: location.timestamp || Date.now(),
    ...additionalData,
  });

  // Use Web Crypto API for hashing
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Grid-based privacy protection: round coordinates to nearest grid cell
 * This prevents exact location tracking while still verifying proximity
 */
export function applyPrivacyGrid(
  coords: GPSCoordinates,
  gridSizeMeters: number = 50
): GPSCoordinates {
  // Approximate: 1 degree latitude ≈ 111km
  // 1 degree longitude varies by latitude, but we use 111km as approximation
  const gridSizeDegrees = gridSizeMeters / 111000;

  return {
    latitude: Math.round(coords.latitude / gridSizeDegrees) * gridSizeDegrees,
    longitude: Math.round(coords.longitude / gridSizeDegrees) * gridSizeDegrees,
    accuracy: coords.accuracy,
    timestamp: coords.timestamp,
  };
}
