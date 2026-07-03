'use client';

// ========================================
// GRPC CLIENT - BLOCKCHAIN EVENT STREAMING
// Client-side gRPC consumer for real-time blockchain events
// ========================================

/**
 * gRPC Client for Blockchain Events
 * 
 * NOTE: This is a simplified client implementation.
 * In production, you would use @grpc/grpc-js client or grpc-web for browser support.
 * 
 * For browser compatibility, we're using a REST-based streaming approach
 * that wraps gRPC on the server side.
 */

export interface GrpcBlockchainEvent {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasCost: string;
  status: string;
  serviceId?: number;
  serviceName?: string;
  bookingId?: string;
  events: Array<{
    eventName: string;
    signature: string;
    logIndex: number;
    args: Record<string, string>;
  }>;
  decodedEvents?: Array<{
    eventName: string;
    signature: string;
    logIndex: number;
    args: Record<string, string>;
    category: string;
    severity: string;
  }>;
  iotActions: Array<{
    actionId: string;
    deviceId: string;
    deviceName: string;
    deviceType: string;
    action: string;
    params: Record<string, string>;
    triggeredAt: number;
    triggeredBy: string;
    eventName: string;
    status: string;
  }>;
}

export interface GrpcEventStats {
  totalTransactions: number;
  totalEvents: number;
  totalIoTActions: number;
  totalGasUsed: string;
  avgGasPerTx: string;
  confirmedTransactions: number;
  failedTransactions: number;
  lastUpdated: number;
}

export interface StreamOptions {
  eventTypes?: string[];
  serviceId?: number;
  bookingId?: string;
  includeIoTActions?: boolean;
}

/**
 * gRPC Client Class
 */
export class BlockchainEventGrpcClient {
  private baseUrl: string;
  private abortController: AbortController | null = null;
  
  constructor(baseUrl: string = '/api/grpc') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Stream blockchain events in real-time
   * Uses Server-Sent Events (SSE) for browser compatibility
   */
  async *streamEvents(options: StreamOptions = {}): AsyncGenerator<GrpcBlockchainEvent> {
    const params = new URLSearchParams();
    
    if (options.eventTypes && options.eventTypes.length > 0) {
      params.append('eventTypes', options.eventTypes.join(','));
    }
    if (options.serviceId) {
      params.append('serviceId', options.serviceId.toString());
    }
    if (options.bookingId) {
      params.append('bookingId', options.bookingId);
    }
    if (options.includeIoTActions !== undefined) {
      params.append('includeIoTActions', options.includeIoTActions.toString());
    }
    
    this.abortController = new AbortController();
    
    try {
      const response = await fetch(
        `${this.baseUrl}/stream?${params.toString()}`,
        {
          signal: this.abortController.signal,
          headers: {
            'Accept': 'text/event-stream',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Stream failed: ${response.statusText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
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
              const event: GrpcBlockchainEvent = JSON.parse(data);
              yield event;
            } catch (error) {
              console.error('Failed to parse event:', error);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Stream error:', error);
        throw error;
      }
    } finally {
      this.abortController = null;
    }
  }
  
  /**
   * Stop streaming
   */
  stopStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Get event statistics
   */
  async getStats(): Promise<GrpcEventStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to get stats: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Get recent events (batch)
   */
  async getRecentEvents(count: number = 10): Promise<{
    events: GrpcBlockchainEvent[];
    totalCount: number;
  }> {
    const response = await fetch(`${this.baseUrl}/recent?count=${count}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get recent events: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Test connection to gRPC service
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getStats();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let grpcClient: BlockchainEventGrpcClient | null = null;

/**
 * Get or create gRPC client instance
 */
export function getGrpcClient(): BlockchainEventGrpcClient {
  if (!grpcClient) {
    grpcClient = new BlockchainEventGrpcClient();
  }
  return grpcClient;
}
