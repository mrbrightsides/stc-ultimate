'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Droplet,
  Fan,
  Gauge,
  Home,
  Lightbulb,
  Lock,
  Power,
  Radio,
  Server,
  Thermometer,
  TrendingUp,
  Unlock,
  Wifi,
  Wind,
  Zap,
  Eye,
  MapPin,
  Users,
  DoorOpen,
  DoorClosed,
  Camera,
  BellRing,
  Settings,
  Database,
  Shield,
  Navigation,
  FileText,
  Link,
  Target,
  BarChart3,
  Battery,
  UserCheck
} from 'lucide-react';

import { LiveDeviceMap } from './live-device-map';
import { TriggerLogs } from './trigger-logs';
import { SmartContractFeed } from './smart-contract-feed';
import { AnomalyDetector } from './anomaly-detector';
import { SystemHealthPanel } from './system-health-panel';
import EnergyOptimizer from '../EnergyOptimizer';
import VisitorDensityMonitor from '../VisitorDensityMonitor';
import ActivityLog from './activity-log';
import BlockchainIoTTimeline from './blockchain-iot-timeline';
import RealtimeBlockchainDashboard from './realtime-blockchain-dashboard';
import EventHistoryAnalytics from './event-history-analytics';
import { GrpcStreamMonitor } from './grpc-stream-monitor';
import { EnhancedRealtimeDashboard } from './enhanced-realtime-dashboard';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'controller';
  category: 'hvac' | 'lighting' | 'security' | 'access' | 'environment' | 'network';
  status: 'online' | 'offline' | 'warning' | 'error';
  value?: number;
  unit?: string;
  location: string;
  lastUpdate: number;
  isControllable: boolean;
  isActive?: boolean;
}

interface SystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  deviceId?: string;
  acknowledged: boolean;
}

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface OperatorAccount {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'senior_operator' | 'operator' | 'viewer';
  department: string;
}

interface SCADAControlSystemProps {
  onBackToLanding?: () => void;
  operator?: OperatorAccount;
}

export default function ScadaControlSystem({ onBackToLanding, operator }: SCADAControlSystemProps) {
  const [devices, setDevices] = useState<IoTDevice[]>([
    // HVAC Systems
    {
      id: 'hvac-001',
      name: 'Hotel Lobby HVAC',
      type: 'actuator',
      category: 'hvac',
      status: 'online',
      value: 22.5,
      unit: '°C',
      location: 'Hotel Lobby - Floor 1',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'hvac-002',
      name: 'Restaurant AC Unit',
      type: 'actuator',
      category: 'hvac',
      status: 'online',
      value: 23.0,
      unit: '°C',
      location: 'Restaurant - Floor 2',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'hvac-003',
      name: 'Guest Room HVAC Zone A',
      type: 'actuator',
      category: 'hvac',
      status: 'warning',
      value: 26.5,
      unit: '°C',
      location: 'Guest Rooms - Floor 3-5',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    // Lighting Systems
    {
      id: 'light-001',
      name: 'Main Entrance Lights',
      type: 'actuator',
      category: 'lighting',
      status: 'online',
      value: 100,
      unit: '%',
      location: 'Main Entrance',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'light-002',
      name: 'Parking Area Lights',
      type: 'actuator',
      category: 'lighting',
      status: 'online',
      value: 75,
      unit: '%',
      location: 'Parking Area',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'light-003',
      name: 'Garden Pathway Lights',
      type: 'actuator',
      category: 'lighting',
      status: 'online',
      value: 50,
      unit: '%',
      location: 'Garden Area',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: false
    },
    // Security Systems
    {
      id: 'sec-001',
      name: 'Main Gate Camera',
      type: 'sensor',
      category: 'security',
      status: 'online',
      location: 'Main Gate',
      lastUpdate: Date.now(),
      isControllable: false,
      isActive: true
    },
    {
      id: 'sec-002',
      name: 'Lobby Security Camera',
      type: 'sensor',
      category: 'security',
      status: 'online',
      location: 'Hotel Lobby',
      lastUpdate: Date.now(),
      isControllable: false,
      isActive: true
    },
    {
      id: 'sec-003',
      name: 'Fire Alarm System',
      type: 'sensor',
      category: 'security',
      status: 'online',
      location: 'All Floors',
      lastUpdate: Date.now(),
      isControllable: false,
      isActive: true
    },
    // Access Control
    {
      id: 'access-001',
      name: 'Main Door Lock',
      type: 'actuator',
      category: 'access',
      status: 'online',
      location: 'Main Entrance',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: false
    },
    {
      id: 'access-002',
      name: 'Staff Access Gate',
      type: 'actuator',
      category: 'access',
      status: 'online',
      location: 'Staff Area',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: false
    },
    {
      id: 'access-003',
      name: 'VIP Lounge Access',
      type: 'actuator',
      category: 'access',
      status: 'online',
      location: 'VIP Lounge - Floor 10',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: false
    },
    // Environment Sensors
    {
      id: 'env-001',
      name: 'Temperature Sensor - Lobby',
      type: 'sensor',
      category: 'environment',
      status: 'online',
      value: 24.5,
      unit: '°C',
      location: 'Hotel Lobby',
      lastUpdate: Date.now(),
      isControllable: false
    },
    {
      id: 'env-002',
      name: 'Humidity Sensor - Lobby',
      type: 'sensor',
      category: 'environment',
      status: 'online',
      value: 65,
      unit: '%',
      location: 'Hotel Lobby',
      lastUpdate: Date.now(),
      isControllable: false
    },
    {
      id: 'env-003',
      name: 'Air Quality Monitor',
      type: 'sensor',
      category: 'environment',
      status: 'online',
      value: 85,
      unit: 'AQI',
      location: 'All Areas',
      lastUpdate: Date.now(),
      isControllable: false
    },
    // Network Infrastructure
    {
      id: 'net-001',
      name: 'WiFi Router - Lobby',
      type: 'controller',
      category: 'network',
      status: 'online',
      value: 125,
      unit: 'devices',
      location: 'Hotel Lobby',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'net-002',
      name: 'Network Switch - Floor 3',
      type: 'controller',
      category: 'network',
      status: 'online',
      value: 48,
      unit: 'devices',
      location: 'Floor 3 - Server Room',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    },
    {
      id: 'net-003',
      name: 'IoT Gateway',
      type: 'controller',
      category: 'network',
      status: 'warning',
      value: 89,
      unit: '%',
      location: 'Central Control Room',
      lastUpdate: Date.now(),
      isControllable: true,
      isActive: true
    }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'alert-001',
      severity: 'warning',
      title: 'High Temperature Detected',
      message: 'HVAC Zone A temperature exceeded threshold (26.5°C)',
      timestamp: Date.now() - 300000,
      deviceId: 'hvac-003',
      acknowledged: false
    },
    {
      id: 'alert-002',
      severity: 'warning',
      title: 'Network Gateway Load High',
      message: 'IoT Gateway utilization at 89% - consider load balancing',
      timestamp: Date.now() - 600000,
      deviceId: 'net-003',
      acknowledged: false
    },
    {
      id: 'alert-003',
      severity: 'info',
      title: 'System Update Available',
      message: 'New firmware available for security cameras',
      timestamp: Date.now() - 1800000,
      acknowledged: false
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      label: 'System Uptime',
      value: 99.8,
      unit: '%',
      trend: 'stable',
      status: 'good'
    },
    {
      label: 'Energy Consumption',
      value: 342.5,
      unit: 'kWh',
      trend: 'down',
      status: 'good'
    },
    {
      label: 'Connected Devices',
      value: 18,
      unit: 'devices',
      trend: 'stable',
      status: 'good'
    },
    {
      label: 'Network Bandwidth',
      value: 67,
      unit: '%',
      trend: 'up',
      status: 'warning'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          // Randomly update sensor values
          if (device.type === 'sensor' || device.category === 'hvac') {
            const variation = (Math.random() - 0.5) * 2;
            const newValue = device.value ? Math.max(0, device.value + variation) : undefined;
            
            return {
              ...device,
              value: newValue,
              lastUpdate: Date.now()
            };
          }
          return device;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDeviceToggle = (deviceId: string): void => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, isActive: !device.isActive, lastUpdate: Date.now() }
          : device
      )
    );
  };

  const handleAcknowledgeAlert = (alertId: string): void => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const getDeviceIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      hvac: <Wind className="h-5 w-5" />,
      lighting: <Lightbulb className="h-5 w-5" />,
      security: <Camera className="h-5 w-5" />,
      access: <Lock className="h-5 w-5" />,
      environment: <Thermometer className="h-5 w-5" />,
      network: <Wifi className="h-5 w-5" />
    };
    return iconMap[category] || <Server className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      online: 'text-green-500',
      offline: 'text-gray-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    };
    return colorMap[status] || 'text-gray-500';
  };

  const getStatusBadge = (status: string) => {
    const badgeMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', text: string }> = {
      online: { variant: 'default', text: 'Online' },
      offline: { variant: 'secondary', text: 'Offline' },
      warning: { variant: 'outline', text: 'Warning' },
      error: { variant: 'destructive', text: 'Error' }
    };
    const badge = badgeMap[status] || { variant: 'secondary' as const, text: 'Unknown' };
    return <Badge variant={badge.variant} className="ml-2">{badge.text}</Badge>;
  };

  const filteredDevices = selectedCategory === 'all' 
    ? devices 
    : devices.filter(device => device.category === selectedCategory);

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SCADA Control System
          </h1>
          <p className="text-gray-400 mt-2">
            Supervisory Control & Data Acquisition for Smart Tourism Infrastructure
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${autoRefresh ? 'text-green-500 animate-pulse' : 'text-gray-500'}`} />
            <span className="text-sm text-gray-400">Auto Refresh</span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-400">{onlineDevices}/{totalDevices}</p>
                <p className="text-xs text-gray-500 mt-1">Devices Online</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-400">{activeAlerts}</p>
                <p className="text-xs text-gray-500 mt-1">Require Attention</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Energy Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">342.5</p>
                <p className="text-xs text-gray-500 mt-1">kWh Today</p>
              </div>
              <Zap className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Network Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-400">67%</p>
                <p className="text-xs text-gray-500 mt-1">Bandwidth Used</p>
              </div>
              <Radio className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Control Panel */}
      <Tabs defaultValue="devices" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="bg-gray-900/50 inline-flex w-auto">
            <TabsTrigger value="devices">
              <Server className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="map">
              <Navigation className="h-4 w-4 mr-2" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="triggers">
              <FileText className="h-4 w-4 mr-2" />
              Trigger Logs
            </TabsTrigger>
            <TabsTrigger value="blockchain">
              <Link className="h-4 w-4 mr-2" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="anomaly">
              <Target className="h-4 w-4 mr-2" />
              Anomaly
            </TabsTrigger>
            <TabsTrigger value="health">
              <BarChart3 className="h-4 w-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="energy">
              <Battery className="h-4 w-4 mr-2" />
              Energy
            </TabsTrigger>
            <TabsTrigger value="visitors">
              <UserCheck className="h-4 w-4 mr-2" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <BellRing className="h-4 w-4 mr-2" />
              Alerts ({activeAlerts})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Activity className="h-4 w-4 mr-2" />
              BC Timeline
            </TabsTrigger>
            <TabsTrigger value="realtime">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Dashboard
            </TabsTrigger>
            <TabsTrigger value="history">
              <BarChart3 className="h-4 w-4 mr-2" />
              History Analytics
            </TabsTrigger>
            <TabsTrigger value="grpc">
              <Database className="h-4 w-4 mr-2" />
              gRPC Stream
            </TabsTrigger>
            <TabsTrigger value="grpc-enhanced">
              <Zap className="h-4 w-4 mr-2" />
              gRPC Multi-Stream
            </TabsTrigger>
            <TabsTrigger value="control">
              <Settings className="h-4 w-4 mr-2" />
              Control Panel
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>IoT Device Management</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'hvac' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('hvac')}
                  >
                    <Wind className="h-4 w-4 mr-1" />
                    HVAC
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'lighting' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('lighting')}
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Lighting
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'security' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('security')}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Security
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'access' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('access')}
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Access
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredDevices.map((device) => (
                    <Card key={device.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg bg-gray-700/50 ${getStatusColor(device.status)}`}>
                              {getDeviceIcon(device.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{device.name}</h4>
                                {getStatusBadge(device.status)}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                <MapPin className="h-3 w-3" />
                                <span>{device.location}</span>
                              </div>
                              {device.value !== undefined && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2">
                                    <Gauge className="h-4 w-4 text-cyan-400" />
                                    <span className="text-2xl font-bold text-cyan-400">
                                      {device.value.toFixed(1)} {device.unit}
                                    </span>
                                  </div>
                                  {device.category === 'hvac' && (
                                    <Progress 
                                      value={(device.value / 30) * 100} 
                                      className="mt-2 h-2"
                                    />
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                Last update: {new Date(device.lastUpdate).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {device.isControllable && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">
                                  {device.isActive ? 'ON' : 'OFF'}
                                </span>
                                <Switch
                                  checked={device.isActive}
                                  onCheckedChange={() => handleDeviceToggle(device.id)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Device Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <LiveDeviceMap />
        </TabsContent>

        {/* Trigger Logs Tab */}
        <TabsContent value="triggers" className="space-y-4">
          <TriggerLogs />
        </TabsContent>

        {/* Smart Contract Feed Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          <SmartContractFeed />
        </TabsContent>

        {/* Anomaly Detector Tab */}
        <TabsContent value="anomaly" className="space-y-4">
          <AnomalyDetector />
        </TabsContent>

        {/* System Health Panel Tab */}
        <TabsContent value="health" className="space-y-4">
          <SystemHealthPanel />
        </TabsContent>

        {/* Energy Optimizer Tab */}
        <TabsContent value="energy" className="space-y-4">
          <EnergyOptimizer />
        </TabsContent>

        {/* Visitor Density Monitor Tab */}
        <TabsContent value="visitors" className="space-y-4">
          <VisitorDensityMonitor />
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
              <CardDescription>Real-time monitoring alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                      className={`${
                        alert.acknowledged ? 'opacity-50' : ''
                      } ${
                        alert.severity === 'warning' ? 'border-yellow-500/50' : 
                        alert.severity === 'critical' ? 'border-red-500/50' : 
                        'border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {alert.severity === 'critical' ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : alert.severity === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <Activity className="h-5 w-5 text-blue-500" />
                            )}
                            <AlertTitle className="mb-0">{alert.title}</AlertTitle>
                          </div>
                          <AlertDescription className="mt-2">
                            {alert.message}
                          </AlertDescription>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          {alert.acknowledged && (
                            <Badge variant="secondary">Acknowledged</Badge>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemMetrics.map((metric, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-cyan-400">
                        {metric.value} <span className="text-xl text-gray-400">{metric.unit}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp 
                          className={`h-4 w-4 ${
                            metric.trend === 'up' ? 'text-green-500' : 
                            metric.trend === 'down' ? 'text-red-500' : 
                            'text-gray-500'
                          }`}
                        />
                        <span className="text-sm text-gray-400">
                          {metric.trend === 'up' ? 'Increasing' : 
                           metric.trend === 'down' ? 'Decreasing' : 
                           'Stable'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500/20' :
                      metric.status === 'warning' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <Gauge className={`h-8 w-8 ${
                        metric.status === 'good' ? 'text-green-500' :
                        metric.status === 'warning' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                    </div>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="mt-4 h-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Energy Consumption Chart Placeholder */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Energy Consumption Trend</CardTitle>
              <CardDescription>24-hour energy usage monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Real-time analytics visualization</p>
                  <p className="text-sm mt-1">Integrated with STC Ecosystem data streams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <BlockchainIoTTimeline />
        </TabsContent>

        {/* Real-time Dashboard Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <RealtimeBlockchainDashboard />
        </TabsContent>

        {/* Event History Analytics Tab */}
        <TabsContent value="history" className="space-y-4">
          <EventHistoryAnalytics />
        </TabsContent>

        {/* gRPC Stream Monitor Tab */}
        <TabsContent value="grpc" className="space-y-4">
          <GrpcStreamMonitor />
        </TabsContent>

        {/* Enhanced gRPC Multi-Stream Dashboard Tab */}
        <TabsContent value="grpc-enhanced" className="space-y-4">
          <EnhancedRealtimeDashboard />
        </TabsContent>

        {/* Control Panel Tab */}
        <TabsContent value="control" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HVAC Control */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-400" />
                  HVAC System Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Temperature Setpoint</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input 
                      type="range" 
                      min="18" 
                      max="28" 
                      defaultValue="22"
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-cyan-400">22°C</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  {devices.filter(d => d.category === 'hvac').map(device => (
                    <div key={device.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">{device.name}</span>
                      <Switch checked={device.isActive} onCheckedChange={() => handleDeviceToggle(device.id)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lighting Control */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  Lighting Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Brightness Level</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="75"
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-yellow-400">75%</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  {devices.filter(d => d.category === 'lighting').map(device => (
                    <div key={device.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-sm">{device.name}</span>
                      <Switch checked={device.isActive} onCheckedChange={() => handleDeviceToggle(device.id)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  Access Control System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-purple-500/50">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Security Status</AlertTitle>
                  <AlertDescription>
                    All access points are secured and monitored
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {devices.filter(d => d.category === 'access').map(device => (
                    <div key={device.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <div className="flex items-center gap-2">
                        {device.isActive ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={device.isActive ? "destructive" : "default"}
                        onClick={() => handleDeviceToggle(device.id)}
                      >
                        {device.isActive ? 'Lock' : 'Unlock'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Auto-mode HVAC</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Smart Lighting</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Emergency Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Data Logging</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Database className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Integration Notice */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <Cpu className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">STC Ecosystem Integration</h3>
              <p className="text-sm text-gray-400 mb-4">
                SCADA system is fully integrated with the STC Ultimate platform. All control actions 
                and monitoring data are recorded on-chain for transparency and audit purposes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time Monitoring
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Blockchain Verified
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  IoT Certified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
