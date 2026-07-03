'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Zap, 
  DollarSign,
  Clock,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';
import type { BlockchainEventRecord } from '@/lib/blockchain-event-tracker';

// ========================================
// EVENT HISTORY ANALYTICS
// Time-series charts, trends, and statistical analysis
// ========================================

interface TimeSeriesData {
  timestamp: string;
  hour: string;
  transactions: number;
  gasUsed: number;
  iotActions: number;
  avgGas: number;
}

interface EventTypeData {
  name: string;
  value: number;
  color: string;
}

interface DeviceActivityData {
  device: string;
  activations: number;
  avgResponseTime: number;
}

interface PerformanceMetric {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#a855f7',
  cyan: '#06b6d4',
};

const EVENT_COLORS: Record<string, string> = {
  PaymentProcessed: COLORS.primary,
  EscrowReleased: COLORS.success,
  MilestoneTriggered: COLORS.warning,
  BookingValidated: COLORS.purple,
  AccessGranted: COLORS.cyan,
  Other: '#64748b',
};

export default function EventHistoryAnalytics() {
  const { events, iotActions, stats } = useBlockchainEvents();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | 'all'>('24h');
  
  // Calculate time range in milliseconds
  const timeRangeMs = useMemo(() => {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '6h': return 6 * 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      default: return Infinity;
    }
  }, [timeRange]);
  
  // Filter events by time range
  const filteredEvents = useMemo(() => {
    if (timeRange === 'all') return events;
    const cutoff = Date.now() - timeRangeMs;
    return events.filter(e => e.timestamp > cutoff);
  }, [events, timeRange, timeRangeMs]);
  
  // ========================================
  // TIME SERIES DATA - Transactions over time
  // ========================================
  const timeSeriesData = useMemo(() => {
    const hourlyData = new Map<string, {
      transactions: number;
      gasUsed: number;
      iotActions: number;
      totalGas: number;
    }>();
    
    filteredEvents.forEach(event => {
      const date = new Date(event.timestamp);
      const hourKey = `${date.getHours()}:00`;
      
      const existing = hourlyData.get(hourKey) || {
        transactions: 0,
        gasUsed: 0,
        iotActions: 0,
        totalGas: 0,
      };
      
      hourlyData.set(hourKey, {
        transactions: existing.transactions + 1,
        gasUsed: existing.gasUsed + parseInt(event.gasUsed),
        iotActions: existing.iotActions + event.iotActions.length,
        totalGas: existing.totalGas + parseInt(event.gasUsed),
      });
    });
    
    // Convert to array and sort
    return Array.from(hourlyData.entries())
      .map(([hour, data]) => ({
        timestamp: hour,
        hour,
        transactions: data.transactions,
        gasUsed: data.gasUsed,
        iotActions: data.iotActions,
        avgGas: data.transactions > 0 ? Math.round(data.totalGas / data.transactions) : 0,
      }))
      .sort((a, b) => {
        const hourA = parseInt(a.hour.split(':')[0]);
        const hourB = parseInt(b.hour.split(':')[0]);
        return hourA - hourB;
      })
      .slice(-24); // Last 24 hours
  }, [filteredEvents]);
  
  // ========================================
  // EVENT TYPE DISTRIBUTION
  // ========================================
  const eventTypeData = useMemo(() => {
    const typeCounts = new Map<string, number>();
    
    filteredEvents.forEach(event => {
      event.events.forEach(evt => {
        const count = typeCounts.get(evt.name) || 0;
        typeCounts.set(evt.name, count + 1);
      });
    });
    
    return Array.from(typeCounts.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: EVENT_COLORS[name] || EVENT_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEvents]);
  
  // ========================================
  // DEVICE ACTIVITY ANALYSIS
  // ========================================
  const deviceActivityData = useMemo(() => {
    const deviceStats = new Map<string, {
      activations: number;
      totalResponseTime: number;
    }>();
    
    iotActions.forEach(action => {
      const existing = deviceStats.get(action.deviceName) || {
        activations: 0,
        totalResponseTime: 0,
      };
      
      deviceStats.set(action.deviceName, {
        activations: existing.activations + 1,
        totalResponseTime: existing.totalResponseTime + 100, // Mock response time
      });
    });
    
    return Array.from(deviceStats.entries())
      .map(([device, stats]) => ({
        device,
        activations: stats.activations,
        avgResponseTime: Math.round(stats.totalResponseTime / stats.activations),
      }))
      .sort((a, b) => b.activations - a.activations)
      .slice(0, 10);
  }, [iotActions]);
  
  // ========================================
  // PERFORMANCE METRICS WITH TRENDS
  // ========================================
  const performanceMetrics = useMemo((): PerformanceMetric[] => {
    // Compare current hour with previous hour
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const twoHoursAgo = now - 2 * 60 * 60 * 1000;
    
    const currentHour = events.filter(e => e.timestamp > oneHourAgo);
    const previousHour = events.filter(e => e.timestamp > twoHoursAgo && e.timestamp <= oneHourAgo);
    
    const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
      const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'up' : 'down';
    };
    
    const currentTxCount = currentHour.length;
    const previousTxCount = previousHour.length;
    
    const currentAvgGas = currentHour.length > 0
      ? currentHour.reduce((sum, e) => sum + parseInt(e.gasUsed), 0) / currentHour.length
      : 0;
    const previousAvgGas = previousHour.length > 0
      ? previousHour.reduce((sum, e) => sum + parseInt(e.gasUsed), 0) / previousHour.length
      : 0;
    
    const currentIoTCount = currentHour.reduce((sum, e) => sum + e.iotActions.length, 0);
    const previousIoTCount = previousHour.reduce((sum, e) => sum + e.iotActions.length, 0);
    
    const currentSuccessRate = currentHour.length > 0
      ? (currentHour.filter(e => e.status === 'confirmed').length / currentHour.length) * 100
      : 100;
    const previousSuccessRate = previousHour.length > 0
      ? (previousHour.filter(e => e.status === 'confirmed').length / previousHour.length) * 100
      : 100;
    
    return [
      {
        metric: 'Transactions/Hour',
        current: currentTxCount,
        previous: previousTxCount,
        change: previousTxCount > 0 ? ((currentTxCount - previousTxCount) / previousTxCount) * 100 : 0,
        trend: calculateTrend(currentTxCount, previousTxCount),
      },
      {
        metric: 'Avg Gas Cost',
        current: Math.round(currentAvgGas),
        previous: Math.round(previousAvgGas),
        change: previousAvgGas > 0 ? ((currentAvgGas - previousAvgGas) / previousAvgGas) * 100 : 0,
        trend: calculateTrend(currentAvgGas, previousAvgGas),
      },
      {
        metric: 'IoT Actions/Hour',
        current: currentIoTCount,
        previous: previousIoTCount,
        change: previousIoTCount > 0 ? ((currentIoTCount - previousIoTCount) / previousIoTCount) * 100 : 0,
        trend: calculateTrend(currentIoTCount, previousIoTCount),
      },
      {
        metric: 'Success Rate',
        current: Math.round(currentSuccessRate),
        previous: Math.round(previousSuccessRate),
        change: previousSuccessRate > 0 ? ((currentSuccessRate - previousSuccessRate) / previousSuccessRate) * 100 : 0,
        trend: calculateTrend(currentSuccessRate, previousSuccessRate),
      },
    ];
  }, [events]);
  
  // ========================================
  // COST ANALYSIS
  // ========================================
  const costAnalysis = useMemo(() => {
    const totalGasUsed = filteredEvents.reduce((sum, e) => sum + parseInt(e.gasUsed), 0);
    const avgGasPrice = 30; // Gwei (mock)
    const ethPrice = 2500; // USD (mock)
    
    const totalCostEth = (totalGasUsed * avgGasPrice) / 1e9;
    const totalCostUsd = totalCostEth * ethPrice;
    const avgCostPerTx = filteredEvents.length > 0 ? totalCostUsd / filteredEvents.length : 0;
    
    return {
      totalGasUsed,
      totalCostEth: totalCostEth.toFixed(6),
      totalCostUsd: totalCostUsd.toFixed(2),
      avgCostPerTx: avgCostPerTx.toFixed(4),
      avgGasPrice,
      ethPrice,
    };
  }, [filteredEvents]);
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Event History Analytics
            </CardTitle>
            <CardDescription>
              Statistical analysis and trends of blockchain events and IoT automation
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {(['1h', '6h', '24h', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="devices">Device Activity</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          </TabsList>
          
          {/* ========================================
              TRENDS TAB - Time series charts
              ======================================== */}
          <TabsContent value="trends" className="space-y-6">
            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map(metric => (
                <Card key={metric.metric}>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{metric.metric}</CardDescription>
                    <CardTitle className="text-2xl">{metric.current}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : (
                        <Activity className="h-3 w-3 text-gray-500" />
                      )}
                      <span className={
                        metric.trend === 'up' ? 'text-green-500' :
                        metric.trend === 'down' ? 'text-red-500' :
                        'text-gray-500'
                      }>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">vs prev hour</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Transactions Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Activity</CardTitle>
                <CardDescription>Blockchain transactions per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="transactions"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                      name="Transactions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Gas Usage Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gas Usage Trends</CardTitle>
                <CardDescription>Total gas consumed per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gasUsed"
                      stroke={COLORS.warning}
                      strokeWidth={2}
                      name="Gas Used"
                    />
                    <Line
                      type="monotone"
                      dataKey="avgGas"
                      stroke={COLORS.danger}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Avg Gas/TX"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* IoT Actions Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">IoT Automation Activity</CardTitle>
                <CardDescription>Device actions triggered per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="iotActions" fill={COLORS.success} name="IoT Actions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ========================================
              DISTRIBUTION TAB - Event types
              ======================================== */}
          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Event Type Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of blockchain event types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} (${entry.value})`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Event Type List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Statistics</CardTitle>
                  <CardDescription>Detailed breakdown by event type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventTypeData.map(event => {
                      const percentage = filteredEvents.length > 0
                        ? (event.value / filteredEvents.length) * 100
                        : 0;
                      
                      return (
                        <div key={event.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: event.color }}
                            />
                            <span className="text-sm font-medium">{event.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{event.value}</Badge>
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold">{filteredEvents.length}</div>
                    <div className="text-sm text-muted-foreground">Total Transactions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {filteredEvents.reduce((sum, e) => sum + e.events.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Events</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {filteredEvents.reduce((sum, e) => sum + e.iotActions.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">IoT Actions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{eventTypeData.length}</div>
                    <div className="text-sm text-muted-foreground">Event Types</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ========================================
              DEVICE ACTIVITY TAB
              ======================================== */}
          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Activation Frequency</CardTitle>
                <CardDescription>Most frequently triggered IoT devices</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={deviceActivityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="device" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activations" fill={COLORS.cyan} name="Activations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Response Times</CardTitle>
                <CardDescription>Average response time per device</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={deviceActivityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="device" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgResponseTime" fill={COLORS.purple} name="Avg Response (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ========================================
              COST ANALYSIS TAB
              ======================================== */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Gas Used</CardDescription>
                  <CardTitle className="text-3xl">{costAnalysis.totalGasUsed.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">Gas units consumed</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Cost (ETH)</CardDescription>
                  <CardTitle className="text-3xl">{costAnalysis.totalCostEth} Ξ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    @ {costAnalysis.avgGasPrice} Gwei
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Cost (USD)</CardDescription>
                  <CardTitle className="text-3xl">${costAnalysis.totalCostUsd}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    @ ${costAnalysis.ethPrice}/ETH
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">Average Cost per Transaction</div>
                      <div className="text-sm text-muted-foreground">
                        Gas-optimized smart contract operations
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${costAnalysis.avgCostPerTx}</div>
                      <div className="text-xs text-muted-foreground">per TX</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">Estimated Monthly Cost</div>
                      <div className="text-sm text-muted-foreground">
                        Based on current usage patterns
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${(parseFloat(costAnalysis.totalCostUsd) * 30).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">projected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div>
                      <div className="font-semibold">Cost per IoT Action</div>
                      <div className="text-sm text-muted-foreground">
                        Blockchain-triggered automation cost
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${iotActions.length > 0 
                          ? (parseFloat(costAnalysis.totalCostUsd) / iotActions.length).toFixed(4)
                          : '0.0000'
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">per action</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Efficiency Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <div>
                      <div className="font-medium text-sm">Optimized Gas Usage</div>
                      <div className="text-xs text-muted-foreground">
                        Smart contract operations are gas-efficient with average {costAnalysis.avgGasPrice} Gwei
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <div className="font-medium text-sm">Sepolia Testnet</div>
                      <div className="text-xs text-muted-foreground">
                        Currently running on test network - production costs may vary
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <div>
                      <div className="font-medium text-sm">ROI for IoT Automation</div>
                      <div className="text-xs text-muted-foreground">
                        ${iotActions.length > 0 
                          ? (parseFloat(costAnalysis.totalCostUsd) / iotActions.length).toFixed(4)
                          : '0.0000'
                        } per automated action vs manual operation costs
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
