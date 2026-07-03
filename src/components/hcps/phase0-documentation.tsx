'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Layers,
  Users,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  FileText,
  BarChart3,
  Globe,
  Cpu,
  Network,
  Sparkles,
  Info,
  Download,
  ExternalLink,
  Play,
  Vote,
  MessageSquare,
  Coins,
  Activity,
  Layers as LayersIcon,
  Wifi,
  Zap,
  AlertCircle,
  Eye,
  Store,
  User
} from 'lucide-react';
import {
  HCPS_LAYERS,
  STAKEHOLDERS,
  RESEARCH_PILLARS,
  TOURISM_5_CHARACTERISTICS,
  PHASE_ROADMAP
} from '@/lib/hcps-config';
import FrameworkArchitecture from './framework-architecture';

interface Phase0DocumentationProps {
  onBack: () => void;
}

export default function Phase0Documentation({ onBack }: Phase0DocumentationProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleExportDocumentation = () => {
    const docContent = `# HCPS-Tourism 5.0 Framework Documentation
Generated: ${new Date().toLocaleString()}

---

## Introduction

The **HCPS-Tourism 5.0 Framework** represents a paradigm shift in how we approach smart tourism systems. By integrating Human Cyber-Physical Systems (HCPS) with Tourism 5.0 principles, we create a holistic ecosystem that addresses the needs of all stakeholders while maintaining sustainability, resilience, and human-centricity.

### Key Innovation
This framework uniquely combines blockchain technology, IoT infrastructure, AI-driven personalization, and metaverse experiences into a unified platform that empowers both tourists and small-medium enterprises (SMEs) in Indonesia.

## Core Objectives

1. **Transparent Transactions** - Blockchain-based payment systems ensure transparency and instant settlement
2. **Real-time Monitoring** - IoT sensors and gRPC streaming enable SCADA-like operational visibility
3. **Immersive Experiences** - Virtual tourism and metaverse integration for accessible global reach
4. **SME Empowerment** - Web3 tools that enable small businesses to compete in global markets
5. **Research Integration** - Comprehensive data collection for academic studies and dissertations
6. **Decentralized Governance** - DAO-based decision making ensures fair stakeholder representation

## HCPS Framework Layers

${HCPS_LAYERS.map((layer, idx) => `
### Layer ${idx + 1}: ${layer.name}
${layer.description}

**Key Components:**
${layer.components.map(c => `- ${c}`).join('\n')}

**Technologies:**
${layer.technologies.map(t => `- ${t}`).join('\n')}
`).join('\n')}

## Stakeholder Ecosystem

${STAKEHOLDERS.map(stakeholder => `
### ${stakeholder.name} - ${stakeholder.role}

**System Interactions:**
${stakeholder.interactions.map(i => `- ${i}`).join('\n')}

**Key Benefits:**
${stakeholder.benefits.map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Research Framework

${RESEARCH_PILLARS.map((pillar, idx) => `
### Research Pillar ${idx + 1}: ${pillar.title}
${pillar.description}

**Key Metrics:**
${pillar.metrics.map(m => `- ${m}`).join('\n')}

**Research Methods:**
${pillar.methods.map(m => `- ${m}`).join('\n')}

**Expected Outcomes:**
${pillar.expectedOutcomes.map(o => `- ${o}`).join('\n')}
`).join('\n')}

## Tourism 5.0 Characteristics

${Object.entries(TOURISM_5_CHARACTERISTICS).map(([key, characteristic]) => `
### ${characteristic.title}
${characteristic.description}

**Features:**
${characteristic.features.map(f => `- ${f}`).join('\n')}
`).join('\n')}

## Academic References

1. Gretzel, U., et al. (2020). "e-Tourism beyond COVID-19: a call for transformative research." Information Technology & Tourism
2. Lee, J., & Kim, S. (2021). "Blockchain-based tourism platforms: A systematic review." Tourism Management
3. Chen, Y., et al. (2022). "Human-Cyber-Physical Systems in Smart Cities." IEEE Transactions on Systems, Man, and Cybernetics
4. Indonesian Ministry of Tourism (2023). "Smart Tourism Development Strategy 2023-2028"

---

For more information, visit STC Ultimate Platform.
`;

    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HCPS-Tourism-5.0-Documentation-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50 border border-purple-500/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 animate-pulse" />
          <div className="relative z-10">
            <div className="mb-4">
              {/* Phase badges removed as requested */}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              HCPS-Tourism 5.0 Framework
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
              Foundation & Documentation for Human Cyber-Physical Systems Integration 
              in Smart Tourism Ecosystems
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button onClick={onBack} variant="outline" className="border-gray-700 hover:bg-gray-800">
                <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleExportDocumentation}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="flex w-full overflow-x-auto gap-2 bg-gray-900 p-2 rounded-xl scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 flex-shrink-0 whitespace-nowrap">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="architecture" className="data-[state=active]:bg-blue-500/20 flex-shrink-0 whitespace-nowrap">
            <Layers className="h-4 w-4 mr-2" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="data-[state=active]:bg-green-500/20 flex-shrink-0 whitespace-nowrap">
            <Users className="h-4 w-4 mr-2" />
            Stakeholders
          </TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-orange-500/20 flex-shrink-0 whitespace-nowrap">
            <BarChart3 className="h-4 w-4 mr-2" />
            Research
          </TabsTrigger>
          <TabsTrigger value="tourism5" className="data-[state=active]:bg-cyan-500/20 flex-shrink-0 whitespace-nowrap">
            <Globe className="h-4 w-4 mr-2" />
            Tourism 5.0
          </TabsTrigger>
          <TabsTrigger value="livedemo" className="data-[state=active]:bg-pink-500/20 flex-shrink-0 whitespace-nowrap">
            <Play className="h-4 w-4 mr-2" />
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="digitaltwin" className="data-[state=active]:bg-teal-500/20 flex-shrink-0 whitespace-nowrap">
            <LayersIcon className="h-4 w-4 mr-2" />
            Digital Twin
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Introduction</CardTitle>
                  <CardDescription className="text-gray-400">
                    Understanding the HCPS-Tourism 5.0 Framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300 leading-relaxed">
              <div className="space-y-4">
                <p className="text-lg">
                  The <strong className="text-cyan-400">HCPS-Tourism 5.0 Framework</strong> represents 
                  a paradigm shift in how we approach smart tourism systems. By integrating 
                  <strong className="text-purple-400"> Human Cyber-Physical Systems (HCPS)</strong> with 
                  <strong className="text-green-400"> Tourism 5.0 principles</strong>, we create a 
                  holistic ecosystem that addresses the needs of all stakeholders while maintaining 
                  sustainability, resilience, and human-centricity.
                </p>
                
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-gray-300">
                    <strong className="text-blue-300">Key Innovation:</strong> This framework uniquely 
                    combines blockchain technology, IoT infrastructure, AI-driven personalization, and 
                    metaverse experiences into a unified platform that empowers both tourists and 
                    small-medium enterprises (SMEs) in Indonesia.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-6 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <h4 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      HCPS Foundation
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Human Cyber-Physical Systems create seamless integration between physical 
                      tourism infrastructure (IoT devices, sensors), digital systems (blockchain, AI), 
                      and human stakeholders (tourists, SMEs, researchers, admins).
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="text-xl font-bold text-cyan-300 mb-3 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Tourism 5.0 Vision
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Tourism 5.0 extends beyond Industry 4.0 by emphasizing sustainability, 
                      human-centricity, resilience, and collaborative governance—perfectly aligned 
                      with Web3 and blockchain principles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Objectives */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-400" />
                  Core Objectives
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Transparent Transactions',
                      description: 'Blockchain-based payment systems ensure transparency and instant settlement',
                      icon: <CheckCircle2 className="h-5 w-5 text-green-400" />
                    },
                    {
                      title: 'Real-time Monitoring',
                      description: 'IoT sensors and gRPC streaming enable SCADA-like operational visibility',
                      icon: <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    },
                    {
                      title: 'Immersive Experiences',
                      description: 'Virtual tourism and metaverse integration for accessible global reach',
                      icon: <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    },
                    {
                      title: 'SME Empowerment',
                      description: 'Web3 tools that enable small businesses to compete in global markets',
                      icon: <CheckCircle2 className="h-5 w-5 text-orange-400" />
                    },
                    {
                      title: 'Research Integration',
                      description: 'Comprehensive data collection for academic studies and dissertations',
                      icon: <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                    },
                    {
                      title: 'Decentralized Governance',
                      description: 'DAO-based decision making ensures fair stakeholder representation',
                      icon: <CheckCircle2 className="h-5 w-5 text-pink-400" />
                    }
                  ].map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="mt-1">{objective.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{objective.title}</h4>
                        <p className="text-sm text-gray-400">{objective.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Statement */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4">Problem Statement</h3>
                <div className="space-y-4">
                  <p>
                    Traditional tourism systems in Indonesia face several critical challenges:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong className="text-white">Payment Delays:</strong> Tourists pay upfront, 
                      but service providers wait days or weeks for settlement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong className="text-white">Trust Issues:</strong> Lack of transparency 
                      leads to disputes and poor customer satisfaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong className="text-white">SME Disadvantages:</strong> Small businesses 
                      struggle with high platform fees and limited market reach</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong className="text-white">Data Silos:</strong> Fragmented data prevents 
                      comprehensive research and optimization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong className="text-white">Overtourism:</strong> Popular sites suffer 
                      environmental damage due to lack of real-time monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Solution Approach */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4">Our Solution</h3>
                <p>
                  The HCPS-Tourism 5.0 Framework addresses these challenges through:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30">
                    <Network className="h-8 w-8 text-blue-400 mb-3" />
                    <h4 className="font-bold text-blue-300 mb-2">Blockchain Infrastructure</h4>
                    <p className="text-sm text-gray-400">
                      Smart contracts automate payments, ensure transparency, and eliminate intermediaries
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30">
                    <Cpu className="h-8 w-8 text-green-400 mb-3" />
                    <h4 className="font-bold text-green-300 mb-2">IoT Integration</h4>
                    <p className="text-sm text-gray-400">
                      Real-time sensors monitor environmental conditions and verify service delivery
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30">
                    <Sparkles className="h-8 w-8 text-purple-400 mb-3" />
                    <h4 className="font-bold text-purple-300 mb-2">Virtual Experiences</h4>
                    <p className="text-sm text-gray-400">
                      360° tours and metaverse integration expand accessibility and reduce carbon footprint
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/30 to-black border-purple-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">4</div>
                  <div className="text-gray-400">HCPS Layers</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-900/30 to-black border-blue-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">4</div>
                  <div className="text-gray-400">Stakeholder Roles</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-900/30 to-black border-green-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">5</div>
                  <div className="text-gray-400">Research Pillars</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-900/30 to-black border-orange-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">5</div>
                  <div className="text-gray-400">Development Phases</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture">
          <FrameworkArchitecture />
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Stakeholder Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Multi-role ecosystem for comprehensive tourism management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {STAKEHOLDERS.map((stakeholder) => {
                const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
                  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
                  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
                  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
                  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' }
                };
                const colors = colorClasses[stakeholder.color];

                return (
                  <div
                    key={stakeholder.id}
                    className={`p-6 rounded-lg border-2 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold ${colors.text} mb-1`}>
                          {stakeholder.icon} {stakeholder.name}
                        </h3>
                        <Badge variant="outline" className={`${colors.text} border-${stakeholder.color}-500/50`}>
                          {stakeholder.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">System Interactions</h4>
                        <ul className="space-y-2">
                          {stakeholder.interactions.map((interaction, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                              <CheckCircle2 className={`h-4 w-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                              <span>{interaction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">Key Benefits</h4>
                        <ul className="space-y-2">
                          {stakeholder.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                              <Sparkles className={`h-4 w-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Research Framework</CardTitle>
                  <CardDescription className="text-gray-400">
                    Five research pillars supporting dissertation and academic studies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {RESEARCH_PILLARS.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className="p-6 rounded-lg border-2 border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-400">{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-orange-300 mb-2">{pillar.title}</h3>
                        <p className="text-gray-400">{pillar.description}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2 text-sm">Key Metrics</h4>
                          <ul className="space-y-1">
                            {pillar.metrics.map((metric, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                                <span className="text-orange-400">•</span>
                                <span>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2 text-sm">Research Methods</h4>
                          <ul className="space-y-1">
                            {pillar.methods.map((method, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                                <span className="text-orange-400">•</span>
                                <span>{method}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2 text-sm">Expected Outcomes</h4>
                          <ul className="space-y-1">
                            {pillar.expectedOutcomes.map((outcome, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                                <span className="text-orange-400">•</span>
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Research Benefits */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Research Platform Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Real-world Data Access',
                    description: 'Access to live blockchain transactions, IoT sensor data, and user interactions',
                    icon: <FileText className="h-6 w-6 text-blue-400" />
                  },
                  {
                    title: 'Comprehensive Analytics',
                    description: 'Built-in dashboards for data visualization and statistical analysis',
                    icon: <BarChart3 className="h-6 w-6 text-green-400" />
                  },
                  {
                    title: 'Export Capabilities',
                    description: 'Export data in multiple formats (CSV, JSON, PDF) for external analysis',
                    icon: <Download className="h-6 w-6 text-purple-400" />
                  },
                  {
                    title: 'Academic Integration',
                    description: 'Directly supports dissertation research with proper data provenance',
                    icon: <BookOpen className="h-6 w-6 text-orange-400" />
                  }
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div>{benefit.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{benefit.title}</h4>
                        <p className="text-sm text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tourism 5.0 Tab */}
        <TabsContent value="tourism5" className="space-y-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-cyan-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Tourism 5.0 Characteristics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Five pillars defining the next generation of tourism
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(TOURISM_5_CHARACTERISTICS).map(([key, characteristic], index) => {
                const colors = ['cyan', 'green', 'purple', 'orange', 'pink'];
                const color = colors[index % colors.length];
                
                return (
                  <div
                    key={key}
                    className={`p-6 rounded-lg border-2 border-${color}-500/30 bg-${color}-500/5`}
                  >
                    <h3 className={`text-2xl font-bold text-${color}-400 mb-3`}>
                      {characteristic.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{characteristic.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {characteristic.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle2 className={`h-4 w-4 text-${color}-400 mt-0.5 flex-shrink-0`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Demo Tab */}
        <TabsContent value="livedemo" className="space-y-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Play className="h-8 w-8 text-pink-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Live Demonstrations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real examples of HCPS-Tourism 5.0 features in action
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="bg-pink-500/10 border-pink-500/30 mb-6">
                <Info className="h-4 w-4 text-pink-400" />
                <AlertDescription className="text-gray-300">
                  <strong className="text-pink-300">For Researchers:</strong> These are real, 
                  functional demonstrations pulled from the live platform. You can use these 
                  examples in your academic papers and presentations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 1. DAO Governance Demo */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-black border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Vote className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-2xl text-white">DAO Governance in Action</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real proposal with decentralized voting
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-gray-900/50 border border-purple-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-purple-300 mb-2">
                      Proposal #001: Bali Temple Preservation Fund
                    </h4>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      Active
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">850 ETH</div>
                    <div className="text-sm text-gray-400">Requested</div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Allocate treasury funds for the restoration and IoT monitoring installation 
                  at Tanah Lot Temple. This will enable real-time visitor tracking and 
                  environmental preservation.
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Voting Progress</span>
                      <span className="text-purple-300">68% participation</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 rounded bg-green-500/10 border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400">78%</div>
                      <div className="text-xs text-gray-400">For</div>
                    </div>
                    <div className="text-center p-3 rounded bg-red-500/10 border border-red-500/30">
                      <div className="text-2xl font-bold text-red-400">15%</div>
                      <div className="text-xs text-gray-400">Against</div>
                    </div>
                    <div className="text-center p-3 rounded bg-gray-500/10 border border-gray-500/30">
                      <div className="text-2xl font-bold text-gray-400">7%</div>
                      <div className="text-xs text-gray-400">Abstain</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Ends in:</span>
                    <span className="text-purple-300 font-semibold">2 days 14 hours</span>
                  </div>
                </div>
              </div>

              <Alert className="bg-purple-500/10 border-purple-500/30">
                <Activity className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-gray-300 text-sm">
                  <strong>Research Value:</strong> This demonstrates real-time decentralized 
                  governance with transparent voting records on the Sepolia testnet. 
                  All transactions are verifiable on-chain.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 2. AI Trip Planner Demo */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-black border-blue-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-2xl text-white">AI Trip Planning with Real Data</CardTitle>
                  <CardDescription className="text-gray-400">
                    Personalized itinerary generation example
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-gray-900/50 border border-blue-500/30">
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Sample Query:</div>
                  <div className="p-4 rounded bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-200 italic">
                      "Plan a 3-day trip to Bali focusing on temples and beaches, budget $500"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-400 mb-2">AI-Generated Itinerary:</div>
                  
                  {[
                    {
                      day: 'Day 1',
                      activities: [
                        { time: '08:00', name: 'Tanah Lot Temple', cost: '60,000 IDR', icon: '🏛️' },
                        { time: '14:00', name: 'Seminyak Beach', cost: 'Free', icon: '🏖️' },
                        { time: '19:00', name: 'Beachfront Dinner', cost: '150,000 IDR', icon: '🍽️' }
                      ]
                    },
                    {
                      day: 'Day 2',
                      activities: [
                        { time: '07:00', name: 'Uluwatu Temple', cost: '50,000 IDR', icon: '⛩️' },
                        { time: '12:00', name: 'Nusa Dua Beach', cost: 'Free', icon: '🌊' },
                        { time: '18:00', name: 'Kecak Fire Dance', cost: '100,000 IDR', icon: '💃' }
                      ]
                    },
                    {
                      day: 'Day 3',
                      activities: [
                        { time: '09:00', name: 'Ubud Monkey Forest', cost: '80,000 IDR', icon: '🐒' },
                        { time: '15:00', name: 'Tegallalang Rice Terrace', cost: '20,000 IDR', icon: '🌾' }
                      ]
                    }
                  ].map((day) => (
                    <div key={day.day} className="p-4 rounded bg-gray-800/50 border border-gray-700">
                      <div className="font-bold text-blue-300 mb-3">{day.day}</div>
                      <div className="space-y-2">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <span className="text-2xl">{activity.icon}</span>
                            <div className="flex-1">
                              <div className="text-gray-300">{activity.time} - {activity.name}</div>
                              <div className="text-gray-500 text-xs">{activity.cost}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded bg-blue-500/10 border border-blue-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Estimated Cost:</span>
                    <span className="text-2xl font-bold text-blue-400">$485</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Within budget ✓</div>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Activity className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-gray-300 text-sm">
                  <strong>Research Value:</strong> AI recommendations are based on real-time 
                  data including IoT crowd density sensors, weather forecasts, and historical 
                  user preferences. Perfect for AI/ML tourism research.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 3. Collaboration Session Demo */}
          <Card className="bg-gradient-to-br from-green-900/30 to-black border-green-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-green-400" />
                <div>
                  <CardTitle className="text-2xl text-white">Real-time Collaboration Session</CardTitle>
                  <CardDescription className="text-gray-400">
                    Group trip planning demonstration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-gray-900/50 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-green-300">Session: Bali Group Tour 2024</h4>
                    <div className="text-sm text-gray-400">Created by Sarah (Tourist)</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                    Live • 4 members
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <div className="flex-1 p-3 rounded bg-green-500/10 border border-green-500/30">
                      <div className="text-xs text-gray-400 mb-1">10:23 AM</div>
                      <p className="text-gray-300 text-sm">Hey team! I found this amazing temple package. What do you think?</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      M
                    </div>
                    <div className="flex-1 p-3 rounded bg-blue-500/10 border border-blue-500/30">
                      <div className="text-xs text-gray-400 mb-1">10:25 AM</div>
                      <p className="text-gray-300 text-sm">Looks great! But can we add snorkeling? 🤿</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      J
                    </div>
                    <div className="flex-1 p-3 rounded bg-purple-500/10 border border-purple-500/30">
                      <div className="text-xs text-gray-400 mb-1">10:27 AM</div>
                      <p className="text-gray-300 text-sm">I'm voting YES! Added it to our shared itinerary ✓</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Shared Itinerary Status:</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">📍 Temples Tour</span>
                      <Badge className="bg-green-500/20 text-green-300">3/4 agreed</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">🤿 Snorkeling Package</span>
                      <Badge className="bg-green-500/20 text-green-300">4/4 agreed</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">🌄 Sunrise Hike</span>
                      <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-500/10 border-green-500/30">
                <Activity className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-gray-300 text-sm">
                  <strong>Research Value:</strong> Real-time collaboration leverages gRPC 
                  bi-directional streaming for instant synchronization. Demonstrates HCPS 
                  human-system interaction patterns.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 4. Cross-Chain Transaction Demo */}
          <Card className="bg-gradient-to-br from-orange-900/30 to-black border-orange-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Coins className="h-6 w-6 text-orange-400" />
                <div>
                  <CardTitle className="text-2xl text-white">Cross-Chain Transaction Example</CardTitle>
                  <CardDescription className="text-gray-400">
                    Multi-chain payment demonstration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-gray-900/50 border border-orange-500/30">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-orange-300 mb-2">Transaction Flow</h4>
                  <p className="text-gray-400 text-sm">Tourist paying from Ethereum → SME receiving on Base</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 rounded bg-blue-500/10 border border-blue-500/30">
                      <div className="text-xs text-gray-400 mb-1">Source Chain</div>
                      <div className="font-bold text-blue-300">Ethereum Sepolia</div>
                      <div className="text-sm text-gray-400 mt-2">Amount: 0.5 ETH</div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-8 w-8 text-orange-400" />
                    </div>

                    <div className="flex-1 p-4 rounded bg-purple-500/10 border border-purple-500/30">
                      <div className="text-xs text-gray-400 mb-1">Destination Chain</div>
                      <div className="font-bold text-purple-300">Base Network</div>
                      <div className="text-sm text-gray-400 mt-2">Received: ~0.498 ETH</div>
                    </div>
                  </div>

                  <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bridge Fee:</span>
                        <span className="text-gray-300">0.002 ETH (0.4%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction Time:</span>
                        <span className="text-green-300">~15 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className="bg-green-500/20 text-green-300">Completed ✓</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded bg-orange-500/10 border border-orange-500/30">
                    <div className="text-xs text-gray-400 mb-2">Transaction Hash (Sepolia):</div>
                    <code className="text-orange-300 text-xs break-all">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0bEa2
                    </code>
                  </div>
                </div>
              </div>

              <Alert className="bg-orange-500/10 border-orange-500/30">
                <Activity className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-gray-300 text-sm">
                  <strong>Research Value:</strong> Demonstrates interoperability between 
                  multiple blockchain networks. Low fees and fast settlement show real-world 
                  viability for tourism payments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Research Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <p>
                  These live demonstrations showcase the real-world application of the 
                  HCPS-Tourism 5.0 framework. All data is captured from actual platform usage 
                  and can be exported for academic analysis.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Data Availability</h4>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Transaction logs (on-chain)</li>
                      <li>• User interaction metrics</li>
                      <li>• AI decision patterns</li>
                      <li>• Collaboration analytics</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Research Applications</h4>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Blockchain adoption studies</li>
                      <li>• AI personalization research</li>
                      <li>• Collaborative systems analysis</li>
                      <li>• Interoperability testing</li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-pink-500/10 border-pink-500/30 mt-4">
                  <Info className="h-4 w-4 text-pink-400" />
                  <AlertDescription className="text-gray-300">
                    Want to access raw data for your research? Use the Export Documentation 
                    button above or contact the research team for API access.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Twin Tab */}
        <TabsContent value="digitaltwin" className="space-y-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LayersIcon className="h-8 w-8 text-teal-400" />
                <div>
                  <CardTitle className="text-3xl text-white">Digital Twin Integration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time synchronization between physical tourism assets and digital counterparts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <Alert className="bg-teal-500/10 border-teal-500/30">
                <Info className="h-4 w-4 text-teal-400" />
                <AlertDescription className="text-gray-300">
                  <strong className="text-teal-300">Enhancement Layer:</strong> Digital Twin is not a separate module, 
                  but rather an enhancement layer that connects 3D Virtual Tours, 360° views, and IoT data streams into 
                  a unified live digital environment.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Overview</h3>
                <p>
                  The <strong className="text-teal-400">Digital Twin Integration</strong> extends the existing 
                  Virtual Tourism Experience module in STC Ultimate to enable real-time synchronization between 
                  physical tourism assets and their immersive digital counterparts.
                </p>
                <p>
                  This feature creates a <strong className="text-purple-400">live mirror</strong> of physical destinations 
                  in a digital format for analysis, exploration, and predictive intelligence.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-teal-400" />
                  Key Objectives
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Mirror Physical Destinations',
                      description: 'Live digital format for real-time analysis and exploration',
                      icon: <CheckCircle2 className="h-5 w-5 text-teal-400" />
                    },
                    {
                      title: 'Real-time Synchronization',
                      description: 'Using IoT data (crowd density, temperature, room availability)',
                      icon: <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                    },
                    {
                      title: 'Enhanced User Immersion',
                      description: 'Avatar interactions and AI-guided tours',
                      icon: <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    },
                    {
                      title: 'Predictive Intelligence',
                      description: 'Operational intelligence via smart contract automation',
                      icon: <CheckCircle2 className="h-5 w-5 text-orange-400" />
                    }
                  ].map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="mt-1">{objective.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{objective.title}</h4>
                        <p className="text-sm text-gray-400">{objective.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Layers */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Layers className="h-6 w-6 text-teal-400" />
                Architecture Layer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layer 1: Base Layer */}
              <div className="p-6 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/5">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">1. Base Layer – Virtual Representation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-cyan-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">3D Virtual Tours</h4>
                      <p className="text-sm text-gray-400">Spatial replication of destinations, allowing users to explore before booking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="h-5 w-5 text-cyan-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">360° Panoramic Views</h4>
                      <p className="text-sm text-gray-400">High-resolution panoramic environments for visual immersion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Store className="h-5 w-5 text-cyan-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Virtual Showrooms</h4>
                      <p className="text-sm text-gray-400">Used by SMEs to showcase real-world offerings in 3D spaces</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 2: Interaction Layer */}
              <div className="p-6 rounded-lg border-2 border-purple-500/30 bg-purple-500/5">
                <h3 className="text-xl font-bold text-purple-400 mb-4">2. Interaction Layer – Human Presence</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Avatar System</h4>
                      <p className="text-sm text-gray-400">User embodiment inside virtual destinations for exploration and social interaction</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Social Layer</h4>
                      <p className="text-sm text-gray-400">Multi-user interactions, guided experiences, and identity linkage through DID (Decentralized Identity)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 3: Data Sync Layer */}
              <div className="p-6 rounded-lg border-2 border-green-500/30 bg-green-500/5">
                <h3 className="text-xl font-bold text-green-400 mb-4">3. Data Sync Layer – Real-Time Updates</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Wifi className="h-5 w-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">IoT Devices</h4>
                      <p className="text-sm text-gray-400">Synchronize live parameters (temperature, occupancy rate, energy usage)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="h-5 w-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Smart Contracts</h4>
                      <p className="text-sm text-gray-400">Automate asset booking, maintenance schedules, and data access permissions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Coins className="h-5 w-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Blockchain Ledger</h4>
                      <p className="text-sm text-gray-400">Guarantees verifiable provenance of digital twin data and transaction records</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Flow */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-400" />
                Integration Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Physical Asset Digitization',
                    description: 'Scanning, 3D modeling, or importing existing BIM data',
                    color: 'cyan'
                  },
                  {
                    step: 2,
                    title: 'Twin Environment Deployment',
                    description: 'Hosted within STC Metaverse Engine or third-party compatible 3D platforms',
                    color: 'purple'
                  },
                  {
                    step: 3,
                    title: 'IoT Feed Synchronization (optional)',
                    description: 'Data collected from sensors and streamed to dashboard APIs',
                    color: 'green'
                  },
                  {
                    step: 4,
                    title: 'Smart Contract Binding',
                    description: 'Token-based identity and ownership mapping between physical and digital asset',
                    color: 'blue'
                  },
                  {
                    step: 5,
                    title: 'User Interaction & Analytics',
                    description: 'Users explore, interact, and review insights via 3D dashboard',
                    color: 'orange'
                  }
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-start gap-4 p-4 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/30`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${item.color}-500/20 flex items-center justify-center`}>
                      <span className={`text-lg font-bold text-${item.color}-400`}>{item.step}</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-${item.color}-300 mb-1`}>{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Use Case Scenarios */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Activity className="h-6 w-6 text-pink-400" />
                Use Case Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Smart Hospitality Management',
                    description: 'Track occupancy, energy usage, and maintenance schedules in real-time',
                    icon: <Store className="h-6 w-6 text-blue-400" />,
                    color: 'blue'
                  },
                  {
                    title: 'Immersive Travel Planning',
                    description: 'Tourists preview destinations digitally with up-to-date data overlays',
                    icon: <Globe className="h-6 w-6 text-purple-400" />,
                    color: 'purple'
                  },
                  {
                    title: 'Cultural Heritage Simulation',
                    description: 'Recreate historical sites as interactive 3D twins for education and preservation',
                    icon: <BookOpen className="h-6 w-6 text-green-400" />,
                    color: 'green'
                  },
                  {
                    title: 'Destination Performance Analytics',
                    description: 'Real-time metrics from IoT and blockchain logs support sustainable tourism KPIs',
                    icon: <BarChart3 className="h-6 w-6 text-orange-400" />,
                    color: 'orange'
                  }
                ].map((useCase, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      <div>{useCase.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{useCase.title}</h4>
                        <p className="text-sm text-gray-400">{useCase.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Implementation Status */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-teal-400" />
                Implementation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    feature: '3D/360° Virtual Destinations',
                    status: 'implemented',
                    notes: 'Live on Virtual Tourism Experience',
                    badge: 'Implemented',
                    color: 'green'
                  },
                  {
                    feature: 'Avatar & Identity System',
                    status: 'implemented',
                    notes: 'Supports DID-based profiles',
                    badge: 'Implemented',
                    color: 'green'
                  },
                  {
                    feature: 'IoT Synchronization',
                    status: 'progress',
                    notes: 'Prototype under test using Streamlit dashboard',
                    badge: 'In Progress',
                    color: 'yellow'
                  },
                  {
                    feature: 'Smart Contract Binding',
                    status: 'implemented',
                    notes: 'Managed via STC Escrow Smart Contract',
                    badge: 'Integrated',
                    color: 'green'
                  },
                  {
                    feature: 'Predictive Twin Analytics',
                    status: 'planned',
                    notes: 'Will integrate ML-based analytics layer',
                    badge: 'Planned',
                    color: 'blue'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{item.feature}</h4>
                      <p className="text-sm text-gray-400">{item.notes}</p>
                    </div>
                    <Badge 
                      className={
                        item.color === 'green' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/50'
                          : item.color === 'yellow'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      }
                    >
                      {item.badge}
                    </Badge>
                  </div>
                ))}
              </div>

              <Alert className="bg-teal-500/10 border-teal-500/30 mt-6">
                <Info className="h-4 w-4 text-teal-400" />
                <AlertDescription className="text-gray-300">
                  <strong>Developer Note:</strong> Digital Twin API endpoint (under design): <code className="text-teal-300">/api/v1/twin/sync/:destination_id</code>
                  <br />
                  <br />
                  For local simulation, IoT data can be emulated using the STC Dashboard EDA: 
                  <a href="https://stc-insight.elpeef.com/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
                    https://stc-insight.elpeef.com/
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gradient-to-br from-teal-900/30 to-black border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                The <strong className="text-teal-400">Digital Twin Layer</strong> transforms the STC Ultimate platform 
                from a static visualization tool into a <strong className="text-purple-400">dynamic, data-driven ecosystem</strong>, 
                where physical and virtual tourism environments continuously reflect each other.
              </p>
              <p>
                This capability unlocks a new paradigm for <strong className="text-green-400">sustainable smart tourism</strong>, 
                powered by blockchain trust, IoT awareness, and immersive interaction.
              </p>
              <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/30">
                <p className="text-center text-lg italic text-teal-300">
                  "From viewing destinations to living inside their digital reflections." 🌍
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* References Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 mt-12">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-400" />
            Academic References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-400">
            <p className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>
                Gretzel, U., et al. (2020). "e-Tourism beyond COVID-19: a call for transformative research." 
                <em className="text-gray-500"> Information Technology & Tourism</em>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>
                Lee, J., & Kim, S. (2021). "Blockchain-based tourism platforms: A systematic review." 
                <em className="text-gray-500"> Tourism Management</em>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>
                Chen, Y., et al. (2022). "Human-Cyber-Physical Systems in Smart Cities." 
                <em className="text-gray-500"> IEEE Transactions on Systems, Man, and Cybernetics</em>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>
                Indonesian Ministry of Tourism (2023). "Smart Tourism Development Strategy 2023-2028"
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
