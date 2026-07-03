'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Wifi, 
  Brain, 
  Vote, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  ArrowLeft,
  Server,
  Database,
  Network
} from 'lucide-react';
import { IoTNetworkMonitor } from './iot-network-monitor';
import { AIRecommendationPanel } from './ai-recommendation-panel';
import { DAOGovernancePanel } from './dao-governance-panel';
import { SmartContractMonitor } from './smart-contract-monitor';

interface Phase1ControlCenterProps {
  onBack: () => void;
}

export default function Phase1ControlCenter({ onBack }: Phase1ControlCenterProps) {
  const [systemHealth, setSystemHealth] = useState({
    blockchain: 'online',
    iot: 'online',
    ai: 'online',
    dao: 'online'
  });

  const [stats, setStats] = useState({
    activeDevices: 8,
    aiRecommendations: 1247,
    activeProposals: 3,
    totalTransactions: 18523
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <NeonButton size="sm" variant="secondary" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </NeonButton>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Phase 1: Core Infrastructure
            </h1>
          </div>
          <p className="text-gray-400">
            Real-time monitoring and control for blockchain, IoT, AI, and DAO systems
          </p>
        </div>

        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2 text-lg">
          <Activity className="h-5 w-5 animate-pulse" />
          All Systems Operational
        </Badge>
      </div>

      {/* System Health Dashboard */}
      <div className="grid md:grid-cols-4 gap-6">
        <NeonCard glowColor="cyan" className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {systemHealth.blockchain === 'online' ? (
                <CheckCircle2 className="h-12 w-12 text-cyan-400" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Blockchain</h3>
              <p className="text-gray-400 text-sm">Smart Contracts</p>
            </div>
            <div className="pt-2 border-t border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-400">{stats.totalTransactions.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Transactions</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="blue" className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {systemHealth.iot === 'online' ? (
                <Wifi className="h-12 w-12 text-blue-400" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">IoT Network</h3>
              <p className="text-gray-400 text-sm">Live Sensors</p>
            </div>
            <div className="pt-2 border-t border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">{stats.activeDevices}</p>
              <p className="text-xs text-gray-400">Active Devices</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="purple" className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {systemHealth.ai === 'online' ? (
                <Brain className="h-12 w-12 text-purple-400" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI Engine</h3>
              <p className="text-gray-400 text-sm">Recommendations</p>
            </div>
            <div className="pt-2 border-t border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">{stats.aiRecommendations.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Generated</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="orange" className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {systemHealth.dao === 'online' ? (
                <Vote className="h-12 w-12 text-orange-400" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">DAO Governance</h3>
              <p className="text-gray-400 text-sm">Active Voting</p>
            </div>
            <div className="pt-2 border-t border-orange-500/20">
              <p className="text-2xl font-bold text-orange-400">{stats.activeProposals}</p>
              <p className="text-xs text-gray-400">Active Proposals</p>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Main Control Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="contracts" className="data-[state=active]:bg-cyan-500/20">
            <Database className="h-4 w-4 mr-2" />
            Smart Contracts
          </TabsTrigger>
          <TabsTrigger value="iot" className="data-[state=active]:bg-blue-500/20">
            <Wifi className="h-4 w-4 mr-2" />
            IoT Network
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500/20">
            <Brain className="h-4 w-4 mr-2" />
            AI Engine
          </TabsTrigger>
          <TabsTrigger value="dao" className="data-[state=active]:bg-orange-500/20">
            <Vote className="h-4 w-4 mr-2" />
            DAO Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <NeonCard glowColor="cyan">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Server className="h-6 w-6 text-cyan-400" />
                Phase 1 Infrastructure Status
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Core Systems</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Booking Contract', status: 'deployed', color: 'green' },
                      { name: 'Payment Contract', status: 'deployed', color: 'green' },
                      { name: 'Audit Trail Contract', status: 'deployed', color: 'green' },
                      { name: 'IoT Data Streaming', status: 'active', color: 'blue' },
                      { name: 'AI Recommendation Engine', status: 'active', color: 'purple' },
                      { name: 'DAO Governance Module', status: 'active', color: 'orange' }
                    ].map((system, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="text-gray-300">{system.name}</span>
                        <Badge className={`bg-${system.color}-500/20 text-${system.color}-400 border-${system.color}-500/50`}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {system.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">System Uptime</span>
                        <span className="text-green-400 font-semibold">99.8%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }} />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">IoT Response Time</span>
                        <span className="text-blue-400 font-semibold">124ms</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">AI Model Accuracy</span>
                        <span className="text-purple-400 font-semibold">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.2%' }} />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">DAO Participation</span>
                        <span className="text-orange-400 font-semibold">67.5%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-400">Last System Update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>
        </TabsContent>

        <TabsContent value="contracts">
          <SmartContractMonitor />
        </TabsContent>

        <TabsContent value="iot">
          <IoTNetworkMonitor />
        </TabsContent>

        <TabsContent value="ai">
          <AIRecommendationPanel />
        </TabsContent>

        <TabsContent value="dao">
          <DAOGovernancePanel />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <NeonCard glowColor="purple">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <NeonButton variant="primary" className="w-full">
              <Database className="h-4 w-4" />
              Deploy Contract
            </NeonButton>
            <NeonButton variant="secondary" className="w-full">
              <Network className="h-4 w-4" />
              Add IoT Device
            </NeonButton>
            <NeonButton variant="accent" className="w-full">
              <Brain className="h-4 w-4" />
              Train AI Model
            </NeonButton>
            <NeonButton variant="default" className="w-full">
              <Vote className="h-4 w-4" />
              Create Proposal
            </NeonButton>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
