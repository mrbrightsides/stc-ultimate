'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOfflineSync, type PendingAction } from '@/hooks/use-offline-sync';
import { 
  Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, 
  Clock, AlertCircle, Trash2, RotateCcw 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineSyncStatusProps {
  className?: string;
  compact?: boolean;
}

const actionTypeLabels: Record<PendingAction['type'], string> = {
  booking: 'Booking',
  chat: 'Chat Message',
  itinerary: 'Itinerary',
  payment: 'Payment'
};

const statusIcons = {
  pending: Clock,
  syncing: RefreshCw,
  synced: CheckCircle,
  failed: XCircle
};

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  syncing: 'text-blue-600 bg-blue-50 border-blue-200',
  synced: 'text-green-600 bg-green-50 border-green-200',
  failed: 'text-red-600 bg-red-50 border-red-200'
};

export function OfflineSyncStatus({ className, compact = false }: OfflineSyncStatusProps) {
  const {
    pendingActions,
    syncStatus,
    syncPendingActions,
    retryFailedActions,
    clearSyncedActions,
    clearAllActions
  } = useOfflineSync();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg border", className)}>
        <div className="flex items-center gap-2">
          {syncStatus.isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {syncStatus.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        {syncStatus.pendingCount > 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            {syncStatus.pendingCount} pending
          </Badge>
        )}
        
        {syncStatus.failedCount > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            {syncStatus.failedCount} failed
          </Badge>
        )}

        {syncStatus.syncInProgress && (
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
        )}
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Sync Status
          </CardTitle>
          <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
            {syncStatus.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-700">{syncStatus.pendingCount}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-700">{syncStatus.failedCount}</div>
            <div className="text-xs text-red-600">Failed</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-700">{pendingActions.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Last Sync Time */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Sync</span>
            <span className="text-sm font-medium text-gray-800">
              {formatTime(syncStatus.lastSyncTime)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={syncPendingActions}
            disabled={!syncStatus.isOnline || syncStatus.syncInProgress || syncStatus.pendingCount === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            {syncStatus.syncInProgress ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
          
          {syncStatus.failedCount > 0 && (
            <Button 
              onClick={retryFailedActions}
              disabled={!syncStatus.isOnline}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Failed
            </Button>
          )}
        </div>

        {/* Pending Actions List */}
        {pendingActions.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Pending Actions</h3>
              <Button 
                onClick={clearAllActions}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {pendingActions.map((action) => {
                  const StatusIcon = statusIcons[action.status];
                  
                  return (
                    <div
                      key={action.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        statusColors[action.status]
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon 
                            className={cn(
                              "h-4 w-4",
                              action.status === 'syncing' && "animate-spin"
                            )}
                          />
                          <span className="text-sm font-medium">
                            {actionTypeLabels[action.type]}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {action.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs opacity-75">
                        Action: {action.action}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                        <span>{formatTime(action.timestamp)}</span>
                        {action.status === 'failed' && (
                          <span>Retries: {action.retryCount}/{action.maxRetries}</span>
                        )}
                      </div>
                    </div>
                  );
                })}</div>
            </ScrollArea>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            All synced! No pending actions.
          </div>
        )}

        {/* Info Note */}
        {!syncStatus.isOnline && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                You're offline. Actions will be synced automatically when connection is restored.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
