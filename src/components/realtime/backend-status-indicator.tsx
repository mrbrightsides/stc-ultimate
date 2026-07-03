'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Database, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { SPACETIMEDB_CONFIG } from '@/lib/spacetimedb-adapter';
import { useEffect, useState } from 'react';

export function BackendStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const backendName = SPACETIMEDB_CONFIG.enabled ? 'SpacetimeDB' : 'LocalStorage';
  const backendIcon = SPACETIMEDB_CONFIG.enabled ? Database : HardDrive;
  const BackendIcon = backendIcon;

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackendIcon className="h-5 w-5 text-blue-500" />
            <div>
              <div className="font-medium text-sm">Backend</div>
              <div className="text-xs text-muted-foreground">{backendName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Offline
                </>
              )}
            </Badge>

            {/* Backend Status */}
            <Badge
              variant={SPACETIMEDB_CONFIG.enabled ? 'default' : 'secondary'}
              className="gap-1"
            >
              {SPACETIMEDB_CONFIG.enabled ? (
                <>
                  <Database className="h-3 w-3" />
                  SpacetimeDB
                </>
              ) : (
                <>
                  <HardDrive className="h-3 w-3" />
                  LocalStorage
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Migration Info */}
        {!SPACETIMEDB_CONFIG.enabled && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md text-xs">
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              💡 Migration Ready
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              SpacetimeDB support built-in. Set{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                NEXT_PUBLIC_SPACETIMEDB_ENABLED=true
              </code>{' '}
              to enable.
            </div>
          </div>
        )}

        {SPACETIMEDB_CONFIG.enabled && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-md text-xs">
            <div className="font-medium text-green-900 dark:text-green-100 mb-1">
              ✅ SpacetimeDB Active
            </div>
            <div className="text-green-700 dark:text-green-300">
              Real-time multi-device sync enabled. Module:{' '}
              <code className="bg-green-100 dark:bg-green-900 px-1 rounded">
                {SPACETIMEDB_CONFIG.moduleAddress || 'not configured'}
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
