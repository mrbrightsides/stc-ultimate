'use client';

import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Info } from 'lucide-react';

export type DemoSpeed = 'instant' | 'realtime';

interface DemoSpeedToggleProps {
  currentSpeed: DemoSpeed;
  onSpeedChange: (speed: DemoSpeed) => void;
}

export function DemoSpeedToggle({ currentSpeed, onSpeedChange }: DemoSpeedToggleProps) {
  return (
    <NeonCard glowColor="purple" className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-purple-400" />
          <h4 className="text-sm font-semibold text-white">Mode Demonstrasi</h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Instant Mode */}
          <button
            onClick={() => onSpeedChange('instant')}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentSpeed === 'instant'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 bg-black/30 hover:border-cyan-500/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Zap className={`h-5 w-5 ${
                  currentSpeed === 'instant' ? 'text-cyan-400' : 'text-gray-400'
                }`} />
                {currentSpeed === 'instant' && (
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <div>
                <p className={`font-semibold ${
                  currentSpeed === 'instant' ? 'text-cyan-400' : 'text-gray-400'
                }`}>
                  Instant Mode
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  5 detik per milestone
                </p>
              </div>
            </div>
          </button>

          {/* Real-time Mode */}
          <button
            onClick={() => onSpeedChange('realtime')}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentSpeed === 'realtime'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 bg-black/30 hover:border-purple-500/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Clock className={`h-5 w-5 ${
                  currentSpeed === 'realtime' ? 'text-purple-400' : 'text-gray-400'
                }`} />
                {currentSpeed === 'realtime' && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <div>
                <p className={`font-semibold ${
                  currentSpeed === 'realtime' ? 'text-purple-400' : 'text-gray-400'
                }`}>
                  Real-time Mode
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  30-40 detik per milestone
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Description */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <p className="text-xs text-gray-400">
            {currentSpeed === 'instant' ? (
              <span className="text-cyan-300">
                ⚡ Mode cepat untuk demo/presentasi. Setiap milestone selesai dalam 5 detik.
              </span>
            ) : (
              <span className="text-purple-300">
                🕐 Mode realistic untuk menunjukkan sequential IoT triggers dengan time delays natural (30-40 detik).
              </span>
            )}
          </p>
        </div>
      </div>
    </NeonCard>
  );
}
