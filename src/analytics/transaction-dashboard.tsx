'use client';

import { useState, useEffect } from 'react';
import { analyticsEngine, type TransactionMetrics } from '@/lib/transaction-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  Clock,
  BarChart3,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function TransactionDashboard() {
  const [metrics, setMetrics] = useState<TransactionMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);

  // Load metrics on mount and set up auto-refresh
  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = () => {
    setIsRefreshing(true);
    try {
      const data = analyticsEngine.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    const data = analyticsEngine.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stc-analytics-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!metrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const kpis = analyticsEngine.getKPIs();
  const timeSeries = analyticsEngine.getTimeSeriesData(selectedPeriod);
  const costComparison = analyticsEngine.getCostComparison();
  const hourlyDist = analyticsEngine.getHourlyDistribution();

  // Format time series data for charts
  const volumeChartData = timeSeries.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: d.volume,
    count: d.transactionCount,
  }));

  const successRateChartData = timeSeries.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    successRate: d.successRate,
  }));

  const costComparisonData = [
    { name: 'Traditional', value: costComparison.traditional.cost, label: `$${costComparison.traditional.cost.toFixed(2)}` },
    { name: 'Blockchain', value: costComparison.blockchain.cost, label: `$${costComparison.blockchain.cost.toFixed(2)}` },
  ];

  const serviceBreakdownData = metrics.serviceBreakdown.slice(0, 5).map(s => ({
    name: s.serviceName,
    transactions: s.transactionCount,
    volume: parseFloat(s.totalVolume),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transaction Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive blockchain transaction insights and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadMetrics} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.transactionVolume.value}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalTransactions} transactions
            </p>
            <Badge variant="default" className="mt-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {kpis.transactionVolume.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.successRate.value}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.confirmedCount} confirmed, {metrics.failedCount} failed
            </p>
            <Badge variant="default" className="mt-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {kpis.successRate.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.costSavings.value}</div>
            <p className="text-xs text-muted-foreground">vs traditional methods</p>
            <Badge variant="default" className="mt-2 text-xs bg-green-500">
              {kpis.costSavings.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IoT Actions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.iotIntegration.value}</div>
            <p className="text-xs text-muted-foreground">automated triggers</p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {kpis.iotIntegration.trend}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="success">Success Rate</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Volume Chart */}
        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume Over Time</CardTitle>
              <CardDescription>
                Total ETH volume and transaction count
                <div className="flex gap-2 mt-2">
                  {[7, 14, 30].map(days => (
                    <Button
                      key={days}
                      variant={selectedPeriod === days ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(days as 7 | 14 | 30)}
                    >
                      {days} days
                    </Button>
                  ))}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="volume"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Volume (ETH)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Transaction Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Rate Chart */}
        <TabsContent value="success" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Trend</CardTitle>
                <CardDescription>Daily transaction success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={successRateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Success Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
                <CardDescription>Transactions by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyDist}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cost Analysis */}
        <TabsContent value="cost" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison</CardTitle>
                <CardDescription>Blockchain vs Traditional Processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Cost (USD)">
                      {costComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed savings analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Traditional Processing</span>
                    <span className="text-sm font-medium">${costComparison.traditional.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Blockchain Gas Fees</span>
                    <span className="text-sm font-medium">${costComparison.blockchain.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-semibold">Total Savings</span>
                    <span className="text-sm font-semibold text-green-600">
                      ${costComparison.savings.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Savings Percentage</span>
                    <Badge variant="default" className="bg-green-500">
                      {costComparison.savings.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>Key Insight:</strong> Blockchain transactions save{' '}
                    {costComparison.savings.percentage.toFixed(1)}% compared to traditional 
                    payment processors (Stripe, PayPal) which charge 2.9% + $0.30 per transaction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Breakdown */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Breakdown</CardTitle>
              <CardDescription>Transaction distribution by service type</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceBreakdownData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={serviceBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="transactions"
                      fill="#3b82f6"
                      name="Transactions"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="volume"
                      fill="#10b981"
                      name="Volume (ETH)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
                    <p className="text-sm">No service data available yet</p>
                    <p className="text-xs">Complete some transactions to see analytics</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Details Table */}
          {metrics.serviceBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Service Metrics</CardTitle>
                <CardDescription>Complete breakdown of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Service</th>
                        <th className="text-right py-2">Transactions</th>
                        <th className="text-right py-2">Volume (ETH)</th>
                        <th className="text-right py-2">Avg Amount</th>
                        <th className="text-right py-2">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.serviceBreakdown.map((service, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{service.serviceName}</td>
                          <td className="text-right">{service.transactionCount}</td>
                          <td className="text-right">{service.totalVolume}</td>
                          <td className="text-right">{service.avgAmount}</td>
                          <td className="text-right">
                            <Badge
                              variant={service.successRate >= 90 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {service.successRate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Gas Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{metrics.avgGasPerTx}</p>
              <p className="text-xs text-muted-foreground">avg gas per transaction</p>
              <p className="text-xs text-muted-foreground">
                Total: {parseInt(metrics.totalGasUsed).toLocaleString()} gas used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{metrics.avgConfirmationTime}s</p>
              <p className="text-xs text-muted-foreground">avg confirmation time</p>
              <p className="text-xs text-muted-foreground">
                {metrics.transactionsPerHour} tx/hour
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Token Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{metrics.tokenTransactions}</p>
              <p className="text-xs text-muted-foreground">STC token transactions</p>
              <p className="text-xs text-muted-foreground">
                Volume: {metrics.tokenVolume} STC
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
