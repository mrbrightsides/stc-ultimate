'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Box, Sphere, useTexture } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Info, Bookmark, Share2 } from 'lucide-react';
import type * as THREE from 'three';

interface VirtualTourViewerProps {
  destination: string;
  onDestinationChange: (destination: string) => void;
}

// Animated 3D Scene Component
function Scene({ destination }: { destination: string }): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Central monument/building representation */}
      <Box args={[2, 4, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" />
      </Box>

      {/* Surrounding elements */}
      <Sphere args={[0.5, 32, 32]} position={[-3, 1, -2]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </Sphere>

      <Sphere args={[0.5, 32, 32]} position={[3, 1, -2]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </Sphere>

      <Sphere args={[0.5, 32, 32]} position={[-3, 1, 2]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </Sphere>

      <Sphere args={[0.5, 32, 32]} position={[3, 1, 2]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </Sphere>

      {/* Floating text */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {destination.toUpperCase()}
      </Text>

      {/* Info markers */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <group key={i} position={[x, 0.5, -5]}>
          <Box args={[0.3, 1, 0.3]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </Box>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            POI {i + 1}
          </Text>
        </group>
      ))}
    </group>
  );
}

const destinations = [
  { id: 'bali', name: 'Bali', description: 'Island of Gods - Beaches, Temples, Culture' },
  { id: 'yogyakarta', name: 'Yogyakarta', description: 'Borobudur & Prambanan Temples' },
  { id: 'raja-ampat', name: 'Raja Ampat', description: 'World-class Diving Paradise' },
  { id: 'lombok', name: 'Lombok', description: 'Mt. Rinjani & Pristine Beaches' },
  { id: 'komodo', name: 'Komodo Island', description: 'Home of Komodo Dragons' },
];

export default function VirtualTourViewer({ destination, onDestinationChange }: VirtualTourViewerProps): JSX.Element {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const currentDestination = destinations.find((d) => d.id === destination) || destinations[0];

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: `Virtual Tour: ${currentDestination.name}`,
        text: currentDestination.description,
        url: window.location.href,
      }).catch(() => {
        // User cancelled share or error occurred
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-400" />
              Select Destination
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={destination} onValueChange={onDestinationChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id} className="text-white">
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-cyan-400 mb-1">{currentDestination.name}</h4>
                <p className="text-gray-300 text-sm">{currentDestination.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
              Interactive 3D
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              Click & Drag to Explore
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
              Scroll to Zoom
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3D Canvas */}
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
        <div className="h-[600px] bg-gradient-to-br from-gray-900 to-black">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 5, 10]} />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={20}
              />
              
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
              
              {/* Environment */}
              <Environment preset="night" />
              
              {/* Scene */}
              <Scene destination={currentDestination.name} />
            </Suspense>
          </Canvas>
        </div>
      </Card>

      {/* Tour Info */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Tour Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-cyan-400 font-semibold mb-1">Points of Interest</p>
              <p className="text-gray-300 text-2xl font-bold">5+</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-purple-400 font-semibold mb-1">Virtual Views</p>
              <p className="text-gray-300 text-2xl font-bold">20+</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-1">Tour Duration</p>
              <p className="text-gray-300 text-2xl font-bold">~10 min</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600">
              Book This Destination
            </Button>
            <Button variant="outline" className="flex-1">
              View 360° Panorama
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
