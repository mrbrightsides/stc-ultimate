'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getGrpcClient, type GrpcBlockchainEvent, type StreamOptions } from '@/lib/grpc-client';

// ========================================
// USE GRPC STREAM HOOK
// React hook for consuming gRPC blockchain event streams
// ========================================

export interface UseGrpcStreamResult {
  events: GrpcBlockchainEvent[];
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
  startStream: (options?: StreamOptions) => void;
  stopStream: () => void;
  clearEvents: () => void;
  latestEvent: GrpcBlockchainEvent | null;
}

/**
 * React hook for streaming blockchain events via gRPC
 */
export function useGrpcStream(autoStart: boolean = false): UseGrpcStreamResult {
  const [events, setEvents] = useState<GrpcBlockchainEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestEvent, setLatestEvent] = useState<GrpcBlockchainEvent | null>(null);
  
  const clientRef = useRef(getGrpcClient());
  const streamingRef = useRef<boolean>(false);
  
  /**
   * Start streaming events
   */
  const startStream = useCallback(async (options?: StreamOptions) => {
    if (streamingRef.current) {
      console.log('Stream already active');
      return;
    }
    
    console.log('🎯 Starting gRPC event stream...');
    setIsStreaming(true);
    setIsConnected(true);
    setError(null);
    streamingRef.current = true;
    
    try {
      const client = clientRef.current;
      
      for await (const event of client.streamEvents(options)) {
        if (!streamingRef.current) break;
        
        console.log('📡 Received event via gRPC:', event.txHash);
        
        setEvents(prev => {
          // Avoid duplicates
          const exists = prev.some(e => e.id === event.id);
          if (exists) return prev;
          
          // Add new event at the beginning
          return [event, ...prev].slice(0, 100); // Keep last 100 events
        });
        
        setLatestEvent(event);
      }
    } catch (err: any) {
      console.error('gRPC stream error:', err);
      setError(err.message || 'Stream error');
      setIsConnected(false);
    } finally {
      if (streamingRef.current) {
        setIsStreaming(false);
        setIsConnected(false);
        streamingRef.current = false;
      }
    }
  }, []);
  
  /**
   * Stop streaming
   */
  const stopStream = useCallback(() => {
    console.log('🛑 Stopping gRPC event stream...');
    streamingRef.current = false;
    clientRef.current.stopStream();
    setIsStreaming(false);
    setIsConnected(false);
  }, []);
  
  /**
   * Clear events
   */
  const clearEvents = useCallback(() => {
    setEvents([]);
    setLatestEvent(null);
  }, []);
  
  /**
   * Auto-start on mount if enabled
   */
  useEffect(() => {
    if (autoStart) {
      startStream();
    }
    
    return () => {
      if (streamingRef.current) {
        stopStream();
      }
    };
  }, [autoStart, startStream, stopStream]);
  
  return {
    events,
    isConnected,
    isStreaming,
    error,
    startStream,
    stopStream,
    clearEvents,
    latestEvent,
  };
}
