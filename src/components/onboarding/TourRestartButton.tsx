'use client'

import { useState, useEffect } from 'react';
import { Compass, X } from 'lucide-react';
import { useRestartTour } from './OnboardingTour';

export function TourRestartButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { restartTour, isTourCompleted } = useRestartTour();

  useEffect(() => {
    // Show button only if tour has been completed
    const tourCompleted = isTourCompleted();
    setIsVisible(tourCompleted);
  }, [isTourCompleted]);

  if (!isVisible) return null;

  return (
    <div className="fixed left-6 bottom-6 z-50">
      {isExpanded ? (
        // Expanded card
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl p-4 w-64 animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Compass className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Take the Tour</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mb-4">
            Want to see the guided tour again? Restart the onboarding experience.
          </p>
          
          <button
            onClick={restartTour}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            Restart Tour
          </button>
        </div>
      ) : (
        // Collapsed floating button
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <Compass className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-500" />
          
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping" />
          
          {/* Tooltip on hover */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Restart Tour
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        </button>
      )}
    </div>
  );
}
