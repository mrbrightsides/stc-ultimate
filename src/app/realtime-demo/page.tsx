'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileBottomNav, type NavItem, MobileBottomNavWrapper } from '@/components/ui/mobile-bottom-nav';
import { ToastProvider, useToast } from '@/components/ui/toast-notification';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
  MultiplayerBookingWidget, 
  LiveChatWidget, 
  CollaborativeItineraryWidget,
  OfflineSyncStatus 
} from '@/components/realtime';
import { 
  Zap, Users, MessageCircle, MapPin, WifiOff, 
  Rocket, CheckCircle, Code, Database 
} from 'lucide-react';

const DEMO_USER_ID = 'user-' + Math.random().toString(36).substr(2, 9);
const DEMO_USER_NAME = 'Demo User';

const destinations = [
  { id: 'borobudur', name: 'Borobudur Temple' },
  { id: 'bali', name: 'Bali Beach Resort' },
  { id: 'rajaampat', name: 'Raja Ampat Dive' },
  { id: 'komodo', name: 'Komodo Island' }
];

const chatRooms = [
  { id: 'bali-hotel', name: 'Bali Hotel Chat', type: 'hotel' as const },
  { id: 'yogya-guide', name: 'Yogyakarta Guide Chat', type: 'destination' as const },
  { id: 'group-tour', name: 'Group Tour Planning', type: 'group' as const }
];

function RealtimeDemoPageContent() {
  const { success, error: showError } = useToast();
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(chatRooms[0]);
  const [activeTab, setActiveTab] = useState('overview');

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Home', icon: Zap },
    { id: 'booking', label: 'Booking', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'itinerary', label: 'Plan', icon: MapPin },
    { id: 'sync', label: 'Sync', icon: WifiOff },
  ];

  const handleBookingConfirmed = () => {
    success('Booking Confirmed!', `Your booking for ${selectedDestination.name} has been confirmed.`);
  };

  return (
    <MobileBottomNavWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 md:p-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Zap className="h-8 w-8" />
                  SpacetimeDB Power-Ups Demo
                </CardTitle>
                <p className="text-blue-100 mt-2 text-sm md:text-base">
                  Real-time Multiplayer Features for STC Ultimate
                </p>
              </div>
              <Badge variant="secondary" className="bg-white text-blue-700 px-4 py-2 text-sm">
                <Rocket className="mr-2 h-4 w-4" />
                Live Demo
              </Badge>
            </div>
          </CardHeader>
        </Card>
        </motion.div>

        {/* Offline Sync Status - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <OfflineSyncStatus compact className="bg-white shadow-sm" />
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Desktop Tab List */}
          <TabsList className="hidden md:grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="booking" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Booking</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Itinerary</span>
            </TabsTrigger>
            <TabsTrigger value="sync" className="gap-2">
              <WifiOff className="h-4 w-4" />
              <span className="hidden sm:inline">Sync</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Rocket className="h-6 w-6 text-purple-600" />
                  4 SpacetimeDB Power-Ups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Feature 1 */}
                  <Card className="border-blue-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Users className="h-8 w-8 text-blue-600" />
                        <Badge variant="secondary">Live</Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">Multiplayer Booking</h3>
                      <p className="text-sm text-gray-600">
                        See other users booking in real-time. Lock mechanism prevents overbooking.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Real-time viewer tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Booking lock (5 min timeout)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Prevent double booking
                        </li>
                      </ul>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('booking')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Try Booking →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Feature 2 */}
                  <Card className="border-green-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <MessageCircle className="h-8 w-8 text-green-600" />
                        <Badge variant="secondary">Live</Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">Live Chat</h3>
                      <p className="text-sm text-gray-600">
                        Multi-room chat with travelers, guides, and hotel staff.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Role-based messaging
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Typing indicators
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Offline message queue
                        </li>
                      </ul>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('chat')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Open Chat →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Feature 3 */}
                  <Card className="border-orange-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <MapPin className="h-8 w-8 text-orange-600" />
                        <Badge variant="secondary">Collaborative</Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">Collaborative Itinerary</h3>
                      <p className="text-sm text-gray-600">
                        Plan trips with friends. Vote on activities, live updates.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Group trip planning
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Activity voting system
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Budget tracking
                        </li>
                      </ul>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('itinerary')}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Plan Trip →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Feature 4 */}
                  <Card className="border-purple-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <WifiOff className="h-8 w-8 text-purple-600" />
                        <Badge variant="secondary">Offline-First</Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">Conflict-Free Sync</h3>
                      <p className="text-sm text-gray-600">
                        Works offline. Auto-sync when back online. No data loss.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Action queue
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Auto-retry failed actions
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Optimistic UI updates
                        </li>
                      </ul>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('sync')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        View Sync →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-gray-600" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Database className="h-5 w-5 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-sm text-gray-800">SpacetimeDB</h4>
                    <p className="text-xs text-gray-600">Real-time database with compute</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600 mb-2" />
                    <h4 className="font-semibold text-sm text-gray-800">React Hooks</h4>
                    <p className="text-xs text-gray-600">Custom hooks for state management</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <WifiOff className="h-5 w-5 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-sm text-gray-800">Offline-First</h4>
                    <p className="text-xs text-gray-600">LocalStorage + Auto-sync</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multiplayer Booking Tab */}
          <TabsContent value="booking" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {destinations.map((dest) => (
                <Button
                  key={dest.id}
                  variant={selectedDestination.id === dest.id ? 'default' : 'outline'}
                  onClick={() => setSelectedDestination(dest)}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {dest.name}
                </Button>
              ))}
            </div>
            
            <MultiplayerBookingWidget
              destinationId={selectedDestination.id}
              destinationName={selectedDestination.name}
              currentUserId={DEMO_USER_ID}
              currentUserName={DEMO_USER_NAME}
              onBookingConfirmed={handleBookingConfirmed}
            />
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {chatRooms.map((room) => (
                <Button
                  key={room.id}
                  variant={selectedChatRoom.id === room.id ? 'default' : 'outline'}
                  onClick={() => setSelectedChatRoom(room)}
                  className="justify-start"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {room.name}
                </Button>
              ))}
            </div>
            
            <LiveChatWidget
              roomId={selectedChatRoom.id}
              roomName={selectedChatRoom.name}
              currentUserId={DEMO_USER_ID}
              currentUserName={DEMO_USER_NAME}
              currentUserRole="traveler"
            />
          </TabsContent>

          {/* Collaborative Itinerary Tab */}
          <TabsContent value="itinerary">
            <CollaborativeItineraryWidget
              itineraryId="demo-itinerary-1"
              currentUserId={DEMO_USER_ID}
              currentUserName={DEMO_USER_NAME}
            />
          </TabsContent>

          {/* Offline Sync Tab */}
          <TabsContent value="sync">
            <OfflineSyncStatus />
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          items={navItems}
          activeItem={activeTab}
          onItemClick={setActiveTab}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 text-center text-sm text-gray-600">
            <p>
              🚀 <strong>STC Ultimate</strong> - Smart Tourism Platform with SpacetimeDB Power-Ups
            </p>
            <p className="text-xs text-gray-500 mt-1">
              CBDC Pilot: Lagoi & Pulau Penyengat → Base Mainnet Expansion
            </p>
          </CardContent>
        </Card>
        </motion.div>
        </div>
      </div>
    </MobileBottomNavWrapper>
  );
}

export default function RealtimeDemoPage() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RealtimeDemoPageContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
