'use client'

import { useState, useEffect } from 'react'
import { Users, AlertTriangle, TrendingUp, MapPin, Clock, Activity, Eye, Shield } from 'lucide-react'

interface VisitorData {
  locationId: string
  locationName: string
  currentOccupancy: number
  maxCapacity: number
  occupancyPercent: number
  trend: 'increasing' | 'stable' | 'decreasing'
  alertLevel: 'normal' | 'caution' | 'critical'
  averageStayTime: number // minutes
  peakHour: string
  heatmapZones: {
    zone: string
    density: number
    status: 'low' | 'medium' | 'high' | 'overcrowded'
  }[]
  predictions: {
    nextHour: number
    nextDay: number
  }
}

interface VisitorDensityMonitorProps {
  locations: string[]
  onAlertTriggered?: (locationId: string, alertLevel: string) => void
}

export function VisitorDensityMonitor({ locations, onAlertTriggered }: VisitorDensityMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true)
  const [visitorData, setVisitorData] = useState<VisitorData[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true)
  const [refreshInterval, setRefreshInterval] = useState<number>(5000) // ms

  // Generate realistic visitor density data
  const generateVisitorData = (): VisitorData[] => {
    const locationTypes = [
      { name: 'Temple Complex', capacity: 500 },
      { name: 'Beach Area', capacity: 1000 },
      { name: 'Shopping District', capacity: 800 },
      { name: 'Museum', capacity: 300 }
    ]

    return locationTypes.map((type, idx) => {
      const baseOccupancy = type.capacity * (0.3 + Math.random() * 0.6)
      const currentOccupancy = Math.floor(baseOccupancy)
      const occupancyPercent = Math.floor((currentOccupancy / type.capacity) * 100)
      
      let alertLevel: 'normal' | 'caution' | 'critical' = 'normal'
      if (occupancyPercent > 90) alertLevel = 'critical'
      else if (occupancyPercent > 75) alertLevel = 'caution'

      return {
        locationId: `loc_${idx}`,
        locationName: locations[idx] || type.name,
        currentOccupancy,
        maxCapacity: type.capacity,
        occupancyPercent,
        trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as 'increasing' | 'stable' | 'decreasing',
        alertLevel,
        averageStayTime: 30 + Math.floor(Math.random() * 90),
        peakHour: `${10 + Math.floor(Math.random() * 8)}:00`,
        heatmapZones: [
          {
            zone: 'Entrance',
            density: Math.floor(currentOccupancy * 0.3),
            status: occupancyPercent > 80 ? 'high' : 'medium'
          },
          {
            zone: 'Main Area',
            density: Math.floor(currentOccupancy * 0.5),
            status: occupancyPercent > 85 ? 'overcrowded' : occupancyPercent > 70 ? 'high' : 'medium'
          },
          {
            zone: 'Exit Zone',
            density: Math.floor(currentOccupancy * 0.2),
            status: occupancyPercent > 75 ? 'medium' : 'low'
          }
        ],
        predictions: {
          nextHour: Math.floor(currentOccupancy * (0.9 + Math.random() * 0.3)),
          nextDay: Math.floor(type.capacity * (0.6 + Math.random() * 0.3))
        }
      }
    })
  }

  useEffect(() => {
    // Initial data load
    setVisitorData(generateVisitorData())
    setIsMonitoring(false)

    // Real-time updates
    const interval = setInterval(() => {
      const newData = generateVisitorData()
      setVisitorData(newData)

      // Check for alerts
      if (alertsEnabled) {
        newData.forEach(location => {
          if (location.alertLevel === 'critical' || location.alertLevel === 'caution') {
            onAlertTriggered?.(location.locationId, location.alertLevel)
          }
        })
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [locations, alertsEnabled, refreshInterval])

  const getAlertColor = (alertLevel: string): string => {
    switch (alertLevel) {
      case 'normal': return 'text-green-400 bg-green-900/30 border-green-500/30'
      case 'caution': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30'
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30'
    }
  }

  const getTrendIcon = (trend: string): JSX.Element => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-400" />
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-400 rotate-180" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getZoneColor = (status: string): string => {
    switch (status) {
      case 'low': return 'bg-green-600'
      case 'medium': return 'bg-yellow-600'
      case 'high': return 'bg-orange-600'
      case 'overcrowded': return 'bg-red-600 animate-pulse'
      default: return 'bg-gray-600'
    }
  }

  const totalOccupancy = visitorData.reduce((acc, d) => acc + d.currentOccupancy, 0)
  const totalCapacity = visitorData.reduce((acc, d) => acc + d.maxCapacity, 0)
  const overallOccupancyPercent = Math.floor((totalOccupancy / totalCapacity) * 100)
  const criticalLocations = visitorData.filter(d => d.alertLevel === 'critical').length
  const cautionLocations = visitorData.filter(d => d.alertLevel === 'caution').length

  if (isMonitoring) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Initializing Visitor Monitoring</h3>
            <p className="text-gray-400 text-sm">Connecting to IoT sensors across locations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Dashboard */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            Real-Time Visitor Density Monitor
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Alerts</span>
              <button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  alertsEnabled
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {alertsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-black/40 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalOccupancy.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Current Visitors</div>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{overallOccupancyPercent}%</div>
            <div className="text-gray-300 text-sm">Overall Occupancy</div>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{cautionLocations}</div>
            <div className="text-gray-300 text-sm">Caution Zones</div>
          </div>
          <div className="text-center p-3 bg-black/40 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{criticalLocations}</div>
            <div className="text-gray-300 text-sm">Critical Zones</div>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 p-2 bg-black/40 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live Monitoring Active</span>
          <span className="text-gray-400 text-xs">• Updates every {refreshInterval / 1000}s</span>
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visitorData.map((location) => (
          <div
            key={location.locationId}
            className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all p-5 space-y-4"
          >
            {/* Location Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                <h4 className="text-white font-semibold">{location.locationName}</h4>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getAlertColor(location.alertLevel)}`}>
                {location.alertLevel === 'critical' && <AlertTriangle className="h-3 w-3 animate-pulse" />}
                {location.alertLevel.toUpperCase()}
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Occupancy</span>
                <span className="text-white font-semibold">
                  {location.currentOccupancy} / {location.maxCapacity}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    location.occupancyPercent > 90 ? 'bg-red-500' :
                    location.occupancyPercent > 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${location.occupancyPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${
                  location.occupancyPercent > 90 ? 'text-red-400' :
                  location.occupancyPercent > 75 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {location.occupancyPercent}% Capacity
                </span>
                <div className="flex items-center gap-1 text-gray-400">
                  {getTrendIcon(location.trend)}
                  <span className="capitalize">{location.trend}</span>
                </div>
              </div>
            </div>

            {/* Zone Heatmap */}
            <div className="space-y-2">
              <div className="text-gray-300 text-sm font-medium">Zone Density:</div>
              {location.heatmapZones.map((zone, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-gray-400 text-xs">{zone.zone}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getZoneColor(zone.status)}`}
                      style={{ width: `${(zone.density / location.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-xs text-gray-300 text-right">{zone.density}</div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Avg Stay</span>
                </div>
                <div className="text-white text-sm font-semibold">{location.averageStayTime}m</div>
              </div>
              <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Peak</span>
                </div>
                <div className="text-white text-sm font-semibold">{location.peakHour}</div>
              </div>
              <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                  <Eye className="h-3 w-3" />
                  <span>Next Hr</span>
                </div>
                <div className="text-white text-sm font-semibold">{location.predictions.nextHour}</div>
              </div>
            </div>

            {/* Alert Message */}
            {location.alertLevel !== 'normal' && (
              <div className={`p-3 rounded-lg border ${
                location.alertLevel === 'critical' 
                  ? 'bg-red-900/20 border-red-500/30 text-red-400' 
                  : 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
              }`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  {location.alertLevel === 'critical' 
                    ? 'Capacity Critical - Consider crowd control measures' 
                    : 'Approaching capacity limit - Monitor closely'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Predictions Panel */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-400" />
          AI Predictions & Insights
        </h4>
        
        <div className="space-y-3">
          {visitorData.map((location) => (
            <div key={location.locationId} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{location.locationName}</div>
                <div className="text-gray-400 text-xs">Next hour forecast</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  location.predictions.nextHour > location.currentOccupancy 
                    ? 'text-red-400' 
                    : 'text-green-400'
                }`}>
                  {location.predictions.nextHour}
                </div>
                <div className="text-xs text-gray-400">
                  {location.predictions.nextHour > location.currentOccupancy ? '↑' : '↓'} 
                  {' '}{Math.abs(location.predictions.nextHour - location.currentOccupancy)} visitors
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
