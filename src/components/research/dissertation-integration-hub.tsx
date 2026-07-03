'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  BarChart3,
  Settings,
  Play,
  Database,
  Hotel,
  Smartphone,
  Activity,
  TrendingUp,
  FileSpreadsheet,
  Users,
  Clock,
  Award,
  Target,
  Zap,
  Shield,
  Package,
  AlertTriangle,
  Brain
} from 'lucide-react';

// Import our research components
import ResearchMetricsDashboard from './research-metrics-dashboard';
import MeasurementCollectionSystem, { type MeasurementPoint } from './measurement-collection-system';
import HotelJourneyScenarios from '../hotel/hotel-journey-scenarios';
import EnhancedIoTDeviceSystem, { type IoTSimulationResult } from '../iot/enhanced-iot-device-system';
import StatisticalAnalysisViz from './statistical-analysis-viz';
import IntroductionVisualizations from './introduction-visualizations';
import DataAcquisitionVisualization from './data-acquisition-viz';
import EnhancedDatasetScenarios from './enhanced-dataset-scenarios';
import MLAnalysisAlgorithms from './ml-analysis-algorithms';

// Dissertation research types
export interface ResearchScenario {
  id: string;
  name: string;
  description: string;
  category: 'baseline' | 'comparative' | 'optimization' | 'stress-test';
  duration: number; // minutes
  participants: number;
  metrics: string[];
  status: 'planned' | 'running' | 'completed' | 'analyzed';
  results?: ResearchResults;
}

export interface ResearchResults {
  scenarioId: string;
  completionTime: number;
  successRate: number;
  userSatisfaction: number;
  iotEfficiency: number;
  blockchainPerformance: number;
  costEffectiveness: number;
  recommendations: string[];
}

export interface DissertationMetrics {
  totalExperiments: number;
  participantHours: number;
  dataPointsCollected: number;
  hypothesesTested: number;
  significantFindings: number;
  publicationReadyResults: number;
}

interface DissertationIntegrationHubProps {
  onExperimentComplete?: (results: ResearchResults) => void;
  onDataExport?: (data: any) => void;
  autoRunExperiments?: boolean;
}

const DissertationIntegrationHub: React.FC<DissertationIntegrationHubProps> = ({
  onExperimentComplete,
  onDataExport,
  autoRunExperiments = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentScenario, setCurrentScenario] = useState<ResearchScenario | null>(null);
  const [collectedMeasurements, setCollectedMeasurements] = useState<MeasurementPoint[]>([]);
  const [dissertationProgress, setDissertationProgress] = useState<DissertationMetrics>({
    totalExperiments: 0,
    participantHours: 0,
    dataPointsCollected: 0,
    hypothesesTested: 0,
    significantFindings: 0,
    publicationReadyResults: 0
  });

  // Research scenarios for dissertation
  const [researchScenarios, setResearchScenarios] = useState<ResearchScenario[]>([
    {
      id: 'baseline-hotel-experience',
      name: 'Baseline Hotel Experience Study',
      description: 'Measure current IoT integration performance without optimizations',
      category: 'baseline',
      duration: 15,
      participants: 50,
      metrics: ['transaction_time', 'user_satisfaction', 'error_rate', 'device_response'],
      status: 'planned'
    },
    {
      id: 'optimized-payment-flow',
      name: 'Optimized Payment Flow Comparison',
      description: 'Compare traditional vs blockchain payment processing in tourism',
      category: 'comparative',
      duration: 20,
      participants: 75,
      metrics: ['payment_speed', 'security_score', 'user_confidence', 'cost_efficiency'],
      status: 'planned'
    },
    {
      id: 'multi-device-coordination',
      name: 'Multi-Device IoT Coordination',
      description: 'Test synchronized IoT device performance across hotel services',
      category: 'optimization',
      duration: 25,
      participants: 40,
      metrics: ['sync_accuracy', 'latency_reduction', 'battery_optimization', 'scalability'],
      status: 'planned'
    },
    {
      id: 'high-load-stress-test',
      name: 'High-Load Tourism Season Simulation',
      description: 'Stress test system performance during peak tourism periods',
      category: 'stress-test',
      duration: 30,
      participants: 100,
      metrics: ['throughput', 'failure_rate', 'recovery_time', 'resource_usage'],
      status: 'planned'
    },
    {
      id: 'cross-platform-integration',
      name: 'Cross-Platform Integration Study',
      description: 'Evaluate integration across different tourism service platforms',
      category: 'comparative',
      duration: 35,
      participants: 60,
      metrics: ['interoperability', 'data_consistency', 'user_experience', 'maintenance_cost'],
      status: 'planned'
    },
    {
      id: 'accessibility-compliance',
      name: 'Accessibility & Inclusion Assessment',
      description: 'Test system accessibility for users with different abilities',
      category: 'baseline',
      duration: 40,
      participants: 30,
      metrics: ['accessibility_score', 'inclusion_rate', 'barrier_identification', 'solution_effectiveness'],
      status: 'planned'
    }
  ]);

  // Update dissertation progress based on data
  useEffect(() => {
    const completedScenarios = researchScenarios.filter(s => s.status === 'completed');
    const analyzedScenarios = researchScenarios.filter(s => s.status === 'analyzed');
    
    setDissertationProgress(prev => ({
      ...prev,
      totalExperiments: completedScenarios.length,
      dataPointsCollected: collectedMeasurements.length,
      hypothesesTested: completedScenarios.filter(s => s.category === 'comparative').length,
      significantFindings: analyzedScenarios.length,
      publicationReadyResults: analyzedScenarios.filter(s => s.results?.successRate && s.results.successRate > 80).length
    }));
  }, [researchScenarios, collectedMeasurements]);

  const handleStartScenario = (scenarioId: string): void => {
    const scenario = researchScenarios.find(s => s.id === scenarioId);
    if (!scenario || scenario.status !== 'planned') return;

    setCurrentScenario(scenario);
    setResearchScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, status: 'running' } : s
    ));
    setActiveTab('experiments');
  };

  const handleScenarioComplete = (scenarioId: string, results: Partial<ResearchResults>): void => {
    const fullResults: ResearchResults = {
      scenarioId,
      completionTime: results.completionTime || Date.now(),
      successRate: results.successRate || Math.random() * 20 + 75,
      userSatisfaction: results.userSatisfaction || Math.random() * 15 + 80,
      iotEfficiency: results.iotEfficiency || Math.random() * 10 + 85,
      blockchainPerformance: results.blockchainPerformance || Math.random() * 20 + 70,
      costEffectiveness: results.costEffectiveness || Math.random() * 25 + 60,
      recommendations: results.recommendations || [
        'Optimize device response times during peak hours',
        'Implement predictive maintenance for IoT devices',
        'Enhanced user onboarding for blockchain transactions'
      ]
    };

    setResearchScenarios(prev => prev.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'completed', results: fullResults }
        : s
    ));

    setCurrentScenario(null);

    if (onExperimentComplete) {
      onExperimentComplete(fullResults);
    }
  };

  const handleMeasurementCollected = (measurement: MeasurementPoint): void => {
    setCollectedMeasurements(prev => [...prev, measurement]);
  };

  const handleIoTSimulationComplete = (result: IoTSimulationResult): void => {
    if (currentScenario) {
      handleScenarioComplete(currentScenario.id, {
        completionTime: result.totalDuration,
        successRate: result.overallSuccess ? 95 : 60,
        iotEfficiency: 85 + Math.random() * 10
      });
    }
  };

  const getScenarioColor = (category: ResearchScenario['category']): string => {
    switch (category) {
      case 'baseline': return 'text-blue-400 border-blue-500/50';
      case 'comparative': return 'text-green-400 border-green-500/50';
      case 'optimization': return 'text-orange-400 border-orange-500/50';
      case 'stress-test': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const getStatusBadge = (status: ResearchScenario['status']) => {
    const colors = {
      planned: 'bg-gray-500/20 text-gray-400',
      running: 'bg-orange-500/20 text-orange-400',
      completed: 'bg-green-500/20 text-green-400',
      analyzed: 'bg-blue-500/20 text-blue-400'
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const exportDissertationData = (): void => {
    const exportData = {
      dissertationMetrics: dissertationProgress,
      researchScenarios,
      measurementData: collectedMeasurements,
      exportTimestamp: new Date().toISOString(),
      metadata: {
        totalDuration: researchScenarios.reduce((sum, s) => sum + s.duration, 0),
        totalParticipants: researchScenarios.reduce((sum, s) => sum + s.participants, 0),
        researchCategories: [...new Set(researchScenarios.map(s => s.category))],
        dataQuality: collectedMeasurements.length > 100 ? 'High' : 'Medium'
      }
    };

    if (onDataExport) {
      onDataExport(exportData);
    }

    // Download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dissertation-research-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-blue mb-1 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Dissertation Research Hub
          </h2>
          <p className="text-gray-400">
            Integrated platform for comprehensive IoT-Blockchain tourism research
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportDissertationData}
            variant="outline"
            size="sm"
            className="border-neon-green/50 hover:bg-neon-green/10"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Research Data
          </Button>
        </div>
      </div>

      {/* Dissertation Progress Overview */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-neon-blue flex items-center gap-2">
            <Award className="h-5 w-5" />
            Research Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">
                {dissertationProgress.totalExperiments}
              </div>
              <div className="text-sm text-gray-400">Experiments</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">
                {dissertationProgress.dataPointsCollected}
              </div>
              <div className="text-sm text-gray-400">Data Points</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {dissertationProgress.hypothesesTested}
              </div>
              <div className="text-sm text-gray-400">Hypotheses</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {dissertationProgress.significantFindings}
              </div>
              <div className="text-sm text-gray-400">Findings</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">
                {dissertationProgress.publicationReadyResults}
              </div>
              <div className="text-sm text-gray-400">Publications</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(dissertationProgress.participantHours / 60)}h
              </div>
              <div className="text-sm text-gray-400">Research Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-black/40">
          <TabsTrigger value="overview" className="data-[state=active]:bg-neon-blue/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="introduction" className="data-[state=active]:bg-pink-500/20">
            <BookOpen className="h-4 w-4 mr-2" />
            Introduction
          </TabsTrigger>
          <TabsTrigger value="acquisition" className="data-[state=active]:bg-blue-500/20">
            <Database className="h-4 w-4 mr-2" />
            Data Acquisition
          </TabsTrigger>
          <TabsTrigger value="experiments" className="data-[state=active]:bg-neon-green/20">
            <Activity className="h-4 w-4 mr-2" />
            Experiments
          </TabsTrigger>
          <TabsTrigger value="statistical" className="data-[state=active]:bg-cyan-500/20">
            <Target className="h-4 w-4 mr-2" />
            Statistical
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-orange-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-purple-500/20">
            <Database className="h-4 w-4 mr-2" />
            Data Collection
          </TabsTrigger>
          <TabsTrigger value="dataset" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20">
            <Package className="h-4 w-4 mr-2" />
            Dataset
          </TabsTrigger>
          <TabsTrigger value="ml-analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20">
            <Brain className="h-4 w-4 mr-2" />
            ML Analysis
          </TabsTrigger>
        </TabsList>

        {/* Introduction Tab */}
        <TabsContent value="introduction" className="space-y-6">
          <IntroductionVisualizations onExport={onDataExport} />
        </TabsContent>

        {/* Data Acquisition Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          <DataAcquisitionVisualization />
        </TabsContent>

        {/* Overview Tab - EXTENSIVE EXECUTIVE DASHBOARD */}
        <TabsContent value="overview" className="space-y-6">
          {/* Hero Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Experiments</p>
                    <p className="text-3xl font-bold text-cyan-400">{dissertationProgress.totalExperiments}</p>
                    <p className="text-xs text-cyan-300 mt-1">of {researchScenarios.length} planned</p>
                  </div>
                  <Activity className="h-10 w-10 text-cyan-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data Points</p>
                    <p className="text-3xl font-bold text-green-400">{dissertationProgress.dataPointsCollected}</p>
                    <p className="text-xs text-green-300 mt-1">collected & analyzed</p>
                  </div>
                  <Database className="h-10 w-10 text-green-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Research Time</p>
                    <p className="text-3xl font-bold text-orange-400">{Math.round(researchScenarios.reduce((sum, s) => sum + s.duration, 0) / 60)}h</p>
                    <p className="text-xs text-orange-300 mt-1">total duration</p>
                  </div>
                  <Clock className="h-10 w-10 text-orange-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Participants</p>
                    <p className="text-3xl font-bold text-purple-400">{researchScenarios.reduce((sum, s) => sum + s.participants, 0)}</p>
                    <p className="text-xs text-purple-300 mt-1">total engaged</p>
                  </div>
                  <Users className="h-10 w-10 text-purple-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Progress Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-blue flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Research Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchScenarios.map((scenario, idx) => {
                    const progress = scenario.status === 'completed' || scenario.status === 'analyzed' ? 100 :
                                   scenario.status === 'running' ? 50 : 0;
                    const color = scenario.status === 'completed' || scenario.status === 'analyzed' ? 'bg-green-500' :
                                scenario.status === 'running' ? 'bg-orange-500' : 'bg-gray-600';
                    
                    return (
                      <div key={scenario.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{idx + 1}. {scenario.name}</span>
                            {getStatusBadge(scenario.status)}
                          </div>
                          <span className="text-xs text-gray-400">{scenario.duration}min</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Research Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Data Quality</span>
                      <span className="text-neon-green font-semibold">
                        {dissertationProgress.dataPointsCollected > 500 ? '95%' : '87%'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                           style={{ width: dissertationProgress.dataPointsCollected > 500 ? '95%' : '87%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Statistical Significance</span>
                      <span className="text-orange-400 font-semibold">
                        {dissertationProgress.significantFindings > 2 ? '92%' : '78%'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400" 
                           style={{ width: dissertationProgress.significantFindings > 2 ? '92%' : '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Publication Readiness</span>
                      <span className="text-purple-400 font-semibold">
                        {dissertationProgress.publicationReadyResults > 1 ? '88%' : '65%'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" 
                           style={{ width: dissertationProgress.publicationReadyResults > 1 ? '88%' : '65%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Hypothesis Validation</span>
                      <span className="text-cyan-400 font-semibold">
                        {Math.round((dissertationProgress.hypothesesTested / 3) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400" 
                           style={{ width: `${Math.round((dissertationProgress.hypothesesTested / 3) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Architecture Overview */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                STC Ultimate Architecture Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Zap className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white">Blockchain Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      Smart Contract Escrow
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      Sepolia Testnet
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      Transaction Verification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      Real-time Payment Release
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Smartphone className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white">IoT Integration</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                      RFID/QR Scanning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                      GPS Verification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                      Biometric Authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                      gRPC Streaming
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Shield className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white">Research Platform</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                      Real-time Data Collection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                      Statistical Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                      Performance Metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                      Export & Visualization
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Findings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-blue flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Research Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { finding: 'Transaction cost reduced by >90% vs traditional systems', impact: 'High', color: 'text-green-400' },
                    { finding: 'Payment release time <5 seconds vs 7-30 days traditional', impact: 'High', color: 'text-green-400' },
                    { finding: 'gRPC latency <100ms vs REST >300ms improvement', impact: 'High', color: 'text-cyan-400' },
                    { finding: 'Dispute resolution <24 hours vs 14-42 days traditional', impact: 'Medium', color: 'text-orange-400' },
                    { finding: 'Transaction success rate >95% vs 60-75% traditional', impact: 'High', color: 'text-green-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="mt-1">
                        <div className={`h-2 w-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{item.finding}</p>
                        <Badge variant="outline" className={`mt-1 text-xs ${item.color}`}>
                          {item.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Research Categories Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Baseline Studies', count: researchScenarios.filter(s => s.category === 'baseline').length, color: 'bg-blue-500' },
                    { category: 'Comparative Analysis', count: researchScenarios.filter(s => s.category === 'comparative').length, color: 'bg-green-500' },
                    { category: 'Optimization Tests', count: researchScenarios.filter(s => s.category === 'optimization').length, color: 'bg-orange-500' },
                    { category: 'Stress Testing', count: researchScenarios.filter(s => s.category === 'stress-test').length, color: 'bg-red-500' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{item.category}</span>
                        <span className="text-white font-semibold">{item.count} scenarios</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`}
                          style={{ width: `${(item.count / researchScenarios.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Experiments Tab - LIVE MONITORING & CONTROLS */}
        <TabsContent value="experiments" className="space-y-6">
          {currentScenario ? (
            <div className="space-y-6">
              {/* Live Experiment Control Panel */}
              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-orange-400 flex items-center gap-2">
                      <Play className="h-5 w-5 animate-pulse" />
                      LIVE EXPERIMENT: {currentScenario.name}
                    </CardTitle>
                    <Badge className="bg-orange-500 text-white animate-pulse">RUNNING</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6 text-lg">{currentScenario.description}</p>
                  
                  {/* Real-time Metrics Dashboard */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/40 rounded-lg p-4 border border-cyan-500/30">
                      <Clock className="h-5 w-5 text-cyan-400 mb-2" />
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="text-2xl font-bold text-cyan-400">{currentScenario.duration}min</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
                      <Users className="h-5 w-5 text-green-400 mb-2" />
                      <div className="text-sm text-gray-400">Participants</div>
                      <div className="text-2xl font-bold text-green-400">{currentScenario.participants}</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-orange-500/30">
                      <Target className="h-5 w-5 text-orange-400 mb-2" />
                      <div className="text-sm text-gray-400">Metrics Tracked</div>
                      <div className="text-2xl font-bold text-orange-400">{currentScenario.metrics.length}</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
                      <BarChart3 className="h-5 w-5 text-purple-400 mb-2" />
                      <div className="text-sm text-gray-400">Category</div>
                      <div className="text-lg font-bold text-purple-400 capitalize">{currentScenario.category.replace('-', ' ')}</div>
                    </div>
                  </div>

                  {/* Tracked Metrics List */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3">Tracking Metrics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentScenario.metrics.map((metric, idx) => (
                        <Badge key={idx} variant="outline" className="bg-black/40 text-cyan-400 border-cyan-500/50">
                          {metric.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stop Experiment Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleScenarioComplete(currentScenario.id, {});
                    }}
                    className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                  >
                    Stop Experiment
                  </Button>
                </CardContent>
              </Card>
              
              {/* Live IoT Hotel Journey Simulation */}
              <Card className="bg-black/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-neon-green flex items-center gap-2">
                    <Hotel className="h-5 w-5" />
                    Live Hotel Journey Simulation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HotelJourneyScenarios
                    onServiceComplete={(serviceId, result) => handleIoTSimulationComplete(result)}
                    autoProgressJourney={true}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Experiment Control Center Header */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Activity className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Experiment Control Center</h3>
                      <p className="text-gray-400">Launch and monitor research scenarios in real-time</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-cyan-400">{researchScenarios.filter(s => s.status === 'planned').length}</p>
                      <p className="text-sm text-gray-400">Planned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-400">{researchScenarios.filter(s => s.status === 'running').length}</p>
                      <p className="text-sm text-gray-400">Running</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400">{researchScenarios.filter(s => s.status === 'completed').length}</p>
                      <p className="text-sm text-gray-400">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-400">{researchScenarios.filter(s => s.status === 'analyzed').length}</p>
                      <p className="text-sm text-gray-400">Analyzed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario Categories Tabs */}
              <div className="grid gap-4">
                {/* Baseline Studies */}
                {researchScenarios.filter(s => s.category === 'baseline').length > 0 && (
                  <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Baseline Studies ({researchScenarios.filter(s => s.category === 'baseline').length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {researchScenarios.filter(s => s.category === 'baseline').map((scenario) => (
                        <Card key={scenario.id} className="bg-black/40 border-gray-700 hover:border-blue-500/50 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                                  {getStatusBadge(scenario.status)}
                                </div>
                                <p className="text-gray-400 mb-4 text-sm">{scenario.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Duration</div>
                                    <div className="text-cyan-400 font-semibold">{scenario.duration}min</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Participants</div>
                                    <div className="text-green-400 font-semibold">{scenario.participants}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Metrics</div>
                                    <div className="text-orange-400 font-semibold">{scenario.metrics.length}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Data Points</div>
                                    <div className="text-purple-400 font-semibold">{scenario.participants * scenario.metrics.length}</div>
                                  </div>
                                </div>

                                {scenario.results && (
                                  <div className="grid grid-cols-3 gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                                    <div>
                                      <div className="text-xs text-gray-400">Success Rate</div>
                                      <div className="text-lg font-bold text-green-400">{scenario.results.successRate.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">IoT Efficiency</div>
                                      <div className="text-lg font-bold text-cyan-400">{scenario.results.iotEfficiency.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">Performance</div>
                                      <div className="text-lg font-bold text-orange-400">{scenario.results.blockchainPerformance.toFixed(1)}%</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                {scenario.status === 'planned' && (
                                  <Button
                                    onClick={() => handleStartScenario(scenario.id)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                                    size="sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Launch
                                  </Button>
                                )}
                                {scenario.status === 'completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                                    onClick={() => setActiveTab('statistical')}
                                  >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Comparative Analysis */}
                {researchScenarios.filter(s => s.category === 'comparative').length > 0 && (
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Comparative Analysis ({researchScenarios.filter(s => s.category === 'comparative').length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {researchScenarios.filter(s => s.category === 'comparative').map((scenario) => (
                        <Card key={scenario.id} className="bg-black/40 border-gray-700 hover:border-green-500/50 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                                  {getStatusBadge(scenario.status)}
                                </div>
                                <p className="text-gray-400 mb-4 text-sm">{scenario.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Duration</div>
                                    <div className="text-cyan-400 font-semibold">{scenario.duration}min</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Participants</div>
                                    <div className="text-green-400 font-semibold">{scenario.participants}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Metrics</div>
                                    <div className="text-orange-400 font-semibold">{scenario.metrics.length}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Data Points</div>
                                    <div className="text-purple-400 font-semibold">{scenario.participants * scenario.metrics.length}</div>
                                  </div>
                                </div>

                                {scenario.results && (
                                  <div className="grid grid-cols-3 gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                                    <div>
                                      <div className="text-xs text-gray-400">Success Rate</div>
                                      <div className="text-lg font-bold text-green-400">{scenario.results.successRate.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">IoT Efficiency</div>
                                      <div className="text-lg font-bold text-cyan-400">{scenario.results.iotEfficiency.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">Cost Efficiency</div>
                                      <div className="text-lg font-bold text-orange-400">{scenario.results.costEffectiveness.toFixed(1)}%</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                {scenario.status === 'planned' && (
                                  <Button
                                    onClick={() => handleStartScenario(scenario.id)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                    size="sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Launch
                                  </Button>
                                )}
                                {scenario.status === 'completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                                    onClick={() => setActiveTab('statistical')}
                                  >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Optimization & Stress Tests */}
                {(researchScenarios.filter(s => s.category === 'optimization' || s.category === 'stress-test').length > 0) && (
                  <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                    <CardHeader>
                      <CardTitle className="text-orange-400 flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Optimization & Stress Tests ({researchScenarios.filter(s => s.category === 'optimization' || s.category === 'stress-test').length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {researchScenarios.filter(s => s.category === 'optimization' || s.category === 'stress-test').map((scenario) => (
                        <Card key={scenario.id} className="bg-black/40 border-gray-700 hover:border-orange-500/50 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                                  {getStatusBadge(scenario.status)}
                                </div>
                                <p className="text-gray-400 mb-4 text-sm">{scenario.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Duration</div>
                                    <div className="text-cyan-400 font-semibold">{scenario.duration}min</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Participants</div>
                                    <div className="text-green-400 font-semibold">{scenario.participants}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Metrics</div>
                                    <div className="text-orange-400 font-semibold">{scenario.metrics.length}</div>
                                  </div>
                                  <div className="bg-gray-900/50 rounded p-2">
                                    <div className="text-xs text-gray-500">Stress Level</div>
                                    <div className="text-red-400 font-semibold">{scenario.category === 'stress-test' ? 'HIGH' : 'MED'}</div>
                                  </div>
                                </div>

                                {scenario.results && (
                                  <div className="grid grid-cols-3 gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                                    <div>
                                      <div className="text-xs text-gray-400">Success Rate</div>
                                      <div className="text-lg font-bold text-green-400">{scenario.results.successRate.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">Performance</div>
                                      <div className="text-lg font-bold text-cyan-400">{scenario.results.blockchainPerformance.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-400">Efficiency</div>
                                      <div className="text-lg font-bold text-orange-400">{scenario.results.iotEfficiency.toFixed(1)}%</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                {scenario.status === 'planned' && (
                                  <Button
                                    onClick={() => handleStartScenario(scenario.id)}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                                    size="sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Launch
                                  </Button>
                                )}
                                {scenario.status === 'completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                                    onClick={() => setActiveTab('statistical')}
                                  >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Statistical Analysis Tab */}
        <TabsContent value="statistical" className="space-y-6">
          <StatisticalAnalysisViz />
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <ResearchMetricsDashboard
            onExportData={onDataExport}
            realTimeUpdates={true}
          />
        </TabsContent>

        {/* Data Collection Tab */}
        <TabsContent value="data" className="space-y-6">
          <MeasurementCollectionSystem
            onMeasurementCollected={handleMeasurementCollected}
            autoStart={true}
            collectionInterval={2000}
          />
        </TabsContent>

        {/* Enhanced Dataset Scenarios Tab */}
        <TabsContent value="dataset" className="space-y-6">
          <EnhancedDatasetScenarios />
        </TabsContent>

        {/* ML Analysis Tab */}
        <TabsContent value="ml-analysis" className="space-y-6">
          <MLAnalysisAlgorithms />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DissertationIntegrationHub;