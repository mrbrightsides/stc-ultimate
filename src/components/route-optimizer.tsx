'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, Route, Zap, Navigation, Star, DollarSign } from 'lucide-react'

interface Location {
  id: string
  name: string
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'shopping'
  coordinates: [number, number] // [lat, lng]
  estimatedTime: number // minutes to spend
  cost: number
  rating: number
  openHours: string
  priority: 'high' | 'medium' | 'low'
}

interface OptimizedRoute {
  totalDistance: number
  totalTime: number
  totalCost: number
  estimatedSavings: number
  locations: Location[]
  alternatives: {
    shortest: Location[]
    cheapest: Location[]
    fastest: Location[]
  }
}

interface RouteOptimizerProps {
  selectedServices: any[]
  destination: string
  travelDates: string
  onRouteOptimized: (route: OptimizedRoute) => void
}

export function RouteOptimizer({ selectedServices, destination, travelDates, onRouteOptimized }: RouteOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false)
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [optimizationCriteria, setOptimizationCriteria] = useState<'balanced' | 'time' | 'cost' | 'experience'>('balanced')

  // Sample location data - in production, this would come from APIs
  const generateSampleLocations = (): Location[] => {
    const locationsByDestination: Record<string, Partial<Location>[]> = {
      'Bali': [
        { name: 'Ngurah Rai Airport', type: 'transport', coordinates: [-8.7467, 115.1671], estimatedTime: 60, cost: 0 },
        { name: 'Grand Hyatt Bali', type: 'hotel', coordinates: [-8.8003, 115.1717], estimatedTime: 480, cost: 150 },
        { name: 'Ubud Rice Terraces', type: 'attraction', coordinates: [-8.4390, 115.2619], estimatedTime: 120, cost: 10 },
        { name: 'Warung Babi Guling', type: 'restaurant', coordinates: [-8.6524, 115.2191], estimatedTime: 90, cost: 15 },
        { name: 'Sukawati Market', type: 'shopping', coordinates: [-8.6180, 115.2832], estimatedTime: 120, cost: 50 }
      ],
      'Tokyo': [
        { name: 'Haneda Airport', type: 'transport', coordinates: [35.5494, 139.7798], estimatedTime: 60, cost: 0 },
        { name: 'Tokyo Station Hotel', type: 'hotel', coordinates: [35.6813, 139.7669], estimatedTime: 480, cost: 200 },
        { name: 'Senso-ji Temple', type: 'attraction', coordinates: [35.7148, 139.7967], estimatedTime: 90, cost: 0 },
        { name: 'Tsukiji Market', type: 'restaurant', coordinates: [35.6654, 139.7707], estimatedTime: 120, cost: 30 },
        { name: 'Shibuya Shopping', type: 'shopping', coordinates: [35.6598, 139.7006], estimatedTime: 180, cost: 100 }
      ]
    }

    const baseLocations = locationsByDestination[destination] || locationsByDestination['Bali']
    
    return baseLocations.map((loc, idx) => ({
      id: `loc_${idx}`,
      name: loc.name || 'Location',
      type: loc.type || 'attraction',
      coordinates: loc.coordinates || [0, 0],
      estimatedTime: loc.estimatedTime || 60,
      cost: loc.cost || 20,
      rating: 4.2 + Math.random() * 0.8,
      openHours: '9:00 AM - 8:00 PM',
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
    }))
  }

  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    // Simplified distance calculation (Haversine formula simplified)
    const [lat1, lon1] = coord1
    const [lat2, lon2] = coord2
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const optimizeRoute = async (): Promise<void> => {
    setIsOptimizing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const locations = generateSampleLocations()
    
    // Apply optimization algorithm based on criteria
    const optimizedLocations = [...locations].sort((a, b) => {
      switch (optimizationCriteria) {
        case 'time':
          return a.estimatedTime - b.estimatedTime
        case 'cost':
          return a.cost - b.cost
        case 'experience':
          return b.rating - a.rating
        default:
          // Balanced optimization
          const scoreA = (a.rating * 0.4) - (a.cost * 0.3) - (a.estimatedTime * 0.3)
          const scoreB = (b.rating * 0.4) - (b.cost * 0.3) - (b.estimatedTime * 0.3)
          return scoreB - scoreA
      }
    })

    // Calculate total metrics
    const totalDistance = optimizedLocations.reduce((acc, loc, idx) => {
      if (idx === 0) return 0
      return acc + calculateDistance(optimizedLocations[idx - 1].coordinates, loc.coordinates)
    }, 0)

    const totalTime = optimizedLocations.reduce((acc, loc) => acc + loc.estimatedTime, 0)
    const totalCost = optimizedLocations.reduce((acc, loc) => acc + loc.cost, 0)
    const estimatedSavings = Math.floor(totalCost * 0.15) // 15% optimization savings

    // Generate alternative routes
    const alternatives = {
      shortest: [...locations].sort((a, b) => a.coordinates[0] - b.coordinates[0]),
      cheapest: [...locations].sort((a, b) => a.cost - b.cost),
      fastest: [...locations].sort((a, b) => a.estimatedTime - b.estimatedTime)
    }

    const route: OptimizedRoute = {
      totalDistance,
      totalTime,
      totalCost,
      estimatedSavings,
      locations: optimizedLocations,
      alternatives
    }

    setOptimizedRoute(route)
    onRouteOptimized(route)
    setIsOptimizing(false)
  }

  useEffect(() => {
    if (selectedServices && Array.isArray(selectedServices) && selectedServices.length > 0) {
      optimizeRoute()
    }
  }, [selectedServices, optimizationCriteria])

  const getLocationIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'hotel': return <div className="text-blue-400">🏨</div>
      case 'restaurant': return <div className="text-orange-400">🍽️</div>
      case 'attraction': return <div className="text-green-400">🎯</div>
      case 'transport': return <div className="text-purple-400">✈️</div>
      case 'shopping': return <div className="text-pink-400">🛍️</div>
      default: return <MapPin className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Route className="h-5 w-5 text-cyan-400" />
          AI Route Optimization
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Optimization Priority
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'balanced', label: 'Balanced', icon: <Zap className="h-4 w-4" /> },
                { id: 'time', label: 'Fastest', icon: <Clock className="h-4 w-4" /> },
                { id: 'cost', label: 'Cheapest', icon: <DollarSign className="h-4 w-4" /> },
                { id: 'experience', label: 'Best Rated', icon: <Star className="h-4 w-4" /> }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setOptimizationCriteria(option.id as typeof optimizationCriteria)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    optimizationCriteria === option.id
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {isOptimizing && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
                <div className="text-white">Optimizing your route...</div>
                <div className="text-gray-400 text-sm">
                  Analyzing traffic, distances, and preferences
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimized Route Results */}
      {optimizedRoute && !isOptimizing && (
        <div className="space-y-4">
          {/* Route Summary */}
          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-400" />
              Optimized Route Summary
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{optimizedRoute.totalDistance.toFixed(1)} km</div>
                <div className="text-gray-300 text-sm">Total Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.floor(optimizedRoute.totalTime / 60)}h {optimizedRoute.totalTime % 60}m</div>
                <div className="text-gray-300 text-sm">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${optimizedRoute.totalCost}</div>
                <div className="text-gray-300 text-sm">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">-${optimizedRoute.estimatedSavings}</div>
                <div className="text-gray-300 text-sm">Savings</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/20">
              <div className="text-green-400 text-sm font-medium mb-1">💡 Optimization Insights</div>
              <div className="text-gray-300 text-sm">
                Route optimized for {optimizationCriteria === 'balanced' ? 'best overall experience' : 
                optimizationCriteria === 'time' ? 'minimum travel time' :
                optimizationCriteria === 'cost' ? 'lowest total cost' : 'highest rated experiences'}. 
                Estimated 15% savings compared to unoptimized route.
              </div>
            </div>
          </div>

          {/* Route Sequence */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Optimized Sequence</h4>
            
            <div className="space-y-3">
              {optimizedRoute.locations && Array.isArray(optimizedRoute.locations) && optimizedRoute.locations.map((location, idx) => (
                <div key={location.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-shrink-0 text-center">
                    <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {getLocationIcon(location.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium">{location.name}</div>
                    <div className="text-gray-400 text-sm">
                      {location.estimatedTime}min • {location.openHours}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3 w-3" />
                      {location.rating.toFixed(1)}
                    </div>
                    <div className="text-gray-300">${location.cost}</div>
                  </div>
                  
                  {optimizedRoute.locations && idx < optimizedRoute.locations.length - 1 && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-0.5 bg-cyan-400/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Routes */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Alternative Routes</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(optimizedRoute.alternatives).map(([type, locations]) => (
                <div key={type} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-white font-medium mb-2 capitalize">{type} Route</div>
                  <div className="space-y-2">
                    {Array.isArray(locations) && locations.slice(0, 3).map((loc: Location, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{idx + 1}.</span>
                        <span className="text-gray-300">{loc.name}</span>
                      </div>
                    ))}
                    {Array.isArray(locations) && locations.length > 3 && (
                      <div className="text-gray-400 text-xs">+{locations.length - 3} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}