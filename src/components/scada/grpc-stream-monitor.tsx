'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Zap, Database, Wifi, WifiOff, PlayCircle, StopCircle, Trash2 } from 'lucide-react';
import { useGrpcStream } from '@/hooks/use-grpc-stream';
import { toast } from 'sonner';

// ========================================
// GRPC STREAM MONITOR
// Real-time monitoring of gRPC blockchain event stream
// Integrates with actual blockchain transactions
// ========================================

export function GrpcStreamMonitor() {
  const {
    events,
    isConnected,
    isStreaming,
    error,
    startStream,
    stopStream,
    clearEvents,
    latestEvent,
  } = useGrpcStream();
  
  // Show toast when new event arrives
  useEffect(() => {
    if (latestEvent) {
      toast.success('New Blockchain Event', {
        description: `TX: ${latestEvent.txHash.slice(0, 10)}... | Gas: ${latestEvent.gasUsed}`,
      });
    }
  }, [latestEvent]);
  
  return (
    <div className="space-y-6">
      {/* Stream Control */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                gRPC Stream Monitor
              </CardTitle>
              <CardDescription>Real-time blockchain event streaming via gRPC</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-700 text-gray-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center gap-2">
              {!isStreaming ? (
                <Button
                  onClick={() => startStream()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Stream
                </Button>
              ) : (
                <Button
                  onClick={stopStream}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Stream
                </Button>
              )}
              
              <Button
                onClick={clearEvents}
                variant="outline"
                className="border-gray-700"
                disabled={events.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear ({events.length})
              </Button>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Events Received</div>
                <div className="text-2xl font-bold text-blue-400">{events.length}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Stream Status</div>
                <div className="text-2xl font-bold">
                  {isStreaming ? (
                    <span className="text-green-400">LIVE</span>
                  ) : (
                    <span className="text-gray-500">IDLE</span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Latest Block</div>
                <div className="text-2xl font-bold text-purple-400">
                  {latestEvent ? `#${latestEvent.blockNumber}` : '-'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Event Stream Display */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Live Event Stream
          </CardTitle>
          <CardDescription>
            Real-time blockchain transactions streamed via gRPC protocol
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No events yet. Start the stream or make a payment to see events.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono text-sm text-blue-400 mb-1">
                          {event.txHash}
                        </div>
                        <div className="text-xs text-gray-500">
                          Block #{event.blockNumber} • {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <Badge
                        variant={event.status === 'confirmed' ? 'default' : 'outline'}
                        className={
                          event.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'border-yellow-500/50 text-yellow-400'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    
                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Gas Used:</span>{' '}
                        <span className="text-white">{event.gasUsed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gas Cost:</span>{' '}
                        <span className="text-white">{event.gasCost} ETH</span>
                      </div>
                    </div>
                    
                    {/* Events */}
                    {event.events.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-2">Blockchain Events ({event.events.length})</div>
                        <div className="flex flex-wrap gap-1">
                          {event.events.map((e, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                              {e.eventName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* IoT Actions */}
                    {event.iotActions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-2">IoT Actions Triggered ({event.iotActions.length})</div>
                        <div className="space-y-1">
                          {event.iotActions.map((action) => (
                            <div key={action.actionId} className="text-xs bg-green-500/10 border border-green-500/30 rounded px-2 py-1">
                              <span className="text-green-400 font-medium">{action.deviceName}</span>
                              <span className="text-gray-500 mx-1">→</span>
                              <span className="text-white">{action.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">How It Works:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-300/80">
                <li>Click "Start Stream" to begin receiving real-time blockchain events</li>
                <li>Make a payment on the Tourism Services page to trigger events</li>
                <li>gRPC stream instantly delivers events as they happen on-chain</li>
                <li>See decoded events and IoT actions triggered by blockchain transactions</li>
              </ol>
              <p className="mt-2 text-xs text-blue-300/60">
                Protocol: gRPC over HTTP/2 with Server-Sent Events (SSE) for browser compatibility
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
