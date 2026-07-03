'use client';

import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'traveler' | 'guide' | 'hotel_staff';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'destination' | 'hotel' | 'group';
  participantCount: number;
  lastActivity: number;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'stc_chat_';
const TYPING_TIMEOUT = 3000; // 3 seconds

export function useLiveChat(roomId: string, currentUserId: string, currentUserName: string, currentUserRole: UserRole) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [participantCount, setParticipantCount] = useState<number>(1);

  // Load messages from localStorage (offline-first)
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${roomId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const msgs = JSON.parse(stored) as ChatMessage[];
        setMessages(msgs);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  }, [roomId]);

  // Persist messages to localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${roomId}`;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, roomId]);

  // Simulated connection status
  useEffect(() => {
    setIsConnected(true);
    
    // Simulate connection check
    const interval = setInterval(() => {
      setIsConnected(navigator.onLine);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time message sync (would be SpacetimeDB subscription)
  useEffect(() => {
    const handleMessageSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.roomId === roomId && customEvent.detail?.message) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === customEvent.detail.message.id);
          if (exists) return prev;
          return [...prev, customEvent.detail.message];
        });
      }
    };

    const handleTypingSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.roomId === roomId && customEvent.detail?.indicator) {
        setTypingUsers(prev => {
          const filtered = prev.filter(t => t.userId !== customEvent.detail.indicator.userId);
          return [...filtered, customEvent.detail.indicator];
        });
      }
    };

    const handleParticipantSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.roomId === roomId) {
        setParticipantCount(customEvent.detail.count || 1);
      }
    };

    window.addEventListener('stc-chat-message', handleMessageSync);
    window.addEventListener('stc-chat-typing', handleTypingSync);
    window.addEventListener('stc-chat-participants', handleParticipantSync);

    return () => {
      window.removeEventListener('stc-chat-message', handleMessageSync);
      window.removeEventListener('stc-chat-typing', handleTypingSync);
      window.removeEventListener('stc-chat-participants', handleParticipantSync);
    };
  }, [roomId]);

  // Cleanup typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => prev.filter(t => now - t.timestamp < TYPING_TIMEOUT));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback((content: string) => {
    const message: ChatMessage = {
      id: `${currentUserId}-${Date.now()}`,
      roomId,
      userId: currentUserId,
      userName: currentUserName,
      userRole: currentUserRole,
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, message]);

    // Broadcast to other tabs/clients (would be SpacetimeDB reducer call)
    window.dispatchEvent(new CustomEvent('stc-chat-message', {
      detail: { roomId, message }
    }));

    return message;
  }, [roomId, currentUserId, currentUserName, currentUserRole]);

  const sendSystemMessage = useCallback((content: string) => {
    const message: ChatMessage = {
      id: `system-${Date.now()}`,
      roomId,
      userId: 'system',
      userName: 'System',
      userRole: 'traveler',
      content,
      timestamp: Date.now(),
      isSystem: true
    };

    setMessages(prev => [...prev, message]);

    window.dispatchEvent(new CustomEvent('stc-chat-message', {
      detail: { roomId, message }
    }));

    return message;
  }, [roomId]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (isTyping) {
      const indicator: TypingIndicator = {
        userId: currentUserId,
        userName: currentUserName,
        timestamp: Date.now()
      };

      window.dispatchEvent(new CustomEvent('stc-chat-typing', {
        detail: { roomId, indicator }
      }));
    } else {
      setTypingUsers(prev => prev.filter(t => t.userId !== currentUserId));
    }
  }, [roomId, currentUserId, currentUserName]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    const storageKey = `${STORAGE_KEY_PREFIX}${roomId}`;
    localStorage.removeItem(storageKey);
  }, [roomId]);

  const getMessagesByRole = useCallback((role: UserRole) => {
    return messages.filter(m => m.userRole === role);
  }, [messages]);

  const getRecentMessages = useCallback((count: number = 50) => {
    return messages.slice(-count);
  }, [messages]);

  return {
    messages,
    typingUsers,
    isConnected,
    participantCount,
    sendMessage,
    sendSystemMessage,
    setTyping,
    clearMessages,
    getMessagesByRole,
    getRecentMessages
  };
}
