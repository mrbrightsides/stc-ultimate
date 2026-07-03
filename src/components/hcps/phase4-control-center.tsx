'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Video, 
  Smartphone, 
  Vote, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { getCollaborationStats } from '@/lib/phase4-collaboration';
import { getARStats } from '@/lib/phase4-ar-system';
import { getGovernanceStats } from '@/lib/phase4-governance';
import { getIntegrationStats } from '@/lib/phase4-integration-dashboard';
import { CollaborationPanel } from './collaboration-panel';
import { ARExperiencePanel } from './ar-experience-panel';
import { AdvancedGovernancePanel } from './advanced-governance-panel';
import { IntegrationDashboardPanel } from './integration-dashboard-panel';

interface Phase4ControlCenterProps {
  onBack: () => void;
}

export function Phase4ControlCenter({ onBack }: Phase4ControlCenterProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Load statistics
  const collabStats = getCollaborationStats();
  const arStats = getARStats();
  const govStats = getGovernanceStats();
  const integrationStats = getIntegrationStats();

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 p-8 border border-emerald-500/30">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-white hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Phase 4: Ultimate Integration & Deployment
              </h1>
              <p className="text-lg text-emerald-200">
                Real-time Collaboration, AR Experiences, Advanced Governance & System Monitoring
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
              ✅ All Phases Complete
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
              🚀 Production Ready
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              📊 Real-time Monitoring
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-800">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="collaboration"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            <Users className="h-4 w-4 mr-2" />
            Collaboration
          </TabsTrigger>
          <TabsTrigger 
            value="ar"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            AR Experiences
          </TabsTrigger>
          <TabsTrigger 
            value="governance"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Vote className="h-4 w-4 mr-2" />
            Governance
          </TabsTrigger>
          <TabsTrigger 
            value="integration"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Integration Monitor
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Phase 4 System Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time statistics for all Phase 4 systems
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Collaboration Stats */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">Collaboration</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Sessions</span>
                    <span className="text-emerald-400 font-semibold">{collabStats.activeSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Participants</span>
                    <span className="text-emerald-400 font-semibold">{collabStats.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Satisfaction</span>
                    <span className="text-emerald-400 font-semibold">{collabStats.satisfactionRate}%</span>
                  </div>
                </div>
              </div>

              {/* AR Stats */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="h-6 w-6 text-cyan-400" />
                  <h3 className="font-semibold text-white">AR Experiences</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Experiences</span>
                    <span className="text-cyan-400 font-semibold">{arStats.totalExperiences}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Sessions</span>
                    <span className="text-cyan-400 font-semibold">{arStats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg Rating</span>
                    <span className="text-cyan-400 font-semibold">{arStats.averageRating} ⭐</span>
                  </div>
                </div>
              </div>

              {/* Governance Stats */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Vote className="h-6 w-6 text-blue-400" />
                  <h3 className="font-semibold text-white">Governance</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Proposals</span>
                    <span className="text-blue-400 font-semibold">{govStats.activeProposals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Participation</span>
                    <span className="text-blue-400 font-semibold">{govStats.participationRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">NFT Holders</span>
                    <span className="text-blue-400 font-semibold">{govStats.nftHolders}</span>
                  </div>
                </div>
              </div>

              {/* Integration Stats */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                  <h3 className="font-semibold text-white">System Health</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Integrations</span>
                    <span className="text-purple-400 font-semibold">{integrationStats.activeIntegrations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg Response Time</span>
                    <span className="text-purple-400 font-semibold">{integrationStats.averageResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">System Load</span>
                    <span className="text-purple-400 font-semibold">{integrationStats.systemLoad}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Benefits */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Phase 4 Integration Benefits</CardTitle>
              <CardDescription className="text-gray-400">
                How Phase 4 enhances the complete HCPS-Tourism 5.0 ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    For Tourists
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Collaborate with SMEs and researchers in real-time for personalized trip planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Experience destinations through immersive AR before booking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Participate in platform governance with NFT voting tokens</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    For SME Owners
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Use video conferencing for virtual tours and consultations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Showcase services with AR experiences for enhanced marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Access DAO treasury funds for business development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="mt-6">
          <CollaborationPanel />
        </TabsContent>

        {/* AR Tab */}
        <TabsContent value="ar" className="mt-6">
          <ARExperiencePanel />
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="mt-6">
          <AdvancedGovernancePanel />
        </TabsContent>

        {/* Integration Monitor Tab */}
        <TabsContent value="integration" className="mt-6">
          <IntegrationDashboardPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
