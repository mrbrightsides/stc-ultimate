'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Cpu,
  Database,
  Zap,
  Info
} from 'lucide-react';
import { 
  getSystemHealth,
  getComponentHealth,
  getPerformanceMetrics,
  getDataFlowMetrics,
  getActiveAlerts,
  getSystemHealthScore,
  getSystemStatusSummary
} from '@/lib/phase4-integration-dashboard';

export function IntegrationDashboardPanel() {
  const systemHealth = getSystemHealth();
  const components = getComponentHealth();
  const performance = getPerformanceMetrics();
  const dataFlows = getDataFlowMetrics();
  const alerts = getActiveAlerts();
  const healthScore = getSystemHealthScore();
  const statusSummary = getSystemStatusSummary();

  const getHealthColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: 'text-green-400',
      operational: 'text-green-400',
      degraded: 'text-yellow-400',
      down: 'text-red-400',
      critical: 'text-red-400'
    };
    return colors[status] || colors.healthy;
  };

  const getHealthIcon = (status: string) => {
    if (status === 'healthy' || status === 'operational') {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    } else if (status === 'degraded') {
      return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-300 border-red-500/50',
      warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      info: 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    };
    return colors[severity] || colors.info;
  };

  const getComponentIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      blockchain: <Database className="h-5 w-5 text-purple-400" />,
      iot: <Cpu className="h-5 w-5 text-cyan-400" />,
      ai: <Zap className="h-5 w-5 text-yellow-400" />,
      metaverse: <Activity className="h-5 w-5 text-pink-400" />,
      streaming: <TrendingUp className="h-5 w-5 text-green-400" />,
      ar: <Info className="h-5 w-5 text-blue-400" />
    };
    return icons[type] || icons.blockchain;
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">System Health Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time monitoring of all HCPS-Tourism 5.0 phases and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overall Health Score */}
          <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Overall System Health</h3>
                <p className="text-gray-400 text-sm">Calculated from all phases and components</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getHealthColor(statusSummary.overall)}`}>
                  {healthScore.toFixed(1)}%
                </div>
                <Badge className={
                  statusSummary.overall === 'healthy' ? 'bg-green-500/20 text-green-300' :
                  statusSummary.overall === 'degraded' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }>
                  {statusSummary.overall}
                </Badge>
              </div>
            </div>
            <Progress value={healthScore} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-400 mt-3">
              <span>{statusSummary.healthyPhases} Healthy • {statusSummary.degradedPhases} Degraded • {statusSummary.criticalPhases} Critical</span>
              <span>{statusSummary.totalIssues} Active Issues</span>
            </div>
          </div>

          {/* Phases Status Grid */}
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {systemHealth.map((phase) => (
              <div 
                key={phase.phase}
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  {getHealthIcon(phase.status)}
                  <Badge className={
                    phase.status === 'healthy' ? 'bg-green-500/20 text-green-300 text-xs' :
                    phase.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-300 text-xs' :
                    'bg-red-500/20 text-red-300 text-xs'
                  }>
                    {phase.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{phase.phase}</h3>
                <div className="text-xs text-gray-400">
                  Uptime: <span className="text-white font-semibold">{phase.uptime}%</span>
                </div>
                {phase.issues.length > 0 && (
                  <div className="text-xs text-yellow-400 mt-1">
                    {phase.issues.filter(i => !i.resolved).length} issues
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View Tabs */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="components" className="data-[state=active]:bg-purple-500/20">
                <Cpu className="h-4 w-4 mr-2" />
                Components
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-500/20">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="dataflow" className="data-[state=active]:bg-blue-500/20">
                <Database className="h-4 w-4 mr-2" />
                Data Flow
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-orange-500/20">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerts
              </TabsTrigger>
            </TabsList>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map((component) => (
                  <div 
                    key={component.name}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getComponentIcon(component.type)}
                        <h3 className="font-semibold text-white text-sm">{component.name}</h3>
                      </div>
                      {getHealthIcon(component.status)}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className={component.responseTime < 300 ? 'text-green-400' : 'text-yellow-400'}>
                          {component.responseTime}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Error Rate:</span>
                        <span className={component.errorRate < 1 ? 'text-green-400' : 'text-yellow-400'}>
                          {component.errorRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Update:</span>
                        <span className="text-white">
                          {new Date(component.lastUpdate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <Database className="h-8 w-8 text-purple-400 mb-3" />
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {performance.totalTransactions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Transactions</div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                  <Zap className="h-8 w-8 text-cyan-400 mb-3" />
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {performance.averageLatency}ms
                  </div>
                  <div className="text-sm text-gray-400">Average Latency</div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <CheckCircle2 className="h-8 w-8 text-green-400 mb-3" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {performance.successRate}%
                  </div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="text-lg font-bold text-white mb-1">
                    {performance.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>

                <div className="p-6 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="text-lg font-bold text-white mb-1">
                    {performance.dataProcessed}
                  </div>
                  <div className="text-sm text-gray-400">Data Processed</div>
                </div>

                <div className="p-6 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="text-lg font-bold text-white mb-1">
                    {performance.uptime}%
                  </div>
                  <div className="text-sm text-gray-400">System Uptime</div>
                </div>
              </div>
            </TabsContent>

            {/* Data Flow Tab */}
            <TabsContent value="dataflow" className="space-y-4 mt-6">
              <div className="space-y-3">
                {dataFlows.map((flow, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {flow.source} → {flow.destination}
                          </div>
                          <div className="text-xs text-gray-400">{flow.dataType}</div>
                        </div>
                      </div>
                      <Badge className={
                        flow.status === 'active' ? 'bg-green-500/20 text-green-300' :
                        flow.status === 'slow' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }>
                        {flow.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400">Volume:</span>
                        <span className="text-white font-semibold ml-2">{flow.volume} MB</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Frequency:</span>
                        <span className="text-white font-semibold ml-2">{flow.frequency}/min</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Latency:</span>
                        <span className={flow.latency < 300 ? 'text-green-400' : 'text-yellow-400'}>
                          {flow.latency}ms
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4 mt-6">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        {alert.severity === 'critical' && <XCircle className="h-5 w-5 text-red-400 mt-0.5" />}
                        {alert.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />}
                        {alert.severity === 'info' && <Info className="h-5 w-5 text-blue-400 mt-0.5" />}
                        <div>
                          <h3 className="font-semibold text-white">{alert.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Component: <span className="text-white">{alert.component}</span></span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      {alert.acknowledged && (
                        <Badge className="bg-green-500/20 text-green-300 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
