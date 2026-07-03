'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Locate,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Navigation,
  Crosshair,
  Shield,
} from 'lucide-react';
import type { GPSCoordinates, LocationVerificationResult } from '@/utils/location-utils';
import {
  getCurrentLocation,
  verifyLocation,
  formatCoordinates,
  calculateDistance,
} from '@/utils/location-utils';

export interface GPSVerifierProps {
  destinationName: string;
  destinationCoordinates: GPSCoordinates;
  radiusMeters?: number;
  minAccuracy?: number;
  onVerificationComplete?: (result: LocationVerificationResult & { userLocation: GPSCoordinates }) => void;
  onVerificationFailed?: (error: string) => void;
  autoVerify?: boolean;
  showMap?: boolean;
}

const GPSVerifier: React.FC<GPSVerifierProps> = ({
  destinationName,
  destinationCoordinates,
  radiusMeters = 100,
  minAccuracy = 50,
  onVerificationComplete,
  onVerificationFailed,
  autoVerify = false,
  showMap = true,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<GPSCoordinates | null>(null);
  const [verificationResult, setVerificationResult] = useState<LocationVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Check geolocation permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Auto-verify if enabled
  useEffect(() => {
    if (autoVerify && permissionState === 'granted') {
      handleVerifyLocation();
    }
  }, [autoVerify, permissionState]);

  const checkPermission = async (): Promise<void> => {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        
        result.addEventListener('change', () => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        });
      }
    } catch (err) {
      console.log('Permission API not supported');
    }
  };

  const handleVerifyLocation = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Get user's current GPS location
      const location = await getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      setUserLocation(location);

      // Verify location against destination
      const result = verifyLocation(
        location,
        destinationCoordinates,
        radiusMeters,
        minAccuracy
      );

      setVerificationResult(result);

      if (result.isValid) {
        // Success callback
        if (onVerificationComplete) {
          onVerificationComplete({
            ...result,
            userLocation: location,
          });
        }
      } else {
        // Failed callback
        if (onVerificationFailed) {
          onVerificationFailed(result.message);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendapatkan lokasi GPS';
      setError(errorMessage);
      
      if (onVerificationFailed) {
        onVerificationFailed(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (): React.ReactNode => {
    if (isLoading) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-400" />;
    }
    if (verificationResult?.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
    if (verificationResult && !verificationResult.isValid) {
      return <AlertTriangle className="h-5 w-5 text-orange-400" />;
    }
    if (error) {
      return <AlertTriangle className="h-5 w-5 text-red-400" />;
    }
    return <MapPin className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (): string => {
    if (verificationResult?.isValid) return 'border-green-500/50 bg-green-500/10';
    if (verificationResult && !verificationResult.isValid) return 'border-orange-500/50 bg-orange-500/10';
    if (error) return 'border-red-500/50 bg-red-500/10';
    return 'border-gray-700';
  };

  return (
    <Card className={`bg-black/40 ${getStatusColor()} transition-colors`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-neon-blue">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Verifikasi Lokasi GPS</span>
          </div>
          <Badge variant={permissionState === 'granted' ? 'default' : 'secondary'}>
            {permissionState === 'granted' ? '✓ GPS Ready' : 'GPS Permission'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Destination Info */}
        <div className="p-3 rounded-lg bg-black/40 border border-gray-700">
          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-neon-green mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">{destinationName}</div>
              <div className="text-sm text-gray-400">
                Radius verifikasi: <span className="text-neon-green">{radiusMeters}m</span>
              </div>
              {showMap && (
                <div className="text-xs text-gray-500 mt-1">
                  📍 {formatCoordinates(destinationCoordinates)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Location Info */}
        {userLocation && (
          <div className="p-3 rounded-lg bg-black/40 border border-gray-700">
            <div className="flex items-start gap-3">
              <Crosshair className="h-5 w-5 text-blue-400 mt-1" />
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Lokasi Anda</div>
                <div className="text-sm text-gray-400">
                  Akurasi GPS: <span className={`${(userLocation.accuracy || 0) < 30 ? 'text-green-400' : 'text-orange-400'}`}>
                    {Math.round(userLocation.accuracy || 0)}m
                  </span>
                </div>
                {showMap && (
                  <div className="text-xs text-gray-500 mt-1">
                    📍 {formatCoordinates(userLocation)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <Alert className={verificationResult.isValid ? 'border-green-500/50 bg-green-500/10' : 'border-orange-500/50 bg-orange-500/10'}>
            <div className="flex items-start gap-3">
              {verificationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
              )}
              <AlertDescription className="flex-1">
                <div className={verificationResult.isValid ? 'text-green-300' : 'text-orange-300'}>
                  {verificationResult.message}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Jarak dari lokasi: <span className="text-white font-semibold">{verificationResult.distance}m</span>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Permission Warning */}
        {permissionState === 'denied' && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-400 mt-0.5" />
              <AlertDescription className="text-red-300">
                Akses lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser Anda untuk melanjutkan verifikasi.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Verification Stats Grid */}
        {verificationResult && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-black/40 border border-gray-700">
              <div className="text-lg font-bold text-neon-green">
                {verificationResult.distance}m
              </div>
              <div className="text-xs text-gray-400">Jarak</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-black/40 border border-gray-700">
              <div className="text-lg font-bold text-neon-blue">
                {Math.round(verificationResult.accuracy)}m
              </div>
              <div className="text-xs text-gray-400">Akurasi</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-black/40 border border-gray-700">
              <div className={`text-lg font-bold ${verificationResult.withinGeofence ? 'text-green-400' : 'text-orange-400'}`}>
                {verificationResult.withinGeofence ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-400">Status</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleVerifyLocation}
            disabled={isLoading || permissionState === 'denied'}
            className="flex-1 bg-neon-green hover:bg-neon-green/80 text-black font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <Locate className="mr-2 h-4 w-4" />
                {verificationResult ? 'Verifikasi Ulang' : 'Verifikasi Lokasi'}
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 text-center">
          <Shield className="inline h-3 w-3 mr-1" />
          Lokasi Anda dienkripsi dan hanya digunakan untuk verifikasi pembayaran milestone
        </div>
      </CardContent>
    </Card>
  );
};

export default GPSVerifier;
