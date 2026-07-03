/**
 * Collaboration Hub Library
 * Integrated from Phase 4 real-time collaboration features
 */

export interface CollaborationSession {
  id: string;
  name: string;
  type: 'planning' | 'meeting' | 'workshop' | 'brainstorming';
  participants: Array<{
    id: string;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'away';
    avatar: string;
  }>;
  createdAt: Date;
  lastActive: Date;
  features: {
    chat: boolean;
    whiteboard: boolean;
    videoCall: boolean;
    screenShare: boolean;
  };
  stats: {
    messages: number;
    annotations: number;
    duration: number;
  };
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

export interface WhiteboardAnnotation {
  id: string;
  sessionId: string;
  type: 'draw' | 'text' | 'shape' | 'sticky';
  data: any;
  author: string;
  timestamp: Date;
}

export interface CollaborationStats {
  totalSessions: number;
  activeSessions: number;
  totalParticipants: number;
  averageSessionDuration: number;
  totalMessages: number;
  totalAnnotations: number;
  satisfactionRate: number;
}

export function getCollaborationHub(): {
  sessions: CollaborationSession[];
  stats: CollaborationStats;
} {
  const sessions: CollaborationSession[] = [
    {
      id: 'session-001',
      name: 'Bali Tour Planning - Group 5',
      type: 'planning',
      participants: [
        {
          id: 'user-001',
          name: 'Sarah Johnson',
          role: 'Tourist',
          status: 'online',
          avatar: '👩'
        },
        {
          id: 'user-002',
          name: 'Michael Chen',
          role: 'Tourist',
          status: 'online',
          avatar: '👨'
        },
        {
          id: 'user-003',
          name: 'Budi Santoso',
          role: 'Tour Guide',
          status: 'online',
          avatar: '🧑'
        }
      ],
      createdAt: new Date('2024-01-20T09:00:00'),
      lastActive: new Date(),
      features: {
        chat: true,
        whiteboard: true,
        videoCall: true,
        screenShare: true
      },
      stats: {
        messages: 147,
        annotations: 23,
        duration: 45
      }
    },
    {
      id: 'session-002',
      name: 'SME Marketing Strategy Workshop',
      type: 'workshop',
      participants: [
        {
          id: 'user-004',
          name: 'Rina Wijaya',
          role: 'SME Owner',
          status: 'online',
          avatar: '👩‍💼'
        },
        {
          id: 'user-005',
          name: 'Ahmad Fauzi',
          role: 'Marketing Expert',
          status: 'away',
          avatar: '👨‍💼'
        },
        {
          id: 'user-006',
          name: 'Dr. Lisa Martinez',
          role: 'Researcher',
          status: 'online',
          avatar: '👩‍🔬'
        }
      ],
      createdAt: new Date('2024-01-20T14:00:00'),
      lastActive: new Date(Date.now() - 300000),
      features: {
        chat: true,
        whiteboard: true,
        videoCall: false,
        screenShare: true
      },
      stats: {
        messages: 89,
        annotations: 45,
        duration: 90
      }
    }
  ];

  const stats: CollaborationStats = {
    totalSessions: 1847,
    activeSessions: 12,
    totalParticipants: 4523,
    averageSessionDuration: 62,
    totalMessages: 23456,
    totalAnnotations: 8934,
    satisfactionRate: 94.3
  };

  return {
    sessions,
    stats
  };
}

export function getChatMessages(sessionId: string): ChatMessage[] {
  return [
    {
      id: 'msg-001',
      sessionId,
      sender: {
        id: 'user-001',
        name: 'Sarah Johnson',
        avatar: '👩'
      },
      message: 'Hi everyone! Excited to plan our Bali trip together!',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: 'msg-002',
      sessionId,
      sender: {
        id: 'user-003',
        name: 'Budi Santoso',
        avatar: '🧑'
      },
      message: 'Welcome! I\'ve prepared some great itinerary options for you.',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text'
    }
  ];
}

export function sendMessage(sessionId: string, message: string): boolean {
  console.log(`Sending message to session ${sessionId}: ${message}`);
  return true;
}

export function createSession(name: string, type: string): string {
  const sessionId = `session-${Date.now()}`;
  console.log(`Created collaboration session ${sessionId}: ${name}`);
  return sessionId;
}

export function joinSession(sessionId: string, userId: string): boolean {
  console.log(`User ${userId} joined session ${sessionId}`);
  return true;
}

export function startVideoCall(sessionId: string): boolean {
  console.log(`Starting video call in session ${sessionId}`);
  return true;
}

export function addWhiteboardAnnotation(sessionId: string, annotation: Partial<WhiteboardAnnotation>): boolean {
  console.log(`Adding annotation to session ${sessionId}`);
  return true;
}
