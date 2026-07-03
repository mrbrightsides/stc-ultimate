'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ActiveBooking {
  id: string;
  destinationId: string;
  userId: string;
  userName: string;
  status: 'viewing' | 'locked' | 'confirmed' | 'cancelled';
  timestamp: number;
  expiresAt: number;
}

export interface BookingLock {
  bookingId: string;
  lockedBy: string;
  lockedAt: number;
  expiresIn: number;
}

const LOCK_DURATION = 300000; // 5 minutes
const STORAGE_KEY = 'stc_active_bookings';

export function useMultiplayerBooking() {
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [myBookings, setMyBookings] = useState<ActiveBooking[]>([]);
  const [bookingLocks, setBookingLocks] = useState<Map<string, BookingLock>>(new Map());

  // Load from localStorage (offline-first)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bookings = JSON.parse(stored) as ActiveBooking[];
        // Filter out expired bookings
        const valid = bookings.filter(b => b.expiresAt > Date.now());
        setActiveBookings(valid);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBookings));
  }, [activeBookings]);

  // Cleanup expired bookings
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBookings(prev => prev.filter(b => b.expiresAt > now));
      setBookingLocks(prev => {
        const updated = new Map(prev);
        Array.from(updated.entries()).forEach(([id, lock]) => {
          if (lock.lockedAt + lock.expiresIn < now) {
            updated.delete(id);
          }
        });
        return updated;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulated real-time sync (would be SpacetimeDB subscription)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // In production, this would be a WebSocket/gRPC stream
      // For now, we simulate by broadcasting to other tabs
      window.dispatchEvent(new CustomEvent('stc-booking-sync', {
        detail: { bookings: activeBookings }
      }));
    }, 2000);

    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.bookings) {
        setActiveBookings(customEvent.detail.bookings);
      }
    };

    window.addEventListener('stc-booking-sync', handleSync);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('stc-booking-sync', handleSync);
    };
  }, [activeBookings]);

  const startViewing = useCallback((destinationId: string, userId: string, userName: string) => {
    const booking: ActiveBooking = {
      id: `${userId}-${Date.now()}`,
      destinationId,
      userId,
      userName,
      status: 'viewing',
      timestamp: Date.now(),
      expiresAt: Date.now() + LOCK_DURATION
    };

    setActiveBookings(prev => [...prev.filter(b => b.userId !== userId || b.destinationId !== destinationId), booking]);
    setMyBookings(prev => [...prev, booking]);

    return booking;
  }, []);

  const lockBooking = useCallback((bookingId: string, userId: string): boolean => {
    // Check if already locked by someone else
    const existingLock = bookingLocks.get(bookingId);
    if (existingLock && existingLock.lockedBy !== userId) {
      return false; // Already locked by another user
    }

    const lock: BookingLock = {
      bookingId,
      lockedBy: userId,
      lockedAt: Date.now(),
      expiresIn: LOCK_DURATION
    };

    setBookingLocks(prev => new Map(prev).set(bookingId, lock));
    
    setActiveBookings(prev => 
      prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'locked' as const, expiresAt: Date.now() + LOCK_DURATION }
          : b
      )
    );

    return true;
  }, [bookingLocks]);

  const confirmBooking = useCallback((bookingId: string) => {
    setActiveBookings(prev => 
      prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'confirmed' as const }
          : b
      )
    );
    setBookingLocks(prev => {
      const updated = new Map(prev);
      updated.delete(bookingId);
      return updated;
    });
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));
    setMyBookings(prev => prev.filter(b => b.id !== bookingId));
    setBookingLocks(prev => {
      const updated = new Map(prev);
      updated.delete(bookingId);
      return updated;
    });
  }, []);

  const getActiveViewers = useCallback((destinationId: string) => {
    return activeBookings.filter(b => 
      b.destinationId === destinationId && 
      b.status === 'viewing' &&
      b.expiresAt > Date.now()
    );
  }, [activeBookings]);

  const getBookingCount = useCallback((destinationId: string) => {
    return activeBookings.filter(b => 
      b.destinationId === destinationId && 
      (b.status === 'locked' || b.status === 'confirmed')
    ).length;
  }, [activeBookings]);

  const isLocked = useCallback((destinationId: string) => {
    const locks = activeBookings.filter(b => 
      b.destinationId === destinationId && 
      b.status === 'locked' &&
      b.expiresAt > Date.now()
    );
    return locks.length > 0;
  }, [activeBookings]);

  return {
    activeBookings,
    myBookings,
    bookingLocks,
    startViewing,
    lockBooking,
    confirmBooking,
    cancelBooking,
    getActiveViewers,
    getBookingCount,
    isLocked
  };
}
