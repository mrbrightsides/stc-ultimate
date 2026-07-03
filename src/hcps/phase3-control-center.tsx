'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Video, 
  Globe2, 
  TrendingUp, 
  Sparkles,
  Users,
  DollarSign,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { AITourPlannerPanel } from './ai-tour-planner-panel';
import { LiveStreamingPanel } from './live-streaming-panel';
import { MultiLanguagePanel } from './multi-language-panel';
import { AdvancedAnalyticsPanel } from './advanced-analytics-panel';

export function Phase3ControlCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = {
    aiItineraries: 3847,
    liveStreams: 1247,
    languages: 10,
    analyticsInsights: 15600,
    aiAccuracy: 94.2,
    streamViewers: 9957,
    translationCoverage: 87.3,
    predictionConfidence: 88.5
  };

  const benefits = [
    {
      role: 'Tourist',
      icon: <Users className="w-5 h-5" />,
      benefits: [
        'Personalized AI-powered trip planning',
        'Live virtual tours from anywhere',
        'Multi-language support for global access',
        'Predictive recommendations based on preferences'
      ]
    },
    {
      role: 'SME Owner',
      icon: <DollarSign className="w-5 h-5" />,
      benefits: [
        'Price optimization with ML insights',
        'Live streaming for destination marketing',
        'Global reach with multi-language content',
        'Demand forecasting for inventory management'
      ]
    },
    {
      role: 'Researcher',
      icon: <BarChart3 className="w-5 h-5" />,
      benefits: [
        'Advanced analytics with ML models',
        'Real-time behavioral data collection',
        'Cross-cultural tourism pattern analysis',
        'Predictive modeling for tourism trends'
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Phase 3: Intelligence & Analytics
            </h1>
            <p className="text-muted-foreground">
              AI-powered planning, live streaming, internationalization, and predictive insights
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Brain className="w-5 h-5 text-cyan-400" />
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                {systemStats.aiAccuracy}% Accuracy
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.aiItineraries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">AI Itineraries Generated</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Video className="w-5 h-5 text-red-400" />
              <Badge variant="outline" className="border-red-500/30 text-red-400">
                {systemStats.streamViewers.toLocaleString()} viewers
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.liveStreams.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Live Streams</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Globe2 className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                {systemStats.translationCoverage}% Coverage
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.languages}</div>
            <p className="text-xs text-muted-foreground">Supported Languages</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                {systemStats.predictionConfidence}% Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.analyticsInsights.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">ML-Powered Insights</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">AI Planner</span>
          </TabsTrigger>
          <TabsTrigger value="streaming" className="gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Live Streams</span>
          </TabsTrigger>
          <TabsTrigger value="i18n" className="gap-2">
            <Globe2 className="w-4 h-4" />
            <span className="hidden sm:inline">Languages</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Phase 3 Objectives
              </CardTitle>
              <CardDescription>
                Advanced intelligence and analytics layer for personalized, global, and data-driven tourism
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-cyan-400 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">AI Tour Planning</h3>
                      <p className="text-sm text-muted-foreground">
                        Machine learning-powered itinerary generation based on preferences, budget, and real-time conditions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                  <div className="flex items-start gap-3">
                    <Video className="w-6 h-6 text-red-400 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Live Streaming</h3>
                      <p className="text-sm text-muted-foreground">
                        Real-time video tours, cultural events, and interactive destination previews with chat and donations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                  <div className="flex items-start gap-3">
                    <Globe2 className="w-6 h-6 text-green-400 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Internationalization</h3>
                      <p className="text-sm text-muted-foreground">
                        Multi-language support with 10 languages, localized content, and cultural adaptation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-purple-500/20 rounded-lg bg-purple-500/5">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-purple-400 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Advanced Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Predictive modeling, demand forecasting, churn prediction, and ML-driven business insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits by Role */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Benefits by Stakeholder
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {benefits.map((benefit) => (
                    <Card key={benefit.role} className="border-muted">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {benefit.icon}
                          {benefit.role}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {benefit.benefits.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Integration Status */}
              <div className="p-4 border border-muted rounded-lg bg-muted/20">
                <h3 className="font-semibold mb-3">Integration Status</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AI Models Active</span>
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
                      4 Models
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Live Streams</span>
                    <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                      3 Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Languages Enabled</span>
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
                      10 / 10
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Analytics Dashboards</span>
                    <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400">
                      5 Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tour Planner Tab */}
        <TabsContent value="ai-planner">
          <AITourPlannerPanel />
        </TabsContent>

        {/* Live Streaming Tab */}
        <TabsContent value="streaming">
          <LiveStreamingPanel />
        </TabsContent>

        {/* Multi-language Tab */}
        <TabsContent value="i18n">
          <MultiLanguagePanel />
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics">
          <AdvancedAnalyticsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
