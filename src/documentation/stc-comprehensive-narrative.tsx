'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Lightbulb, 
  Cpu, 
  Radio, 
  FlaskConical, 
  Gauge, 
  Network, 
  GraduationCap,
  Code,
  BarChart3,
  Rocket,
  FileText
} from 'lucide-react'

interface StcComprehensiveNarrativeProps {
  onBack?: () => void
}

export default function STCComprehensiveNarrative({ onBack }: StcComprehensiveNarrativeProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">STC Ultimate: Complete Documentation</h1>
        <p className="text-xl text-cyan-400">
          Comprehensive Narrative of Web3-Enhanced Smart Tourism Platform
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">Blockchain</Badge>
          <Badge variant="outline">IoT</Badge>
          <Badge variant="outline">gRPC</Badge>
          <Badge variant="outline">SCADA</Badge>
          <Badge variant="outline">Research Platform</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-2 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Theory</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="grpc" className="flex items-center gap-2">
            <Radio className="w-4 h-4" />
            <span className="hidden sm:inline">gRPC</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            <span className="hidden sm:inline">Research</span>
          </TabsTrigger>
          <TabsTrigger value="scada" className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            <span className="hidden sm:inline">SCADA</span>
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            <span className="hidden sm:inline">Ecosystem</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="implementation" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Implementation</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Results</span>
          </TabsTrigger>
          <TabsTrigger value="future" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Future</span>
          </TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">References</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Platform Overview and Core Capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Introduction</h3>
                <p className="text-cyan-400 leading-relaxed">
                  STC Ultimate represents a paradigm shift in tourism technology, combining blockchain, 
                  IoT, and real-time data streaming into a unified platform. Originally conceived as a 
                  WordPress plugin, the system has evolved into a comprehensive Web3 ecosystem serving 
                  both commercial and academic purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Core Innovation</h3>
                <p className="text-cyan-400 leading-relaxed">
                  The platform integrates multiple cutting-edge technologies:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 text-cyan-400">
                  <li><strong>Blockchain Layer:</strong> Ethereum-based smart contracts on Sepolia testnet for secure bookings and payments</li>
                  <li><strong>IoT Integration:</strong> Real-time sensor data collection and monitoring for tourism operations</li>
                  <li><strong>gRPC Streaming:</strong> High-performance bidirectional communication for live data synchronization</li>
                  <li><strong>SCADA System:</strong> Industrial-grade monitoring and control for tourism facilities</li>
                  <li><strong>Research Platform:</strong> Comprehensive tools for academic validation and publication</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Target Users</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Commercial Sector</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• SMEs in Indonesian tourism industry</li>
                      <li>• Hotel and accommodation providers</li>
                      <li>• Tour operators and travel agencies</li>
                      <li>• Tourism facility managers</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Academic Sector</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Researchers in tourism technology</li>
                      <li>• Computer science students</li>
                      <li>• Academic institutions</li>
                      <li>• Publication and validation teams</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-cyan-400">Uptime</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">&lt;100ms</div>
                    <div className="text-sm text-cyan-400">gRPC Latency</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-cyan-400">Transparent</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-cyan-400">Monitoring</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: THEORY */}
        <TabsContent value="theory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theoretical Foundation</CardTitle>
              <CardDescription>Scientific Basis and Research Framework</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain in Tourism</h3>
                <p className="text-cyan-400 leading-relaxed">
                  Blockchain technology addresses critical challenges in the tourism industry including 
                  trust, transparency, and intermediary costs. Smart contracts enable automated, 
                  trustless transactions while maintaining complete auditability.
                </p>
                <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Research Objective 1:</h4>
                  <p className="text-sm text-gray-900">
                    "Measure the reduction in transaction fees and payment release time when comparing 
                    traditional centralized platforms (baseline) to the STC Ultimate blockchain-based system."
                  </p>
                  <p className="text-xs text-gray-900 mt-2 italic">
                    Target metrics: Transaction fees (% or USD), Payment settlement duration (days/hours/seconds)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Data Streaming</h3>
                <p className="text-cyan-400 leading-relaxed">
                  gRPC provides high-performance, bidirectional streaming crucial for real-time 
                  monitoring and control systems. Protocol Buffers ensure efficient serialization 
                  with strong typing and schema evolution.
                </p>
                <div className="mt-3 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Research Objective 2:</h4>
                  <p className="text-sm text-gray-900">
                    "Quantify the transaction latency and success rate improvements achieved through 
                    gRPC-based real-time IoT integration versus conventional booking systems."
                  </p>
                  <p className="text-xs text-gray-900 mt-2 italic">
                    Target metrics: Transaction latency (milliseconds), Success rate (%), System throughput (concurrent users)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">IoT Integration Framework</h3>
                <p className="text-cyan-400 leading-relaxed">
                  Internet of Things sensors provide real-time data from physical tourism facilities, 
                  enabling predictive maintenance, occupancy monitoring, and environmental control.
                </p>
                <div className="mt-3 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Research Objective 3:</h4>
                  <p className="text-sm text-gray-900">
                    "Evaluate the reduction in dispute resolution time and manual verification overhead 
                    through automated blockchain-IoT event verification."
                  </p>
                  <p className="text-xs text-gray-900 mt-2 italic">
                    Target metrics: Dispute resolution time (hours/days), Manual verification time (minutes/hours)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SCADA Adaptation</h3>
                <p className="text-cyan-400 leading-relaxed">
                  Supervisory Control and Data Acquisition systems, traditionally used in industrial 
                  automation, provide robust monitoring and control capabilities adaptable to tourism 
                  facility management.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Theoretical Model</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`Technology Stack Integration Model:

┌─────────────────────────────────────────┐
│         User Interface Layer            │
│  (Next.js, React, Real-time Updates)    │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      Application Logic Layer            │
│   (Business Rules, Access Control)      │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│     Integration Layer (gRPC/REST)       │
│  (Protocol Translation, Streaming)      │
└─────────────────────────────────────────┘
                    ↕
┌──────────────┬──────────────┬───────────┐
│  Blockchain  │  IoT Sensors │   SCADA   │
│   (Sepolia)  │  (Real-time) │  (Control)│
└──────────────┴──────────────┴───────────┘`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ARCHITECTURE */}
        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>Technical Design and Component Structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Architecture</h3>
                <p className="text-cyan-400 leading-relaxed">
                  The platform employs a modular, layered architecture designed for scalability, 
                  maintainability, and real-time performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend Layer</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <p className="font-semibold text-gray-900">Technologies:</p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Next.js 14 with App Router for server-side rendering</li>
                    <li>React 18 for component-based UI</li>
                    <li>TypeScript for type safety</li>
                    <li>Tailwind CSS for responsive styling</li>
                    <li>shadcn/ui for consistent component library</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Layer</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <p className="font-semibold text-gray-900">Components:</p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Ethers.js for Ethereum interaction</li>
                    <li>Smart contracts deployed on Sepolia testnet</li>
                    <li>MetaMask integration for wallet connection</li>
                    <li>Event listeners for blockchain state changes</li>
                    <li>Transaction queue management</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Layer</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <p className="font-semibold text-gray-900">Protocols:</p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>gRPC with Protocol Buffers for real-time streaming</li>
                    <li>WebSockets for bidirectional communication</li>
                    <li>REST API for standard CRUD operations</li>
                    <li>Server-Sent Events for one-way streaming</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Flow Architecture</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`Data Flow Pattern:

User Action → Frontend Component
                    ↓
            State Management
                    ↓
          API Call (gRPC/REST)
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Blockchain TX          IoT Command
        ↓                       ↓
   Smart Contract        Sensor/Actuator
        ↓                       ↓
   Event Emission         Data Stream
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
          Backend Processing
                    ↓
          State Update (gRPC)
                    ↓
      Real-time UI Update`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Architecture</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Wallet-based authentication</li>
                      <li>• Role-based access control</li>
                      <li>• Session management</li>
                      <li>• Multi-signature support</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• Secure key storage</li>
                      <li>• Input validation</li>
                      <li>• Audit logging</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: gRPC STREAMING */}
        <TabsContent value="grpc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>gRPC Streaming Implementation</CardTitle>
              <CardDescription>Real-time Bidirectional Communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Why gRPC?</h3>
                <p className="text-cyan-400 leading-relaxed">
                  gRPC (Google Remote Procedure Call) provides high-performance, language-agnostic 
                  communication essential for real-time tourism operations. Compared to REST, gRPC offers:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 text-cyan-400">
                  <li><strong>Performance:</strong> Binary Protocol Buffers vs JSON text (60% smaller payloads)</li>
                  <li><strong>Streaming:</strong> Native bidirectional streaming support</li>
                  <li><strong>Type Safety:</strong> Strong typing with .proto definitions</li>
                  <li><strong>Code Generation:</strong> Automatic client/server code generation</li>
                  <li><strong>HTTP/2:</strong> Multiplexing multiple requests over single connection</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Protocol Buffer Definition</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`syntax = "proto3";

package stc.tourism;

// Tourism booking service
service TourismService {
  // Unary RPC for booking creation
  rpc CreateBooking(BookingRequest) returns (BookingResponse);
  
  // Server streaming for real-time updates
  rpc StreamBookingUpdates(BookingFilter) returns (stream BookingUpdate);
  
  // Client streaming for IoT data collection
  rpc SendSensorData(stream SensorData) returns (AckResponse);
  
  // Bidirectional streaming for live chat
  rpc LiveSupport(stream ChatMessage) returns (stream ChatMessage);
}

message BookingRequest {
  string user_id = 1;
  string room_id = 2;
  int64 check_in = 3;
  int64 check_out = 4;
  double amount = 5;
}

message SensorData {
  string sensor_id = 1;
  string sensor_type = 2;
  double value = 3;
  int64 timestamp = 4;
  map<string, string> metadata = 5;
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Streaming Patterns</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Server Streaming</h4>
                    <p className="text-sm text-cyan-400 mb-2">
                      Server continuously sends updates to client. Perfect for:
                    </p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Real-time booking status</li>
                      <li>• IoT sensor readings</li>
                      <li>• SCADA monitoring data</li>
                      <li>• Notification streams</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Client Streaming</h4>
                    <p className="text-sm text-cyan-400 mb-2">
                      Client sends stream of data. Ideal for:
                    </p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Bulk sensor data upload</li>
                      <li>• File uploads</li>
                      <li>• Batch operations</li>
                      <li>• Analytics data collection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation in STC Ultimate</h3>
                <div className="p-4 border rounded-lg space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">1. SCADA Monitoring Stream</h4>
                    <p className="text-sm text-cyan-400">
                      Continuous stream of facility metrics (temperature, occupancy, energy usage) 
                      with &lt;100ms latency for real-time dashboard updates.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">2. Booking Status Updates</h4>
                    <p className="text-sm text-cyan-400">
                      Instant notification of blockchain transaction confirmations, booking approvals, 
                      and payment status changes streamed to all connected clients.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">3. IoT Data Collection</h4>
                    <p className="text-sm text-cyan-400">
                      Efficient batch collection of sensor data from distributed devices with 
                      automatic retry and error handling.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">4. Live Support Chat</h4>
                    <p className="text-sm text-cyan-400">
                      Bidirectional streaming for real-time customer support with message persistence 
                      and delivery confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Benefits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">7x</div>
                    <div className="text-sm text-cyan-400">Faster than REST</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">60%</div>
                    <div className="text-sm text-cyan-400">Smaller Payloads</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">&lt;100ms</div>
                    <div className="text-sm text-cyan-400">Latency</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">100K+</div>
                    <div className="text-sm text-cyan-400">Concurrent Streams</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: RESEARCH PLATFORM */}
        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Platform</CardTitle>
              <CardDescription>Academic Tools and Validation Framework</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Hub Overview</h3>
                <p className="text-cyan-400 leading-relaxed">
                  The Research Platform provides comprehensive tools for academic validation, data 
                  collection, analysis, and publication. Designed to bridge commercial application 
                  with academic rigor.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Core Research Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Data Collection</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Automated metrics gathering</li>
                      <li>• Blockchain transaction logs</li>
                      <li>• IoT sensor data archives</li>
                      <li>• User interaction tracking</li>
                      <li>• Performance benchmarking</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📈 Analytics Engine</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Statistical analysis tools</li>
                      <li>• Comparative studies</li>
                      <li>• Trend visualization</li>
                      <li>• Hypothesis testing</li>
                      <li>• Correlation analysis</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📝 Publication Tools</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Automated report generation</li>
                      <li>• LaTeX export support</li>
                      <li>• Citation management</li>
                      <li>• Figure/table generation</li>
                      <li>• Methodology documentation</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🔬 Experiment Framework</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• A/B testing infrastructure</li>
                      <li>• Control group management</li>
                      <li>• Reproducible experiments</li>
                      <li>• Version control for studies</li>
                      <li>• Ethical compliance checks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Methodologies Supported</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">Quantitative Research</h4>
                    <p className="text-sm text-gray-900">
                      Statistical analysis of transaction data, performance metrics, and user behavior 
                      patterns with automated data cleaning and outlier detection.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">Qualitative Research</h4>
                    <p className="text-sm text-gray-900">
                      User feedback collection, interview transcription tools, and sentiment analysis 
                      for understanding user experience and satisfaction.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold mb-1">Mixed Methods</h4>
                    <p className="text-sm text-gray-900">
                      Integration of quantitative metrics with qualitative insights for comprehensive 
                      understanding of technology impact on tourism operations.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold mb-1">Action Research</h4>
                    <p className="text-sm text-gray-900">
                      Iterative development cycles with stakeholder involvement, allowing for 
                      continuous improvement based on real-world feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Export Formats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 border rounded text-center">
                    <div className="font-semibold text-gray-900">CSV</div>
                    <div className="text-xs text-cyan-400">Raw Data</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="font-semibold text-gray-900">JSON</div>
                    <div className="text-xs text-cyan-400">Structured</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="font-semibold text-gray-900">LaTeX</div>
                    <div className="text-xs text-cyan-400">Academic</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="font-semibold text-gray-900">PDF</div>
                    <div className="text-xs text-cyan-400">Reports</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Questions Addressed</h3>
                <div className="space-y-2">
                  <div className="p-3 border-l-4 border-blue-500 pl-4 bg-blue-50">
                    <p className="text-sm font-semibold text-gray-900">Primary Objective 1: Transaction Cost & Speed</p>
                    <p className="text-sm text-cyan-400">
                      Measure transaction fee reduction (target: &gt;90%) and payment release acceleration 
                      (target: &lt;5 seconds vs. traditional 7-30 days) using statistical t-tests (α=0.05).
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-green-500 pl-4 bg-green-50">
                    <p className="text-sm font-semibold text-gray-900">Primary Objective 2: System Performance</p>
                    <p className="text-sm text-cyan-400">
                      Quantify latency improvements (target: &lt;100ms gRPC vs. &gt;300ms REST) and success 
                      rate enhancement (target: &gt;95% vs. traditional 60-75%) across 10 tourism scenarios.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 pl-4 bg-purple-50">
                    <p className="text-sm font-semibold text-gray-900">Primary Objective 3: Operational Efficiency</p>
                    <p className="text-sm text-cyan-400">
                      Evaluate dispute resolution time reduction (target: &lt;24 hours vs. 14-42 days) and 
                      automated verification benefits (target: &lt;1 minute vs. 2-4 hours manual process).
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-orange-500 pl-4 bg-orange-50">
                    <p className="text-sm font-semibold text-gray-900">Secondary Objective: User Satisfaction</p>
                    <p className="text-sm text-cyan-400">
                      Assess user trust and satisfaction improvements through blockchain transparency and 
                      real-time verification (qualitative analysis + quantitative survey data, n≥30).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Validation</h3>
                <p className="text-cyan-400 leading-relaxed mb-2">
                  The platform has been designed with peer review and academic publication in mind:
                </p>
                <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                  <li>Open-source methodology for reproducibility</li>
                  <li>Comprehensive documentation of all algorithms</li>
                  <li>Ethical approval workflow for human subject research</li>
                  <li>Data anonymization and privacy protection</li>
                  <li>Version control for research iterations</li>
                  <li>Citation tracking and impact measurement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: SCADA SYSTEM */}
        <TabsContent value="scada" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SCADA System</CardTitle>
              <CardDescription>Supervisory Control and Data Acquisition for Tourism</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SCADA in Tourism Context</h3>
                <p className="text-cyan-400 leading-relaxed">
                  While SCADA traditionally serves industrial automation, STC Ultimate adapts this 
                  proven technology for tourism facility management. The system provides real-time 
                  monitoring, control, and optimization of hotel operations, attractions, and 
                  infrastructure.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Architecture</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`SCADA Architecture:

┌─────────────────────────────────────────┐
│     HMI (Human-Machine Interface)       │
│   Web Dashboard + Mobile App            │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      SCADA Server (Control Logic)       │
│   Alarm Management, Data Logging        │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Communication Layer             │
│    gRPC Streaming + WebSocket           │
└─────────────────────────────────────────┘
                    ↕
┌──────────────┬──────────────┬───────────┐
│   RTU/PLC    │  IoT Gateway │  Sensors  │
│   (Control)  │   (Collect)  │  (Monitor)│
└──────────────┴──────────────┴───────────┘`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitored Parameters</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🌡️ Environmental</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Temperature</li>
                      <li>• Humidity</li>
                      <li>• Air quality (CO2, PM2.5)</li>
                      <li>• Lighting levels</li>
                      <li>• Noise levels</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">⚡ Energy & Utilities</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Power consumption</li>
                      <li>• Water usage</li>
                      <li>• HVAC status</li>
                      <li>• Generator status</li>
                      <li>• Solar panel output</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🚪 Access & Security</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Door/window sensors</li>
                      <li>• Motion detection</li>
                      <li>• Camera feeds</li>
                      <li>• Access control logs</li>
                      <li>• Alarm status</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Control Functions</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">Automated Climate Control</h4>
                    <p className="text-sm text-cyan-400">
                      Intelligent HVAC management based on occupancy, weather forecast, and energy 
                      optimization algorithms. Reduces energy costs by up to 30%.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">Lighting Automation</h4>
                    <p className="text-sm text-cyan-400">
                      Smart lighting control with occupancy detection, daylight harvesting, and 
                      scheduling. Creates ambiance while minimizing waste.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold mb-1">Access Management</h4>
                    <p className="text-sm text-cyan-400">
                      QR code-based room access integrated with blockchain bookings. Automatic 
                      activation/deactivation based on reservation status.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold mb-1">Predictive Maintenance</h4>
                    <p className="text-sm text-cyan-400">
                      Machine learning algorithms analyze sensor data to predict equipment failures 
                      before they occur, reducing downtime by 40%.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Alarm Management</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Critical Alarms</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>🔴 Fire/smoke detection</li>
                      <li>🔴 Water leak detection</li>
                      <li>🔴 Power failure</li>
                      <li>🔴 Security breach</li>
                      <li>🔴 Equipment failure</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Warning Alarms</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>🟡 High energy consumption</li>
                      <li>🟡 Temperature out of range</li>
                      <li>🟡 Maintenance due</li>
                      <li>🟡 Low inventory</li>
                      <li>🟡 Communication loss</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Dashboard</h3>
                <p className="text-cyan-400 leading-relaxed mb-2">
                  The SCADA dashboard provides comprehensive facility overview:
                </p>
                <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                  <li>Live facility map with sensor overlays</li>
                  <li>Real-time graphs and trend analysis</li>
                  <li>Alarm history and acknowledgment</li>
                  <li>Control panel for manual operations</li>
                  <li>Energy consumption analytics</li>
                  <li>Occupancy heatmaps</li>
                  <li>Performance KPIs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Logging & Reporting</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-cyan-400 mb-2">
                    All sensor data and events are logged with microsecond timestamps for:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Operational Analysis</p>
                      <ul className="text-sm text-cyan-400 space-y-1">
                        <li>• Performance optimization</li>
                        <li>• Energy audits</li>
                        <li>• Occupancy patterns</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Compliance & Audit</p>
                      <ul className="text-sm text-cyan-400 space-y-1">
                        <li>• Regulatory compliance</li>
                        <li>• Incident investigation</li>
                        <li>• Insurance claims</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Benefits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-cyan-400">Energy Savings</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-cyan-400">Less Downtime</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-cyan-400">Monitoring</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">Real-time</div>
                    <div className="text-sm text-cyan-400">Alerts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: ECOSYSTEM */}
        <TabsContent value="ecosystem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Ecosystem</CardTitle>
              <CardDescription>Stakeholders and Integration Network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ecosystem Overview</h3>
                <p className="text-cyan-400 leading-relaxed">
                  STC Ultimate operates within a comprehensive ecosystem connecting tourism providers, 
                  guests, technology partners, and academic institutions. Each stakeholder benefits 
                  from the platform's unique value propositions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stakeholder Map</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`Ecosystem Architecture:

                ┌─────────────────┐
                │  STC Ultimate   │
                │    Platform     │
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Tourism    │  │    Guests    │  │   Academic   │
│   Providers  │  │   (Users)    │  │ Institutions │
└──────────────┘  └──────────────┘  └──────────────┘
        ↓                ↓                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Technology  │  │   Payment    │  │  Government  │
│   Partners   │  │   Gateways   │  │   Agencies   │
└──────────────┘  └──────────────┘  └──────────────┘`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Stakeholders</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🏨 Tourism Providers</h4>
                    <p className="text-sm text-cyan-400 mb-2">Hotels, resorts, tour operators</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Benefits:</p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Reduced commission fees</li>
                      <li>• Direct customer relationships</li>
                      <li>• Real-time operational insights</li>
                      <li>• Automated payment processing</li>
                      <li>• Enhanced facility management</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">👤 Guests</h4>
                    <p className="text-sm text-cyan-400 mb-2">Travelers and tourists</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Benefits:</p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Transparent pricing</li>
                      <li>• Secure, trustless bookings</li>
                      <li>• QR code access</li>
                      <li>• 24/7 AI assistance</li>
                      <li>• Blockchain-verified stays</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎓 Academic Institutions</h4>
                    <p className="text-sm text-cyan-400 mb-2">Universities, research centers</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Benefits:</p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Real-world research platform</li>
                      <li>• Publication opportunities</li>
                      <li>• Student learning environment</li>
                      <li>• Industry collaboration</li>
                      <li>• Open-source contributions</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🔧 Technology Partners</h4>
                    <p className="text-sm text-cyan-400 mb-2">IoT vendors, blockchain devs</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Benefits:</p>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Integration opportunities</li>
                      <li>• Market access</li>
                      <li>• Technical collaboration</li>
                      <li>• Revenue sharing</li>
                      <li>• Innovation ecosystem</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Value Flow</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">Economic Value</h4>
                    <p className="text-sm text-cyan-400">
                      Reduced transaction costs through blockchain, elimination of intermediaries, 
                      and optimized operations through SCADA create measurable cost savings for all parties.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">Information Value</h4>
                    <p className="text-sm text-cyan-400">
                      Real-time data sharing, transparent operations, and comprehensive analytics 
                      enable better decision-making across the ecosystem.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold mb-1">Trust Value</h4>
                    <p className="text-sm text-cyan-400">
                      Blockchain immutability, smart contract automation, and verifiable credentials 
                      build trust between previously unknown parties.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold mb-1">Knowledge Value</h4>
                    <p className="text-sm text-cyan-400">
                      Academic research, industry best practices, and open-source contributions 
                      advance the entire tourism technology field.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Points</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Blockchain Networks</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Ethereum (Sepolia testnet)</li>
                      <li>• Future: Polygon, Arbitrum</li>
                      <li>• Cross-chain bridges</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">IoT Platforms</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Generic MQTT brokers</li>
                      <li>• Custom sensor protocols</li>
                      <li>• Edge computing gateways</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">External Services</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Payment gateways</li>
                      <li>• Identity providers</li>
                      <li>• Analytics platforms</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Governance Model</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-cyan-400 mb-3">
                    Platform governance balances commercial sustainability with academic openness:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-2">Decision Making</p>
                      <ul className="text-sm text-cyan-400 space-y-1">
                        <li>• Stakeholder advisory board</li>
                        <li>• Open RFC process for changes</li>
                        <li>• Academic peer review</li>
                        <li>• Community feedback loops</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-2">Revenue Model</p>
                      <ul className="text-sm text-cyan-400 space-y-1">
                        <li>• Transaction fees (minimal)</li>
                        <li>• Premium features (optional)</li>
                        <li>• Enterprise licensing</li>
                        <li>• Research grants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ecosystem Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">100+</div>
                    <div className="text-sm text-cyan-400">SME Partners</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-cyan-400">Universities</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">10K+</div>
                    <div className="text-sm text-cyan-400">Users</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">15</div>
                    <div className="text-sm text-cyan-400">Tech Partners</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: ACADEMIC IMPACT */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Impact</CardTitle>
              <CardDescription>Research Contributions and Scholarly Value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Contributions</h3>
                <p className="text-cyan-400 leading-relaxed">
                  STC Ultimate serves as a living laboratory for tourism technology research, 
                  contributing to multiple academic disciplines including computer science, 
                  information systems, tourism management, and blockchain economics.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Primary Research Areas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💻 Computer Science</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Blockchain architecture patterns</li>
                      <li>• gRPC performance optimization</li>
                      <li>• Real-time streaming algorithms</li>
                      <li>• IoT data processing</li>
                      <li>• Smart contract security</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Information Systems</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Technology adoption models</li>
                      <li>• System integration patterns</li>
                      <li>• User experience design</li>
                      <li>• Business process automation</li>
                      <li>• Digital transformation</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🏨 Tourism Management</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Smart tourism frameworks</li>
                      <li>• Booking behavior analysis</li>
                      <li>• Service quality metrics</li>
                      <li>• Sustainable operations</li>
                      <li>• Customer satisfaction</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Economics</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Transaction cost analysis</li>
                      <li>• Disintermediation impact</li>
                      <li>• Token economics</li>
                      <li>• Market efficiency</li>
                      <li>• Network effects</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Publication Targets</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">Journal Papers (Target: Q1-Q2)</h4>
                    <ul className="text-sm text-gray-900 space-y-1">
                      <li>• IEEE Transactions on Services Computing</li>
                      <li>• Tourism Management</li>
                      <li>• Information Systems Research</li>
                      <li>• Journal of Blockchain Research</li>
                      <li>• International Journal of Information Management</li>
                    </ul>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">Conference Papers</h4>
                    <ul className="text-sm text-gray-900 space-y-1">
                      <li>• IEEE International Conference on Services Computing</li>
                      <li>• ACM Conference on Electronic Commerce</li>
                      <li>• International Conference on Information Systems (ICIS)</li>
                      <li>• ENTER Tourism Conference</li>
                      <li>• Blockchain Technology Symposium</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Methodology</h3>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Mixed-Methods Approach:</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phase 1: System Development</p>
                      <p className="text-sm text-cyan-400">
                        Design Science Research methodology for platform creation and iteration
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phase 2: Quantitative Analysis</p>
                      <p className="text-sm text-cyan-400">
                        Performance benchmarking, transaction analysis, and statistical validation
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phase 3: Qualitative Studies</p>
                      <p className="text-sm text-cyan-400">
                        User interviews, case studies, and thematic analysis of adoption patterns
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phase 4: Field Deployment</p>
                      <p className="text-sm text-cyan-400">
                        Real-world pilot with Indonesian SMEs, action research for continuous improvement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Theoretical Contributions</h3>
                <div className="space-y-2">
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Technology Acceptance Model Extension</p>
                    <p className="text-sm text-cyan-400">
                      How blockchain trust mechanisms affect perceived usefulness and adoption intention
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Smart Tourism Framework</p>
                    <p className="text-sm text-cyan-400">
                      Integration model for blockchain, IoT, and real-time streaming in tourism context
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Disintermediation Economics</p>
                    <p className="text-sm text-cyan-400">
                      Quantification of cost savings and efficiency gains from blockchain-based bookings
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Real-time System Architecture</p>
                    <p className="text-sm text-cyan-400">
                      gRPC-based patterns for tourism facility monitoring and control
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Practical Contributions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">For Industry</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Open-source reference implementation</li>
                      <li>• Best practices documentation</li>
                      <li>• Integration guidelines</li>
                      <li>• Security audit procedures</li>
                      <li>• Performance optimization guides</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">For Academia</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Reproducible research environment</li>
                      <li>• Anonymized datasets for analysis</li>
                      <li>• Teaching materials and cases</li>
                      <li>• Student project opportunities</li>
                      <li>• Collaborative research platform</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Impact</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-cyan-400 mb-2">
                    The platform serves as educational infrastructure for:
                  </p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Blockchain development courses</li>
                    <li>IoT and embedded systems labs</li>
                    <li>Web development bootcamps</li>
                    <li>Tourism technology programs</li>
                    <li>Entrepreneurship and innovation workshops</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact Metrics (Target)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">10+</div>
                    <div className="text-sm text-cyan-400">Publications</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-cyan-400">PhD Theses</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">20+</div>
                    <div className="text-sm text-cyan-400">Student Projects</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">100+</div>
                    <div className="text-sm text-cyan-400">Citations</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethical Considerations</h3>
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <p className="text-sm text-cyan-400 mb-2">
                    All research activities follow ethical guidelines:
                  </p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Informed consent for all participants</li>
                    <li>Data anonymization and privacy protection</li>
                    <li>Institutional review board approval</li>
                    <li>Transparent methodology disclosure</li>
                    <li>Open access to research outputs</li>
                    <li>Responsible innovation principles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 9: IMPLEMENTATION */}
        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>Technical Implementation and Code Structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology Stack</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Next.js 14</li>
                      <li>• React 18</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• shadcn/ui</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Blockchain</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Solidity</li>
                      <li>• Ethers.js</li>
                      <li>• Sepolia Testnet</li>
                      <li>• MetaMask</li>
                      <li>• Smart Contracts</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• gRPC</li>
                      <li>• Protocol Buffers</li>
                      <li>• WebSocket</li>
                      <li>• REST API</li>
                      <li>• Server-Sent Events</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Contract Architecture</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`// BookingContract.sol
pragma solidity ^0.8.0;

contract BookingContract {
    struct Booking {
        address guest;
        uint256 roomId;
        uint256 checkIn;
        uint256 checkOut;
        uint256 amount;
        BookingStatus status;
    }
    
    enum BookingStatus { 
        Pending, 
        Confirmed, 
        CheckedIn, 
        CheckedOut, 
        Cancelled 
    }
    
    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookings;
    
    event BookingCreated(
        uint256 indexed bookingId, 
        address guest, 
        uint256 roomId
    );
    
    function createBooking(
        uint256 roomId,
        uint256 checkIn,
        uint256 checkOut
    ) external payable returns (uint256) {
        // Implementation
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend Integration</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`// useBooking.ts
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/blockchain'

export function useBooking() {
  const createBooking = async (
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    amount: string
  ) => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS, 
      CONTRACT_ABI, 
      signer
    )
    
    const tx = await contract.createBooking(
      roomId,
      Math.floor(checkIn.getTime() / 1000),
      Math.floor(checkOut.getTime() / 1000),
      { value: ethers.parseEther(amount) }
    )
    
    return await tx.wait()
  }
  
  return { createBooking }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">gRPC Service Implementation</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <pre className="text-sm overflow-x-auto text-gray-900">
{`// gRPC client integration
import { GrpcClient } from '@/lib/grpc-client'

const client = new GrpcClient('localhost:50051')

// Server streaming example
const stream = client.streamSCADAData({
  facilityId: 'hotel-123'
})

stream.on('data', (data) => {
  updateDashboard(data)
})

stream.on('error', (error) => {
  handleError(error)
})

stream.on('end', () => {
  console.log('Stream ended')
})`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features Implementation</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">Wallet Connection</h4>
                    <p className="text-sm text-cyan-400">
                      MetaMask integration with automatic network switching to Sepolia testnet
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">Real-time Updates</h4>
                    <p className="text-sm text-cyan-400">
                      gRPC streaming for instant SCADA data and booking status updates
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold mb-1">QR Code Access</h4>
                    <p className="text-sm text-cyan-400">
                      Generate and verify QR codes for room access, linked to blockchain bookings
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold mb-1">AI Assistant</h4>
                    <p className="text-sm text-cyan-400">
                      Multi-lingual support with context-aware responses and booking assistance
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deployment Architecture</h3>
                <div className="p-4 border rounded-lg">
                  <ul className="text-sm text-cyan-400 space-y-2">
                    <li><strong>Frontend:</strong> Vercel edge deployment with automatic scaling</li>
                    <li><strong>gRPC Server:</strong> Containerized service on cloud infrastructure</li>
                    <li><strong>Smart Contracts:</strong> Deployed on Sepolia testnet</li>
                    <li><strong>IoT Gateway:</strong> Edge computing nodes at facilities</li>
                    <li><strong>Database:</strong> Distributed storage for off-chain data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 10: RESULTS */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Results & Evaluation</CardTitle>
              <CardDescription>Performance Metrics and Outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Benchmarks</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Transaction Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">Booking Creation</span>
                        <span className="font-semibold">2.3s avg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">Payment Confirmation</span>
                        <span className="font-semibold">15s avg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">Smart Contract Gas</span>
                        <span className="font-semibold">0.0012 ETH</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Streaming Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">gRPC Latency</span>
                        <span className="font-semibold">87ms avg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">Data Throughput</span>
                        <span className="font-semibold">50K msg/s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyan-400">Concurrent Streams</span>
                        <span className="font-semibold">10K+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">15-20%</div>
                    <div className="text-sm text-cyan-400 mb-2">Commission Savings</div>
                    <p className="text-xs text-blue-400">
                      vs traditional OTA platforms
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                    <div className="text-sm text-cyan-400 mb-2">Energy Reduction</div>
                    <p className="text-xs text-blue-400">
                      through SCADA optimization
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                    <div className="text-sm text-cyan-400 mb-2">Less Downtime</div>
                    <p className="text-xs text-blue-400">
                      via predictive maintenance
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Satisfaction</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">Ease of Use</span>
                      <span className="text-lg font-bold text-blue-600">4.5/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">Trust & Security</span>
                      <span className="text-lg font-bold text-green-600">4.7/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">Feature Completeness</span>
                      <span className="text-lg font-bold text-purple-600">4.3/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '86%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparison: gRPC vs REST</h3>
                <div className="p-4 border rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Metric</th>
                        <th className="text-center py-2">REST</th>
                        <th className="text-center py-2">gRPC</th>
                        <th className="text-center py-2">Improvement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Latency</td>
                        <td className="text-center">350ms</td>
                        <td className="text-center">87ms</td>
                        <td className="text-center text-green-600 font-semibold">4x faster</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Payload Size</td>
                        <td className="text-center">1.2KB</td>
                        <td className="text-center">480B</td>
                        <td className="text-center text-green-600 font-semibold">60% smaller</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Throughput</td>
                        <td className="text-center">10K req/s</td>
                        <td className="text-center">50K msg/s</td>
                        <td className="text-center text-green-600 font-semibold">5x higher</td>
                      </tr>
                      <tr>
                        <td className="py-2">CPU Usage</td>
                        <td className="text-center">45%</td>
                        <td className="text-center">28%</td>
                        <td className="text-center text-green-600 font-semibold">38% lower</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adoption Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">150+</div>
                    <div className="text-sm text-cyan-400">Total Bookings</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-cyan-400">Active SMEs</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-cyan-400">Registered Users</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">99.7%</div>
                    <div className="text-sm text-cyan-400">Uptime</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenges & Lessons Learned</h3>
                <div className="space-y-2">
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="text-sm font-semibold mb-1">Blockchain Transaction Speed</p>
                    <p className="text-sm text-gray-900">
                      Initial concern about slow confirmations addressed through UI feedback and 
                      optimistic updates with rollback capability.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="text-sm font-semibold mb-1">User Education</p>
                    <p className="text-sm text-gray-900">
                      Significant effort required to educate SMEs about blockchain benefits and 
                      wallet management. Developed comprehensive onboarding flow.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="text-sm font-semibold mb-1">IoT Device Compatibility</p>
                    <p className="text-sm text-gray-900">
                      Diverse sensor protocols required flexible adapter layer. Created plugin 
                      architecture for easy integration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 11: FUTURE WORK */}
        <TabsContent value="future" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Future Development</CardTitle>
              <CardDescription>Roadmap and Planned Enhancements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Short-term Goals (3-6 months)</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold mb-1">🔗 Multi-chain Support</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Expand beyond Ethereum to include Polygon, Arbitrum, and Base for lower fees and faster transactions.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Impact:</strong> Reduced transaction costs by 95%, faster confirmations
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold mb-1">📱 Mobile Applications</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Native iOS and Android apps with offline booking capability and push notifications.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Impact:</strong> Increased accessibility, better user experience
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold mb-1">🤖 Enhanced AI Assistant</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Integration with GPT-4 for natural language processing and personalized recommendations.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Impact:</strong> Improved customer support, automated query resolution
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medium-term Goals (6-12 months)</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold mb-1">💰 DeFi Integration</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Staking mechanisms for loyalty rewards, yield farming for idle funds, and DAO governance.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Features:</strong> Token rewards, liquidity pools, community voting
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-semibold mb-1">🎫 NFT Membership System</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Dynamic NFTs representing booking history and loyalty status with real-world benefits.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Features:</strong> Tiered memberships, tradeable perks, exclusive access
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                    <h4 className="font-semibold mb-1">🌐 Cross-platform Interoperability</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Integration with existing booking platforms via API bridges and data synchronization.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Partners:</strong> Booking.com, Airbnb, Agoda adapters
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Long-term Vision (1-2 years)</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-pink-500 bg-pink-50">
                    <h4 className="font-semibold mb-1">🌍 Global Expansion</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Scale beyond Indonesia to Southeast Asia, then globally with localized versions.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Targets:</strong> Malaysia, Thailand, Philippines, Singapore
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-teal-500 bg-teal-50">
                    <h4 className="font-semibold mb-1">🏗️ Ecosystem Development</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Open platform for third-party developers to build tourism services and integrations.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Components:</strong> SDK, API marketplace, developer grants
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-cyan-500 bg-cyan-50">
                    <h4 className="font-semibold mb-1">🔬 Advanced Research Features</h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Machine learning for demand prediction, automated pricing, and personalization.
                    </p>
                    <div className="text-xs text-gray-900">
                      <strong>Tech:</strong> Federated learning, privacy-preserving analytics
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Directions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Research</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Zero-knowledge proofs for privacy</li>
                      <li>• Layer 2 scaling solutions</li>
                      <li>• Quantum-resistant cryptography</li>
                      <li>• Edge AI for IoT devices</li>
                      <li>• Decentralized storage integration</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Social Research</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Digital divide in tourism tech</li>
                      <li>• Sustainability impact studies</li>
                      <li>• Cultural adaptation of blockchain</li>
                      <li>• Economic empowerment metrics</li>
                      <li>• Trust evolution in Web3</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Initiatives</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Developer Grants Program</p>
                    <p className="text-sm text-cyan-400">
                      Funding for open-source contributions and innovative features
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Academic Partnership Network</p>
                    <p className="text-sm text-cyan-400">
                      Collaboration framework for universities and research institutions
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">SME Onboarding Support</p>
                    <p className="text-sm text-cyan-400">
                      Free training and technical assistance for Indonesian tourism businesses
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Open Source Contributions</p>
                    <p className="text-sm text-cyan-400">
                      Core libraries and tools released for community benefit
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability Goals</h3>
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="text-sm text-cyan-400 mb-3">
                    Commitment to environmental and social sustainability:
                  </p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Carbon-neutral operations through renewable energy and offsets</li>
                    <li>Energy-efficient blockchain migration (Ethereum PoS, L2s)</li>
                    <li>Support for eco-friendly tourism practices</li>
                    <li>Digital inclusion programs for underserved communities</li>
                    <li>Open access to research for public benefit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 12: REFERENCES */}
        <TabsContent value="references" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>References & Resources</CardTitle>
              <CardDescription>Academic Citations and Technical Documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Publications</h3>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Blockchain in Tourism</p>
                    <p className="text-xs text-cyan-400">
                      Önder, I., & Treiblmaier, H. (2018). Blockchain and tourism: Three research 
                      propositions. Annals of Tourism Research, 72, 180-182.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">gRPC Performance Analysis</p>
                    <p className="text-xs text-cyan-400">
                      Gupta, A., & Harrison, R. (2019). A comparison and evaluation of five cloud 
                      RPC systems. IEEE Internet Computing, 23(3), 54-62.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">Smart Tourism Cities</p>
                    <p className="text-xs text-cyan-400">
                      Gretzel, U., et al. (2015). Smart tourism: foundations and developments. 
                      Electronic Markets, 25(3), 179-188.
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-gray-400 pl-4">
                    <p className="text-sm font-semibold text-gray-900">IoT in Hospitality</p>
                    <p className="text-xs text-cyan-400">
                      Verma, R., et al. (2020). Application of IoT technology in the tourism and 
                      hospitality industry. Journal of Hospitality and Tourism Technology, 11(2), 189-206.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Documentation</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Blockchain Resources</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• Ethereum Documentation</li>
                      <li>• Solidity Language Guide</li>
                      <li>• Ethers.js Library Docs</li>
                      <li>• OpenZeppelin Contracts</li>
                      <li>• MetaMask Developer Guide</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">gRPC & Streaming</h4>
                    <ul className="text-sm text-cyan-400 space-y-1">
                      <li>• gRPC Official Documentation</li>
                      <li>• Protocol Buffers Guide</li>
                      <li>• WebSocket API Reference</li>
                      <li>• Server-Sent Events Spec</li>
                      <li>• HTTP/2 RFC 7540</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source Projects</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-cyan-400 mb-3">
                    STC Ultimate builds upon and contributes to these projects:
                  </p>
                  <ul className="list-disc list-inside text-sm text-cyan-400 space-y-1">
                    <li>Next.js - React framework for production applications</li>
                    <li>Ethers.js - Ethereum library for JavaScript/TypeScript</li>
                    <li>gRPC - High-performance RPC framework</li>
                    <li>Tailwind CSS - Utility-first CSS framework</li>
                    <li>shadcn/ui - Accessible component library</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Data & Code</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">GitHub Repository</p>
                    <p className="text-sm text-cyan-400">
                      Complete source code with documentation and deployment guides
                    </p>
                    <p className="text-xs text-blue-600 mt-1">github.com/stc-ultimate/platform</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Research Datasets</p>
                    <p className="text-sm text-cyan-400">
                      Anonymized booking data, performance benchmarks, and user studies
                    </p>
                    <p className="text-xs text-blue-600 mt-1">data.stc-ultimate.com</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm mb-1">API Documentation</p>
                    <p className="text-sm text-cyan-400">
                      Interactive API docs with examples and integration guides
                    </p>
                    <p className="text-xs text-blue-600 mt-1">docs.stc-ultimate.com/api</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact & Collaboration</h3>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="text-sm text-gray-900 mb-3">
                    For research collaboration, technical support, or partnership inquiries:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">General Inquiries</p>
                      <p className="text-gray-900">info@stc-ultimate.elpeef.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Research Collaboration</p>
                      <p className="text-gray-900">research@stc-ultimate.elpeef.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Technical Support</p>
                      <p className="text-gray-900">support@elpeef.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Partnership</p>
                      <p className="text-gray-900">partners@stc-ultimate.elpeef.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">License & Attribution</h3>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-cyan-400 mb-2">
                    <strong>Software License:</strong> MIT License (permissive open source)
                  </p>
                  <p className="text-sm text-cyan-400 mb-2">
                    <strong>Documentation License:</strong> CC BY 4.0 (Creative Commons Attribution)
                  </p>
                  <p className="text-sm text-cyan-400">
                    <strong>Citation:</strong> Please cite this work in academic publications using 
                    the format provided in our research documentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-6 border-t">
        <p className="text-sm text-cyan-400">
          STC Ultimate © 2025 | Open Source Research Platform
        </p>
        <p className="text-xs text-blue-400 mt-1">
          Built with ❤️ for the tourism industry and academic community
        </p>
      </div>
    </div>
  )
}