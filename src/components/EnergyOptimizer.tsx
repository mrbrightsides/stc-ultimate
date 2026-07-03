'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EnergyConsumption {
  category: string
  current: number
  baseline: number
  unit: string
  status: 'optimal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface OptimizationSuggestion {
  id: string
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedSaving: number
  impact: string
  aiConfidence: number
  implementation: string
}

interface EnergyMetrics {
  totalConsumption: number
  dailyCost: number
  savingsPotential: number
  carbonFootprint: number
  efficiency: number
}

export default function EnergyOptimizer(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false)

  const [energyData, setEnergyData] = useState<EnergyConsumption[]>([
    { category: 'HVAC Systems', current: 45.2, baseline: 50.0, unit: 'kWh', status: 'optimal', trend: 'down' },
    { category: 'Lighting', current: 18.7, baseline: 15.0, unit: 'kWh', status: 'warning', trend: 'up' },
    { category: 'Security Systems', current: 8.3, baseline: 8.0, unit: 'kWh', status: 'optimal', trend: 'stable' },
    { category: 'Elevators', current: 12.1, baseline: 10.5, unit: 'kWh', status: 'warning', trend: 'up' },
    { category: 'Kitchen Equipment', current: 28.5, baseline: 30.0, unit: 'kWh', status: 'optimal', trend: 'down' },
    { category: 'Water Heating', current: 15.8, baseline: 14.0, unit: 'kWh', status: 'warning', trend: 'up' },
    { category: 'IT Infrastructure', current: 22.4, baseline: 20.0, unit: 'kWh', status: 'warning', trend: 'up' },
    { category: 'Guest Room Electronics', current: 31.2, baseline: 28.0, unit: 'kWh', status: 'warning', trend: 'up' },
  ])

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: 'opt-001',
      priority: 'high',
      action: 'Reduce HVAC temperature in unoccupied zones by 2°C',
      expectedSaving: 8.5,
      impact: 'Minimal guest comfort impact',
      aiConfidence: 0.92,
      implementation: 'Automatic adjustment via BMS'
    },
    {
      id: 'opt-002',
      priority: 'high',
      action: 'Implement occupancy-based lighting in corridors',
      expectedSaving: 5.2,
      impact: 'No guest impact, improved sustainability',
      aiConfidence: 0.88,
      implementation: 'Motion sensor integration'
    },
    {
      id: 'opt-003',
      priority: 'medium',
      action: 'Schedule water heating during off-peak hours',
      expectedSaving: 3.4,
      impact: 'Cost reduction, maintain service quality',
      aiConfidence: 0.85,
      implementation: 'Timer-based control'
    },
    {
      id: 'opt-004',
      priority: 'medium',
      action: 'Optimize elevator scheduling algorithm',
      expectedSaving: 2.8,
      impact: 'Reduced wait time, lower energy use',
      aiConfidence: 0.79,
      implementation: 'AI-powered dispatch system'
    },
    {
      id: 'opt-005',
      priority: 'low',
      action: 'Dim lobby lighting during low-traffic hours',
      expectedSaving: 1.6,
      impact: 'Maintains ambiance, saves energy',
      aiConfidence: 0.73,
      implementation: 'Scheduled dimming control'
    },
  ])

  const [metrics, setMetrics] = useState<EnergyMetrics>({
    totalConsumption: 182.2,
    dailyCost: 2184.50,
    savingsPotential: 21.5,
    carbonFootprint: 91.1,
    efficiency: 87.5
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(prev => prev.map(item => ({
        ...item,
        current: item.current + (Math.random() - 0.5) * 0.5
      })))
      
      setMetrics(prev => ({
        ...prev,
        totalConsumption: prev.totalConsumption + (Math.random() - 0.5) * 2,
        dailyCost: prev.dailyCost + (Math.random() - 0.5) * 20
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleImplementSuggestion = (id: string): void => {
    console.log('Implementing optimization:', id)
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'optimal': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      case 'stable': return '→'
      default: return '—'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">AI Energy Optimizer</h2>
          <p className="text-gray-500 mt-1">Machine Learning-powered energy management for smart tourism</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoOptimize ? "default" : "outline"}
            onClick={() => setAutoOptimize(!autoOptimize)}
          >
            {autoOptimize ? '🤖 Auto-Optimize ON' : '🤖 Auto-Optimize OFF'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Consumption</CardDescription>
            <CardTitle className="text-2xl">{metrics.totalConsumption.toFixed(1)} kWh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Current hour usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Cost</CardDescription>
            <CardTitle className="text-2xl">Rp {metrics.dailyCost.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">At current rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Savings Potential</CardDescription>
            <CardTitle className="text-2xl text-green-600">{metrics.savingsPotential.toFixed(1)} kWh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">With AI optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Carbon Footprint</CardDescription>
            <CardTitle className="text-2xl">{metrics.carbonFootprint.toFixed(1)} kg CO₂</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Per day emissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Efficiency Score</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{metrics.efficiency.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.efficiency} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions ({suggestions.length})</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Real-time energy consumption across all systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {energyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.category}</p>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Baseline: {item.baseline} {item.unit} | Trend: {getTrendIcon(item.trend)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{item.current.toFixed(1)}</p>
                      <p className="text-sm text-gray-500">{item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Optimization Suggestions</CardTitle>
              <CardDescription>Machine learning recommendations for energy savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            💡 {(suggestion.aiConfidence * 100).toFixed(0)}% AI Confidence
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2">{suggestion.action}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <p className="font-medium text-green-600">Expected Saving:</p>
                            <p>{suggestion.expectedSaving} kWh/day</p>
                          </div>
                          <div>
                            <p className="font-medium">Impact:</p>
                            <p>{suggestion.impact}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <p className="font-medium text-blue-800">Implementation:</p>
                          <p className="text-blue-600">{suggestion.implementation}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleImplementSuggestion(suggestion.id)}
                        className="ml-4"
                      >
                        Implement
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumption Tab */}
        <TabsContent value="consumption" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Peak Consumption Hours</CardTitle>
                <CardDescription>Hourly energy usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['06:00-09:00', '12:00-15:00', '18:00-21:00', '22:00-01:00'].map((time, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{time}</span>
                        <span className="font-medium">{(Math.random() * 100 + 150).toFixed(1)} kWh</span>
                      </div>
                      <Progress value={Math.random() * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Daily energy costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {energyData.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{item.category}</span>
                      <span className="font-medium">Rp {(item.current * 12 * 1000).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Performance Analytics</CardTitle>
              <CardDescription>Historical trends and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Weekly Comparison</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-blue-100 rounded-lg p-3 mb-1">
                          <p className="text-2xl font-bold text-blue-600">
                            {(Math.random() * 50 + 150).toFixed(0)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">AI Predictions</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tomorrow</p>
                        <p className="text-2xl font-bold text-purple-600">168 kWh</p>
                        <p className="text-xs text-green-600">-8% vs today</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Next Week</p>
                        <p className="text-2xl font-bold text-purple-600">1,247 kWh</p>
                        <p className="text-xs text-green-600">-12% optimized</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Next Month</p>
                        <p className="text-2xl font-bold text-purple-600">5,340 kWh</p>
                        <p className="text-xs text-green-600">-15% with AI</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Sustainability Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-gray-600">Trees Equivalent</p>
                      <p className="text-2xl font-bold text-green-600">🌳 142</p>
                      <p className="text-xs text-gray-500">Annual CO₂ offset</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-gray-600">Green Rating</p>
                      <p className="text-2xl font-bold text-green-600">⭐ 4.5/5</p>
                      <p className="text-xs text-gray-500">Eco-certification score</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
