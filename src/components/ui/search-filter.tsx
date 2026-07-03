'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import { Input } from './input';
import { NeonButton } from './neon-button';
import { Badge } from './badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Slider } from './slider';
import { Checkbox } from './checkbox';

export interface FilterOptions {
  priceRange: [number, number];
  destinations: string[];
  serviceTypes: string[];
  rating: number;
}

export interface SearchableItem {
  id: string | number;
  name: string;
  destination?: string;
  price?: number;
  serviceType?: string;
  rating?: number;
  description?: string;
  tags?: string[];
}

interface SearchFilterProps {
  items: SearchableItem[];
  onFilteredItems: (filteredItems: SearchableItem[]) => void;
  placeholder?: string;
  showPriceFilter?: boolean;
  showDestinationFilter?: boolean;
  showServiceFilter?: boolean;
  showRatingFilter?: boolean;
  className?: string;
}

export function SearchFilter({
  items,
  onFilteredItems,
  placeholder = "Search destinations, services, or descriptions...",
  showPriceFilter = true,
  showDestinationFilter = true,
  showServiceFilter = true,
  showRatingFilter = true,
  className = ""
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10],
    destinations: [],
    serviceTypes: [],
    rating: 0
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Get unique values for filter options
  const uniqueDestinations = useMemo(() => 
    Array.from(new Set(items.map(item => item.destination).filter(Boolean))),
    [items]
  );

  const uniqueServiceTypes = useMemo(() => 
    Array.from(new Set(items.map(item => item.serviceType).filter(Boolean))),
    [items]
  );

  const priceRange = useMemo(() => {
    const prices = items.map(item => item.price || 0).filter(Boolean);
    return prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 10];
  }, [items]);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let result = items;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.destination?.toLowerCase().includes(query) ||
        item.serviceType?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (showPriceFilter && item => item.price !== undefined) {
      result = result.filter(item => {
        const price = item.price || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Destination filter
    if (showDestinationFilter && filters.destinations.length > 0) {
      result = result.filter(item => 
        filters.destinations.includes(item.destination || '')
      );
    }

    // Service type filter
    if (showServiceFilter && filters.serviceTypes.length > 0) {
      result = result.filter(item => 
        filters.serviceTypes.includes(item.serviceType || '')
      );
    }

    // Rating filter
    if (showRatingFilter && filters.rating > 0) {
      result = result.filter(item => 
        (item.rating || 0) >= filters.rating
      );
    }

    return result;
  }, [items, searchQuery, filters, showPriceFilter, showDestinationFilter, showServiceFilter, showRatingFilter]);

  // Update parent component when filtered items change
  useMemo(() => {
    onFilteredItems(filteredItems);
  }, [filteredItems, onFilteredItems]);

  const updatePriceRange = (newRange: [number, number]): void => {
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const toggleDestination = (destination: string): void => {
    setFilters(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter(d => d !== destination)
        : [...prev.destinations, destination]
    }));
  };

  const toggleServiceType = (serviceType: string): void => {
    setFilters(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(s => s !== serviceType)
        : [...prev.serviceTypes, serviceType]
    }));
  };

  const clearFilters = (): void => {
    setFilters({
      priceRange: [priceRange[0], priceRange[1]],
      destinations: [],
      serviceTypes: [],
      rating: 0
    });
    setSearchQuery('');
  };

  const activeFilterCount = 
    (filters.destinations.length > 0 ? 1 : 0) +
    (filters.serviceTypes.length > 0 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (searchQuery.length > 0 ? 1 : 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4 bg-black/30 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters and Results Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <NeonButton
                variant="secondary"
                size="sm"
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 bg-cyan-500 text-black text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </NeonButton>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 border-gray-600 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Filters</h3>
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Clear All
                  </NeonButton>
                </div>

                {/* Price Range Filter */}
                {showPriceFilter && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white">Price Range (ETH)</span>
                    </div>
                    <div className="px-3">
                      <Slider
                        min={priceRange[0]}
                        max={priceRange[1]}
                        step={0.1}
                        value={filters.priceRange}
                        onValueChange={(value) => updatePriceRange(value as [number, number])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{filters.priceRange[0]} ETH</span>
                        <span>{filters.priceRange[1]} ETH</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Destinations Filter */}
                {showDestinationFilter && uniqueDestinations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">Destinations</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uniqueDestinations.map(destination => (
                        <label key={destination} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={filters.destinations.includes(destination)}
                            onCheckedChange={() => toggleDestination(destination)}
                          />
                          <span className="text-sm text-gray-300">{destination}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Types Filter */}
                {showServiceFilter && uniqueServiceTypes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Service Types</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uniqueServiceTypes.map(serviceType => (
                        <label key={serviceType} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={filters.serviceTypes.includes(serviceType)}
                            onCheckedChange={() => toggleServiceType(serviceType)}
                          />
                          <span className="text-sm text-gray-300 capitalize">{serviceType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating Filter */}
                {showRatingFilter && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Minimum Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setFilters(prev => ({ 
                            ...prev, 
                            rating: prev.rating === rating ? 0 : rating 
                          }))}
                          className={`p-1 rounded ${
                            rating <= filters.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filter Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.destinations.map(destination => (
              <Badge 
                key={destination}
                className="bg-purple-500/20 text-purple-300 border-purple-500/50 cursor-pointer hover:bg-purple-500/30"
                onClick={() => toggleDestination(destination)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {destination}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.serviceTypes.map(serviceType => (
              <Badge 
                key={serviceType}
                className="bg-green-500/20 text-green-300 border-green-500/50 cursor-pointer hover:bg-green-500/30"
                onClick={() => toggleServiceType(serviceType)}
              >
                {serviceType}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          {filteredItems.length} of {items.length} results
        </div>
      </div>
    </div>
  );
}