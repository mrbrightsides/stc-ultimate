'use client';

/**
 * STC Ultimate - Weather Controls Component
 * UI for selecting and controlling weather effects
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cloud, CloudRain, CloudFog, Sun, Sunset, Moon, CloudSnow, Sparkles } from 'lucide-react';
import type { WeatherPreset } from '@/lib/weather-system';
import { WEATHER_PRESETS, getSuggestedWeatherForLocation } from '@/lib/weather-system';

interface WeatherControlsProps {
  currentWeather: WeatherPreset;
  locationId: string;
  onWeatherChange: (weather: WeatherPreset) => void;
}

export function WeatherControls({
  currentWeather,
  locationId,
  onWeatherChange
}: WeatherControlsProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const suggestedWeather = getSuggestedWeatherForLocation(locationId);

  const getWeatherIcon = (weatherType: string): JSX.Element => {
    switch (weatherType) {
      case 'clear':
        return <Sun className="h-4 w-4" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4" />;
      case 'rain':
        return <CloudRain className="h-4 w-4" />;
      case 'fog':
        return <CloudFog className="h-4 w-4" />;
      case 'sunset':
        return <Sunset className="h-4 w-4" />;
      case 'sunrise':
        return <Sun className="h-4 w-4" />;
      case 'snow':
        return <CloudSnow className="h-4 w-4" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {getWeatherIcon(currentWeather.settings.type)}
          <span className="ml-2">{currentWeather.name}</span>
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80">
      <Card className="bg-gray-900/95 border-cyan-500/50 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5 text-cyan-400" />
              Weather & Atmosphere
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Weather */}
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyan-300 uppercase tracking-wider">Current</span>
              {getWeatherIcon(currentWeather.settings.type)}
            </div>
            <h3 className="text-white font-semibold">{currentWeather.name}</h3>
            <p className="text-xs text-gray-300 mt-1">{currentWeather.description}</p>
          </div>

          {/* Suggested Weather */}
          {suggestedWeather.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Recommended for {locationId}
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedWeather.map(weather => (
                  <Badge
                    key={weather.id}
                    className={`cursor-pointer px-3 py-1 ${
                      currentWeather.id === weather.id
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => onWeatherChange(weather)}
                  >
                    <span className="flex items-center gap-1">
                      {getWeatherIcon(weather.settings.type)}
                      <span className="text-xs">{weather.name}</span>
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* All Weather Presets */}
          <div>
            <h4 className="text-sm text-gray-400 mb-2">All Presets</h4>
            <ScrollArea className="h-40">
              <div className="space-y-2 pr-4">
                {WEATHER_PRESETS.map(weather => (
                  <button
                    key={weather.id}
                    onClick={() => onWeatherChange(weather)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      currentWeather.id === weather.id
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-gray-900/50">
                        {getWeatherIcon(weather.settings.type)}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white text-sm font-medium">{weather.name}</h5>
                        <p className="text-xs text-gray-400">{weather.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
