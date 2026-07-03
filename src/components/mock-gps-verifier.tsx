'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Loader2,
  CheckCircle,
  Locate,
  Navigation,
} from 'lucide-react';

export interface MockGPSVerifierProps {
  milestoneName: string;
  destinationName: string;
  onVerificationComplete?: () => void;
  onVerificationFailed?: (error: string) => void;
  className?: string;
  compact?: boolean;
}

const MockGPSVerifier: React.FC<MockGPSVerifierProps> = ({
  milestoneName,
  destinationName,
  onVerificationComplete,
  onVerificationFailed,
  className = '',
  compact = true,
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<{
    distance: number;
    accuracy: number;
    coordinates: string;
  } | null>(null);

  const handleVerifyLocation = async (): Promise<void> => {
    setIsVerifying(true);
    setIsVerified(false);
    setVerificationData(null);

    try {
      // Simulate GPS capture (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock GPS data
      const mockDistance = Math.floor(Math.random() * 50) + 15; // 15-65 meters
      const mockAccuracy = Math.floor(Math.random() * 20) + 10; // 10-30 meters
      const mockLat = (-8.0 + Math.random() * 0.5).toFixed(6);
      const mockLng = (110.0 + Math.random() * 6.0).toFixed(6);

      setVerificationData({
        distance: mockDistance,
        accuracy: mockAccuracy,
        coordinates: `${mockLat}, ${mockLng}`,
      });

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsVerified(true);

      // Call success callback
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (err) {
      const errorMessage = 'Gagal memverifikasi lokasi GPS';
      if (onVerificationFailed) {
        onVerificationFailed(errorMessage);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Compact button-only mode
  if (compact && !isVerifying && !isVerified) {
    return (
      <Button
        onClick={handleVerifyLocation}
        disabled={isVerifying}
        size="sm"
        className={`bg-cyan-600 hover:bg-cyan-700 text-white ${className}`}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Verify Location
      </Button>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Verification Status */}
      {isVerifying && (
        <Alert className="border-cyan-500/50 bg-cyan-500/10">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            <AlertDescription className="text-cyan-300">
              <div className="font-semibold">Memverifikasi lokasi GPS...</div>
              <div className="text-sm text-gray-400 mt-1">
                Memeriksa jarak ke {destinationName}
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {isVerified && verificationData && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <AlertDescription className="flex-1">
              <div className="font-semibold text-green-300">
                ✓ Lokasi Terverifikasi!
              </div>
              <div className="text-sm text-gray-400 mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3 w-3" />
                  <span>Jarak: <span className="text-green-400 font-semibold">{verificationData.distance}m</span> dari lokasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Locate className="h-3 w-3" />
                  <span>Akurasi GPS: <span className="text-green-400 font-semibold">{verificationData.accuracy}m</span></span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  📍 {verificationData.coordinates}
                </div>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Action Button */}
      {!isVerified && (
        <Button
          onClick={handleVerifyLocation}
          disabled={isVerifying}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Verify Location
            </>
          )}
        </Button>
      )}

      {isVerified && (
        <Button
          onClick={handleVerifyLocation}
          variant="outline"
          className="w-full border-gray-600 hover:bg-gray-800"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Verifikasi Ulang
        </Button>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 text-center">
        🔒 Simulasi GPS - Lokasi akan diverifikasi untuk milestone: {milestoneName}
      </div>
    </div>
  );
};

export default MockGPSVerifier;
