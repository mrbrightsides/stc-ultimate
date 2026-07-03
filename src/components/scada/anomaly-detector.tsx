'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle,
  XCircle,
  Shield,
  TrendingDown,
  Copy,
  WifiOff,
  Activity,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface Anomaly {
  id: string;
  timestamp: number;
  type: 'duplicate_trigger' | 'device_offline' | 'transaction_failed' | 'unusual_pattern' | 'security_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedDevices: string[];
  suggestedAction: string;
  resolved: boolean;
  autoResolved: boolean;
}

export function AnomalyDetector() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: 'anom-001',
      timestamp: Date.now() - 120000,
      type: 'duplicate_trigger',
      severity: 'medium',
      title: 'Duplicate RFID Trigger Detected',
      description: 'RFID-001 sent identical check-in event 3 times within 2 seconds',
      affectedDevices: ['RFID-001'],
      suggestedAction: 'Review device firmware and implement debounce mechanism',
      resolved: false,
      autoResolved: false
    },
    {
      id: 'anom-002',
      timestamp: Date.now() - 300000,
      type: 'device_offline',
      severity: 'high',
      title: 'Critical Device Offline',
      description: 'Main gateway has been offline for 5 minutes. 12 devices affected.',
      affectedDevices: ['GATEWAY-001', 'CAM-001', 'CAM-002', 'RFID-001'],
      suggestedAction: 'Check network connectivity and restart gateway',
      resolved: false,
      autoResolved: false
    },
    {
      id: 'anom-003',
      timestamp: Date.now() - 600000,
      type: 'transaction_failed',
      severity: 'critical',
      title: 'Blockchain Transaction Failure',
      description: 'Payment transaction failed due to insufficient gas. Guest payment pending.',
      affectedDevices: ['PAYMENT-GATEWAY'],
      suggestedAction: 'Increase gas limit and retry transaction',
      resolved: true,
      autoResolved: false
    },
    {
      id: 'anom-004',
      timestamp: Date.now() - 900000,
      type: 'unusual_pattern',
      severity: 'low',
      title: 'Unusual Temperature Pattern',
      description: 'HVAC temperature readings showing irregular fluctuations',
      affectedDevices: ['HVAC-003'],
      suggestedAction: 'Schedule maintenance check for HVAC unit',
      resolved: true,
      autoResolved: true
    }
  ]);

  const [showResolved, setShowResolved] = useState<boolean>(false);

  // Simulate anomaly detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const anomalyTypes: Anomaly['type'][] = [
          'duplicate_trigger',
          'device_offline',
          'transaction_failed',
          'unusual_pattern',
          'security_breach'
        ];

        const severities: Anomaly['severity'][] = ['low', 'medium', 'high', 'critical'];
        
        const titles: Record<Anomaly['type'], string> = {
          duplicate_trigger: 'Duplicate Trigger Event',
          device_offline: 'Device Connection Lost',
          transaction_failed: 'Transaction Execution Failed',
          unusual_pattern: 'Unusual Activity Pattern',
          security_breach: 'Security Alert'
        };

        const randomType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        
        const newAnomaly: Anomaly = {
          id: `anom-${Date.now()}`,
          timestamp: Date.now(),
          type: randomType,
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: titles[randomType],
          description: `Automated detection: ${titles[randomType].toLowerCase()} at ${new Date().toLocaleTimeString()}`,
          affectedDevices: [`DEV-${Math.floor(Math.random() * 100)}`],
          suggestedAction: 'Investigate and take corrective action',
          resolved: false,
          autoResolved: false
        };

        setAnomalies(prev => [newAnomaly, ...prev].slice(0, 20));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleResolve = (anomalyId: string): void => {
    setAnomalies(prev =>
      prev.map(a =>
        a.id === anomalyId ? { ...a, resolved: true } : a
      )
    );
  };

  const getAnomalyIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      duplicate_trigger: <Copy className="h-5 w-5 text-yellow-400" />,
      device_offline: <WifiOff className="h-5 w-5 text-red-400" />,
      transaction_failed: <XCircle className="h-5 w-5 text-red-400" />,
      unusual_pattern: <TrendingDown className="h-5 w-5 text-orange-400" />,
      security_breach: <Shield className="h-5 w-5 text-red-400" />
    };
    return iconMap[type] || <AlertTriangle className="h-5 w-5" />;
  };

  const getSeverityColor = (severity: string): string => {
    const colorMap: Record<string, string> = {
      low: 'border-blue-500/30 bg-blue-500/10',
      medium: 'border-yellow-500/30 bg-yellow-500/10',
      high: 'border-orange-500/30 bg-orange-500/10',
      critical: 'border-red-500/30 bg-red-500/10'
    };
    return colorMap[severity] || 'border-gray-500/30 bg-gray-500/10';
  };

  const getSeverityBadge = (severity: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      critical: 'destructive'
    };
    return <Badge variant={variantMap[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const displayedAnomalies = showResolved 
    ? anomalies 
    : anomalies.filter(a => !a.resolved);

  const activeAnomalies = anomalies.filter(a => !a.resolved);
  const criticalAnomalies = activeAnomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = activeAnomalies.filter(a => a.severity === 'high').length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-400">{criticalAnomalies}</p>
                <p className="text-xs text-gray-500">Critical Alerts</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-400">{highAnomalies}</p>
                <p className="text-xs text-gray-500">High Priority</p>
              </div>
              <Bell className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{activeAnomalies.length}</p>
                <p className="text-xs text-gray-500">Active Issues</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{anomalies.filter(a => a.resolved).length}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Critical Alerts */}
      {criticalAnomalies > 0 && (
        <Alert variant="destructive" className="border-red-500">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Critical System Alerts</AlertTitle>
          <AlertDescription>
            {criticalAnomalies} critical {criticalAnomalies === 1 ? 'issue' : 'issues'} require immediate attention. 
            Review and resolve to maintain system integrity.
          </AlertDescription>
        </Alert>
      )}

      {/* Anomaly Detection Panel */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                Anomaly Detection System
              </CardTitle>
              <CardDescription>
                AI-powered detection of duplicate triggers, device failures, and unusual patterns
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant={showResolved ? 'default' : 'outline'}
              onClick={() => setShowResolved(!showResolved)}
            >
              {showResolved ? 'Hide' : 'Show'} Resolved
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {displayedAnomalies.map((anomaly) => (
                <Card 
                  key={anomaly.id}
                  className={`${getSeverityColor(anomaly.severity)} border ${
                    anomaly.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getAnomalyIcon(anomaly.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-white">{anomaly.title}</span>
                            {getSeverityBadge(anomaly.severity)}
                            {anomaly.resolved && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                Resolved {anomaly.autoResolved && '(Auto)'}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">{anomaly.description}</p>

                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Affected Devices:</p>
                            <div className="flex flex-wrap gap-1">
                              {anomaly.affectedDevices.map((device) => (
                                <Badge key={device} variant="outline" className="text-xs">
                                  {device}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Alert className="mb-3 bg-gray-800/50 border-cyan-500/30">
                            <Activity className="h-4 w-4" />
                            <AlertTitle className="text-sm">Suggested Action</AlertTitle>
                            <AlertDescription className="text-xs">
                              {anomaly.suggestedAction}
                            </AlertDescription>
                          </Alert>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Detected: {new Date(anomaly.timestamp).toLocaleString()}
                            </span>
                            {!anomaly.resolved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolve(anomaly.id)}
                                className="text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
