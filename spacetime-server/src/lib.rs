// SpacetimeDB Module for STC Ultimate Real-time Features
// 
// This module provides backend logic for:
// 1. Multiplayer Booking System
// 2. Live Chat System
// 3. Collaborative Itinerary Planning
// 4. Offline Sync Queue
//
// Deployment Instructions:
// 1. Install SpacetimeDB CLI: https://spacetimedb.com/install
// 2. Run: spacetime publish stc_ultimate_realtime
// 3. Note the module address
// 4. Set NEXT_PUBLIC_SPACETIMEDB_MODULE=<address> in .env.local
// 5. Set NEXT_PUBLIC_SPACETIMEDB_ENABLED=true

use spacetimedb::{spacetimedb, Identity, ReducerContext, Table};

// ============================================================================
// ENUMS
// ============================================================================

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum BookingStatus {
    Viewing,
    Locked,
    Confirmed,
    Cancelled,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum UserRole {
    Traveler,
    Guide,
    HotelStaff,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum RoomType {
    Destination,
    Hotel,
    Group,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum ActivityStatus {
    Proposed,
    Confirmed,
    Completed,
    Cancelled,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum ParticipantRole {
    Owner,
    Editor,
    Viewer,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum Vote {
    Up,
    Down,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum ActionType {
    Booking,
    Chat,
    Itinerary,
    Payment,
}

#[spacetimedb(table)]
#[derive(Clone, PartialEq, Eq)]
pub enum ActionStatus {
    Pending,
    Syncing,
    Synced,
    Failed,
}

// ============================================================================
// TABLES - Multiplayer Booking
// ============================================================================

#[spacetimedb(table)]
#[derive(Clone)]
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

#[spacetimedb(table)]
#[derive(Clone)]
pub struct BookingLock {
    #[primarykey]
    pub booking_id: String,
    pub locked_by: String,
    pub locked_at: u64,
    pub expires_in: u64,
}

// ============================================================================
// TABLES - Live Chat
// ============================================================================

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ChatMessage {
    #[primarykey]
    pub id: String,
    #[index(btree)]
    pub room_id: String,
    pub user_id: String,
    pub user_name: String,
    pub user_role: UserRole,
    pub content: String,
    pub timestamp: u64,
    pub is_system: bool,
}

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ChatRoom {
    #[primarykey]
    pub id: String,
    pub name: String,
    pub room_type: RoomType,
    pub participant_count: u32,
    pub last_activity: u64,
}

#[spacetimedb(table)]
#[derive(Clone)]
pub struct TypingIndicator {
    #[primarykey]
    pub user_id: String,
    pub room_id: String,
    pub user_name: String,
    pub timestamp: u64,
}

// ============================================================================
// TABLES - Collaborative Itinerary
// ============================================================================

#[spacetimedb(table)]
#[derive(Clone)]
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
#[derive(Clone)]
pub struct ItineraryActivity {
    #[primarykey]
    pub id: String,
    #[index(btree)]
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
    pub status: ActivityStatus,
    pub timestamp: u64,
}

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ActivityVote {
    #[primarykey]
    pub id: String,
    #[index(btree)]
    pub activity_id: String,
    pub user_id: String,
    pub vote: Vote,
    pub timestamp: u64,
}

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ItineraryParticipant {
    #[primarykey]
    pub id: String,
    #[index(btree)]
    pub itinerary_id: String,
    pub user_id: String,
    pub user_name: String,
    pub role: ParticipantRole,
    pub joined_at: u64,
    pub last_seen: u64,
    pub is_online: bool,
}

// ============================================================================
// TABLES - Offline Sync
// ============================================================================

#[spacetimedb(table)]
#[derive(Clone)]
pub struct PendingAction {
    #[primarykey]
    pub id: String,
    pub action_type: ActionType,
    pub action: String,
    pub payload: String, // JSON serialized
    pub user_id: String,
    pub timestamp: u64,
    pub retry_count: u32,
    pub max_retries: u32,
    pub status: ActionStatus,
}

// ============================================================================
// REDUCERS - Booking Operations
// ============================================================================

#[spacetimedb(reducer)]
pub fn start_viewing(
    ctx: &ReducerContext,
    destination_id: String,
    user_id: String,
    user_name: String,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    let expires_at = now + 300000; // 5 minutes

    let booking = ActiveBooking {
        id: format!("{}-{}", user_id, now),
        destination_id,
        user_id,
        user_name,
        status: BookingStatus::Viewing,
        timestamp: now,
        expires_at,
    };

    ctx.db.active_booking().insert(booking);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn lock_booking(ctx: &ReducerContext, booking_id: String, user_id: String) -> Result<bool, String> {
    // Check if booking exists
    let booking = ctx.db.active_booking()
        .id()
        .find(&booking_id)
        .ok_or("Booking not found")?;

    // Check if already locked by someone else
    if let Some(lock) = ctx.db.booking_lock().booking_id().find(&booking_id) {
        if lock.locked_by != user_id {
            return Ok(false); // Already locked
        }
    }

    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    
    // Create lock
    let lock = BookingLock {
        booking_id: booking_id.clone(),
        locked_by: user_id,
        locked_at: now,
        expires_in: 300000, // 5 minutes
    };
    ctx.db.booking_lock().insert(lock);

    // Update booking status
    ctx.db.active_booking().id().update(ActiveBooking {
        status: BookingStatus::Locked,
        expires_at: now + 300000,
        ..booking.clone()
    });

    Ok(true)
}

#[spacetimedb(reducer)]
pub fn confirm_booking(ctx: &ReducerContext, booking_id: String) -> Result<(), String> {
    let booking = ctx.db.active_booking()
        .id()
        .find(&booking_id)
        .ok_or("Booking not found")?;

    ctx.db.active_booking().id().update(ActiveBooking {
        status: BookingStatus::Confirmed,
        ..booking.clone()
    });

    // Remove lock
    if let Some(lock) = ctx.db.booking_lock().booking_id().find(&booking_id) {
        ctx.db.booking_lock().booking_id().delete(&lock.booking_id);
    }

    Ok(())
}

#[spacetimedb(reducer)]
pub fn cancel_booking(ctx: &ReducerContext, booking_id: String) -> Result<(), String> {
    ctx.db.active_booking().id().delete(&booking_id);
    
    // Remove lock if exists
    if let Some(lock) = ctx.db.booking_lock().booking_id().find(&booking_id) {
        ctx.db.booking_lock().booking_id().delete(&lock.booking_id);
    }

    Ok(())
}

// ============================================================================
// REDUCERS - Chat Operations
// ============================================================================

#[spacetimedb(reducer)]
pub fn send_message(
    ctx: &ReducerContext,
    room_id: String,
    user_id: String,
    user_name: String,
    user_role: UserRole,
    content: String,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

    let message = ChatMessage {
        id: format!("{}-{}", user_id, now),
        room_id: room_id.clone(),
        user_id,
        user_name,
        user_role,
        content,
        timestamp: now,
        is_system: false,
    };

    ctx.db.chat_message().insert(message);

    // Update room last activity
    if let Some(room) = ctx.db.chat_room().id().find(&room_id) {
        ctx.db.chat_room().id().update(ChatRoom {
            last_activity: now,
            ..room.clone()
        });
    }

    Ok(())
}

#[spacetimedb(reducer)]
pub fn set_typing(
    ctx: &ReducerContext,
    room_id: String,
    user_id: String,
    user_name: String,
    is_typing: bool,
) -> Result<(), String> {
    if is_typing {
        let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
        let indicator = TypingIndicator {
            user_id: user_id.clone(),
            room_id,
            user_name,
            timestamp: now,
        };
        ctx.db.typing_indicator().insert(indicator);
    } else {
        ctx.db.typing_indicator().user_id().delete(&user_id);
    }

    Ok(())
}

// ============================================================================
// REDUCERS - Itinerary Operations
// ============================================================================

#[spacetimedb(reducer)]
pub fn create_itinerary(
    ctx: &ReducerContext,
    id: String,
    name: String,
    description: String,
    owner_id: String,
    owner_name: String,
    start_date: String,
    end_date: String,
    budget: f64,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

    let itinerary = Itinerary {
        id: id.clone(),
        name,
        description,
        owner_id: owner_id.clone(),
        owner_name: owner_name.clone(),
        start_date,
        end_date,
        budget,
        created_at: now,
        updated_at: now,
    };

    ctx.db.itinerary().insert(itinerary);

    // Add owner as participant
    let participant = ItineraryParticipant {
        id: format!("{}-{}", id, owner_id),
        itinerary_id: id,
        user_id: owner_id,
        user_name: owner_name,
        role: ParticipantRole::Owner,
        joined_at: now,
        last_seen: now,
        is_online: true,
    };

    ctx.db.itinerary_participant().insert(participant);

    Ok(())
}

#[spacetimedb(reducer)]
pub fn add_activity(
    ctx: &ReducerContext,
    itinerary_id: String,
    title: String,
    description: String,
    destination_id: String,
    date: String,
    time: String,
    duration: u32,
    cost: f64,
    added_by: String,
    added_by_name: String,
    status: ActivityStatus,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

    let activity = ItineraryActivity {
        id: format!("activity-{}", now),
        itinerary_id: itinerary_id.clone(),
        title,
        description,
        destination_id,
        date,
        time,
        duration,
        cost,
        added_by,
        added_by_name,
        vote_count: 0,
        status,
        timestamp: now,
    };

    ctx.db.itinerary_activity().insert(activity);

    // Update itinerary updated_at
    if let Some(itinerary) = ctx.db.itinerary().id().find(&itinerary_id) {
        ctx.db.itinerary().id().update(Itinerary {
            updated_at: now,
            ..itinerary.clone()
        });
    }

    Ok(())
}

#[spacetimedb(reducer)]
pub fn vote_activity(
    ctx: &ReducerContext,
    activity_id: String,
    user_id: String,
    vote: Vote,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

    // Insert or update vote
    let vote_id = format!("{}-{}", activity_id, user_id);
    let activity_vote = ActivityVote {
        id: vote_id,
        activity_id: activity_id.clone(),
        user_id,
        vote: vote.clone(),
        timestamp: now,
    };

    ctx.db.activity_vote().insert(activity_vote);

    // Recalculate vote count
    let votes: Vec<_> = ctx.db.activity_vote()
        .activity_id()
        .filter(&activity_id)
        .collect();

    let vote_count: i32 = votes.iter().map(|v| {
        match v.vote {
            Vote::Up => 1,
            Vote::Down => -1,
        }
    }).sum();

    // Update activity vote count
    if let Some(activity) = ctx.db.itinerary_activity().id().find(&activity_id) {
        ctx.db.itinerary_activity().id().update(ItineraryActivity {
            vote_count,
            ..activity.clone()
        });
    }

    Ok(())
}

// ============================================================================
// REDUCERS - Sync Operations
// ============================================================================

#[spacetimedb(reducer)]
pub fn queue_action(
    ctx: &ReducerContext,
    action_type: ActionType,
    action: String,
    payload: String,
    user_id: String,
) -> Result<(), String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;

    let pending_action = PendingAction {
        id: format!("{}-{}", action, now),
        action_type,
        action,
        payload,
        user_id,
        timestamp: now,
        retry_count: 0,
        max_retries: 3,
        status: ActionStatus::Pending,
    };

    ctx.db.pending_action().insert(pending_action);

    Ok(())
}

#[spacetimedb(reducer)]
pub fn sync_action(ctx: &ReducerContext, action_id: String) -> Result<(), String> {
    if let Some(action) = ctx.db.pending_action().id().find(&action_id) {
        ctx.db.pending_action().id().update(PendingAction {
            status: ActionStatus::Synced,
            ..action.clone()
        });
    }

    Ok(())
}

#[spacetimedb(reducer)]
pub fn retry_failed_actions(ctx: &ReducerContext) -> Result<u32, String> {
    let failed_actions: Vec<_> = ctx.db.pending_action()
        .iter()
        .filter(|a| matches!(a.status, ActionStatus::Failed))
        .collect();

    let count = failed_actions.len() as u32;

    for action in failed_actions {
        ctx.db.pending_action().id().update(PendingAction {
            status: ActionStatus::Pending,
            retry_count: 0,
            ..action.clone()
        });
    }

    Ok(count)
}

// ============================================================================
// CLEANUP REDUCERS
// ============================================================================

#[spacetimedb(reducer)]
pub fn cleanup_expired_bookings(ctx: &ReducerContext) -> Result<u32, String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    
    let expired: Vec<_> = ctx.db.active_booking()
        .iter()
        .filter(|b| b.expires_at < now)
        .collect();

    let count = expired.len() as u32;

    for booking in expired {
        ctx.db.active_booking().id().delete(&booking.id);
    }

    Ok(count)
}

#[spacetimedb(reducer)]
pub fn cleanup_old_typing_indicators(ctx: &ReducerContext) -> Result<u32, String> {
    let now = ctx.timestamp.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    let timeout = 3000; // 3 seconds
    
    let old_indicators: Vec<_> = ctx.db.typing_indicator()
        .iter()
        .filter(|i| now - i.timestamp > timeout)
        .collect();

    let count = old_indicators.len() as u32;

    for indicator in old_indicators {
        ctx.db.typing_indicator().user_id().delete(&indicator.user_id);
    }

    Ok(count)
}
