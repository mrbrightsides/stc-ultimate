'use client';

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, Info, RotateCw, ZoomIn, MapPin, Camera, Navigation, Volume2, VolumeX,
  ExternalLink, Lightbulb, Image as ImageIcon, X, Map, Layers
} from 'lucide-react';
import * as THREE from 'three';
import { getPanoramasForDestination } from '@/lib/panorama-config';
import type { PanoramaImage, PanoramaHotspot } from '@/lib/panorama-config';
import { getLocationById, getHotspotsForLocation, getAllLocations } from '@/lib/tourism-data';
import type { LocationHotspot } from '@/lib/tourism-data';

interface Phase3PanoramaViewerProps {
  destination: string;
}

// Text-to-Speech Hook
function useAudioNarration() {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string): void => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback((): void => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}

// Safe Panoramic Sphere with WebGL Recovery
function SafePanoramaSphere({ panorama }: { panorama: PanoramaImage }): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      panorama.imagePath,
      (loadedTexture: THREE.Texture) => {
        if (!isMounted) return;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
        setLoadError(false);
        setIsLoadingComplete(true);
      },
      undefined,
      () => {
        if (!isMounted) return;
        setLoadError(true);
        setIsLoadingComplete(true);
        setTexture(null);
      }
    );

    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [panorama.imagePath]);

  useFrame(() => {
    if (meshRef.current && !contextLost) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 48, 32]} />
      {texture && !loadError ? (
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      ) : (
        <meshBasicMaterial color={panorama.fallbackColor} side={THREE.BackSide} />
      )}
    </mesh>
  );
}

// Enhanced 3D Hotspots with Labels
function Enhanced3DHotspots({ 
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
          {/* Pulsing sphere */}
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.8}
            />
          </mesh>
          
          {/* Outer ring */}
          <mesh position={[0, 0, 0.6]}>
            <ringGeometry args={[0.7, 1, 32]} />
            <meshBasicMaterial 
              color={spot.color} 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* HTML Label */}
          <Html
            position={[0, 1.2, 0]}
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              <p className="text-white text-xs font-semibold whitespace-nowrap">
                {spot.label}
              </p>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

// 3D Scene Component
function PanoramaScene({ 
  panorama, 
  onHotspotClick 
}: { 
  panorama: PanoramaImage; 
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
        zoomSpeed={0.5}
      />
      
      <SafePanoramaSphere panorama={panorama} />
      <Enhanced3DHotspots panorama={panorama} onHotspotClick={onHotspotClick} />
      
      <ambientLight intensity={1.2} />
    </>
  );
}

// Canvas Wrapper with WebGL Context Recovery
function PanoramaCanvas({ 
  panorama, 
  onHotspotClick 
}: { 
  panorama: PanoramaImage; 
  onHotspotClick: (idx: number) => void;
}): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContextLost = useCallback((event: Event): void => {
    event.preventDefault();
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback((): void => {
    setContextLost(false);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
        <p className="text-gray-400">Initializing 360° viewer...</p>
      </div>
    );
  }

  if (contextLost) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black gap-4">
        <p className="text-gray-400">WebGL context lost. Please reload.</p>
        <Button onClick={() => window.location.reload()}>Reload Viewer</Button>
      </div>
    );
  }

  return (
    <Canvas 
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', handleContextLost);
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
      }}
    >
      <PanoramaScene panorama={panorama} onHotspotClick={onHotspotClick} />
    </Canvas>
  );
}

export default function Phase3PanoramaViewer({ destination }: Phase3PanoramaViewerProps): JSX.Element {
  const panoramas = getPanoramasForDestination(destination);
  const locationData = getLocationById(destination);
  const hotspotData = getHotspotsForLocation(destination);
  const allLocations = getAllLocations();

  const [mounted, setMounted] = useState<boolean>(false);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(false);

  const { speak, stop, isSpeaking, isSupported } = useAudioNarration();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-play location narration on mount
    if (mounted && locationData && isSupported) {
      const welcomeText = `Welcome to ${locationData.name}. ${locationData.description}`;
      setTimeout(() => speak(welcomeText), 1000);
    }

    return () => {
      stop();
    };
  }, [mounted, destination]);

  const handleHotspotClick = (idx: number): void => {
    setSelectedHotspot(idx);
    setIsDialogOpen(true);

    // Play audio narration if available
    const hotspotInfo = hotspotData[idx];
    if (hotspotInfo?.audioNarration) {
      speak(hotspotInfo.audioNarration);
    }
  };

  const handleLocationChange = (newDestination: string): void => {
    stop();
    window.location.href = `?destination=${newDestination}`;
  };

  if (!mounted) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-400">Loading 360° viewer...</p>
        </CardContent>
      </Card>
    );
  }

  if (panoramas.length === 0) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/30">
        <AlertDescription className="text-gray-300">
          360° panoramic images for {destination} are not available yet.
        </AlertDescription>
      </Alert>
    );
  }

  const currentPanorama = panoramas[currentPanoramaIndex];
  const currentHotspotData = hotspotData[selectedHotspot || 0];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Location Info */}
        {locationData && (
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-2 text-2xl">
                    <MapPin className="h-6 w-6 text-purple-400" />
                    {locationData.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2 text-base">
                    {locationData.longDescription}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {locationData.tags.map((tag, idx) => (
                      <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMiniMap(!showMiniMap)}
                    className="border-cyan-500/50"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {showMiniMap ? 'Hide' : 'Show'} Map
                  </Button>
                  {isSupported && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => isSpeaking ? stop() : speak(locationData.description)}
                      className="border-green-500/50"
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Mini Map - Location Selector */}
        {showMiniMap && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-400" />
                Explore Other Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allLocations.map((loc) => (
                  <Card
                    key={loc.id}
                    className={`cursor-pointer transition-all ${
                      loc.id === destination
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50'
                    }`}
                    onClick={() => handleLocationChange(loc.id)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div 
                        className="w-full h-32 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${loc.image})` }}
                      />
                      <div>
                        <h4 className="font-semibold text-white">{loc.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{loc.region}</p>
                      </div>
                      {loc.id === destination && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                          Current Location
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 360° Canvas */}
        <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
          <div className="h-[600px] bg-gradient-to-br from-gray-900 to-black relative">
            <PanoramaCanvas panorama={currentPanorama} onHotspotClick={handleHotspotClick} />

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-xs z-10 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">{currentPanorama.name}</p>
                  <p className="text-gray-300 text-xs mt-1">{currentPanorama.description}</p>
                </div>
              </div>
            </div>

            {/* Hotspot Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-xs z-10 border border-cyan-500/30">
              <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                Points of Interest ({currentPanorama.hotspots.length})
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

            {/* Controls Guide */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-lg z-10 border border-gray-700">
              <div className="flex gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-3 w-3" />
                  <span>Drag to rotate</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-3 w-3" />
                  <span>Scroll to zoom</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Hotspot Dialog */}
        {selectedHotspot !== null && currentHotspotData && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-gray-900 border-purple-500/50 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2 text-xl">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: currentPanorama.hotspots[selectedHotspot].color }}
                  />
                  {currentHotspotData.title}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {currentHotspotData.description}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="facts">Facts</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/30">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentHotspotData.longDescription}
                    </p>
                  </div>

                  {isSupported && currentHotspotData.audioNarration && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => speak(currentHotspotData.audioNarration || '')}
                        disabled={isSpeaking}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        {isSpeaking ? 'Playing...' : 'Listen to Audio Guide'}
                      </Button>
                      {isSpeaking && (
                        <Button onClick={stop} variant="outline">
                          <VolumeX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {currentHotspotData.links && currentHotspotData.links.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-cyan-400" />
                        Useful Links
                      </h4>
                      {currentHotspotData.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
                        >
                          <span className="text-cyan-300 text-sm flex items-center gap-2">
                            {link.label}
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="facts" className="space-y-3 mt-4">
                  {currentHotspotData.facts && currentHotspotData.facts.length > 0 ? (
                    currentHotspotData.facts.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-400 text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-300 flex-1">{fact}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-8">No facts available</p>
                  )}
                </TabsContent>

                <TabsContent value="tips" className="space-y-3 mt-4">
                  {currentHotspotData.tips && currentHotspotData.tips.length > 0 ? (
                    currentHotspotData.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-300 flex-1">{tip}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-8">No tips available</p>
                  )}
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  {currentHotspotData.images && currentHotspotData.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {currentHotspotData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-700">
                          <img 
                            src={img} 
                            alt={`${currentHotspotData.title} ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <ImageIcon className="h-12 w-12 text-gray-600 mx-auto" />
                      <p className="text-gray-400 text-sm">No additional media available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t border-gray-800">
                <Button 
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Continue Exploring
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Location Highlights */}
        {locationData && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Why Visit {locationData.name}?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-purple-400">Top Highlights</h4>
                  <ul className="space-y-2">
                    {locationData.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-xs text-cyan-400 font-semibold mb-1">Best Time to Visit</p>
                    <p className="text-white font-semibold">{locationData.bestTimeToVisit}</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-green-400 font-semibold mb-1">Average Daily Budget</p>
                    <p className="text-white font-semibold">{locationData.averageCost}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
