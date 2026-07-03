'use client';

/**
 * NFT Achievement Panel
 * View and mint tourism achievement badges
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Award, Trophy, Star, Lock, CheckCircle2, TrendingUp,
  Image as ImageIcon, Sparkles, Target, Gift
} from 'lucide-react';
import { 
  NFT_ACHIEVEMENTS, 
  TOURISM_BADGES,
  checkAchievementEarned,
  calculateAchievementPoints,
  getBadgeProgress,
  type NFTAchievement,
  type TourismBadge
} from '@/lib/phase2-nft-system';

interface Props {
  userRole: string;
}

export function NFTAchievementPanel({ userRole }: Props): JSX.Element {
  const [selectedAchievement, setSelectedAchievement] = useState<NFTAchievement | null>(null);
  
  // Mock user stats (in real implementation, fetch from backend)
  const userStats = {
    destinations: 12,
    photos: 78,
    culturalTours: 6,
    adventures: 4,
    connections: 15
  };

  const earnedAchievements = NFT_ACHIEVEMENTS.filter(achievement =>
    checkAchievementEarned(achievement.id, userStats)
  );

  const totalPoints = calculateAchievementPoints(earnedAchievements);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">Legendary</Badge>;
      case 'epic': return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Epic</Badge>;
      case 'rare': return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">Rare</Badge>;
      default: return <Badge variant="secondary">Common</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earnedAchievements.length} / {NFT_ACHIEVEMENTS.length}</div>
            <Progress value={(earnedAchievements.length / NFT_ACHIEVEMENTS.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Achievement Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600">{totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Earned points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Destinations Visited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{userStats.destinations}</div>
            <p className="text-xs text-muted-foreground mt-1">Virtual tours completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Photos Captured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{userStats.photos}</div>
            <p className="text-xs text-muted-foreground mt-1">Moments captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            NFT Achievements
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Trophy className="h-4 w-4" />
            Tourism Badges
          </TabsTrigger>
        </TabsList>

        {/* NFT Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NFT_ACHIEVEMENTS.map(achievement => {
              const isEarned = earnedAchievements.some(a => a.id === achievement.id);
              
              return (
                <Card 
                  key={achievement.id}
                  className={`overflow-hidden ${isEarned ? 'border-2 border-green-500' : 'opacity-75'}`}
                >
                  <div className={`h-32 bg-gradient-to-br ${getRarityColor(achievement.rarity)} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isEarned ? (
                        <CheckCircle2 className="h-16 w-16 text-white" />
                      ) : (
                        <Lock className="h-16 w-16 text-white opacity-50" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      {getRarityBadge(achievement.rarity)}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {achievement.name}
                      {isEarned && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">{achievement.type}</Badge>
                      <Badge variant="outline">Level {achievement.level}</Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant={isEarned ? 'default' : 'outline'} 
                          className="w-full"
                          size="sm"
                          onClick={() => setSelectedAchievement(achievement)}
                        >
                          {isEarned ? (
                            <>
                              <Award className="mr-2 h-4 w-4" />
                              View Details
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Locked
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {achievement.name}
                            {isEarned && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          </DialogTitle>
                          <DialogDescription>{achievement.description}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className={`h-48 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-lg flex items-center justify-center`}>
                            {isEarned ? (
                              <Award className="h-24 w-24 text-white" />
                            ) : (
                              <Lock className="h-24 w-24 text-white opacity-50" />
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Rarity:</span>
                              {getRarityBadge(achievement.rarity)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Type:</span>
                              <Badge variant="outline">{achievement.type}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Level:</span>
                              <Badge>{achievement.level}</Badge>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Attributes</h4>
                            <div className="space-y-1">
                              {achievement.attributes.map((attr, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{attr.trait_type}:</span>
                                  <span className="font-medium">{attr.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {isEarned && (
                            <Button className="w-full" size="lg">
                              <Sparkles className="mr-2 h-4 w-4" />
                              Mint NFT on Blockchain
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tourism Badges Tab */}
        <TabsContent value="badges" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOURISM_BADGES.map(badge => {
              const progress = getBadgeProgress(badge.id, userStats);
              const isCompleted = progress >= 100;

              return (
                <Card key={badge.id} className={isCompleted ? 'border-2 border-green-500' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div>
                          <CardTitle className="text-base">{badge.name}</CardTitle>
                          <CardDescription className="text-xs">{badge.category}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{badge.requirement}</span>
                      <Badge variant="secondary">+{badge.points} points</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
