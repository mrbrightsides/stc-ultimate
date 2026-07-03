'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Sparkles, MapPin, Calendar, DollarSign, Users, TrendingUp, Clock, Coffee, Utensils, Hotel, Camera, Info, Zap } from 'lucide-react';
import { getTourPlannerSystem, generateItinerary, type TripPreferences, type GeneratedItinerary } from '@/lib/ai-trip-planner-hub';

interface AITripPlannerHubProps {
  onBack: () => void;
}

export default function AITripPlannerHub({ onBack }: AITripPlannerHubProps) {
  const plannerSystem = getTourPlannerSystem();
  const [preferences, setPreferences] = useState<TourPreferences>({
    destinations: ['Borobudur'],
    duration: 3,
    budget: 5000000,
    travelStyle: 'balanced',
    groupSize: 2,
    interests: ['culture', 'nature']
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = (): void => {
    setIsGenerating(true);
    setTimeout(() => {
      const itinerary = generateItinerary(preferences);
      setGeneratedItinerary(itinerary);
      setIsGenerating(false);
    }, 1500);
  };

  const getStyleColor = (style: string): string => {
    const colors: Record<string, string> = {
      adventure: 'text-orange-400',
      cultural: 'text-purple-400',
      relaxation: 'text-blue-400',
      luxury: 'text-yellow-400',
      budget: 'text-green-400',
      balanced: 'text-cyan-400'
    };
    return colors[style] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Trip Planner
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        HCPS 5.0
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border-purple-500/50 max-w-xs">
                      <p className="text-sm text-gray-300">
                        Powered by <strong className="text-purple-400">HCPS-Tourism 5.0</strong> framework.
                        This AI system integrates with blockchain, IoT, and real-time collaboration.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-400 mt-2">Intelligent tour planning powered by machine learning</p>
            </div>
          </div>
        </div>

        {/* Contextual Link */}
        <Alert className="bg-cyan-500/10 border-cyan-500/30">
          <Info className="h-4 w-4 text-cyan-400" />
          <AlertDescription className="text-gray-300">
            <strong className="text-cyan-300">Use in your journey:</strong> Generate an itinerary here, then build your tour package in Journey Dashboard for blockchain-verified booking.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Itineraries Generated</p>
                  <p className="text-3xl font-bold text-cyan-400">{plannerSystem.totalItineraries.toLocaleString()}</p>
                </div>
                <Sparkles className="h-10 w-10 text-cyan-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">AI Accuracy</p>
                  <p className="text-3xl font-bold text-green-400">{plannerSystem.aiAccuracy}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Duration</p>
                  <p className="text-3xl font-bold text-purple-400">{plannerSystem.averageDuration} days</p>
                </div>
                <Calendar className="h-10 w-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">User Satisfaction</p>
                  <p className="text-3xl font-bold text-orange-400">{plannerSystem.userSatisfaction}%</p>
                </div>
                <Users className="h-10 w-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preferences Form */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Trip Preferences
                </CardTitle>
                <CardDescription>Customize your perfect itinerary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Destinations */}
                <div className="space-y-2">
                  <Label htmlFor="destinations" className="text-white">Destination</Label>
                  <Select 
                    value={preferences.destinations[0]} 
                    onValueChange={(value) => setPreferences({...preferences, destinations: [value]})}
                  >
                    <SelectTrigger id="destinations">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Borobudur">Borobudur, Java</SelectItem>
                      <SelectItem value="Bali">Bali</SelectItem>
                      <SelectItem value="Raja Ampat">Raja Ampat</SelectItem>
                      <SelectItem value="Komodo">Komodo Island</SelectItem>
                      <SelectItem value="Jakarta">Jakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-white">Duration: {preferences.duration} days</Label>
                  <Slider
                    value={[preferences.duration]}
                    onValueChange={([value]) => setPreferences({...preferences, duration: value})}
                    min={1}
                    max={14}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-white">Budget (IDR)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({...preferences, budget: parseInt(e.target.value)})}
                    className="bg-gray-800"
                  />
                </div>

                {/* Travel Style */}
                <div className="space-y-2">
                  <Label htmlFor="travel-style" className="text-white">Travel Style</Label>
                  <Select 
                    value={preferences.travelStyle} 
                    onValueChange={(value) => setPreferences({...preferences, travelStyle: value as TripPreferences['travelStyle']})}
                  >
                    <SelectTrigger id="travel-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="relaxation">Relaxation</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Group Size */}
                <div className="space-y-2">
                  <Label className="text-white">Group Size: {preferences.groupSize} people</Label>
                  <Slider
                    value={[preferences.groupSize]}
                    onValueChange={([value]) => setPreferences({...preferences, groupSize: value})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Itinerary */}
          <div className="lg:col-span-2">
            {generatedItinerary ? (
              <div className="space-y-6">
                {/* Itinerary Header */}
                <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl">{generatedItinerary.title}</CardTitle>
                        <CardDescription>{generatedItinerary.description}</CardDescription>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                            <Calendar className="h-3 w-3 mr-1" />
                            {generatedItinerary.days.length} days
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {(generatedItinerary.totalCost / 1000000).toFixed(1)}M IDR
                          </Badge>
                          <Badge className={`bg-purple-500/20 border-purple-500/50 ${getStyleColor(preferences.travelStyle)}`}>
                            {preferences.travelStyle}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Optimization Metrics */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Optimization Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Time Efficiency</p>
                        <p className="text-2xl font-bold text-cyan-400">{generatedItinerary.optimization.timeEfficiency}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Cost Optimization</p>
                        <p className="text-2xl font-bold text-green-400">{generatedItinerary.optimization.costOptimization}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Interest Match</p>
                        <p className="text-2xl font-bold text-purple-400">{generatedItinerary.optimization.interestMatch}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Day by Day Itinerary */}
                <div className="space-y-4">
                  {generatedItinerary.days.map((day, index) => (
                    <Card key={day.day} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                            {day.day}
                          </span>
                          Day {day.day}: {day.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Activities */}
                        <div className="space-y-3">
                          {day.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                              <div className="flex flex-col items-center">
                                <Clock className="h-5 w-5 text-cyan-400" />
                                <span className="text-xs text-gray-400 mt-1">{activity.time}</span>
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-white">{activity.name}</h4>
                                    <p className="text-sm text-gray-400">{activity.description}</p>
                                  </div>
                                  <Badge className="bg-blue-500/20 text-blue-300">
                                    {activity.duration}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm text-purple-300">{activity.location}</span>
                                  <span className="text-gray-600">•</span>
                                  <DollarSign className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-green-300">{activity.cost.toLocaleString()} IDR</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Meals */}
                        {day.meals && (
                          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Utensils className="h-5 w-5 text-orange-400" />
                              <h4 className="font-semibold text-white">Recommended Meals</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-gray-400">Breakfast</p>
                                <p className="text-sm text-orange-300">{day.meals.breakfast}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Lunch</p>
                                <p className="text-sm text-orange-300">{day.meals.lunch}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Dinner</p>
                                <p className="text-sm text-orange-300">{day.meals.dinner}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Accommodation */}
                        {day.accommodation && (
                          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Hotel className="h-5 w-5 text-blue-400" />
                                <div>
                                  <h4 className="font-semibold text-white">{day.accommodation.name}</h4>
                                  <p className="text-sm text-gray-400">{day.accommodation.type}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-blue-300">{day.accommodation.cost.toLocaleString()} IDR</p>
                                <p className="text-xs text-gray-400">per night</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* AI Reasoning */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-400" />
                      AI Reasoning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{generatedItinerary.aiReasoning}</p>
                  </CardContent>
                </Card>

                {/* Travel Tips */}
                {generatedItinerary.travelTips && generatedItinerary.travelTips.length > 0 && (
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-cyan-400" />
                        Travel Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedItinerary.travelTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            <span className="text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="py-20">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Ready to Plan Your Trip?</h3>
                      <p className="text-gray-400">
                        Configure your preferences and let our AI create the perfect itinerary for you
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
