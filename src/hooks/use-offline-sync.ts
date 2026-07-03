'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PendingAction {
  id: string;
  type: 'booking' | 'chat' | 'itinerary' | 'payment';
  action: string;
  payload: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: number;
  pendingCount: number;
  failedCount: number;
  syncInProgress: boolean;
}

const STORAGE_KEY = 'stc_pending_actions';
const MAX_RETRIES = 3;
const SYNC_INTERVAL = 5000; // 5 seconds

export function useOfflineSync() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    lastSyncTime: Date.now(),
    pendingCount: 0,
    failedCount: 0,
    syncInProgress: false
  });

  // Load pending actions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const actions = JSON.parse(stored) as PendingAction[];
        setPendingActions(actions);
      } catch (error) {
        console.error('Failed to load pending actions:', error);
      }
    }
  }, []);

  // Persist pending actions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingActions));
    
    setSyncStatus(prev => ({
      ...prev,
      pendingCount: pendingActions.filter(a => a.status === 'pending').length,
      failedCount: pendingActions.filter(a => a.status === 'failed').length
    }));
  }, [pendingActions]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Trigger sync when coming back online
      syncPendingActions();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync pending actions
  useEffect(() => {
    if (!syncStatus.isOnline) return;

    const interval = setInterval(() => {
      syncPendingActions();
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [syncStatus.isOnline, pendingActions]);

  const queueAction = useCallback((
    type: PendingAction['type'],
    action: string,
    payload: unknown
  ): PendingAction => {
    const pendingAction: PendingAction = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      action,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: MAX_RETRIES,
      status: syncStatus.isOnline ? 'syncing' : 'pending'
    };

    setPendingActions(prev => [...prev, pendingAction]);

    // If online, try to sync immediately
    if (syncStatus.isOnline) {
      setTimeout(() => syncAction(pendingAction), 100);
    }

    return pendingAction;
  }, [syncStatus.isOnline]);

  const syncAction = useCallback(async (action: PendingAction): Promise<boolean> => {
    try {
      // Update status to syncing
      setPendingActions(prev =>
        prev.map(a => a.id === action.id ? { ...a, status: 'syncing' as const } : a)
      );

      // Simulated API call (would be actual gRPC/REST call in production)
      await new Promise(resolve => setTimeout(resolve, 500));

      // In production, this would be actual API calls based on action.type:
      // - booking: Call booking API
      // - chat: Send message via WebSocket/gRPC
      // - itinerary: Update itinerary via API
      // - payment: Process payment transaction

      // Broadcast success
      window.dispatchEvent(new CustomEvent(`stc-${action.type}-synced`, {
        detail: { action: action.action, payload: action.payload }
      }));

      // Remove from pending on success
      setPendingActions(prev => prev.filter(a => a.id !== action.id));

      return true;
    } catch (error) {
      console.error('Sync failed:', error);

      // Increment retry count
      setPendingActions(prev =>
        prev.map(a => {
          if (a.id === action.id) {
            const newRetryCount = a.retryCount + 1;
            return {
              ...a,
              retryCount: newRetryCount,
              status: (newRetryCount >= a.maxRetries ? 'failed' : 'pending') as const
            };
          }
          return a;
        })
      );

      return false;
    }
  }, []);

  const syncPendingActions = useCallback(async () => {
    if (!syncStatus.isOnline || syncStatus.syncInProgress) return;

    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    const actionsToSync = pendingActions.filter(
      a => (a.status === 'pending' || a.status === 'syncing') && a.retryCount < a.maxRetries
    );

    for (const action of actionsToSync) {
      await syncAction(action);
    }

    setSyncStatus(prev => ({
      ...prev,
      syncInProgress: false,
      lastSyncTime: Date.now()
    }));
  }, [syncStatus.isOnline, syncStatus.syncInProgress, pendingActions, syncAction]);

  const retryFailedActions = useCallback(async () => {
    const failedActions = pendingActions.filter(a => a.status === 'failed');

    // Reset retry count and status
    setPendingActions(prev =>
      prev.map(a =>
        a.status === 'failed'
          ? { ...a, retryCount: 0, status: 'pending' as const }
          : a
      )
    );

    // Trigger sync
    if (syncStatus.isOnline) {
      await syncPendingActions();
    }
  }, [pendingActions, syncStatus.isOnline, syncPendingActions]);

  const clearSyncedActions = useCallback(() => {
    setPendingActions(prev => prev.filter(a => a.status !== 'synced'));
  }, []);

  const clearAllActions = useCallback(() => {
    setPendingActions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getActionsByType = useCallback((type: PendingAction['type']) => {
    return pendingActions.filter(a => a.type === type);
  }, [pendingActions]);

  const getActionsByStatus = useCallback((status: PendingAction['status']) => {
    return pendingActions.filter(a => a.status === status);
  }, [pendingActions]);

  return {
    pendingActions,
    syncStatus,
    queueAction,
    syncPendingActions,
    retryFailedActions,
    clearSyncedActions,
    clearAllActions,
    getActionsByType,
    getActionsByStatus
  };
}
