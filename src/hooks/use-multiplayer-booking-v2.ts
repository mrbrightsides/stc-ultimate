'use client';

import { useState, useEffect, useCallback } from 'react';
import { createAdapter, SPACETIMEDB_CONFIG } from '@/lib/spacetimedb-adapter';
import type { DataAdapter } from '@/lib/spacetimedb-adapter';

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

export function useMultiplayerBookingV2() {
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [myBookings, setMyBookings] = useState<ActiveBooking[]>([]);
  const [bookingLocks, setBookingLocks] = useState<Map<string, BookingLock>>(new Map());
  const [adapter] = useState<DataAdapter<ActiveBooking>>(() =>
    createAdapter<ActiveBooking>('stc_active_bookings', 'active_bookings')
  );
  const [backendInfo] = useState({
    backend: SPACETIMEDB_CONFIG.backend,
    enabled: SPACETIMEDB_CONFIG.enabled
  });

  // Subscribe to real-time updates from adapter
  useEffect(() => {
    const unsubscribe = adapter.subscribe((bookings) => {
      // Filter out expired bookings
      const valid = bookings.filter(b => b.expiresAt > Date.now());
      setActiveBookings(valid);
    });

    return unsubscribe;
  }, [adapter]);

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

  const startViewing = useCallback(async (destinationId: string, userId: string, userName: string) => {
    const booking: ActiveBooking = {
      id: `${userId}-${Date.now()}`,
      destinationId,
      userId,
      userName,
      status: 'viewing',
      timestamp: Date.now(),
      expiresAt: Date.now() + LOCK_DURATION
    };

    // Save via adapter (works with both LocalStorage and SpacetimeDB)
    await adapter.set(booking.id, booking);
    
    setActiveBookings(prev => [...prev.filter(b => b.userId !== userId || b.destinationId !== destinationId), booking]);
    setMyBookings(prev => [...prev, booking]);

    return booking;
  }, [adapter]);

  const lockBooking = useCallback(async (bookingId: string, userId: string): Promise<boolean> => {
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
    
    // Update booking status
    const booking = activeBookings.find(b => b.id === bookingId);
    if (booking) {
      const updated = {
        ...booking,
        status: 'locked' as const,
        expiresAt: Date.now() + LOCK_DURATION
      };
      await adapter.set(bookingId, updated);
    }

    return true;
  }, [bookingLocks, activeBookings, adapter]);

  const confirmBooking = useCallback(async (bookingId: string) => {
    const booking = activeBookings.find(b => b.id === bookingId);
    if (booking) {
      const updated = { ...booking, status: 'confirmed' as const };
      await adapter.set(bookingId, updated);
    }
    
    setBookingLocks(prev => {
      const updated = new Map(prev);
      updated.delete(bookingId);
      return updated;
    });
  }, [activeBookings, adapter]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    await adapter.delete(bookingId);
    setMyBookings(prev => prev.filter(b => b.id !== bookingId));
    setBookingLocks(prev => {
      const updated = new Map(prev);
      updated.delete(bookingId);
      return updated;
    });
  }, [adapter]);

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
    isLocked,
    backendInfo // Expose backend info for debugging
  };
}
