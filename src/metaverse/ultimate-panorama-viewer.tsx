'use client';

/**
 * STC Ultimate - ULTIMATE IMMERSIVE PANORAMA VIEWER
 * All immersion features integrated: Weather, Ambient Sound, Particles, Photo Mode, Achievements, VR, i18n
 */

import { Suspense, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, Info, Camera, Sparkles, Trophy, Globe } from 'lucide-react';
import * as THREE from 'three';
import { getPanoramasForDestination } from '@/lib/panorama-config';
import type { PanoramaImage } from '@/lib/panorama-config';
import { getLocationById } from '@/lib/tourism-data';
import { getSoundscapeForLocation } from '@/lib/ambient-sounds';
import { useAmbientSound } from '@/hooks/use-ambient-sound';
import { getDefaultWeatherForLocation, type WeatherPreset } from '@/lib/weather-system';
import { ParticleSystem } from '@/components/immersion/ParticleEffects';
import { PhotoMode } from '@/components/immersion/PhotoMode';
import { WeatherControls } from '@/components/immersion/WeatherControls';
import { AudioControls, CompactAudioControls } from '@/components/immersion/AudioControls';
import { AchievementNotification } from '@/components/immersion/AchievementNotification';
import { VRModeButton } from '@/components/immersion/VRModeButton';
import { ALL_ACHIEVEMENTS, type Achievement } from '@/lib/achievement-system';
import { translate, type Language } from '@/lib/i18n-translations';

interface UltimatePanoramaViewerProps {
  destination: string;
}

// Enhanced Panorama Sphere with Weather Effects
function EnhancedPanoramaSphere({ 
  panorama, 
  weather 
}: { 
  panorama: PanoramaImage; 
  weather: WeatherPreset;
}): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isContextLost, setIsContextLost] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const { gl } = useThree();

  // Handle WebGL context loss
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      setIsContextLost(true);
    };

    const handleContextRestored = (): void => {
      setIsContextLost(false);
      window.location.reload();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  // Load texture
  useEffect(() => {
    setIsMounted(true);
    const loader = new THREE.TextureLoader();
    
    loader.load(
      panorama.imagePath,
      (loadedTexture: THREE.Texture) => {
        if (!isMounted) return;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        if (isMounted) {
          setTexture(null);
        }
      }
    );

    return () => {
      setIsMounted(false);
      if (texture) {
        texture.dispose();
      }
    };
  }, [panorama.imagePath]);

  useFrame(() => {
    if (meshRef.current && !isContextLost) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  if (isContextLost) {
    return (
      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshBasicMaterial color="#1a1a1a" side={THREE.BackSide} />
      </mesh>
    );
  }

  return (
    <>
      <mesh ref={meshRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[50, 48, 32]} />
        {texture ? (
          <meshBasicMaterial 
            map={texture} 
            side={THREE.BackSide}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial color={panorama.fallbackColor} side={THREE.BackSide} />
        )}
      </mesh>
      
      {/* Weather-based lighting */}
      <ambientLight intensity={weather.ambientLightIntensity} color={weather.skyColor} />
      
      {/* Fog effect */}
      {weather.fogDensity > 0 && (
        <fog attach="fog" args={[weather.skyColor, 10, 50 * (1 + weather.fogDensity * 2)]} />
      )}
    </>
  );
}

// Enhanced Hotspots with HTML Labels
function EnhancedHotspots({ 
  panorama, 
  onHotspotClick 
}: { 
  panorama: PanoramaImage; 
  onHotspotClick: (idx: number) => void;
}): JSX.Element {
  return (
    <>
      {panorama.hotspots.map((spot, i) => (
        <group 
          key={i} 
          position={spot.position as [number, number, number]}
          onClick={(e) => {
            e.stopPropagation();
            onHotspotClick(i);
          }}
        >
          {/* Pulsing sphere */}
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.8}
            />
          </mesh>
          
          {/* Outer ring */}
          <mesh position={[0, 0, 0.5]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Label background */}
          <mesh position={[0, 1, 0]}>
            <planeGeometry args={[2, 0.6]} />
            <meshBasicMaterial 
              color="#000000"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Main 3D Scene
function PanoramaScene({ 
  panorama,
  weather,
  locationId,
  particlesEnabled,
  onHotspotClick 
}: { 
  panorama: PanoramaImage;
  weather: WeatherPreset;
  locationId: string;
  particlesEnabled: boolean;
  onHotspotClick: (idx: number) => void;
}): JSX.Element {
  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 0.1]} 
        fov={75}
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={-0.5}
        minDistance={0.1}
        maxDistance={10}
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      <EnhancedPanoramaSphere panorama={panorama} weather={weather} />
      <EnhancedHotspots panorama={panorama} onHotspotClick={onHotspotClick} />
      <ParticleSystem 
        weather={weather.settings.type}
        locationId={locationId}
        enabled={particlesEnabled}
      />
    </>
  );
}

// Loading Screen with Progress
function LoadingScreen({ progress }: { progress: number }): JSX.Element {
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(true);

  useEffect(() => {
    if (progress === 100) {
      setIsLoadingComplete(true);
      setTimeout(() => {
        setShowLoading(false);
      }, 500);
    }
  }, [progress]);

  if (!showLoading) return <></>;

  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-black transition-opacity duration-500 ${
        isLoadingComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-6">
        <div className="relative">
          <Sparkles className="h-16 w-16 text-purple-400 animate-pulse mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-white">Loading Immersive Experience</h3>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-purple-300">{progress}%</p>
      </div>
    </div>
  );
}

// Main Component
export default function UltimatePanoramaViewer({ destination }: UltimatePanoramaViewerProps): JSX.Element {
  const panoramas = getPanoramasForDestination(destination);
  const location = getLocationById(destination);
  const soundscape = getSoundscapeForLocation(destination);
  
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Weather System
  const [currentWeather, setCurrentWeather] = useState<WeatherPreset>(() => 
    getDefaultWeatherForLocation(destination)
  );
  
  // Ambient Sound System
  const {
    isPlaying,
    isMuted,
    volume,
    isNarrating,
    play: playSound,
    pause: pauseSound,
    toggleMute,
    setVolume,
    playNarration,
    stopNarration
  } = useAmbientSound(soundscape);
  
  // UI State
  const [photoModeOpen, setPhotoModeOpen] = useState<boolean>(false);
  const [audioControlsExpanded, setAudioControlsExpanded] = useState<boolean>(false);
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true);
  const [vrModeActive, setVrModeActive] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  
  // Achievement System
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});

  // Canvas ref for photo mode
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mount and loading
  useEffect(() => {
    setMounted(true);
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Auto-play welcome narration
        if (soundscape?.welcomeNarration) {
          setTimeout(() => {
            playNarration(soundscape.welcomeNarration!);
          }, 1000);
        }
      }
      setLoadingProgress(Math.min(100, progress));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Track achievements
  const unlockAchievement = useCallback((achievementId: string) => {
    if (unlockedAchievements.has(achievementId)) return;
    
    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;
    
    const unlockedAchievement: Achievement = {
      ...achievement,
      unlocked: true,
      unlockedAt: new Date(),
      progress: achievement.maxProgress || 100
    };
    
    setUnlockedAchievements(prev => new Set([...prev, achievementId]));
    setCurrentAchievement(unlockedAchievement);
  }, [unlockedAchievements]);

  // First visit achievement
  useEffect(() => {
    if (mounted && loadingProgress === 100) {
      unlockAchievement('first-visit');
    }
  }, [mounted, loadingProgress, unlockAchievement]);

  const currentPanorama = panoramas[currentPanoramaIndex];

  if (panoramas.length === 0 || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading panorama viewer...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Main Canvas */}
      <div className="relative h-screen">
        <Canvas 
          ref={canvasRef}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            <PanoramaScene 
              panorama={currentPanorama}
              weather={currentWeather}
              locationId={destination}
              particlesEnabled={particlesEnabled}
              onHotspotClick={(idx) => {
                console.log('Hotspot clicked:', idx);
                unlockAchievement('hotspot-hunter');
              }}
            />
          </Suspense>
        </Canvas>

        {/* Loading Screen */}
        {loadingProgress < 100 && <LoadingScreen progress={loadingProgress} />}

        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-start justify-between gap-4">
          {/* Location Info */}
          <Card className="bg-black/70 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-purple-400" />
                <div>
                  <h2 className="text-white font-bold">{location?.name || destination}</h2>
                  <p className="text-xs text-gray-400">{translate('panorama.title', language)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Toggle */}
          <Button
            onClick={() => setLanguage(lang => lang === 'en' ? 'id' : 'en')}
            className="bg-gray-900/90 border border-gray-700"
          >
            <Globe className="h-4 w-4 mr-2" />
            {language.toUpperCase()}
          </Button>

          {/* VR Mode */}
          <VRModeButton
            onEnterVR={() => setVrModeActive(true)}
            onExitVR={() => setVrModeActive(false)}
          />
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between gap-4">
          {/* Audio Controls */}
          <div className="max-w-xs">
            {audioControlsExpanded ? (
              <AudioControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                volume={volume}
                isNarrating={isNarrating}
                onPlay={playSound}
                onPause={pauseSound}
                onToggleMute={toggleMute}
                onVolumeChange={setVolume}
                onPlayNarration={playNarration}
                onStopNarration={stopNarration}
                welcomeNarration={soundscape?.welcomeNarration}
              />
            ) : (
              <CompactAudioControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                isNarrating={isNarrating}
                onTogglePlay={() => isPlaying ? pauseSound() : playSound()}
                onToggleMute={toggleMute}
                onExpand={() => setAudioControlsExpanded(true)}
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPhotoModeOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Camera className="h-4 w-4 mr-2" />
              {translate('photo.title', language)}
            </Button>
            
            <Button
              onClick={() => setParticlesEnabled(!particlesEnabled)}
              variant="outline"
              className="border-gray-700"
            >
              <Sparkles className="h-4 w-4" />
            </Button>

            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              <Trophy className="h-3 w-3 mr-1" />
              {unlockedAchievements.size}
            </Badge>
          </div>
        </div>

        {/* Weather Controls */}
        <WeatherControls
          currentWeather={currentWeather}
          locationId={destination}
          onWeatherChange={setCurrentWeather}
        />
      </div>

      {/* Photo Mode */}
      {photoModeOpen && canvasRef.current && (
        <PhotoMode
          onClose={() => {
            setPhotoModeOpen(false);
            unlockAchievement('first-photo');
          }}
          canvasRef={canvasRef}
          locationName={location?.name || destination}
        />
      )}

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        onDismiss={() => setCurrentAchievement(null)}
      />
    </div>
  );
}
