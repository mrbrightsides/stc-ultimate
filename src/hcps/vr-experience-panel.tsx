'use client';

/**
 * VR Experience Panel
 * Browse and launch immersive VR tourism experiences
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Glasses, Play, Star, Clock, Users, Zap, AlertCircle,
  CheckCircle2, Info, Activity, TrendingUp, Award
} from 'lucide-react';
import { 
  VR_EXPERIENCES,
  startVRSession,
  calculateVRStats,
  checkVRRequirements,
  type VRExperience,
  type VRSession
} from '@/lib/phase2-vr-integration';

interface Props {
  userRole: string;
}

export function VRExperiencePanel({ userRole }: Props): JSX.Element {
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredExperiences = VR_EXPERIENCES.filter(exp => {
    const matchesType = filterType === 'all' || exp.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || exp.difficulty === filterDifficulty;
    return matchesType && matchesDifficulty;
  });

  const handleStartVR = (experience: VRExperience) => {
    const requirements = checkVRRequirements(experience.id);
    
    if (!requirements.supported) {
      alert(`Cannot start VR: ${requirements.missing.join(', ')}`);
      return;
    }

    const session = startVRSession('user-123', experience.id, 'high');
    setActiveSession(session);
    alert(`VR Experience "${experience.name}" started!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMotionSicknessColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Alert */}
      {activeSession && (
        <Alert className="border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20">
          <Activity className="h-4 w-4 text-indigo-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>VR Session Active</span>
              <Button size="sm" variant="outline" onClick={() => setActiveSession(null)}>
                End Session
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Glasses className="h-5 w-5 text-indigo-600" />
            Enhanced VR Experiences
          </CardTitle>
          <CardDescription>Immersive virtual reality tourism destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All Types
            </Button>
            {['tour', 'activity', 'educational', 'entertainment'].map(type => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
            <div className="w-px bg-border mx-2" />
            {['easy', 'medium', 'hard'].map(difficulty => (
              <Button
                key={difficulty}
                variant={filterDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VR Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperiences.map(experience => {
          const requirements = checkVRRequirements(experience.id);
          
          return (
            <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-400 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Glasses className="h-20 w-20 text-white opacity-50" />
                </div>
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {experience.type}
                </Badge>
                <Badge className={`absolute top-4 left-4 ${getDifficultyColor(experience.difficulty)}`}>
                  {experience.difficulty}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{experience.name}</CardTitle>
                <CardDescription>{experience.destination}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {experience.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{experience.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{experience.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{experience.reviews}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {experience.features.slice(0, 3).map(feature => (
                    <Badge key={feature.id} variant="outline" className="text-xs">
                      {feature.icon} {feature.name}
                    </Badge>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedExperience(experience)}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{experience.name}</DialogTitle>
                      <DialogDescription>{experience.destination}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Hero */}
                      <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <Glasses className="h-32 w-32 text-white opacity-50" />
                      </div>

                      {/* Details */}
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{experience.description}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Duration</span>
                          <p className="font-semibold">{experience.duration} minutes</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Rating</span>
                          <p className="font-semibold flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {experience.rating}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Reviews</span>
                          <p className="font-semibold">{experience.reviews.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold mb-3">VR Features</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {experience.features.map(feature => (
                            <Card key={feature.id} className="p-3">
                              <div className="flex items-start gap-2">
                                <span className="text-xl">{feature.icon}</span>
                                <div>
                                  <h5 className="font-medium text-sm">{feature.name}</h5>
                                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Accessibility */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Accessibility Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Motion Sickness Risk:</span>
                            <Badge className={getMotionSicknessColor(experience.accessibility.motionSickness)}>
                              {experience.accessibility.motionSickness}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Age Rating:</span>
                            <Badge variant="outline">{experience.accessibility.ageRating}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Physical Requirement:</span>
                            <Badge variant="outline">{experience.accessibility.physicalRequirement}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Requirements */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">System Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!requirements.supported && requirements.missing.length > 0 && (
                            <Alert className="mb-3">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Missing: {requirements.missing.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            {experience.requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                          {requirements.recommendations.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {requirements.recommendations.map((rec, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <Info className="h-3 w-3 mt-0.5" />
                                  {rec}
                                </p>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => handleStartVR(experience)}
                        disabled={!requirements.supported}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {requirements.supported ? 'Start VR Experience' : 'System Requirements Not Met'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExperiences.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Glasses className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No VR experiences found matching your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
