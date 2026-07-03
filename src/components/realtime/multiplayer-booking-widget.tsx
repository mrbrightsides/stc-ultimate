'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMultiplayerBooking } from '@/hooks/use-multiplayer-booking';
import { Clock, Lock, Users, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { fadeIn, slideInFromBottom, staggerContainer, staggerItem } from '@/lib/animations';

interface MultiplayerBookingWidgetProps {
  destinationId: string;
  destinationName: string;
  currentUserId: string;
  currentUserName: string;
  onBookingConfirmed?: () => void;
}

export function MultiplayerBookingWidget({
  destinationId,
  destinationName,
  currentUserId,
  currentUserName,
  onBookingConfirmed
}: MultiplayerBookingWidgetProps) {
  const {
    activeBookings,
    myBookings,
    startViewing,
    lockBooking,
    confirmBooking,
    cancelBooking,
    getActiveViewers,
    getBookingCount,
    isLocked
  } = useMultiplayerBooking();

  const [myCurrentBooking, setMyCurrentBooking] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'viewing' | 'locked' | 'confirmed'>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeViewers = getActiveViewers(destinationId);
  const bookingCount = getBookingCount(destinationId);
  const destinationLocked = isLocked(destinationId);

  useEffect(() => {
    const myBooking = myBookings.find(b => b.destinationId === destinationId);
    if (myBooking) {
      setMyCurrentBooking(myBooking.id);
      setBookingStatus(myBooking.status === 'viewing' ? 'viewing' : myBooking.status === 'locked' ? 'locked' : 'confirmed');
    }
  }, [myBookings, destinationId]);

  const handleStartViewing = () => {
    setIsLoading(true);
    setTimeout(() => {
      const booking = startViewing(destinationId, currentUserId, currentUserName);
      setMyCurrentBooking(booking.id);
      setBookingStatus('viewing');
      setIsLoading(false);
    }, 500);
  };

  const handleLockBooking = () => {
    if (!myCurrentBooking) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const success = lockBooking(myCurrentBooking, currentUserId);
      if (success) {
        setBookingStatus('locked');
      } else {
        alert('This destination is already locked by another user. Please wait or choose another destination.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleConfirmBooking = () => {
    if (!myCurrentBooking) return;
    
    setIsLoading(true);
    setTimeout(() => {
      confirmBooking(myCurrentBooking);
      setBookingStatus('confirmed');
      
      if (onBookingConfirmed) {
        onBookingConfirmed();
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCancelBooking = () => {
    if (!myCurrentBooking) return;
    
    cancelBooking(myCurrentBooking);
    setMyCurrentBooking(null);
    setBookingStatus('idle');
  };

  const getTimeRemaining = (booking: typeof activeBookings[0]) => {
    const remaining = Math.max(0, booking.expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      {...fadeIn}
      className="relative"
    >
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          Live Booking Status: {destinationName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
            >
              <LoadingSpinner size="lg" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Active Viewers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Viewers</span>
            <Badge variant="outline" className="bg-white">
              <Eye className="mr-1 h-3 w-3" />
              {activeViewers.length}
            </Badge>
          </div>
          
          <AnimatePresence mode="popLayout">
            {activeViewers.length > 0 && (
              <motion.div
                {...staggerContainer}
                className="flex flex-wrap gap-2"
              >
                {activeViewers.map((viewer) => (
                  <motion.div
                    key={viewer.id}
                    {...staggerItem}
                    layout
                    className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs border border-gray-200"
                  >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {viewer.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                    <span className="text-gray-700">{viewer.userName}</span>
                    {viewer.userId === currentUserId && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">You</Badge>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Booking Count */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">Active Bookings</span>
          <Badge variant={bookingCount > 0 ? "default" : "secondary"}>
            {bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'}
          </Badge>
        </div>

        {/* Lock Status */}
        {destinationLocked && bookingStatus !== 'locked' && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <Lock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">This destination is currently locked by another user</span>
          </div>
        )}

        {/* Booking Actions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bookingStatus}
            {...slideInFromBottom}
            className="space-y-2"
          >
          {bookingStatus === 'idle' && (
            <Button 
              onClick={handleStartViewing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Start Viewing
            </Button>
          )}

          {bookingStatus === 'viewing' && (
            <div className="space-y-2">
              <Button 
                onClick={handleLockBooking}
                disabled={destinationLocked}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Lock className="mr-2 h-4 w-4" />
                Lock Booking (5 min)
              </Button>
              <Button 
                onClick={handleCancelBooking}
                variant="outline"
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          {bookingStatus === 'locked' && myCurrentBooking && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Booking Locked</span>
                </div>
                <Badge variant="secondary" className="bg-white">
                  <Clock className="mr-1 h-3 w-3" />
                  {getTimeRemaining(activeBookings.find(b => b.id === myCurrentBooking)!)}
                </Badge>
              </div>
              
              <Button 
                onClick={handleConfirmBooking}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
              <Button 
                onClick={handleCancelBooking}
                variant="outline"
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          {bookingStatus === 'confirmed' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">Booking Confirmed!</p>
              <p className="text-xs text-gray-600 mt-1">Your booking has been successfully confirmed</p>
            </div>
          )}
          </motion.div>
        </AnimatePresence>

        {/* Real-time Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-500">Real-time updates active</span>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
