'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Wifi, 
  Database, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Activity,
  GitBranch,
  Server,
  Layers,
  Clock,
  BarChart3
} from 'lucide-react';

interface STCConnectSimulationProps {
  onDataReceived?: (data: any) => void;
  isActive?: boolean;
}

interface ConnectionStatus {
  iot: 'connected' | 'connecting' | 'error' | 'idle';
  blockchain: 'connected' | 'connecting' | 'error' | 'idle';
  api: 'connected' | 'connecting' | 'error' | 'idle';
  middleware: 'connected' | 'connecting' | 'error' | 'idle';
}

interface DataStream {
  timestamp: string;
  source: string;
  type: 'iot' | 'blockchain' | 'api' | 'middleware';
  payload: any;
  latency: number;
}

const STCConnectSimulation: React.FC<STCConnectSimulationProps> = ({
  onDataReceived,
  isActive = false
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    iot: 'idle',
    blockchain: 'idle', 
    api: 'idle',
    middleware: 'idle'
  });

  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [throughput, setThroughput] = useState<number>(0);
  const [totalProcessed, setTotalProcessed] = useState<number>(0);

  // STC Connect middleware endpoints
  const endpoints = [
    { name: 'IoT Gateway', url: '/api/stc-connect/iot', status: connectionStatus.iot },
    { name: 'Blockchain Bridge', url: '/api/stc-connect/blockchain', status: connectionStatus.blockchain },
    { name: 'API Gateway', url: '/api/stc-connect/api', status: connectionStatus.api },
    { name: 'Middleware Core', url: '/api/stc-connect/middleware', status: connectionStatus.middleware }
  ];

  const startSimulation = async (): Promise<void> => {
    setIsSimulating(true);
    
    // Phase 1: Connect to IoT devices
    setConnectionStatus(prev => ({ ...prev, iot: 'connecting' }));
    await simulateConnection('iot', 1000);
    
    // Phase 2: Connect to blockchain
    setConnectionStatus(prev => ({ ...prev, blockchain: 'connecting' }));
    await simulateConnection('blockchain', 1500);
    
    // Phase 3: Connect to API gateway
    setConnectionStatus(prev => ({ ...prev, api: 'connecting' }));
    await simulateConnection('api', 800);
    
    // Phase 4: Initialize middleware
    setConnectionStatus(prev => ({ ...prev, middleware: 'connecting' }));
    await simulateConnection('middleware', 1200);
    
    // Start data streaming
    startDataStreaming();
  };

  const simulateConnection = async (type: keyof ConnectionStatus, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setConnectionStatus(prev => ({ ...prev, [type]: 'connected' }));
        addDataStream({
          source: `STC Connect ${type.toUpperCase()}`,
          type,
          payload: { status: 'connected', timestamp: Date.now() },
          latency: delay
        });
        resolve();
      }, delay);
    });
  };

  const addDataStream = (data: Partial<DataStream>): void => {
    const newStream: DataStream = {
      timestamp: new Date().toISOString(),
      source: data.source || 'Unknown',
      type: data.type || 'api',
      payload: data.payload || {},
      latency: data.latency || Math.random() * 100
    };

    setDataStreams(prev => [newStream, ...prev.slice(0, 9)]); // Keep only last 10
    setTotalProcessed(prev => prev + 1);
    
    if (onDataReceived) {
      onDataReceived(newStream);
    }
  };

  const startDataStreaming = (): void => {
    const streamInterval = setInterval(() => {
      if (!isSimulating) {
        clearInterval(streamInterval);
        return;
      }

      // Random data generation
      const sources = [
        { name: 'Hotel NFC Reader', type: 'iot' as const },
        { name: 'GPS Tracker', type: 'iot' as const },
        { name: 'Smart Contract', type: 'blockchain' as const },
        { name: 'Payment Gateway', type: 'api' as const },
        { name: 'Middleware Router', type: 'middleware' as const }
      ];

      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const samplePayloads = {
        iot: { 
          deviceId: `DEV_${Math.random().toString(36).substr(2, 6)}`,
          signal: Math.floor(Math.random() * 100),
          battery: Math.floor(Math.random() * 100),
          location: { lat: -6.2088, lng: 106.8456 }
        },
        blockchain: {
          txHash: `0x${Math.random().toString(16).substr(2, 10)}`,
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
          blockNumber: Math.floor(Math.random() * 1000000) + 18500000
        },
        api: {
          endpoint: '/api/tourism/booking',
          method: 'POST', 
          responseTime: Math.floor(Math.random() * 500) + 50,
          statusCode: 200
        },
        middleware: {
          routeId: `ROUTE_${Math.random().toString(36).substr(2, 4)}`,
          processing: Math.floor(Math.random() * 200) + 10,
          queueSize: Math.floor(Math.random() * 5)
        }
      };

      addDataStream({
        source: randomSource.name,
        type: randomSource.type,
        payload: samplePayloads[randomSource.type],
        latency: Math.floor(Math.random() * 150) + 20
      });

      // Update throughput
      setThroughput(prev => Math.max(0, prev + Math.random() * 10 - 5));

    }, 2000);
  };

  const stopSimulation = (): void => {
    setIsSimulating(false);
    setConnectionStatus({
      iot: 'idle',
      blockchain: 'idle',
      api: 'idle', 
      middleware: 'idle'
    });
    setDataStreams([]);
    setThroughput(0);
  };

  useEffect(() => {
    if (isActive && !isSimulating) {
      startSimulation();
    } else if (!isActive && isSimulating) {
      stopSimulation();
    }
  }, [isActive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'connecting': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              STC Connect Middleware Simulation
            </CardTitle>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
              v1.0 Research
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Simulasi middleware API yang menghubungkan aplikasi, perangkat IoT, dan blockchain 
            dalam ekosistem SmartTourismChain (STC).
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={startSimulation}
              disabled={isSimulating}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isSimulating ? 'Running...' : 'Start Simulation'}
            </Button>
            <Button 
              onClick={stopSimulation}
              disabled={!isSimulating}
              variant="outline"
              className="border-red-500/50 text-red-300 hover:bg-red-500/10"
            >
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {endpoints.map((endpoint, index) => (
          <Card key={index} className={`border-gray-600/30 transition-all duration-200 ${
            endpoint.status === 'connected' ? 'bg-green-500/5 border-green-500/30' :
            endpoint.status === 'connecting' ? 'bg-yellow-500/5 border-yellow-500/30' :
            endpoint.status === 'error' ? 'bg-red-500/5 border-red-500/30' :
            'bg-gray-900/50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(endpoint.status)}
                  <span className="font-medium text-gray-300 text-sm">{endpoint.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-mono">{endpoint.url}</p>
                <Badge size="sm" className={getStatusColor(endpoint.status)}>
                  {endpoint.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      {isSimulating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-cyan-500/30 bg-gray-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <span className="font-medium text-cyan-300">Throughput</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {throughput.toFixed(1)} <span className="text-sm text-gray-400">req/s</span>
              </div>
              <Progress value={Math.min(throughput * 2, 100)} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gray-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-300">Processed</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {totalProcessed} <span className="text-sm text-gray-400">items</span>
              </div>
              <Progress value={Math.min(totalProcessed * 5, 100)} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gray-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-300">Avg Latency</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {dataStreams.length > 0 ? 
                  (dataStreams.reduce((acc, stream) => acc + stream.latency, 0) / dataStreams.length).toFixed(0)
                  : '0'
                } <span className="text-sm text-gray-400">ms</span>
              </div>
              <Progress value={dataStreams.length > 0 ? 
                100 - (dataStreams.reduce((acc, stream) => acc + stream.latency, 0) / dataStreams.length) / 2
                : 0} className="h-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Stream */}
      {dataStreams.length > 0 && (
        <Card className="border-gray-600/30 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Data Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {dataStreams.map((stream, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      stream.type === 'iot' ? 'bg-blue-400' :
                      stream.type === 'blockchain' ? 'bg-green-400' :
                      stream.type === 'api' ? 'bg-purple-400' : 'bg-yellow-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-300">{stream.source}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(stream.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" size="sm" className={`${
                      stream.type === 'iot' ? 'border-blue-500/50 text-blue-300' :
                      stream.type === 'blockchain' ? 'border-green-500/50 text-green-300' :
                      stream.type === 'api' ? 'border-purple-500/50 text-purple-300' :
                      'border-yellow-500/50 text-yellow-300'
                    }`}>
                      {stream.type.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">{stream.latency.toFixed(0)}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default STCConnectSimulation;