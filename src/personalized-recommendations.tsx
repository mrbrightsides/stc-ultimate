'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Clock, DollarSign, Star, TrendingUp, Users, Zap } from 'lucide-react'

interface UserPreferences {
  budgetRange: 'budget' | 'mid' | 'luxury'
  travelStyle: 'adventure' | 'relaxation' | 'culture' | 'business'
  groupSize: number
  preferredActivities: string[]
  previousDestinations: string[]
  seasonPreference: 'spring' | 'summer' | 'fall' | 'winter' | 'flexible'
}

interface Recommendation {
  id: string
  title: string
  destination: string
  type: 'trending' | 'personalized' | 'deals' | 'seasonal'
  matchScore: number
  price: number
  originalPrice?: number
  duration: number
  rating: number
  reviewCount: number
  highlights: string[]
  reasons: string[]
  image: string
  urgent?: boolean
  popularity: number
}

interface PersonalizedRecommendationsProps {
  userWallet: string
  previousBookings?: any[]
  onRecommendationSelect: (recommendation: Recommendation) => void
}

export function PersonalizedRecommendations({ userWallet, previousBookings, onRecommendationSelect }: PersonalizedRecommendationsProps) {
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    budgetRange: 'mid',
    travelStyle: 'culture',
    groupSize: 2,
    preferredActivities: ['sightseeing', 'dining', 'shopping'],
    previousDestinations: ['Bali', 'Singapore'],
    seasonPreference: 'flexible'
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'personalized' | 'deals' | 'seasonal'>('all')
  const [isLearning, setIsLearning] = useState<boolean>(true)

  // Generate personalized recommendations based on user data
  const generateRecommendations = (): Recommendation[] => {
    const baseRecommendations: Partial<Recommendation>[] = [
      {
        title: 'Perfect Cultural Immersion',
        destination: 'Kyoto, Japan',
        type: 'personalized',
        price: 1299,
        originalPrice: 1499,
        duration: 7,
        rating: 4.9,
        reviewCount: 2847,
        highlights: ['Traditional Temples', 'Tea Ceremonies', 'Cherry Blossoms', 'Cultural Districts'],
        reasons: ['Matches your cultural interests', 'Similar to your Bali experience', 'Perfect for 2 travelers'],
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        popularity: 92
      },
      {
        title: 'Tropical Paradise Escape',
        destination: 'Maldives',
        type: 'trending',
        price: 2199,
        duration: 5,
        rating: 4.8,
        reviewCount: 1923,
        highlights: ['Overwater Villas', 'Crystal Waters', 'Spa Treatments', 'Sunset Dining'],
        reasons: ['Trending with couples', 'Perfect for relaxation', 'Luxury experience within budget'],
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
        popularity: 88
      },
      {
        title: 'European Grand Adventure',
        destination: 'Prague, Czech Republic',
        type: 'deals',
        price: 899,
        originalPrice: 1299,
        duration: 6,
        rating: 4.7,
        reviewCount: 1456,
        highlights: ['Historic Architecture', 'Castle Tours', 'Local Cuisine', 'River Cruises'],
        reasons: ['Amazing 31% discount', 'Rich cultural experience', 'Great value for money'],
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop',
        urgent: true,
        popularity: 76
      },
      {
        title: 'Safari & Culture Combo',
        destination: 'Cape Town, South Africa',
        type: 'seasonal',
        price: 1599,
        duration: 8,
        rating: 4.9,
        reviewCount: 987,
        highlights: ['Safari Experience', 'Table Mountain', 'Wine Tasting', 'Cultural Tours'],
        reasons: ['Perfect spring/summer season', 'Unique adventure experience', 'Great photography opportunities'],
        image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=400&h=300&fit=crop',
        popularity: 84
      },
      {
        title: 'Urban Tech & Tradition',
        destination: 'Seoul, South Korea',
        type: 'personalized',
        price: 1099,
        duration: 6,
        rating: 4.6,
        reviewCount: 2134,
        highlights: ['Tech Districts', 'K-Culture', 'Street Food', 'Modern Architecture'],
        reasons: ['Combines culture and modernity', 'Perfect for your group size', 'Similar climate preferences'],
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        popularity: 89
      },
      {
        title: 'Mediterranean Magic',
        destination: 'Santorini, Greece',
        type: 'trending',
        price: 1799,
        duration: 5,
        rating: 4.8,
        reviewCount: 3021,
        highlights: ['Sunset Views', 'White Architecture', 'Wine Tours', 'Volcanic Beaches'],
        reasons: ['Most wished destination 2024', 'Perfect romantic getaway', 'Stunning Instagram spots'],
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
        popularity: 95
      }
    ]

    return baseRecommendations.map((rec, idx) => ({
      id: `rec_${idx}`,
      matchScore: Math.floor(75 + Math.random() * 25), // 75-100% match
      ...rec
    } as Recommendation))
  }

  useEffect(() => {
    // Simulate AI learning from user behavior
    setTimeout(() => {
      setRecommendations(generateRecommendations())
      setIsLearning(false)
    }, 1500)
  }, [userPrefs, previousBookings])

  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.type === selectedCategory
  ).sort((a, b) => b.matchScore - a.matchScore)

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'trending': return 'text-orange-400 bg-orange-900/30 border-orange-500/30'
      case 'personalized': return 'text-cyan-400 bg-cyan-900/30 border-cyan-500/30'
      case 'deals': return 'text-green-400 bg-green-900/30 border-green-500/30'
      case 'seasonal': return 'text-purple-400 bg-purple-900/30 border-purple-500/30'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'trending': return <TrendingUp className="h-3 w-3" />
      case 'personalized': return <Zap className="h-3 w-3" />
      case 'deals': return <DollarSign className="h-3 w-3" />
      case 'seasonal': return <Clock className="h-3 w-3" />
      default: return <Star className="h-3 w-3" />
    }
  }

  if (isLearning) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">AI Learning Your Preferences</h3>
            <p className="text-gray-400 text-sm">Analyzing your travel history and preferences to create personalized recommendations...</p>
          </div>
          <div className="flex justify-center gap-2">
            {['Destinations', 'Budget', 'Activities', 'Timing', 'Style'].map((item, idx) => (
              <div key={item} className={`px-2 py-1 rounded text-xs transition-all duration-500 ${
                idx <= 2 ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Personalized for You</h2>
            <p className="text-gray-400 text-sm">AI-curated recommendations based on your preferences</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-cyan-400 text-sm">Match Score</div>
          <div className="text-white font-semibold">{Math.floor(filteredRecommendations.reduce((acc, rec) => acc + rec.matchScore, 0) / filteredRecommendations.length)}% Average</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Recommendations', icon: <Star className="h-4 w-4" /> },
          { id: 'personalized', label: 'For You', icon: <Zap className="h-4 w-4" /> },
          { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
          { id: 'deals', label: 'Best Deals', icon: <DollarSign className="h-4 w-4" /> },
          { id: 'seasonal', label: 'Seasonal', icon: <Clock className="h-4 w-4" /> }
        ].map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60'
            }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 overflow-hidden group cursor-pointer"
               onClick={() => onRecommendationSelect(rec)}>
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={rec.image} 
                alt={rec.destination}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${getTypeColor(rec.type)}`}>
                  {getTypeIcon(rec.type)}
                  {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                </div>
                
                <div className="px-2 py-1 bg-cyan-900/80 text-cyan-400 rounded-lg text-xs font-semibold backdrop-blur-sm border border-cyan-500/30">
                  {rec.matchScore}% Match
                </div>
              </div>

              {/* Urgent Badge */}
              {rec.urgent && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold animate-pulse">
                  Limited Time
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{rec.title}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  {rec.destination}
                </div>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rec.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">${rec.originalPrice}</span>
                  )}
                  <span className="text-white font-bold text-lg">${rec.price}</span>
                  <span className="text-gray-400 text-sm">/{rec.duration}d</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-medium">{rec.rating}</span>
                  <span className="text-gray-400 text-sm">({rec.reviewCount.toLocaleString()})</span>
                </div>
              </div>

              {/* Highlights */}
              {Array.isArray(rec.highlights) && rec.highlights.length > 0 && (
                <div className="space-y-2">
                  <div className="text-gray-300 text-sm">Highlights:</div>
                  <div className="flex flex-wrap gap-1">
                    {rec.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs">
                        {highlight}
                      </span>
                    ))}
                    {rec.highlights.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800/50 text-gray-400 rounded text-xs">
                        +{rec.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Reasons */}
              {Array.isArray(rec.reasons) && rec.reasons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-cyan-400 text-sm flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Why we recommend this:
                  </div>
                  <div className="space-y-1">
                    {rec.reasons.slice(0, 2).map((reason: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popularity Indicator */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${rec.popularity}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{rec.popularity}% popularity</span>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRecommendationSelect(rec)
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Select This Package
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No recommendations found</div>
          <div className="text-gray-500 text-sm">Try adjusting your filter preferences</div>
        </div>
      )}
    </div>
  )
}