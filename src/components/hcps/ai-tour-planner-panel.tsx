'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { TourPreferences, GeneratedItinerary } from '@/lib/phase3-ai-tour-planner';
import { aiTourPlanner } from '@/lib/phase3-ai-tour-planner';

export function AITourPlannerPanel() {
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [preferences, setPreferences] = useState<Partial<TourPreferences>>({
    destinations: ['Yogyakarta'],
    duration: 3,
    budget: { min: 5000000, max: 10000000, currency: 'IDR' },
    interests: ['cultural', 'nature'],
    travelStyle: 'moderate',
    groupSize: 2,
    accommodation: 'mid-range',
    transportation: 'mixed'
  });

  const stats = aiTourPlanner.getStats();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const generated = await aiTourPlanner.generateItinerary(preferences as TourPreferences);
      setItinerary(generated);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Itineraries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItinerariesGenerated.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Confidence Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.averageConfidenceScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Trip Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTripDuration} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>User Satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{stats.userSatisfactionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Planner Form & Results */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Input Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Trip Preferences
            </CardTitle>
            <CardDescription>Configure your ideal travel experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select 
                value={preferences.destinations?.[0]} 
                onValueChange={(v) => setPreferences({...preferences, destinations: [v]})}
              >
                <SelectTrigger id="destination">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
                  <SelectItem value="Bali">Bali</SelectItem>
                  <SelectItem value="Raja Ampat">Raja Ampat</SelectItem>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Lombok">Lombok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input 
                id="duration"
                type="number" 
                value={preferences.duration} 
                onChange={(e) => setPreferences({...preferences, duration: parseInt(e.target.value)})}
                min={1}
                max={30}
              />
            </div>

            <div className="space-y-2">
              <Label>Budget Range (IDR)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Min" 
                  type="number"
                  value={preferences.budget?.min}
                  onChange={(e) => setPreferences({
                    ...preferences, 
                    budget: {...preferences.budget!, min: parseInt(e.target.value)}
                  })}
                />
                <Input 
                  placeholder="Max" 
                  type="number"
                  value={preferences.budget?.max}
                  onChange={(e) => setPreferences({
                    ...preferences, 
                    budget: {...preferences.budget!, max: parseInt(e.target.value)}
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelStyle">Travel Style</Label>
              <Select 
                value={preferences.travelStyle} 
                onValueChange={(v) => setPreferences({...preferences, travelStyle: v as any})}
              >
                <SelectTrigger id="travelStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input 
                id="groupSize"
                type="number" 
                value={preferences.groupSize} 
                onChange={(e) => setPreferences({...preferences, groupSize: parseInt(e.target.value)})}
                min={1}
                max={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodation">Accommodation</Label>
              <Select 
                value={preferences.accommodation} 
                onValueChange={(v) => setPreferences({...preferences, accommodation: v as any})}
              >
                <SelectTrigger id="accommodation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Itinerary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Itinerary */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              {itinerary ? itinerary.title : 'Generated Itinerary'}
            </CardTitle>
            {itinerary && (
              <CardDescription>
                AI Confidence: {itinerary.aiConfidenceScore.toFixed(1)}% • 
                Total Cost: {itinerary.totalCost.toLocaleString()} IDR • 
                {itinerary.days.length} Days
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!itinerary && !generating && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Brain className="w-12 h-12 mb-4 opacity-20" />
                <p>Configure your preferences and click Generate to create your personalized itinerary</p>
              </div>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-cyan-400" />
                <p className="text-muted-foreground">AI is analyzing {preferences.destinations?.[0]} and creating your perfect itinerary...</p>
              </div>
            )}

            {itinerary && (
              <Tabs defaultValue="itinerary" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="itinerary">Daily Plan</TabsTrigger>
                  <TabsTrigger value="metrics">Optimization</TabsTrigger>
                  <TabsTrigger value="tips">Travel Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary" className="space-y-4">
                  {itinerary.days.map((day) => (
                    <Card key={day.day}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Day {day.day} - {day.date}
                          </CardTitle>
                          <Badge variant="outline">
                            {day.energyLevel}
                          </Badge>
                        </div>
                        <CardDescription>
                          {day.estimatedCost.toLocaleString()} IDR • {day.activities.length} activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {day.activities.map((activity) => (
                          <div key={activity.id} className="p-3 border border-muted rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{activity.name}</h4>
                                <p className="text-sm text-muted-foreground">{activity.location}</p>
                              </div>
                              <Badge variant="secondary">{activity.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.startTime} - {activity.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {activity.cost.toLocaleString()} IDR
                              </span>
                            </div>
                            <p className="text-sm mt-2 text-cyan-400 italic">
                              💡 {activity.aiReason}
                            </p>
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {day.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Optimization Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(itinerary.optimizationMetrics).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-sm font-semibold">{value.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tips">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">AI Travel Tips & Considerations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          Weather Considerations
                        </h4>
                        <ul className="space-y-1">
                          {itinerary.weatherConsiderations.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          Travel Tips
                        </h4>
                        <ul className="space-y-1">
                          {itinerary.travelTips.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Most Popular Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {stats.mostPopularDestinations.map((dest) => (
              <div key={dest.name} className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{dest.count.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{dest.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
