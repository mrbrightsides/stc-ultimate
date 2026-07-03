# 🚀 SpacetimeDB Power-Ups - Documentation

## Overview

STC Ultimate now includes **4 powerful real-time features** built with SpacetimeDB-ready architecture:

1. **Multiplayer Booking System** - Real-time booking with lock mechanism
2. **Live Chat** - Multi-room chat with role-based messaging
3. **Collaborative Itinerary** - Group trip planning with voting
4. **Offline-First Sync** - Conflict-free replicas with auto-sync

---

## 🎯 Features

### 1. 👥 Multiplayer Booking System

**Purpose:** Prevent overbooking and show real-time booking activity.

**Features:**
- ✅ Real-time viewer tracking
- ✅ Booking lock mechanism (5-minute timeout)
- ✅ Prevent double booking
- ✅ Active user visualization
- ✅ Automatic lock expiration

**Usage:**
```tsx
import { MultiplayerBookingWidget } from '@/components/realtime';

<MultiplayerBookingWidget
  destinationId="borobudur"
  destinationName="Borobudur Temple"
  currentUserId="user-123"
  currentUserName="John Doe"
  onBookingConfirmed={() => console.log('Booking confirmed!')}
/>
```

**Hook:**
```tsx
import { useMultiplayerBooking } from '@/hooks/use-multiplayer-booking';

const {
  activeBookings,
  startViewing,
  lockBooking,
  confirmBooking,
  cancelBooking,
  getActiveViewers,
  isLocked
} = useMultiplayerBooking();
```

---

### 2. 💬 Live Chat System

**Purpose:** Enable real-time communication between travelers, guides, and hotel staff.

**Features:**
- ✅ Multi-room support (destination, hotel, group)
- ✅ Role-based messaging (traveler, guide, hotel_staff)
- ✅ Typing indicators
- ✅ Offline message queue
- ✅ Participant count tracking
- ✅ Message history with timestamps

**Usage:**
```tsx
import { LiveChatWidget } from '@/components/realtime';

<LiveChatWidget
  roomId="bali-hotel"
  roomName="Bali Hotel Chat"
  currentUserId="user-123"
  currentUserName="John Doe"
  currentUserRole="traveler"
/>
```

**Hook:**
```tsx
import { useLiveChat } from '@/hooks/use-live-chat';

const {
  messages,
  typingUsers,
  isConnected,
  participantCount,
  sendMessage,
  setTyping
} = useLiveChat(roomId, userId, userName, userRole);
```

---

### 3. 🗺️ Collaborative Itinerary Planning

**Purpose:** Plan trips collaboratively with friends and vote on activities.

**Features:**
- ✅ Shared trip planning
- ✅ Real-time activity updates
- ✅ Voting system (upvote/downvote)
- ✅ Budget tracking
- ✅ Participant presence
- ✅ Activity status (proposed, confirmed, completed)
- ✅ Date/time scheduling
- ✅ Cost estimation

**Usage:**
```tsx
import { CollaborativeItineraryWidget } from '@/components/realtime';

<CollaborativeItineraryWidget
  itineraryId="trip-indonesia-2025"
  currentUserId="user-123"
  currentUserName="John Doe"
/>
```

**Hook:**
```tsx
import { useCollaborativeItinerary } from '@/hooks/use-collaborative-itinerary';

const {
  itinerary,
  recentUpdates,
  onlineParticipants,
  syncStatus,
  addActivity,
  voteActivity,
  getTotalCost
} = useCollaborativeItinerary(itineraryId, userId, userName);
```

---

### 4. 🔄 Offline-First Sync Manager

**Purpose:** Enable app to work offline and sync when connection is restored.

**Features:**
- ✅ Action queue for offline operations
- ✅ Automatic retry with exponential backoff
- ✅ Conflict-free data structures
- ✅ Optimistic UI updates
- ✅ Online/offline detection
- ✅ Visual sync status
- ✅ Failed action retry

**Usage:**
```tsx
import { OfflineSyncStatus } from '@/components/realtime';

// Full widget
<OfflineSyncStatus />

// Compact version
<OfflineSyncStatus compact />
```

**Hook:**
```tsx
import { useOfflineSync } from '@/hooks/use-offline-sync';

const {
  pendingActions,
  syncStatus,
  queueAction,
  syncPendingActions,
  retryFailedActions
} = useOfflineSync();

// Queue an action
queueAction('booking', 'create', { destinationId: 'bali', ... });
```

---

## 🏗️ Architecture

### Current Implementation (Phase 1 - MVP)

**Technology Stack:**
- **Frontend:** React Hooks + LocalStorage
- **Real-time Sync:** CustomEvents (cross-tab communication)
- **Offline-First:** LocalStorage + Action Queue
- **State Management:** React useState/useEffect

**Data Flow:**
```
User Action
    ↓
React Hook (useState)
    ↓
LocalStorage (persist)
    ↓
CustomEvent (broadcast to other tabs)
    ↓
Other components update (real-time)
```

### Future Migration (Phase 2 - SpacetimeDB)

When SpacetimeDB is ready, migration path:

**Replace:**
- LocalStorage → SpacetimeDB Tables
- CustomEvents → SpacetimeDB Subscriptions
- Manual sync logic → Automatic SpacetimeDB reducers

**Benefits:**
- True multi-device sync (not just cross-tab)
- Server-side compute (reducers)
- Automatic conflict resolution
- WebSocket-based real-time updates
- Built-in authentication

**Example SpacetimeDB Schema:**
```rust
// spacetime-server/src/lib.rs

#[spacetimedb(table)]
pub struct ActiveBooking {
    #[primarykey]
    pub id: String,
    pub destination_id: String,
    pub user_id: String,
    pub user_name: String,
    pub status: BookingStatus,
    pub timestamp: u64,
    pub expires_at: u64,
}

#[spacetimedb(reducer)]
pub fn start_viewing(ctx: ReducerContext, destination_id: String) -> Result<(), String> {
    // Server-side logic
}
```

---

## 📍 Demo Page

Access the live demo at: **`/realtime-demo`**

Features:
- Interactive tabs for each power-up
- Multiple destination selection
- Multiple chat rooms
- Collaborative itinerary builder
- Sync status monitoring

---

## 🎯 Use Cases

### Pilot: Lagoi & Pulau Penyengat (CBDC)

**Multiplayer Booking:**
- Hotel room booking at Lagoi resorts
- Prevent double-booking for popular attractions
- Real-time availability for ferry tickets

**Live Chat:**
- Tourist info center chat support
- Hotel staff communication
- Local guide Q&A

**Collaborative Itinerary:**
- Family/group trip planning
- Tour package customization
- Activity scheduling

**Offline-First:**
- Works in areas with poor connectivity
- Queue transactions when offline
- Auto-sync when back online

### Mainnet: Base Blockchain Expansion

Once CBDC pilot is successful:
- Deploy to Base for global reach
- Ultra-low gas fees for micro-transactions
- Cross-chain bridge integration
- NFT rewards for completed trips

---

## 🔧 Technical Details

### LocalStorage Keys

- `stc_active_bookings` - Active booking records
- `stc_chat_{roomId}` - Chat messages per room
- `stc_itinerary_{itineraryId}` - Itinerary data
- `stc_pending_actions` - Offline action queue

### Event Names

- `stc-booking-sync` - Booking updates
- `stc-chat-message` - New chat messages
- `stc-chat-typing` - Typing indicators
- `stc-chat-participants` - Participant count
- `stc-itinerary-sync` - Itinerary updates
- `stc-itinerary-presence` - User presence

### Performance

- **Bundle Size:** +13.9 kB (realtime-demo page)
- **First Load JS:** 144 kB
- **Hooks:** Lightweight, memoized functions
- **Storage:** Minimal localStorage usage (<1MB typical)

---

## 🚀 Roadmap

### Phase 1 (Current) ✅
- ✅ Core hooks implementation
- ✅ UI components
- ✅ Demo page
- ✅ Offline-first architecture

### Phase 2 (Next)
- [ ] SpacetimeDB integration
- [ ] Multi-device sync
- [ ] Server-side reducers
- [ ] WebSocket real-time

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Voice chat integration
- [ ] Video streaming
- [ ] AR/VR experiences

---

## 📚 Additional Resources

- [SpacetimeDB Docs](https://spacetimedb.com/docs)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Offline-First Architecture](https://offlinefirst.org/)
- [CRDT Concepts](https://crdt.tech/)

---

## 🤝 Contributing

To add new real-time features:

1. Create hook in `src/hooks/use-{feature}.ts`
2. Create widget in `src/components/realtime/{feature}-widget.tsx`
3. Add to demo page in `src/app/realtime-demo/page.tsx`
4. Update this documentation

---

## 📞 Support

For questions or issues:
- GitHub Issues
- Discord Community
- Email: support@stc-ultimate.com

---

**Built with ❤️ for Indonesian Tourism 🇮🇩**

*STC Ultimate - Empowering Tourism Through Blockchain & Real-Time Technology*
