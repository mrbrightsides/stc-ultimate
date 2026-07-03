'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Box, Environment } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Plus, 
  Eye,
  Upload,
  Save,
  Share2,
  DollarSign,
  MapPin,
  Star
} from 'lucide-react';
import type * as THREE from 'three';

interface ShowroomItem {
  id: string;
  name: string;
  price: string;
  position: [number, number, number];
  color: string;
}

// 3D Showroom Scene
function ShowroomScene({ items }: { items: ShowroomItem[] }): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -15]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Display Items */}
      {items.map((item, i) => (
        <group key={item.id} position={item.position}>
          {/* Pedestal */}
          <Box args={[1.5, 0.5, 1.5]} position={[0, -1.75, 0]}>
            <meshStandardMaterial color="#4a4a4a" />
          </Box>
          
          {/* Product */}
          <Box args={[1.2, 1.2, 1.2]} position={[0, -0.5, 0]}>
            <meshStandardMaterial 
              color={item.color} 
              emissive={item.color}
              emissiveIntensity={0.3}
            />
          </Box>

          {/* Label */}
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {item.name}
          </Text>

          {/* Price Tag */}
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {item.price}
          </Text>
        </group>
      ))}

      {/* Accent Lights */}
      {items.map((item, i) => (
        <pointLight
          key={`light-${item.id}`}
          position={[item.position[0], item.position[1] + 3, item.position[2]]}
          intensity={0.5}
          color={item.color}
        />
      ))}
    </group>
  );
}

const sampleShowrooms = [
  {
    id: 'hotel-sunset',
    name: 'Sunset Beach Hotel',
    description: 'Luxury beachfront accommodation',
    owner: 'SME Tourism Bali',
    rating: 4.8,
  },
  {
    id: 'tour-adventure',
    name: 'Mountain Adventure Tours',
    description: 'Hiking and trekking experiences',
    owner: 'SME Tourism Lombok',
    rating: 4.6,
  },
  {
    id: 'restaurant-seafood',
    name: 'Ocean Breeze Restaurant',
    description: 'Fresh seafood dining experience',
    owner: 'SME Tourism Raja Ampat',
    rating: 4.9,
  },
];

export default function VirtualShowroom(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [showroomItems, setShowroomItems] = useState<ShowroomItem[]>([
    { id: '1', name: 'Room 1', price: '0.05 ETH', position: [-5, 0, -5], color: '#06b6d4' },
    { id: '2', name: 'Room 2', price: '0.08 ETH', position: [0, 0, -5], color: '#8b5cf6' },
    { id: '3', name: 'Room 3', price: '0.1 ETH', position: [5, 0, -5], color: '#10b981' },
  ]);

  const [newShowroom, setNewShowroom] = useState({
    name: '',
    description: '',
    location: '',
  });

  const handleCreateShowroom = (): void => {
    // In real app, this would create showroom on blockchain
    alert(`Creating showroom: ${newShowroom.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="h-5 w-5 text-orange-400" />
            Virtual Showrooms
          </CardTitle>
          <CardDescription className="text-gray-400">
            Explore SME tourism offerings in immersive 3D spaces
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'browse' | 'create')}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="browse">
            <Eye className="h-4 w-4 mr-2" />
            Browse Showrooms
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Showroom
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Featured Showrooms */}
          <div className="grid md:grid-cols-3 gap-6">
            {sampleShowrooms.map((showroom) => (
              <Card key={showroom.id} className="bg-gray-900/50 border-gray-800 hover:border-orange-500 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                      Featured
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">{showroom.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{showroom.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">{showroom.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="h-4 w-4" />
                      {showroom.owner}
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Enter Showroom
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 3D Showroom Preview */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">3D Showroom Preview</CardTitle>
              <CardDescription className="text-gray-400">
                Interactive preview of products and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                <Canvas>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 5, 15]} />
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={8}
                      maxDistance={25}
                    />

                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
                    <spotLight
                      position={[0, 15, 0]}
                      angle={0.5}
                      penumbra={1}
                      intensity={1}
                      castShadow
                    />

                    {/* Environment */}
                    <Environment preset="warehouse" />

                    {/* Scene */}
                    <ShowroomScene items={showroomItems} />
                  </Suspense>
                </Canvas>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-400 font-semibold mb-1">Products</p>
                  <p className="text-gray-300 text-2xl font-bold">{showroomItems.length}</p>
                </div>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-cyan-400 font-semibold mb-1">Visitors Today</p>
                  <p className="text-gray-300 text-2xl font-bold">127</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold mb-1">Sales</p>
                  <p className="text-gray-300 text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Create Your Virtual Showroom</CardTitle>
              <CardDescription className="text-gray-400">
                Set up your 3D space to showcase tourism offerings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Showroom Name</Label>
                <Input
                  value={newShowroom.name}
                  onChange={(e) => setNewShowroom({ ...newShowroom, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Bali Paradise Hotel Showcase"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={newShowroom.description}
                  onChange={(e) => setNewShowroom({ ...newShowroom, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  placeholder="Describe your tourism business and offerings..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Location</Label>
                <Input
                  value={newShowroom.location}
                  onChange={(e) => setNewShowroom({ ...newShowroom, location: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Bali, Indonesia"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Upload 3D Assets</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Click to upload 3D models, images, or videos</p>
                  <p className="text-gray-500 text-sm">Supports GLB, GLTF, JPG, PNG, MP4 (Max 50MB)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div>
                  <p className="text-orange-400 font-semibold mb-2">Setup Cost</p>
                  <p className="text-white text-2xl font-bold">0.1 ETH</p>
                </div>
                <div>
                  <p className="text-orange-400 font-semibold mb-2">Monthly Fee</p>
                  <p className="text-white text-2xl font-bold">0.01 ETH</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={handleCreateShowroom}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Showroom
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Info */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-cyan-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white">Showroom Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">3D Product Display</p>
                    <p className="text-gray-400 text-xs mt-1">Showcase your offerings in immersive 3D</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Real-time Analytics</p>
                    <p className="text-gray-400 text-xs mt-1">Track visitor engagement and conversions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Blockchain Payments</p>
                    <p className="text-gray-400 text-xs mt-1">Secure crypto transactions built-in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Social Integration</p>
                    <p className="text-gray-400 text-xs mt-1">Share and collaborate with tourists</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
