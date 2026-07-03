'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Smartphone, Star, Download, Play, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { getARExperiences, checkSystemRequirements, type ARExperience } from '@/lib/phase4-ar-system';

export function ARExperiencePanel() {
  const [experiences, setExperiences] = useState<ARExperience[]>(getARExperiences());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<ARExperience | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || exp.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (experience: ARExperience) => {
    setSelectedExperience(experience);
    setShowDetails(true);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tour: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      educational: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      interactive: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      game: 'bg-pink-500/20 text-pink-300 border-pink-500/50'
    };
    return colors[type] || colors.tour;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-red-400'
    };
    return colors[difficulty] || colors.easy;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">AR Experience Gallery</CardTitle>
          <CardDescription className="text-gray-400">
            Immersive augmented reality tours and educational experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search AR experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tour">Tours</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="game">Games</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <div 
                key={experience.id}
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-center mb-4 text-6xl">
                  {experience.previewImage}
                </div>
                
                <h3 className="font-semibold text-white mb-2">{experience.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{experience.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getTypeColor(experience.type)}>
                    {experience.type}
                  </Badge>
                  <span className={`text-sm font-semibold ${getDifficultyColor(experience.difficulty)}`}>
                    {experience.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{experience.rating}</span>
                    <span>({experience.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{experience.downloads}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  📍 {experience.location} • ⏱️ {experience.duration} min
                </div>

                <Button 
                  onClick={() => handleViewDetails(experience)}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">AR System Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
              <div className="text-2xl font-bold text-cyan-400 mb-1">8</div>
              <div className="text-sm text-gray-400">Total Experiences</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">5,234</div>
              <div className="text-sm text-gray-400">AR Sessions</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">456</div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg border border-pink-500/30">
              <div className="text-2xl font-bold text-pink-400 mb-1">4.7 ⭐</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Details Dialog */}
      {selectedExperience && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedExperience.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedExperience.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Preview */}
              <div className="flex items-center justify-center text-8xl bg-gray-800/50 rounded-lg p-8">
                {selectedExperience.previewImage}
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Experience Info</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-white">{selectedExperience.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="text-white">{selectedExperience.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className={getDifficultyColor(selectedExperience.difficulty)}>
                        {selectedExperience.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="text-yellow-400">
                        {selectedExperience.rating} ⭐ ({selectedExperience.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Accessibility</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Motion Sickness:</span>
                      <Badge className={
                        selectedExperience.accessibility.motionSickness === 'low' ? 'bg-green-500/20 text-green-300' :
                        selectedExperience.accessibility.motionSickness === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }>
                        {selectedExperience.accessibility.motionSickness}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Physical Activity:</span>
                      <Badge className={
                        selectedExperience.accessibility.physicalActivity === 'low' ? 'bg-green-500/20 text-green-300' :
                        selectedExperience.accessibility.physicalActivity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }>
                        {selectedExperience.accessibility.physicalActivity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Age Rating:</span>
                      <span className="text-white">{selectedExperience.accessibility.ageRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-white mb-3">Features</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedExperience.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <div className="font-semibold text-white text-sm">{feature.name}</div>
                        <div className="text-xs text-gray-400">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Requirements */}
              <div>
                <h4 className="font-semibold text-white mb-3">System Requirements</h4>
                <div className="p-4 bg-gray-800/50 rounded-lg space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400">OS: {selectedExperience.systemRequirements.minOS}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400">RAM: {selectedExperience.systemRequirements.minRAM}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-400">Storage: {selectedExperience.systemRequirements.minStorage}</span>
                  </div>
                  {selectedExperience.systemRequirements.arCore && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-gray-400">ARCore Support Required</span>
                    </div>
                  )}
                  {selectedExperience.systemRequirements.arKit && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-gray-400">ARKit Support Required</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Launch Experience
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
