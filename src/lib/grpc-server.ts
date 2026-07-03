import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import type { ProtoGrpcType } from './generated/blockchain-events';
import type { BlockchainEventServiceHandlers } from './generated/stc/blockchain/BlockchainEventService';
import type { BlockchainEvent } from './generated/stc/blockchain/BlockchainEvent';
import type { EventStats } from './generated/stc/blockchain/EventStats';
import type { RecentEventsResponse } from './generated/stc/blockchain/RecentEventsResponse';

// ========================================
// GRPC SERVER - BLOCKCHAIN EVENT STREAMING
// Streams real blockchain transactions to clients
// ========================================

/**
 * Load Protocol Buffer definitions
 */
function loadProto(): ProtoGrpcType {
  const PROTO_PATH = path.join(process.cwd(), 'proto', 'blockchain-events.proto');
  
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  return grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
}

/**
 * Get blockchain events from storage (simulated - in production, this would be a database)
 */
function getBlockchainEventsFromStorage() {
  if (typeof window === 'undefined') {
    // Server-side: Return empty array or read from database
    // For now, we'll implement a simple in-memory store
    return [];
  }
  
  try {
    const data = localStorage.getItem('stc_blockchain_events');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Convert blockchain event record to gRPC message format
 */
function convertToGrpcEvent(record: any): BlockchainEvent {
  return {
    id: record.id,
    tx_hash: record.txHash,
    block_number: record.blockNumber,
    timestamp: record.timestamp.toString(),
    from: record.from,
    to: record.to,
    value: record.value,
    gas_used: record.gasUsed,
    gas_cost: record.gasCost,
    status: record.status,
    service_id: record.serviceId,
    service_name: record.serviceName,
    booking_id: record.bookingId,
    events: record.events.map((e: any) => ({
      event_name: e.eventName,
      signature: e.signature,
      log_index: e.logIndex,
      args: e.args,
    })),
    decoded_events: record.decodedEvents?.map((d: any) => ({
      event_name: d.eventName,
      signature: d.signature,
      log_index: d.logIndex,
      args: d.args,
      category: d.category,
      severity: d.severity,
    })) || [],
    iot_actions: record.iotActions.map((a: any) => ({
      action_id: a.actionId,
      device_id: a.deviceId,
      device_name: a.deviceName,
      device_type: a.deviceType,
      action: a.action,
      params: a.params,
      triggered_at: a.triggeredAt.toString(),
      triggered_by: a.triggeredBy,
      event_name: a.eventName,
      status: a.status,
    })),
  };
}

/**
 * gRPC Service Implementation
 */
const blockchainEventServiceHandlers: BlockchainEventServiceHandlers = {
  /**
   * Server-side streaming: Stream blockchain events in real-time
   */
  StreamBlockchainEvents: (call) => {
    console.log('🎯 gRPC client connected for event streaming');
    
    const request = call.request;
    let isActive = true;
    
    // Track last sent event ID to avoid duplicates
    let lastSentEventId: string | null = null;
    
    // Initial send: Send existing events
    const sendExistingEvents = () => {
      try {
        // In production, this would read from a database
        // For demo, we'll use a global store or file system
        const events = getBlockchainEventsFromStorage();
        
        events.forEach((record: any) => {
          // Apply filters
          if (request.event_types && request.event_types.length > 0) {
            const hasMatchingEvent = record.events.some((e: any) =>
              request.event_types!.includes(e.eventName)
            );
            if (!hasMatchingEvent) return;
          }
          
          if (request.service_id && record.serviceId !== request.service_id) {
            return;
          }
          
          if (request.booking_id && record.bookingId !== request.booking_id) {
            return;
          }
          
          // Convert and send
          if (record.id !== lastSentEventId && isActive) {
            const grpcEvent = convertToGrpcEvent(record);
            call.write(grpcEvent);
            lastSentEventId = record.id;
          }
        });
      } catch (error) {
        console.error('Error sending existing events:', error);
      }
    };
    
    // Send existing events immediately
    sendExistingEvents();
    
    // Poll for new events every 2 seconds
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }
      
      sendExistingEvents();
    }, 2000);
    
    // Handle client disconnect
    call.on('cancelled', () => {
      console.log('🔌 gRPC client disconnected');
      isActive = false;
      clearInterval(interval);
    });
    
    call.on('error', (error) => {
      console.error('gRPC stream error:', error);
      isActive = false;
      clearInterval(interval);
    });
  },
  
  /**
   * Get event statistics
   */
  GetEventStats: (call, callback) => {
    try {
      const events = getBlockchainEventsFromStorage();
      
      const totalTransactions = events.length;
      const totalEvents = events.reduce((sum: number, e: any) => sum + e.events.length, 0);
      const totalIoTActions = events.reduce((sum: number, e: any) => sum + e.iotActions.length, 0);
      const totalGasUsed = events.reduce((sum: number, e: any) => sum + parseFloat(e.gasUsed || '0'), 0);
      const avgGasPerTx = totalTransactions > 0 ? totalGasUsed / totalTransactions : 0;
      
      const stats: EventStats = {
        total_transactions: totalTransactions,
        total_events: totalEvents,
        total_iot_actions: totalIoTActions,
        total_gas_used: totalGasUsed.toString(),
        avg_gas_per_tx: avgGasPerTx.toFixed(0),
        confirmed_transactions: events.filter((e: any) => e.status === 'confirmed').length,
        failed_transactions: events.filter((e: any) => e.status === 'failed').length,
        last_updated: Date.now().toString(),
      };
      
      callback(null, stats);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get event statistics',
      });
    }
  },
  
  /**
   * Get recent events (batch request)
   */
  GetRecentEvents: (call, callback) => {
    try {
      const count = call.request.count || 10;
      const events = getBlockchainEventsFromStorage();
      const recentEvents = events.slice(0, count);
      
      const response: RecentEventsResponse = {
        events: recentEvents.map(convertToGrpcEvent),
        total_count: events.length,
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get recent events',
      });
    }
  },
};

/**
 * Create and start gRPC server
 */
export function createGrpcServer(port: number = 50051): grpc.Server {
  const proto = loadProto();
  const server = new grpc.Server();
  
  server.addService(
    proto.stc.blockchain.BlockchainEventService.service,
    blockchainEventServiceHandlers
  );
  
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('❌ Failed to start gRPC server:', error);
        return;
      }
      console.log(`✅ gRPC server running on port ${port}`);
    }
  );
  
  return server;
}

// Export for API route usage
export { loadProto, convertToGrpcEvent, getBlockchainEventsFromStorage };
