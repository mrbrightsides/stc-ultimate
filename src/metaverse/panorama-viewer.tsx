'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Info, RotateCw, ZoomIn, MapPin, AlertTriangle, Camera, Navigation, Maximize2 } from 'lucide-react';
import * as THREE from 'three';
import { getPanoramasForDestination } from '@/lib/panorama-config';
import type { PanoramaImage } from '@/lib/panorama-config';

interface PanoramaViewerProps {
  destination: string;
}

// Safe Panoramic Sphere with Manual Texture Loading
function SafePanoramaSphere({ panorama }: { panorama: PanoramaImage }): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    loader.load(
      panorama.imagePath,
      // Success callback
      (loadedTexture: THREE.Texture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
        setLoadError(false);
      },
      // Progress callback
      undefined,
      // Error callback
      () => {
        setLoadError(true);
        setTexture(null);
      }
    );

    // Cleanup
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [panorama.imagePath]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Render with texture if loaded, otherwise use fallback color
  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 60, 40]} />
      {texture && !loadError ? (
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      ) : (
        <meshBasicMaterial color={panorama.fallbackColor} side={THREE.BackSide} />
      )}
    </mesh>
  );
}

// Hotspot Markers Component
function Hotspots({ panorama, onHotspotClick }: { panorama: PanoramaImage; onHotspotClick: (idx: number) => void }): JSX.Element {
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

// 3D Scene Component
function PanoramaScene({ panorama, onHotspotClick }: { panorama: PanoramaImage; onHotspotClick: (idx: number) => void }): JSX.Element {
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
      />
      
      <SafePanoramaSphere panorama={panorama} />
      <Hotspots panorama={panorama} onHotspotClick={onHotspotClick} />
      
      <ambientLight intensity={1} />
    </>
  );
}

// Client-only Canvas Wrapper
function PanoramaCanvas({ panorama, onHotspotClick }: { panorama: PanoramaImage; onHotspotClick: (idx: number) => void }): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gray-900 to-black">
        <p className="text-gray-400">Initializing 360° viewer...</p>
      </div>
    );
  }

  return (
    <Canvas gl={{ antialias: true, alpha: false }}>
      <PanoramaScene panorama={panorama} onHotspotClick={onHotspotClick} />
    </Canvas>
  );
}

export default function PanoramaViewer({ destination }: PanoramaViewerProps): JSX.Element {
  const panoramas = getPanoramasForDestination(destination);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHotspotClick = (idx: number): void => {
    setSelectedHotspot(idx);
    setIsDialogOpen(true);
  };

  if (panoramas.length === 0) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/30">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <AlertTitle className="text-yellow-400">No Panoramas Available</AlertTitle>
        <AlertDescription className="text-gray-300">
          360° panoramic images for {destination} have not been uploaded yet. Please upload equirectangular images to the panoramas folder.
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
                  360° Panoramic Experience
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Immersive 360° views of {destination} - Click and drag to explore
                </CardDescription>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                <Camera className="h-3 w-3 mr-1" />
                4K Quality
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 cursor-help">
                    <RotateCw className="h-3 w-3 mr-1" />
                    360° Rotation
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Drag to rotate and explore in any direction</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 cursor-help">
                    <ZoomIn className="h-3 w-3 mr-1" />
                    Zoom Support
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scroll to zoom in and out</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 cursor-help">
                    <MapPin className="h-3 w-3 mr-1" />
                    {currentPanorama.hotspots.length} Hotspots
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click colored spheres for information</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Panorama Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Navigation className="h-5 w-5 text-cyan-400" />
              Select Location
            </h3>
            <span className="text-sm text-gray-400">
              {currentPanoramaIndex + 1} of {panoramas.length}
            </span>
          </div>
          
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent>
              {panoramas.map((panorama, idx) => (
                <CarouselItem key={panorama.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      idx === currentPanoramaIndex 
                        ? 'bg-purple-500/20 border-purple-500' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50'
                    }`}
                    onClick={() => setCurrentPanoramaIndex(idx)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: panorama.fallbackColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{panorama.name}</p>
                          <p className="text-xs text-gray-400 truncate">{panorama.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <Separator className="bg-gray-800" />

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
          </div>
        </Card>

        {/* Stats & Actions */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-purple-400 font-semibold mb-1 text-sm">View Quality</p>
                <p className="text-white text-2xl font-bold">4K</p>
                <p className="text-gray-400 text-xs mt-1">Ultra HD Resolution</p>
              </div>
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-cyan-400 font-semibold mb-1 text-sm">Coverage</p>
                <p className="text-white text-2xl font-bold">360°</p>
                <p className="text-gray-400 text-xs mt-1">Full Panoramic View</p>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-semibold mb-1 text-sm">Hotspots</p>
                <p className="text-white text-2xl font-bold">{currentPanorama.hotspots.length}</p>
                <p className="text-gray-400 text-xs mt-1">Points of Interest</p>
              </div>
            </div>

            <Separator className="my-6 bg-gray-800" />

            <div className="flex gap-4">
              <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                <MapPin className="h-4 w-4 mr-2" />
                Book This Experience
              </Button>
              <Button variant="outline" className="flex-1 border-gray-700 hover:border-purple-500">
                <Eye className="h-4 w-4 mr-2" />
                View More Panoramas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
          <CardContent className="pt-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-purple-400" />
              How to Navigate
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Click & Drag</p>
                  <p className="text-gray-400 text-xs mt-1">Use your mouse to look around in any direction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Scroll to Zoom</p>
                  <p className="text-gray-400 text-xs mt-1">Get closer to details with mouse wheel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Click Hotspots</p>
                  <p className="text-gray-400 text-xs mt-1">Interact with colored spheres in 3D view or list below</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Browse Locations</p>
                  <p className="text-gray-400 text-xs mt-1">Use carousel above to explore different areas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotspot Dialog - Controlled */}
        {selectedHotspot !== null && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-gray-900 border-purple-500/50">
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
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-gray-300 mb-3">
                    🎯 You clicked on an interactive hotspot in the 360° panorama! This is a point of interest that provides additional information about this location.
                  </p>
                  <Separator className="my-3 bg-gray-700" />
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Hotspot Name:</span>
                      <span className="text-white font-semibold">{currentPanorama.hotspots[selectedHotspot].label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white font-semibold">{currentPanorama.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-gray-300 font-mono text-xs">
                        [{currentPanorama.hotspots[selectedHotspot].position.map(p => p.toFixed(1)).join(', ')}]
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Color Code:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600" 
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
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Learn More
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
