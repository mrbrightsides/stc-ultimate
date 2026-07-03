import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GPS Location Verification
 * 
 * Validates user GPS coordinates against destination coordinates
 * with anti-spoofing checks and security measures.
 */

interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface VerificationRequest {
  userLocation: GPSCoordinates;
  destinationLocation: GPSCoordinates;
  radiusMeters?: number;
  bookingId?: string;
  milestoneId?: string;
  qrCode?: string; // Multi-factor: GPS + QR
}

interface VerificationResponse {
  success: boolean;
  verified: boolean;
  distance: number;
  withinGeofence: boolean;
  message: string;
  timestamp: number;
  verificationHash?: string;
  suspiciousActivity?: string[];
  data?: {
    userLocation: GPSCoordinates;
    destinationLocation: GPSCoordinates;
    radiusMeters: number;
    accuracy: number;
  };
}

/**
 * Calculate distance using Haversine formula (server-side validation)
 */
function calculateDistance(
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

  return R * c;
}

/**
 * Validate GPS coordinates
 */
function isValidCoordinates(coords: GPSCoordinates): boolean {
  return (
    typeof coords.latitude === 'number' &&
    typeof coords.longitude === 'number' &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
}

/**
 * Create verification hash for blockchain proof
 */
async function createVerificationHash(data: Record<string, any>): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * POST /api/verify-location
 * Verify user GPS location against destination
 */
export async function POST(request: NextRequest): Promise<NextResponse<VerificationResponse>> {
  try {
    const body: VerificationRequest = await request.json();
    const {
      userLocation,
      destinationLocation,
      radiusMeters = 100,
      bookingId,
      milestoneId,
      qrCode,
    } = body;

    // Validate request data
    if (!userLocation || !destinationLocation) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          distance: 0,
          withinGeofence: false,
          message: 'Missing required location data',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (!isValidCoordinates(userLocation) || !isValidCoordinates(destinationLocation)) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          distance: 0,
          withinGeofence: false,
          message: 'Invalid GPS coordinates',
          timestamp: Date.now(),
          suspiciousActivity: ['invalid_coordinates'],
        },
        { status: 400 }
      );
    }

    const suspiciousActivity: string[] = [];

    // Check 1: GPS Accuracy
    const accuracy = userLocation.accuracy || 999;
    const MIN_ACCURACY = 50; // meters

    if (accuracy > MIN_ACCURACY) {
      return NextResponse.json({
        success: true,
        verified: false,
        distance: 0,
        withinGeofence: false,
        message: `GPS signal too weak (accuracy: ${Math.round(accuracy)}m). Minimum required: ${MIN_ACCURACY}m`,
        timestamp: Date.now(),
        suspiciousActivity: ['poor_gps_signal'],
        data: {
          userLocation,
          destinationLocation,
          radiusMeters,
          accuracy,
        },
      });
    }

    // Check 2: Calculate distance
    const distance = calculateDistance(userLocation, destinationLocation);

    // Check 3: Geofence validation
    const withinGeofence = distance <= radiusMeters;

    // Check 4: Timestamp validation (prevent replay attacks)
    if (userLocation.timestamp) {
      const timeDiff = Date.now() - userLocation.timestamp;
      const MAX_TIME_DIFF = 60000; // 1 minute

      if (timeDiff > MAX_TIME_DIFF || timeDiff < 0) {
        suspiciousActivity.push('suspicious_timestamp');
      }
    }

    // Check 5: Impossible accuracy (GPS spoofing indicator)
    if (accuracy < 5 && accuracy > 0) {
      // Real GPS rarely has perfect accuracy under 5m in real-world conditions
      suspiciousActivity.push('suspiciously_accurate');
    }

    // Create verification hash
    const verificationHash = await createVerificationHash({
      userLat: userLocation.latitude.toFixed(6),
      userLng: userLocation.longitude.toFixed(6),
      destLat: destinationLocation.latitude.toFixed(6),
      destLng: destinationLocation.longitude.toFixed(6),
      distance: Math.round(distance),
      timestamp: Date.now(),
      bookingId,
      milestoneId,
      qrCode: qrCode ? 'present' : 'absent',
    });

    // Verification result
    if (!withinGeofence) {
      return NextResponse.json({
        success: true,
        verified: false,
        distance: Math.round(distance),
        withinGeofence: false,
        message: `Location too far (${Math.round(distance)}m from destination). Required: ≤${radiusMeters}m`,
        timestamp: Date.now(),
        verificationHash,
        suspiciousActivity,
        data: {
          userLocation,
          destinationLocation,
          radiusMeters,
          accuracy,
        },
      });
    }

    // Success - Location verified
    return NextResponse.json({
      success: true,
      verified: true,
      distance: Math.round(distance),
      withinGeofence: true,
      message: `✅ Location verified! You are ${Math.round(distance)}m from destination.`,
      timestamp: Date.now(),
      verificationHash,
      suspiciousActivity: suspiciousActivity.length > 0 ? suspiciousActivity : undefined,
      data: {
        userLocation,
        destinationLocation,
        radiusMeters,
        accuracy,
      },
    });

  } catch (error) {
    console.error('Location verification error:', error);

    return NextResponse.json(
      {
        success: false,
        verified: false,
        distance: 0,
        withinGeofence: false,
        message: 'Internal server error during verification',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verify-location
 * Get API info
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'STC Ultimate - GPS Location Verification API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/verify-location',
    },
    description: 'Verifies user GPS location against destination coordinates with anti-spoofing measures',
    requiredFields: {
      userLocation: 'GPS coordinates of user',
      destinationLocation: 'GPS coordinates of destination',
      radiusMeters: 'Geofence radius (optional, default: 100m)',
    },
  });
}
