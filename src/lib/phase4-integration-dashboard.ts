/**
 * Phase 4: Integration Monitoring Dashboard
 * Real-time system health and integration monitoring across all HCPS-Tourism 5.0 phases
 */

export interface SystemHealthStatus {
  phase: 'Phase 0' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4';
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number; // percentage
  lastCheck: Date;
  issues: SystemIssue[];
}

export interface SystemIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  component: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface ComponentHealth {
  name: string;
  type: 'blockchain' | 'iot' | 'ai' | 'metaverse' | 'streaming' | 'ar';
  status: 'operational' | 'degraded' | 'down';
  responseTime: number; // ms
  errorRate: number; // percentage
  lastUpdate: Date;
}

export interface PerformanceMetrics {
  totalTransactions: number;
  averageLatency: number; // ms
  successRate: number; // percentage
  activeUsers: number;
  dataProcessed: string; // e.g., "2.5 TB"
  uptime: number; // percentage
}

export interface DataFlowMetrics {
  source: string;
  destination: string;
  dataType: string;
  volume: number; // MB
  frequency: number; // per minute
  latency: number; // ms
  status: 'active' | 'slow' | 'blocked';
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  component: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  failedIntegrations: number;
  averageResponseTime: number; // ms
  dataFlowRate: number; // MB/s
  systemLoad: number; // percentage
}

// Mock System Health Data
const MOCK_SYSTEM_HEALTH: SystemHealthStatus[] = [
  {
    phase: 'Phase 0',
    status: 'healthy',
    uptime: 99.9,
    lastCheck: new Date(Date.now() - 300000),
    issues: []
  },
  {
    phase: 'Phase 1',
    status: 'healthy',
    uptime: 99.8,
    lastCheck: new Date(Date.now() - 180000),
    issues: [
      {
        id: 'issue-1',
        severity: 'info',
        component: 'IoT Sensor 3',
        message: 'Sensor calibration due in 2 days',
        timestamp: new Date(Date.now() - 86400000),
        resolved: false
      }
    ]
  },
  {
    phase: 'Phase 2',
    status: 'degraded',
    uptime: 98.5,
    lastCheck: new Date(Date.now() - 240000),
    issues: [
      {
        id: 'issue-2',
        severity: 'warning',
        component: 'Cross-Chain Bridge',
        message: 'High transaction volume detected',
        timestamp: new Date(Date.now() - 3600000),
        resolved: false
      }
    ]
  },
  {
    phase: 'Phase 3',
    status: 'healthy',
    uptime: 99.7,
    lastCheck: new Date(Date.now() - 120000),
    issues: []
  },
  {
    phase: 'Phase 4',
    status: 'healthy',
    uptime: 99.6,
    lastCheck: new Date(Date.now() - 60000),
    issues: []
  }
];

// Mock Component Health
const MOCK_COMPONENT_HEALTH: ComponentHealth[] = [
  {
    name: 'Smart Contracts',
    type: 'blockchain',
    status: 'operational',
    responseTime: 234,
    errorRate: 0.2,
    lastUpdate: new Date(Date.now() - 120000)
  },
  {
    name: 'IoT Network',
    type: 'iot',
    status: 'operational',
    responseTime: 124,
    errorRate: 0.5,
    lastUpdate: new Date(Date.now() - 60000)
  },
  {
    name: 'AI Engine',
    type: 'ai',
    status: 'operational',
    responseTime: 387,
    errorRate: 0.3,
    lastUpdate: new Date(Date.now() - 90000)
  },
  {
    name: 'Metaverse Hub',
    type: 'metaverse',
    status: 'operational',
    responseTime: 456,
    errorRate: 1.2,
    lastUpdate: new Date(Date.now() - 180000)
  },
  {
    name: 'Live Streaming',
    type: 'streaming',
    status: 'degraded',
    responseTime: 892,
    errorRate: 3.5,
    lastUpdate: new Date(Date.now() - 240000)
  },
  {
    name: 'AR System',
    type: 'ar',
    status: 'operational',
    responseTime: 321,
    errorRate: 0.8,
    lastUpdate: new Date(Date.now() - 150000)
  }
];

// Mock Data Flow Metrics
const MOCK_DATA_FLOWS: DataFlowMetrics[] = [
  {
    source: 'IoT Sensors',
    destination: 'Blockchain',
    dataType: 'Sensor Readings',
    volume: 245,
    frequency: 60,
    latency: 124,
    status: 'active'
  },
  {
    source: 'Blockchain',
    destination: 'AI Engine',
    dataType: 'Transaction Data',
    volume: 512,
    frequency: 45,
    latency: 187,
    status: 'active'
  },
  {
    source: 'AI Engine',
    destination: 'Metaverse',
    dataType: 'Recommendations',
    volume: 128,
    frequency: 30,
    latency: 234,
    status: 'active'
  },
  {
    source: 'Metaverse',
    destination: 'NFT System',
    dataType: 'User Actions',
    volume: 89,
    frequency: 25,
    latency: 156,
    status: 'active'
  },
  {
    source: 'Live Streaming',
    destination: 'Analytics',
    dataType: 'Stream Metrics',
    volume: 1024,
    frequency: 90,
    latency: 678,
    status: 'slow'
  },
  {
    source: 'AR System',
    destination: 'Blockchain',
    dataType: 'AR Session Data',
    volume: 342,
    frequency: 15,
    latency: 298,
    status: 'active'
  }
];

// Mock Alerts
const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'High Memory Usage',
    message: 'Server memory usage at 92% - consider scaling',
    component: 'Infrastructure',
    timestamp: new Date(Date.now() - 1800000),
    acknowledged: false
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Slow API Response',
    message: 'Cross-chain bridge API responding slowly (>500ms)',
    component: 'Phase 2 - Cross-Chain',
    timestamp: new Date(Date.now() - 3600000),
    acknowledged: true
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'IoT sensor network maintenance scheduled for tomorrow',
    component: 'Phase 1 - IoT',
    timestamp: new Date(Date.now() - 7200000),
    acknowledged: true
  },
  {
    id: 'alert-4',
    severity: 'warning',
    title: 'High Transaction Volume',
    message: 'Unusually high transaction volume detected',
    component: 'Phase 1 - Smart Contracts',
    timestamp: new Date(Date.now() - 1200000),
    acknowledged: false
  },
  {
    id: 'alert-5',
    severity: 'info',
    title: 'System Update Available',
    message: 'New version of AI engine available for deployment',
    component: 'Phase 3 - AI',
    timestamp: new Date(Date.now() - 10800000),
    acknowledged: true
  }
];

/**
 * Get system health status for all phases
 */
export function getSystemHealth(): SystemHealthStatus[] {
  return JSON.parse(JSON.stringify(MOCK_SYSTEM_HEALTH));
}

/**
 * Get health status for specific phase
 */
export function getPhaseHealth(phase: string): SystemHealthStatus | null {
  const health = MOCK_SYSTEM_HEALTH.find(h => h.phase === phase);
  return health ? JSON.parse(JSON.stringify(health)) : null;
}

/**
 * Get component health metrics
 */
export function getComponentHealth(): ComponentHealth[] {
  return JSON.parse(JSON.stringify(MOCK_COMPONENT_HEALTH));
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return {
    totalTransactions: 18234,
    averageLatency: 234, // ms
    successRate: 98.7, // percentage
    activeUsers: 1847,
    dataProcessed: '2.5 TB',
    uptime: 99.8 // percentage
  };
}

/**
 * Get data flow metrics
 */
export function getDataFlowMetrics(): DataFlowMetrics[] {
  return JSON.parse(JSON.stringify(MOCK_DATA_FLOWS));
}

/**
 * Get active alerts
 */
export function getActiveAlerts(): Alert[] {
  return JSON.parse(JSON.stringify(MOCK_ALERTS));
}

/**
 * Get unacknowledged alerts
 */
export function getUnacknowledgedAlerts(): Alert[] {
  return MOCK_ALERTS.filter(a => !a.acknowledged).map(a => JSON.parse(JSON.stringify(a)));
}

/**
 * Get alerts by severity
 */
export function getAlertsBySeverity(severity: Alert['severity']): Alert[] {
  return MOCK_ALERTS.filter(a => a.severity === severity).map(a => JSON.parse(JSON.stringify(a)));
}

/**
 * Get integration statistics
 */
export function getIntegrationStats(): IntegrationStats {
  return {
    totalIntegrations: 24,
    activeIntegrations: 22,
    failedIntegrations: 2,
    averageResponseTime: 345, // ms
    dataFlowRate: 3.2, // MB/s
    systemLoad: 67.4 // percentage
  };
}

/**
 * Acknowledge alert
 */
export function acknowledgeAlert(alertId: string): boolean {
  const alert = MOCK_ALERTS.find(a => a.id === alertId);
  if (!alert) return false;

  alert.acknowledged = true;
  return true;
}

/**
 * Resolve alert
 */
export function resolveAlert(alertId: string): boolean {
  const alert = MOCK_ALERTS.find(a => a.id === alertId);
  if (!alert) return false;

  alert.acknowledged = true;
  alert.resolvedAt = new Date();
  return true;
}

/**
 * Calculate overall system health score
 */
export function getSystemHealthScore(): number {
  const avgUptime = MOCK_SYSTEM_HEALTH.reduce((sum, h) => sum + h.uptime, 0) / MOCK_SYSTEM_HEALTH.length;
  const criticalIssues = MOCK_SYSTEM_HEALTH.reduce((sum, h) => 
    sum + h.issues.filter(i => i.severity === 'critical' && !i.resolved).length, 0
  );
  const warningIssues = MOCK_SYSTEM_HEALTH.reduce((sum, h) => 
    sum + h.issues.filter(i => i.severity === 'warning' && !i.resolved).length, 0
  );

  let score = avgUptime;
  score -= criticalIssues * 2;
  score -= warningIssues * 0.5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Get system status summary
 */
export function getSystemStatusSummary(): {
  overall: 'healthy' | 'degraded' | 'critical';
  healthyPhases: number;
  degradedPhases: number;
  criticalPhases: number;
  totalIssues: number;
} {
  const healthyPhases = MOCK_SYSTEM_HEALTH.filter(h => h.status === 'healthy').length;
  const degradedPhases = MOCK_SYSTEM_HEALTH.filter(h => h.status === 'degraded').length;
  const criticalPhases = MOCK_SYSTEM_HEALTH.filter(h => h.status === 'critical').length;
  const totalIssues = MOCK_SYSTEM_HEALTH.reduce((sum, h) => sum + h.issues.filter(i => !i.resolved).length, 0);

  let overall: 'healthy' | 'degraded' | 'critical';
  if (criticalPhases > 0) {
    overall = 'critical';
  } else if (degradedPhases > 0) {
    overall = 'degraded';
  } else {
    overall = 'healthy';
  }

  return {
    overall,
    healthyPhases,
    degradedPhases,
    criticalPhases,
    totalIssues
  };
}
