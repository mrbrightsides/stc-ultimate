'use client';

import { useState, useRef, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Camera, X, Check, AlertCircle, Scan } from 'lucide-react';

interface QRScannerProps {
  expectedQRData: string;
  milestoneName: string;
  onScanSuccess: () => void;
  onCancel: () => void;
}

export function QRScanner({
  expectedQRData,
  milestoneName,
  onScanSuccess,
  onCancel
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate QR code detection after 3 seconds (in real implementation, use a QR library like jsQR)
      setTimeout(() => {
        simulateQRDetection();
      }, 3000);

    } catch (err) {
      console.error('Camera access error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setHasPermission(false);
  };

  const simulateQRDetection = () => {
    // In real implementation, this would use jsQR or similar library to detect QR codes
    // For now, we'll simulate successful detection
    const detectedData = expectedQRData; // Simulate successful scan

    if (detectedData === expectedQRData) {
      setScanResult('success');
      setTimeout(() => {
        stopCamera();
        onScanSuccess();
      }, 1500);
    } else {
      setScanResult('failed');
      setTimeout(() => {
        setScanResult(null);
        // Continue scanning
      }, 2000);
    }
  };

  const handleManualVerification = () => {
    // Allow manual verification for demo purposes
    setScanResult('success');
    setTimeout(() => {
      stopCamera();
      onScanSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <NeonCard glowColor="cyan" intense className="max-w-2xl w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Scan className="h-6 w-6 text-cyan-400" />
                Scan QR Code
              </h3>
              <p className="text-gray-400 text-sm mt-1">{milestoneName}</p>
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => {
                stopCamera();
                onCancel();
              }}
            >
              <X className="h-4 w-4" />
            </NeonButton>
          </div>

          {/* Camera View */}
          {!hasPermission ? (
            <div className="space-y-6">
              <div className="text-center p-12 rounded-lg bg-black/30 border border-cyan-500/30">
                <Camera className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">
                  Akses Kamera Diperlukan
                </h4>
                <p className="text-gray-400 mb-6">
                  Untuk memverifikasi milestone ini, kami perlu mengakses kamera perangkat Anda 
                  untuk memindai QR code.
                </p>
                <NeonButton onClick={startCamera} size="lg">
                  <Camera className="h-5 w-5 mr-2" />
                  Aktifkan Kamera
                </NeonButton>
              </div>

              {/* Manual Verification for Demo */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Untuk keperluan demo:</p>
                <NeonButton
                  variant="outline"
                  onClick={handleManualVerification}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Verifikasi Manual (Demo Mode)
                </NeonButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Stream */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border-2 border-cyan-500/50">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                    {/* Scanning Line */}
                    {isScanning && !scanResult && (
                      <div className="absolute inset-x-0 h-1 bg-cyan-400 animate-pulse" 
                           style={{ animation: 'scan 2s ease-in-out infinite' }} 
                      />
                    )}
                  </div>
                </div>

                {/* Scan Result */}
                {scanResult === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-10 w-10 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-green-400">QR Code Terdeteksi!</p>
                      <p className="text-green-300 text-sm mt-2">Memproses verifikasi...</p>
                    </div>
                  </div>
                )}

                {scanResult === 'failed' && (
                  <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-red-500/30 flex items-center justify-center mx-auto mb-4">
                        <X className="h-10 w-10 text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-red-400">QR Code Tidak Valid</p>
                      <p className="text-red-300 text-sm mt-2">Coba scan lagi...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-cyan-300 text-sm text-center">
                  📱 Arahkan kamera ke QR code untuk memverifikasi milestone
                </p>
              </div>

              {/* Manual Override for Demo */}
              {isScanning && !scanResult && (
                <div className="text-center">
                  <NeonButton
                    variant="outline"
                    onClick={handleManualVerification}
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Verifikasi Manual (Demo)
                  </NeonButton>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-medium">Error</p>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      </NeonCard>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
