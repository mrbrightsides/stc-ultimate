'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ItineraryActivity {
  id: string;
  itineraryId: string;
  title: string;
  description: string;
  destinationId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  cost: number;
  addedBy: string;
  addedByName: string;
  votes: Map<string, 'up' | 'down'>;
  voteCount: number;
  status: 'proposed' | 'confirmed' | 'completed' | 'cancelled';
  timestamp: number;
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  participants: Participant[];
  activities: ItineraryActivity[];
  startDate: string;
  endDate: string;
  budget: number;
  createdAt: number;
  updatedAt: number;
}

export interface Participant {
  userId: string;
  userName: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: number;
  lastSeen: number;
  isOnline: boolean;
}

export interface ActivityUpdate {
  type: 'add' | 'update' | 'remove' | 'vote';
  activityId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'stc_itinerary_';
const ONLINE_TIMEOUT = 60000; // 1 minute

export function useCollaborativeItinerary(itineraryId: string, currentUserId: string, currentUserName: string) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<ActivityUpdate[]>([]);
  const [onlineParticipants, setOnlineParticipants] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Load from localStorage (offline-first)
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${itineraryId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Reconstruct Map objects
        const itin: Itinerary = {
          ...data,
          activities: data.activities.map((a: ItineraryActivity) => ({
            ...a,
            votes: new Map(Object.entries(a.votes || {}))
          }))
        };
        setItinerary(itin);
      } catch (error) {
        console.error('Failed to load itinerary:', error);
      }
    }
  }, [itineraryId]);

  // Persist to localStorage
  useEffect(() => {
    if (itinerary) {
      const storageKey = `${STORAGE_KEY_PREFIX}${itineraryId}`;
      // Convert Map to object for storage
      const serializable = {
        ...itinerary,
        activities: itinerary.activities.map(a => ({
          ...a,
          votes: Object.fromEntries(a.votes)
        }))
      };
      localStorage.setItem(storageKey, JSON.stringify(serializable));
    }
  }, [itinerary, itineraryId]);

  // Real-time sync (would be SpacetimeDB subscription)
  useEffect(() => {
    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.itineraryId === itineraryId) {
        setSyncStatus('syncing');
        
        if (customEvent.detail.update) {
          setRecentUpdates(prev => [...prev.slice(-9), customEvent.detail.update]);
        }
        
        if (customEvent.detail.itinerary) {
          setItinerary(customEvent.detail.itinerary);
        }
        
        setTimeout(() => setSyncStatus('synced'), 500);
      }
    };

    const handlePresence = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.itineraryId === itineraryId) {
        setOnlineParticipants(customEvent.detail.participants || []);
      }
    };

    window.addEventListener('stc-itinerary-sync', handleSync);
    window.addEventListener('stc-itinerary-presence', handlePresence);

    // Announce presence
    const presenceInterval = setInterval(() => {
      window.dispatchEvent(new CustomEvent('stc-itinerary-presence', {
        detail: {
          itineraryId,
          userId: currentUserId,
          timestamp: Date.now()
        }
      }));
    }, 5000);

    return () => {
      window.removeEventListener('stc-itinerary-sync', handleSync);
      window.removeEventListener('stc-itinerary-presence', handlePresence);
      clearInterval(presenceInterval);
    };
  }, [itineraryId, currentUserId]);

  // Update participant online status
  useEffect(() => {
    if (itinerary) {
      const now = Date.now();
      setItinerary(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map(p => ({
            ...p,
            isOnline: onlineParticipants.includes(p.userId) || (now - p.lastSeen < ONLINE_TIMEOUT)
          }))
        };
      });
    }
  }, [onlineParticipants, itinerary]);

  const createItinerary = useCallback((name: string, description: string, startDate: string, endDate: string, budget: number) => {
    const newItinerary: Itinerary = {
      id: itineraryId,
      name,
      description,
      ownerId: currentUserId,
      ownerName: currentUserName,
      participants: [{
        userId: currentUserId,
        userName: currentUserName,
        role: 'owner',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        isOnline: true
      }],
      activities: [],
      startDate,
      endDate,
      budget,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setItinerary(newItinerary);
    broadcastUpdate(newItinerary);
    
    return newItinerary;
  }, [itineraryId, currentUserId, currentUserName]);

  const addActivity = useCallback((activity: Omit<ItineraryActivity, 'id' | 'itineraryId' | 'addedBy' | 'addedByName' | 'votes' | 'voteCount' | 'timestamp'>) => {
    if (!itinerary) return null;

    const newActivity: ItineraryActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      itineraryId,
      addedBy: currentUserId,
      addedByName: currentUserName,
      votes: new Map(),
      voteCount: 0,
      timestamp: Date.now()
    };

    const updated = {
      ...itinerary,
      activities: [...itinerary.activities, newActivity],
      updatedAt: Date.now()
    };

    setItinerary(updated);
    
    const updateEvent: ActivityUpdate = {
      type: 'add',
      activityId: newActivity.id,
      userId: currentUserId,
      userName: currentUserName,
      timestamp: Date.now()
    };
    
    setRecentUpdates(prev => [...prev.slice(-9), updateEvent]);
    broadcastUpdate(updated, updateEvent);

    return newActivity;
  }, [itinerary, itineraryId, currentUserId, currentUserName]);

  const updateActivity = useCallback((activityId: string, updates: Partial<ItineraryActivity>) => {
    if (!itinerary) return;

    const updated = {
      ...itinerary,
      activities: itinerary.activities.map(a => 
        a.id === activityId ? { ...a, ...updates } : a
      ),
      updatedAt: Date.now()
    };

    setItinerary(updated);
    
    const updateEvent: ActivityUpdate = {
      type: 'update',
      activityId,
      userId: currentUserId,
      userName: currentUserName,
      timestamp: Date.now()
    };
    
    setRecentUpdates(prev => [...prev.slice(-9), updateEvent]);
    broadcastUpdate(updated, updateEvent);
  }, [itinerary, currentUserId, currentUserName]);

  const removeActivity = useCallback((activityId: string) => {
    if (!itinerary) return;

    const updated = {
      ...itinerary,
      activities: itinerary.activities.filter(a => a.id !== activityId),
      updatedAt: Date.now()
    };

    setItinerary(updated);
    
    const updateEvent: ActivityUpdate = {
      type: 'remove',
      activityId,
      userId: currentUserId,
      userName: currentUserName,
      timestamp: Date.now()
    };
    
    setRecentUpdates(prev => [...prev.slice(-9), updateEvent]);
    broadcastUpdate(updated, updateEvent);
  }, [itinerary, currentUserId, currentUserName]);

  const voteActivity = useCallback((activityId: string, vote: 'up' | 'down') => {
    if (!itinerary) return;

    const updated = {
      ...itinerary,
      activities: itinerary.activities.map(a => {
        if (a.id === activityId) {
          const newVotes = new Map(a.votes);
          newVotes.set(currentUserId, vote);
          
          let voteCount = 0;
          newVotes.forEach((v) => {
            voteCount += v === 'up' ? 1 : -1;
          });

          return { ...a, votes: newVotes, voteCount };
        }
        return a;
      }),
      updatedAt: Date.now()
    };

    setItinerary(updated);
    
    const updateEvent: ActivityUpdate = {
      type: 'vote',
      activityId,
      userId: currentUserId,
      userName: currentUserName,
      timestamp: Date.now()
    };
    
    setRecentUpdates(prev => [...prev.slice(-9), updateEvent]);
    broadcastUpdate(updated, updateEvent);
  }, [itinerary, currentUserId, currentUserName]);

  const addParticipant = useCallback((userId: string, userName: string, role: 'editor' | 'viewer' = 'viewer') => {
    if (!itinerary) return;

    const exists = itinerary.participants.some(p => p.userId === userId);
    if (exists) return;

    const newParticipant: Participant = {
      userId,
      userName,
      role,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      isOnline: true
    };

    const updated = {
      ...itinerary,
      participants: [...itinerary.participants, newParticipant],
      updatedAt: Date.now()
    };

    setItinerary(updated);
    broadcastUpdate(updated);
  }, [itinerary]);

  const broadcastUpdate = (updatedItinerary: Itinerary, update?: ActivityUpdate) => {
    window.dispatchEvent(new CustomEvent('stc-itinerary-sync', {
      detail: {
        itineraryId,
        itinerary: updatedItinerary,
        update
      }
    }));
  };

  const getTotalCost = useCallback(() => {
    if (!itinerary) return 0;
    return itinerary.activities
      .filter(a => a.status === 'confirmed')
      .reduce((sum, a) => sum + a.cost, 0);
  }, [itinerary]);

  const getActivityByDate = useCallback((date: string) => {
    if (!itinerary) return [];
    return itinerary.activities
      .filter(a => a.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [itinerary]);

  return {
    itinerary,
    recentUpdates,
    onlineParticipants,
    syncStatus,
    createItinerary,
    addActivity,
    updateActivity,
    removeActivity,
    voteActivity,
    addParticipant,
    getTotalCost,
    getActivityByDate
  };
}
