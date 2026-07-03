'use client';

/**
 * Metaverse 3D Destination Viewer
 * Browse and explore virtual tourism destinations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Globe, MapPin, Users, Star, Image, Info, ShoppingBag,
  Trophy, Activity, Search, Filter, Eye
} from 'lucide-react';
import { 
  METAVERSE_DESTINATIONS, 
  createAvatar,
  startMetaverseSession,
  type Destination3D 
} from '@/lib/phase2-metaverse-expanded';

interface Props {
  userRole: string;
}

export function Metaverse3DViewer({ userRole }: Props): JSX.Element {
  const [selectedDestination, setSelectedDestination] = useState<Destination3D | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isExploring, setIsExploring] = useState<boolean>(false);

  const filteredDestinations = METAVERSE_DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || dest.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExplore = (destination: Destination3D) => {
    setSelectedDestination(destination);
    setIsExploring(true);
    
    // Simulate starting a metaverse session
    const session = startMetaverseSession('user-123', 'avatar-456', destination.id);
    console.log('Started metaverse session:', session);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Expanded Metaverse Hub
          </CardTitle>
          <CardDescription>
            Explore 3D virtual tourism destinations with interactive experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'cultural', 'nature', 'adventure', 'beach'].map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map(destination => (
          <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="h-24 w-24 text-white opacity-50" />
              </div>
              <Badge className="absolute top-4 right-4" variant="secondary">
                {destination.category}
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{destination.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {destination.location}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {destination.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{destination.visitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{destination.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {destination.features.slice(0, 3).map(feature => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{destination.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {destination.location}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Destination Details */}
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{destination.description}</p>
                    </div>

                    {/* Real-time Data */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Real-Time Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Temperature:</span>
                            <p className="font-semibold">{destination.realTimeData.temperature}°C</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Crowd Density:</span>
                            <p className="font-semibold">{destination.realTimeData.crowdDensity}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weather:</span>
                            <p className="font-semibold">{destination.realTimeData.weather}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Visibility:</span>
                            <p className="font-semibold">{destination.realTimeData.visibility}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interaction Points */}
                    <div>
                      <h4 className="font-semibold mb-3">Interaction Points ({destination.interactionPoints.length})</h4>
                      <div className="space-y-2">
                        {destination.interactionPoints.map(point => (
                          <Card key={point.id} className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {point.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                                {point.type === 'shop' && <ShoppingBag className="h-4 w-4 text-green-600" />}
                                {point.type === 'photo' && <Image className="h-4 w-4 text-purple-600" />}
                                {point.type === 'activity' && <Activity className="h-4 w-4 text-orange-600" />}
                                {point.type === 'quest' && <Trophy className="h-4 w-4 text-yellow-600" />}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{point.title}</h5>
                                <p className="text-xs text-muted-foreground">{point.description}</p>
                                {point.reward && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    Reward: +{point.reward.value} {point.reward.type}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {destination.features.map(feature => (
                          <Badge key={feature} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleExplore(destination)}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Enter Metaverse
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No destinations found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
