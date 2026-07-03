'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Globe, 
  User, 
  Store,
  ArrowLeft,
  Eye,
  Users,
  MapPin,
  Loader2
} from 'lucide-react';
import AvatarSystem from './avatar-system';

// Dynamic imports for Three.js components (client-side only)
const VirtualTourViewer = dynamic(() => import('./virtual-tour-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-900/50 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading 3D Tour...</p>
      </div>
    </div>
  ),
});

const PanoramaViewer = dynamic(() => import('./phase3-panorama-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-900/50 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Phase 3: Enhanced 360° Panorama...</p>
      </div>
    </div>
  ),
});

const UltimatePanoramaViewer = dynamic(() => import('./ultimate-panorama-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center space-y-4">
        <Sparkles className="h-12 w-12 text-purple-400 animate-pulse mx-auto" />
        <h3 className="text-xl font-bold text-white">Loading Ultimate Immersive Experience</h3>
        <p className="text-gray-400">Weather • Ambient Sound • Particles • Photo Mode • Achievements • VR</p>
        <Loader2 className="h-6 w-6 text-cyan-400 animate-spin mx-auto" />
      </div>
    </div>
  ),
});

const VirtualShowroom = dynamic(() => import('./virtual-showroom'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-900/50 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-orange-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading Virtual Showroom...</p>
      </div>
    </div>
  ),
});

interface MetaverseHubProps {
  onBack: () => void;
}

type MetaverseMode = 'overview' | 'tour' | 'panorama' | 'ultimate' | 'avatar' | 'showroom';

export default function MetaverseHub({ onBack }: MetaverseHubProps): JSX.Element {
  const [mode, setMode] = useState<MetaverseMode>('overview');
  const [selectedDestination, setSelectedDestination] = useState<string>('bali');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Virtual Tourism Experience
            </h1>
            <p className="text-gray-400 mt-1">Explore destinations in immersive 3D & 360° views</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
          <Sparkles className="h-4 w-4 mr-2" />
          Web 3.0 Metaverse
        </Badge>
      </div>

      {mode === 'overview' ? (
        <div className="space-y-6">
          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="cursor-pointer hover:border-cyan-500 transition-colors bg-gray-900/50 border-gray-800"
              onClick={() => setMode('tour')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">3D Virtual Tours</CardTitle>
                <CardDescription className="text-gray-400">
                  Explore destinations in immersive 3D environments before booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                  Interactive
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-purple-500 transition-colors bg-gray-900/50 border-gray-800"
              onClick={() => setMode('panorama')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">360° Panoramic Views</CardTitle>
                <CardDescription className="text-gray-400">
                  Full 360° immersive views of hotels, restaurants, and tourist spots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  360° View
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-yellow-500 transition-colors bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-yellow-500/50 relative overflow-hidden"
              onClick={() => setMode('ultimate')}
            >
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-yellow-500 text-black font-bold animate-pulse">
                  NEW!
                </Badge>
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white flex items-center gap-2">
                  Ultimate Immersion
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Experience EVERYTHING: Dynamic weather, ambient sounds, particle effects, photo mode, achievements, VR & multi-language support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-xs">
                    Weather
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                    Audio
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50 text-xs">
                    Particles
                  </Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50 text-xs">
                    Photo
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-xs">
                    Achievements
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                    VR
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-green-500 transition-colors bg-gray-900/50 border-gray-800"
              onClick={() => setMode('avatar')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Avatar System</CardTitle>
                <CardDescription className="text-gray-400">
                  Create your virtual identity and explore with other travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  Social
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-orange-500 transition-colors bg-gray-900/50 border-gray-800"
              onClick={() => setMode('showroom')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Virtual Showrooms</CardTitle>
                <CardDescription className="text-gray-400">
                  SME tourism providers showcase their offerings in 3D spaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                  Business
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-cyan-400">50+</p>
                  <p className="text-gray-400 text-sm mt-1">Virtual Destinations</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">1000+</p>
                  <p className="text-gray-400 text-sm mt-1">360° Panoramas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">5K+</p>
                  <p className="text-gray-400 text-sm mt-1">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400">200+</p>
                  <p className="text-gray-400 text-sm mt-1">SME Showrooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">How Virtual Tourism Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Explore in 3D</h4>
                  <p className="text-gray-400 text-sm">
                    Navigate through virtual destinations using your mouse or touch controls. Experience the place before you book.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">View 360° Panoramas</h4>
                  <p className="text-gray-400 text-sm">
                    Get immersive 360° views of hotel rooms, restaurants, and tourist attractions. See every detail.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Create Your Avatar</h4>
                  <p className="text-gray-400 text-sm">
                    Customize your virtual identity and interact with other travelers in the metaverse.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Book with Confidence</h4>
                  <p className="text-gray-400 text-sm">
                    After exploring virtually, book your trip with complete confidence using blockchain-secured smart contracts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setMode('overview')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>

          {mode === 'tour' && (
            <VirtualTourViewer 
              destination={selectedDestination}
              onDestinationChange={setSelectedDestination}
            />
          )}

          {mode === 'panorama' && (
            <div className="space-y-4">
              {/* Destination Selector */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    Select Destination
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {['bali', 'yogyakarta', 'lombok', 'jakarta'].map((dest) => (
                      <Button
                        key={dest}
                        variant={selectedDestination === dest ? 'default' : 'outline'}
                        onClick={() => setSelectedDestination(dest)}
                        className={selectedDestination === dest ? 'bg-purple-500 hover:bg-purple-600' : ''}
                      >
                        {dest.charAt(0).toUpperCase() + dest.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <PanoramaViewer destination={selectedDestination} />
            </div>
          )}

          {mode === 'ultimate' && (
            <div>
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <h3 className="text-white font-bold">Ultimate Immersive Experience</h3>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  You're about to experience the FULL power of STC Ultimate's immersive tourism platform with ALL features enabled!
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-cyan-300">✨ Dynamic Weather System</span>
                  <span className="text-green-300">🔊 Ambient Soundscapes</span>
                  <span className="text-orange-300">✨ Particle Effects</span>
                  <span className="text-pink-300">📸 Photo Mode</span>
                  <span className="text-yellow-300">🏆 Achievement System</span>
                  <span className="text-purple-300">🥽 VR Support</span>
                  <span className="text-blue-300">🌍 Multi-Language (EN/ID)</span>
                </div>
              </div>

              {/* Destination Selector */}
              <Card className="bg-gray-900/50 border-yellow-500/30 mb-4">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-400" />
                    Select Destination for Ultimate Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {['bali', 'yogyakarta', 'lombok', 'jakarta'].map((dest) => (
                      <Button
                        key={dest}
                        variant={selectedDestination === dest ? 'default' : 'outline'}
                        onClick={() => setSelectedDestination(dest)}
                        className={selectedDestination === dest ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : 'border-yellow-500/30'}
                      >
                        {dest.charAt(0).toUpperCase() + dest.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <UltimatePanoramaViewer destination={selectedDestination} />
            </div>
          )}

          {mode === 'avatar' && (
            <AvatarSystem />
          )}

          {mode === 'showroom' && (
            <VirtualShowroom />
          )}
        </div>
      )}
    </div>
  );
}
