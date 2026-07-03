'use client';

/**
 * STC Ultimate - Audio Controls Component
 * UI for managing ambient sounds and narration
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Mic, MicOff, Music } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isNarrating: boolean;
  onPlay: () => void;
  onPause: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onPlayNarration: (text: string) => void;
  onStopNarration: () => void;
  welcomeNarration?: string;
}

export function AudioControls({
  isPlaying,
  isMuted,
  volume,
  isNarrating,
  onPlay,
  onPause,
  onToggleMute,
  onVolumeChange,
  onPlayNarration,
  onStopNarration,
  welcomeNarration
}: AudioControlsProps): JSX.Element {
  return (
    <Card className="bg-gray-900/95 border-green-500/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Music className="h-4 w-4 text-green-400" />
          Audio Experience
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ambient Sound Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Ambient Sound</span>
            {isPlaying && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                Playing
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              className={`flex-1 ${
                isPlaying
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onToggleMute}
              className="border-gray-700"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-gray-400">Volume</label>
            <span className="text-xs text-green-400">{Math.round(volume * 100)}%</span>
          </div>
          <Slider
            value={[volume * 100]}
            onValueChange={(value) => onVolumeChange(value[0] / 100)}
            min={0}
            max={100}
            step={1}
            disabled={isMuted}
            className="w-full"
          />
        </div>

        {/* Audio Narration */}
        {welcomeNarration && (
          <div className="pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Audio Guide</span>
              {isNarrating && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs animate-pulse">
                  Speaking
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => {
                if (isNarrating) {
                  onStopNarration();
                } else {
                  onPlayNarration(welcomeNarration);
                }
              }}
              className={`w-full ${
                isNarrating
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isNarrating ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Narration
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Play Welcome Guide
                </>
              )}
            </Button>
          </div>
        )}

        {/* Audio Info */}
        <div className="pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-400">
            🎵 Immersive ambient sounds create realistic atmosphere
          </p>
          <p className="text-xs text-gray-400 mt-1">
            🎤 Audio guides use text-to-speech technology
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact Audio Controls (Minimized View)
 */
interface CompactAudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isNarrating: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onExpand: () => void;
}

export function CompactAudioControls({
  isPlaying,
  isMuted,
  isNarrating,
  onTogglePlay,
  onToggleMute,
  onExpand
}: CompactAudioControlsProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-md rounded-lg p-2 border border-green-500/30">
      <Button
        size="sm"
        variant="ghost"
        onClick={onTogglePlay}
        className="h-8 w-8 p-0"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-green-400" />
        ) : (
          <Play className="h-4 w-4 text-green-400" />
        )}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleMute}
        className="h-8 w-8 p-0"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-gray-400" />
        ) : (
          <Volume2 className="h-4 w-4 text-green-400" />
        )}
      </Button>

      {isNarrating && (
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs animate-pulse">
          <Mic className="h-3 w-3 mr-1" />
          Guide
        </Badge>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onExpand}
        className="text-xs text-gray-400 hover:text-white"
      >
        Expand
      </Button>
    </div>
  );
}
