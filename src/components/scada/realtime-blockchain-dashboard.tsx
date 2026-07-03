'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Webhook,
  Copy,
  Check,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';
import { WebhookNotifier, testWebhookConnection } from '@/lib/webhook-notifier';
import { toast } from 'sonner';

// ========================================
// REAL-TIME BLOCKCHAIN → IoT DASHBOARD
// Live monitoring of blockchain → IoT flow with webhook config
// ========================================

export default function RealtimeBlockchainDashboard() {
  const { events, iotActions, stats } = useBlockchainEvents();
  
  // Webhook configuration
  const [webhookConfig, setWebhookConfig] = useState(WebhookNotifier.getConfig());
  const [webhookStats, setWebhookStats] = useState(WebhookNotifier.getStats());
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Real-time metrics
  const [liveMetrics, setLiveMetrics] = useState({
    transactionsPerMinute: 0,
    iotActionsPerMinute: 0,
    avgResponseTime: 0,
    successRate: 100,
  });
  
  // Update webhook stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setWebhookStats(WebhookNotifier.getStats());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate live metrics
  useEffect(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentEvents = events.filter(e => e.timestamp > oneMinuteAgo);
    const recentActions = iotActions.filter(a => a.triggeredAt > oneMinuteAgo);
    
    setLiveMetrics({
      transactionsPerMinute: recentEvents.length,
      iotActionsPerMinute: recentActions.length,
      avgResponseTime: recentEvents.length > 0
        ? recentEvents.reduce((sum, e) => sum + (e.timestamp - e.blockTimestamp * 1000), 0) / recentEvents.length
        : 0,
      successRate: events.length > 0
        ? (events.filter(e => e.status === 'confirmed').length / events.length) * 100
        : 100,
    });
  }, [events, iotActions]);
  
  // Save webhook config
  const handleSaveWebhook = () => {
    WebhookNotifier.saveConfig(webhookConfig);
    toast.success('Webhook Configuration Saved', {
      description: 'Your webhook settings have been updated.',
    });
  };
  
  // Test webhook connection
  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    
    try {
      const result = await testWebhookConnection(webhookConfig.url);
      
      if (result.success) {
        toast.success('Webhook Connection Successful', {
          description: result.message,
        });
      } else {
        toast.error('Webhook Connection Failed', {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error('Webhook Test Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setTestingWebhook(false);
    }
  };
  
  // Copy API key
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('stc_live_api_key_2024_example_7x9k');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-time Blockchain → IoT Dashboard
        </CardTitle>
        <CardDescription>
          Live monitoring and webhook configuration for blockchain-IoT integration
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Config</TabsTrigger>
            <TabsTrigger value="logs">Webhook Logs</TabsTrigger>
          </TabsList>
          
          {/* Live Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transactions per minute */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Transactions/min</CardDescription>
                  <CardTitle className="text-3xl">{liveMetrics.transactionsPerMinute}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    Real-time blockchain activity
                  </div>
                </CardContent>
              </Card>
              
              {/* IoT Actions per minute */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>IoT Actions/min</CardDescription>
                  <CardTitle className="text-3xl">{liveMetrics.iotActionsPerMinute}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                    Automated device triggers
                  </div>
                </CardContent>
              </Card>
              
              {/* Success Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Success Rate</CardDescription>
                  <CardTitle className="text-3xl">{liveMetrics.successRate.toFixed(1)}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                    Transaction reliability
                  </div>
                </CardContent>
              </Card>
              
              {/* Avg Response Time */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Response</CardDescription>
                  <CardTitle className="text-3xl">{liveMetrics.avgResponseTime.toFixed(0)}ms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Activity className="h-3 w-3 mr-1 text-blue-500" />
                    Event processing speed
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Overall Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                    <div className="text-xs text-muted-foreground">Total Transactions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <div className="text-xs text-muted-foreground">Blockchain Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalIoTActions}</div>
                    <div className="text-xs text-muted-foreground">IoT Actions Triggered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.avgGasPerTx}</div>
                    <div className="text-xs text-muted-foreground">Avg Gas per TX</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Webhook Configuration Tab */}
          <TabsContent value="webhook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription>
                  Configure webhooks to receive real-time notifications about blockchain events and IoT actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Webhooks</Label>
                    <div className="text-xs text-muted-foreground">
                      Receive real-time notifications
                    </div>
                  </div>
                  <Switch
                    checked={webhookConfig.enabled}
                    onCheckedChange={(checked: boolean) =>
                      setWebhookConfig({ ...webhookConfig, enabled: checked })
                    }
                  />
                </div>
                
                {/* Webhook URL */}
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={webhookConfig.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setWebhookConfig({ ...webhookConfig, url: e.target.value })
                      }
                      placeholder="https://your-server.com/webhook"
                    />
                    <Button
                      variant="outline"
                      onClick={handleTestWebhook}
                      disabled={testingWebhook}
                    >
                      {testingWebhook ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    POST requests will be sent to this URL
                  </div>
                </div>
                
                {/* API Key */}
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value="stc_live_api_key_2024_example_7x9k"
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyApiKey}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Include this in X-API-Key header
                  </div>
                </div>
                
                {/* Save Button */}
                <Button onClick={handleSaveWebhook} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                
                {/* Webhook Stats */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Webhook Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{webhookStats.success}</div>
                      <div className="text-xs text-muted-foreground">Success</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">{webhookStats.failed}</div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{webhookStats.successRate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Webhook Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Webhook Logs</CardTitle>
                    <CardDescription>Recent webhook delivery attempts</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      WebhookNotifier.clearLogs();
                      setWebhookStats(WebhookNotifier.getStats());
                    }}
                  >
                    Clear Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {WebhookNotifier.getLogs().length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Webhook className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No webhook logs yet</p>
                    </div>
                  ) : (
                    WebhookNotifier.getLogs().map(log => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                log.status === 'success'
                                  ? 'default'
                                  : log.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {log.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {log.payload.event}
                            </span>
                          </div>
                          <div className="text-sm font-mono text-muted-foreground">
                            {log.url}
                          </div>
                          {log.error && (
                            <div className="text-xs text-red-500 mt-1 flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 mt-0.5" />
                              {log.error}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                          {log.retryCount > 0 && (
                            <div>Retries: {log.retryCount}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
