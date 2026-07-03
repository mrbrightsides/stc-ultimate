'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Database, Network, Activity, Layers, GitBranch, CheckCircle2, Clock, Zap, Server } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Data Flow Pipeline
const dataFlowStages = [
  { stage: 'IoT Sensors', description: '10 Tourism Scenarios', icon: Activity, color: '#3b82f6' },
  { stage: 'Event Logs', description: 'Timestamped + Crypto Hash', icon: Database, color: '#8b5cf6' },
  { stage: 'Blockchain', description: 'Ethereum Sepolia Testnet', icon: GitBranch, color: '#10b981' },
  { stage: 'gRPC Stream', description: 'Real-time Telemetry', icon: Zap, color: '#f59e0b' },
  { stage: 'Analytics', description: 'DuckDB + JSON Storage', icon: Server, color: '#ec4899' },
]

// Dual Source Strategy Data
const dualSourceData = [
  { category: 'IoT Events', simulated: 85, real: 15, total: 100 },
  { category: 'Blockchain Txs', simulated: 30, real: 70, total: 100 },
  { category: 'System Metrics', simulated: 60, real: 40, total: 100 },
  { category: 'Performance', simulated: 50, real: 50, total: 100 },
]

// Measurement Metrics Categories
const measurementMetrics = [
  {
    category: 'IoT Metrics',
    icon: Activity,
    color: '#3b82f6',
    metrics: ['Response Times', 'Accuracy Rates', 'Energy Consumption', 'Signal Variations', 'Failure Rates'],
    count: 5
  },
  {
    category: 'Blockchain Metrics',
    icon: GitBranch,
    color: '#10b981',
    metrics: ['Transaction Hashes', 'Block Numbers', 'Gas Usage', 'Confirmation Times', 'Address Mappings'],
    count: 5
  },
  {
    category: 'System Telemetry',
    icon: Server,
    color: '#f59e0b',
    metrics: ['CPU Utilization', 'Memory Usage', 'Network Latency', 'DB Query Times', 'API Performance'],
    count: 5
  },
  {
    category: 'Output Datasets',
    icon: Database,
    color: '#ec4899',
    metrics: ['Booking Metadata', 'Milestone Sequences', 'IoT Proof Hashes', 'Transaction Details', 'Timing Metrics'],
    count: 5
  },
]

// Technology Stack Layers
const techStackLayers = [
  {
    layer: 'Frontend',
    technologies: ['Next.js', 'TypeScript', 'React State Machines'],
    purpose: 'Type-safe UI & IoT Emulation',
    color: '#3b82f6'
  },
  {
    layer: 'Communication',
    technologies: ['Ethers.js', 'Server-Sent Events', 'gRPC'],
    purpose: 'Blockchain & Real-time Streaming',
    color: '#8b5cf6'
  },
  {
    layer: 'Blockchain',
    technologies: ['Ethereum', 'Sepolia Testnet', 'Etherscan'],
    purpose: 'Transaction Execution & Verification',
    color: '#10b981'
  },
  {
    layer: 'Storage',
    technologies: ['DuckDB', 'JSON', 'localStorage'],
    purpose: 'Data Persistence & Analysis',
    color: '#f59e0b'
  },
]

// Data Collection Coverage
const dataCollectionCoverage = [
  { scenario: 'Scenario 1', iot: 95, blockchain: 98, telemetry: 92 },
  { scenario: 'Scenario 2', iot: 97, blockchain: 96, telemetry: 94 },
  { scenario: 'Scenario 3', iot: 93, blockchain: 99, telemetry: 91 },
  { scenario: 'Scenario 4', iot: 96, blockchain: 97, telemetry: 93 },
  { scenario: 'Scenario 5', iot: 94, blockchain: 98, telemetry: 95 },
  { scenario: 'Scenario 6', iot: 98, blockchain: 96, telemetry: 92 },
  { scenario: 'Scenario 7', iot: 95, blockchain: 99, telemetry: 94 },
  { scenario: 'Scenario 8', iot: 97, blockchain: 97, telemetry: 93 },
  { scenario: 'Scenario 9', iot: 96, blockchain: 98, telemetry: 96 },
  { scenario: 'Scenario 10', iot: 94, blockchain: 99, telemetry: 92 },
]

// Reproducibility Features
const reproducibilityFeatures = [
  { feature: 'Version Control', status: 'Implemented', coverage: 100 },
  { feature: 'Smart Contract Addresses', status: 'Documented', coverage: 100 },
  { feature: 'IoT Configurations', status: 'Documented', coverage: 100 },
  { feature: 'Scenario Definitions', status: 'Documented', coverage: 100 },
  { feature: 'Export Formats', status: 'CSV, JSON, MD', coverage: 100 },
]

export default function DataAcquisitionVisualization() {
  const [activeTab, setActiveTab] = useState('flow')
  const [isExporting, setIsExporting] = useState(false)
  
  // Refs for export
  const flowRef = useRef<HTMLDivElement>(null)
  const sourcesRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const techRef = useRef<HTMLDivElement>(null)
  const reproducibilityRef = useRef<HTMLDivElement>(null)

  const exportData = async (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `data_acquisition_${format}_${timestamp}`

    if (format === 'json') {
      const data = {
        exportDate: new Date().toISOString(),
        section: 'Section 2.3 - Data Acquisition and Measurement',
        dataFlowStages,
        dualSourceStrategy: dualSourceData,
        measurementMetrics,
        techStackLayers,
        dataCollectionCoverage,
        reproducibilityFeatures,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.json`
      a.click()
      return
    }
    
    // PDF/PNG export
    setIsExporting(true)
    try {
      let targetRef = flowRef
      if (activeTab === 'sources') targetRef = sourcesRef
      if (activeTab === 'metrics') targetRef = metricsRef
      if (activeTab === 'tech') targetRef = techRef
      if (activeTab === 'reproducibility') targetRef = reproducibilityRef

      if (!targetRef.current) {
        console.error('Export target not found')
        return
      }

      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${filename}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        })
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`${filename}.pdf`)
      }
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Section 2.3 - Data Acquisition and Measurement</CardTitle>
                <CardDescription className="text-base mt-1">
                  Dual-source data strategy: Simulated IoT events + Real blockchain transactions
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => exportData('pdf')} 
                variant="outline" 
                size="sm"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'PDF'}
              </Button>
              <Button 
                onClick={() => exportData('png')} 
                variant="outline" 
                size="sm"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'PNG'}
              </Button>
              <Button 
                onClick={() => exportData('json')} 
                variant="outline" 
                size="sm"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="flow">Data Flow</TabsTrigger>
          <TabsTrigger value="sources">Dual Sources</TabsTrigger>
          <TabsTrigger value="metrics">Measurements</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="reproducibility">Reproducibility</TabsTrigger>
        </TabsList>

        {/* Tab 1: Data Flow Pipeline */}
        <TabsContent value="flow" className="space-y-4">
          <div ref={flowRef}>
          <Card>
            <CardHeader>
              <CardTitle>Data Collection Pipeline</CardTitle>
              <CardDescription>
                End-to-end data flow from IoT sensors to analytics storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flow Diagram */}
              <div className="flex items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                {dataFlowStages.map((stage, idx) => {
                  const Icon = stage.icon
                  return (
                    <React.Fragment key={stage.stage}>
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: stage.color }}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-black text-sm">{stage.stage}</div>
                          <div className="text-xs font-semibold text-gray-900">{stage.description}</div>
                        </div>
                      </div>
                      {idx < dataFlowStages.length - 1 && (
                        <div className="flex items-center">
                          <div className="w-8 h-0.5 bg-gray-400"></div>
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-gray-400"></div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Coverage by Scenario */}
              <div className="p-6 bg-white rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Data Collection Coverage Across 10 Tourism Scenarios</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataCollectionCoverage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="scenario" stroke="#000000" />
                    <YAxis domain={[0, 100]} label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft', fill: '#000000' }} stroke="#000000" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                    <Legend wrapperStyle={{ color: '#000000' }} />
                    <Bar dataKey="iot" fill="#3b82f6" name="IoT Events" />
                    <Bar dataKey="blockchain" fill="#10b981" name="Blockchain Txs" />
                    <Bar dataKey="telemetry" fill="#f59e0b" name="System Telemetry" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  All scenarios achieved &gt;90% data collection coverage across IoT, blockchain, and telemetry metrics
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Dual-Source Strategy */}
        <TabsContent value="sources" className="space-y-4">
          <div ref={sourcesRef}>
          <Card>
            <CardHeader>
              <CardTitle>Dual-Source Data Strategy</CardTitle>
              <CardDescription>
                Balanced approach: Controlled simulations + Real-world blockchain validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Overview */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Simulated Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">IoT Event Emulation</p>
                        <p className="text-sm font-semibold text-gray-900">React-based state machines with realistic timing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Controlled Testing</p>
                        <p className="text-sm font-semibold text-gray-900">Reproducible scenarios with error injection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">10 Tourism Scenarios</p>
                        <p className="text-sm font-semibold text-gray-900">Timestamped logs + cryptographic hashes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-green-600" />
                      Real Blockchain Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Ethereum Sepolia Testnet</p>
                        <p className="text-sm font-semibold text-gray-900">Real blockchain transactions & smart contracts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Verifiable on Etherscan</p>
                        <p className="text-sm font-semibold text-gray-900">Transaction hashes, gas, confirmation times</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Real-world Validation</p>
                        <p className="text-sm font-semibold text-gray-900">Actual network latency & gas costs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Source Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Data Source Distribution by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dualSourceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="simulated" stackId="a" fill="#3b82f6" name="Simulated (%)" />
                    <Bar dataKey="real" stackId="a" fill="#10b981" name="Real (%)" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  Balanced mix ensures controlled reproducibility while validating real-world applicability
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Measurement Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <div ref={metricsRef}>
          <Card>
            <CardHeader>
              <CardTitle>Measurement Points and Metrics</CardTitle>
              <CardDescription>
                Comprehensive data capture across IoT, blockchain, system, and output layers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metrics Categories Grid */}
              <div className="grid grid-cols-2 gap-4">
                {measurementMetrics.map((category) => {
                  const Icon = category.icon
                  return (
                    <Card key={category.category} className="border-2" style={{ borderColor: category.color }}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: category.color }} />
                          {category.category}
                          <Badge variant="secondary" className="ml-auto">
                            {category.count} metrics
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {category.metrics.map((metric) => (
                            <li key={metric} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }}></div>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Total Metrics Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">20</div>
                      <div className="text-sm font-bold text-gray-900">Total Metrics</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">10</div>
                      <div className="text-sm font-bold text-gray-900">Tourism Scenarios</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">3</div>
                      <div className="text-sm font-bold text-gray-900">Data Streams</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-pink-600">100%</div>
                      <div className="text-sm font-bold text-gray-900">Coverage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Output Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Experimental Run Output Structure</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>📦 <span className="text-blue-600">booking_metadata</span> → Customer, vendor, milestone info</div>
                    <div>📦 <span className="text-purple-600">milestone_sequences</span> → Event ordering & status</div>
                    <div>📦 <span className="text-green-600">iot_proof_hashes</span> → Cryptographic verification</div>
                    <div>📦 <span className="text-orange-600">transaction_details</span> → Blockchain tx hash, gas, block</div>
                    <div>📦 <span className="text-pink-600">timing_metrics</span> → Latency, confirmation delay, total time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Technology Stack */}
        <TabsContent value="tech" className="space-y-4">
          <div ref={techRef}>
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack Architecture</CardTitle>
              <CardDescription>
                Modern, type-safe infrastructure for reproducible research
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stack Layers */}
              <div className="space-y-3">
                {techStackLayers.map((layer, idx) => (
                  <Card key={layer.layer} className="border-2" style={{ borderColor: layer.color }}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{layer.layer} Layer</h4>
                          <p className="text-sm font-semibold text-gray-700 mb-3">{layer.purpose}</p>
                          <div className="flex flex-wrap gap-2">
                            {layer.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" style={{ backgroundColor: `${layer.color}20` }}>
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Technologies Highlight */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base">Key Technology Decisions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Type-Safe Data Management</p>
                      <p className="text-sm font-semibold text-gray-900">TypeScript ensures compile-time error detection and code maintainability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Real-time Data Propagation</p>
                      <p className="text-sm font-semibold text-gray-900">SSE over HTTP/2 + gRPC streaming for sub-second telemetry updates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Multi-format Data Persistence</p>
                      <p className="text-sm font-semibold text-gray-900">DuckDB for analytics, JSON for export, localStorage for client state</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Built-in Analytics Engine</p>
                      <p className="text-sm font-semibold text-gray-900">Real-time aggregation and statistical summaries during experiments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Tab 5: Reproducibility */}
        <TabsContent value="reproducibility" className="space-y-4">
          <div ref={reproducibilityRef}>
          <Card>
            <CardHeader>
              <CardTitle>Data Reproducibility and Validation</CardTitle>
              <CardDescription>
                Version-controlled parameters and multi-format export for external validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reproducibility Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Reproducibility Implementation</h3>
                <div className="space-y-2">
                  {reproducibilityFeatures.map((item) => (
                    <div key={item.feature} className="flex items-center gap-4 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{item.feature}</div>
                        <div className="text-sm font-semibold text-gray-900">{item.status}</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {item.coverage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Hub Features */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Research Hub Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Download className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium text-sm">CSV Export</div>
                      <div className="text-xs font-bold text-gray-900">Spreadsheet Analysis</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Download className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="font-medium text-sm">JSON Export</div>
                      <div className="text-xs font-bold text-gray-900">Python/R/SPSS</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Download className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="font-medium text-sm">Markdown Export</div>
                      <div className="text-xs font-bold text-gray-900">Documentation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Version Control & Documentation */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-purple-600" />
                      Version Controlled
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Experimental parameters
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Smart contract addresses
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      IoT configurations
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Scenario definitions
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-5 w-5 text-orange-600" />
                      External Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      Python (Pandas) ready
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      R compatible format
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      SPSS importable
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      Excel/Sheets support
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Validation Summary */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-lg">Data Validation Summary</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm font-bold text-gray-900">Documentation Coverage</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm font-bold text-gray-900">Version Control</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm font-bold text-gray-900">Export Formats</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
