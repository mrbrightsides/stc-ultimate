'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { BlockchainEventRecord, IoTAction } from '@/lib/blockchain-event-tracker';
import { BlockchainEventStorage } from '@/lib/blockchain-event-tracker';
import { WebhookNotifier } from '@/lib/webhook-notifier';

// ========================================
// BLOCKCHAIN EVENTS CONTEXT
// Provides real-time access to blockchain events across the app
// ========================================

interface BlockchainEventsContextType {
  events: BlockchainEventRecord[];
  recentEvents: BlockchainEventRecord[];
  iotActions: IoTAction[];
  stats: {
    totalTransactions: number;
    totalEvents: number;
    totalIoTActions: number;
    totalGasUsed: string;
    avgGasPerTx: string;
    confirmedTransactions: number;
    failedTransactions: number;
  };
  
  // Methods
  refreshEvents: () => void;
  getEventsByServiceId: (serviceId: number) => BlockchainEventRecord[];
  getEventsByBookingId: (bookingId: string) => BlockchainEventRecord[];
  clearEvents: () => void;
}

const BlockchainEventsContext = createContext<BlockchainEventsContextType | undefined>(undefined);

export function BlockchainEventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BlockchainEventRecord[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Load events from storage
  const loadEvents = useCallback(() => {
    const allEvents = BlockchainEventStorage.getAll();
    setEvents(allEvents);
    
    // Trigger webhooks for new events (if enabled)
    const webhookConfig = WebhookNotifier.getConfig();
    if (webhookConfig.enabled && allEvents.length > events.length) {
      // New events detected
      const newEvents = allEvents.slice(0, allEvents.length - events.length);
      newEvents.forEach(event => {
        // Send webhook notification for each new event
        if (event.decodedEvents && event.decodedEvents.length > 0) {
          WebhookNotifier.notifyBlockchainEvent(event, event.decodedEvents[0]);
        }
        
        // Send webhook for each IoT action
        event.iotActions.forEach(action => {
          WebhookNotifier.notifyIoTAction(action, event.txHash);
        });
      });
    }
  }, [events.length]);
  
  // Initial load
  useEffect(() => {
    loadEvents();
  }, [loadEvents, refreshTrigger]);
  
  // Poll for new events every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadEvents();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadEvents]);
  
  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BlockchainEventStorage.STORAGE_KEY) {
        loadEvents();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadEvents]);
  
  const refreshEvents = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const getEventsByServiceId = useCallback((serviceId: number) => {
    return BlockchainEventStorage.getByServiceId(serviceId);
  }, []);
  
  const getEventsByBookingId = useCallback((bookingId: string) => {
    return BlockchainEventStorage.getByBookingId(bookingId);
  }, []);
  
  const clearEvents = useCallback(() => {
    BlockchainEventStorage.clear();
    setEvents([]);
  }, []);
  
  const recentEvents = events.slice(0, 10);
  const iotActions = BlockchainEventStorage.getAllIoTActions();
  const stats = BlockchainEventStorage.getStats();
  
  return (
    <BlockchainEventsContext.Provider
      value={{
        events,
        recentEvents,
        iotActions,
        stats,
        refreshEvents,
        getEventsByServiceId,
        getEventsByBookingId,
        clearEvents,
      }}
    >
      {children}
    </BlockchainEventsContext.Provider>
  );
}

export function useBlockchainEvents() {
  const context = useContext(BlockchainEventsContext);
  if (!context) {
    throw new Error('useBlockchainEvents must be used within BlockchainEventsProvider');
  }
  return context;
}
