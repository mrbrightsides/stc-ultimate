'use client';

import type { BlockchainEventRecord, IoTAction } from './blockchain-event-tracker';
import type { DecodedEventData } from './blockchain-event-decoder';

// ========================================
// WEBHOOK NOTIFIER
// Sends real-time notifications to external systems
// ========================================

export interface WebhookConfig {
  url: string;
  enabled: boolean;
  events: string[]; // Event names to trigger webhook
  headers?: Record<string, string>;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface WebhookPayload {
  event: 'blockchain_transaction' | 'iot_action' | 'system_alert';
  timestamp: number;
  data: {
    txHash?: string;
    blockNumber?: number;
    eventName?: string;
    decodedData?: DecodedEventData;
    iotAction?: IoTAction;
    metadata?: Record<string, unknown>;
  };
  signature?: string;
}

export interface WebhookLog {
  id: string;
  timestamp: number;
  url: string;
  payload: WebhookPayload;
  status: 'pending' | 'success' | 'failed';
  statusCode?: number;
  response?: string;
  error?: string;
  retryCount: number;
}

/**
 * Webhook Manager
 */
export class WebhookNotifier {
  private static STORAGE_KEY = 'stc_webhook_config';
  private static LOGS_KEY = 'stc_webhook_logs';
  private static MAX_LOGS = 100;
  
  /**
   * Get webhook configuration
   */
  static getConfig(): WebhookConfig {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load webhook config:', error);
    }
    
    // Default config
    return {
      url: 'https://hooks.stc-ultimate.com/events',
      enabled: false,
      events: ['PaymentProcessed', 'EscrowReleased', 'BookingValidated', 'DeviceTriggered'],
      headers: {
        'Content-Type': 'application/json',
        'X-STC-Platform': 'ultimate',
      },
      retryAttempts: 3,
      retryDelay: 1000,
    };
  }
  
  /**
   * Save webhook configuration
   */
  static saveConfig(config: WebhookConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save webhook config:', error);
    }
  }
  
  /**
   * Send webhook notification
   */
  static async send(payload: WebhookPayload): Promise<WebhookLog> {
    const config = this.getConfig();
    
    const log: WebhookLog = {
      id: `wh-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      url: config.url,
      payload,
      status: 'pending',
      retryCount: 0,
    };
    
    // Check if webhook is enabled
    if (!config.enabled) {
      log.status = 'failed';
      log.error = 'Webhook disabled';
      this.saveLog(log);
      return log;
    }
    
    // Check if event should trigger webhook
    const eventName = payload.data.eventName;
    if (eventName && !config.events.includes(eventName)) {
      log.status = 'failed';
      log.error = 'Event not configured for webhook';
      this.saveLog(log);
      return log;
    }
    
    // Send webhook with retry logic
    return this.sendWithRetry(log, config);
  }
  
  /**
   * Send with retry logic
   */
  private static async sendWithRetry(
    log: WebhookLog,
    config: WebhookConfig
  ): Promise<WebhookLog> {
    const maxAttempts = config.retryAttempts || 3;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers || {},
          body: JSON.stringify(log.payload),
        });
        
        log.statusCode = response.status;
        log.response = await response.text();
        
        if (response.ok) {
          log.status = 'success';
          this.saveLog(log);
          console.log('✅ Webhook sent successfully:', log.id);
          return log;
        } else {
          log.error = `HTTP ${response.status}: ${log.response}`;
        }
      } catch (error) {
        log.error = error instanceof Error ? error.message : 'Unknown error';
      }
      
      log.retryCount = attempt + 1;
      
      // Wait before retry
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
      }
    }
    
    log.status = 'failed';
    this.saveLog(log);
    console.error('❌ Webhook failed after retries:', log.error);
    return log;
  }
  
  /**
   * Send notification for blockchain event
   */
  static async notifyBlockchainEvent(
    event: BlockchainEventRecord,
    decodedData?: DecodedEventData
  ): Promise<void> {
    const payload: WebhookPayload = {
      event: 'blockchain_transaction',
      timestamp: Date.now(),
      data: {
        txHash: event.txHash,
        blockNumber: event.blockNumber,
        eventName: event.events[0]?.eventName,
        decodedData,
        metadata: {
          serviceId: event.serviceId,
          serviceName: event.serviceName,
          bookingId: event.bookingId,
          gasUsed: event.gasUsed,
          gasCost: event.gasCost,
        },
      },
    };
    
    await this.send(payload);
  }
  
  /**
   * Send notification for IoT action
   */
  static async notifyIoTAction(action: IoTAction, txHash: string): Promise<void> {
    const payload: WebhookPayload = {
      event: 'iot_action',
      timestamp: Date.now(),
      data: {
        txHash,
        iotAction: action,
        metadata: {
          deviceId: action.deviceId,
          deviceType: action.deviceType,
          action: action.action,
          triggeredBy: action.triggeredBy,
        },
      },
    };
    
    await this.send(payload);
  }
  
  /**
   * Save webhook log
   */
  private static saveLog(log: WebhookLog): void {
    try {
      const logs = this.getLogs();
      logs.unshift(log);
      
      const limited = logs.slice(0, this.MAX_LOGS);
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save webhook log:', error);
    }
  }
  
  /**
   * Get all webhook logs
   */
  static getLogs(): WebhookLog[] {
    try {
      const data = localStorage.getItem(this.LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load webhook logs:', error);
      return [];
    }
  }
  
  /**
   * Clear webhook logs
   */
  static clearLogs(): void {
    localStorage.removeItem(this.LOGS_KEY);
  }
  
  /**
   * Get webhook statistics
   */
  static getStats() {
    const logs = this.getLogs();
    
    return {
      total: logs.length,
      success: logs.filter(l => l.status === 'success').length,
      failed: logs.filter(l => l.status === 'failed').length,
      pending: logs.filter(l => l.status === 'pending').length,
      successRate: logs.length > 0 
        ? ((logs.filter(l => l.status === 'success').length / logs.length) * 100).toFixed(1)
        : '0',
      avgRetries: logs.length > 0
        ? (logs.reduce((sum, l) => sum + l.retryCount, 0) / logs.length).toFixed(1)
        : '0',
    };
  }
}

/**
 * Test webhook connection
 */
export async function testWebhookConnection(url: string): Promise<{
  success: boolean;
  message: string;
  latency?: number;
}> {
  const startTime = Date.now();
  
  try {
    const testPayload: WebhookPayload = {
      event: 'system_alert',
      timestamp: Date.now(),
      data: {
        metadata: {
          test: true,
          message: 'STC Ultimate webhook connection test',
        },
      },
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-STC-Platform': 'ultimate',
        'X-STC-Test': 'true',
      },
      body: JSON.stringify(testPayload),
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      return {
        success: true,
        message: `Connected successfully (${latency}ms)`,
        latency,
      };
    } else {
      return {
        success: false,
        message: `HTTP ${response.status}: ${await response.text()}`,
        latency,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      latency: Date.now() - startTime,
    };
  }
}
