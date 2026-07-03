'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  Sankey,
  Rectangle
} from 'recharts';
import {
  Download,
  Building2,
  Network,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Layers,
  Zap,
  Shield,
  Globe,
  Server,
  Smartphone,
  Database,
  GitBranch,
  Target,
  Award,
  BookOpen
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface IntroductionVisualizationsProps {
  onExport?: (format: 'pdf' | 'png' | 'json') => void;
}

// Data for visualizations
const problemComparisonData = [
  {
    metric: 'Transaction Fees',
    centralized: 20,
    decentralized: 2.5,
    unit: '%',
    improvement: 87.5
  },
  {
    metric: 'Payment Delay',
    centralized: 18.5,
    decentralized: 0.8,
    unit: 'days',
    improvement: 95.7
  },
  {
    metric: 'Transparency',
    centralized: 35,
    decentralized: 95,
    unit: 'score',
    improvement: 171
  },
  {
    metric: 'Trust Score',
    centralized: 45,
    decentralized: 92,
    unit: 'score',
    improvement: 104
  },
  {
    metric: 'Single Point Failure',
    centralized: 85,
    decentralized: 5,
    unit: 'risk %',
    improvement: -94
  }
];

const technologyStackData = [
  { layer: 'User Interface', tech: 'Web3 DApp', color: '#3b82f6' },
  { layer: 'Smart Contracts', tech: 'Ethereum/Solidity', color: '#10b981' },
  { layer: 'IoT Integration', tech: 'Sensor Network', color: '#f59e0b' },
  { layer: 'Communication', tech: 'gRPC Streaming', color: '#8b5cf6' },
  { layer: 'Data Layer', tech: 'Blockchain Ledger', color: '#ec4899' }
];

const researchGapData = [
  {
    study: 'Baseline\n(No System)',
    automation: 10,
    transparency: 15,
    efficiency: 20,
    integration: 5,
    realtime: 10,
    type: 'baseline'
  },
  {
    study: 'Blockchain\nOnly [14,15]',
    automation: 60,
    transparency: 85,
    efficiency: 55,
    integration: 30,
    realtime: 35,
    type: 'prior'
  },
  {
    study: 'IoT\nOnly [9,10]',
    automation: 70,
    transparency: 40,
    efficiency: 75,
    integration: 45,
    realtime: 80,
    type: 'prior'
  },
  {
    study: 'Single Vendor\n[17,18]',
    automation: 65,
    transparency: 70,
    efficiency: 60,
    integration: 35,
    realtime: 50,
    type: 'prior'
  },
  {
    study: 'STC Ultimate\n(This Work)',
    automation: 95,
    transparency: 98,
    efficiency: 93,
    integration: 92,
    realtime: 96,
    type: 'proposed'
  }
];

// Radar chart data - properly formatted for multi-metric visualization
const radarChartData = [
  {
    metric: 'Automation',
    'Prior Work (Avg)': 65,
    'STC Ultimate': 95,
    fullMark: 100
  },
  {
    metric: 'Transparency',
    'Prior Work (Avg)': 65,
    'STC Ultimate': 98,
    fullMark: 100
  },
  {
    metric: 'Efficiency',
    'Prior Work (Avg)': 63,
    'STC Ultimate': 93,
    fullMark: 100
  },
  {
    metric: 'Integration',
    'Prior Work (Avg)': 37,
    'STC Ultimate': 92,
    fullMark: 100
  },
  {
    metric: 'Real-time',
    'Prior Work (Avg)': 55,
    'STC Ultimate': 96,
    fullMark: 100
  }
];

const researchContributions = [
  {
    id: 1,
    title: 'Real-time IoT Event Verification',
    description: 'Direct integration of IoT sensors with blockchain payment release',
    impact: 'Enables trustless automation of multi-party settlements',
    innovation: 'High',
    icon: Zap
  },
  {
    id: 2,
    title: 'Multi-vendor Coordination',
    description: 'Automated escrow smart contracts for fair payment distribution',
    impact: 'Eliminates intermediary dependencies',
    innovation: 'High',
    icon: Network
  },
  {
    id: 3,
    title: 'Sub-second Latency',
    description: 'gRPC streaming for IoT-blockchain communication',
    impact: 'Production-ready system responsiveness',
    innovation: 'Medium',
    icon: TrendingUp
  }
];

const performanceMetricsData = [
  {
    metric: 'Transaction Speed',
    before: 420,
    after: 2.3,
    unit: 'seconds',
    target: 5
  },
  {
    metric: 'Cost per Transaction',
    before: 18.5,
    after: 0.75,
    unit: 'USD',
    target: 2
  },
  {
    metric: 'Success Rate',
    before: 87.2,
    after: 98.6,
    unit: '%',
    target: 95
  },
  {
    metric: 'Dispute Resolution',
    before: 168,
    after: 2.5,
    unit: 'hours',
    target: 24
  }
];

const IntroductionVisualizations: React.FC<IntroductionVisualizationsProps> = ({
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<string>('problem');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'json'>('pdf');

  const handleExport = async (format: 'pdf' | 'png' | 'json'): Promise<void> => {
    if (format === 'json') {
      const exportData = {
        problemComparison: problemComparisonData,
        technologyStack: technologyStackData,
        researchGap: researchGapData,
        contributions: researchContributions,
        performanceMetrics: performanceMetricsData,
        metadata: {
          chapter: 'Introduction (Chapter 1)',
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `chapter1-introduction-data-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      if (onExport) onExport(format);
      return;
    }

    const element = document.getElementById('introduction-visualizations');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      logging: false
    });

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `chapter1-introduction-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`chapter1-introduction-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    if (onExport) onExport(format);
  };

  const getInnovationColor = (level: string): string => {
    switch (level) {
      case 'High': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Low': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-blue mb-1 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Chapter 1: Introduction Visualizations
          </h2>
          <p className="text-gray-400">
            Visual representations of problem statement, technology stack, and research contributions
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleExport('pdf')}
            variant="outline"
            size="sm"
            className="border-neon-blue/50 hover:bg-neon-blue/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => handleExport('png')}
            variant="outline"
            size="sm"
            className="border-neon-green/50 hover:bg-neon-green/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
          <Button
            onClick={() => handleExport('json')}
            variant="outline"
            size="sm"
            className="border-purple-500/50 hover:bg-purple-500/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div id="introduction-visualizations">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            <TabsTrigger value="problem" className="data-[state=active]:bg-neon-blue/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Problem
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-neon-green/20">
              <Layers className="h-4 w-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="gap" className="data-[state=active]:bg-orange-500/20">
              <Target className="h-4 w-4 mr-2" />
              Research Gap
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-purple-500/20">
              <Award className="h-4 w-4 mr-2" />
              Contributions
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-cyan-500/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Problem Statement Tab */}
          <TabsContent value="problem" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-blue flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Centralized vs Decentralized Tourism Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Comparison Bars */}
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={problemComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="#9ca3af"
                        angle={-15}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="centralized" 
                        fill="#ef4444" 
                        name="Centralized System"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar 
                        dataKey="decentralized" 
                        fill="#10b981" 
                        name="STC Ultimate (Decentralized)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Problem Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <h4 className="font-semibold text-red-400">High Fees</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        15-25% transaction fees in centralized platforms [3]
                      </p>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <h4 className="font-semibold text-orange-400">Payment Delays</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        7-30 days settlement period [4]
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-yellow-400" />
                        <h4 className="font-semibold text-yellow-400">Trust Issues</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        Single point of failure & data manipulation [6]
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  STC Ultimate Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Architecture Layers */}
                  <div className="space-y-3">
                    {technologyStackData.map((layer, index) => (
                      <div
                        key={layer.layer}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-700 bg-black/20"
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: layer.color
                        }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: layer.color }}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{layer.layer}</div>
                          <div className="text-sm text-gray-400">{layer.tech}</div>
                        </div>
                        {index === 0 && <Smartphone className="h-5 w-5 text-blue-400" />}
                        {index === 1 && <Server className="h-5 w-5 text-green-400" />}
                        {index === 2 && <Zap className="h-5 w-5 text-orange-400" />}
                        {index === 3 && <Network className="h-5 w-5 text-purple-400" />}
                        {index === 4 && <Database className="h-5 w-5 text-pink-400" />}
                      </div>
                    ))}
                  </div>

                  {/* Key Technologies Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                      <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="font-semibold text-white text-sm">Blockchain</div>
                      <div className="text-xs text-gray-400">Ethereum</div>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                      <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="font-semibold text-white text-sm">IoT Network</div>
                      <div className="text-xs text-gray-400">Real-time Sensors</div>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
                      <Network className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="font-semibold text-white text-sm">gRPC Streaming</div>
                      <div className="text-xs text-gray-400">Sub-second Sync</div>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
                      <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <div className="font-semibold text-white text-sm">Smart Contracts</div>
                      <div className="text-xs text-gray-400">Solidity</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Gap Tab */}
          <TabsContent value="gap" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Research Positioning & Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Radar Chart */}
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarChartData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis 
                        dataKey="metric" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                      <Radar
                        name="Prior Work (Avg)"
                        dataKey="Prior Work (Avg)"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="STC Ultimate"
                        dataKey="STC Ultimate"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.5}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>

                  {/* Gap Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Research Gap Identified
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• No multi-vendor IoT-blockchain integration [16]</li>
                        <li>• Lack of real-time event-triggered payments [17]</li>
                        <li>• Missing production-level tourism frameworks [12,13]</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        STC Ultimate Solution
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Unified blockchain-IoT framework</li>
                        <li>• Automated multi-vendor coordination</li>
                        <li>• Production-ready tourism ecosystem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Research Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchContributions.map((contribution, index) => {
                    const IconComponent = contribution.icon;
                    return (
                      <div
                        key={contribution.id}
                        className="p-4 rounded-lg border border-gray-700 bg-black/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{contribution.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={getInnovationColor(contribution.innovation)}
                              >
                                {contribution.innovation} Impact
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">
                              {contribution.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="text-gray-400">Impact:</span>
                              <span className="text-neon-green">{contribution.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Contribution Flow */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Innovation Flow
                  </h4>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex-1 text-center">
                      <div className="text-gray-400 mb-1">IoT Sensors</div>
                      <Zap className="h-5 w-5 text-orange-400 mx-auto" />
                    </div>
                    <div className="text-gray-600">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-gray-400 mb-1">gRPC Stream</div>
                      <Network className="h-5 w-5 text-purple-400 mx-auto" />
                    </div>
                    <div className="text-gray-600">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-gray-400 mb-1">Smart Contract</div>
                      <Shield className="h-5 w-5 text-green-400 mx-auto" />
                    </div>
                    <div className="text-gray-600">→</div>
                    <div className="flex-1 text-center">
                      <div className="text-gray-400 mb-1">Multi-vendor Pay</div>
                      <CheckCircle2 className="h-5 w-5 text-neon-blue mx-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Expected Performance Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Comparison */}
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={performanceMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="#9ca3af"
                        angle={-15}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="before" 
                        fill="#ef4444" 
                        name="Before (Centralized)"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar 
                        dataKey="after" 
                        fill="#10b981" 
                        name="After (STC Ultimate)"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar 
                        dataKey="target" 
                        fill="#3b82f6" 
                        name="Target Threshold"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Improvement Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {performanceMetricsData.map((metric) => {
                      const improvement = ((metric.before - metric.after) / metric.before * 100).toFixed(1);
                      return (
                        <div key={metric.metric} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">{metric.metric}</div>
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {improvement}%
                          </div>
                          <div className="text-xs text-gray-500">improvement</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Key Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-blue-400" />
                        <h4 className="font-semibold text-blue-400">Sub-5s Transactions</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        Achieved &lt;3s average via gRPC streaming
                      </p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <h4 className="font-semibold text-green-400">98.6% Success Rate</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        Exceeds 95% target through automated verification
                      </p>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <h4 className="font-semibold text-purple-400">96% Cost Reduction</h4>
                      </div>
                      <p className="text-sm text-gray-300">
                        From $18.50 to $0.75 per transaction
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntroductionVisualizations;
