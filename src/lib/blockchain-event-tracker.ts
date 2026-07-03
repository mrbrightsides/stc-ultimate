'use client';

import type { ethers } from 'ethers';
import { decodeAllEvents, extractIoTParams, type DecodedEventData } from './blockchain-event-decoder';

// ========================================
// BLOCKCHAIN EVENT TRACKER
// Captures real transaction events and maps them to IoT actions
// ========================================

export interface ParsedEvent {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  logIndex: number;
  raw: {
    topics: string[];
    data: string;
  };
}

export interface BlockchainEventRecord {
  id: string;
  txHash: string;
  blockNumber: number;
  blockTimestamp: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasCost: string;
  status: 'confirmed' | 'pending' | 'failed';
  
  // Service/booking details
  serviceId?: number;
  serviceName?: string;
  bookingId?: string;
  
  // Events extracted from transaction
  events: ParsedEvent[];
  
  // Decoded events with ABI
  decodedEvents?: DecodedEventData[];
  
  // IoT actions triggered by this transaction
  iotActions: IoTAction[];
}

export interface IoTAction {
  actionId: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'access_control' | 'hvac' | 'lighting' | 'camera' | 'sensor' | 'network';
  action: 'unlock' | 'lock' | 'activate' | 'deactivate' | 'record' | 'read' | 'configure';
  params: Record<string, unknown>;
  triggeredAt: number;
  triggeredBy: 'blockchain_event';
  eventName: string;
  status: 'pending' | 'executed' | 'failed';
}

// Event name mappings (common Solidity event signatures)
export const EVENT_SIGNATURES = {
  // Payment/Escrow events
  PaymentProcessed: 'PaymentProcessed(uint256,address,uint256)',
  EscrowReleased: 'EscrowReleased(uint256,address,uint256)',
  MilestoneTriggered: 'MilestoneTriggered(uint256,uint256,string)',
  MilestoneCompleted: 'MilestoneCompleted(uint256,uint256,address,uint256)',
  
  // Booking events
  BookingValidated: 'BookingValidated(uint256,address,uint256)',
  BookingCreated: 'BookingCreated(uint256,address,uint256,uint256)',
  BookingCancelled: 'BookingCancelled(uint256,address)',
  
  // Access control events
  AccessGranted: 'AccessGranted(address,uint256)',
  AccessRevoked: 'AccessRevoked(address,uint256)',
  
  // IoT events
  DeviceTriggered: 'DeviceTriggered(string,uint256)',
  SensorReading: 'SensorReading(string,uint256,uint256)',
} as const;

// Event-to-IoT mapping configuration
export const EVENT_TO_IOT_MAPPING: Record<string, IoTAction['deviceType'] | IoTAction> = {
  // When payment is processed, unlock access control
  PaymentProcessed: {
    deviceType: 'access_control',
    action: 'unlock',
    deviceId: 'access-001',
    deviceName: 'Main Entrance Door Lock',
  },
  
  // When escrow is released, activate HVAC
  EscrowReleased: {
    deviceType: 'hvac',
    action: 'activate',
    deviceId: 'hvac-001',
    deviceName: 'Room HVAC System',
    params: { temperature: 22, mode: 'cool' },
  },
  
  // When milestone is triggered, activate camera
  MilestoneTriggered: {
    deviceType: 'camera',
    action: 'record',
    deviceId: 'cam-001',
    deviceName: 'Security Camera 1',
    params: { duration: 300, quality: '1080p' },
  },
  
  // When booking is validated, configure lighting
  BookingValidated: {
    deviceType: 'lighting',
    action: 'activate',
    deviceId: 'light-001',
    deviceName: 'Room Lighting System',
    params: { brightness: 80 },
  },
  
  // When milestone is completed, read sensor
  MilestoneCompleted: {
    deviceType: 'sensor',
    action: 'read',
    deviceId: 'temp-001',
    deviceName: 'Temperature Sensor',
  },
} as const;

/**
 * Parse transaction receipt and extract events
 */
export function parseTransactionReceipt(
  receipt: ethers.providers.TransactionReceipt
): ParsedEvent[] {
  const parsedEvents: ParsedEvent[] = [];
  
  // Iterate through logs (raw events)
  for (const log of receipt.logs) {
    try {
      // Extract event signature from topics[0]
      const signature = log.topics[0];
      
      // Try to match with known event signatures
      let eventName = 'UnknownEvent';
      for (const [name, sig] of Object.entries(EVENT_SIGNATURES)) {
        // In production, you'd compute keccak256 hash of signature
        // For now, we'll use a simplified matching
        if (signature && signature.length > 0) {
          eventName = name;
          break;
        }
      }
      
      parsedEvents.push({
        eventName,
        signature,
        args: {}, // In production, decode with ethers.utils.Interface
        logIndex: log.logIndex,
        raw: {
          topics: log.topics,
          data: log.data,
        },
      });
    } catch (error) {
      console.warn('Failed to parse log:', error);
    }
  }
  
  return parsedEvents;
}

/**
 * Generate IoT actions based on blockchain events
 */
export function generateIoTActions(events: ParsedEvent[]): IoTAction[] {
  const actions: IoTAction[] = [];
  
  for (const event of events) {
    const mapping = EVENT_TO_IOT_MAPPING[event.eventName];
    
    if (mapping && typeof mapping === 'object' && 'deviceType' in mapping) {
      const action: IoTAction = {
        actionId: `iot-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        deviceId: mapping.deviceId || `dev-${event.logIndex}`,
        deviceName: mapping.deviceName || `Device ${event.logIndex}`,
        deviceType: mapping.deviceType,
        action: mapping.action,
        params: mapping.params || {},
        triggeredAt: Date.now(),
        triggeredBy: 'blockchain_event',
        eventName: event.eventName,
        status: 'executed',
      };
      
      actions.push(action);
    }
  }
  
  return actions;
}

/**
 * Create blockchain event record from transaction
 */
export async function createEventRecord(
  tx: ethers.providers.TransactionResponse,
  receipt: ethers.providers.TransactionReceipt,
  metadata?: {
    serviceId?: number;
    serviceName?: string;
    bookingId?: string;
  }
): Promise<BlockchainEventRecord> {
  // Parse events from receipt
  const parsedEvents = parseTransactionReceipt(receipt);
  
  // Decode events with ABI (enhanced)
  let decodedEvents: DecodedEventData[] = [];
  try {
    decodedEvents = decodeAllEvents(receipt);
    console.log('🔍 Decoded events with ABI:', decodedEvents);
  } catch (error) {
    console.warn('Failed to decode events with ABI:', error);
  }
  
  // Generate IoT actions based on events (use decoded if available)
  const eventsForIoT = decodedEvents.length > 0 ? decodedEvents.map(d => ({
    eventName: d.eventName,
    signature: d.signature,
    args: d.args,
    logIndex: d.logIndex,
    raw: { topics: [], data: '' },
  })) : parsedEvents;
  
  const iotActions = generateIoTActions(eventsForIoT);
  
  // Enhance IoT actions with decoded params
  if (decodedEvents.length > 0) {
    iotActions.forEach((action, index) => {
      const decodedEvent = decodedEvents.find(d => d.eventName === action.eventName);
      if (decodedEvent) {
        const enhancedParams = extractIoTParams(decodedEvent);
        action.params = { ...action.params, ...enhancedParams };
      }
    });
  }
  
  // Calculate gas cost (simplified - assumes 30 Gwei)
  const gasPriceGwei = 30;
  const gasCostEth = (receipt.gasUsed.toNumber() * gasPriceGwei) / 1e9;
  
  const record: BlockchainEventRecord = {
    id: `bc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    blockTimestamp: Math.floor(Date.now() / 1000),
    timestamp: Date.now(),
    from: tx.from,
    to: tx.to || '',
    value: tx.value.toString(),
    gasUsed: receipt.gasUsed.toString(),
    gasCost: gasCostEth.toFixed(6),
    status: receipt.status === 1 ? 'confirmed' : 'failed',
    
    serviceId: metadata?.serviceId,
    serviceName: metadata?.serviceName,
    bookingId: metadata?.bookingId,
    
    events: parsedEvents,
    decodedEvents: decodedEvents.length > 0 ? decodedEvents : undefined,
    iotActions,
  };
  
  return record;
}

/**
 * Storage helper for blockchain events
 */
export const BlockchainEventStorage = {
  STORAGE_KEY: 'stc_blockchain_events',
  MAX_EVENTS: 100,
  
  /**
   * Save event record to localStorage
   */
  save(record: BlockchainEventRecord): void {
    try {
      const existing = this.getAll();
      existing.unshift(record);
      
      // Keep only last MAX_EVENTS
      const limited = existing.slice(0, this.MAX_EVENTS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
      
      console.log('✅ Blockchain event saved:', {
        txHash: record.txHash,
        events: record.events.length,
        iotActions: record.iotActions.length,
      });
    } catch (error) {
      console.error('Failed to save blockchain event:', error);
    }
  },
  
  /**
   * Get all event records
   */
  getAll(): BlockchainEventRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load blockchain events:', error);
      return [];
    }
  },
  
  /**
   * Get events by service ID
   */
  getByServiceId(serviceId: number): BlockchainEventRecord[] {
    return this.getAll().filter(e => e.serviceId === serviceId);
  },
  
  /**
   * Get events by booking ID
   */
  getByBookingId(bookingId: string): BlockchainEventRecord[] {
    return this.getAll().filter(e => e.bookingId === bookingId);
  },
  
  /**
   * Get recent events (last N)
   */
  getRecent(count: number = 10): BlockchainEventRecord[] {
    return this.getAll().slice(0, count);
  },
  
  /**
   * Get all IoT actions from events
   */
  getAllIoTActions(): IoTAction[] {
    const events = this.getAll();
    return events.flatMap(e => e.iotActions);
  },
  
  /**
   * Clear all events
   */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },
  
  /**
   * Get statistics
   */
  getStats() {
    const events = this.getAll();
    const totalEvents = events.length;
    const totalIoTActions = events.reduce((sum, e) => sum + e.iotActions.length, 0);
    const totalGasUsed = events.reduce((sum, e) => sum + parseFloat(e.gasUsed), 0);
    const avgGasPerTx = totalEvents > 0 ? totalGasUsed / totalEvents : 0;
    
    return {
      totalTransactions: totalEvents,
      totalEvents: events.reduce((sum, e) => sum + e.events.length, 0),
      totalIoTActions,
      totalGasUsed: totalGasUsed.toString(),
      avgGasPerTx: avgGasPerTx.toFixed(0),
      confirmedTransactions: events.filter(e => e.status === 'confirmed').length,
      failedTransactions: events.filter(e => e.status === 'failed').length,
    };
  },
};
