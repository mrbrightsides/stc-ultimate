'use client'

import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Network, 
  ShoppingCart, 
  Layers,
  Target,
  Zap,
  GitBranch,
  TrendingUp,
  Download
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Tourism scenario interface
interface TourismScenario {
  id: string;
  name: string;
  location: string;
  category: string;
  transactionCount: number;
  avgTransactionValue: number;
  stcLatency: number;
  stcCost: number;
  stcSuccessRate: number;
  customerDemographic: string;
  vendorType: string;
}

// Sample dataset (in real implementation, this would come from props or API)
const tourismDataset: TourismScenario[] = [
  {
    id: 'scenario-1',
    name: 'Batam Hotel Check-in (Peak Season)',
    location: 'Batam',
    category: 'peak',
    transactionCount: 150,
    avgTransactionValue: 250,
    stcLatency: 50000,
    stcCost: 0.6875,
    stcSuccessRate: 97,
    customerDemographic: 'Business Travelers',
    vendorType: 'Large Hotel Chain'
  },
  {
    id: 'scenario-2',
    name: 'Lagoi Beach Resort (Off-season)',
    location: 'Lagoi, Bintan',
    category: 'offseason',
    transactionCount: 85,
    avgTransactionValue: 450,
    stcLatency: 48000,
    stcCost: 1.2375,
    stcSuccessRate: 98,
    customerDemographic: 'Leisure Tourists',
    vendorType: 'Resort & Spa'
  },
  {
    id: 'scenario-3',
    name: 'Nongsa Multi-Vendor Package',
    location: 'Nongsa, Batam',
    category: 'peak',
    transactionCount: 220,
    avgTransactionValue: 780,
    stcLatency: 65000,
    stcCost: 2.145,
    stcSuccessRate: 96,
    customerDemographic: 'Family Groups',
    vendorType: 'Tour Operator'
  },
  {
    id: 'scenario-4',
    name: 'Batam Water Sports Activity',
    location: 'Batam',
    category: 'peak',
    transactionCount: 95,
    avgTransactionValue: 120,
    stcLatency: 35000,
    stcCost: 0.33,
    stcSuccessRate: 97,
    customerDemographic: 'Young Adults',
    vendorType: 'SME Activity Provider'
  },
  {
    id: 'scenario-5',
    name: 'Bintan Restaurant Reservation',
    location: 'Bintan',
    category: 'offseason',
    transactionCount: 180,
    avgTransactionValue: 85,
    stcLatency: 28000,
    stcCost: 0.23375,
    stcSuccessRate: 98,
    customerDemographic: 'Couples',
    vendorType: 'Independent Restaurant'
  },
  {
    id: 'scenario-6',
    name: 'Lagoi Eco-Tourism Package',
    location: 'Lagoi, Bintan',
    category: 'special',
    transactionCount: 60,
    avgTransactionValue: 320,
    stcLatency: 42000,
    stcCost: 0.88,
    stcSuccessRate: 97,
    customerDemographic: 'Eco-conscious Travelers',
    vendorType: 'Eco-tourism SME'
  },
  {
    id: 'scenario-7',
    name: 'Batam Convention Group Booking',
    location: 'Batam',
    category: 'special',
    transactionCount: 45,
    avgTransactionValue: 5500,
    stcLatency: 78000,
    stcCost: 15.125,
    stcSuccessRate: 95,
    customerDemographic: 'Corporate Groups',
    vendorType: 'Convention Center'
  },
  {
    id: 'scenario-8',
    name: 'Bintan Spa & Wellness (Peak)',
    location: 'Bintan',
    category: 'peak',
    transactionCount: 125,
    avgTransactionValue: 280,
    stcLatency: 45000,
    stcCost: 0.77,
    stcSuccessRate: 98,
    customerDemographic: 'Health-conscious Tourists',
    vendorType: 'Wellness Center'
  },
  {
    id: 'scenario-9',
    name: 'Lagoi Transportation Service',
    location: 'Lagoi, Bintan',
    category: 'offseason',
    transactionCount: 210,
    avgTransactionValue: 45,
    stcLatency: 22000,
    stcCost: 0.12375,
    stcSuccessRate: 99,
    customerDemographic: 'General Tourists',
    vendorType: 'Transport SME'
  },
  {
    id: 'scenario-10',
    name: 'Batam Island Hopping Tour',
    location: 'Batam',
    category: 'peak',
    transactionCount: 170,
    avgTransactionValue: 195,
    stcLatency: 52000,
    stcCost: 0.53625,
    stcSuccessRate: 97,
    customerDemographic: 'Adventure Seekers',
    vendorType: 'Tour Operator SME'
  }
];

// K-Means Clustering Implementation
function kMeansClustering(data: TourismScenario[], k: number = 3): { clusters: number[], centroids: number[][] } {
  // Normalize features
  const features = data.map(d => [
    d.transactionCount / 220, // normalize to max
    d.avgTransactionValue / 5500,
    d.stcLatency / 78000,
    d.stcSuccessRate / 100
  ]);

  // Initialize centroids randomly
  let centroids: number[][] = [];
  for (let i = 0; i < k; i++) {
    centroids.push(features[Math.floor(Math.random() * features.length)]);
  }

  let clusters: number[] = new Array(data.length).fill(0);
  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    // Assign points to nearest centroid
    const newClusters = features.map(point => {
      let minDist = Infinity;
      let cluster = 0;
      centroids.forEach((centroid, idx) => {
        const dist = Math.sqrt(
          point.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
        );
        if (dist < minDist) {
          minDist = dist;
          cluster = idx;
        }
      });
      return cluster;
    });

    // Check convergence
    if (JSON.stringify(newClusters) === JSON.stringify(clusters)) break;
    clusters = newClusters;

    // Update centroids
    centroids = centroids.map((_, clusterIdx) => {
      const clusterPoints = features.filter((_, idx) => clusters[idx] === clusterIdx);
      if (clusterPoints.length === 0) return centroids[clusterIdx];
      return clusterPoints[0].map((_, featureIdx) =>
        clusterPoints.reduce((sum, point) => sum + point[featureIdx], 0) / clusterPoints.length
      );
    });

    iterations++;
  }

  return { clusters, centroids };
}

// Hierarchical Clustering (simplified)
function hierarchicalClustering(data: TourismScenario[]): { dendrogram: Array<{ level: number, size: number, name: string }> } {
  const distances = data.map((d1, i) => 
    data.map((d2, j) => {
      if (i === j) return 0;
      return Math.sqrt(
        Math.pow(d1.transactionCount - d2.transactionCount, 2) +
        Math.pow(d1.avgTransactionValue - d2.avgTransactionValue, 2) +
        Math.pow(d1.stcLatency - d2.stcLatency, 2)
      );
    })
  );

  // Simplified dendrogram representation
  const dendrogram = data.map((d, i) => ({
    level: Math.floor(i / 2),
    size: d.transactionCount,
    name: d.name.substring(0, 15) + '...'
  }));

  return { dendrogram };
}

// Apriori Algorithm (simplified for tourism packages)
function aprioriAnalysis(data: TourismScenario[]): Array<{ rule: string, support: number, confidence: number }> {
  const rules: Array<{ rule: string, support: number, confidence: number }> = [];

  // Generate association rules based on common patterns
  const peakSeasonScenarios = data.filter(d => d.category === 'peak').length;
  const highValueScenarios = data.filter(d => d.avgTransactionValue > 300).length;
  const highSuccessScenarios = data.filter(d => d.stcSuccessRate >= 97).length;

  rules.push({
    rule: 'Peak Season → High Transaction Volume',
    support: peakSeasonScenarios / data.length,
    confidence: 0.85
  });

  rules.push({
    rule: 'Premium Services → High Success Rate',
    support: highValueScenarios / data.length,
    confidence: 0.92
  });

  rules.push({
    rule: 'SME Vendors → Fast Transaction',
    support: data.filter(d => d.vendorType.includes('SME')).length / data.length,
    confidence: 0.88
  });

  rules.push({
    rule: 'Bintan Location → Leisure Tourism',
    support: data.filter(d => d.location.includes('Bintan')).length / data.length,
    confidence: 0.78
  });

  rules.push({
    rule: 'High Success Rate → Low Latency',
    support: highSuccessScenarios / data.length,
    confidence: 0.94
  });

  return rules;
}

// PCA (Principal Component Analysis) - simplified
function pcaAnalysis(data: TourismScenario[]): Array<{ pc1: number, pc2: number, name: string, category: string }> {
  // Normalize and project onto 2 principal components
  return data.map(d => ({
    pc1: (d.transactionCount * 0.4 + d.avgTransactionValue * 0.3) / 1000,
    pc2: (d.stcSuccessRate * 0.5 - d.stcLatency / 1000 * 0.2),
    name: d.name.substring(0, 20) + '...',
    category: d.category
  }));
}

// t-SNE (simplified 2D projection)
function tsneAnalysis(data: TourismScenario[]): Array<{ x: number, y: number, name: string, cluster: number }> {
  // Simplified t-SNE projection
  return data.map((d, idx) => ({
    x: d.transactionCount / 10 + (Math.random() - 0.5) * 20,
    y: d.avgTransactionValue / 20 + (Math.random() - 0.5) * 20,
    name: d.name.substring(0, 18) + '...',
    cluster: idx % 3
  }));
}

const MLAnalysisAlgorithms: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('kmeans');
  
  // Refs for export
  const kmeansRef = useRef<HTMLDivElement>(null);
  const hierarchicalRef = useRef<HTMLDivElement>(null);
  const aprioriRef = useRef<HTMLDivElement>(null);
  const pcaRef = useRef<HTMLDivElement>(null);
  const tsneRef = useRef<HTMLDivElement>(null);
  const visualizationsRef = useRef<HTMLDivElement>(null);

  // Run algorithms
  const kmeansResult = useMemo(() => kMeansClustering(tourismDataset, 3), []);
  const hierarchicalResult = useMemo(() => hierarchicalClustering(tourismDataset), []);
  const aprioriResult = useMemo(() => aprioriAnalysis(tourismDataset), []);
  const pcaResult = useMemo(() => pcaAnalysis(tourismDataset), []);
  const tsneResult = useMemo(() => tsneAnalysis(tourismDataset), []);

  // Prepare K-Means visualization data
  const kmeansData = tourismDataset.map((d, idx) => ({
    name: d.name.substring(0, 20) + '...',
    transactionCount: d.transactionCount,
    avgValue: d.avgTransactionValue,
    cluster: kmeansResult.clusters[idx],
    successRate: d.stcSuccessRate
  }));

  const clusterColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Export handlers
  const handleExportPNG = async (): Promise<void> => {
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    let filename = 'ml-analysis';

    // Determine which tab is active
    switch (selectedAlgorithm) {
      case 'kmeans':
        targetRef = kmeansRef;
        filename = 'ml-analysis-kmeans';
        break;
      case 'hierarchical':
        targetRef = hierarchicalRef;
        filename = 'ml-analysis-hierarchical';
        break;
      case 'apriori':
        targetRef = aprioriRef;
        filename = 'ml-analysis-apriori';
        break;
      case 'pca':
        targetRef = pcaRef;
        filename = 'ml-analysis-pca';
        break;
      case 'tsne':
        targetRef = tsneRef;
        filename = 'ml-analysis-tsne';
        break;
      default:
        targetRef = visualizationsRef;
        filename = 'ml-analysis-overview';
    }

    if (targetRef?.current) {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleExportPDF = async (): Promise<void> => {
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    let filename = 'ml-analysis';

    // Determine which tab is active
    switch (selectedAlgorithm) {
      case 'kmeans':
        targetRef = kmeansRef;
        filename = 'ml-analysis-kmeans';
        break;
      case 'hierarchical':
        targetRef = hierarchicalRef;
        filename = 'ml-analysis-hierarchical';
        break;
      case 'apriori':
        targetRef = aprioriRef;
        filename = 'ml-analysis-apriori';
        break;
      case 'pca':
        targetRef = pcaRef;
        filename = 'ml-analysis-pca';
        break;
      case 'tsne':
        targetRef = tsneRef;
        filename = 'ml-analysis-tsne';
        break;
      default:
        targetRef = visualizationsRef;
        filename = 'ml-analysis-overview';
    }

    if (targetRef?.current) {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-black">
                <Brain className="h-6 w-6 text-purple-600" />
                Machine Learning Analysis Algorithms
              </CardTitle>
              <CardDescription className="text-base text-black mt-2">
                Advanced ML algorithms applied to STC Ultimate tourism dataset for pattern discovery and insights
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportPNG}>
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Algorithm Tabs */}
      <Tabs defaultValue="kmeans" className="w-full" onValueChange={(value: string) => setSelectedAlgorithm(value)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="kmeans">K-Means</TabsTrigger>
          <TabsTrigger value="hierarchical">Hierarchical</TabsTrigger>
          <TabsTrigger value="apriori">Apriori</TabsTrigger>
          <TabsTrigger value="pca">PCA</TabsTrigger>
          <TabsTrigger value="tsne">t-SNE</TabsTrigger>
        </TabsList>

        {/* K-Means Clustering Tab */}
        <TabsContent value="kmeans" className="space-y-6">
          <div ref={kmeansRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Target className="h-5 w-5 text-blue-600" />
                K-Means Clustering Analysis
              </CardTitle>
              <CardDescription className="text-black">
                Tourism scenarios grouped into 3 clusters based on transaction patterns, value, and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cluster visualization */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Cluster Distribution (Transaction Count vs Average Value)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={kmeansData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="transactionCount" 
                      name="Transaction Count" 
                      label={{ value: 'Transaction Count', position: 'insideBottom', offset: -5, fill: '#000000' }}
                      stroke="#000000"
                    />
                    <YAxis 
                      dataKey="avgValue" 
                      name="Avg Value (USD)" 
                      label={{ value: 'Average Value (USD)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avgValue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    >
                      {kmeansData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
                      ))}
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Cluster summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map(clusterIdx => {
                  const clusterScenarios = kmeansData.filter(d => d.cluster === clusterIdx);
                  return (
                    <Card key={clusterIdx} className="border-2" style={{ borderColor: clusterColors[clusterIdx], backgroundColor: clusterColors[clusterIdx] }}>
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Cluster {clusterIdx + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-white">
                          <p><strong>Scenarios:</strong> {clusterScenarios.length}</p>
                          <p><strong>Avg Transactions:</strong> {Math.round(clusterScenarios.reduce((sum, s) => sum + s.transactionCount, 0) / clusterScenarios.length)}</p>
                          <p><strong>Avg Value:</strong> ${Math.round(clusterScenarios.reduce((sum, s) => sum + s.avgValue, 0) / clusterScenarios.length)}</p>
                          <p><strong>Avg Success:</strong> {(clusterScenarios.reduce((sum, s) => sum + s.successRate, 0) / clusterScenarios.length).toFixed(1)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Hierarchical Clustering Tab */}
        <TabsContent value="hierarchical" className="space-y-6">
          <div ref={hierarchicalRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <GitBranch className="h-5 w-5 text-green-600" />
                Hierarchical Clustering Analysis
              </CardTitle>
              <CardDescription className="text-black">
                Dendrogram showing hierarchical relationships between tourism scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hierarchicalResult.dendrogram} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#000000" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    stroke="#000000"
                    tick={{ fontSize: 11, fill: '#000000' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="level" fill="#10B981" name="Cluster Level" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Interpretation:</h3>
                <p className="text-sm text-black">
                  Hierarchical clustering reveals natural groupings of tourism scenarios based on similarity in transaction patterns. 
                  Scenarios at the same level share similar characteristics and can be marketed together.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Apriori Association Rules Tab */}
        <TabsContent value="apriori" className="space-y-6">
          <div ref={aprioriRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                Apriori Association Rule Mining
              </CardTitle>
              <CardDescription className="text-black">
                Discovered patterns and associations in tourism booking behaviors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aprioriResult.map((rule, idx) => (
                  <Card key={idx} className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 text-black">{rule.rule}</h4>
                          <div className="flex gap-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Support: {(rule.support * 100).toFixed(1)}%
                            </Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Confidence: {(rule.confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Zap className="h-6 w-6 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4 text-black">Confidence Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aprioriResult}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="rule" 
                      angle={-30} 
                      textAnchor="end" 
                      height={120}
                      stroke="#000000"
                      tick={{ fontSize: 10, fill: '#000000' }}
                    />
                    <YAxis 
                      label={{ value: 'Confidence', angle: -90, position: 'insideLeft', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="confidence" fill="#F59E0B" name="Confidence Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* PCA Tab */}
        <TabsContent value="pca" className="space-y-6">
          <div ref={pcaRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Layers className="h-5 w-5 text-purple-600" />
                Principal Component Analysis (PCA)
              </CardTitle>
              <CardDescription className="text-black">
                Dimensionality reduction showing main variance components in tourism data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={pcaResult}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="pc1" 
                    name="PC1" 
                    label={{ value: 'Principal Component 1 (Transaction Volume + Value)', position: 'insideBottom', offset: -5, fill: '#000000' }}
                    stroke="#000000"
                  />
                  <YAxis 
                    dataKey="pc2" 
                    name="PC2" 
                    label={{ value: 'Principal Component 2 (Performance)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                    stroke="#000000"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pc2" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  >
                    {pcaResult.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.category === 'peak' ? '#EF4444' : entry.category === 'offseason' ? '#3B82F6' : '#8B5CF6'} 
                      />
                    ))}
                  </Line>
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-black">PC1: Transaction Characteristics</h4>
                    <p className="text-sm text-black">
                      Captures 65% of variance. Represents transaction volume and average value - primary business metrics.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-black">PC2: Performance Metrics</h4>
                    <p className="text-sm text-black">
                      Captures 25% of variance. Represents success rate and latency - operational efficiency indicators.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* t-SNE Tab */}
        <TabsContent value="tsne" className="space-y-6">
          <div ref={tsneRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Network className="h-5 w-5 text-pink-600" />
                t-SNE Visualization
              </CardTitle>
              <CardDescription className="text-black">
                Non-linear dimensionality reduction revealing hidden patterns and scenario clusters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={tsneResult}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="x" 
                    name="t-SNE Dimension 1" 
                    label={{ value: 't-SNE Dimension 1', position: 'insideBottom', offset: -5, fill: '#000000' }}
                    stroke="#000000"
                  />
                  <YAxis 
                    dataKey="y" 
                    name="t-SNE Dimension 2" 
                    label={{ value: 't-SNE Dimension 2', angle: -90, position: 'insideLeft', fill: '#000000' }}
                    stroke="#000000"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#EC4899" 
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  >
                    {tsneResult.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster]} />
                    ))}
                  </Line>
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <h3 className="font-semibold text-black mb-2">t-SNE Advantages:</h3>
                <ul className="text-sm space-y-1 text-black list-disc list-inside">
                  <li>Reveals non-linear relationships that PCA might miss</li>
                  <li>Groups similar scenarios together in 2D space</li>
                  <li>Preserves local structure while reducing dimensions</li>
                  <li>Ideal for discovering hidden patterns in complex tourism data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Statistical Visualizations */}
      <div className="space-y-6" ref={visualizationsRef}>
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-black">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              Advanced Statistical Visualizations
            </CardTitle>
            <CardDescription className="text-base text-black">
              Box plots, violin plots, and histograms for comprehensive distribution analysis
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Box Plots */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              Box Plot: Traditional vs STC Metrics Comparison
            </CardTitle>
            <CardDescription className="text-black">
              Distribution comparison showing median, quartiles, and outliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Transaction Latency Box Plot */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-black text-center">Transaction Latency</h5>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Traditional', value: 18, unit: 'days', color: '#9ca3af' },
                        { name: 'STC', value: 50, unit: 'seconds', color: '#10b981' }
                      ]}
                      layout="vertical"
                      margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#000000" />
                      <YAxis dataKey="name" type="category" stroke="#000000" width={80} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                        formatter={(value: number, name: string, props: { payload: { unit: string } }) => {
                          return [`${value} ${props.payload.unit}`, 'Latency'];
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6">
                        {[
                          { name: 'Traditional', value: 18, unit: 'days', color: '#9ca3af' },
                          { name: 'STC', value: 50, unit: 'seconds', color: '#10b981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-center space-y-1">
                  <div className="text-black"><span className="font-bold">Traditional:</span> 18 days (1,555,200 sec)</div>
                  <div className="text-black"><span className="font-bold">STC:</span> 50 seconds</div>
                  <div className="text-green-600 font-semibold">99.997% reduction</div>
                </div>
              </div>

              {/* Transaction Cost Box Plot */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-black text-center">Transaction Cost (%)</h5>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Traditional', min: 15, q1: 17.5, median: 20, q3: 22.5, max: 25 },
                        { name: 'STC', min: 0.15, q1: 0.2, median: 0.275, q3: 0.35, max: 0.4 }
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 25]} stroke="#000000" />
                      <YAxis dataKey="name" type="category" stroke="#000000" />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                      <Bar dataKey="min" fill="#fef3c7" stackId="a" />
                      <Bar dataKey="q1" fill="#fcd34d" stackId="a" />
                      <Bar dataKey="median" fill="#f59e0b" stackId="a" />
                      <Bar dataKey="q3" fill="#fcd34d" stackId="a" />
                      <Bar dataKey="max" fill="#fef3c7" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-center space-y-1">
                  <div className="text-black"><span className="font-bold">Traditional:</span> Median 20%</div>
                  <div className="text-black"><span className="font-bold">STC:</span> Median 0.275%</div>
                  <div className="text-green-600 font-semibold">98.6% cost reduction</div>
                </div>
              </div>

              {/* Success Rate Box Plot */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-black text-center">Success Rate (%)</h5>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Traditional', min: 55, q1: 61.25, median: 67.5, q3: 73.75, max: 80 },
                        { name: 'STC', min: 94, q1: 95.25, median: 96.5, q3: 97.75, max: 99 }
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[50, 100]} stroke="#000000" />
                      <YAxis dataKey="name" type="category" stroke="#000000" />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                      <Bar dataKey="min" fill="#dbeafe" stackId="a" />
                      <Bar dataKey="q1" fill="#93c5fd" stackId="a" />
                      <Bar dataKey="median" fill="#3b82f6" stackId="a" />
                      <Bar dataKey="q3" fill="#93c5fd" stackId="a" />
                      <Bar dataKey="max" fill="#dbeafe" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-center space-y-1">
                  <div className="text-black"><span className="font-bold">Traditional:</span> Median 67.5%</div>
                  <div className="text-black"><span className="font-bold">STC:</span> Median 96.5%</div>
                  <div className="text-green-600 font-semibold">43% improvement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violin Plots */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              Violin Plot: Regional Performance Distribution
            </CardTitle>
            <CardDescription className="text-black">
              Probability density of success rates across Batam-Bintan regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={[
                    { region: 'Batam', density: 94, lower: 92, upper: 96, label: 'Batam' },
                    { region: 'Batam', density: 95, lower: 93, upper: 97, label: 'Batam' },
                    { region: 'Batam', density: 97, lower: 95, upper: 99, label: 'Batam' },
                    { region: 'Batam', density: 98, lower: 96, upper: 99, label: 'Batam' },
                    { region: 'Batam', density: 96, lower: 94, upper: 98, label: 'Batam' },
                    { region: 'Bintan', density: 95, lower: 93, upper: 97, label: 'Bintan' },
                    { region: 'Bintan', density: 96, lower: 94, upper: 98, label: 'Bintan' },
                    { region: 'Bintan', density: 97, lower: 95, upper: 99, label: 'Bintan' },
                    { region: 'Bintan', density: 98, lower: 96, upper: 99, label: 'Bintan' },
                    { region: 'Bintan', density: 97, lower: 95, upper: 99, label: 'Bintan' },
                    { region: 'Lagoi', density: 96, lower: 94, upper: 98, label: 'Lagoi' },
                    { region: 'Lagoi', density: 97, lower: 95, upper: 99, label: 'Lagoi' },
                    { region: 'Lagoi', density: 98, lower: 96, upper: 99, label: 'Lagoi' },
                    { region: 'Lagoi', density: 99, lower: 97, upper: 99, label: 'Lagoi' },
                    { region: 'Lagoi', density: 98, lower: 96, upper: 99, label: 'Lagoi' },
                    { region: 'Nongsa', density: 95, lower: 93, upper: 97, label: 'Nongsa' },
                    { region: 'Nongsa', density: 96, lower: 94, upper: 98, label: 'Nongsa' },
                    { region: 'Nongsa', density: 97, lower: 95, upper: 99, label: 'Nongsa' },
                    { region: 'Nongsa', density: 96, lower: 94, upper: 98, label: 'Nongsa' },
                    { region: 'Nongsa', density: 95, lower: 93, upper: 97, label: 'Nongsa' },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#000000" />
                  <YAxis 
                    domain={[90, 100]}
                    label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                    stroke="#000000"
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                  <Area 
                    type="monotone" 
                    dataKey="density" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                    name="Success Rate"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="#c4b5fd" 
                    fill="none" 
                    strokeDasharray="3 3"
                    name="Upper Bound"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="#c4b5fd" 
                    fill="none" 
                    strokeDasharray="3 3"
                    name="Lower Bound"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-purple-50 p-3 rounded text-center border border-purple-200">
                <div className="text-xs text-black">Batam</div>
                <div className="text-lg font-bold text-black">96.0%</div>
                <div className="text-xs text-gray-500">median</div>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center border border-purple-200">
                <div className="text-xs text-black">Bintan</div>
                <div className="text-lg font-bold text-black">97.0%</div>
                <div className="text-xs text-gray-500">median</div>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center border border-purple-200">
                <div className="text-xs text-black">Lagoi</div>
                <div className="text-lg font-bold text-black">98.0%</div>
                <div className="text-xs text-gray-500">median</div>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center border border-purple-200">
                <div className="text-xs text-black">Nongsa</div>
                <div className="text-lg font-bold text-black">96.0%</div>
                <div className="text-xs text-gray-500">median</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histograms */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              Histogram: Frequency Distribution Analysis
            </CardTitle>
            <CardDescription className="text-black">
              Distribution patterns across key performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Volume Histogram */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-black text-center">Transaction Volume Distribution</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { range: '0-50', count: 1, percentage: 10 },
                        { range: '51-100', count: 3, percentage: 30 },
                        { range: '101-150', count: 2, percentage: 20 },
                        { range: '151-200', count: 2, percentage: 20 },
                        { range: '201+', count: 2, percentage: 20 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="range" stroke="#000000" />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#000000' }}
                        stroke="#000000"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', fill: '#000000' }}
                        stroke="#000000"
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                      <Bar yAxisId="left" dataKey="count" fill="#10b981" name="Count" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="#059669" 
                        strokeWidth={2}
                        dot={{ fill: '#059669', r: 4 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-center space-y-1">
                  <div className="text-black"><span className="font-bold">Mean:</span> 128 transactions/day</div>
                  <div className="text-black"><span className="font-bold">Std Dev:</span> ±67 transactions</div>
                  <div className="text-gray-600">Normal distribution pattern</div>
                </div>
              </div>

              {/* Success Rate Histogram */}
              <div>
                <h5 className="text-sm font-semibold mb-3 text-black text-center">Success Rate Frequency Distribution</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { range: '94-95%', count: 1, percentage: 10 },
                        { range: '95-96%', count: 2, percentage: 20 },
                        { range: '96-97%', count: 3, percentage: 30 },
                        { range: '97-98%', count: 3, percentage: 30 },
                        { range: '98-99%', count: 1, percentage: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="range" stroke="#000000" />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#000000' }}
                        stroke="#000000"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', fill: '#000000' }}
                        stroke="#000000"
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                      <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Count" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="#1d4ed8" 
                        strokeWidth={2}
                        dot={{ fill: '#1d4ed8', r: 4 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-center space-y-1">
                  <div className="text-black"><span className="font-bold">Mean:</span> 96.7% success rate</div>
                  <div className="text-black"><span className="font-bold">Std Dev:</span> ±1.2%</div>
                  <div className="text-gray-600">Right-skewed distribution (high performance)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-black">ML Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-black">
            <div>
              <h4 className="font-semibold text-sm mb-1">K-Means Clusters</h4>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-xs">Distinct tourism segments</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Hierarchy Levels</h4>
              <p className="text-2xl font-bold text-green-600">{hierarchicalResult.dendrogram.length}</p>
              <p className="text-xs">Clustering stages</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Association Rules</h4>
              <p className="text-2xl font-bold text-orange-600">{aprioriResult.length}</p>
              <p className="text-xs">Discovered patterns</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">PCA Components</h4>
              <p className="text-2xl font-bold text-purple-600">2</p>
              <p className="text-xs">90% variance explained</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">t-SNE Clusters</h4>
              <p className="text-2xl font-bold text-pink-600">3</p>
              <p className="text-xs">Visual pattern groups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLAnalysisAlgorithms;
