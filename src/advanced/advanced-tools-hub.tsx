'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Brain, 
  Route, 
  Glasses, 
  Zap, 
  Users,
  ArrowLeft,
  TrendingUp,
  MapPin,
  Eye,
  Battery,
  Target
} from 'lucide-react';

// Import advanced features
import { SmartTravelAssistant } from '@/components/smart-travel-assistant';
import { PersonalizedRecommendations } from '@/components/personalized-recommendations';
import { RouteOptimizer } from '@/components/route-optimizer';
import { VRDestinationPreview } from '@/components/vr-destination-preview';
import EnergyOptimizer from '@/components/EnergyOptimizer';
import VisitorDensityMonitor from '@/components/VisitorDensityMonitor';

interface AdvancedToolsHubProps {
  onBack: () => void;
}

const AdvancedToolsHub: React.FC<AdvancedToolsHubProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('assistant');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="border-cyan-500/20 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-cyan-400" />
                <CardTitle className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Advanced AI Tools
                </CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Next-generation AI-powered features for smart tourism management and optimization
              </CardDescription>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-purple-500/50 hover:bg-purple-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-full md:w-auto flex-wrap h-auto gap-2 bg-gray-900/50 p-2">
                <TabsTrigger value="assistant" className="gap-2">
                  <Brain className="h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="route" className="gap-2">
                  <Route className="h-4 w-4" />
                  Route Optimizer
                </TabsTrigger>
                <TabsTrigger value="vr" className="gap-2">
                  <Glasses className="h-4 w-4" />
                  VR Preview
                </TabsTrigger>
                <TabsTrigger value="energy" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Energy AI
                </TabsTrigger>
                <TabsTrigger value="density" className="gap-2">
                  <Users className="h-4 w-4" />
                  Crowd Monitor
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            {/* Tab 1: Smart Travel Assistant */}
            <TabsContent value="assistant" className="space-y-6">
              <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-cyan-400" />
                    <div>
                      <CardTitle className="text-cyan-400">AI Travel Assistant</CardTitle>
                      <CardDescription>Intelligent conversational AI for trip planning and recommendations</CardDescription>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 ml-auto">
                      GPT-4 Powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      The AI Travel Assistant uses advanced natural language processing to understand your travel preferences, 
                      suggest personalized itineraries, answer questions about destinations, and help you book services 
                      seamlessly through blockchain-verified transactions.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <p className="text-xs font-medium text-cyan-300 mb-1">✨ Natural Language</p>
                        <p className="text-xs text-gray-400">Chat naturally, like with a human travel agent</p>
                      </div>
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <p className="text-xs font-medium text-cyan-300 mb-1">🎯 Context-Aware</p>
                        <p className="text-xs text-gray-400">Remembers your preferences and past conversations</p>
                      </div>
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <p className="text-xs font-medium text-cyan-300 mb-1">🔗 Blockchain Integration</p>
                        <p className="text-xs text-gray-400">Direct booking with smart contract verification</p>
                      </div>
                    </div>
                  </div>
                  <SmartTravelAssistant />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Personalized Recommendations */}
            <TabsContent value="recommendations" className="space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                    <div>
                      <CardTitle className="text-purple-400">Personalized Recommendations</CardTitle>
                      <CardDescription>ML-powered destination and activity suggestions tailored to your preferences</CardDescription>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 ml-auto">
                      ML Powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      Our machine learning recommendation engine analyzes your travel history, preferences, budget, and timing 
                      to suggest the perfect destinations and activities. The system continuously learns from your feedback to 
                      provide increasingly accurate suggestions over time.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs font-medium text-purple-300 mb-1">🧠 Collaborative Filtering</p>
                        <p className="text-xs text-gray-400">Based on similar traveler preferences</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs font-medium text-purple-300 mb-1">📊 Behavior Analysis</p>
                        <p className="text-xs text-gray-400">Learns from your booking patterns</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs font-medium text-purple-300 mb-1">🎨 Preference Matching</p>
                        <p className="text-xs text-gray-400">Scores destinations by your interests</p>
                      </div>
                    </div>
                  </div>
                  <PersonalizedRecommendations />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Route Optimizer */}
            <TabsContent value="route" className="space-y-6">
              <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Route className="h-6 w-6 text-orange-400" />
                    <div>
                      <CardTitle className="text-orange-400">AI Route Optimizer</CardTitle>
                      <CardDescription>Intelligent multi-stop route planning with cost and time optimization</CardDescription>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50 ml-auto">
                      Optimization AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      The Route Optimizer uses advanced algorithms to create the most efficient travel routes between multiple 
                      destinations. It considers factors like traffic patterns, opening hours, seasonal variations, and your 
                      personal preferences to minimize travel time and maximize experience quality.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-xs font-medium text-orange-300 mb-1">⏱️ Time Optimization</p>
                        <p className="text-xs text-gray-400">Minimize travel time between stops</p>
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-xs font-medium text-orange-300 mb-1">💰 Cost Efficiency</p>
                        <p className="text-xs text-gray-400">Find the most economical route</p>
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-xs font-medium text-orange-300 mb-1">🚗 Multi-Modal</p>
                        <p className="text-xs text-gray-400">Walking, driving, public transport</p>
                      </div>
                    </div>
                  </div>
                  <RouteOptimizer />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: VR Destination Preview */}
            <TabsContent value="vr" className="space-y-6">
              <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Glasses className="h-6 w-6 text-blue-400" />
                    <div>
                      <CardTitle className="text-blue-400">VR Destination Preview</CardTitle>
                      <CardDescription>Immersive 360° virtual reality tours of destinations before you book</CardDescription>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 ml-auto">
                      VR Experience
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      Experience destinations in virtual reality before committing to a booking. Explore hotels, attractions, 
                      and local areas through immersive 360° tours, captured with high-resolution cameras and rendered in 
                      real-time. Make informed decisions by virtually "walking through" your future vacation.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs font-medium text-blue-300 mb-1">🏨 Hotel Tours</p>
                        <p className="text-xs text-gray-400">Explore rooms and facilities virtually</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs font-medium text-blue-300 mb-1">🗺️ Area Exploration</p>
                        <p className="text-xs text-gray-400">Walk through neighborhoods and attractions</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs font-medium text-blue-300 mb-1">📱 Cross-Platform</p>
                        <p className="text-xs text-gray-400">Works on VR headsets and mobile devices</p>
                      </div>
                    </div>
                  </div>
                  <VRDestinationPreview />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Energy Optimizer */}
            <TabsContent value="energy" className="space-y-6">
              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-green-400" />
                    <div>
                      <CardTitle className="text-green-400">AI Energy Optimizer</CardTitle>
                      <CardDescription>Smart energy management for sustainable tourism facilities</CardDescription>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50 ml-auto">
                      Sustainability AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      The Energy Optimizer uses machine learning to predict energy consumption patterns and automatically 
                      adjust HVAC, lighting, and appliances for optimal efficiency. It learns occupancy patterns, weather 
                      forecasts, and guest preferences to reduce energy waste while maintaining comfort standards.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-xs font-medium text-green-300 mb-1">📈 Predictive Analysis</p>
                        <p className="text-xs text-gray-400">Forecast energy demand patterns</p>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-xs font-medium text-green-300 mb-1">🌱 Carbon Reduction</p>
                        <p className="text-xs text-gray-400">Target: 30% emission reduction</p>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-xs font-medium text-green-300 mb-1">💡 Smart Automation</p>
                        <p className="text-xs text-gray-400">Auto-adjust systems for efficiency</p>
                      </div>
                    </div>
                  </div>
                  <EnergyOptimizer />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 6: Visitor Density Monitor */}
            <TabsContent value="density" className="space-y-6">
              <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-pink-400" />
                    <div>
                      <CardTitle className="text-pink-400">Visitor Density Monitor</CardTitle>
                      <CardDescription>Real-time crowd tracking and capacity management with AI predictions</CardDescription>
                    </div>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50 ml-auto">
                      Computer Vision AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300 text-sm">
                      Monitor visitor density at attractions in real-time using computer vision and IoT sensors. The system 
                      provides crowd forecasts, suggests optimal visit times, and alerts facility managers when capacity 
                      limits are approached. Helps tourists avoid overcrowded areas and enables better crowd management.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <p className="text-xs font-medium text-pink-300 mb-1">👁️ Live Tracking</p>
                        <p className="text-xs text-gray-400">Real-time visitor count monitoring</p>
                      </div>
                      <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <p className="text-xs font-medium text-pink-300 mb-1">🔮 Crowd Prediction</p>
                        <p className="text-xs text-gray-400">Forecast busy times with 85% accuracy</p>
                      </div>
                      <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <p className="text-xs font-medium text-pink-300 mb-1">🚨 Capacity Alerts</p>
                        <p className="text-xs text-gray-400">Automatic warnings at 80% capacity</p>
                      </div>
                    </div>
                  </div>
                  <VisitorDensityMonitor />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="border-cyan-500/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-lg">Why Advanced AI Tools?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <p>
              These AI-powered features represent the cutting edge of smart tourism technology, combining 
              machine learning, natural language processing, computer vision, and blockchain integration.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span><strong>Enhanced Decision Making:</strong> Make informed choices with AI-powered insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span><strong>Time & Cost Savings:</strong> Optimize routes and reduce planning time by 60%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span><strong>Sustainability Focus:</strong> Reduce carbon footprint through smart energy management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span><strong>Safety & Comfort:</strong> Avoid crowded areas with real-time density monitoring</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-400 text-lg">Research & Academic Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <p>
              All AI tools generate valuable research data for academic analysis and blockchain-verified audit trails.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>AI Effectiveness Studies:</strong> Measure recommendation accuracy and user satisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Behavioral Analytics:</strong> Analyze travel patterns and decision-making processes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Sustainability Metrics:</strong> Track carbon reduction and energy optimization outcomes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span><strong>Blockchain Integration:</strong> Verify AI decisions on-chain for research transparency</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedToolsHub;
