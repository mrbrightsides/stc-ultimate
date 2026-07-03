'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  Cpu,
  Database,
  Server,
  Gauge
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

export function SystemHealthPanel() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      id: 'latency',
      name: 'Average Latency',
      value: 45,
      unit: 'ms',
      threshold: 100,
      status: 'excellent',
      trend: 'stable',
      history: [42, 45, 48, 43, 45, 47, 45]
    },
    {
      id: 'success-rate',
      name: 'Success Rate',
      value: 99.2,
      unit: '%',
      threshold: 95,
      status: 'excellent',
      trend: 'up',
      history: [98.5, 98.8, 99.0, 99.1, 99.2, 99.2, 99.2]
    },
    {
      id: 'gas-efficiency',
      name: 'Gas Efficiency',
      value: 87.5,
      unit: '%',
      threshold: 80,
      status: 'good',
      trend: 'up',
      history: [85.0, 85.5, 86.0, 86.5, 87.0, 87.2, 87.5]
    },
    {
      id: 'device-uptime',
      name: 'Device Uptime',
      value: 99.8,
      unit: '%',
      threshold: 99,
      status: 'excellent',
      trend: 'stable',
      history: [99.7, 99.8, 99.8, 99.7, 99.8, 99.8, 99.8]
    },
    {
      id: 'tx-throughput',
      name: 'Transaction Throughput',
      value: 156,
      unit: 'tx/min',
      threshold: 100,
      status: 'good',
      trend: 'up',
      history: [142, 145, 148, 150, 152, 154, 156]
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      threshold: 2,
      status: 'excellent',
      trend: 'down',
      history: [1.2, 1.1, 1.0, 0.9, 0.85, 0.82, 0.8]
    },
    {
      id: 'blockchain-sync',
      name: 'Blockchain Sync',
      value: 100,
      unit: '%',
      threshold: 98,
      status: 'excellent',
      trend: 'stable',
      history: [99.8, 99.9, 100, 100, 100, 100, 100]
    },
    {
      id: 'api-response',
      name: 'API Response Time',
      value: 123,
      unit: 'ms',
      threshold: 200,
      status: 'good',
      trend: 'stable',
      history: [120, 122, 125, 121, 123, 124, 123]
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics =>
        prevMetrics.map(metric => {
          const variation = (Math.random() - 0.5) * 2;
          let newValue = metric.value + variation;

          // Keep values in reasonable ranges
          if (metric.unit === '%') {
            newValue = Math.max(0, Math.min(100, newValue));
          } else if (metric.id === 'latency' || metric.id === 'api-response') {
            newValue = Math.max(20, Math.min(300, newValue));
          } else if (metric.id === 'tx-throughput') {
            newValue = Math.max(100, Math.min(200, newValue));
          }

          // Update history
          const newHistory = [...metric.history.slice(1), newValue];

          // Determine status
          let status: HealthMetric['status'] = 'good';
          if (metric.id === 'error-rate') {
            if (newValue < 1) status = 'excellent';
            else if (newValue < 2) status = 'good';
            else if (newValue < 5) status = 'warning';
            else status = 'critical';
          } else if (metric.unit === '%') {
            if (newValue >= 99) status = 'excellent';
            else if (newValue >= 95) status = 'good';
            else if (newValue >= 90) status = 'warning';
            else status = 'critical';
          } else {
            if (newValue < metric.threshold * 0.5) status = 'excellent';
            else if (newValue < metric.threshold * 0.8) status = 'good';
            else if (newValue < metric.threshold) status = 'warning';
            else status = 'critical';
          }

          // Determine trend
          const avgOld = metric.history.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
          const avgNew = metric.history.slice(-3).reduce((a, b) => a + b, 0) / 3;
          let trend: HealthMetric['trend'] = 'stable';
          if (avgNew > avgOld + 1) trend = 'up';
          else if (avgNew < avgOld - 1) trend = 'down';

          return {
            ...metric,
            value: newValue,
            history: newHistory,
            status,
            trend
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      excellent: 'text-green-400',
      good: 'text-blue-400',
      warning: 'text-yellow-400',
      critical: 'text-red-400'
    };
    return colorMap[status] || 'text-gray-400';
  };

  const getStatusBgColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      excellent: 'bg-green-500/20 border-green-500/30',
      good: 'bg-blue-500/20 border-blue-500/30',
      warning: 'bg-yellow-500/20 border-yellow-500/30',
      critical: 'bg-red-500/20 border-red-500/30'
    };
    return colorMap[status] || 'bg-gray-500/20 border-gray-500/30';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Activity className="h-4 w-4 text-gray-400" />;
  };

  const getMetricIcon = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      latency: <Clock className="h-5 w-5" />,
      'success-rate': <CheckCircle2 className="h-5 w-5" />,
      'gas-efficiency': <Zap className="h-5 w-5" />,
      'device-uptime': <Server className="h-5 w-5" />,
      'tx-throughput': <Activity className="h-5 w-5" />,
      'error-rate': <Target className="h-5 w-5" />,
      'blockchain-sync': <Database className="h-5 w-5" />,
      'api-response': <Cpu className="h-5 w-5" />
    };
    return iconMap[id] || <Gauge className="h-5 w-5" />;
  };

  const excellentMetrics = metrics.filter(m => m.status === 'excellent').length;
  const warningMetrics = metrics.filter(m => m.status === 'warning').length;
  const criticalMetrics = metrics.filter(m => m.status === 'critical').length;

  const overallHealth = (excellentMetrics / metrics.length) * 100;

  return (
    <div className="space-y-4">
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">System Health Score</h3>
              <p className="text-gray-400 text-sm">Overall system performance metrics</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400">{overallHealth.toFixed(1)}%</div>
              <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
          </div>
          <Progress value={overallHealth} className="h-3" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{excellentMetrics}</p>
              <p className="text-xs text-gray-500">Excellent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{warningMetrics}</p>
              <p className="text-xs text-gray-500">Warning</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{criticalMetrics}</p>
              <p className="text-xs text-gray-500">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.id} 
            className={`bg-gray-900/50 border ${getStatusBgColor(metric.status)} transition-all`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  {getMetricIcon(metric.id)}
                  {metric.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(metric.status)}
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
                  </span>
                  <span className="text-xl text-gray-500">{metric.unit}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Threshold: {metric.threshold}{metric.unit}</span>
                    <span>
                      {metric.unit === '%' 
                        ? `${((metric.value / metric.threshold) * 100).toFixed(0)}% of target`
                        : `${metric.value < metric.threshold ? 'Within' : 'Exceeds'} limit`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={metric.unit === '%' ? metric.value : (metric.value / metric.threshold) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Mini Chart */}
                <div className="h-12 flex items-end gap-1">
                  {metric.history.map((value, index) => {
                    const maxValue = Math.max(...metric.history);
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className={`flex-1 ${getStatusColor(metric.status)} opacity-70 rounded-t transition-all hover:opacity-100`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
