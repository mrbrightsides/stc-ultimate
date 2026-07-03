'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  Download, 
  RefreshCw,
  Activity,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Research Metrics Interfaces
interface ResearchMetrics {
  transactionLatency: number[];
  iotDeviceResponseTimes: number[];
  gasUsagePatterns: number[];
  networkConfirmationTimes: number[];
  userInteractionMetrics: {
    clickToPayTime: number;
    errorRecoveryTime: number;
    completionRate: number;
    abandonmentRate: number;
  };
  blockchainMetrics: {
    averageBlockTime: number;
    gasOptimizationSavings: number;
    networkCongestionImpact: number;
    transactionThroughput: number;
  };
  iotPerformanceMetrics: {
    deviceResponseTime: Record<string, number>;
    authenticationSuccess: Record<string, number>;
    dataTransmissionLatency: Record<string, number>;
    deviceUptimePercentage: Record<string, number>;
  };
  scenarioMetrics: {
    hotelCheckIn: number[];
    roomAccess: number[];
    serviceRequests: number[];
    payment: number[];
    checkOut: number[];
  };
}

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'orange' | 'red';
}

interface ResearchMetricsDashboardProps {
  onExportData?: (data: ResearchMetrics) => void;
  onResetMetrics?: () => void;
  realTimeUpdates?: boolean;
}

const ResearchMetricsDashboard: React.FC<ResearchMetricsDashboardProps> = ({
  onExportData,
  onResetMetrics,
  realTimeUpdates = true
}) => {
  const [metrics, setMetrics] = useState<ResearchMetrics>({
    transactionLatency: [],
    iotDeviceResponseTimes: [],
    gasUsagePatterns: [],
    networkConfirmationTimes: [],
    userInteractionMetrics: {
      clickToPayTime: 0,
      errorRecoveryTime: 0,
      completionRate: 0,
      abandonmentRate: 0
    },
    blockchainMetrics: {
      averageBlockTime: 0,
      gasOptimizationSavings: 0,
      networkCongestionImpact: 0,
      transactionThroughput: 0
    },
    iotPerformanceMetrics: {
      deviceResponseTime: {},
      authenticationSuccess: {},
      dataTransmissionLatency: {},
      deviceUptimePercentage: {}
    },
    scenarioMetrics: {
      hotelCheckIn: [],
      roomAccess: [],
      serviceRequests: [],
      payment: [],
      checkOut: []
    }
  });

  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [activeExperiments, setActiveExperiments] = useState<number>(0);

  // Simulated metrics generation for research
  useEffect(() => {
    if (!realTimeUpdates || !isCollecting) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        transactionLatency: [
          ...prev.transactionLatency.slice(-9), 
          Math.random() * 5000 + 2000
        ],
        iotDeviceResponseTimes: [
          ...prev.iotDeviceResponseTimes.slice(-9),
          Math.random() * 500 + 100
        ],
        gasUsagePatterns: [
          ...prev.gasUsagePatterns.slice(-9),
          Math.random() * 100000 + 50000
        ],
        networkConfirmationTimes: [
          ...prev.networkConfirmationTimes.slice(-9),
          Math.random() * 3000 + 1000
        ],
        userInteractionMetrics: {
          clickToPayTime: Math.random() * 2000 + 500,
          errorRecoveryTime: Math.random() * 5000 + 1000,
          completionRate: Math.random() * 20 + 75,
          abandonmentRate: Math.random() * 10 + 5
        },
        blockchainMetrics: {
          averageBlockTime: Math.random() * 5 + 12,
          gasOptimizationSavings: Math.random() * 30 + 10,
          networkCongestionImpact: Math.random() * 40 + 20,
          transactionThroughput: Math.random() * 50 + 100
        }
      }));

      setTotalSessions(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);

    return () => clearInterval(interval);
  }, [realTimeUpdates, isCollecting]);

  // Calculate average values for display
  const avgTransactionLatency = metrics.transactionLatency.length > 0 
    ? Math.round(metrics.transactionLatency.reduce((a, b) => a + b, 0) / metrics.transactionLatency.length)
    : 0;

  const avgIoTResponse = metrics.iotDeviceResponseTimes.length > 0
    ? Math.round(metrics.iotDeviceResponseTimes.reduce((a, b) => a + b, 0) / metrics.iotDeviceResponseTimes.length)
    : 0;

  const avgGasUsage = metrics.gasUsagePatterns.length > 0
    ? Math.round(metrics.gasUsagePatterns.reduce((a, b) => a + b, 0) / metrics.gasUsagePatterns.length)
    : 0;

  const metricCards: MetricCard[] = [
    {
      id: 'transaction-latency',
      title: 'Avg Transaction Latency',
      value: `${avgTransactionLatency}ms`,
      change: '+2.3%',
      icon: <Clock className="h-4 w-4" />,
      color: 'blue'
    },
    {
      id: 'iot-response',
      title: 'IoT Device Response',
      value: `${avgIoTResponse}ms`,
      change: '-1.8%',
      icon: <Activity className="h-4 w-4" />,
      color: 'green'
    },
    {
      id: 'gas-efficiency',
      title: 'Gas Usage Avg',
      value: `${avgGasUsage}`,
      change: '-12.4%',
      icon: <Zap className="h-4 w-4" />,
      color: 'orange'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: `${metrics.userInteractionMetrics.completionRate.toFixed(1)}%`,
      change: '+5.2%',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'green'
    }
  ];

  const handleStartCollection = (): void => {
    setIsCollecting(true);
    setActiveExperiments(prev => prev + 1);
  };

  const handleStopCollection = (): void => {
    setIsCollecting(false);
  };

  const handleExportData = (): void => {
    const dataToExport = {
      ...metrics,
      metadata: {
        totalSessions,
        activeExperiments,
        collectionTimestamp: new Date().toISOString(),
        avgTransactionLatency,
        avgIoTResponse,
        avgGasUsage
      }
    };

    if (onExportData) {
      onExportData(dataToExport as ResearchMetrics);
    }

    // Create downloadable JSON file
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `stc-research-metrics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleResetMetrics = (): void => {
    setMetrics({
      transactionLatency: [],
      iotDeviceResponseTimes: [],
      gasUsagePatterns: [],
      networkConfirmationTimes: [],
      userInteractionMetrics: {
        clickToPayTime: 0,
        errorRecoveryTime: 0,
        completionRate: 0,
        abandonmentRate: 0
      },
      blockchainMetrics: {
        averageBlockTime: 0,
        gasOptimizationSavings: 0,
        networkCongestionImpact: 0,
        transactionThroughput: 0
      },
      iotPerformanceMetrics: {
        deviceResponseTime: {},
        authenticationSuccess: {},
        dataTransmissionLatency: {},
        deviceUptimePercentage: {}
      },
      scenarioMetrics: {
        hotelCheckIn: [],
        roomAccess: [],
        serviceRequests: [],
        payment: [],
        checkOut: []
      }
    });
    setTotalSessions(0);
    setActiveExperiments(0);
    
    if (onResetMetrics) {
      onResetMetrics();
    }
  };

  return (
    <div className="space-y-6 p-6 bg-black/20 rounded-lg border border-neon-blue/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-blue mb-1">Research Metrics Dashboard</h2>
          <p className="text-gray-400">Real-time data collection for dissertation research</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={isCollecting ? handleStopCollection : handleStartCollection}
            variant={isCollecting ? "destructive" : "default"}
            size="sm"
            className={isCollecting 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-neon-green hover:bg-neon-green/80"
            }
          >
            {isCollecting ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Stop Collection
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Start Collection
              </>
            )}
          </Button>
          
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="border-neon-blue/50 hover:bg-neon-blue/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={handleResetMetrics}
            variant="outline"
            size="sm"
            className="border-orange-500/50 hover:bg-orange-500/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-green">{totalSessions}</div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-blue">{activeExperiments}</div>
          <div className="text-sm text-gray-400">Active Experiments</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{metrics.transactionLatency.length}</div>
          <div className="text-sm text-gray-400">Data Points</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${isCollecting ? 'text-green-400' : 'text-red-400'}`}>
            {isCollecting ? 'LIVE' : 'PAUSED'}
          </div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <Card key={card.id} className="bg-black/40 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`text-${card.color}-400`}>
                  {card.icon}
                </div>
                <Badge 
                  variant={card.change.startsWith('+') ? 'default' : 'secondary'}
                  className={`text-xs ${
                    card.change.startsWith('+') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {card.change}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-gray-400">
                  {card.title}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Latency Chart */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-blue flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Transaction Latency Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              {metrics.transactionLatency.length > 0 ? (
                <div className="w-full">
                  <div className="flex justify-around items-end h-40 gap-1 px-2">
                    {metrics.transactionLatency.slice(-10).map((latency, index) => {
                      const maxHeight = 160; // 40 * 4 = 160px (h-40 = 10rem = 160px)
                      const barHeightPx = Math.max((latency / 7000) * maxHeight, 12);
                      return (
                        <div
                          key={`lat-${Date.now()}-${index}-${latency}`}
                          className="bg-cyan-500 hover:bg-cyan-400 rounded-t transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/50"
                          style={{
                            height: `${barHeightPx}px`,
                            width: '8%',
                            maxWidth: '40px'
                          }}
                          title={`${latency.toFixed(0)}ms`}
                        />
                      );
                    })}
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-400">
                    Last 10 measurements (hover for values)
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No data available - Start Collection to begin</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* IoT Performance Chart */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-green flex items-center gap-2">
              <Activity className="h-5 w-5" />
              IoT Device Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              {metrics.iotDeviceResponseTimes.length > 0 ? (
                <div className="w-full">
                  <div className="flex justify-around items-end h-40 gap-1 px-2">
                    {metrics.iotDeviceResponseTimes.slice(-10).map((time, index) => {
                      const maxHeight = 160; // 40 * 4 = 160px (h-40 = 10rem = 160px)
                      const barHeightPx = Math.max((time / 600) * maxHeight, 12);
                      return (
                        <div
                          key={`iot-${Date.now()}-${index}-${time}`}
                          className="bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/50"
                          style={{
                            height: `${barHeightPx}px`,
                            width: '8%',
                            maxWidth: '40px'
                          }}
                          title={`${time.toFixed(0)}ms`}
                        />
                      );
                    })}
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-400">
                    Response times (hover for values)
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No data available - Start Collection to begin</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Interaction Metrics */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-400">User Interaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{metrics.userInteractionMetrics.completionRate.toFixed(1)}%</span>
              </div>
              <Progress 
                value={metrics.userInteractionMetrics.completionRate} 
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm">
                <span>Error Recovery</span>
                <span>{metrics.userInteractionMetrics.errorRecoveryTime.toFixed(0)}ms</span>
              </div>
              <Progress 
                value={Math.min(100, (metrics.userInteractionMetrics.errorRecoveryTime / 6000) * 100)} 
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Metrics */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Blockchain Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Block Time</span>
                <span>{metrics.blockchainMetrics.averageBlockTime.toFixed(1)}s</span>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Gas Savings</span>
                <span>{metrics.blockchainMetrics.gasOptimizationSavings.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Throughput</span>
                <span>{metrics.blockchainMetrics.transactionThroughput.toFixed(0)} TPS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Status */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-blue">Research Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Data Quality</span>
              <Badge className="bg-green-500/20 text-green-400">Excellent</Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Sample Size</span>
              <span className="text-neon-blue">{metrics.transactionLatency.length}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Collection Status</span>
              <Badge className={isCollecting ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                {isCollecting ? 'Active' : 'Paused'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResearchMetricsDashboard;