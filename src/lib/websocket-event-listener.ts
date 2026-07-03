'use client';

import { ethers } from 'ethers';
import type { BlockchainEventRecord } from './blockchain-event-tracker';
import { createEventRecord, BlockchainEventStorage } from './blockchain-event-tracker';
import { TOUR_PACKAGE_ESCROW_ABI, MY_TOUR_ESCROW_ABI } from '@/app/types/contracts';

// ========================================
// WEBSOCKET EVENT LISTENER
// Real-time blockchain event monitoring with WebSocket provider
// ========================================

export interface EventListener {
  contract: ethers.Contract;
  eventName: string;
  callback: (event: ethers.Event) => void;
  filter: ethers.EventFilter;
}

export interface WebSocketConfig {
  rpcUrl: string;
  contracts: {
    address: string;
    abi: ethers.ContractInterface;
    name: string;
  }[];
  reconnectDelay: number;
  maxReconnectAttempts: number;
}

export class WebSocketEventListener {
  private wsProvider: ethers.providers.WebSocketProvider | null = null;
  private listeners: EventListener[] = [];
  private config: WebSocketConfig;
  private reconnectAttempts: number = 0;
  private isConnected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  // Event callbacks
  public onConnect?: () => void;
  public onDisconnect?: () => void;
  public onError?: (error: Error) => void;
  public onEvent?: (event: BlockchainEventRecord) => void;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  /**
   * Initialize WebSocket connection and start listening
   */
  async connect(): Promise<void> {
    try {
      console.log('🔌 Connecting to WebSocket provider...');
      
      // Create WebSocket provider
      this.wsProvider = new ethers.providers.WebSocketProvider(
        this.config.rpcUrl.replace('https://', 'wss://')
      );

      // Setup connection event handlers
      this.wsProvider._websocket.on('open', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        if (this.onConnect) this.onConnect();
      });

      this.wsProvider._websocket.on('close', () => {
        console.log('⚠️ WebSocket disconnected');
        this.isConnected = false;
        if (this.onDisconnect) this.onDisconnect();
        this.scheduleReconnect();
      });

      this.wsProvider._websocket.on('error', (error: Error) => {
        console.error('❌ WebSocket error:', error);
        if (this.onError) this.onError(error);
      });

      // Setup event listeners for each contract
      await this.setupEventListeners();

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Setup event listeners for all configured contracts
   */
  private async setupEventListeners(): Promise<void> {
    if (!this.wsProvider) return;

    for (const contractConfig of this.config.contracts) {
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        this.wsProvider
      );

      console.log(`📡 Setting up listeners for ${contractConfig.name}...`);

      // Listen to all events from the contract
      const eventNames = this.getEventNames(contractConfig.abi);

      for (const eventName of eventNames) {
        try {
          const filter = contract.filters[eventName]();
          
          const callback = async (...args: unknown[]) => {
            const event = args[args.length - 1] as ethers.Event;
            await this.handleEvent(event, contractConfig.name, eventName);
          };

          contract.on(filter, callback);

          this.listeners.push({
            contract,
            eventName,
            callback,
            filter,
          });

          console.log(`✅ Listening to ${contractConfig.name}.${eventName}`);
        } catch (error) {
          console.warn(`Failed to setup listener for ${eventName}:`, error);
        }
      }
    }
  }

  /**
   * Extract event names from contract ABI
   */
  private getEventNames(abi: ethers.ContractInterface): string[] {
    const iface = new ethers.utils.Interface(abi as string[]);
    return Object.keys(iface.events);
  }

  /**
   * Handle incoming blockchain event
   */
  private async handleEvent(
    event: ethers.Event,
    contractName: string,
    eventName: string
  ): Promise<void> {
    try {
      console.log(`🔔 Event received: ${contractName}.${eventName}`);
      
      // Get transaction and receipt
      const tx = await event.getTransaction();
      const receipt = await event.getTransactionReceipt();

      // Create event record
      const record = await createEventRecord(tx, receipt, {
        serviceName: contractName,
      });

      // Save to storage
      BlockchainEventStorage.save(record);

      // Trigger callback
      if (this.onEvent) {
        this.onEvent(record);
      }

      console.log(`✅ Event processed: ${eventName} (${tx.hash})`);
    } catch (error) {
      console.error(`Failed to handle event ${eventName}:`, error);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('❌ Max reconnect attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.config.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    console.log('🔌 Disconnecting WebSocket...');

    // Remove all event listeners
    for (const listener of this.listeners) {
      listener.contract.off(listener.filter, listener.callback);
    }
    this.listeners = [];

    // Close WebSocket
    if (this.wsProvider) {
      this.wsProvider.destroy();
      this.wsProvider = null;
    }

    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isConnected = false;
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get provider
   */
  getProvider(): ethers.providers.WebSocketProvider | null {
    return this.wsProvider;
  }
}

// ========================================
// DEFAULT CONFIGURATION
// ========================================

const INFURA_WSS = 'wss://sepolia.infura.io/ws/v3/f8d248f838ec4f12b0f01efd2b238206';

export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
  rpcUrl: INFURA_WSS,
  contracts: [
    {
      address: '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613',
      abi: TOUR_PACKAGE_ESCROW_ABI,
      name: 'TourPackageEscrow',
    },
    {
      address: '0xCAF91105884175585e22AceD113F00569547a229',
      abi: MY_TOUR_ESCROW_ABI,
      name: 'MyTourEscrow',
    },
  ],
  reconnectDelay: 2000, // 2 seconds
  maxReconnectAttempts: 5,
};

// ========================================
// SINGLETON INSTANCE
// ========================================

let globalListener: WebSocketEventListener | null = null;

export function getWebSocketListener(): WebSocketEventListener {
  if (!globalListener) {
    globalListener = new WebSocketEventListener(DEFAULT_WEBSOCKET_CONFIG);
  }
  return globalListener;
}

export function startGlobalListener(): void {
  const listener = getWebSocketListener();
  listener.connect();
}

export function stopGlobalListener(): void {
  if (globalListener) {
    globalListener.disconnect();
    globalListener = null;
  }
}
