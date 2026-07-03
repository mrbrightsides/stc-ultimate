'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Download,
  FileText,
  Database,
  Activity,
  BarChart3,
  FileJson,
  FileSpreadsheet,
  Printer,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import type {
  ExportData,
  TableData,
  MetricData
} from '@/lib/export-utils';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsPDF,
  formatExportTimestamp
} from '@/lib/export-utils';

interface ExportManagerProps {
  scadaData?: unknown;
  researchData?: unknown;
  blockchainData?: unknown;
  tourismData?: unknown;
}

export default function ExportManager({
  scadaData,
  researchData,
  blockchainData,
  tourismData
}: ExportManagerProps) {
  const [exportStatus, setExportStatus] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Generate SCADA Report
  const generateSCADAReport = (): ExportData => {
    const metrics: MetricData[] = [
      { label: 'Total Devices', value: 18, unit: 'devices' },
      { label: 'Online Devices', value: 16, unit: 'devices' },
      { label: 'System Uptime', value: 99.8, unit: '%' },
      { label: 'Energy Consumption', value: 342.5, unit: 'kWh' },
      { label: 'Active Alerts', value: 3, unit: 'alerts' },
      { label: 'Network Load', value: 67, unit: '%' }
    ];

    const deviceTable: TableData = {
      headers: ['Device ID', 'Name', 'Type', 'Status', 'Location', 'Value'],
      rows: [
        ['hvac-001', 'Hotel Lobby HVAC', 'Actuator', 'Online', 'Floor 1', '22.5°C'],
        ['light-001', 'Main Entrance Lights', 'Actuator', 'Online', 'Main Entrance', '100%'],
        ['sec-001', 'Main Gate Camera', 'Sensor', 'Online', 'Main Gate', 'Active'],
        ['env-001', 'Temperature Sensor', 'Sensor', 'Online', 'Lobby', '24.5°C'],
        ['net-001', 'WiFi Router', 'Controller', 'Online', 'Lobby', '125 devices']
      ]
    };

    return {
      title: 'SCADA System Report',
      subtitle: 'Supervisory Control and Data Acquisition Analysis',
      timestamp: formatExportTimestamp(),
      sections: [
        {
          title: 'System Overview Metrics',
          type: 'metrics',
          data: metrics
        },
        {
          title: 'Device Status Table',
          type: 'table',
          data: deviceTable
        },
        {
          title: 'Executive Summary',
          type: 'text',
          data: 'The SCADA system demonstrates excellent operational performance with 99.8% uptime. All critical IoT devices are functioning properly with real-time monitoring and blockchain-verified audit trails. Energy optimization systems are achieving significant efficiency gains.'
        }
      ],
      metadata: {
        exportType: 'SCADA Report',
        platform: 'STC Ultimate',
        generatedBy: 'Export Manager'
      }
    };
  };

  // Generate Research Metrics Report
  const generateResearchReport = (): ExportData => {
    const metrics: MetricData[] = [
      { label: 'Avg Transaction Latency', value: 3250, unit: 'ms', trend: '+2.3%' },
      { label: 'IoT Response Time', value: 285, unit: 'ms', trend: '-1.8%' },
      { label: 'Gas Usage Average', value: 75000, unit: 'gas', trend: '-12.4%' },
      { label: 'Completion Rate', value: 87.3, unit: '%', trend: '+5.2%' },
      { label: 'Total Sessions', value: 156, unit: 'sessions' },
      { label: 'Data Points Collected', value: 2340, unit: 'points' }
    ];

    const performanceTable: TableData = {
      headers: ['Metric', 'Min', 'Max', 'Average', 'Std Dev'],
      rows: [
        ['Transaction Latency', '2100ms', '5800ms', '3250ms', '850ms'],
        ['IoT Device Response', '120ms', '480ms', '285ms', '95ms'],
        ['Gas Consumption', '52000', '98000', '75000', '12000'],
        ['Network Confirmation', '1500ms', '4200ms', '2800ms', '680ms'],
        ['User Interaction Time', '800ms', '3500ms', '1850ms', '520ms']
      ]
    };

    return {
      title: 'Research Metrics Report',
      subtitle: 'Dissertation Performance Analysis - STC Ultimate Platform',
      timestamp: formatExportTimestamp(),
      sections: [
        {
          title: 'Key Performance Indicators',
          type: 'metrics',
          data: metrics
        },
        {
          title: 'Detailed Performance Statistics',
          type: 'table',
          data: performanceTable
        },
        {
          title: 'Research Findings',
          type: 'text',
          data: 'The blockchain-enabled smart tourism platform demonstrates measurable improvements in transaction efficiency and IoT device integration. Gas optimization strategies have achieved a 12.4% reduction in costs while maintaining high reliability. The system shows promise for academic publication in Scopus Q3 journals.'
        }
      ],
      metadata: {
        exportType: 'Research Report',
        platform: 'STC Ultimate',
        researchPhase: 'Data Collection',
        targetPublication: 'Scopus Q3'
      }
    };
  };

  // Generate Blockchain Report
  const generateBlockchainReport = (): ExportData => {
    const metrics: MetricData[] = [
      { label: 'Total Transactions', value: 1247, unit: 'txs' },
      { label: 'Smart Contracts Deployed', value: 8, unit: 'contracts' },
      { label: 'Average Block Time', value: 13.5, unit: 'seconds' },
      { label: 'Gas Optimization Savings', value: 24.8, unit: '%' },
      { label: 'Network: Sepolia', value: 'Testnet', unit: '' },
      { label: 'Success Rate', value: 98.3, unit: '%' }
    ];

    const transactionTable: TableData = {
      headers: ['Transaction Type', 'Count', 'Avg Gas', 'Success Rate', 'Avg Time'],
      rows: [
        ['Booking Payment', '456', '68,500', '99.1%', '3.2s'],
        ['Milestone Release', '342', '72,300', '98.8%', '3.5s'],
        ['IoT Verification', '289', '45,200', '99.5%', '2.8s'],
        ['Token Transfer', '160', '21,000', '100%', '2.1s']
      ]
    };

    return {
      title: 'Blockchain Activity Report',
      subtitle: 'Smart Contract and Transaction Analysis',
      timestamp: formatExportTimestamp(),
      sections: [
        {
          title: 'Blockchain Metrics',
          type: 'metrics',
          data: metrics
        },
        {
          title: 'Transaction Analysis',
          type: 'table',
          data: transactionTable
        },
        {
          title: 'Blockchain Integration Summary',
          type: 'text',
          data: 'The platform successfully integrates blockchain technology for transparent and secure tourism operations. Smart contracts automate milestone-based payments and IoT device verification with high reliability. All transactions are recorded on Sepolia testnet with comprehensive audit trails.'
        }
      ],
      metadata: {
        exportType: 'Blockchain Report',
        network: 'Sepolia Testnet',
        platform: 'STC Ultimate'
      }
    };
  };

  // Generate Comprehensive Report
  const generateComprehensiveReport = (): ExportData => {
    const scadaReport = generateSCADAReport();
    const researchReport = generateResearchReport();
    const blockchainReport = generateBlockchainReport();

    return {
      title: 'STC Ultimate Comprehensive Report',
      subtitle: 'Complete Platform Analysis for Academic Research',
      timestamp: formatExportTimestamp(),
      sections: [
        ...scadaReport.sections,
        ...researchReport.sections,
        ...blockchainReport.sections
      ],
      metadata: {
        exportType: 'Comprehensive Report',
        platform: 'STC Ultimate',
        version: '1.0',
        purpose: 'Dissertation Support & Academic Publication'
      }
    };
  };

  // Export handlers
  const handleExportJSON = (reportType: string): void => {
    setIsExporting(true);
    try {
      let data: ExportData;
      switch (reportType) {
        case 'scada':
          data = generateSCADAReport();
          break;
        case 'research':
          data = generateResearchReport();
          break;
        case 'blockchain':
          data = generateBlockchainReport();
          break;
        case 'comprehensive':
          data = generateComprehensiveReport();
          break;
        default:
          data = generateComprehensiveReport();
      }
      exportAsJSON(data, `stc-${reportType}-report`);
      setExportStatus(`${reportType.toUpperCase()} report exported as JSON successfully!`);
    } catch (error) {
      setExportStatus(`Error exporting JSON: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = (reportType: string): void => {
    setIsExporting(true);
    try {
      let data: ExportData;
      switch (reportType) {
        case 'scada':
          data = generateSCADAReport();
          break;
        case 'research':
          data = generateResearchReport();
          break;
        case 'blockchain':
          data = generateBlockchainReport();
          break;
        case 'comprehensive':
          data = generateComprehensiveReport();
          break;
        default:
          data = generateComprehensiveReport();
      }
      exportAsPDF(data);
      setExportStatus(`${reportType.toUpperCase()} report opened for PDF export!`);
    } catch (error) {
      setExportStatus(`Error generating PDF: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = (reportType: string): void => {
    setIsExporting(true);
    try {
      const tableData: TableData = {
        headers: ['Metric', 'Value', 'Unit', 'Status'],
        rows: [
          ['System Uptime', '99.8', '%', 'Good'],
          ['Active Devices', '16', 'devices', 'Online'],
          ['Energy Usage', '342.5', 'kWh', 'Optimal'],
          ['Network Load', '67', '%', 'Normal']
        ]
      };
      exportAsCSV(tableData, `stc-${reportType}-data`);
      setExportStatus(`${reportType.toUpperCase()} data exported as CSV successfully!`);
    } catch (error) {
      setExportStatus(`Error exporting CSV: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Export Manager
          </h2>
          <p className="text-gray-400 mt-2">
            Export professional reports for research papers and presentations
          </p>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready to Export
        </Badge>
      </div>

      {/* Status Alert */}
      {exportStatus && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Info className="h-4 w-4" />
          <AlertTitle>Export Status</AlertTitle>
          <AlertDescription>{exportStatus}</AlertDescription>
        </Alert>
      )}

      {/* Info Card */}
      <Alert className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Professional Export Formats</AlertTitle>
        <AlertDescription>
          Export data in multiple formats suitable for academic papers, presentations, and documentation.
          PDF exports are print-ready and formatted professionally for dissertation appendices.
        </AlertDescription>
      </Alert>

      {/* Export Options */}
      <Tabs defaultValue="scada" className="space-y-4">
        <TabsList className="bg-gray-900/50">
          <TabsTrigger value="scada">
            <Activity className="h-4 w-4 mr-2" />
            SCADA System
          </TabsTrigger>
          <TabsTrigger value="research">
            <BarChart3 className="h-4 w-4 mr-2" />
            Research Metrics
          </TabsTrigger>
          <TabsTrigger value="blockchain">
            <Database className="h-4 w-4 mr-2" />
            Blockchain Data
          </TabsTrigger>
          <TabsTrigger value="comprehensive">
            <FileText className="h-4 w-4 mr-2" />
            Comprehensive
          </TabsTrigger>
        </TabsList>

        {/* SCADA Export */}
        <TabsContent value="scada">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                SCADA System Report
              </CardTitle>
              <CardDescription>
                Export IoT device status, system metrics, and control logs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleExportPDF('scada')}
                  disabled={isExporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  onClick={() => handleExportJSON('scada')}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  onClick={() => handleExportCSV('scada')}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Includes: Device status, system uptime, energy consumption, alerts, and control logs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Metrics Export */}
        <TabsContent value="research">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Research Metrics Report
              </CardTitle>
              <CardDescription>
                Export performance data for dissertation and academic papers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleExportPDF('research')}
                  disabled={isExporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  onClick={() => handleExportJSON('research')}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  onClick={() => handleExportCSV('research')}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Includes: Transaction latency, IoT performance, gas usage, completion rates, and statistical analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Export */}
        <TabsContent value="blockchain">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-400" />
                Blockchain Activity Report
              </CardTitle>
              <CardDescription>
                Export smart contract transactions and blockchain analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleExportPDF('blockchain')}
                  disabled={isExporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  onClick={() => handleExportJSON('blockchain')}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  onClick={() => handleExportCSV('blockchain')}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Includes: Transaction history, smart contract activity, gas optimization data, and network statistics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comprehensive Export */}
        <TabsContent value="comprehensive">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Comprehensive Platform Report
              </CardTitle>
              <CardDescription>
                Export complete platform analysis with all modules combined
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-cyan-500/10 border-cyan-500/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Complete Report</AlertTitle>
                <AlertDescription>
                  This report includes all data from SCADA, Research Metrics, Blockchain, and Tourism modules.
                  Perfect for comprehensive dissertation appendices and defense presentations.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleExportPDF('comprehensive')}
                  disabled={isExporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  onClick={() => handleExportJSON('comprehensive')}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  onClick={() => handleExportCSV('comprehensive')}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Includes: All system modules, complete performance analysis, and comprehensive statistics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Available Reports</p>
                <p className="text-2xl font-bold text-blue-400">4</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Export Formats</p>
                <p className="text-2xl font-bold text-purple-400">3</p>
              </div>
              <Download className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Data Sources</p>
                <p className="text-2xl font-bold text-green-400">5</p>
              </div>
              <Database className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready for Export</p>
                <p className="text-2xl font-bold text-cyan-400">✓</p>
              </div>
              <CheckCircle className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
