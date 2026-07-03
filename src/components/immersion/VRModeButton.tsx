'use client';

/**
 * STC Ultimate - VR Mode Support
 * WebXR integration for VR headsets
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Glasses, AlertTriangle } from 'lucide-react';

interface VRModeButtonProps {
  onEnterVR: () => void;
  onExitVR: () => void;
}

export function VRModeButton({ onEnterVR, onExitVR }: VRModeButtonProps): JSX.Element {
  const [isVRSupported, setIsVRSupported] = useState<boolean>(false);
  const [isVRActive, setIsVRActive] = useState<boolean>(false);
  const [vrError, setVrError] = useState<string | null>(null);

  useEffect(() => {
    // Check for WebXR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setIsVRSupported(supported);
      }).catch(() => {
        setIsVRSupported(false);
      });
    } else {
      setIsVRSupported(false);
    }
  }, []);

  const handleVRToggle = async (): Promise<void> => {
    if (isVRActive) {
      setIsVRActive(false);
      onExitVR();
      return;
    }

    try {
      if (!isVRSupported) {
        setVrError('VR is not supported on this device');
        return;
      }

      // Request VR session
      const xr = (navigator as any).xr;
      const session = await xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
      });

      session.addEventListener('end', () => {
        setIsVRActive(false);
        onExitVR();
      });

      setIsVRActive(true);
      onEnterVR();
    } catch (error) {
      console.error('VR Error:', error);
      setVrError('Failed to start VR session');
      setTimeout(() => setVrError(null), 3000);
    }
  };

  if (!isVRSupported && !vrError) {
    return (
      <Badge className="bg-gray-800 text-gray-400 border-gray-700">
        <AlertTriangle className="h-3 w-3 mr-1" />
        VR Not Supported
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleVRToggle}
        className={`${
          isVRActive
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        <Glasses className="h-4 w-4 mr-2" />
        {isVRActive ? 'Exit VR Mode' : 'Enter VR Mode'}
      </Button>

      {vrError && (
        <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {vrError}
        </Badge>
      )}
    </div>
  );
}

/**
 * VR Instructions Overlay
 */
export function VRInstructions(): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <Glasses className="h-6 w-6 text-purple-400" />
          <h3 className="text-white text-lg font-semibold">VR Mode Active</h3>
        </div>

        <div className="space-y-3 text-gray-300 text-sm">
          <p>🎯 <strong>Look around:</strong> Move your head to explore 360°</p>
          <p>👆 <strong>Select hotspots:</strong> Gaze at colored spheres to interact</p>
          <p>🎮 <strong>Navigation:</strong> Use your VR controller buttons</p>
          <p>🚪 <strong>Exit:</strong> Press menu button on your controller</p>
        </div>

        <div className="mt-4 p-3 bg-purple-500/20 rounded border border-purple-500/50">
          <p className="text-xs text-purple-200">
            For the best experience, ensure you have a stable connection and sufficient space.
          </p>
        </div>
      </div>
    </div>
  );
}
