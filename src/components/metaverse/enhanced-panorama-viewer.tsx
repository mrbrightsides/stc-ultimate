'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, Info, RotateCw, ZoomIn, ZoomOut, MapPin, AlertTriangle, Camera, Navigation, 
  Maximize2, Minimize2, Ruler, Activity, Sun, Moon, CloudRain, Wind, Download, BarChart3,
  ArrowLeft, ArrowRight, Home, Image, Video, Map, Layers, ChevronLeft, ChevronRight,
  Loader2, Smartphone
} from 'lucide-react';
import * as THREE from 'three';
import { getPanoramasForDestination, getPanoramaById } from '@/lib/panorama-config';
import type { PanoramaImage } from '@/lib/panorama-config';

interface PanoramaViewerProps {
  destination: string;
}

interface MeasurementPoint {
  position: THREE.Vector3;
  id: number;
}

interface HeatmapData {
  position: [number, number, number];
  intensity: number;
}

interface ViewAnalytics {
  totalViews: number;
  avgViewDuration: number;
  popularAreas: HeatmapData[];
  interactionCount: number;
}

interface NavigationHistory {
  panoramaId: string;
  timestamp: number;
}

// Enhanced Hotspot Types
type HotspotType = 'info' | 'navigation' | 'media' | 'poi';

// Progressive Loading State
interface LoadingState {
  lowRes: boolean;
  highRes: boolean;
  progress: number;
}

// Enhanced Safe Panoramic Sphere with Optimized Loading
function SafePanoramaSphere({ 
  panorama, 
  timeOfDay,
  onLoadProgress 
}: { 
  panorama: PanoramaImage; 
  timeOfDay: number;
  onLoadProgress?: (progress: number) => void;
}): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    
    // Start loading indicator immediately
    setLoadingProgress(10);
    onLoadProgress?.(10);
    
    // Load high-res directly (low-res files don't exist on Poly Haven)
    loader.load(
      panorama.imagePath,
      (loadedTexture: THREE.Texture) => {
        if (!isMounted) {
          loadedTexture.dispose();
          return;
        }
        
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        // Optimize texture for performance
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        
        setTexture(loadedTexture);
        setLoadError(false);
        setLoadingProgress(100);
        onLoadProgress?.(100);
      },
      (xhr) => {
        if (!isMounted) return;
        
        if (xhr.lengthComputable) {
          const percentComplete = 10 + (xhr.loaded / xhr.total) * 90;
          setLoadingProgress(percentComplete);
          onLoadProgress?.(percentComplete);
        }
      },
      (error) => {
        if (!isMounted) return;
        
        console.error('Failed to load panorama:', error);
        setLoadError(true);
        setTexture(null);
        setLoadingProgress(0);
        onLoadProgress?.(0);
      }
    );

    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [panorama.imagePath, onLoadProgress]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  const brightness = Math.max(0.3, Math.sin((timeOfDay / 24) * Math.PI * 2) * 0.7 + 0.5);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      {/* Reduced geometry complexity for better performance */}
      <sphereGeometry args={[50, 48, 32]} />
      {texture && !loadError ? (
        <meshBasicMaterial 
          map={texture} 
          side={THREE.BackSide}
          opacity={brightness}
          transparent={timeOfDay < 6 || timeOfDay > 20}
        />
      ) : (
        <meshBasicMaterial color={panorama.fallbackColor} side={THREE.BackSide} />
      )}
    </mesh>
  );
}

// Weather Effects
function WeatherEffects({ weather }: { weather: string }): JSX.Element {
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const positions: number[] = [];
    const particleCount = weather === 'rain' ? 1000 : weather === 'snow' ? 500 : 0;

    for (let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 100,
        Math.random() * 100 - 50,
        (Math.random() - 0.5) * 100
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    return () => {
      geometry.dispose();
    };
  }, [weather]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= weather === 'rain' ? 0.5 : weather === 'snow' ? 0.1 : 0;
        if (positions[i] < -50) {
          positions[i] = 50;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (weather === 'clear') return <></>;

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial 
        size={weather === 'rain' ? 0.1 : 0.3} 
        color={weather === 'rain' ? '#4a9eff' : '#ffffff'}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// Measurement Markers
function MeasurementMarkers({ points }: { points: MeasurementPoint[] }): JSX.Element {
  return (
    <>
      {points.map((point) => (
        <group key={point.id} position={point.position}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh>
            <ringGeometry args={[0.3, 0.5, 32]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      
      {points.length === 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                points[0].position.x, points[0].position.y, points[0].position.z,
                points[1].position.x, points[1].position.y, points[1].position.z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ff0000" linewidth={2} />
        </line>
      )}
    </>
  );
}

// Heatmap Visualization
function HeatmapVisualization({ heatmapData }: { heatmapData: HeatmapData[] }): JSX.Element {
  return (
    <>
      {heatmapData.map((data, idx) => {
        const color = new THREE.Color().setHSL(
          (1 - data.intensity) * 0.3,
          1,
          0.5
        );
        
        return (
          <group key={idx} position={data.position as [number, number, number]}>
            <mesh>
              <sphereGeometry args={[0.5 + data.intensity * 0.5, 16, 16]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={0.3 + data.intensity * 0.3}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// Enhanced Hotspots with Navigation
function Hotspots({ 
  panorama, 
  onHotspotClick 
}: { 
  panorama: PanoramaImage; 
  onHotspotClick: (idx: number) => void;
}): JSX.Element {
  const hotspots = panorama.hotspots;

  return (
    <>
      {hotspots.map((spot, i) => (
        <group 
          key={i} 
          position={spot.position as [number, number, number]}
          onClick={(e) => {
            e.stopPropagation();
            onHotspotClick(i);
          }}
        >
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.5]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Gyroscope-enabled Camera Controls
function GyroscopeControls({ enabled }: { enabled: boolean }): JSX.Element {
  const { camera } = useThree();
  const initialAlpha = useRef<number | null>(null);
  const initialBeta = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      if (event.alpha === null || event.beta === null || event.gamma === null) return;

      // Initialize baseline orientation
      if (initialAlpha.current === null) {
        initialAlpha.current = event.alpha;
        initialBeta.current = event.beta;
        return;
      }

      // Calculate relative rotation
      const alphaDiff = event.alpha - (initialAlpha.current || 0);
      const betaDiff = event.beta - (initialBeta.current || 0);

      // Apply rotation to camera
      camera.rotation.y = THREE.MathUtils.degToRad(alphaDiff);
      camera.rotation.x = THREE.MathUtils.degToRad(betaDiff);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled, camera]);

  return <></>;
}

// 3D Scene Component with Progressive Loading
function PanoramaScene({ 
  panorama, 
  onHotspotClick,
  timeOfDay,
  weather,
  measurementPoints,
  showHeatmap,
  heatmapData,
  cameraZoom,
  gyroscopeEnabled,
  onLoadProgress
}: { 
  panorama: PanoramaImage; 
  onHotspotClick: (idx: number) => void;
  timeOfDay: number;
  weather: string;
  measurementPoints: MeasurementPoint[];
  showHeatmap: boolean;
  heatmapData: HeatmapData[];
  cameraZoom: number;
  gyroscopeEnabled: boolean;
  onLoadProgress?: (progress: number) => void;
}): JSX.Element {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.zoom = cameraZoom;
    camera.updateProjectionMatrix();
  }, [cameraZoom, camera]);

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 0.1]} 
        fov={75}
      />
      {!gyroscopeEnabled && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          rotateSpeed={-0.5}
          minDistance={0.1}
          maxDistance={10}
        />
      )}
      {gyroscopeEnabled && <GyroscopeControls enabled={gyroscopeEnabled} />}
      
      <SafePanoramaSphere 
        panorama={panorama} 
        timeOfDay={timeOfDay}
        onLoadProgress={onLoadProgress}
      />
      <Hotspots panorama={panorama} onHotspotClick={onHotspotClick} />
      <MeasurementMarkers points={measurementPoints} />
      {showHeatmap && <HeatmapVisualization heatmapData={heatmapData} />}
      <WeatherEffects weather={weather} />
      
      <ambientLight intensity={timeOfDay >= 6 && timeOfDay <= 20 ? 1 : 0.3} />
    </>
  );
}

// Enhanced Loading Screen with Smooth Fade-Out
function LoadingScreen({ progress, isHiding }: { progress: number; isHiding: boolean }): JSX.Element {
  return (
    <div 
      className={`flex flex-col items-center justify-center h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black transition-opacity duration-500 ${
        isHiding ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-4" />
      <p className="text-gray-300 mb-4">Loading 360° Panorama...</p>
      <div className="w-64">
        <Progress value={progress} className="h-2" />
        <p className="text-gray-400 text-sm text-center mt-2">{Math.round(progress)}%</p>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {progress < 30 ? '🔄 Initializing...' : progress < 100 ? '📸 Loading panorama...' : '✅ Ready!'}
        </p>
      </div>
    </div>
  );
}

// Client-only Canvas Wrapper with WebGL Context Recovery
function PanoramaCanvas({ 
  panorama, 
  onHotspotClick,
  timeOfDay,
  weather,
  measurementPoints,
  showHeatmap,
  heatmapData,
  cameraZoom,
  gyroscopeEnabled
}: { 
  panorama: PanoramaImage; 
  onHotspotClick: (idx: number) => void;
  timeOfDay: number;
  weather: string;
  measurementPoints: MeasurementPoint[];
  showHeatmap: boolean;
  heatmapData: HeatmapData[];
  cameraZoom: number;
  gyroscopeEnabled: boolean;
}): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // WebGL context loss recovery
    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting recovery...');
      setContextLost(true);
    };

    const handleContextRestored = (): void => {
      console.log('WebGL context restored');
      setContextLost(false);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, []);

  const handleLoadProgress = (progress: number): void => {
    setLoadingProgress(progress);
    
    // When fully loaded, trigger fade-out then hide
    if (progress >= 100 && !isLoadingComplete) {
      setIsLoadingComplete(true);
      // Start fade-out immediately
      setTimeout(() => {
        setShowLoading(false);
      }, 500); // Remove from DOM after fade-out completes
    }
  };

  if (!mounted) {
    return <LoadingScreen progress={0} isHiding={false} />;
  }

  if (contextLost) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-gray-300 mb-4">WebGL context was lost</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RotateCw className="h-4 w-4 mr-2" />
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <>
      {showLoading && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <LoadingScreen progress={loadingProgress} isHiding={isLoadingComplete} />
        </div>
      )}
      <Canvas 
        ref={canvasRef}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          // Optimize WebGL settings
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <PanoramaScene 
          panorama={panorama} 
          onHotspotClick={onHotspotClick}
          timeOfDay={timeOfDay}
          weather={weather}
          measurementPoints={measurementPoints}
          showHeatmap={showHeatmap}
          heatmapData={heatmapData}
          cameraZoom={cameraZoom}
          gyroscopeEnabled={gyroscopeEnabled}
          onLoadProgress={handleLoadProgress}
        />
      </Canvas>
    </>
  );
}

// Floor Plan Mini Map
function FloorPlanMap({ 
  panoramas, 
  currentIndex, 
  onNavigate 
}: { 
  panoramas: PanoramaImage[]; 
  currentIndex: number; 
  onNavigate: (idx: number) => void;
}): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-900/80 backdrop-blur-md rounded-lg border border-cyan-500/30">
      {panoramas.map((pano, idx) => (
        <button
          key={pano.id}
          onClick={() => onNavigate(idx)}
          className={`p-3 rounded-lg border-2 transition-all ${
            idx === currentIndex 
              ? 'border-cyan-400 bg-cyan-500/20' 
              : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50'
          }`}
        >
          <div 
            className="w-full h-12 rounded mb-2 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${pano.imagePath})`,
              backgroundColor: pano.fallbackColor 
            }}
          />
          <p className="text-white text-xs font-semibold truncate">{pano.name}</p>
        </button>
      ))}
    </div>
  );
}

export default function EnhancedPanoramaViewer({ destination }: PanoramaViewerProps): JSX.Element {
  const panoramas = getPanoramasForDestination(destination);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Phase 1: Navigation
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [showFloorPlan, setShowFloorPlan] = useState<boolean>(false);

  // Phase 2: Gyroscope & Mobile
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState<boolean>(false);
  const [gyroscopeSupported, setGyroscopeSupported] = useState<boolean>(false);

  // Measurement Tools State
  const [measurementMode, setMeasurementMode] = useState<boolean>(false);
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>([]);
  const [distance, setDistance] = useState<number>(0);

  // Time & Weather Simulation
  const [timeOfDay, setTimeOfDay] = useState<number>(12);
  const [weather, setWeather] = useState<string>('clear');

  // Heatmap Analytics
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [analytics, setAnalytics] = useState<ViewAnalytics>({
    totalViews: 0,
    avgViewDuration: 0,
    popularAreas: [],
    interactionCount: 0
  });

  useEffect(() => {
    setMounted(true);
    generateMockHeatmapData();
    setAnalytics({
      totalViews: Math.floor(Math.random() * 10000) + 1000,
      avgViewDuration: Math.floor(Math.random() * 180) + 60,
      popularAreas: [],
      interactionCount: Math.floor(Math.random() * 500) + 50
    });

    // Check gyroscope support
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setGyroscopeSupported(true);
    }
  }, []);

  const generateMockHeatmapData = (): void => {
    const mockData: HeatmapData[] = [];
    
    for (let i = 0; i < 15; i++) {
      const theta = (Math.random() * Math.PI * 2);
      const phi = (Math.random() * Math.PI);
      const radius = 45;
      
      mockData.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        intensity: Math.random()
      });
    }
    
    setHeatmapData(mockData);
  };

  const requestGyroscopePermission = async (): Promise<void> => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setGyroscopeEnabled(true);
        }
      } catch (error) {
        console.error('Gyroscope permission denied', error);
      }
    } else {
      setGyroscopeEnabled(true);
    }
  };

  const handleHotspotClick = (idx: number): void => {
    setSelectedHotspot(idx);
    setIsDialogOpen(true);
    setAnalytics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1
    }));
  };

  const handleMeasurementToggle = (): void => {
    setMeasurementMode(!measurementMode);
    setMeasurementPoints([]);
    setDistance(0);
  };

  const handleNavigateToPanorama = (index: number): void => {
    setNavigationHistory(prev => [...prev, {
      panoramaId: panoramas[currentPanoramaIndex].id,
      timestamp: Date.now()
    }]);
    setCurrentPanoramaIndex(index);
  };

  const handleBackNavigation = (): void => {
    if (navigationHistory.length > 0) {
      const lastNav = navigationHistory[navigationHistory.length - 1];
      const lastIndex = panoramas.findIndex(p => p.id === lastNav.panoramaId);
      if (lastIndex !== -1) {
        setCurrentPanoramaIndex(lastIndex);
        setNavigationHistory(prev => prev.slice(0, -1));
      }
    }
  };

  const handleNextPanorama = (): void => {
    const nextIndex = (currentPanoramaIndex + 1) % panoramas.length;
    handleNavigateToPanorama(nextIndex);
  };

  const handlePreviousPanorama = (): void => {
    const prevIndex = currentPanoramaIndex === 0 ? panoramas.length - 1 : currentPanoramaIndex - 1;
    handleNavigateToPanorama(prevIndex);
  };

  const handleZoomIn = (): void => {
    setCameraZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = (): void => {
    setCameraZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const exportAnalytics = (): void => {
    const data = {
      destination,
      panorama: panoramas[currentPanoramaIndex].name,
      analytics,
      heatmapData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panorama-analytics-${destination}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (panoramas.length === 0) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/30">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <AlertTitle className="text-yellow-400">No Panoramas Available</AlertTitle>
        <AlertDescription className="text-gray-300">
          360° panoramic images for {destination} have not been uploaded yet.
        </AlertDescription>
      </Alert>
    );
  }

  if (!mounted) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-400">Loading 360° viewer...</p>
        </CardContent>
      </Card>
    );
  }

  const currentPanorama = panoramas[currentPanoramaIndex];
  const timeLabel = timeOfDay < 6 ? 'Night' : timeOfDay < 12 ? 'Morning' : timeOfDay < 18 ? 'Afternoon' : timeOfDay < 21 ? 'Evening' : 'Night';

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 border-purple-500/30">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  Enhanced 360° Virtual Tour
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Progressive Loading • Gyroscope Support • High-Quality Images
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  <Layers className="h-3 w-3 mr-1" />
                  Phase 2
                </Badge>
                {gyroscopeSupported && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                    <Smartphone className="h-3 w-3 mr-1" />
                    Gyro Ready
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Navigation Controls */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Navigation className="h-4 w-4 text-cyan-400" />
                Room Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select 
                value={currentPanoramaIndex.toString()} 
                onValueChange={(val: string) => handleNavigateToPanorama(parseInt(val))}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {panoramas.map((pano, idx) => (
                    <SelectItem key={pano.id} value={idx.toString()}>
                      {pano.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleBackNavigation}
                  disabled={navigationHistory.length === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handlePreviousPanorama}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleNextPanorama}
                  className="flex-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-cyan-400" />
                View Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleZoomOut}
                  className="flex-1"
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleZoomIn}
                  className="flex-1"
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={toggleFullscreen}
                  className="flex-1"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4 mr-1" /> : <Maximize2 className="h-4 w-4 mr-1" />}
                  {isFullscreen ? 'Exit' : 'Fullscreen'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowFloorPlan(!showFloorPlan)}
                  className="flex-1"
                >
                  <Map className="h-4 w-4 mr-1" />
                  Map
                </Button>
              </div>

              {gyroscopeSupported && (
                <Button 
                  size="sm" 
                  variant={gyroscopeEnabled ? "default" : "outline"}
                  onClick={requestGyroscopePermission}
                  className="w-full"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  {gyroscopeEnabled ? 'Gyroscope Active' : 'Enable Gyroscope'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Room:</span>
                  <span className="text-white font-semibold">{currentPanoramaIndex + 1}/{panoramas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hotspots:</span>
                  <span className="text-white font-semibold">{currentPanorama.hotspots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Zoom:</span>
                  <span className="text-white font-semibold">{(cameraZoom * 100).toFixed(0)}%</span>
                </div>
                {gyroscopeEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Gyro
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 360° Canvas with Enhanced Overlay */}
        <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
          <div className="h-[600px] bg-gradient-to-br from-gray-900 to-black relative">
            <PanoramaCanvas 
              panorama={currentPanorama} 
              onHotspotClick={handleHotspotClick}
              timeOfDay={timeOfDay}
              weather={weather}
              measurementPoints={measurementPoints}
              showHeatmap={showHeatmap}
              heatmapData={heatmapData}
              cameraZoom={cameraZoom}
              gyroscopeEnabled={gyroscopeEnabled}
            />

            {/* Top Left Info */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-xs z-10 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">{currentPanorama.name}</p>
                  <p className="text-gray-300 text-xs mt-1">{currentPanorama.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
                      {timeLabel}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                      {weather}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
              <Button
                size="icon"
                variant="outline"
                onClick={handlePreviousPanorama}
                className="bg-black/70 backdrop-blur-md border-cyan-500/50 hover:bg-cyan-500/20"
              >
                <ChevronLeft className="h-6 w-6 text-cyan-400" />
              </Button>
            </div>

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
              <Button
                size="icon"
                variant="outline"
                onClick={handleNextPanorama}
                className="bg-black/70 backdrop-blur-md border-cyan-500/50 hover:bg-cyan-500/20"
              >
                <ChevronRight className="h-6 w-6 text-cyan-400" />
              </Button>
            </div>

            {/* Floor Plan Overlay */}
            {showFloorPlan && (
              <div className="absolute top-4 right-4 z-20 max-w-md">
                <div className="bg-black/90 backdrop-blur-md rounded-lg border border-cyan-500/50 p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Map className="h-4 w-4 text-cyan-400" />
                      Floor Plan
                    </h3>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setShowFloorPlan(false)}
                      className="h-6 w-6"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FloorPlanMap 
                    panoramas={panoramas}
                    currentIndex={currentPanoramaIndex}
                    onNavigate={handleNavigateToPanorama}
                  />
                </div>
              </div>
            )}

            {/* Hotspot Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-xs z-10 border border-cyan-500/30">
              <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                Interactive Points ({currentPanorama.hotspots.length})
              </p>
              <ScrollArea className="h-32">
                <div className="space-y-2 pr-4">
                  {currentPanorama.hotspots.map((hotspot, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleHotspotClick(idx)}
                      className="flex items-center gap-2 w-full text-left hover:bg-white/10 p-2 rounded transition-colors"
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: hotspot.color }}
                      />
                      <span className="text-gray-300 text-xs flex-1">{hotspot.label}</span>
                      <Info className="h-3 w-3 text-gray-400" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Zoom Indicator */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg z-10 border border-cyan-500/30">
              <p className="text-white text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-cyan-400" />
                Zoom: {(cameraZoom * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Thumbnail Gallery */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Image className="h-5 w-5 text-purple-400" />
              Room Gallery ({panoramas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent>
                {panoramas.map((panorama, idx) => (
                  <CarouselItem key={panorama.id} className="md:basis-1/2 lg:basis-1/4">
                    <Card 
                      className={`cursor-pointer transition-all ${ 
                        idx === currentPanoramaIndex 
                          ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500' 
                          : 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50'
                      }`}
                      onClick={() => handleNavigateToPanorama(idx)}
                    >
                      <CardContent className="p-3">
                        <div 
                          className="w-full h-24 rounded-lg mb-2 bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${panorama.imagePath})`,
                            backgroundColor: panorama.fallbackColor 
                          }}
                        />
                        <p className="font-semibold text-white text-sm truncate">{panorama.name}</p>
                        <p className="text-xs text-gray-400 truncate">{panorama.description}</p>
                        <div className="flex gap-1 mt-2">
                          <Badge className="text-xs bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                            {panorama.hotspots.length} POIs
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>

        {/* Hotspot Dialog */}
        {selectedHotspot !== null && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-gray-900 border-purple-500/50 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: currentPanorama.hotspots[selectedHotspot].color }}
                  />
                  {currentPanorama.hotspots[selectedHotspot].label}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Point of Interest in {currentPanorama.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-gray-300 mb-4">
                    {currentPanorama.hotspots[selectedHotspot].description || 
                      '🎯 Interactive hotspot with detailed information about this location.'}
                  </p>
                  <Separator className="my-4 bg-gray-700" />
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Hotspot Name:</p>
                      <p className="text-white font-semibold">{currentPanorama.hotspots[selectedHotspot].label}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Location:</p>
                      <p className="text-white font-semibold">{currentPanorama.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Position:</p>
                      <p className="text-gray-300 font-mono text-xs">
                        [{currentPanorama.hotspots[selectedHotspot].position.map((p: number) => p.toFixed(1)).join(', ')}]
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Color Code:</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-600" 
                          style={{ backgroundColor: currentPanorama.hotspots[selectedHotspot].color }}
                        />
                        <span className="text-gray-300 font-mono text-xs">{currentPanorama.hotspots[selectedHotspot].color}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Continue Exploring
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-purple-500/50 hover:bg-purple-500/10"
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleNextPanorama();
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Next Room
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
}
