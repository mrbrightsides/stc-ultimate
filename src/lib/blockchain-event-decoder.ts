'use client';

import { ethers } from 'ethers';

// ========================================
// BLOCKCHAIN EVENT DECODER
// Decodes smart contract events with ABI support
// ========================================

// Smart Contract ABIs for STC Ultimate platform
export const CONTRACT_ABIS = {
  // Payment & Escrow Contract
  PaymentEscrow: [
    'event PaymentProcessed(uint256 indexed bookingId, address indexed payer, uint256 amount, uint256 timestamp)',
    'event EscrowReleased(uint256 indexed bookingId, address indexed recipient, uint256 amount, string reason)',
    'event MilestoneTriggered(uint256 indexed bookingId, uint256 indexed milestoneId, string milestone, uint256 amount)',
    'event MilestoneCompleted(uint256 indexed bookingId, uint256 indexed milestoneId, address indexed validator, uint256 reward)',
  ],
  
  // Booking Management Contract
  BookingManager: [
    'event BookingValidated(uint256 indexed bookingId, address indexed validator, uint256 timestamp)',
    'event BookingCreated(uint256 indexed bookingId, address indexed customer, uint256 serviceId, uint256 amount)',
    'event BookingCancelled(uint256 indexed bookingId, address indexed customer, uint256 refundAmount)',
    'event BookingCompleted(uint256 indexed bookingId, address indexed customer, uint256 rating)',
  ],
  
  // Access Control Contract
  AccessControl: [
    'event AccessGranted(address indexed user, uint256 indexed resourceId, uint256 expiresAt)',
    'event AccessRevoked(address indexed user, uint256 indexed resourceId, string reason)',
    'event RoleAssigned(address indexed user, string role, address indexed assigner)',
  ],
  
  // IoT Device Contract
  IoTDevice: [
    'event DeviceTriggered(string indexed deviceId, uint256 indexed bookingId, string action, bytes params)',
    'event SensorReading(string indexed deviceId, uint256 value, uint256 timestamp)',
    'event DeviceStatusChanged(string indexed deviceId, string status, string reason)',
  ],
} as const;

export interface DecodedEventData {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  decodedArgs: {
    name: string;
    type: string;
    value: string | number | boolean;
    indexed: boolean;
  }[];
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
}

/**
 * Create interface instances for all ABIs
 */
export function createInterfaces() {
  const interfaces: Record<string, ethers.utils.Interface> = {};
  
  for (const [name, abi] of Object.entries(CONTRACT_ABIS)) {
    try {
      interfaces[name] = new ethers.utils.Interface(abi);
    } catch (error) {
      console.warn(`Failed to create interface for ${name}:`, error);
    }
  }
  
  return interfaces;
}

/**
 * Decode event log with ABI
 */
export function decodeEventLog(
  log: ethers.providers.Log,
  receipt: ethers.providers.TransactionReceipt
): DecodedEventData | null {
  const interfaces = createInterfaces();
  
  // Try to parse with each interface
  for (const [contractName, iface] of Object.entries(interfaces)) {
    try {
      const parsed = iface.parseLog(log);
      
      if (parsed) {
        // Extract decoded arguments
        const decodedArgs = parsed.eventFragment.inputs.map((input, index) => ({
          name: input.name,
          type: input.type,
          value: formatValue(parsed.args[index]),
          indexed: input.indexed,
        }));
        
        // Convert to record format
        const args: Record<string, unknown> = {};
        decodedArgs.forEach(arg => {
          args[arg.name] = arg.value;
        });
        
        return {
          eventName: parsed.name,
          signature: parsed.signature,
          args,
          decodedArgs,
          timestamp: Date.now(),
          blockNumber: receipt.blockNumber,
          transactionHash: receipt.transactionHash,
          logIndex: log.logIndex,
        };
      }
    } catch (error) {
      // Continue to next interface
      continue;
    }
  }
  
  return null;
}

/**
 * Decode all events from transaction receipt
 */
export function decodeAllEvents(
  receipt: ethers.providers.TransactionReceipt
): DecodedEventData[] {
  const decodedEvents: DecodedEventData[] = [];
  
  for (const log of receipt.logs) {
    const decoded = decodeEventLog(log, receipt);
    if (decoded) {
      decodedEvents.push(decoded);
    }
  }
  
  return decodedEvents;
}

/**
 * Format value for display
 */
function formatValue(value: unknown): string | number | boolean {
  if (ethers.BigNumber.isBigNumber(value)) {
    return value.toString();
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Get event details by name
 */
export function getEventDetails(eventName: string): {
  description: string;
  category: 'payment' | 'booking' | 'access' | 'iot';
  severity: 'info' | 'success' | 'warning' | 'error';
} {
  const eventMap: Record<string, typeof returnType> = {
    PaymentProcessed: {
      description: 'Payment successfully processed and recorded on blockchain',
      category: 'payment',
      severity: 'success',
    },
    EscrowReleased: {
      description: 'Escrowed funds released to service provider',
      category: 'payment',
      severity: 'success',
    },
    MilestoneTriggered: {
      description: 'Service milestone reached and verified',
      category: 'payment',
      severity: 'info',
    },
    MilestoneCompleted: {
      description: 'Milestone validated and payment released',
      category: 'payment',
      severity: 'success',
    },
    BookingValidated: {
      description: 'Booking validated by smart contract',
      category: 'booking',
      severity: 'success',
    },
    BookingCreated: {
      description: 'New booking created on blockchain',
      category: 'booking',
      severity: 'info',
    },
    BookingCancelled: {
      description: 'Booking cancelled with refund processed',
      category: 'booking',
      severity: 'warning',
    },
    BookingCompleted: {
      description: 'Booking completed successfully',
      category: 'booking',
      severity: 'success',
    },
    AccessGranted: {
      description: 'Access permission granted to user',
      category: 'access',
      severity: 'info',
    },
    AccessRevoked: {
      description: 'Access permission revoked',
      category: 'access',
      severity: 'warning',
    },
    DeviceTriggered: {
      description: 'IoT device action triggered by blockchain event',
      category: 'iot',
      severity: 'info',
    },
    SensorReading: {
      description: 'IoT sensor data recorded on blockchain',
      category: 'iot',
      severity: 'info',
    },
  };
  
  type returnType = {
    description: string;
    category: 'payment' | 'booking' | 'access' | 'iot';
    severity: 'info' | 'success' | 'warning' | 'error';
  };
  
  return eventMap[eventName] || {
    description: 'Unknown blockchain event',
    category: 'iot',
    severity: 'info',
  };
}

/**
 * Extract IoT params from decoded event
 */
export function extractIoTParams(decodedEvent: DecodedEventData): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  
  // Extract relevant params based on event type
  switch (decodedEvent.eventName) {
    case 'PaymentProcessed':
      params.bookingId = decodedEvent.args['bookingId'];
      params.amount = decodedEvent.args['amount'];
      params.payer = decodedEvent.args['payer'];
      break;
      
    case 'EscrowReleased':
      params.bookingId = decodedEvent.args['bookingId'];
      params.amount = decodedEvent.args['amount'];
      params.reason = decodedEvent.args['reason'];
      break;
      
    case 'MilestoneTriggered':
      params.bookingId = decodedEvent.args['bookingId'];
      params.milestoneId = decodedEvent.args['milestoneId'];
      params.milestone = decodedEvent.args['milestone'];
      break;
      
    case 'BookingValidated':
      params.bookingId = decodedEvent.args['bookingId'];
      params.validator = decodedEvent.args['validator'];
      break;
      
    case 'DeviceTriggered':
      params.deviceId = decodedEvent.args['deviceId'];
      params.action = decodedEvent.args['action'];
      params.bookingId = decodedEvent.args['bookingId'];
      break;
      
    default:
      // Copy all args
      Object.assign(params, decodedEvent.args);
  }
  
  return params;
}
