'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  Globe,
  Lightbulb,
  Server,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Cpu,
  Target,
  Award,
  Clock,
  DollarSign,
  Wifi,
  Lock,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  Webhook,
  Key,
  Code,
  Copy,
  Network
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  uptime: number;
  activeUsers: number;
}

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface DashboardSummaryProps {
  onNavigateToModule?: (module: string) => void;
}

export default function DashboardSummary({ onNavigateToModule }: DashboardSummaryProps) {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
    { name: 'SCADA System', status: 'operational', uptime: 99.8, activeUsers: 12 },
    { name: 'Tourism Platform', status: 'operational', uptime: 99.5, activeUsers: 234 },
    { name: 'Blockchain Network', status: 'operational', uptime: 100, activeUsers: 156 },
    { name: 'Research Module', status: 'operational', uptime: 98.9, activeUsers: 8 },
    { name: 'AI Assistant', status: 'operational', uptime: 99.2, activeUsers: 189 }
  ]);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate overall metrics
  const totalUptime = systemStatuses.reduce((acc, sys) => acc + sys.uptime, 0) / systemStatuses.length;
  const totalActiveUsers = systemStatuses.reduce((acc, sys) => acc + sys.activeUsers, 0);
  const operationalSystems = systemStatuses.filter(s => s.status === 'operational').length;

  const keyMetrics: MetricCard[] = [
    {
      id: 'overall-uptime',
      title: 'Overall System Uptime',
      value: totalUptime.toFixed(1),
      unit: '%',
      change: '+0.3%',
      changeType: 'positive',
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: totalActiveUsers,
      change: '+12%',
      changeType: 'positive',
      icon: <Users className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'iot-devices',
      title: 'IoT Devices Online',
      value: '16/18',
      change: 'stable',
      changeType: 'neutral',
      icon: <Wifi className="h-5 w-5" />,
      color: 'cyan'
    },
    {
      id: 'transactions',
      title: 'Blockchain Transactions',
      value: '1,247',
      change: '+8.5%',
      changeType: 'positive',
      icon: <Database className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'energy',
      title: 'Energy Consumption',
      value: '342.5',
      unit: 'kWh',
      change: '-5.2%',
      changeType: 'positive',
      icon: <Zap className="h-5 w-5" />,
      color: 'yellow'
    },
    {
      id: 'security',
      title: 'Security Score',
      value: '98',
      unit: '/100',
      change: '+2 pts',
      changeType: 'positive',
      icon: <Shield className="h-5 w-5" />,
      color: 'red'
    },
    {
      id: 'research-points',
      title: 'Research Data Points',
      value: '2,340',
      change: '+156',
      changeType: 'positive',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'orange'
    },
    {
      id: 'response-time',
      title: 'Avg Response Time',
      value: '285',
      unit: 'ms',
      change: '-18ms',
      changeType: 'positive',
      icon: <Clock className="h-5 w-5" />,
      color: 'teal'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive', text: string, color: string }> = {
      operational: { variant: 'default', text: 'Operational', color: 'text-green-400' },
      degraded: { variant: 'secondary', text: 'Degraded', color: 'text-yellow-400' },
      offline: { variant: 'destructive', text: 'Offline', color: 'text-red-400' }
    };
    const badge = statusMap[status] || { variant: 'secondary' as const, text: 'Unknown', color: 'text-gray-400' };
    return (
      <Badge variant={badge.variant} className={badge.color}>
        {badge.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Platform Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive overview of STC Ultimate smart tourism ecosystem
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-400">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <Alert className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <AlertTitle className="text-green-400">All Systems Operational</AlertTitle>
        <AlertDescription>
          {operationalSystems} of {systemStatuses.length} systems are running normally. 
          Average uptime: {totalUptime.toFixed(1)}%. No critical alerts detected.
        </AlertDescription>
      </Alert>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`text-${metric.color}-400 p-2 rounded-lg bg-${metric.color}-500/10`}>
                  {metric.icon}
                </div>
                <Badge 
                  variant="outline"
                  className={`text-xs ${
                    metric.changeType === 'positive' ? 'text-green-400 border-green-400' :
                    metric.changeType === 'negative' ? 'text-red-400 border-red-400' :
                    'text-gray-400 border-gray-400'
                  }`}
                >
                  {metric.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Status */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-cyan-400" />
              System Modules Status
            </CardTitle>
            <CardDescription>Real-time status of all platform modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatuses.map((system) => (
                <div key={system.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{system.name}</h4>
                      {getStatusBadge(system.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {system.uptime}% uptime
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {system.activeUsers} users
                      </span>
                    </div>
                  </div>
                  {system.name !== 'AI Assistant' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigateToModule?.(system.name.toLowerCase())}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API & Integration Endpoints */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-400" />
              API & Integration Endpoints
            </CardTitle>
            <CardDescription>Connect external tools to STC Ultimate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* REST API Endpoint */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-white text-sm">REST API</span>
                  </div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">GET/POST</Badge>
                </div>
                <code className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded block break-all">
                  https://api.stc-ultimate.com/v1/
                </code>
              </div>

              {/* Webhook Endpoint */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-white text-sm">Webhook</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded block break-all">
                  https://hooks.stc-ultimate.com/events
                </code>
              </div>

              {/* API Key */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-purple-400" />
                    <span className="font-semibold text-white text-sm">API Key</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded block break-all">
                  stc_live_••••••••••••••••7x9k
                </code>
              </div>

              {/* Parameters Info */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-orange-400" />
                  <span className="font-semibold text-white text-sm">Query Parameters</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-900 px-2 py-0.5 rounded">module</code>
                    <span className="text-gray-500">scada | tourism | blockchain | research</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-900 px-2 py-0.5 rounded">format</code>
                    <span className="text-gray-500">json | csv | pdf</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-gray-900/50">
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="research">
            <BarChart3 className="h-4 w-4 mr-2" />
            Research Insights
          </TabsTrigger>
          <TabsTrigger value="blockchain">
            <Database className="h-4 w-4 mr-2" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-cyan-400">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Memory Usage</span>
                    <span className="text-blue-400">62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Network Load</span>
                    <span className="text-purple-400">38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">IoT Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Device Response</span>
                    <span className="text-green-400">285ms</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Data Accuracy</span>
                    <span className="text-emerald-400">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Connectivity</span>
                    <span className="text-teal-400">88.9%</span>
                  </div>
                  <Progress value={88.9} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">User Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-green-400">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Satisfaction</span>
                    <span className="text-blue-400">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-cyan-400">1.2s</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Research Metrics Overview</CardTitle>
              <CardDescription>Key findings for dissertation and academic publication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Transaction Latency</p>
                  <p className="text-3xl font-bold text-blue-400">3,250ms</p>
                  <p className="text-xs text-gray-500 mt-1">Avg response time</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">IoT Response</p>
                  <p className="text-3xl font-bold text-green-400">285ms</p>
                  <p className="text-xs text-gray-500 mt-1">Device interaction</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Gas Optimization</p>
                  <p className="text-3xl font-bold text-purple-400">-12.4%</p>
                  <p className="text-xs text-gray-500 mt-1">Cost reduction</p>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Data Points</p>
                  <p className="text-3xl font-bold text-orange-400">2,340</p>
                  <p className="text-xs text-gray-500 mt-1">Collected samples</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Blockchain Activity</CardTitle>
              <CardDescription>Smart contract and transaction analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-400">Transaction Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Total Transactions</span>
                      <span className="font-bold text-white">1,247</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Success Rate</span>
                      <span className="font-bold text-green-400">98.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Avg Block Time</span>
                      <span className="font-bold text-cyan-400">13.5s</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-400">Smart Contracts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Deployed Contracts</span>
                      <span className="font-bold text-white">8</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Gas Savings</span>
                      <span className="font-bold text-green-400">24.8%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-400">Network</span>
                      <span className="font-bold text-purple-400">Sepolia</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Platform security status and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-green-400">Access Control</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">Secure</p>
                  <p className="text-sm text-gray-400">All access points protected</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-blue-400">Blockchain Audit</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">Active</p>
                  <p className="text-sm text-gray-400">All transactions verified</p>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-semibold text-yellow-400">Alerts</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">3 Active</p>
                  <p className="text-sm text-gray-400">Minor warnings only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SME Business Integrations - HCPS Tourism 5.0 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            SME Business Intelligence
          </h2>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
            HCPS 5.0
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DAO Treasury Allocation */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <DollarSign className="h-5 w-5" />
                DAO Treasury Allocation
              </CardTitle>
              <CardDescription>Real-time treasury funds for business operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Treasury */}
              <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Total Treasury Balance</p>
                <p className="text-3xl font-bold text-purple-400">12.45 ETH</p>
                <p className="text-xs text-gray-500 mt-1">≈ $24,892 USD</p>
              </div>

              {/* Allocation Breakdown */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Marketing Budget</span>
                    <span className="text-purple-400">4.2 ETH (34%)</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Operations Fund</span>
                    <span className="text-cyan-400">5.5 ETH (44%)</span>
                  </div>
                  <Progress value={44} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Reserve Pool</span>
                    <span className="text-green-400">2.75 ETH (22%)</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2">
                <Button 
                  size="sm" 
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                  onClick={() => {
                    console.log('🔴 View Treasury Details clicked!');
                    if (onNavigateToModule) {
                      console.log('🔴 Navigating to dao-governance...');
                      onNavigateToModule('dao-governance');
                    } else {
                      console.log('🔴 onNavigateToModule is undefined!');
                      alert('Navigation: Opening DAO Governance module...');
                    }
                  }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Treasury Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cross-Chain Payment Options */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30 hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Network className="h-5 w-5" />
                Cross-Chain Payments
              </CardTitle>
              <CardDescription>Multi-network payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Active Networks */}
              <div className="space-y-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="font-semibold text-white text-sm">Ethereum Sepolia</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-cyan-400 font-semibold">8.3 ETH</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="font-semibold text-white text-sm">Base Network</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400 text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-blue-400 font-semibold">12.7 ETH</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="font-semibold text-white text-sm">Polygon zkEVM</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Bridge Fee</span>
                    <span className="text-purple-400 font-semibold">0.002 ETH</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-2 border-t border-cyan-500/20">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <p className="text-gray-400">Total Processed</p>
                    <p className="text-lg font-bold text-cyan-400">21.0 ETH</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Bridge Time</p>
                    <p className="text-lg font-bold text-blue-400">~15s</p>
                  </div>
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30"
                onClick={() => {
                  console.log('🔴 Configure Networks clicked!');
                  toast.info('Cross-Chain Network Configuration', {
                    description: '✓ Ethereum Sepolia: Active (8.3 ETH)\n✓ Base Network: Active (12.7 ETH)\n⚡ Polygon zkEVM: Pending Setup\n\nTotal Volume: 21.0 ETH processed in 24h',
                    duration: 5000,
                  });
                }}
              >
                <Network className="h-4 w-4 mr-2" />
                Configure Networks
              </Button>
            </CardContent>
          </Card>

          {/* AI-Powered Pricing Recommendations */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border-orange-500/30 hover:border-orange-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Lightbulb className="h-5 w-5" />
                AI Pricing Intelligence
              </CardTitle>
              <CardDescription>Dynamic pricing optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Pricing Status */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="font-semibold text-green-400 text-sm">Optimal Pricing Detected</span>
                </div>
                <p className="text-xs text-gray-400">Your current prices are competitive and aligned with market demand</p>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-3">
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">Temple Tour Package</span>
                    <Badge className="bg-orange-500/20 text-orange-300 text-xs">+8%</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">High demand detected. Consider price increase</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Current: 0.5 ETH</span>
                    <span className="text-orange-400 font-semibold">→ 0.54 ETH</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">Beach Resort Stay</span>
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">Optimal</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Price matches market trends perfectly</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Current: 1.2 ETH</span>
                    <span className="text-green-400 font-semibold">✓ No change</span>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">Cultural Workshop</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">-5%</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Low booking rate. Discount may boost sales</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Current: 0.3 ETH</span>
                    <span className="text-yellow-400 font-semibold">→ 0.285 ETH</span>
                  </div>
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
                onClick={() => {
                  console.log('🔴 Apply AI Recommendations clicked!');
                  toast.success('AI Pricing Recommendations Applied! 💡', {
                    description: '✓ Temple Tour: 0.5 → 0.54 ETH (+8%)\n✓ Beach Resort: 1.2 ETH (No change)\n✓ Cultural Workshop: 0.3 → 0.285 ETH (-5%)\n\nOptimal pricing activated. Monitor bookings for 7 days.',
                    duration: 6000,
                  });
                }}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Apply AI Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Info Footer */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <Award className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">STC Ultimate Platform</h3>
              <p className="text-sm text-gray-400 mb-3">
                Comprehensive blockchain-enabled smart tourism management system. 
                Integrated SCADA, IoT devices, research analytics, and AI assistance for SME tourism operators in Indonesia.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  <Database className="h-3 w-3 mr-1" />
                  Blockchain Verified
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time Monitoring
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Research Ready
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  <Globe className="h-3 w-3 mr-1" />
                  IoT Integrated
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
