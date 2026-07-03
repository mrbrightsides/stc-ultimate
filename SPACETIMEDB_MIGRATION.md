# 🚀 SpacetimeDB Migration Guide

## Overview

STC Ultimate is designed with a **progressive migration strategy** from LocalStorage to SpacetimeDB for real-time multiplayer features.

## Current Architecture (Phase 1 - LocalStorage)

### ✅ **What Works Now:**
- ✅ Cross-tab synchronization via CustomEvents
- ✅ Offline-first with localStorage persistence
- ✅ Zero external dependencies
- ✅ Perfect for CBDC pilot (Lagoi & Pulau Penyengat)

### 📦 **Features:**
1. **Multiplayer Booking** - Real-time booking tracking
2. **Live Chat** - Multi-room chat system
3. **Collaborative Itinerary** - Shared trip planning
4. **Offline Sync** - Action queue with retry

### 🏗️ **Implementation:**
- **Hooks**: `use-multiplayer-booking.ts`, `use-live-chat.ts`, `use-collaborative-itinerary.ts`, `use-offline-sync.ts`
- **Storage**: Browser localStorage
- **Sync**: CustomEvents for cross-tab communication
- **Limitations**: 
  - Single device only (no multi-device sync)
  - Manual conflict resolution
  - No server-side validation

---

## Future Architecture (Phase 2 - SpacetimeDB)

### 🎯 **What SpacetimeDB Enables:**
- ✅ **Multi-device sync** - Access from phone, tablet, desktop
- ✅ **True real-time** - WebSocket-based instant updates
- ✅ **Server-side logic** - Reducers enforce business rules
- ✅ **Automatic conflict resolution** - CRDTs built-in
- ✅ **Scalability** - Handle thousands of concurrent users
- ✅ **Query optimization** - Efficient indexing and queries

### 📋 **SpacetimeDB Schema:**

#### **Tables:**

```rust
// 1. Multiplayer Booking
#[spacetimedb(table)]
pub struct ActiveBooking {
    #[primarykey]
    pub id: String,
    pub destination_id: String,
    pub user_id: String,
    pub user_name: String,
    pub status: BookingStatus, // viewing, locked, confirmed, cancelled
    pub timestamp: u64,
    pub expires_at: u64,
}

#[spacetimedb(table)]
pub struct BookingLock {
    #[primarykey]
    pub booking_id: String,
    pub locked_by: String,
    pub locked_at: u64,
    pub expires_in: u64,
}

// 2. Live Chat
#[spacetimedb(table)]
pub struct ChatMessage {
    #[primarykey]
    pub id: String,
    pub room_id: String,
    pub user_id: String,
    pub user_name: String,
    pub user_role: UserRole, // traveler, guide, hotel_staff
    pub content: String,
    pub timestamp: u64,
    pub is_system: bool,
}

#[spacetimedb(table)]
pub struct ChatRoom {
    #[primarykey]
    pub id: String,
    pub name: String,
    pub room_type: RoomType, // destination, hotel, group
    pub participant_count: u32,
    pub last_activity: u64,
}

#[spacetimedb(table)]
pub struct TypingIndicator {
    #[primarykey]
    pub user_id: String,
    pub room_id: String,
    pub user_name: String,
    pub timestamp: u64,
}

// 3. Collaborative Itinerary
#[spacetimedb(table)]
pub struct Itinerary {
    #[primarykey]
    pub id: String,
    pub name: String,
    pub description: String,
    pub owner_id: String,
    pub owner_name: String,
    pub start_date: String,
    pub end_date: String,
    pub budget: f64,
    pub created_at: u64,
    pub updated_at: u64,
}

#[spacetimedb(table)]
pub struct ItineraryActivity {
    #[primarykey]
    pub id: String,
    pub itinerary_id: String,
    pub title: String,
    pub description: String,
    pub destination_id: String,
    pub date: String,
    pub time: String,
    pub duration: u32, // minutes
    pub cost: f64,
    pub added_by: String,
    pub added_by_name: String,
    pub vote_count: i32,
    pub status: ActivityStatus, // proposed, confirmed, completed, cancelled
    pub timestamp: u64,
}

#[spacetimedb(table)]
pub struct ActivityVote {
    #[primarykey]
    pub id: String,
    pub activity_id: String,
    pub user_id: String,
    pub vote: Vote, // up, down
    pub timestamp: u64,
}

#[spacetimedb(table)]
pub struct ItineraryParticipant {
    #[primarykey]
    pub id: String,
    pub itinerary_id: String,
    pub user_id: String,
    pub user_name: String,
    pub role: ParticipantRole, // owner, editor, viewer
    pub joined_at: u64,
    pub last_seen: u64,
    pub is_online: bool,
}

// 4. Offline Sync
#[spacetimedb(table)]
pub struct PendingAction {
    #[primarykey]
    pub id: String,
    pub action_type: ActionType, // booking, chat, itinerary, payment
    pub action: String,
    pub payload: String, // JSON serialized
    pub user_id: String,
    pub timestamp: u64,
    pub retry_count: u32,
    pub max_retries: u32,
    pub status: ActionStatus, // pending, syncing, synced, failed
}
```

#### **Reducers:**

```rust
// Booking reducers
#[spacetimedb(reducer)]
pub fn start_viewing(ctx: &ReducerContext, destination_id: String, user_id: String, user_name: String) -> Result<ActiveBooking, String>

#[spacetimedb(reducer)]
pub fn lock_booking(ctx: &ReducerContext, booking_id: String, user_id: String) -> Result<bool, String>

#[spacetimedb(reducer)]
pub fn confirm_booking(ctx: &ReducerContext, booking_id: String) -> Result<(), String>

#[spacetimedb(reducer)]
pub fn cancel_booking(ctx: &ReducerContext, booking_id: String) -> Result<(), String>

// Chat reducers
#[spacetimedb(reducer)]
pub fn send_message(ctx: &ReducerContext, room_id: String, content: String, user_role: UserRole) -> Result<ChatMessage, String>

#[spacetimedb(reducer)]
pub fn set_typing(ctx: &ReducerContext, room_id: String, is_typing: bool) -> Result<(), String>

// Itinerary reducers
#[spacetimedb(reducer)]
pub fn create_itinerary(ctx: &ReducerContext, name: String, description: String, start_date: String, end_date: String, budget: f64) -> Result<Itinerary, String>

#[spacetimedb(reducer)]
pub fn add_activity(ctx: &ReducerContext, itinerary_id: String, activity: ItineraryActivity) -> Result<ItineraryActivity, String>

#[spacetimedb(reducer)]
pub fn vote_activity(ctx: &ReducerContext, activity_id: String, vote: Vote) -> Result<(), String>

#[spacetimedb(reducer)]
pub fn update_activity_status(ctx: &ReducerContext, activity_id: String, status: ActivityStatus) -> Result<(), String>

// Sync reducers
#[spacetimedb(reducer)]
pub fn queue_action(ctx: &ReducerContext, action_type: ActionType, action: String, payload: String) -> Result<PendingAction, String>

#[spacetimedb(reducer)]
pub fn sync_action(ctx: &ReducerContext, action_id: String) -> Result<(), String>

#[spacetimedb(reducer)]
pub fn retry_failed_actions(ctx: &ReducerContext) -> Result<u32, String>
```

---

## Migration Strategy

### **Step 1: Enable SpacetimeDB Backend** (When Ready)

1. **Install SpacetimeDB SDK:**
```bash
npm install @clockworklabs/spacetimedb-sdk
```

2. **Set Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_SPACETIMEDB_ENABLED=true
NEXT_PUBLIC_SPACETIMEDB_MODULE=<your-module-address>
NEXT_PUBLIC_SPACETIMEDB_HOST=http://localhost:3000
```

3. **Deploy SpacetimeDB Module:**
```bash
spacetime publish <module-name>
```

### **Step 2: Update SpacetimeDB Adapter**

Replace placeholder code in `src/lib/spacetimedb-adapter.ts`:

```typescript
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';

export class SpacetimeDBAdapter<T> implements DataAdapter<T> {
  private async initConnection() {
    this.connection = new SpacetimeDBClient(this.config.hostUrl);
    await this.connection.connect(this.config.moduleAddress);
  }

  async get(key: string): Promise<T | null> {
    return await this.connection.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [key]
    );
  }

  // ... implement other methods
}
```

### **Step 3: No Hook Changes Required!**

The hooks (`use-multiplayer-booking.ts`, etc.) will automatically use SpacetimeDB adapter when `SPACETIMEDB_ENABLED=true`. No code changes needed! 🎉

### **Step 4: Gradual Rollout**

1. **Test locally** with SpacetimeDB enabled
2. **A/B test** with 10% of users
3. **Monitor metrics** (latency, sync errors)
4. **Scale to 100%** when stable

---

## Benefits Comparison

| Feature | LocalStorage (Current) | SpacetimeDB (Future) |
|---------|----------------------|---------------------|
| **Multi-device sync** | ❌ Single device only | ✅ All devices |
| **Real-time updates** | ⚠️ Cross-tab only | ✅ True WebSocket |
| **Offline support** | ✅ Full support | ✅ Full support |
| **Conflict resolution** | ⚠️ Manual | ✅ Automatic CRDTs |
| **Scalability** | ⚠️ Limited by browser | ✅ Thousands of users |
| **Server validation** | ❌ Client-side only | ✅ Server-side reducers |
| **Query performance** | ⚠️ In-memory filtering | ✅ Optimized indexes |
| **Setup complexity** | ✅ Zero config | ⚠️ Requires infrastructure |
| **Cost** | ✅ Free | 💰 Hosting costs |

---

## Testing Checklist

### **Phase 1 (LocalStorage) - DONE ✅**
- ✅ Cross-tab booking sync
- ✅ Chat persistence
- ✅ Itinerary collaboration
- ✅ Offline queue

### **Phase 2 (SpacetimeDB) - TODO**
- ⬜ Multi-device booking sync
- ⬜ Real-time chat across devices
- ⬜ Collaborative itinerary on mobile + desktop
- ⬜ Server-side permission validation
- ⬜ Load testing with 100+ concurrent users
- ⬜ Conflict resolution testing

---

## Timeline

### **Q2 2025 - CBDC Pilot (Lagoi)**
- Use LocalStorage implementation
- Stable, tested, offline-first
- Perfect for limited connectivity areas

### **Q3 2025 - Base Mainnet Expansion**
- Deploy SpacetimeDB backend
- Enable multi-device sync
- Scale to international users

### **Q4 2025 - Full Production**
- 100% SpacetimeDB
- Remove LocalStorage fallback
- Advanced features (AI recommendations, AR integration)

---

## Developer Notes

### **Current Implementation Location:**
- **Hooks**: `src/hooks/use-*.ts`
- **Components**: `src/components/realtime/*.tsx`
- **Demo**: `src/app/realtime-demo/page.tsx`

### **Migration Files:**
- **Adapter**: `src/lib/spacetimedb-adapter.ts`
- **Config**: Environment variables
- **Docs**: This file (`SPACETIMEDB_MIGRATION.md`)

### **Key Design Decisions:**
1. **Abstraction Layer** - Allows swapping backends without hook changes
2. **Feature Flags** - Enable/disable SpacetimeDB via env vars
3. **Backward Compatibility** - LocalStorage remains as fallback
4. **Progressive Migration** - No "big bang" deployment risk

---

## FAQ

**Q: Why not migrate immediately?**
A: LocalStorage is perfect for CBDC pilot in Lagoi (offline-first, stable). SpacetimeDB adds complexity that's not needed yet.

**Q: Will I lose data during migration?**
A: No. Adapter supports data export/import. Users won't notice the switch.

**Q: Can I run both backends simultaneously?**
A: Yes! Adapter supports dual-write mode for gradual rollout.

**Q: What if SpacetimeDB fails?**
A: Automatic fallback to LocalStorage. Zero downtime.

---

## Conclusion

STC Ultimate's architecture is **SpacetimeDB-ready** but doesn't require it today. This progressive approach:
- ✅ **Reduces risk** - Start simple, scale when needed
- ✅ **Lowers costs** - No infrastructure during pilot
- ✅ **Maintains flexibility** - Easy to switch or rollback
- ✅ **Future-proof** - Ready for Base mainnet scale

Perfect for **CBDC pilot first**, **Base expansion later**! 🚀
