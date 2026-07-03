'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';
import type { BlockchainEventRecord, IoTAction } from '@/lib/blockchain-event-tracker';

// ========================================
// BLOCKCHAIN → IoT TIMELINE VISUALIZATION
// Shows visual timeline of blockchain events triggering IoT actions
// ========================================

interface TimelineItem {
  id: string;
  timestamp: number;
  type: 'blockchain' | 'iot';
  txHash?: string;
  blockNumber?: number;
  eventName?: string;
  deviceName?: string;
  action?: string;
  status: 'success' | 'pending' | 'failed';
  metadata: Record<string, unknown>;
}

export default function BlockchainIoTTimeline() {
  const { events, iotActions, refreshEvents } = useBlockchainEvents();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'blockchain' | 'iot'>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Generate timeline from events and actions
  useEffect(() => {
    const items: TimelineItem[] = [];
    
    // Add blockchain events
    events.forEach(event => {
      items.push({
        id: `bc-${event.id}`,
        timestamp: event.timestamp,
        type: 'blockchain',
        txHash: event.txHash,
        blockNumber: event.blockNumber,
        eventName: event.events[0]?.eventName || 'Transaction',
        status: event.status === 'confirmed' ? 'success' : 'failed',
        metadata: {
          gasUsed: event.gasUsed,
          gasCost: event.gasCost,
          from: event.from,
          to: event.to,
        },
      });
      
      // Add IoT actions from this event
      event.iotActions.forEach(action => {
        items.push({
          id: action.actionId,
          timestamp: action.triggeredAt,
          type: 'iot',
          deviceName: action.deviceName,
          action: action.action,
          status: action.status === 'executed' ? 'success' : action.status === 'failed' ? 'failed' : 'pending',
          metadata: {
            deviceId: action.deviceId,
            deviceType: action.deviceType,
            eventName: action.eventName,
            params: action.params,
          },
        });
      });
    });
    
    // Sort by timestamp (newest first)
    items.sort((a, b) => b.timestamp - a.timestamp);
    
    setTimeline(items);
  }, [events, iotActions]);
  
  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshEvents();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshEvents]);
  
  // Filter timeline
  const filteredTimeline = timeline.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  
  // Format relative time
  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Blockchain → IoT Timeline
            </CardTitle>
            <CardDescription>
              Visual timeline showing blockchain events triggering IoT actions in real-time
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshEvents()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({timeline.length})
          </Button>
          <Button
            variant={filter === 'blockchain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('blockchain')}
          >
            Blockchain ({timeline.filter(t => t.type === 'blockchain').length})
          </Button>
          <Button
            variant={filter === 'iot' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('iot')}
          >
            IoT Actions ({timeline.filter(t => t.type === 'iot').length})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No events yet. Make a payment to see blockchain → IoT integration in action.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredTimeline.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'blockchain'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}
                  >
                    {item.type === 'blockchain' ? (
                      <Activity className="h-5 w-5" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>
                  
                  {index < filteredTimeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border min-h-[40px]" />
                  )}
                </div>
                
                {/* Event content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.type === 'blockchain' ? 'default' : 'secondary'}>
                          {item.type === 'blockchain' ? 'Blockchain Event' : 'IoT Action'}
                        </Badge>
                        
                        <Badge
                          variant={
                            item.status === 'success'
                              ? 'default'
                              : item.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-sm mb-1">
                        {item.type === 'blockchain'
                          ? item.eventName
                          : `${item.deviceName} - ${item.action}`}
                      </h4>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.type === 'blockchain' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span>Block #{item.blockNumber}</span>
                              <span>•</span>
                              <span>Gas: {item.metadata['gasUsed'] as string} ({item.metadata['gasCost'] as string} ETH)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{item.txHash?.slice(0, 10)}...{item.txHash?.slice(-8)}</span>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View on Explorer
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>Device: {item.metadata['deviceId'] as string}</div>
                            <div>Type: {item.metadata['deviceType'] as string}</div>
                            <div>Triggered by: {item.metadata['eventName'] as string}</div>
                            {Object.keys(item.metadata['params'] as Record<string, unknown>).length > 0 && (
                              <div>Params: {JSON.stringify(item.metadata['params'])}</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(item.timestamp)}
                      </div>
                      <div>{formatRelativeTime(item.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
