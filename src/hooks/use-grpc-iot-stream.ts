'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ========================================
// USE GRPC IOT STREAM HOOK
// React hook for consuming gRPC IoT device streams
// ========================================

export interface IoTDeviceUpdate {
  deviceId: string;
  name: string;
  type: 'sensor' | 'actuator' | 'controller';
  category: 'hvac' | 'lighting' | 'security' | 'access' | 'environment' | 'network';
  status: 'online' | 'offline' | 'warning' | 'error';
  value?: number;
  unit?: string;
  location: string;
  timestamp: number;
  isActive: boolean;
  isControllable: boolean;
  metadata?: Record<string, string>;
}

export interface DeviceStreamOptions {
  categories?: string[];
  statuses?: string[];
  deviceIds?: string[];
}

export interface UseGrpcIoTStreamResult {
  devices: IoTDeviceUpdate[];
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
  startStream: (options?: DeviceStreamOptions) => void;
  stopStream: () => void;
  clearDevices: () => void;
  latestDevice: IoTDeviceUpdate | null;
  getDeviceById: (deviceId: string) => IoTDeviceUpdate | undefined;
}

/**
 * React hook for streaming IoT device updates via gRPC
 */
export function useGrpcIoTStream(autoStart: boolean = false): UseGrpcIoTStreamResult {
  const [devices, setDevices] = useState<Map<string, IoTDeviceUpdate>>(new Map());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestDevice, setLatestDevice] = useState<IoTDeviceUpdate | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingRef = useRef<boolean>(false);
  
  /**
   * Start streaming device updates
   */
  const startStream = useCallback(async (options?: DeviceStreamOptions) => {
    if (streamingRef.current) {
      console.log('Device stream already active');
      return;
    }
    
    console.log('🎯 Starting gRPC IoT device stream...');
    setIsStreaming(true);
    setIsConnected(true);
    setError(null);
    streamingRef.current = true;
    
    // Build query params
    const params = new URLSearchParams();
    if (options?.categories && options.categories.length > 0) {
      params.append('categories', options.categories.join(','));
    }
    if (options?.statuses && options.statuses.length > 0) {
      params.append('statuses', options.statuses.join(','));
    }
    if (options?.deviceIds && options.deviceIds.length > 0) {
      params.append('deviceIds', options.deviceIds.join(','));
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`/api/grpc/iot/stream?${params.toString()}`, {
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
        
        // Parse SSE messages
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const deviceUpdate: IoTDeviceUpdate = JSON.parse(data);
              
              setDevices((prev) => {
                const newDevices = new Map(prev);
                newDevices.set(deviceUpdate.deviceId, deviceUpdate);
                return newDevices;
              });
              
              setLatestDevice(deviceUpdate);
            } catch (error) {
              console.error('Failed to parse device update:', error);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('gRPC IoT stream error:', err);
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
    console.log('🛑 Stopping gRPC IoT device stream...');
    streamingRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
  }, []);
  
  /**
   * Clear devices
   */
  const clearDevices = useCallback(() => {
    setDevices(new Map());
    setLatestDevice(null);
  }, []);
  
  /**
   * Get device by ID
   */
  const getDeviceById = useCallback((deviceId: string): IoTDeviceUpdate | undefined => {
    return devices.get(deviceId);
  }, [devices]);
  
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
    devices: Array.from(devices.values()),
    isConnected,
    isStreaming,
    error,
    startStream,
    stopStream,
    clearDevices,
    latestDevice,
    getDeviceById,
  };
}
