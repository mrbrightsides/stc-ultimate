'use client'

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileSpreadsheet, 
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  ArrowRightLeft,
  BarChart3,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

// Enhanced Tourism Scenarios with detailed attributes
interface TourismScenario {
  id: string;
  name: string;
  category: 'peak' | 'offseason' | 'special';
  location: string;
  customerDemographic: string;
  vendorType: string;
  transactionCount: number;
  avgTransactionValue: number;
  traditionalLatency: number;
  stcLatency: number;
  traditionalCost: number;
  stcCost: number;
  traditionalSuccessRate: number;
  stcSuccessRate: number;
}

const enhancedScenarios: TourismScenario[] = [
  {
    id: 'scenario-1',
    name: 'Batam Hotel Check-in (Peak Season)',
    category: 'peak',
    location: 'Batam',
    customerDemographic: 'Business Travelers',
    vendorType: 'Large Hotel Chain',
    transactionCount: 150,
    avgTransactionValue: 250,
    traditionalLatency: 1598400000, // 18.5 days in ms
    stcLatency: 50000, // 50 seconds
    traditionalCost: 50, // USD
    stcCost: 0.6875, // USD (gas equivalent)
    traditionalSuccessRate: 65,
    stcSuccessRate: 97
  },
  {
    id: 'scenario-2',
    name: 'Lagoi Beach Resort (Off-season)',
    category: 'offseason',
    location: 'Lagoi, Bintan',
    customerDemographic: 'Leisure Tourists',
    vendorType: 'Resort & Spa',
    transactionCount: 85,
    avgTransactionValue: 450,
    traditionalLatency: 2073600000, // 24 days
    stcLatency: 48000,
    traditionalCost: 90,
    stcCost: 1.2375,
    traditionalSuccessRate: 62,
    stcSuccessRate: 98
  },
  {
    id: 'scenario-3',
    name: 'Nongsa Multi-Vendor Package',
    category: 'peak',
    location: 'Nongsa, Batam',
    customerDemographic: 'Family Groups',
    vendorType: 'Tour Operator',
    transactionCount: 220,
    avgTransactionValue: 780,
    traditionalLatency: 2592000000, // 30 days
    stcLatency: 65000,
    traditionalCost: 156,
    stcCost: 2.145,
    traditionalSuccessRate: 58,
    stcSuccessRate: 96
  },
  {
    id: 'scenario-4',
    name: 'Batam Water Sports Activity',
    category: 'peak',
    location: 'Batam',
    customerDemographic: 'Young Adults',
    vendorType: 'SME Activity Provider',
    transactionCount: 95,
    avgTransactionValue: 120,
    traditionalLatency: 604800000, // 7 days
    stcLatency: 35000,
    traditionalCost: 24,
    stcCost: 0.33,
    traditionalSuccessRate: 70,
    stcSuccessRate: 97
  },
  {
    id: 'scenario-5',
    name: 'Bintan Restaurant Reservation',
    category: 'offseason',
    location: 'Bintan',
    customerDemographic: 'Couples',
    vendorType: 'Independent Restaurant',
    transactionCount: 180,
    avgTransactionValue: 85,
    traditionalLatency: 518400000, // 6 days
    stcLatency: 28000,
    traditionalCost: 17,
    stcCost: 0.23375,
    traditionalSuccessRate: 73,
    stcSuccessRate: 98
  },
  {
    id: 'scenario-6',
    name: 'Lagoi Eco-Tourism Package',
    category: 'special',
    location: 'Lagoi, Bintan',
    customerDemographic: 'Eco-conscious Travelers',
    vendorType: 'Eco-tourism SME',
    transactionCount: 60,
    avgTransactionValue: 320,
    traditionalLatency: 1209600000, // 14 days
    stcLatency: 42000,
    traditionalCost: 64,
    stcCost: 0.88,
    traditionalSuccessRate: 68,
    stcSuccessRate: 97
  },
  {
    id: 'scenario-7',
    name: 'Batam Convention Group Booking',
    category: 'special',
    location: 'Batam',
    customerDemographic: 'Corporate Groups',
    vendorType: 'Convention Center',
    transactionCount: 45,
    avgTransactionValue: 5500,
    traditionalLatency: 2160000000, // 25 days
    stcLatency: 78000,
    traditionalCost: 1100,
    stcCost: 15.125,
    traditionalSuccessRate: 55,
    stcSuccessRate: 95
  },
  {
    id: 'scenario-8',
    name: 'Bintan Spa & Wellness (Peak)',
    category: 'peak',
    location: 'Bintan',
    customerDemographic: 'Health-conscious Tourists',
    vendorType: 'Wellness Center',
    transactionCount: 125,
    avgTransactionValue: 280,
    traditionalLatency: 1036800000, // 12 days
    stcLatency: 45000,
    traditionalCost: 56,
    stcCost: 0.77,
    traditionalSuccessRate: 66,
    stcSuccessRate: 98
  },
  {
    id: 'scenario-9',
    name: 'Lagoi Transportation Service',
    category: 'offseason',
    location: 'Lagoi, Bintan',
    customerDemographic: 'General Tourists',
    vendorType: 'Transport SME',
    transactionCount: 210,
    avgTransactionValue: 45,
    traditionalLatency: 345600000, // 4 days
    stcLatency: 22000,
    traditionalCost: 9,
    stcCost: 0.12375,
    traditionalSuccessRate: 75,
    stcSuccessRate: 99
  },
  {
    id: 'scenario-10',
    name: 'Batam Island Hopping Tour',
    category: 'peak',
    location: 'Batam',
    customerDemographic: 'Adventure Seekers',
    vendorType: 'Tour Operator SME',
    transactionCount: 170,
    avgTransactionValue: 195,
    traditionalLatency: 864000000, // 10 days
    stcLatency: 52000,
    traditionalCost: 39,
    stcCost: 0.53625,
    traditionalSuccessRate: 69,
    stcSuccessRate: 97
  }
];

const EnhancedDatasetScenarios: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('comparison');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const geographicRef = useRef<HTMLDivElement>(null);
  const demographicsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Filter scenarios by category
  const filteredScenarios = selectedCategory === 'all' 
    ? enhancedScenarios 
    : enhancedScenarios.filter(s => s.category === selectedCategory);

  // Prepare comparison data for charts
  const comparisonData = filteredScenarios.map(s => ({
    name: s.name.length > 25 ? s.name.substring(0, 22) + '...' : s.name,
    traditionalTime: s.traditionalLatency / 86400000, // Convert to days
    stcTime: s.stcLatency / 1000, // Convert to seconds
    traditionalCost: s.traditionalCost,
    stcCost: s.stcCost,
    traditionalSuccess: s.traditionalSuccessRate,
    stcSuccess: s.stcSuccessRate,
    improvement: ((s.traditionalLatency - s.stcLatency) / s.traditionalLatency * 100).toFixed(2)
  }));

  // Geographic distribution data
  const locationData = [
    { 
      location: 'Batam', 
      scenarios: enhancedScenarios.filter(s => s.location === 'Batam').length,
      avgImprovement: 98.7
    },
    { 
      location: 'Bintan', 
      scenarios: enhancedScenarios.filter(s => s.location === 'Bintan').length,
      avgImprovement: 99.1
    },
    { 
      location: 'Lagoi, Bintan', 
      scenarios: enhancedScenarios.filter(s => s.location === 'Lagoi, Bintan').length,
      avgImprovement: 99.4
    },
    { 
      location: 'Nongsa, Batam', 
      scenarios: enhancedScenarios.filter(s => s.location === 'Nongsa, Batam').length,
      avgImprovement: 99.8
    }
  ];

  // Demographics breakdown
  const demographicsData = [
    { demographic: 'Business', count: enhancedScenarios.filter(s => s.customerDemographic.includes('Business')).length },
    { demographic: 'Leisure', count: enhancedScenarios.filter(s => s.customerDemographic.includes('Leisure')).length },
    { demographic: 'Family', count: enhancedScenarios.filter(s => s.customerDemographic.includes('Family')).length },
    { demographic: 'Young Adults', count: enhancedScenarios.filter(s => s.customerDemographic.includes('Young')).length },
    { demographic: 'Corporate', count: enhancedScenarios.filter(s => s.customerDemographic.includes('Corporate')).length },
    { demographic: 'Other', count: enhancedScenarios.filter(s => 
      !s.customerDemographic.includes('Business') && 
      !s.customerDemographic.includes('Leisure') &&
      !s.customerDemographic.includes('Family') &&
      !s.customerDemographic.includes('Young') &&
      !s.customerDemographic.includes('Corporate')
    ).length }
  ];

  // Vendor types distribution
  const vendorTypeData = [
    { type: 'Hotel Chain', count: enhancedScenarios.filter(s => s.vendorType.includes('Hotel')).length },
    { type: 'SME', count: enhancedScenarios.filter(s => s.vendorType.includes('SME')).length },
    { type: 'Resort/Spa', count: enhancedScenarios.filter(s => s.vendorType.includes('Resort') || s.vendorType.includes('Spa')).length },
    { type: 'Tour Operator', count: enhancedScenarios.filter(s => s.vendorType.includes('Tour')).length },
    { type: 'Other', count: enhancedScenarios.filter(s => 
      !s.vendorType.includes('Hotel') &&
      !s.vendorType.includes('SME') &&
      !s.vendorType.includes('Resort') &&
      !s.vendorType.includes('Spa') &&
      !s.vendorType.includes('Tour')
    ).length }
  ];

  // Export to PNG
  const handleExportPNG = async (): Promise<void> => {
    setIsExporting(true);
    try {
      let targetRef = comparisonRef;
      if (activeTab === 'geographic') targetRef = geographicRef;
      if (activeTab === 'demographics') targetRef = demographicsRef;
      if (activeTab === 'table') targetRef = tableRef;

      if (!targetRef.current) {
        console.error('Export target not found');
        return;
      }

      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `dataset-scenarios-${activeTab}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF
  const handleExportPDF = async (): Promise<void> => {
    setIsExporting(true);
    try {
      let targetRef = comparisonRef;
      if (activeTab === 'geographic') targetRef = geographicRef;
      if (activeTab === 'demographics') targetRef = demographicsRef;
      if (activeTab === 'table') targetRef = tableRef;

      if (!targetRef.current) {
        console.error('Export target not found');
        return;
      }

      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`dataset-scenarios-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = (): void => {
    const headers = [
      'Scenario ID',
      'Scenario Name',
      'Category',
      'Location',
      'Customer Demographic',
      'Vendor Type',
      'Transaction Count',
      'Avg Transaction Value (USD)',
      'Traditional Latency (days)',
      'STC Latency (seconds)',
      'Traditional Cost (USD)',
      'STC Cost (USD)',
      'Traditional Success Rate (%)',
      'STC Success Rate (%)',
      'Latency Improvement (%)',
      'Cost Reduction (%)'
    ];

    const rows = enhancedScenarios.map(s => [
      s.id,
      s.name,
      s.category,
      s.location,
      s.customerDemographic,
      s.vendorType,
      s.transactionCount,
      s.avgTransactionValue,
      (s.traditionalLatency / 86400000).toFixed(2),
      (s.stcLatency / 1000).toFixed(2),
      s.traditionalCost.toFixed(2),
      s.stcCost.toFixed(3),
      s.traditionalSuccessRate,
      s.stcSuccessRate,
      ((s.traditionalLatency - s.stcLatency) / s.traditionalLatency * 100).toFixed(2),
      ((s.traditionalCost - s.stcCost) / s.traditionalCost * 100).toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stc-tourism-scenarios-dataset-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#000000' }}>
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span style={{ color: '#000000' }}>Enhanced Tourism Dataset Scenarios</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                10 detailed tourism scenarios across Batam and Bintan regions with demographic and seasonal variations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-600 hover:bg-blue-50"
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-300">
                  <DropdownMenuItem 
                    onClick={handleExportCSV}
                    className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleExportPDF}
                    className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleExportPNG}
                    className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Scenarios ({enhancedScenarios.length})
        </Button>
        <Button
          variant={selectedCategory === 'peak' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('peak')}
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Peak Season ({enhancedScenarios.filter(s => s.category === 'peak').length})
        </Button>
        <Button
          variant={selectedCategory === 'offseason' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('offseason')}
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Off-season ({enhancedScenarios.filter(s => s.category === 'offseason').length})
        </Button>
        <Button
          variant={selectedCategory === 'special' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('special')}
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Special Events ({enhancedScenarios.filter(s => s.category === 'special').length})
        </Button>
      </div>

      {/* Tabs for different visualizations */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Before/After Comparison</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Distribution</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="table">Dataset Table</TabsTrigger>
        </TabsList>

        {/* Before/After Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div ref={comparisonRef}>
            {/* Time Comparison */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <ArrowRightLeft className="h-5 w-5 text-green-600" />
                  Transaction Latency: Traditional vs STC Ultimate
                </CardTitle>
                <CardDescription>
                  Logarithmic scale showing dramatic time reduction across all scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      stroke="#000000"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'Traditional (days)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      label={{ value: 'STC (seconds)', angle: 90, position: 'insideRight', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="traditionalTime" fill="#EF4444" name="Traditional Platform (days)" />
                    <Bar yAxisId="right" dataKey="stcTime" fill="#10B981" name="STC Ultimate (seconds)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card className="bg-white border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Transaction Cost: Traditional vs STC Ultimate
                </CardTitle>
                <CardDescription>
                  98%+ cost reduction across all tourism scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      stroke="#000000"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      label={{ value: 'Cost (USD)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="traditionalCost" fill="#EF4444" name="Traditional Platform" />
                    <Bar dataKey="stcCost" fill="#10B981" name="STC Ultimate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success Rate Comparison */}
            <Card className="bg-white border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  Success Rate Comparison
                </CardTitle>
                <CardDescription>
                  STC Ultimate consistently achieves 95%+ success rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      stroke="#000000"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft', fill: '#000000' }}
                      stroke="#000000"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="traditionalSuccess" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Traditional Platform"
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stcSuccess" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="STC Ultimate"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Distribution Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div ref={geographicRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <MapPin className="h-5 w-5 text-purple-600" />
                Geographic Distribution: Batam & Bintan Regions
              </CardTitle>
              <CardDescription>
                Scenario coverage and performance across Indonesian tourism hotspots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#000000" />
                  <YAxis type="category" dataKey="location" width={150} stroke="#000000" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="scenarios" fill="#8B5CF6" name="Number of Scenarios" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div ref={demographicsRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Demographics */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Users className="h-5 w-5 text-blue-600" />
                  Customer Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demographicsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="demographic" stroke="#000000" angle={-30} textAnchor="end" height={80} />
                    <YAxis stroke="#000000" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" name="Scenarios" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vendor Types */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  Vendor Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendorTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="type" stroke="#000000" angle={-30} textAnchor="end" height={80} />
                    <YAxis stroke="#000000" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="count" fill="#10B981" name="Scenarios" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          </div>
        </TabsContent>

        {/* Dataset Table Tab */}
        <TabsContent value="table" className="space-y-6">
          <div ref={tableRef}>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-black">Complete Dataset Table</CardTitle>
                <Button onClick={handleExportCSV} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left text-black">Scenario</th>
                      <th className="border border-gray-300 p-2 text-left text-black">Location</th>
                      <th className="border border-gray-300 p-2 text-left text-black">Category</th>
                      <th className="border border-gray-300 p-2 text-right text-black">Traditional (days)</th>
                      <th className="border border-gray-300 p-2 text-right text-black">STC (sec)</th>
                      <th className="border border-gray-300 p-2 text-right text-black">Cost Reduction</th>
                      <th className="border border-gray-300 p-2 text-right text-black">Success Rate ↑</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScenarios.map((scenario, idx) => (
                      <tr key={scenario.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2 font-medium text-black">{scenario.name}</td>
                        <td className="border border-gray-300 p-2 text-black">{scenario.location}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge 
                            variant="secondary"
                            className={
                              scenario.category === 'peak' ? 'bg-red-100 text-red-800' :
                              scenario.category === 'offseason' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }
                          >
                            {scenario.category}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-black">
                          {(scenario.traditionalLatency / 86400000).toFixed(1)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-black">
                          {(scenario.stcLatency / 1000).toFixed(1)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                          {((scenario.traditionalCost - scenario.stcCost) / scenario.traditionalCost * 100).toFixed(1)}%
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                          +{(scenario.stcSuccessRate - scenario.traditionalSuccessRate).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDatasetScenarios;
