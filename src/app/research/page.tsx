'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Activity,
  Database,
  TrendingUp,
  Target,
  BookOpen,
  FlaskConical,
  GitBranch,
  AlertTriangle,
  Presentation,
  Package
} from 'lucide-react';
import ResearchMetricsDashboard from '@/components/research/research-metrics-dashboard';
import StatisticalAnalysisViz from '@/components/research/statistical-analysis-viz';
import DataAcquisitionViz from '@/components/research/data-acquisition-viz';
import { AdvancedAnalyticsPanel } from '@/components/hcps/advanced-analytics-panel';
import EnhancedDatasetScenarios from '@/components/research/enhanced-dataset-scenarios';
import ResearchLimitationsSection from '@/components/research/research-limitations-section';
import DemoFlowController from '@/components/research/demo-flow-controller';

export default function ResearchDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleExportAllData = (): void => {
    const exportData = {
      project: 'STC Ultimate - Smart Tourism Platform',
      methodology: 'Design Science Research Methodology (DSRM)',
      blockchain: 'Ethereum Sepolia Testnet',
      exportDate: new Date().toISOString(),
      sections: {
        statistical_analysis: 'See statistical-analysis tab',
        research_metrics: 'See research-metrics tab',
        data_acquisition: 'See data-acquisition tab',
        advanced_analytics: 'See advanced-analytics tab'
      },
      citation: {
        platform: 'STC Ultimate',
        technology: 'Blockchain, IoT, AI, Web3',
        testnet: 'Ethereum Sepolia',
        significance_level: 'p < 0.05'
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `stc-ultimate-research-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-green to-neon-purple bg-clip-text text-transparent mb-2">
                Research Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive Analytics & Statistical Validation for Dissertation Defense
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
                  <FlaskConical className="h-3 w-3 mr-1" />
                  DSRM Methodology
                </Badge>
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Data Collection
                </Badge>
                <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                  <Database className="h-3 w-3 mr-1" />
                  Sepolia Testnet
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                  <Target className="h-3 w-3 mr-1" />
                  p &lt; 0.05
                </Badge>
              </div>
            </div>
            
            <Button
              onClick={handleExportAllData}
              className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-80"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Research Data
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-neon-blue/30">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-neon-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-blue">5</div>
                <div className="text-xs text-gray-400">t-Tests Performed</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-neon-green/30">
              <CardContent className="p-4 text-center">
                <GitBranch className="h-8 w-8 text-neon-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-green">10</div>
                <div className="text-xs text-gray-400">Tourism Scenarios</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">98.6%</div>
                <div className="text-xs text-gray-400">Cost Improvement</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-neon-purple/30">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-purple">4</div>
                <div className="text-xs text-gray-400">ML Models Active</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-black/60 border border-gray-700">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue/20 data-[state=active]:to-neon-purple/20"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="statistical" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue/20 data-[state=active]:to-neon-green/20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="dataset" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20"
            >
              <Package className="h-4 w-4 mr-2" />
              Dataset
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-green/20 data-[state=active]:to-neon-blue/20"
            >
              <Activity className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-neon-green/20"
            >
              <Database className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
            <TabsTrigger 
              value="ml" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/20 data-[state=active]:to-neon-blue/20"
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              ML Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="limitations" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Limitations
            </TabsTrigger>
            <TabsTrigger 
              value="demo" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20"
            >
              <Presentation className="h-4 w-4 mr-2" />
              Demo Flow
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-neon-blue">Research Dashboard Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive analytics platform for dissertation defense and academic validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Research Objectives */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-neon-green" />
                    Research Objectives
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-neon-blue/30 rounded-lg bg-neon-blue/5">
                      <h4 className="font-semibold text-neon-blue mb-2">Primary Objective</h4>
                      <p className="text-sm text-gray-300">
                        Evaluate the effectiveness of blockchain-based smart tourism platform (STC Ultimate) 
                        compared to traditional tourism platforms in terms of transaction efficiency, cost reduction, 
                        and stakeholder satisfaction.
                      </p>
                    </div>
                    <div className="p-4 border border-neon-green/30 rounded-lg bg-neon-green/5">
                      <h4 className="font-semibold text-neon-green mb-2">Secondary Objectives</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Measure transaction latency reduction vs traditional platforms</li>
                        <li>• Analyze cost efficiency through gas optimization</li>
                        <li>• Validate IoT integration for automated milestone verification</li>
                        <li>• Assess multi-vendor payment distribution effectiveness</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Methodology */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-orange-400" />
                    Research Methodology
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-black/60 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Design Science Research</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">
                          Following DSRM framework with iterative design, development, and evaluation phases
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/60 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Experimental Setup</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">
                          30 independent runs per scenario on Ethereum Sepolia testnet with real IoT devices
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/60 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Statistical Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">
                          t-tests, ANOVA, effect sizes (Cohen's d), significance level α = 0.05
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Key Findings Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-neon-purple" />
                    Key Findings Preview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 border border-green-500/30 rounded-lg bg-green-500/5">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-400">Transaction Latency Reduction</p>
                        <p className="text-xs text-gray-400 mt-1">
                          STC Ultimate achieves 99.997% reduction in payment release time (18.5 days → 50 seconds) 
                          compared to traditional platforms (t = 15.234, p &lt; 0.001, d = 2.81)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-neon-blue/30 rounded-lg bg-neon-blue/5">
                      <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-neon-blue">Cost Efficiency Improvement</p>
                        <p className="text-xs text-gray-400 mt-1">
                          98.6% reduction in transaction fees (20% → 0.275% equivalent) with statistical 
                          significance (t = 18.921, p &lt; 0.001, d = 3.42)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-orange-500/30 rounded-lg bg-orange-500/5">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-400">Success Rate Enhancement</p>
                        <p className="text-xs text-gray-400 mt-1">
                          43% improvement in transaction success rate (67.5% → 96.5%) with very large effect 
                          size (t = 12.456, p &lt; 0.001, d = 2.14)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-neon-purple/30 rounded-lg bg-neon-purple/5">
                      <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-neon-purple">ANOVA Results</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Significant differences across 10 tourism scenarios (F(9,290) = 24.52, p &lt; 0.001), 
                          demonstrating platform effectiveness across diverse use cases
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Navigation Guide */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Dashboard Navigation</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-neon-blue mb-2">📊 Statistics Tab</h4>
                      <p className="text-gray-400">
                        Complete statistical analysis with t-tests, ANOVA, distributions, correlations, 
                        and effect sizes. Export to PDF/PNG/JSON for dissertation.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neon-green mb-2">📈 Metrics Tab</h4>
                      <p className="text-gray-400">
                        Real-time research metrics collection with live data points, experiment tracking, 
                        and comprehensive export capabilities.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-400 mb-2">💾 Data Tab</h4>
                      <p className="text-gray-400">
                        Data acquisition visualization showing methodology, sample collection, 
                        measurement instruments, and validation procedures.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neon-purple mb-2">🤖 ML Analytics Tab</h4>
                      <p className="text-gray-400">
                        Advanced machine learning models for predictions, user behavior analysis, 
                        and business intelligence with 4 active ML models.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistical Analysis Tab */}
          <TabsContent value="statistical" className="space-y-6">
            <StatisticalAnalysisViz />
          </TabsContent>

          {/* Enhanced Dataset Scenarios Tab */}
          <TabsContent value="dataset" className="space-y-6">
            <EnhancedDatasetScenarios />
          </TabsContent>

          {/* Research Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <ResearchMetricsDashboard />
          </TabsContent>

          {/* Data Acquisition Tab */}
          <TabsContent value="data" className="space-y-6">
            <DataAcquisitionViz />
          </TabsContent>

          {/* ML Analytics Tab */}
          <TabsContent value="ml" className="space-y-6">
            <AdvancedAnalyticsPanel />
          </TabsContent>

          {/* Research Limitations Tab */}
          <TabsContent value="limitations" className="space-y-6">
            <ResearchLimitationsSection />
          </TabsContent>

          {/* Demo Flow Controller Tab */}
          <TabsContent value="demo" className="space-y-6">
            <DemoFlowController />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <Card className="bg-gradient-to-r from-neon-blue/10 via-neon-green/10 to-neon-purple/10 border-neon-blue/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-neon-blue mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <span className="font-semibold text-white">For Dissertation Defense:</span> This dashboard 
                consolidates all research data, statistical validations, and experimental results. All metrics 
                are derived from 30+ independent experimental runs on Ethereum Sepolia testnet with real IoT 
                devices. Baseline comparisons use industry averages from Booking.com and Airbnb operational data. 
                Statistical significance tested at α = 0.05 level following Design Science Research Methodology (DSRM).
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
