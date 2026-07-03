'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AreaDensity {
  id: string
  name: string
  currentCount: number
  capacity: number
  utilizationRate: number
  status: 'normal' | 'moderate' | 'crowded' | 'critical'
  trend: 'increasing' | 'decreasing' | 'stable'
  peakTime: string
}

interface Prediction {
  area: string
  predictedPeak: string
  expectedCount: number
  confidence: number
  recommendation: string
}

interface VisitorFlow {
  from: string
  to: string
  count: number
  avgDuration: string
}

interface Alert {
  id: string
  type: 'overcrowding' | 'safety' | 'bottleneck' | 'optimization'
  area: string
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: string
  actionTaken: boolean
}

export default function VisitorDensityMonitor(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [autoManage, setAutoManage] = useState<boolean>(false)

  const [areas, setAreas] = useState<AreaDensity[]>([
    { id: 'lobby', name: '🏛️ Main Lobby', currentCount: 45, capacity: 80, utilizationRate: 56, status: 'normal', trend: 'stable', peakTime: '14:00-16:00' },
    { id: 'restaurant', name: '🍽️ Restaurant', currentCount: 68, capacity: 80, utilizationRate: 85, status: 'crowded', trend: 'increasing', peakTime: '12:00-14:00' },
    { id: 'pool', name: '🏊 Swimming Pool', currentCount: 32, capacity: 50, utilizationRate: 64, status: 'moderate', trend: 'increasing', peakTime: '10:00-12:00' },
    { id: 'gym', name: '💪 Fitness Center', currentCount: 12, capacity: 25, utilizationRate: 48, status: 'normal', trend: 'stable', peakTime: '06:00-08:00' },
    { id: 'spa', name: '💆 Spa & Wellness', currentCount: 8, capacity: 15, utilizationRate: 53, status: 'normal', trend: 'decreasing', peakTime: '16:00-18:00' },
    { id: 'conference', name: '📊 Conference Hall', currentCount: 95, capacity: 100, utilizationRate: 95, status: 'critical', trend: 'stable', peakTime: '09:00-17:00' },
    { id: 'parking', name: '🚗 Parking Area', currentCount: 142, capacity: 200, utilizationRate: 71, status: 'moderate', trend: 'increasing', peakTime: '18:00-20:00' },
    { id: 'garden', name: '🌺 Garden Area', currentCount: 23, capacity: 60, utilizationRate: 38, status: 'normal', trend: 'stable', peakTime: '17:00-19:00' },
  ])

  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      area: 'Restaurant',
      predictedPeak: 'In 45 minutes (12:15 PM)',
      expectedCount: 78,
      confidence: 0.89,
      recommendation: 'Pre-assign 2 additional servers, prepare overflow seating'
    },
    {
      area: 'Swimming Pool',
      predictedPeak: 'In 2 hours (11:00 AM)',
      expectedCount: 48,
      confidence: 0.82,
      recommendation: 'Deploy lifeguard, activate crowd control barriers'
    },
    {
      area: 'Parking',
      predictedPeak: 'In 6 hours (15:00 PM)',
      expectedCount: 185,
      confidence: 0.91,
      recommendation: 'Open overflow parking zone, update signage'
    },
  ])

  const [visitorFlows, setVisitorFlows] = useState<VisitorFlow[]>([
    { from: 'Main Lobby', to: 'Restaurant', count: 28, avgDuration: '12 min' },
    { from: 'Main Lobby', to: 'Swimming Pool', count: 15, avgDuration: '8 min' },
    { from: 'Restaurant', to: 'Garden Area', count: 12, avgDuration: '15 min' },
    { from: 'Conference Hall', to: 'Restaurant', count: 35, avgDuration: '5 min' },
    { from: 'Parking', to: 'Main Lobby', count: 52, avgDuration: '3 min' },
  ])

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert-001',
      type: 'overcrowding',
      area: 'Conference Hall',
      severity: 'high',
      message: 'Area approaching maximum capacity (95/100)',
      timestamp: '09:15 AM',
      actionTaken: false
    },
    {
      id: 'alert-002',
      type: 'safety',
      area: 'Restaurant',
      severity: 'medium',
      message: 'High density detected, recommend crowd control',
      timestamp: '09:22 AM',
      actionTaken: false
    },
    {
      id: 'alert-003',
      type: 'bottleneck',
      area: 'Parking → Lobby',
      severity: 'low',
      message: 'Visitor flow congestion detected',
      timestamp: '09:30 AM',
      actionTaken: false
    },
  ])

  const totalVisitors = areas.reduce((sum, area) => sum + area.currentCount, 0)
  const avgUtilization = areas.reduce((sum, area) => sum + area.utilizationRate, 0) / areas.length
  const criticalAreas = areas.filter(a => a.status === 'critical' || a.status === 'crowded').length

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAreas(prev => prev.map(area => {
        const change = Math.floor(Math.random() * 10 - 4)
        const newCount = Math.max(0, Math.min(area.capacity, area.currentCount + change))
        const newUtilization = Math.round((newCount / area.capacity) * 100)
        
        let newStatus: 'normal' | 'moderate' | 'crowded' | 'critical' = 'normal'
        if (newUtilization >= 95) newStatus = 'critical'
        else if (newUtilization >= 80) newStatus = 'crowded'
        else if (newUtilization >= 60) newStatus = 'moderate'

        return {
          ...area,
          currentCount: newCount,
          utilizationRate: newUtilization,
          status: newStatus
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'normal': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'crowded': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'crowded': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'bg-blue-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'increasing': return '📈'
      case 'decreasing': return '📉'
      case 'stable': return '➡️'
      default: return '—'
    }
  }

  const handleResolveAlert = (id: string): void => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, actionTaken: true } : alert
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Visitor Density Monitor</h2>
          <p className="text-gray-500 mt-1">Real-time crowd tracking & capacity management for smart tourism</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoManage ? "default" : "outline"}
            onClick={() => setAutoManage(!autoManage)}
          >
            {autoManage ? '🤖 Auto-Manage ON' : '🤖 Auto-Manage OFF'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Visitors</CardDescription>
            <CardTitle className="text-3xl">{totalVisitors}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Across all areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Utilization</CardDescription>
            <CardTitle className="text-3xl">{avgUtilization.toFixed(0)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgUtilization} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Areas</CardDescription>
            <CardTitle className="text-3xl text-red-600">{criticalAreas}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Alerts</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{alerts.filter(a => !a.actionTaken).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Pending actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="flow">Visitor Flow</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({alerts.filter(a => !a.actionTaken).length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areas.map((area) => (
              <Card key={area.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      <CardDescription>Peak: {area.peakTime}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(area.status)}>
                      {area.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capacity</span>
                        <span className="font-medium">{area.currentCount} / {area.capacity}</span>
                      </div>
                      <Progress value={area.utilizationRate} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilization</span>
                      <span className={`font-semibold ${getStatusTextColor(area.status)}`}>
                        {area.utilizationRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trend</span>
                      <span className="font-medium">
                        {getTrendIcon(area.trend)} {area.trend}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Density Heatmap</CardTitle>
              <CardDescription>Visual representation of crowd distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {areas.map((area) => {
                  let bgColor = 'bg-green-100'
                  let intensity = 'opacity-50'
                  
                  if (area.utilizationRate >= 95) {
                    bgColor = 'bg-red-500'
                    intensity = 'opacity-90'
                  } else if (area.utilizationRate >= 80) {
                    bgColor = 'bg-orange-400'
                    intensity = 'opacity-80'
                  } else if (area.utilizationRate >= 60) {
                    bgColor = 'bg-yellow-300'
                    intensity = 'opacity-70'
                  } else if (area.utilizationRate >= 40) {
                    bgColor = 'bg-green-300'
                    intensity = 'opacity-60'
                  }

                  return (
                    <div 
                      key={area.id} 
                      className={`${bgColor} ${intensity} rounded-lg p-4 text-center transition-all hover:scale-105 cursor-pointer`}
                    >
                      <p className="text-2xl mb-2">{area.name.split(' ')[0]}</p>
                      <p className="font-bold text-lg">{area.currentCount}</p>
                      <p className="text-xs font-semibold">{area.utilizationRate}%</p>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 rounded"></div>
                  <span className="text-sm">Low (0-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                  <span className="text-sm">Moderate (60-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-sm">Crowded (80-95%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Critical (95%+)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Crowd Predictions</CardTitle>
              <CardDescription>Machine learning forecasts for proactive management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{prediction.area}</h4>
                        <p className="text-sm text-gray-600">Predicted Peak: {prediction.predictedPeak}</p>
                      </div>
                      <Badge variant="outline" className="text-purple-600">
                        🤖 {(prediction.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Expected Count</p>
                        <p className="text-2xl font-bold text-purple-600">{prediction.expectedCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capacity Status</p>
                        <Progress 
                          value={(prediction.expectedCount / 100) * 100} 
                          className="h-3 mt-2" 
                        />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-800">💡 Recommendation:</p>
                      <p className="text-sm text-blue-600">{prediction.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visitor Flow Tab */}
        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Flow Analysis</CardTitle>
              <CardDescription>Movement patterns between areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visitorFlows.map((flow, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{flow.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium">{flow.to}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Avg transit time: {flow.avgDuration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{flow.count}</p>
                      <p className="text-xs text-gray-500">visitors</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Flow Insights</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Highest traffic: Parking → Main Lobby (52 visitors)</li>
                  <li>• Longest transit: Restaurant → Garden (15 min avg)</li>
                  <li>• Bottleneck detected: Conference Hall → Restaurant</li>
                  <li>• Optimization suggestion: Add direct path from Conference to Garden</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Crowd Management Alerts</CardTitle>
              <CardDescription>Real-time warnings and recommended actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border rounded-lg p-4 ${alert.actionTaken ? 'opacity-50 bg-gray-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                          <span className="text-sm text-gray-500">{alert.timestamp}</span>
                        </div>
                        <h4 className="font-semibold mb-1">{alert.area}</h4>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      {!alert.actionTaken && (
                        <Button 
                          size="sm" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Take Action
                        </Button>
                      )}
                      {alert.actionTaken && (
                        <Badge variant="outline" className="text-green-600">
                          ✓ Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
