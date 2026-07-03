/**
 * SpacetimeDB Adapter - Abstraction layer for real-time data sync
 * 
 * This adapter provides a unified interface that can work with:
 * 1. LocalStorage + CustomEvents (current implementation)
 * 2. SpacetimeDB (future implementation)
 * 
 * Toggle via SPACETIMEDB_ENABLED environment variable
 */

export type StorageBackend = 'localstorage' | 'spacetimedb';

export interface SpacetimeDBConfig {
  enabled: boolean;
  backend: StorageBackend;
  moduleAddress?: string;
  hostUrl?: string;
}

// Configuration - can be overridden via env vars
export const SPACETIMEDB_CONFIG: SpacetimeDBConfig = {
  enabled: process.env.NEXT_PUBLIC_SPACETIMEDB_ENABLED === 'true',
  backend: process.env.NEXT_PUBLIC_SPACETIMEDB_ENABLED === 'true' ? 'spacetimedb' : 'localstorage',
  moduleAddress: process.env.NEXT_PUBLIC_SPACETIMEDB_MODULE,
  hostUrl: process.env.NEXT_PUBLIC_SPACETIMEDB_HOST || 'http://localhost:3000'
};

/**
 * Base adapter interface
 */
export interface DataAdapter<T> {
  // CRUD operations
  get(key: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Real-time subscriptions
  subscribe(callback: (data: T[]) => void): () => void;
  
  // Batch operations
  batchSet(items: Array<{ key: string; value: T }>): Promise<void>;
  batchDelete(keys: string[]): Promise<void>;
}

/**
 * LocalStorage implementation (current)
 */
export class LocalStorageAdapter<T> implements DataAdapter<T> {
  constructor(private storageKey: string) {}

  async get(key: string): Promise<T | null> {
    const stored = localStorage.getItem(`${this.storageKey}_${key}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }

  async getAll(): Promise<T[]> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as T[];
    } catch {
      return [];
    }
  }

  async set(key: string, value: T): Promise<void> {
    localStorage.setItem(`${this.storageKey}_${key}`, JSON.stringify(value));
    
    // Broadcast to other tabs
    window.dispatchEvent(new CustomEvent(`${this.storageKey}-updated`, {
      detail: { key, value }
    }));
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(`${this.storageKey}_${key}`);
    
    window.dispatchEvent(new CustomEvent(`${this.storageKey}-deleted`, {
      detail: { key }
    }));
  }

  async clear(): Promise<void> {
    // Find and remove all keys with this prefix
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.storageKey)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    window.dispatchEvent(new CustomEvent(`${this.storageKey}-cleared`));
  }

  subscribe(callback: (data: T[]) => void): () => void {
    const handleUpdate = async () => {
      const data = await this.getAll();
      callback(data);
    };

    const handleCustomEvent = (event: Event) => {
      handleUpdate();
    };

    window.addEventListener(`${this.storageKey}-updated`, handleCustomEvent);
    window.addEventListener(`${this.storageKey}-deleted`, handleCustomEvent);
    window.addEventListener(`${this.storageKey}-cleared`, handleCustomEvent);

    // Initial load
    handleUpdate();

    return () => {
      window.removeEventListener(`${this.storageKey}-updated`, handleCustomEvent);
      window.removeEventListener(`${this.storageKey}-deleted`, handleCustomEvent);
      window.removeEventListener(`${this.storageKey}-cleared`, handleCustomEvent);
    };
  }

  async batchSet(items: Array<{ key: string; value: T }>): Promise<void> {
    items.forEach(({ key, value }) => {
      localStorage.setItem(`${this.storageKey}_${key}`, JSON.stringify(value));
    });
    
    window.dispatchEvent(new CustomEvent(`${this.storageKey}-batch-updated`, {
      detail: { items }
    }));
  }

  async batchDelete(keys: string[]): Promise<void> {
    keys.forEach(key => {
      localStorage.removeItem(`${this.storageKey}_${key}`);
    });
    
    window.dispatchEvent(new CustomEvent(`${this.storageKey}-batch-deleted`, {
      detail: { keys }
    }));
  }
}

/**
 * SpacetimeDB implementation (future)
 * 
 * This is a placeholder that mimics SpacetimeDB API
 * Replace with actual SpacetimeDB SDK when ready
 */
export class SpacetimeDBAdapter<T> implements DataAdapter<T> {
  private connection: any = null;
  private subscribers: Set<(data: T[]) => void> = new Set();

  constructor(
    private tableName: string,
    private config: SpacetimeDBConfig
  ) {
    // Initialize SpacetimeDB connection (placeholder)
    this.initConnection();
  }

  private async initConnection() {
    // TODO: Replace with actual SpacetimeDB SDK
    // import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';
    // this.connection = new SpacetimeDBClient(this.config.hostUrl);
    // await this.connection.connect(this.config.moduleAddress);
    
    console.log(`[SpacetimeDB] Would connect to table: ${this.tableName}`);
  }

  async get(key: string): Promise<T | null> {
    // TODO: Implement with SpacetimeDB query
    // return await this.connection.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [key]);
    return null;
  }

  async getAll(): Promise<T[]> {
    // TODO: Implement with SpacetimeDB subscription
    // return await this.connection.subscribe(this.tableName);
    return [];
  }

  async set(key: string, value: T): Promise<void> {
    // TODO: Call SpacetimeDB reducer
    // await this.connection.call(`insert_${this.tableName}`, value);
  }

  async delete(key: string): Promise<void> {
    // TODO: Call SpacetimeDB reducer
    // await this.connection.call(`delete_${this.tableName}`, { id: key });
  }

  async clear(): Promise<void> {
    // TODO: Call SpacetimeDB reducer
    // await this.connection.call(`clear_${this.tableName}`);
  }

  subscribe(callback: (data: T[]) => void): () => void {
    this.subscribers.add(callback);
    
    // TODO: Setup SpacetimeDB subscription
    // const subscription = this.connection.subscribe(this.tableName, (rows) => {
    //   this.subscribers.forEach(cb => cb(rows));
    // });

    return () => {
      this.subscribers.delete(callback);
      // TODO: Unsubscribe from SpacetimeDB
      // subscription.unsubscribe();
    };
  }

  async batchSet(items: Array<{ key: string; value: T }>): Promise<void> {
    // TODO: Call SpacetimeDB batch reducer
    // await this.connection.call(`batch_insert_${this.tableName}`, items);
  }

  async batchDelete(keys: string[]): Promise<void> {
    // TODO: Call SpacetimeDB batch reducer
    // await this.connection.call(`batch_delete_${this.tableName}`, keys);
  }
}

/**
 * Factory function to create appropriate adapter
 */
export function createAdapter<T>(
  storageKey: string,
  tableName?: string
): DataAdapter<T> {
  if (SPACETIMEDB_CONFIG.enabled && tableName) {
    return new SpacetimeDBAdapter<T>(tableName, SPACETIMEDB_CONFIG);
  }
  
  return new LocalStorageAdapter<T>(storageKey);
}

/**
 * Hook factory for creating data adapters
 */
export function useDataAdapter<T>(
  storageKey: string,
  tableName?: string
): DataAdapter<T> {
  return createAdapter<T>(storageKey, tableName);
}
