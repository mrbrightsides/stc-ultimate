'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Clock,
  DollarSign,
  MessageSquare,
  Send,
  Star,
  Users,
  Thermometer,
  Wind
} from 'lucide-react';
import type { UserProfile, TourRecommendation } from '@/lib/phase1-ai-engine';
import { generateRecommendations, generateAIChatResponse } from '@/lib/phase1-ai-engine';
import { IOT_DEVICES } from '@/lib/phase1-iot-network';

export function AIRecommendationPanel() {
  const [userProfile] = useState<UserProfile>({
    id: 'user-001',
    preferences: {
      interests: ['culture', 'adventure', 'nature'],
      budget: 'medium',
      travelStyle: 'cultural',
      groupSize: 2
    },
    history: {
      visitedDestinations: ['Jakarta', 'Bandung'],
      completedTours: 5,
      totalSpent: 0.15
    }
  });

  const [recommendations, setRecommendations] = useState<TourRecommendation[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([
    { role: 'ai', message: 'Hello! I\'m your AI tourism assistant. I can help you find the perfect destinations based on your preferences and real-time conditions. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Generate initial recommendations
    const recs = generateRecommendations(userProfile, IOT_DEVICES, 5);
    setRecommendations(recs);
  }, [userProfile]);

  const handleSendMessage = (): void => {
    if (!chatInput.trim()) return;

    // Add user message
    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, message: chatInput }
    ];

    // Generate AI response
    const aiResponse = generateAIChatResponse(chatInput, userProfile, IOT_DEVICES);
    newMessages.push({ role: 'ai', message: aiResponse });

    setChatMessages(newMessages);
    setChatInput('');
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      cultural: 'purple',
      adventure: 'cyan',
      relaxation: 'green',
      luxury: 'orange'
    };
    return colors[category] || 'gray';
  };

  const getCrowdLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      low: 'green',
      medium: 'orange',
      high: 'red'
    };
    return colors[level] || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* AI Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <NeonCard glowColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Recommendations</p>
              <p className="text-3xl font-bold text-purple-400">{recommendations.length}</p>
            </div>
            <Brain className="h-12 w-12 text-purple-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Match Score</p>
              <p className="text-3xl font-bold text-cyan-400">
                {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length || 0)}%
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-cyan-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tours Analyzed</p>
              <p className="text-3xl font-bold text-green-400">1,247</p>
            </div>
            <Sparkles className="h-12 w-12 text-green-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">User Satisfaction</p>
              <p className="text-3xl font-bold text-orange-400">94%</p>
            </div>
            <Star className="h-12 w-12 text-orange-400" />
          </div>
        </NeonCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              Personalized Recommendations
            </h3>
          </div>

          <NeonCard glowColor="cyan" className="bg-gray-900/50">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Your Travel Profile</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Travel Style</p>
                  <Badge className="mt-1 bg-purple-500/20 text-purple-400 border-purple-500/50 capitalize">
                    {userProfile.preferences.travelStyle}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400">Budget</p>
                  <Badge className="mt-1 bg-cyan-500/20 text-cyan-400 border-cyan-500/50 capitalize">
                    {userProfile.preferences.budget}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400">Tours Completed</p>
                  <p className="text-white font-semibold">{userProfile.history.completedTours}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Spent</p>
                  <p className="text-white font-semibold">{userProfile.history.totalSpent} ETH</p>
                </div>
              </div>
            </div>
          </NeonCard>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <NeonCard key={rec.id} glowColor={getCategoryColor(rec.category)}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{rec.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <p className="text-sm text-gray-400">{rec.destination}</p>
                      </div>
                    </div>
                    <Badge className={`bg-${getCategoryColor(rec.category)}-500/20 text-${getCategoryColor(rec.category)}-400 border-${getCategoryColor(rec.category)}-500/50`}>
                      {rec.matchScore}% Match
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-300">{rec.description}</p>

                  {rec.currentConditions && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className={`text-${getCrowdLevelColor(rec.currentConditions.crowdLevel)}-400`}>
                          {rec.currentConditions.crowdLevel} crowd
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        <span className="text-gray-400">{rec.currentConditions.weather}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        <span className="text-gray-400">{rec.currentConditions.airQuality} AQI</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <DollarSign className="h-4 w-4" />
                        <span>{rec.price} ETH</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{rec.duration}</span>
                      </div>
                    </div>
                    <NeonButton size="sm" variant="primary">
                      Book Now
                    </NeonButton>
                  </div>

                  {rec.reasons.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Why we recommend this:</p>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </NeonCard>
            ))}
          </div>
        </div>

        {/* AI Chat Assistant */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-cyan-400" />
            AI Chat Assistant
          </h3>

          <NeonCard glowColor="cyan" className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                        : 'bg-gray-900/80 text-gray-300 border border-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === 'ai' && <Brain className="h-4 w-4 text-purple-400 mt-0.5" />}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-input" className="text-gray-400">Ask me anything about Indonesian tourism</Label>
              <div className="flex gap-2">
                <Input
                  id="chat-input"
                  value={chatInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type your message..."
                  className="bg-gray-900 border-gray-800 text-white"
                />
                <NeonButton variant="primary" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </NeonButton>
              </div>
            </div>
          </NeonCard>

          {/* Quick Suggestions */}
          <NeonCard glowColor="purple">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Quick Questions</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'What are the best cultural tours?',
                  'Check weather conditions',
                  'Budget-friendly options?',
                  'Adventure tours near Bali'
                ].map((suggestion, idx) => (
                  <NeonButton
                    key={idx}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setChatInput(suggestion);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className="text-xs"
                  >
                    {suggestion}
                  </NeonButton>
                ))}
              </div>
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}
