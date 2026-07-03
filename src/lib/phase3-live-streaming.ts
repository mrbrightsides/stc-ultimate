// Phase 3: Live Streaming Integration System
// Real-time video tours and live event broadcasting

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  destination: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  thumbnail: string;
  status: 'live' | 'scheduled' | 'ended';
  viewers: number;
  startedAt: Date;
  scheduledFor?: Date;
  duration: number; // minutes
  category: 'tour' | 'event' | 'cultural' | 'adventure' | 'food' | 'nature';
  language: string;
  tags: string[];
  isRecorded: boolean;
  isPremium: boolean;
  price: number;
  quality: '720p' | '1080p' | '4K';
  features: string[];
  chat: ChatMessage[];
  donations: number;
  shareCount: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'donation' | 'system';
  amount?: number;
}

export interface StreamSchedule {
  id: string;
  title: string;
  destination: string;
  streamer: string;
  scheduledFor: Date;
  duration: number;
  category: string;
  reminders: number;
}

export interface LiveStreamingStats {
  totalStreams: number;
  activeStreams: number;
  totalViewers: number;
  totalDonations: number;
  averageViewersPerStream: number;
  mostPopularDestination: string;
  peakViewerTime: string;
  totalWatchTime: number; // hours
}

export interface StreamAnalytics {
  streamId: string;
  peakViewers: number;
  averageViewers: number;
  totalViews: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    donations: number;
  };
  viewerRetention: number; // percentage
  chatActivityLevel: 'low' | 'medium' | 'high';
  quality: {
    averageBitrate: number;
    droppedFrames: number;
    buffering: number;
  };
}

// Mock Live Streaming Service
class LiveStreamingService {
  private streams: LiveStream[] = [
    {
      id: 'stream-1',
      title: 'Sunrise at Borobudur Temple - Live Buddhist Ceremony',
      description: 'Join us for a magical sunrise experience at the world\'s largest Buddhist temple. Witness morning prayers and stunning views.',
      destination: 'Borobudur, Yogyakarta',
      streamer: {
        id: 'streamer-1',
        name: 'Budi Travel Guide',
        avatar: '👨‍🏫',
        verified: true,
        followers: 45230
      },
      thumbnail: '🌅',
      status: 'live',
      viewers: 2847,
      startedAt: new Date(Date.now() - 35 * 60000),
      duration: 120,
      category: 'cultural',
      language: 'English',
      tags: ['temple', 'sunrise', 'buddhist', 'unesco', 'heritage'],
      isRecorded: true,
      isPremium: false,
      price: 0,
      quality: '4K',
      features: ['360° view', 'Multi-angle', 'Chat', 'Q&A'],
      chat: [],
      donations: 1250000,
      shareCount: 342
    },
    {
      id: 'stream-2',
      title: 'Underwater Adventure in Raja Ampat - Diving with Manta Rays',
      description: 'Experience the world\'s best diving spot live! Swimming with manta rays, tropical fish, and pristine coral reefs.',
      destination: 'Raja Ampat, West Papua',
      streamer: {
        id: 'streamer-2',
        name: 'Marine Explorer Siti',
        avatar: '🤿',
        verified: true,
        followers: 78920
      },
      thumbnail: '🌊',
      status: 'live',
      viewers: 5234,
      startedAt: new Date(Date.now() - 82 * 60000),
      duration: 180,
      category: 'adventure',
      language: 'English/Indonesian',
      tags: ['diving', 'underwater', 'marine life', 'raja ampat', 'snorkeling'],
      isRecorded: true,
      isPremium: true,
      price: 50000,
      quality: '1080p',
      features: ['Underwater camera', 'Marine biologist commentary', 'Chat', 'Donations'],
      chat: [],
      donations: 3750000,
      shareCount: 891
    },
    {
      id: 'stream-3',
      title: 'Javanese Traditional Dance Performance - Ramayana Ballet',
      description: 'Live performance of the epic Ramayana story through traditional Javanese dance at Prambanan Temple complex.',
      destination: 'Prambanan, Yogyakarta',
      streamer: {
        id: 'streamer-3',
        name: 'Cultural Heritage Team',
        avatar: '💃',
        verified: true,
        followers: 23450
      },
      thumbnail: '🎭',
      status: 'live',
      viewers: 1876,
      startedAt: new Date(Date.now() - 45 * 60000),
      duration: 150,
      category: 'cultural',
      language: 'Indonesian/English subtitles',
      tags: ['dance', 'cultural', 'ramayana', 'traditional', 'performance'],
      isRecorded: true,
      isPremium: false,
      price: 0,
      quality: '1080p',
      features: ['Multi-camera', 'Behind the scenes', 'Chat', 'Cultural insights'],
      chat: [],
      donations: 890000,
      shareCount: 234
    },
    {
      id: 'stream-4',
      title: 'Mount Bromo Volcano Trek - Live Sunrise Hike',
      description: 'Scheduled: Trek to the iconic Mount Bromo volcano for an unforgettable sunrise experience. Live Q&A with expert guide.',
      destination: 'Mount Bromo, East Java',
      streamer: {
        id: 'streamer-4',
        name: 'Adventure Trekking Pro',
        avatar: '🏔️',
        verified: true,
        followers: 56780
      },
      thumbnail: '🌋',
      status: 'scheduled',
      viewers: 0,
      startedAt: new Date(),
      scheduledFor: new Date(Date.now() + 18 * 3600000),
      duration: 240,
      category: 'adventure',
      language: 'English',
      tags: ['volcano', 'trekking', 'sunrise', 'adventure', 'nature'],
      isRecorded: true,
      isPremium: false,
      price: 0,
      quality: '4K',
      features: ['Drone footage', 'Weather updates', 'Safety tips', 'Chat'],
      chat: [],
      donations: 0,
      shareCount: 0
    },
    {
      id: 'stream-5',
      title: 'Indonesian Street Food Tour - Jakarta Night Market',
      description: 'Scheduled: Explore Jakarta\'s vibrant night markets and taste authentic Indonesian street food. Live cooking demonstrations!',
      destination: 'Jakarta',
      streamer: {
        id: 'streamer-5',
        name: 'Foodie Adventures ID',
        avatar: '🍜',
        verified: true,
        followers: 92340
      },
      thumbnail: '🍢',
      status: 'scheduled',
      viewers: 0,
      startedAt: new Date(),
      scheduledFor: new Date(Date.now() + 6 * 3600000),
      duration: 120,
      category: 'food',
      language: 'Indonesian/English',
      tags: ['food', 'street food', 'jakarta', 'culinary', 'night market'],
      isRecorded: true,
      isPremium: false,
      price: 0,
      quality: '1080p',
      features: ['Recipe sharing', 'Vendor interviews', 'Chat', 'Taste reviews'],
      chat: [],
      donations: 0,
      shareCount: 0
    },
    {
      id: 'stream-6',
      title: 'Traditional Batik Workshop - Live Crafting Session',
      description: 'Ended: Watch master artisans create intricate batik patterns. Learn about this UNESCO-recognized art form.',
      destination: 'Solo, Central Java',
      streamer: {
        id: 'streamer-6',
        name: 'Heritage Crafts Studio',
        avatar: '🎨',
        verified: true,
        followers: 34560
      },
      thumbnail: '🧵',
      status: 'ended',
      viewers: 0,
      startedAt: new Date(Date.now() - 24 * 3600000),
      duration: 90,
      category: 'cultural',
      language: 'Indonesian/English',
      tags: ['batik', 'crafts', 'traditional', 'unesco', 'workshop'],
      isRecorded: true,
      isPremium: false,
      price: 0,
      quality: '1080p',
      features: ['Close-up views', 'Artisan interviews', 'Replay available'],
      chat: [],
      donations: 560000,
      shareCount: 178
    }
  ];

  private stats: LiveStreamingStats = {
    totalStreams: 1247,
    activeStreams: 3,
    totalViewers: 9957,
    totalDonations: 6450000,
    averageViewersPerStream: 3319,
    mostPopularDestination: 'Raja Ampat',
    peakViewerTime: '06:00 - 08:00 (Sunrise)',
    totalWatchTime: 18943
  };

  getActiveStreams(): LiveStream[] {
    return this.streams.filter(s => s.status === 'live');
  }

  getScheduledStreams(): LiveStream[] {
    return this.streams.filter(s => s.status === 'scheduled');
  }

  getAllStreams(): LiveStream[] {
    return [...this.streams];
  }

  getStreamById(id: string): LiveStream | undefined {
    return this.streams.find(s => s.id === id);
  }

  getStats(): LiveStreamingStats {
    return { ...this.stats };
  }

  async joinStream(streamId: string): Promise<{ success: boolean; streamUrl?: string; error?: string }> {
    const stream = this.getStreamById(streamId);
    
    if (!stream) {
      return { success: false, error: 'Stream not found' };
    }

    if (stream.status !== 'live') {
      return { success: false, error: 'Stream is not currently live' };
    }

    if (stream.isPremium && stream.price > 0) {
      // In real implementation, would check payment status
      return { 
        success: true, 
        streamUrl: `wss://stream.stc-ultimate.com/${streamId}` 
      };
    }

    return { 
      success: true, 
      streamUrl: `wss://stream.stc-ultimate.com/${streamId}` 
    };
  }

  async sendChatMessage(streamId: string, message: string, userId: string, username: string): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      username,
      avatar: '👤',
      message,
      timestamp: new Date(),
      type: 'message'
    };

    const stream = this.getStreamById(streamId);
    if (stream) {
      stream.chat.push(chatMessage);
    }

    return chatMessage;
  }

  async sendDonation(streamId: string, amount: number, userId: string, username: string): Promise<ChatMessage> {
    const donationMessage: ChatMessage = {
      id: `donation-${Date.now()}`,
      userId,
      username,
      avatar: '💰',
      message: `Donated ${amount.toLocaleString()} IDR`,
      timestamp: new Date(),
      type: 'donation',
      amount
    };

    const stream = this.getStreamById(streamId);
    if (stream) {
      stream.chat.push(donationMessage);
      stream.donations += amount;
      this.stats.totalDonations += amount;
    }

    return donationMessage;
  }

  async scheduleReminder(streamId: string, userId: string): Promise<boolean> {
    const stream = this.getStreamById(streamId);
    if (stream && stream.status === 'scheduled') {
      // In real implementation, would set up notification
      return true;
    }
    return false;
  }

  getStreamAnalytics(streamId: string): StreamAnalytics | null {
    const stream = this.getStreamById(streamId);
    if (!stream) return null;

    return {
      streamId,
      peakViewers: stream.viewers + Math.floor(Math.random() * 1000),
      averageViewers: Math.floor(stream.viewers * 0.7),
      totalViews: stream.viewers * 3,
      engagement: {
        likes: Math.floor(stream.viewers * 0.4),
        shares: stream.shareCount,
        comments: stream.chat.length,
        donations: stream.donations
      },
      viewerRetention: 78 + Math.random() * 20,
      chatActivityLevel: stream.viewers > 3000 ? 'high' : stream.viewers > 1000 ? 'medium' : 'low',
      quality: {
        averageBitrate: stream.quality === '4K' ? 25000 : stream.quality === '1080p' ? 8000 : 3000,
        droppedFrames: Math.floor(Math.random() * 50),
        buffering: Math.floor(Math.random() * 5)
      }
    };
  }
}

export const liveStreamingService = new LiveStreamingService();
