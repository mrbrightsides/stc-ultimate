'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  OfflineSyncStatus,
  BackendStatusIndicator
} from '@/components/realtime';
import { 
  Zap, Users, MessageCircle, MapPin, WifiOff, 
  Rocket, CheckCircle, Code, Database, Layers 
} from 'lucide-react';
import { fadeIn, slideInFromTop } from '@/lib/animations';

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
  const { success } = useToast();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 p-3 md:p-8 pb-20 md:pb-8">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto space-y-4 md:space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={slideInFromTop}
            initial="initial"
            animate="animate"
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                      <Zap className="h-8 w-8" />
                      SpacetimeDB Migration Demo
                    </CardTitle>
                    <p className="text-blue-100 mt-2 text-sm md:text-base">
                      Progressive Migration: LocalStorage → SpacetimeDB
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-white text-blue-700 px-4 py-2 text-sm">
                    <Layers className="mr-2 h-4 w-4" />
                    V2.0
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Backend Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BackendStatusIndicator />
          </motion.div>

          {/* Migration Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Rocket className="h-6 w-6 text-purple-600" />
                  Migration-Ready Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-sm">Phase 1: Current</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      LocalStorage + CustomEvents
                    </p>
                    <Badge variant="default" className="mt-2 text-xs">Production Ready</Badge>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-sm">Phase 2: Migration</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Abstraction Layer Ready
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">In Progress</Badge>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-sm">Phase 3: Future</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full SpacetimeDB Deployment
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">Planned</Badge>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>💡 Migration Strategy:</strong> Zero downtime, backward compatible, feature flag controlled. 
                    Switch between backends with environment variables only - no code changes required!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Desktop Tab List */}
            <TabsList className="hidden md:grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Technical Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        Current Implementation
                      </h4>
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        <li>✅ LocalStorage for offline-first data persistence</li>
                        <li>✅ CustomEvents for cross-tab synchronization</li>
                        <li>✅ Zero external dependencies</li>
                        <li>✅ Perfect for CBDC pilot (Lagoi & Pulau Penyengat)</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-purple-600" />
                        Future with SpacetimeDB
                      </h4>
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        <li>🚀 Multi-device real-time sync</li>
                        <li>🚀 Server-side reducers for business logic</li>
                        <li>🚀 Automatic conflict resolution (CRDTs)</li>
                        <li>🚀 Scalable for Base mainnet expansion</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📚 Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/SPACETIMEDB_MIGRATION.md" target="_blank" rel="noopener noreferrer">
                      <Database className="mr-2 h-4 w-4" />
                      Migration Guide (Detailed)
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/SPACETIMEDB_QUICKSTART.md" target="_blank" rel="noopener noreferrer">
                      <Zap className="mr-2 h-4 w-4" />
                      Quick Start Guide
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/SPACETIMEDB_POWERUPS.md" target="_blank" rel="noopener noreferrer">
                      <Rocket className="mr-2 h-4 w-4" />
                      Power-Ups Documentation
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs use existing widgets */}
            <TabsContent value="booking" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
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

            <TabsContent value="itinerary">
              <CollaborativeItineraryWidget
                itineraryId="demo-itinerary-v2"
                currentUserId={DEMO_USER_ID}
                currentUserName={DEMO_USER_NAME}
              />
            </TabsContent>

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
        </motion.div>
      </div>
    </MobileBottomNavWrapper>
  );
}

export default function RealtimeDemoV2Page() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RealtimeDemoPageContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
