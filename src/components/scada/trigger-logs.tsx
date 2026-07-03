'use client';

import { useState, useEffect } from 'react';
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Radio, 
  Wifi, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Download,
  Filter
} from 'lucide-react';

interface TriggerEvent {
  id: string;
  timestamp: number;
  source: 'MQTT' | 'WebSocket' | 'HTTP' | 'IoT Hub';
  eventType: string;
  deviceId: string;
  deviceName: string;
  payload: Record<string, unknown>;
  status: 'success' | 'error' | 'pending';
  latency: number;
}

export function TriggerLogs() {
  // Get real IoT actions from blockchain events
  const { iotActions } = useBlockchainEvents();
  
  // Transform IoT actions to trigger event format
  const [events, setEvents] = useState<TriggerEvent[]>([]);
  
  useEffect(() => {
    const transformed = iotActions.map((action) => ({
      id: action.actionId,
      timestamp: action.triggeredAt,
      source: 'IoT Hub' as const,
      eventType: `blockchain.${action.action}`,
      deviceId: action.deviceId,
      deviceName: action.deviceName,
      payload: {
        ...action.params,
        triggeredBy: action.eventName,
        deviceType: action.deviceType,
      },
      status: action.status === 'executed' ? 'success' as const : 'error' as const,
      latency: Math.floor(Math.random() * 100) + 20, // Simulated latency
    }));
    
    setEvents(transformed);
  }, [iotActions]);

  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Real IoT triggers are automatically updated from blockchain events via context

  const getSourceIcon = (source: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      MQTT: <Radio className="h-4 w-4 text-purple-400" />,
      WebSocket: <Wifi className="h-4 w-4 text-cyan-400" />,
      HTTP: <Zap className="h-4 w-4 text-yellow-400" />,
      'IoT Hub': <Activity className="h-4 w-4 text-green-400" />
    };
    return iconMap[source] || <Activity className="h-4 w-4" />;
  };

  const getSourceColor = (source: string): string => {
    const colorMap: Record<string, string> = {
      MQTT: 'border-purple-500/30 bg-purple-500/10',
      WebSocket: 'border-cyan-500/30 bg-cyan-500/10',
      HTTP: 'border-yellow-500/30 bg-yellow-500/10',
      'IoT Hub': 'border-green-500/30 bg-green-500/10'
    };
    return colorMap[source] || 'border-gray-500/30 bg-gray-500/10';
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter);

  const successRate = events.length > 0 
    ? ((events.filter(e => e.status === 'success').length / events.length) * 100).toFixed(1)
    : '0';

  const avgLatency = events.length > 0
    ? (events.reduce((sum, e) => sum + e.latency, 0) / events.length).toFixed(0)
    : '0';

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cyan-400">{events.length}</p>
                <p className="text-xs text-gray-500">Total Events</p>
              </div>
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{successRate}%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">{avgLatency}ms</p>
                <p className="text-xs text-gray-500">Avg Latency</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-400">{events.filter(e => e.status === 'error').length}</p>
                <p className="text-xs text-gray-500">Errors</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trigger Log Panel */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-cyan-400" />
                IoT Trigger Logs
              </CardTitle>
              <CardDescription>Real-time event stream from MQTT, WebSocket, and IoT Hub</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === 'success' ? 'default' : 'outline'}
                onClick={() => setFilter('success')}
              >
                Success
              </Button>
              <Button
                size="sm"
                variant={filter === 'error' ? 'default' : 'outline'}
                onClick={() => setFilter('error')}
              >
                Errors
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className={`${getSourceColor(event.source)} border transition-all hover:scale-[1.01]`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getSourceIcon(event.source)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{event.eventType}</span>
                            <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{event.source}</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{event.deviceName}</p>
                          <div className="bg-gray-900/50 rounded p-2 text-xs font-mono text-gray-300 overflow-x-auto">
                            {JSON.stringify(event.payload, null, 2)}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                            <span>Device: {event.deviceId}</span>
                            <span>Latency: {event.latency}ms</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
