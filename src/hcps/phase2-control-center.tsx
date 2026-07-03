'use client';

/**
 * Phase 2: Advanced Integration Control Center
 * Unified dashboard for Metaverse, NFT, Cross-chain, and VR systems
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, Award, Link2, Glasses, Activity, TrendingUp,
  Users, Image, CheckCircle2, ArrowRight, Sparkles
} from 'lucide-react';
import type { HCPS_Phase } from '@/lib/hcps-config';

// Import Phase 2 sub-panels
import { Metaverse3DViewer } from './metaverse-3d-viewer';
import { NFTAchievementPanel } from './nft-achievement-panel';
import { CrossChainBridgePanel } from './cross-chain-bridge-panel';
import { VRExperiencePanel } from './vr-experience-panel';

interface Phase2Props {
  userRole: 'tourist' | 'sme' | 'researcher' | 'admin';
}

export function Phase2ControlCenter({ userRole }: Phase2Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [systemStats, setSystemStats] = useState({
    metaverseUsers: 0,
    nftsMinted: 0,
    bridgeVolume: '0',
    vrSessions: 0
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        metaverseUsers: prev.metaverseUsers + Math.floor(Math.random() * 5),
        nftsMinted: prev.nftsMinted + Math.floor(Math.random() * 3),
        bridgeVolume: (parseFloat(prev.bridgeVolume) + Math.random() * 0.5).toFixed(4),
        vrSessions: prev.vrSessions + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
              Phase 2
            </Badge>
            <Badge variant="outline">Advanced Integration</Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Phase 2: Advanced Integration
          </h1>
          <p className="text-muted-foreground text-lg">
            Metaverse, NFT Achievements, Cross-Chain Bridges, and Enhanced VR Integration
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metaverse" className="gap-2">
              <Globe className="h-4 w-4" />
              Metaverse
            </TabsTrigger>
            <TabsTrigger value="nft" className="gap-2">
              <Award className="h-4 w-4" />
              NFT System
            </TabsTrigger>
            <TabsTrigger value="bridge" className="gap-2">
              <Link2 className="h-4 w-4" />
              Cross-Chain
            </TabsTrigger>
            <TabsTrigger value="vr" className="gap-2">
              <Glasses className="h-4 w-4" />
              VR Experiences
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Alert className="border-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                Phase 2 integrates advanced technologies: immersive metaverse experiences, NFT achievement systems,
                multi-blockchain support, and enhanced VR capabilities for Tourism 5.0
              </AlertDescription>
            </Alert>

            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    Metaverse Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{systemStats.metaverseUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active in virtual worlds</p>
                </CardContent>
              </Card>

              <Card className="border-pink-200 dark:border-pink-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-pink-600" />
                    NFTs Minted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-600">{systemStats.nftsMinted}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tourism badges earned</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-blue-600" />
                    Bridge Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{systemStats.bridgeVolume}</div>
                  <p className="text-xs text-muted-foreground mt-1">STC tokens bridged</p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Glasses className="h-4 w-4 text-indigo-600" />
                    VR Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600">{systemStats.vrSessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Immersive experiences</p>
                </CardContent>
              </Card>
            </div>

            {/* Phase 2 Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Expanded Metaverse Hub
                  </CardTitle>
                  <CardDescription>
                    3D virtual tourism destinations with avatar interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">5 Virtual Destinations</span>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avatar System</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interaction Points</span>
                    <Badge>15+ per destination</Badge>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('metaverse')} 
                    className="w-full mt-2"
                    variant="outline"
                  >
                    Explore Metaverse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    NFT Achievement System
                  </CardTitle>
                  <CardDescription>
                    Mintable tourism badges and digital collectibles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">8 Achievement Types</span>
                    <Badge variant="secondary">Mintable</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rarity Levels</span>
                    <Badge>Common to Legendary</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Badge Upgrades</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <Button 
                    onClick={() => setActiveTab('nft')} 
                    className="w-full mt-2"
                    variant="outline"
                  >
                    View Achievements <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-blue-600" />
                    Cross-Chain Bridges
                  </CardTitle>
                  <CardDescription>
                    Multi-blockchain support for STC tokens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">6 Supported Networks</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bridge Success Rate</span>
                    <Badge>98.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Fee</span>
                    <span className="text-sm font-medium">0.001 ETH</span>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('bridge')} 
                    className="w-full mt-2"
                    variant="outline"
                  >
                    Bridge Tokens <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Glasses className="h-5 w-5 text-indigo-600" />
                    Enhanced VR Integration
                  </CardTitle>
                  <CardDescription>
                    Immersive virtual reality destination previews
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">6 VR Experiences</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <Badge>4.8 / 5.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hand Tracking Support</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <Button 
                    onClick={() => setActiveTab('vr')} 
                    className="w-full mt-2"
                    variant="outline"
                  >
                    Start VR Tour <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Integration Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 2 Integration Benefits</CardTitle>
                <CardDescription>How advanced technologies enhance Tourism 5.0</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      For Tourists
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Immersive destination previews before booking</li>
                      <li>• Collectible NFT badges for achievements</li>
                      <li>• Multi-chain wallet support</li>
                      <li>• VR experiences from home</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-pink-600" />
                      For SME Owners
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Virtual showrooms for destinations</li>
                      <li>• NFT-based loyalty programs</li>
                      <li>• Accept payments on multiple chains</li>
                      <li>• Showcase VR tours to attract visitors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metaverse Tab */}
          <TabsContent value="metaverse" className="mt-6">
            <Metaverse3DViewer userRole={userRole} />
          </TabsContent>

          {/* NFT Tab */}
          <TabsContent value="nft" className="mt-6">
            <NFTAchievementPanel userRole={userRole} />
          </TabsContent>

          {/* Cross-Chain Bridge Tab */}
          <TabsContent value="bridge" className="mt-6">
            <CrossChainBridgePanel userRole={userRole} />
          </TabsContent>

          {/* VR Tab */}
          <TabsContent value="vr" className="mt-6">
            <VRExperiencePanel userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
