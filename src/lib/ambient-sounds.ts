/**
 * STC Ultimate - Ambient Sound System
 * Immersive audio experience for each location
 */

export interface AmbientSound {
  id: string;
  name: string;
  category: 'nature' | 'urban' | 'cultural';
  url: string; // Web Audio API compatible URLs
  volume: number;
  loop: boolean;
}

export interface LocationSoundscape {
  locationId: string;
  welcomeNarration?: string; // TTS text
  ambientSounds: AmbientSound[];
  hotspotSounds?: Record<string, string>; // hotspotId -> TTS text
}

/**
 * Ambient soundscapes for each location
 * Using Web Audio API compatible sound URLs
 */
export const LOCATION_SOUNDSCAPES: Record<string, LocationSoundscape> = {
  bali: {
    locationId: 'bali',
    welcomeNarration: 'Welcome to Bali, the Island of Gods. Listen to the gentle waves, tropical birds, and traditional gamelan music echoing through the temples.',
    ambientSounds: [
      {
        id: 'bali-ocean',
        name: 'Ocean Waves',
        category: 'nature',
        url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3', // Ocean waves
        volume: 0.3,
        loop: true
      },
      {
        id: 'bali-birds',
        name: 'Tropical Birds',
        category: 'nature',
        url: 'https://assets.mixkit.co/active_storage/sfx/1954/1954-preview.mp3', // Bird chirping
        volume: 0.2,
        loop: true
      }
    ]
  },
  yogyakarta: {
    locationId: 'yogyakarta',
    welcomeNarration: 'Welcome to Yogyakarta, the cultural heart of Java. Experience the ancient temples, traditional crafts, and vibrant local life.',
    ambientSounds: [
      {
        id: 'jogja-temple',
        name: 'Temple Ambience',
        category: 'cultural',
        url: 'https://assets.mixkit.co/active_storage/sfx/2449/2449-preview.mp3', // Wind
        volume: 0.25,
        loop: true
      },
      {
        id: 'jogja-market',
        name: 'Market Sounds',
        category: 'urban',
        url: 'https://assets.mixkit.co/active_storage/sfx/1996/1996-preview.mp3', // Crowd
        volume: 0.15,
        loop: true
      }
    ]
  },
  lombok: {
    locationId: 'lombok',
    welcomeNarration: 'Welcome to Lombok, a pristine paradise. Hear the crashing waves, rustling palm trees, and distant calls of tropical wildlife.',
    ambientSounds: [
      {
        id: 'lombok-waves',
        name: 'Beach Waves',
        category: 'nature',
        url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
        volume: 0.35,
        loop: true
      },
      {
        id: 'lombok-wind',
        name: 'Palm Trees',
        category: 'nature',
        url: 'https://assets.mixkit.co/active_storage/sfx/2449/2449-preview.mp3',
        volume: 0.2,
        loop: true
      }
    ]
  },
  jakarta: {
    locationId: 'jakarta',
    welcomeNarration: 'Welcome to Jakarta, Indonesia\'s vibrant capital. Experience the energy of a modern metropolis mixed with rich history.',
    ambientSounds: [
      {
        id: 'jakarta-city',
        name: 'City Ambience',
        category: 'urban',
        url: 'https://assets.mixkit.co/active_storage/sfx/1996/1996-preview.mp3',
        volume: 0.3,
        loop: true
      },
      {
        id: 'jakarta-traffic',
        name: 'Urban Traffic',
        category: 'urban',
        url: 'https://assets.mixkit.co/active_storage/sfx/2373/2373-preview.mp3',
        volume: 0.15,
        loop: true
      }
    ]
  }
};

/**
 * Get soundscape for a location
 */
export function getSoundscapeForLocation(locationId: string): LocationSoundscape | null {
  return LOCATION_SOUNDSCAPES[locationId] || null;
}

/**
 * Text-to-Speech utility using Web Speech API (FIXED)
 * With comprehensive error handling to prevent "tit tit tit" error sounds
 */
export class TTSNarrator {
  private synthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isAvailable: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.synthesis = window.speechSynthesis;
        this.isAvailable = true;
        this.loadVoices();
      } catch (error) {
        console.warn('TTS initialization failed:', error);
        this.isAvailable = false;
      }
    } else {
      console.warn('Speech Synthesis not available in this browser');
      this.isAvailable = false;
    }
  }

  private loadVoices(): void {
    if (!this.synthesis) return;

    try {
      const voices = this.synthesis.getVoices();
      
      // Prefer English (US) voice, fallback to any English voice, then any voice
      this.voice = 
        voices.find(v => v.lang === 'en-US') || 
        voices.find(v => v.lang.startsWith('en')) || 
        voices[0] || 
        null;
      
      // Chrome loads voices asynchronously
      if (voices.length === 0) {
        this.synthesis.addEventListener('voiceschanged', () => {
          try {
            const updatedVoices = this.synthesis!.getVoices();
            this.voice = 
              updatedVoices.find(v => v.lang === 'en-US') || 
              updatedVoices.find(v => v.lang.startsWith('en')) || 
              updatedVoices[0] || 
              null;
          } catch (error) {
            console.warn('Failed to load voices:', error);
          }
        }, { once: true });
      }
    } catch (error) {
      console.warn('Voice loading failed:', error);
      this.voice = null;
    }
  }

  speak(text: string, rate: number = 1.0, pitch: number = 1.0): void {
    // Validation checks
    if (!this.synthesis || !this.isAvailable) {
      console.warn('TTS not available - speech cancelled');
      return;
    }

    if (!text || text.trim().length === 0) {
      console.warn('Empty text - speech cancelled');
      return;
    }

    if (text.length > 5000) {
      console.warn('Text too long - truncating to 5000 chars');
      text = text.substring(0, 5000);
    }

    try {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice if available
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      // Set properties with safe defaults
      utterance.rate = Math.max(0.1, Math.min(10, rate));
      utterance.pitch = Math.max(0, Math.min(2, pitch));
      utterance.volume = 0.8;
      utterance.lang = this.voice?.lang || 'en-US';

      // Add event listeners for error handling
      utterance.onerror = (event) => {
        console.warn('TTS error:', event.error, event);
        this.currentUtterance = null;
        
        // Stop synthesis to prevent repeated errors
        if (this.synthesis) {
          try {
            this.synthesis.cancel();
          } catch (e) {
            console.warn('Error cancelling synthesis:', e);
          }
        }
      };

      utterance.onend = () => {
        this.currentUtterance = null;
      };

      utterance.onstart = () => {
        // Speech started successfully
      };

      // Store reference
      this.currentUtterance = utterance;

      // Attempt to speak
      this.synthesis.speak(utterance);

    } catch (error) {
      console.warn('TTS speak error:', error);
      this.currentUtterance = null;
      
      // Try to cancel to prevent error sounds
      try {
        if (this.synthesis) {
          this.synthesis.cancel();
        }
      } catch (e) {
        console.warn('Error during cleanup:', e);
      }
    }
  }

  stop(): void {
    try {
      if (this.synthesis) {
        this.synthesis.cancel();
      }
      this.currentUtterance = null;
    } catch (error) {
      console.warn('TTS stop error:', error);
    }
  }

  pause(): void {
    try {
      if (this.synthesis && this.synthesis.speaking) {
        this.synthesis.pause();
      }
    } catch (error) {
      console.warn('TTS pause error:', error);
    }
  }

  resume(): void {
    try {
      if (this.synthesis && this.synthesis.paused) {
        this.synthesis.resume();
      }
    } catch (error) {
      console.warn('TTS resume error:', error);
    }
  }

  get isSpeaking(): boolean {
    try {
      return this.synthesis ? this.synthesis.speaking : false;
    } catch (error) {
      return false;
    }
  }

  get isReady(): boolean {
    return this.isAvailable && this.voice !== null;
  }
}
