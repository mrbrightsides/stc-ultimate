'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  FileSpreadsheet,
  Settings,
  Play,
  Pause,
  Square,
  RefreshCw
} from 'lucide-react';

// Measurement Data Types
export interface MeasurementPoint {
  id: string;
  timestamp: Date;
  category: 'iot' | 'blockchain' | 'user-interaction' | 'system-performance';
  subcategory: string;
  value: number;
  unit: string;
  metadata: Record<string, any>;
  sessionId: string;
  scenarioId?: string;
  serviceId?: string;
}

export interface MeasurementSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'completed';
  totalMeasurements: number;
  categories: string[];
  description?: string;
}

export interface DataExportFormat {
  format: 'csv' | 'json' | 'excel';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
}

interface MeasurementCollectionSystemProps {
  onMeasurementCollected?: (measurement: MeasurementPoint) => void;
  onSessionComplete?: (session: MeasurementSession, data: MeasurementPoint[]) => void;
  autoStart?: boolean;
  collectionInterval?: number; // milliseconds
}

const MeasurementCollectionSystem: React.FC<MeasurementCollectionSystemProps> = ({
  onMeasurementCollected,
  onSessionComplete,
  autoStart = false,
  collectionInterval = 1000
}) => {
  const [currentSession, setCurrentSession] = useState<MeasurementSession | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementPoint[]>([]);
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [collectionStats, setCollectionStats] = useState({
    totalMeasurements: 0,
    measurementsPerMinute: 0,
    dataQualityScore: 100,
    storageUsed: 0 // MB
  });

  // Measurement categories configuration
  const measurementCategories = {
    iot: {
      name: 'IoT Device Performance',
      subcategories: [
        'device_response_time',
        'authentication_success_rate', 
        'signal_strength',
        'battery_level',
        'data_transmission_latency',
        'device_availability'
      ],
      units: ['ms', '%', 'dBm', '%', 'ms', 'boolean'],
      color: 'text-blue-400'
    },
    blockchain: {
      name: 'Blockchain Metrics',
      subcategories: [
        'transaction_confirmation_time',
        'gas_usage',
        'block_time',
        'network_congestion',
        'transaction_success_rate',
        'smart_contract_execution_time'
      ],
      units: ['ms', 'wei', 'seconds', '%', '%', 'ms'],
      color: 'text-green-400'
    },
    'user-interaction': {
      name: 'User Experience',
      subcategories: [
        'click_to_response_time',
        'error_recovery_time',
        'task_completion_time',
        'user_satisfaction_score',
        'abandonment_rate',
        'retry_attempts'
      ],
      units: ['ms', 'ms', 'ms', 'score', '%', 'count'],
      color: 'text-orange-400'
    },
    'system-performance': {
      name: 'System Performance',
      subcategories: [
        'cpu_usage',
        'memory_consumption',
        'network_latency',
        'api_response_time',
        'database_query_time',
        'cache_hit_rate'
      ],
      units: ['%', 'MB', 'ms', 'ms', 'ms', '%'],
      color: 'text-purple-400'
    }
  };

  // Auto-start collection
  useEffect(() => {
    if (autoStart && !isCollecting) {
      handleStartSession('Auto-Collection Session');
    }
  }, [autoStart]);

  // Data collection interval
  useEffect(() => {
    if (!isCollecting || !currentSession) return;

    const interval = setInterval(() => {
      collectSimulatedMeasurement();
    }, collectionInterval);

    return () => clearInterval(interval);
  }, [isCollecting, currentSession, collectionInterval]);

  // Update statistics
  useEffect(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentMeasurements = measurementData.filter(
      m => m.timestamp.getTime() > oneMinuteAgo
    );

    setCollectionStats(prev => ({
      ...prev,
      totalMeasurements: measurementData.length,
      measurementsPerMinute: recentMeasurements.length,
      storageUsed: parseFloat((measurementData.length * 0.001).toFixed(2)) // Estimate
    }));
  }, [measurementData]);

  const collectSimulatedMeasurement = (): void => {
    if (!currentSession) return;

    const categories = Object.keys(measurementCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)] as keyof typeof measurementCategories;
    const categoryConfig = measurementCategories[randomCategory];
    const randomSubcategory = categoryConfig.subcategories[
      Math.floor(Math.random() * categoryConfig.subcategories.length)
    ];

    let value: number;
    let unit: string;

    // Generate realistic values based on subcategory
    switch (randomSubcategory) {
      case 'device_response_time':
      case 'data_transmission_latency':
        value = Math.random() * 500 + 50; // 50-550ms
        unit = 'ms';
        break;
      case 'authentication_success_rate':
      case 'device_availability':
      case 'transaction_success_rate':
        value = Math.random() * 10 + 90; // 90-100%
        unit = '%';
        break;
      case 'signal_strength':
        value = Math.random() * 40 + 60; // 60-100%
        unit = 'dBm';
        break;
      case 'battery_level':
        value = Math.random() * 50 + 50; // 50-100%
        unit = '%';
        break;
      case 'gas_usage':
        value = Math.random() * 100000 + 50000; // 50k-150k wei
        unit = 'wei';
        break;
      case 'block_time':
        value = Math.random() * 5 + 12; // 12-17 seconds
        unit = 'seconds';
        break;
      case 'user_satisfaction_score':
        value = Math.random() * 20 + 75; // 75-95 score
        unit = 'score';
        break;
      case 'cpu_usage':
      case 'memory_consumption':
        value = Math.random() * 30 + 20; // 20-50%
        unit = '%';
        break;
      default:
        value = Math.random() * 1000;
        unit = 'ms';
    }

    const measurement: MeasurementPoint = {
      id: `meas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      category: randomCategory,
      subcategory: randomSubcategory,
      value: parseFloat(value.toFixed(2)),
      unit,
      metadata: {
        sessionId: currentSession.id,
        collectionMethod: 'automated',
        deviceType: randomCategory === 'iot' ? 'sensor' : 'system',
        reliability: Math.random() * 0.2 + 0.8 // 0.8-1.0
      },
      sessionId: currentSession.id
    };

    setMeasurementData(prev => [...prev, measurement]);

    // Callback
    if (onMeasurementCollected) {
      onMeasurementCollected(measurement);
    }
  };

  const handleStartSession = (name: string): void => {
    if (isCollecting) return;

    const session: MeasurementSession = {
      id: `session_${Date.now()}`,
      name: name || `Session ${new Date().toLocaleString()}`,
      startTime: new Date(),
      status: 'active',
      totalMeasurements: 0,
      categories: Object.keys(measurementCategories),
      description: 'Automated data collection for dissertation research'
    };

    setCurrentSession(session);
    setIsCollecting(true);
    setMeasurementData([]); // Clear previous data
  };

  const handlePauseSession = (): void => {
    setIsCollecting(false);
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null);
    }
  };

  const handleResumeSession = (): void => {
    setIsCollecting(true);
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'active' } : null);
    }
  };

  const handleStopSession = (): void => {
    if (!currentSession) return;

    const completedSession: MeasurementSession = {
      ...currentSession,
      endTime: new Date(),
      status: 'completed',
      totalMeasurements: measurementData.length
    };

    setCurrentSession(null);
    setIsCollecting(false);

    // Callback
    if (onSessionComplete) {
      onSessionComplete(completedSession, measurementData);
    }
  };

  const handleExportData = (format: DataExportFormat['format']): void => {
    const exportData = {
      session: currentSession,
      measurements: measurementData,
      statistics: collectionStats,
      exportTimestamp: new Date().toISOString(),
      format
    };

    let dataStr: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        dataStr = JSON.stringify(exportData, null, 2);
        filename = `measurement-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        const csvHeader = 'timestamp,category,subcategory,value,unit,sessionId\n';
        const csvData = measurementData.map(m => 
          `${m.timestamp.toISOString()},${m.category},${m.subcategory},${m.value},${m.unit},${m.sessionId}`
        ).join('\n');
        dataStr = csvHeader + csvData;
        filename = `measurement-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        return;
    }

    const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(dataStr)}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  const getCategoryStats = (category: keyof typeof measurementCategories) => {
    const categoryMeasurements = measurementData.filter(m => m.category === category);
    const recent = categoryMeasurements.filter(m => 
      Date.now() - m.timestamp.getTime() < 60000 // Last minute
    );

    return {
      total: categoryMeasurements.length,
      recent: recent.length,
      avgValue: categoryMeasurements.length > 0 
        ? categoryMeasurements.reduce((sum, m) => sum + m.value, 0) / categoryMeasurements.length
        : 0,
      trend: recent.length > categoryMeasurements.length * 0.1 ? 'up' : 'down'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-neon-blue mb-1">Data Collection System</h3>
          <p className="text-gray-400">
            Real-time measurement collection for research analysis
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isCollecting ? (
            <Button
              onClick={() => handleStartSession(`Session ${Date.now()}`)}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Collection
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePauseSession}
                variant="outline"
                size="sm"
                className="border-orange-500/50 hover:bg-orange-500/10"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleStopSession}
                variant="outline"
                size="sm"
                className="border-red-500/50 hover:bg-red-500/10"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
          
          {currentSession?.status === 'paused' && (
            <Button
              onClick={handleResumeSession}
              className="bg-neon-blue hover:bg-neon-blue/80 text-black"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Session Status */}
      {currentSession && (
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-blue flex items-center gap-2">
              <Database className="h-5 w-5" />
              Active Session: {currentSession.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">
                  {collectionStats.totalMeasurements}
                </div>
                <div className="text-sm text-gray-400">Total Measurements</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">
                  {collectionStats.measurementsPerMinute}
                </div>
                <div className="text-sm text-gray-400">Per Minute</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {collectionStats.dataQualityScore}%
                </div>
                <div className="text-sm text-gray-400">Data Quality</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {collectionStats.storageUsed}MB
                </div>
                <div className="text-sm text-gray-400">Storage Used</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Collection Progress</span>
                <Badge 
                  variant={currentSession.status === 'active' ? 'default' : 'secondary'}
                  className={
                    currentSession.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }
                >
                  {currentSession.status.toUpperCase()}
                </Badge>
              </div>
              {isCollecting && (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">Collecting data...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(measurementCategories).map(([category, config]) => {
          const stats = getCategoryStats(category as keyof typeof measurementCategories);
          
          return (
            <Card key={category} className="bg-black/40 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={config.color}>
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className={`text-xs ${config.color} border-current/30`}>
                    {category.toUpperCase().replace('-', ' ')}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">{config.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">Total</div>
                      <div className={config.color}>{stats.total}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Recent</div>
                      <div className={config.color}>{stats.recent}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg Value</div>
                      <div className={config.color}>{stats.avgValue.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Trend</div>
                      <div className={stats.trend === 'up' ? 'text-green-400' : 'text-orange-400'}>
                        {stats.trend === 'up' ? '↗' : '↘'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Controls */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-neon-blue flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Data Export & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleExportData('json')}
              variant="outline"
              size="sm"
              className="border-neon-green/50 hover:bg-neon-green/10"
              disabled={measurementData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            
            <Button
              onClick={() => handleExportData('csv')}
              variant="outline"
              size="sm"
              className="border-neon-blue/50 hover:bg-neon-blue/10"
              disabled={measurementData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
              <Database className="h-4 w-4" />
              {measurementData.length} data points ready for export
            </div>
          </div>
          
          {measurementData.length > 0 && (
            <div className="mt-4 p-3 bg-black/60 rounded-lg border border-gray-700">
              <h5 className="font-semibold text-white mb-2">Recent Measurements Preview</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {measurementData.slice(-5).map((measurement, index) => (
                  <div key={measurement.id} className="text-xs text-gray-300">
                    [{measurement.timestamp.toLocaleTimeString()}] {measurement.category}.{measurement.subcategory}: {measurement.value} {measurement.unit}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeasurementCollectionSystem;