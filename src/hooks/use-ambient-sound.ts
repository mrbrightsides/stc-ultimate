/**
 * STC Ultimate - Ambient Sound Hook (FIXED)
 * React hook for managing ambient sounds and narration
 * Using HTML5 Audio for better reliability
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { LocationSoundscape, AmbientSound } from '@/lib/ambient-sounds';
import { TTSNarrator } from '@/lib/ambient-sounds';

interface UseAmbientSoundReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isNarrating: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playNarration: (text: string) => void;
  stopNarration: () => void;
}

export function useAmbientSound(soundscape: LocationSoundscape | null): UseAmbientSoundReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  
  // Use HTML5 Audio elements instead of Web Audio API
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const narratorRef = useRef<TTSNarrator | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Initialize TTS narrator
  useEffect(() => {
    if (typeof window === 'undefined') return;

    mountedRef.current = true;
    narratorRef.current = new TTSNarrator();

    return () => {
      mountedRef.current = false;
      if (narratorRef.current) {
        narratorRef.current.stop();
      }
    };
  }, []);

  // Load/update audio elements when soundscape changes
  useEffect(() => {
    if (!soundscape || typeof window === 'undefined') return;

    // Clear existing audio elements
    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    audioElementsRef.current.clear();

    // Create new audio elements for each sound
    soundscape.ambientSounds.forEach((sound: AmbientSound) => {
      try {
        const audio = new Audio();
        audio.src = sound.url;
        audio.loop = sound.loop;
        audio.volume = sound.volume * volume * (isMuted ? 0 : 1);
        audio.preload = 'auto';

        // Error handling
        audio.onerror = () => {
          console.warn(`Failed to load audio: ${sound.name}`);
        };

        // Store reference
        audioElementsRef.current.set(sound.id, audio);
      } catch (error) {
        console.warn(`Error creating audio element for ${sound.name}:`, error);
      }
    });

    return () => {
      // Cleanup on soundscape change
      audioElementsRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElementsRef.current.clear();
    };
  }, [soundscape]); // Only depend on soundscape change

  // Update volume and mute for all audio elements
  useEffect(() => {
    if (!soundscape) return;

    audioElementsRef.current.forEach((audio, soundId) => {
      const sound = soundscape.ambientSounds.find((s: AmbientSound) => s.id === soundId);
      if (sound) {
        audio.volume = sound.volume * volume * (isMuted ? 0 : 1);
      }
    });
  }, [volume, isMuted, soundscape]);

  // Play ambient sounds
  const play = useCallback(() => {
    if (!soundscape || audioElementsRef.current.size === 0) {
      console.warn('No audio elements available to play');
      return;
    }

    let playedCount = 0;
    const promises: Promise<void>[] = [];

    audioElementsRef.current.forEach((audio, soundId) => {
      const promise = audio.play().then(() => {
        playedCount++;
      }).catch(error => {
        console.warn(`Failed to play audio ${soundId}:`, error.message);
      });
      promises.push(promise);
    });

    // Update state only after attempting to play
    Promise.all(promises).then(() => {
      if (mountedRef.current && playedCount > 0) {
        setIsPlaying(true);
      }
    });
  }, [soundscape]);

  // Pause ambient sounds
  const pause = useCallback(() => {
    audioElementsRef.current.forEach(audio => {
      audio.pause();
    });
    setIsPlaying(false);
  }, []);

  // Stop ambient sounds
  const stop = useCallback(() => {
    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0; // Reset to beginning
    });
    setIsPlaying(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      // Update all audio elements immediately
      audioElementsRef.current.forEach((audio, soundId) => {
        const sound = soundscape?.ambientSounds.find((s: AmbientSound) => s.id === soundId);
        if (sound) {
          audio.volume = sound.volume * volume * (newMuted ? 0 : 1);
        }
      });
      return newMuted;
    });
  }, [soundscape, volume]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    // Update all audio elements immediately
    audioElementsRef.current.forEach((audio, soundId) => {
      const sound = soundscape?.ambientSounds.find((s: AmbientSound) => s.id === soundId);
      if (sound) {
        audio.volume = sound.volume * newVolume * (isMuted ? 0 : 1);
      }
    });
  }, [soundscape, isMuted]);

  // Play narration
  const playNarration = useCallback((text: string) => {
    if (!narratorRef.current) {
      console.warn('Narrator not initialized');
      return;
    }

    // Check if TTS is available and ready
    if (!narratorRef.current.isReady) {
      console.warn('TTS not ready - voices not loaded yet');
      return;
    }

    // Validate text
    if (!text || text.trim().length === 0) {
      console.warn('Empty narration text');
      return;
    }

    try {
      setIsNarrating(true);
      narratorRef.current.speak(text, 0.9, 1.0);
      
      // Monitor narration status
      const checkInterval = setInterval(() => {
        if (narratorRef.current && !narratorRef.current.isSpeaking) {
          if (mountedRef.current) {
            setIsNarrating(false);
          }
          clearInterval(checkInterval);
        }
      }, 100);

      // Fallback timeout (30 seconds max)
      setTimeout(() => {
        clearInterval(checkInterval);
        if (mountedRef.current) {
          setIsNarrating(false);
        }
      }, 30000);
    } catch (error) {
      console.warn('Error playing narration:', error);
      setIsNarrating(false);
    }
  }, []);

  // Stop narration
  const stopNarration = useCallback(() => {
    if (narratorRef.current) {
      narratorRef.current.stop();
      setIsNarrating(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      stopNarration();
      audioElementsRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElementsRef.current.clear();
    };
  }, [stop, stopNarration]);

  return {
    isPlaying,
    isMuted,
    volume,
    isNarrating,
    play,
    pause,
    stop,
    toggleMute,
    setVolume,
    playNarration,
    stopNarration
  };
}
