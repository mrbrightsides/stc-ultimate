'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Star, Award, Camera, MapPin, TrendingUp, Sparkles, Medal, Gift, Zap, Info } from 'lucide-react';
import { 
  getNFTSystem,
  getAchievements,
  getBadges,
  mintNFT,
  type NFTAchievement,
  type TourismBadge
} from '@/lib/phase2-nft-system';

interface NFTGalleryHubProps {
  onBack: () => void;
}

export default function NFTGalleryHub({ onBack }: NFTGalleryHubProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const nftSystem = getNFTSystem();
  const achievements = getAchievements();
  const badges = getBadges();

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleMint = (achievementId: string): void => {
    mintNFT(achievementId);
    // In a real app, this would trigger a blockchain transaction
  };

  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'from-gray-500 to-gray-600',
      rare: 'from-blue-500 to-cyan-500',
      epic: 'from-purple-500 to-pink-500',
      legendary: 'from-yellow-500 to-orange-500'
    };
    return colors[rarity] || 'from-gray-500 to-gray-600';
  };

  const getRarityBadgeColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
      rare: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      epic: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      legendary: 'bg-orange-500/20 text-orange-300 border-orange-500/50'
    };
    return colors[rarity] || 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  };

  const getBadgeProgressColor = (progress: number): string => {
    if (progress >= 100) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-gray-400';
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  NFT Gallery
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
                        NFT achievements are blockchain-verified and integrate with your journey milestones.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-400 mt-2">Tourism achievements, badges & collectibles</p>
            </div>
          </div>
        </div>

        {/* Contextual Link */}
        <Alert className="bg-orange-500/10 border-orange-500/30">
          <Info className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-gray-300">
            <strong className="text-orange-300">Linked to your journey:</strong> NFT achievements are automatically earned as you complete tour milestones in Journey Dashboard.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total NFTs Minted</p>
                  <p className="text-3xl font-bold text-yellow-400">{nftSystem.totalMinted.toLocaleString()}</p>
                </div>
                <Trophy className="h-10 w-10 text-yellow-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Achievements Earned</p>
                  <p className="text-3xl font-bold text-orange-400">{nftSystem.achievementsEarned}</p>
                </div>
                <Award className="h-10 w-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Achievement Points</p>
                  <p className="text-3xl font-bold text-purple-400">{nftSystem.achievementPoints.toLocaleString()}</p>
                </div>
                <Star className="h-10 w-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-pink-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Destinations Visited</p>
                  <p className="text-3xl font-bold text-pink-400">{nftSystem.destinationsVisited}</p>
                </div>
                <MapPin className="h-10 w-10 text-pink-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <Input
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800"
              />
              <div className="flex gap-2">
                <Button
                  variant={selectedRarity === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedRarity === 'rare' ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity('rare')}
                >
                  Rare
                </Button>
                <Button
                  variant={selectedRarity === 'epic' ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity('epic')}
                >
                  Epic
                </Button>
                <Button
                  variant={selectedRarity === 'legendary' ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity('legendary')}
                >
                  Legendary
                </Button>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)}/10 border-gray-800 hover:scale-105 transition-transform`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-400" />
                          {achievement.name}
                        </CardTitle>
                        <Badge className={getRarityBadgeColor(achievement.rarity)}>
                          <Star className="h-3 w-3 mr-1" />
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </Badge>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-500/20 text-green-300">
                          ✓ Earned
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                    
                    {/* Requirements */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 font-semibold">Requirements:</p>
                      <div className="space-y-1">
                        {achievement.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 rounded-full bg-cyan-400" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="p-3 bg-gray-800/50 rounded-lg space-y-2">
                      <p className="text-xs text-gray-400 font-semibold">Rewards:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-300">Achievement Points</span>
                        <span className="font-bold text-purple-400">+{achievement.rewardPoints}</span>
                      </div>
                      {achievement.rewardTokens && achievement.rewardTokens > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-300">STC Tokens</span>
                          <span className="font-bold text-green-400">+{achievement.rewardTokens}</span>
                        </div>
                      )}
                      {achievement.rewardBadge && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-orange-300">Badge Unlock</span>
                          <span className="font-bold text-orange-400">{achievement.rewardBadge}</span>
                        </div>
                      )}
                    </div>

                    {/* Mint Button */}
                    {achievement.earned && !achievement.minted && (
                      <Button
                        onClick={() => handleMint(achievement.id)}
                        className={`w-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Mint NFT
                      </Button>
                    )}
                    {achievement.minted && (
                      <Button variant="outline" disabled className="w-full">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        NFT Minted
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <Medal className="h-5 w-5 text-orange-400" />
                          {badge.name}
                        </CardTitle>
                        <CardDescription>{badge.description}</CardDescription>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/20 text-blue-300">
                            Level {badge.currentLevel}
                          </Badge>
                          {badge.maxLevel && (
                            <span className="text-sm text-gray-400">/ {badge.maxLevel}</span>
                          )}
                        </div>
                      </div>
                      {badge.isUnlocked && (
                        <Badge className="bg-green-500/20 text-green-300">
                          ✓ Unlocked
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className={`font-bold ${getBadgeProgressColor(badge.progress)}`}>
                          {badge.currentProgress} / {badge.requiredProgress}
                        </span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                      <p className="text-xs text-gray-500 text-center">{badge.progress.toFixed(1)}% complete</p>
                    </div>

                    {/* Rewards */}
                    {badge.rewards && (
                      <div className="p-3 bg-gray-800/50 rounded-lg space-y-2">
                        <p className="text-xs text-gray-400 font-semibold">Rewards:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {badge.rewards.points && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-purple-400" />
                              <span className="text-sm text-purple-300">+{badge.rewards.points} pts</span>
                            </div>
                          )}
                          {badge.rewards.tokens && (
                            <div className="flex items-center gap-1">
                              <Gift className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-300">+{badge.rewards.tokens} STC</span>
                            </div>
                          )}
                          {badge.rewards.nft && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-yellow-300">NFT</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Level Up Button */}
                    {badge.isUnlocked && badge.progress >= 100 && badge.currentLevel < (badge.maxLevel || 999) && (
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Level Up to {badge.currentLevel + 1}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Progress */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>Your tourism achievement journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Achievements</p>
                      <p className="text-2xl font-bold text-yellow-400">{nftSystem.achievementsEarned}/{achievements.length}</p>
                      <Progress 
                        value={(nftSystem.achievementsEarned / achievements.length) * 100} 
                        className="h-2 mt-2" 
                      />
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">NFTs Minted</p>
                      <p className="text-2xl font-bold text-purple-400">{nftSystem.totalMinted}</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Total Points</p>
                      <p className="text-2xl font-bold text-orange-400">{nftSystem.achievementPoints.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Photos Captured</p>
                      <p className="text-2xl font-bold text-cyan-400">{nftSystem.photosCaptured}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rarity Breakdown */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Achievement Rarity</CardTitle>
                  <CardDescription>Distribution by rarity level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded">
                      <span className="text-gray-300">Common</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {achievements.filter(a => a.rarity === 'common').length}
                        </span>
                        <Progress 
                          value={(achievements.filter(a => a.rarity === 'common').length / achievements.length) * 100} 
                          className="h-2 w-24" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded">
                      <span className="text-blue-300">Rare</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-400">
                          {achievements.filter(a => a.rarity === 'rare').length}
                        </span>
                        <Progress 
                          value={(achievements.filter(a => a.rarity === 'rare').length / achievements.length) * 100} 
                          className="h-2 w-24" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-purple-300">Epic</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-400">
                          {achievements.filter(a => a.rarity === 'epic').length}
                        </span>
                        <Progress 
                          value={(achievements.filter(a => a.rarity === 'epic').length / achievements.length) * 100} 
                          className="h-2 w-24" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded">
                      <span className="text-orange-300">Legendary</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-400">
                          {achievements.filter(a => a.rarity === 'legendary').length}
                        </span>
                        <Progress 
                          value={(achievements.filter(a => a.rarity === 'legendary').length / achievements.length) * 100} 
                          className="h-2 w-24" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
