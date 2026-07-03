/**
 * Phase 4: Real-time Collaboration System
 * Enables multi-user sessions, chat, whiteboard, and video conferencing
 */

export interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  participants: Participant[];
  chat: ChatMessage[];
  whiteboard: WhiteboardAnnotation[];
  videoConference: VideoConferenceData | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'ended';
}

export interface Participant {
  id: string;
  name: string;
  role: 'tourist' | 'sme' | 'researcher' | 'admin';
  avatar: string;
  status: 'online' | 'offline' | 'away';
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file';
}

export interface WhiteboardAnnotation {
  id: string;
  userId: string;
  userName: string;
  type: 'draw' | 'text' | 'shape' | 'sticky';
  data: any;
  timestamp: Date;
}

export interface VideoConferenceData {
  sessionId: string;
  participants: string[];
  isRecording: boolean;
  screenSharing: boolean;
  startedAt: Date;
}

export interface CollaborationStats {
  totalSessions: number;
  activeSessions: number;
  totalParticipants: number;
  averageDuration: number;
  messagesExchanged: number;
  whiteboardAnnotations: number;
  satisfactionRate: number;
}

// Mock Data
const MOCK_SESSIONS: CollaborationSession[] = [
  {
    id: 'sess-1',
    name: 'Bali Tourism Planning',
    description: 'Collaborative planning for Bali tour package',
    participants: [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        role: 'tourist',
        avatar: '👩‍💼',
        status: 'online',
        joinedAt: new Date(Date.now() - 3600000)
      },
      {
        id: 'user-2',
        name: 'Budi Santoso',
        role: 'sme',
        avatar: '🧑‍💼',
        status: 'online',
        joinedAt: new Date(Date.now() - 3000000)
      },
      {
        id: 'user-3',
        name: 'Dr. Maria Rodriguez',
        role: 'researcher',
        avatar: '👩‍🔬',
        status: 'away',
        joinedAt: new Date(Date.now() - 2400000)
      }
    ],
    chat: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'Sarah Chen',
        message: 'Hi everyone! I\'m planning a 5-day trip to Bali',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      },
      {
        id: 'msg-2',
        senderId: 'user-2',
        senderName: 'Budi Santoso',
        message: 'Great! I can help with local accommodations and guides',
        timestamp: new Date(Date.now() - 1500000),
        type: 'text'
      },
      {
        id: 'msg-3',
        senderId: 'user-3',
        senderName: 'Dr. Maria Rodriguez',
        message: 'I can provide insights on cultural significance of sites',
        timestamp: new Date(Date.now() - 1200000),
        type: 'text'
      }
    ],
    whiteboard: [
      {
        id: 'anno-1',
        userId: 'user-1',
        userName: 'Sarah Chen',
        type: 'text',
        data: { text: 'Day 1: Ubud Cultural Tour', x: 100, y: 100 },
        timestamp: new Date(Date.now() - 900000)
      },
      {
        id: 'anno-2',
        userId: 'user-2',
        userName: 'Budi Santoso',
        type: 'sticky',
        data: { text: 'Recommended hotel: Ubud Paradise', x: 150, y: 200 },
        timestamp: new Date(Date.now() - 600000)
      }
    ],
    videoConference: {
      sessionId: 'video-1',
      participants: ['user-1', 'user-2'],
      isRecording: false,
      screenSharing: false,
      startedAt: new Date(Date.now() - 600000)
    },
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 60000),
    status: 'active'
  },
  {
    id: 'sess-2',
    name: 'Research Data Analysis Session',
    description: 'Analyzing tourism blockchain transaction data',
    participants: [
      {
        id: 'user-3',
        name: 'Dr. Maria Rodriguez',
        role: 'researcher',
        avatar: '👩‍🔬',
        status: 'online',
        joinedAt: new Date(Date.now() - 7200000)
      },
      {
        id: 'user-4',
        name: 'Admin John',
        role: 'admin',
        avatar: '👨‍💻',
        status: 'online',
        joinedAt: new Date(Date.now() - 6000000)
      }
    ],
    chat: [
      {
        id: 'msg-4',
        senderId: 'user-3',
        senderName: 'Dr. Maria Rodriguez',
        message: 'Looking at the transaction patterns from last month',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: 'msg-5',
        senderId: 'user-4',
        senderName: 'Admin John',
        message: 'I can export the raw data for you',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text'
      }
    ],
    whiteboard: [
      {
        id: 'anno-3',
        userId: 'user-3',
        userName: 'Dr. Maria Rodriguez',
        type: 'shape',
        data: { type: 'rectangle', x: 50, y: 50, width: 200, height: 100 },
        timestamp: new Date(Date.now() - 2400000)
      }
    ],
    videoConference: null,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 120000),
    status: 'active'
  }
];

/**
 * Get all collaboration sessions
 */
export function getCollaborationSessions(): CollaborationSession[] {
  const sessions = JSON.parse(JSON.stringify(MOCK_SESSIONS));
  // Convert date strings back to Date objects
  return sessions.map((session: any) => ({
    ...session,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    participants: session.participants.map((p: any) => ({
      ...p,
      joinedAt: new Date(p.joinedAt)
    })),
    chat: session.chat.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    whiteboard: session.whiteboard.map((anno: any) => ({
      ...anno,
      timestamp: new Date(anno.timestamp)
    })),
    videoConference: session.videoConference ? {
      ...session.videoConference,
      startedAt: new Date(session.videoConference.startedAt)
    } : null
  }));
}

/**
 * Get active collaboration sessions
 */
export function getActiveSessions(): CollaborationSession[] {
  return MOCK_SESSIONS.filter(s => s.status === 'active');
}

/**
 * Get session by ID
 */
export function getSessionById(sessionId: string): CollaborationSession | null {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session) return null;
  
  const sessionCopy = JSON.parse(JSON.stringify(session));
  // Convert date strings back to Date objects
  return {
    ...sessionCopy,
    createdAt: new Date(sessionCopy.createdAt),
    updatedAt: new Date(sessionCopy.updatedAt),
    participants: sessionCopy.participants.map((p: any) => ({
      ...p,
      joinedAt: new Date(p.joinedAt)
    })),
    chat: sessionCopy.chat.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    whiteboard: sessionCopy.whiteboard.map((anno: any) => ({
      ...anno,
      timestamp: new Date(anno.timestamp)
    })),
    videoConference: sessionCopy.videoConference ? {
      ...sessionCopy.videoConference,
      startedAt: new Date(sessionCopy.videoConference.startedAt)
    } : null
  };
}

/**
 * Get collaboration statistics
 */
export function getCollaborationStats(): CollaborationStats {
  return {
    totalSessions: 1847,
    activeSessions: 12,
    totalParticipants: 4523,
    averageDuration: 45.3, // minutes
    messagesExchanged: 23456,
    whiteboardAnnotations: 8934,
    satisfactionRate: 94.3 // percentage
  };
}

/**
 * Add message to session
 */
export function addChatMessage(
  sessionId: string,
  senderId: string,
  senderName: string,
  message: string
): ChatMessage | null {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session) return null;

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId,
    senderName,
    message,
    timestamp: new Date(),
    type: 'text'
  };

  session.chat.push(newMessage);
  session.updatedAt = new Date();

  return newMessage;
}

/**
 * Add whiteboard annotation
 */
export function addWhiteboardAnnotation(
  sessionId: string,
  userId: string,
  userName: string,
  type: WhiteboardAnnotation['type'],
  data: any
): WhiteboardAnnotation | null {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session) return null;

  const annotation: WhiteboardAnnotation = {
    id: `anno-${Date.now()}`,
    userId,
    userName,
    type,
    data,
    timestamp: new Date()
  };

  session.whiteboard.push(annotation);
  session.updatedAt = new Date();

  return annotation;
}

/**
 * Start video conference
 */
export function startVideoConference(sessionId: string): VideoConferenceData | null {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session) return null;

  const videoData: VideoConferenceData = {
    sessionId: `video-${Date.now()}`,
    participants: session.participants.filter(p => p.status === 'online').map(p => p.id),
    isRecording: false,
    screenSharing: false,
    startedAt: new Date()
  };

  session.videoConference = videoData;
  session.updatedAt = new Date();

  return videoData;
}

/**
 * End video conference
 */
export function endVideoConference(sessionId: string): boolean {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session || !session.videoConference) return false;

  session.videoConference = null;
  session.updatedAt = new Date();

  return true;
}

/**
 * Get collaboration system stats
 */
export function getCollaborationSystem(): {
  activeSessions: number;
  totalParticipants: number;
  totalMessages: number;
  satisfactionRate: number;
  whiteboardAnnotations: number;
  videoConferencing: {
    activeRooms: number;
    totalMinutes: number;
  };
} {
  const stats = getCollaborationStats();
  return {
    activeSessions: stats.activeSessions,
    totalParticipants: stats.totalParticipants,
    totalMessages: stats.messagesExchanged,
    satisfactionRate: stats.satisfactionRate,
    whiteboardAnnotations: stats.whiteboardAnnotations,
    videoConferencing: {
      activeRooms: 8,
      totalMinutes: 45678
    }
  };
}

/**
 * Get sessions (alias for getCollaborationSessions)
 */
export function getSessions(): CollaborationSession[] {
  return getCollaborationSessions();
}

/**
 * Get messages for a session
 */
export function getMessages(sessionId: string): ChatMessage[] {
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (!session) return [];
  
  return session.chat.map(msg => ({
    ...msg,
    sender: msg.senderName,
    content: msg.message,
    timestamp: new Date(msg.timestamp),
    readStatus: 'read' as const
  }));
}

/**
 * Send message to a session
 */
export function sendMessage(sessionId: string, message: string, senderName: string): any {
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: 'current-user',
    senderName,
    message,
    timestamp: new Date(),
    type: 'text'
  };
  
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  if (session) {
    session.chat.push(newMessage);
    session.updatedAt = new Date();
  }
  
  return {
    ...newMessage,
    sender: senderName,
    content: message,
    timestamp: new Date(),
    readStatus: 'sent' as const
  };
}
