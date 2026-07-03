'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ========================================
// USE GRPC ANALYTICS STREAM HOOK
// React hook for consuming gRPC analytics streams
// ========================================

export interface SystemMetrics {
  timestamp: number;
  systemUptime: number;
  energyConsumption: number;
  networkBandwidth: number;
  connectedDevices: number;
  activeTransactions: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  customMetrics?: Record<string, number>;
}

export interface PerformanceData {
  timestamp: number;
  component: string;
  avgLatencyMs: number;
  maxLatencyMs: number;
  minLatencyMs: number;
  throughputPerSec: number;
  errorCount: number;
  errorRate: number;
  successRate: number;
}

export interface AnalyticsStreamOptions {
  metrics?: string[];
  intervalSeconds?: number;
}

export interface UseGrpcAnalyticsStreamResult {
  metrics: SystemMetrics | null;
  metricsHistory: SystemMetrics[];
  performanceData: PerformanceData[];
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
  startStream: (options?: AnalyticsStreamOptions) => void;
  stopStream: () => void;
  clearHistory: () => void;
}

/**
 * React hook for streaming analytics and system metrics via gRPC
 */
export function useGrpcAnalyticsStream(autoStart: boolean = false): UseGrpcAnalyticsStreamResult {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingRef = useRef<boolean>(false);
  
  /**
   * Start streaming analytics
   */
  const startStream = useCallback(async (options?: AnalyticsStreamOptions) => {
    if (streamingRef.current) {
      console.log('Analytics stream already active');
      return;
    }
    
    console.log('🎯 Starting gRPC analytics stream...');
    setIsStreaming(true);
    setIsConnected(true);
    setError(null);
    streamingRef.current = true;
    
    const params = new URLSearchParams();
    if (options?.metrics && options.metrics.length > 0) {
      params.append('metrics', options.metrics.join(','));
    }
    if (options?.intervalSeconds) {
      params.append('interval', options.intervalSeconds.toString());
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`/api/grpc/analytics/stream?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'text/event-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Stream failed: ${response.statusText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (streamingRef.current) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const metricsUpdate: SystemMetrics = JSON.parse(data);
              
              setMetrics(metricsUpdate);
              setMetricsHistory((prev) => {
                const newHistory = [...prev, metricsUpdate];
                // Keep last 100 entries
                return newHistory.slice(-100);
              });
            } catch (error) {
              console.error('Failed to parse metrics:', error);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('gRPC analytics stream error:', err);
        setError(err.message || 'Stream error');
        setIsConnected(false);
      }
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
    console.log('🛑 Stopping gRPC analytics stream...');
    streamingRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
  }, []);
  
  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setMetricsHistory([]);
    setPerformanceData([]);
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
    metrics,
    metricsHistory,
    performanceData,
    isConnected,
    isStreaming,
    error,
    startStream,
    stopStream,
    clearHistory,
  };
}
