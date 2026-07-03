'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWebSocketListener } from '@/lib/websocket-event-listener';
import type { BlockchainEventRecord } from '@/lib/blockchain-event-tracker';

// ========================================
// WEBSOCKET EVENTS HOOK
// React hook for WebSocket blockchain event listening
// ========================================

export interface WebSocketStatus {
  isConnected: boolean;
  reconnectAttempts: number;
  lastError: Error | null;
}

export function useWebSocketEvents() {
  const [status, setStatus] = useState<WebSocketStatus>({
    isConnected: false,
    reconnectAttempts: 0,
    lastError: null,
  });
  
  const [latestEvent, setLatestEvent] = useState<BlockchainEventRecord | null>(null);
  const [eventCount, setEventCount] = useState<number>(0);

  const connect = useCallback(() => {
    const listener = getWebSocketListener();
    
    // Setup callbacks
    listener.onConnect = () => {
      console.log('✅ WebSocket connected');
      setStatus({
        isConnected: true,
        reconnectAttempts: 0,
        lastError: null,
      });
    };

    listener.onDisconnect = () => {
      console.log('⚠️ WebSocket disconnected');
      setStatus(prev => ({
        ...prev,
        isConnected: false,
      }));
    };

    listener.onError = (error: Error) => {
      console.error('❌ WebSocket error:', error);
      setStatus(prev => ({
        ...prev,
        lastError: error,
      }));
    };

    listener.onEvent = (event: BlockchainEventRecord) => {
      console.log('🔔 New blockchain event:', event.txHash);
      setLatestEvent(event);
      setEventCount(prev => prev + 1);
    };

    // Start connection
    listener.connect();
  }, []);

  const disconnect = useCallback(() => {
    const listener = getWebSocketListener();
    listener.disconnect();
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    status,
    latestEvent,
    eventCount,
    connect,
    disconnect,
  };
}
