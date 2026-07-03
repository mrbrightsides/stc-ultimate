// ========================================
// GRPC ANALYTICS SERVICE - SERVER IMPLEMENTATION
// Handles real-time analytics and performance metrics
// ========================================

export interface SystemMetrics {
  timestamp: number;
  systemUptime: number;
  energyConsumption: number;
  networkBandwidth: number;
  connectedDevices: number;
  activeTransactions: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  customMetrics?: Record<string, number>;
}

export interface PerformanceData {
  timestamp: number;
  component: string;
  avgLatencyMs: number;
  maxLatencyMs: number;
  minLatencyMs: number;
  throughputPerSec: number;
  errorCount: number;
  errorRate: number;
  successRate: number;
}

export interface AggregatedAnalytics {
  periodStart: number;
  periodEnd: number;
  totalEnergyConsumed: number;
  totalTransactions: number;
  totalIoTActions: number;
  avgSystemUptime: number;
  avgResponseTime: number;
  totalAlerts: number;
  categoryMetrics: Record<string, number>;
}

/**
 * Analytics Storage and Generator
 */
class AnalyticsStorage {
  private static metricsHistory: SystemMetrics[] = [];
  private static performanceHistory: PerformanceData[] = [];

  static getCurrentMetrics(): SystemMetrics {
    return {
      timestamp: Date.now(),
      systemUptime: 99.8 + Math.random() * 0.2,
      energyConsumption: 342.5 + Math.random() * 10,
      networkBandwidth: 67 + Math.random() * 5,
      connectedDevices: 18,
      activeTransactions: Math.floor(Math.random() * 10),
      cpuUsage: 45 + Math.random() * 15,
      memoryUsage: 62 + Math.random() * 10,
      diskUsage: 73 + Math.random() * 5,
    };
  }

  static getPerformanceData(component: string): PerformanceData {
    const baseLatency = component === 'blockchain' ? 250 : 50;
    const throughput = component === 'blockchain' ? 15 : 100;

    return {
      timestamp: Date.now(),
      component,
      avgLatencyMs: baseLatency + Math.random() * 50,
      maxLatencyMs: baseLatency * 2 + Math.random() * 100,
      minLatencyMs: baseLatency / 2 + Math.random() * 20,
      throughputPerSec: Math.floor(throughput + Math.random() * 20),
      errorCount: Math.floor(Math.random() * 3),
      errorRate: Math.random() * 0.05,
      successRate: 0.95 + Math.random() * 0.05,
    };
  }

  static addMetrics(metrics: SystemMetrics): void {
    this.metricsHistory.push(metrics);
    // Keep last 1000 entries
    if (this.metricsHistory.length > 1000) {
      this.metricsHistory.shift();
    }
  }

  static addPerformanceData(data: PerformanceData): void {
    this.performanceHistory.push(data);
    // Keep last 1000 entries
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }
  }

  static getAggregatedAnalytics(startTime: number, endTime: number): AggregatedAnalytics {
    const relevantMetrics = this.metricsHistory.filter(
      (m) => m.timestamp >= startTime && m.timestamp <= endTime
    );

    const avgUptime =
      relevantMetrics.length > 0
        ? relevantMetrics.reduce((sum, m) => sum + m.systemUptime, 0) / relevantMetrics.length
        : 99.8;

    return {
      periodStart: startTime,
      periodEnd: endTime,
      totalEnergyConsumed: 342.5,
      totalTransactions: 1247,
      totalIoTActions: 3421,
      avgSystemUptime: avgUptime,
      avgResponseTime: 45.3,
      totalAlerts: 12,
      categoryMetrics: {
        hvac: 6,
        lighting: 4,
        security: 3,
        access: 3,
        environment: 3,
        network: 3,
      },
    };
  }

  // Start continuous metrics generation
  static startMetricsGeneration(): void {
    setInterval(() => {
      const metrics = this.getCurrentMetrics();
      this.addMetrics(metrics);
    }, 3000);

    setInterval(() => {
      ['blockchain', 'iot', 'scada', 'api'].forEach((component) => {
        const perf = this.getPerformanceData(component);
        this.addPerformanceData(perf);
      });
    }, 5000);
  }
}

// Start metrics generation on server
if (typeof window === 'undefined') {
  AnalyticsStorage.startMetricsGeneration();
}

export { AnalyticsStorage };
