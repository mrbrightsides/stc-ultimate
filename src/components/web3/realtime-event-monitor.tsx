'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocketEvents } from '@/hooks/use-websocket-events';

// ========================================
// REALTIME EVENT MONITOR
// Display live blockchain events via WebSocket
// ========================================

export function RealtimeEventMonitor() {
  const { status, latestEvent, eventCount } = useWebSocketEvents();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📡 Live Blockchain Events</span>
          <Badge variant={status.isConnected ? 'default' : 'destructive'}>
            {status.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">
              {status.isConnected ? 'Listening' : 'Not Connected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Events Received:</span>
            <span className="font-medium">{eventCount}</span>
          </div>
          {status.lastError && (
            <div className="flex justify-between">
              <span className="text-red-600">Error:</span>
              <span className="text-red-600 text-xs">{status.lastError.message}</span>
            </div>
          )}
        </div>

        {/* Latest Event */}
        {latestEvent && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-blue-900">Latest Event</h4>
              <Badge className="bg-blue-600">{latestEvent.status}</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Service:</span>
                <span className="ml-2 font-medium">{latestEvent.serviceName || 'Unknown'}</span>
              </div>

              <div>
                <span className="text-gray-600">TX Hash:</span>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${latestEvent.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline font-mono text-xs"
                >
                  {latestEvent.txHash.substring(0, 10)}...
                </a>
              </div>

              <div>
                <span className="text-gray-600">Block:</span>
                <span className="ml-2 font-mono">{latestEvent.blockNumber}</span>
              </div>

              <div>
                <span className="text-gray-600">Gas Used:</span>
                <span className="ml-2 font-mono">{latestEvent.gasUsed}</span>
              </div>

              <div>
                <span className="text-gray-600">Events:</span>
                <span className="ml-2 font-medium">{latestEvent.events.length}</span>
              </div>

              <div>
                <span className="text-gray-600">IoT Actions:</span>
                <span className="ml-2 font-medium">{latestEvent.iotActions.length}</span>
              </div>
            </div>

            {/* IoT Actions */}
            {latestEvent.iotActions.length > 0 && (
              <div className="pt-3 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">IoT Actions Triggered:</p>
                <ScrollArea className="h-24">
                  <div className="space-y-2">
                    {latestEvent.iotActions.map((action) => (
                      <div key={action.actionId} className="bg-white rounded p-2 text-xs">
                        <div className="font-medium">{action.deviceName}</div>
                        <div className="text-gray-600">
                          {action.action} • {action.deviceType}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {/* No Events Yet */}
        {!latestEvent && status.isConnected && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Waiting for blockchain events...</p>
            <p className="text-xs mt-1">Make a transaction to see it appear here in real-time</p>
          </div>
        )}

        {/* Connection Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Connected to Ethereum Sepolia via WebSocket</p>
          <p>• Monitoring TourPackageEscrow & MyTourEscrow contracts</p>
          <p>• Real-time event notifications with IoT triggers</p>
        </div>
      </CardContent>
    </Card>
  );
}
