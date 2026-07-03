'use client'

import { useState, useEffect } from 'react'
import { Zap, TrendingDown, Battery, Sun, Wind, Droplet, AlertTriangle, CheckCircle } from 'lucide-react'

interface EnergyData {
  facilityId: string
  facilityName: string
  currentUsage: number // kWh
  predictedUsage: number
  optimalUsage: number
  savingsPercent: number
  carbonOffset: number // kg CO2
  status: 'optimal' | 'warning' | 'critical'
  devices: {
    id: string
    name: string
    type: 'hvac' | 'lighting' | 'equipment' | 'renewable'
    usage: number
    recommendation: string
    potentialSaving: number
  }[]
}

interface EnergyOptimizerProps {
  facilities: string[]
  onOptimizationApplied?: (facilityId: string, savings: number) => void
}

export function EnergyOptimizer({ facilities, onOptimizationApplied }: EnergyOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true)
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false)

  // Generate sample energy data for tourism facilities
  const generateEnergyData = (): EnergyData[] => {
    const facilityTypes = ['Hotel', 'Restaurant', 'Attraction', 'Transport Hub']
    
    return facilityTypes.map((type, idx) => {
      const baseUsage = 500 + Math.random() * 1500
      const optimalUsage = baseUsage * 0.75
      const currentUsage = baseUsage * (0.85 + Math.random() * 0.3)
      
      return {
        facilityId: `facility_${idx}`,
        facilityName: `${type} - ${facilities[idx] || 'Location ' + (idx + 1)}`,
        currentUsage: Math.floor(currentUsage),
        predictedUsage: Math.floor(currentUsage * 1.1),
        optimalUsage: Math.floor(optimalUsage),
        savingsPercent: Math.floor(((currentUsage - optimalUsage) / currentUsage) * 100),
        carbonOffset: Math.floor((currentUsage - optimalUsage) * 0.4),
        status: currentUsage > baseUsage * 1.1 ? 'critical' : currentUsage > baseUsage * 0.95 ? 'warning' : 'optimal',
        devices: [
          {
            id: `dev_${idx}_1`,
            name: 'HVAC System',
            type: 'hvac',
            usage: Math.floor(currentUsage * 0.4),
            recommendation: 'Reduce temperature setpoint by 2°C during low occupancy',
            potentialSaving: Math.floor(currentUsage * 0.15)
          },
          {
            id: `dev_${idx}_2`,
            name: 'Lighting System',
            type: 'lighting',
            usage: Math.floor(currentUsage * 0.3),
            recommendation: 'Install motion sensors in common areas',
            potentialSaving: Math.floor(currentUsage * 0.12)
          },
          {
            id: `dev_${idx}_3`,
            name: 'Kitchen Equipment',
            type: 'equipment',
            usage: Math.floor(currentUsage * 0.2),
            recommendation: 'Schedule equipment during off-peak hours',
            potentialSaving: Math.floor(currentUsage * 0.08)
          },
          {
            id: `dev_${idx}_4`,
            name: 'Solar Panels',
            type: 'renewable',
            usage: -Math.floor(currentUsage * 0.15),
            recommendation: 'Functioning optimally - generating clean energy',
            potentialSaving: 0
          }
        ]
      }
    })
  }

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setEnergyData(generateEnergyData())
      setIsAnalyzing(false)
    }, 2000)
  }, [facilities])

  const applyOptimization = (facilityId: string): void => {
    const facility = energyData.find(f => f.facilityId === facilityId)
    if (!facility) return

    const savings = facility.currentUsage - facility.optimalUsage
    
    // Update energy data to reflect optimization
    setEnergyData(prev => prev.map(f => 
      f.facilityId === facilityId 
        ? { ...f, currentUsage: f.optimalUsage, status: 'optimal' }
        : f
    ))

    onOptimizationApplied?.(facilityId, savings)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-900/30 border-green-500/30'
      case 'warning': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30'
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'optimal': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4 animate-pulse" />
      default: return <Battery className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'hvac': return <Wind className="h-4 w-4 text-blue-400" />
      case 'lighting': return <Sun className="h-4 w-4 text-yellow-400" />
      case 'equipment': return <Zap className="h-4 w-4 text-purple-400" />
      case 'renewable': return <Droplet className="h-4 w-4 text-green-400" />
      default: return <Battery className="h-4 w-4 text-gray-400" />
    }
  }

  const totalCurrentUsage = energyData.reduce((acc, f) => acc + f.currentUsage, 0)
  const totalOptimalUsage = energyData.reduce((acc, f) => acc + f.optimalUsage, 0)
  const totalSavings = totalCurrentUsage - totalOptimalUsage
  const totalCarbonOffset = energyData.reduce((acc, f) => acc + f.carbonOffset, 0)

  if (isAnalyzing) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">AI Analyzing Energy Patterns</h3>
            <p className="text-gray-400 text-sm">Identifying optimization opportunities across your facilities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-green-400" />
          Energy Optimization Dashboard
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalCurrentUsage.toLocaleString()} kWh</div>
            <div className="text-gray-300 text-sm">Current Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalOptimalUsage.toLocaleString()} kWh</div>
            <div className="text-gray-300 text-sm">Optimal Target</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{Math.floor((totalSavings / totalCurrentUsage) * 100)}%</div>
            <div className="text-gray-300 text-sm">Potential Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalCarbonOffset.toLocaleString()} kg</div>
            <div className="text-gray-300 text-sm">CO₂ Reduction</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">Auto-Optimization</span>
          </div>
          <button
            onClick={() => setAutoOptimize(!autoOptimize)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              autoOptimize
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {autoOptimize ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Facility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {energyData.map((facility) => (
          <div
            key={facility.facilityId}
            className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all p-5 space-y-4"
          >
            {/* Facility Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">{facility.facilityName}</h4>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(facility.status)}`}>
                {getStatusIcon(facility.status)}
                {facility.status.toUpperCase()}
              </div>
            </div>

            {/* Energy Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-white">{facility.currentUsage}</div>
                <div className="text-xs text-gray-400">Current kWh</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-green-400">{facility.optimalUsage}</div>
                <div className="text-xs text-gray-400">Target kWh</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-cyan-400">-{facility.savingsPercent}%</div>
                <div className="text-xs text-gray-400">Savings</div>
              </div>
            </div>

            {/* Devices */}
            <div className="space-y-2">
              <div className="text-gray-300 text-sm font-medium">Devices:</div>
              {facility.devices.map((device) => (
                <div key={device.id} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                  {getDeviceIcon(device.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">{device.name}</div>
                    <div className="text-gray-400 text-xs truncate">{device.recommendation}</div>
                  </div>
                  <div className={`text-sm font-medium ${device.usage < 0 ? 'text-green-400' : 'text-gray-300'}`}>
                    {device.usage < 0 ? '+' : ''}{Math.abs(device.usage)} kWh
                  </div>
                </div>
              ))}
            </div>

            {/* Optimization Button */}
            <button
              onClick={() => applyOptimization(facility.facilityId)}
              disabled={facility.status === 'optimal'}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <TrendingDown className="h-4 w-4" />
              {facility.status === 'optimal' ? 'Already Optimized' : `Apply Optimization (-${facility.savingsPercent}%)`}
            </button>
          </div>
        ))}
      </div>

      {/* Sustainability Impact */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Sustainability Impact</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Annual Energy Savings</span>
            <span className="text-white font-semibold">{(totalSavings * 365).toLocaleString()} kWh/year</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Annual CO₂ Reduction</span>
            <span className="text-green-400 font-semibold">{(totalCarbonOffset * 365).toLocaleString()} kg/year</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Cost Savings (est.)</span>
            <span className="text-cyan-400 font-semibold">${(totalSavings * 0.12 * 365).toLocaleString()}/year</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Trees Equivalent</span>
            <span className="text-green-400 font-semibold">{Math.floor((totalCarbonOffset * 365) / 20)} trees</span>
          </div>
        </div>
      </div>
    </div>
  )
}
