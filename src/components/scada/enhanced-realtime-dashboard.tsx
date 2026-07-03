'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Zap, 
  Database, 
  Cpu,
  Wifi, 
  WifiOff, 
  PlayCircle, 
  StopCircle,
  TrendingUp,
  TrendingDown,
  Server,
  HardDrive,
  MemoryStick,
  Network
} from 'lucide-react';
import { useGrpcStream } from '@/hooks/use-grpc-stream';
import { useGrpcIoTStream } from '@/hooks/use-grpc-iot-stream';
import { useGrpcAnalyticsStream } from '@/hooks/use-grpc-analytics-stream';
import { toast } from 'sonner';

// ========================================
// ENHANCED REAL-TIME DASHBOARD
// Comprehensive real-time monitoring with multiple gRPC streams
// Integrates blockchain, IoT, and analytics data
// ========================================

export function EnhancedRealtimeDashboard() {
  // Blockchain events stream
  const blockchainStream = useGrpcStream();
  
  // IoT devices stream
  const iotStream = useGrpcIoTStream();
  
  // Analytics stream
  const analyticsStream = useGrpcAnalyticsStream();
  
  // Show toast when new blockchain event arrives
  useEffect(() => {
    if (blockchainStream.latestEvent) {
      toast.success('New Blockchain Event', {
        description: `TX: ${blockchainStream.latestEvent.txHash.slice(0, 10)}...`,
      });
    }
  }, [blockchainStream.latestEvent]);
  
  // Show toast when device status changes
  useEffect(() => {
    if (iotStream.latestDevice) {
      toast.info('IoT Device Update', {
        description: `${iotStream.latestDevice.name}: ${iotStream.latestDevice.status}`,
      });
    }
  }, [iotStream.latestDevice]);
  
  const startAllStreams = () => {
    blockchainStream.startStream();
    iotStream.startStream();
    analyticsStream.startStream();
  };
  
  const stopAllStreams = () => {
    blockchainStream.stopStream();
    iotStream.stopStream();
    analyticsStream.stopStream();
  };
  
  const isAnyStreamActive = 
    blockchainStream.isStreaming || 
    iotStream.isStreaming || 
    analyticsStream.isStreaming;
  
  const onlineDevices = iotStream.devices.filter(d => d.status === 'online').length;
  const totalDevices = iotStream.devices.length;
  
  return (
    <div className="space-y-6">
      {/* Control Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                Enhanced Real-Time Dashboard
              </CardTitle>
              <CardDescription>
                Multi-service gRPC streaming: Blockchain + IoT + Analytics
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {!isAnyStreamActive ? (
                <Button
                  onClick={startAllStreams}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start All Streams
                </Button>
              ) : (
                <Button
                  onClick={stopAllStreams}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop All Streams
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Stream Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Blockchain Stream Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold">Blockchain Stream</h3>
              </div>
              {blockchainStream.isConnected ? (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-700 text-gray-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Events Received:</span>
                <span className="text-white font-bold">{blockchainStream.events.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Latest Block:</span>
                <span className="text-purple-400 font-mono">
                  {blockchainStream.latestEvent 
                    ? `#${blockchainStream.latestEvent.blockNumber}`
                    : '-'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* IoT Stream Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold">IoT Stream</h3>
              </div>
              {iotStream.isConnected ? (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-700 text-gray-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Devices Online:</span>
                <span className="text-white font-bold">{onlineDevices}/{totalDevices}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Latest Update:</span>
                <span className="text-green-400 font-mono">
                  {iotStream.latestDevice 
                    ? new Date(iotStream.latestDevice.timestamp).toLocaleTimeString()
                    : '-'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Analytics Stream Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold">Analytics Stream</h3>
              </div>
              {analyticsStream.isConnected ? (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-700 text-gray-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">System Uptime:</span>
                <span className="text-white font-bold">
                  {analyticsStream.metrics 
                    ? `${analyticsStream.metrics.systemUptime.toFixed(1)}%`
                    : '-'
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">CPU Usage:</span>
                <span className="text-cyan-400 font-mono">
                  {analyticsStream.metrics 
                    ? `${analyticsStream.metrics.cpuUsage.toFixed(1)}%`
                    : '-'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* System Metrics Dashboard */}
      {analyticsStream.metrics && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-400" />
              Live System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">CPU Usage</span>
                  </div>
                  <span className="text-lg font-bold text-blue-400">
                    {analyticsStream.metrics.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analyticsStream.metrics.cpuUsage} className="h-2" />
              </div>
              
              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Memory</span>
                  </div>
                  <span className="text-lg font-bold text-purple-400">
                    {analyticsStream.metrics.memoryUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analyticsStream.metrics.memoryUsage} className="h-2" />
              </div>
              
              {/* Disk Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400">Disk</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">
                    {analyticsStream.metrics.diskUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analyticsStream.metrics.diskUsage} className="h-2" />
              </div>
              
              {/* Network Bandwidth */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-gray-400">Network</span>
                  </div>
                  <span className="text-lg font-bold text-cyan-400">
                    {analyticsStream.metrics.networkBandwidth.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analyticsStream.metrics.networkBandwidth} className="h-2" />
              </div>
              
              {/* Energy Consumption */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Energy</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {analyticsStream.metrics.energyConsumption.toFixed(1)}
                  <span className="text-sm text-gray-400 ml-1">kWh</span>
                </div>
              </div>
              
              {/* Connected Devices */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-400">Devices</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {analyticsStream.metrics.connectedDevices}
                </div>
              </div>
              
              {/* Active Transactions */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Transactions</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {analyticsStream.metrics.activeTransactions}
                </div>
              </div>
              
              {/* System Uptime */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">Uptime</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {analyticsStream.metrics.systemUptime.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* IoT Devices Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Live IoT Devices ({iotStream.devices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {iotStream.devices.map((device) => (
                  <div
                    key={device.deviceId}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-white">{device.name}</div>
                      <div className="text-xs text-gray-400">{device.location}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.value !== undefined && (
                        <span className="text-sm font-mono text-cyan-400">
                          {device.value.toFixed(1)} {device.unit}
                        </span>
                      )}
                      <Badge
                        variant={device.status === 'online' ? 'default' : 'outline'}
                        className={
                          device.status === 'online'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'border-gray-700 text-gray-400'
                        }
                      >
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {iotStream.devices.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No device data yet. Start the stream to see live updates.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Recent Blockchain Events */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Recent Blockchain Events ({blockchainStream.events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {blockchainStream.events.slice(0, 10).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-blue-400">
                        {event.txHash.slice(0, 16)}...
                      </span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                        Block #{event.blockNumber}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Gas: {event.gasUsed}</span>
                      <span className="text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {blockchainStream.events.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No blockchain events yet. Start the stream or make a transaction.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-2">Multi-Service gRPC Integration:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                <li><strong>Blockchain Stream</strong>: Real-time on-chain transactions and events</li>
                <li><strong>IoT Stream</strong>: Live device monitoring with sensor data updates</li>
                <li><strong>Analytics Stream</strong>: System performance metrics and resource usage</li>
                <li>All streams use gRPC over HTTP/2 with SSE for browser compatibility</li>
              </ul>
              <p className="mt-3 text-xs text-blue-300/60">
                ⚡ Full gRPC integration for comprehensive real-time platform monitoring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
