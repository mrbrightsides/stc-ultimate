// SpacetimeDB imports
use spacetimedb::{table, reducer, ReducerContext, Identity, Table, Timestamp, TimeDuration, ScheduleAt};
use spacetimedb::SpacetimeType;
use std::time::Duration;

// ------------------------
// Constants
// ------------------------

const BOOKING_LOCK_TIMEOUT_SECS: i64 = 300; // 5 minutes
const BOOKING_VIEWING_EXPIRE_SECS: i64 = 900; // 15 minutes
const BOOKING_CANCELLED_PRUNE_SECS: i64 = 3600; // 1 hour
const TYPING_TIMEOUT_SECS: i64 = 3; // 3 seconds
const DESTINATION_VIEWER_TIMEOUT_SECS: i64 = 15; // 15 seconds
const OFFLINE_MAX_RETRIES: u32 = 3;

// ------------------------
// Custom Types and Enums
// ------------------------

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum BookingStatus {
    Viewing,
    Locked,
    Confirmed,
    Cancelled,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum UserRole {
    Traveler,
    Guide,
    HotelStaff,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum ChatRoomType {
    Destination,
    Hotel,
    Global,
    Group,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum ItineraryRole {
    Owner,
    Editor,
    Viewer,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum ItineraryActivityStatus {
    Proposed,
    Confirmed,
    Completed,
    Cancelled,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum ActionStatus {
    Pending,
    Syncing,
    Synced,
    Failed,
}

// ------------------------
// Booking and Offerings
// ------------------------

#[table(name = offering, public)]
#[derive(Clone)]
pub struct Offering {
    #[primary_key]
    offering_id: String,      // Unique ID for the offering (destination/hotel package)
    #[index(btree)]
    destination_id: String,   // Destination identifier
    name: String,
    capacity: u32,            // Max concurrent bookings
    active: bool,
}

#[table(
    name = booking,
    public,
    index(name = booking_offering_idx, btree(columns = [offering_id])),
    index(name = booking_customer_idx, btree(columns = [customer])),
    index(name = booking_dest_idx, btree(columns = [destination_id]))
)]
#[derive(Clone)]
pub struct Booking {
    #[primary_key]
    #[auto_inc]
    booking_id: u64,
    destination_id: String,
    offering_id: String,
    customer: Identity,
    status: BookingStatus,
    locked_by: Option<Identity>,
    lock_expires_at: Option<Timestamp>,
    // Optional overall expire for viewing holds
    expires_at: Option<Timestamp>,
    created_at: Timestamp,
    updated_at: Timestamp,
}

// ------------------------
// Destination Viewer Tracking
// ------------------------

#[table(
    name = destination_presence,
    public,
    index(name = dest_presence_idx, btree(columns = [destination_id, identity]))
)]
#[derive(Clone)]
pub struct DestinationPresence {
    #[primary_key]
    #[auto_inc]
    id: u64,
    #[index(btree)]
    destination_id: String,
    identity: Identity,
    last_seen: Timestamp,
}

#[table(name = destination_stats, public)]
#[derive(Clone)]
pub struct DestinationStats {
    #[primary_key]
    destination_id: String,
    viewer_count: u32,
    updated_at: Timestamp,
}

// ------------------------
// Live Chat
// ------------------------

#[table(name = chat_room, public)]
#[derive(Clone)]
pub struct ChatRoom {
    #[primary_key]
    room_id: String,
    room_type: ChatRoomType,
    target_id: String, // destination_id or hotel_id; "global" for global rooms
    created_by: Identity,
    created_at: Timestamp,
}

#[table(
    name = chat_message,
    public,
    index(name = chat_msg_room_time_idx, btree(columns = [room_id, timestamp])),
    index(name = chat_msg_sender_idx, btree(columns = [sender]))
)]
#[derive(Clone)]
pub struct ChatMessage {
    #[primary_key]
    #[auto_inc]
    message_id: u64,
    #[index(btree)]
    room_id: String,
    sender: Identity,
    role: UserRole,
    message: String,
    is_system: bool,
    timestamp: Timestamp,
}

#[table(
    name = chat_presence,
    public,
    index(name = chat_presence_room_user_idx, btree(columns = [room_id, identity]))
)]
#[derive(Clone)]
pub struct ChatPresence {
    #[primary_key]
    #[auto_inc]
    id: u64,
    #[index(btree)]
    room_id: String,
    identity: Identity,
    role: UserRole,
    is_typing: bool,
    last_seen: Timestamp,
}

#[table(name = chat_room_stats, public)]
#[derive(Clone)]
pub struct ChatRoomStats {
    #[primary_key]
    room_id: String,
    participant_count: u32,
    typing_count: u32,
    updated_at: Timestamp,
}

// ------------------------
// Collaborative Itineraries
// ------------------------

#[table(name = itinerary, public)]
#[derive(Clone)]
pub struct Itinerary {
    #[primary_key]
    #[auto_inc]
    itinerary_id: u64,
    title: String,
    owner: Identity,
    budget_limit_cents: i64,
    total_estimated_cents: i64,
    created_at: Timestamp,
    updated_at: Timestamp,
}

#[table(
    name = itinerary_participant,
    public,
    index(name = it_participant_it_user_idx, btree(columns = [itinerary_id, identity]))
)]
#[derive(Clone)]
pub struct ItineraryParticipant {
    #[primary_key]
    #[auto_inc]
    id: u64,
    #[index(btree)]
    itinerary_id: u64,
    identity: Identity,
    role: ItineraryRole,
    added_at: Timestamp,
}

#[table(
    name = itinerary_presence,
    public,
    index(name = it_presence_it_user_idx, btree(columns = [itinerary_id, identity]))
)]
#[derive(Clone)]
pub struct ItineraryPresence {
    #[primary_key]
    #[auto_inc]
    id: u64,
    #[index(btree)]
    itinerary_id: u64,
    identity: Identity,
    is_active: bool,
    last_seen: Timestamp,
}

#[table(
    name = itinerary_activity,
    public,
    index(name = activity_itinerary_idx, btree(columns = [itinerary_id]))
)]
#[derive(Clone)]
pub struct ItineraryActivity {
    #[primary_key]
    #[auto_inc]
    activity_id: u64,
    #[index(btree)]
    itinerary_id: u64,
    title: String,
    description: String,
    scheduled_at: Option<Timestamp>,
    status: ItineraryActivityStatus,
    estimated_cost_cents: i64,
    added_by: Identity,
    added_at: Timestamp,
}

#[table(
    name = activity_vote,
    public,
    index(name = vote_activity_user_idx, btree(columns = [activity_id, voter]))
)]
#[derive(Clone)]
pub struct ActivityVote {
    #[primary_key]
    #[auto_inc]
    id: u64,
    #[index(btree)]
    activity_id: u64,
    voter: Identity,
    vote: i8, // -1, 0, +1
    updated_at: Timestamp,
}

// ------------------------
// Offline-first Support
// ------------------------

#[table(
    name = pending_action,
    public,
    index(name = pending_action_owner_idx, btree(columns = [owner]))
)]
#[derive(Clone)]
pub struct PendingAction {
    #[primary_key]
    #[auto_inc]
    action_id: u64,
    #[index(btree)]
    owner: Identity,
    action_type: String,
    payload: String, // app-defined JSON or similar
    status: ActionStatus,
    conflict_reason: String,
    created_at: Timestamp,
    last_attempt: Option<Timestamp>,
    retry_count: u32,
    target: String, // logical target reference (e.g., "itinerary:123")
}

#[table(name = sync_state, public)]
#[derive(Clone)]
pub struct SyncState {
    #[primary_key]
    identity: Identity,
    last_seen: Timestamp,
    can_auto_sync: bool,
}

// ------------------------
// Scheduled Maintenance
// ------------------------

#[table(name = maintenance_schedule, public, scheduled(maintenance_tick))]
#[derive(Clone)]
pub struct MaintenanceSchedule {
    #[primary_key]
    #[auto_inc]
    scheduled_id: u64,
    scheduled_at: ScheduleAt,
}

// ------------------------
// Helper functions
// ------------------------

fn now(ctx: &ReducerContext) -> Timestamp {
    ctx.timestamp
}

fn lock_is_active(lock_expires_at: &Option<Timestamp>, now: &Timestamp) -> bool {
    match lock_expires_at {
        Some(le) => le.to_micros_since_unix_epoch() > now.to_micros_since_unix_epoch(),
        None => false,
    }
}

fn timestamp_minus_secs(ts: &Timestamp, secs: i64) -> Timestamp {
    let dur = TimeDuration::from_duration(Duration::from_secs(secs as u64));
    ts.checked_sub(dur).unwrap_or(*ts)
}

fn timestamp_plus_secs(ts: &Timestamp, secs: i64) -> Timestamp {
    ts.checked_add(TimeDuration::from_duration(Duration::from_secs(secs as u64)))
        .unwrap_or(*ts)
}

// Permissions
fn get_itinerary_role(ctx: &ReducerContext, itinerary_id: u64, who: Identity) -> Option<ItineraryRole> {
    for p in ctx.db.itinerary_participant().iter() {
        if p.itinerary_id == itinerary_id && p.identity == who {
            return Some(p.role.clone());
        }
    }
    None
}

fn can_edit_itinerary(ctx: &ReducerContext, itinerary_id: u64, who: Identity) -> bool {
    if let Some(role) = get_itinerary_role(ctx, itinerary_id, who) {
        matches!(role, ItineraryRole::Owner | ItineraryRole::Editor)
    } else {
        false
    }
}

fn recompute_room_stats(ctx: &ReducerContext, room_id: &str) {
    let mut participants: u32 = 0;
    let mut typing: u32 = 0;
    for p in ctx.db.chat_presence().iter() {
        if p.room_id == room_id {
            participants += 1;
            if p.is_typing {
                typing += 1;
            }
        }
    }
    if let Some(mut s) = ctx.db.chat_room_stats().room_id().find(&room_id.to_string()) {
        s.participant_count = participants;
        s.typing_count = typing;
        s.updated_at = now(ctx);
        ctx.db.chat_room_stats().room_id().update(s);
    } else {
        let s = ChatRoomStats {
            room_id: room_id.to_string(),
            participant_count: participants,
            typing_count: typing,
            updated_at: now(ctx),
        };
        ctx.db.chat_room_stats().insert(s);
    }
}

fn recompute_destination_stats(ctx: &ReducerContext, destination_id: &str) {
    let mut viewers: u32 = 0;
    for pr in ctx.db.destination_presence().iter() {
        if pr.destination_id == destination_id {
            viewers += 1;
        }
    }
    if let Some(mut s) = ctx.db.destination_stats().destination_id().find(&destination_id.to_string()) {
        s.viewer_count = viewers;
        s.updated_at = now(ctx);
        ctx.db.destination_stats().destination_id().update(s);
    } else {
        let s = DestinationStats {
            destination_id: destination_id.to_string(),
            viewer_count: viewers,
            updated_at: now(ctx),
        };
        ctx.db.destination_stats().insert(s);
    }
}

fn recompute_itinerary_totals(ctx: &ReducerContext, itinerary_id: u64) {
    let mut sum: i64 = 0;
    for a in ctx.db.itinerary_activity().iter() {
        if a.itinerary_id == itinerary_id && a.status != ItineraryActivityStatus::Cancelled {
            sum = sum.saturating_add(a.estimated_cost_cents);
        }
    }
    if let Some(mut it) = ctx.db.itinerary().itinerary_id().find(&itinerary_id) {
        it.total_estimated_cents = sum;
        it.updated_at = now(ctx);
        ctx.db.itinerary().itinerary_id().update(it);
    }
}

// ------------------------
// Lifecycle Reducers
// ------------------------

#[reducer(init)]
pub fn init(ctx: &ReducerContext) -> Result<(), String> {
    if ctx.db.maintenance_schedule().count() == 0 {
        let schedule = MaintenanceSchedule {
            scheduled_id: 0,
            scheduled_at: ScheduleAt::Interval(Duration::from_secs(1).into()),
        };
        let _ = ctx.db.maintenance_schedule().try_insert(schedule);
    }
    Ok(())
}

#[reducer(client_connected)]
pub fn identity_connected(ctx: &ReducerContext) {
    let state = SyncState {
        identity: ctx.sender,
        last_seen: now(ctx),
        can_auto_sync: true,
    };
    if let Some(mut existing) = ctx.db.sync_state().identity().find(&ctx.sender) {
        existing.last_seen = state.last_seen;
        existing.can_auto_sync = state.can_auto_sync;
        ctx.db.sync_state().identity().update(existing);
    } else {
        ctx.db.sync_state().insert(state);
    }

    // Auto-sync trigger: mark pending/failed actions as syncing (up to max retries)
    let mut to_update: Vec<u64> = Vec::new();
    for a in ctx.db.pending_action().iter() {
        if a.owner == ctx.sender {
            if a.status == ActionStatus::Pending || (a.status == ActionStatus::Failed && a.retry_count < OFFLINE_MAX_RETRIES) {
                to_update.push(a.action_id);
            }
        }
    }
    for id in to_update {
        if let Some(mut a) = ctx.db.pending_action().action_id().find(&id) {
            if a.retry_count < OFFLINE_MAX_RETRIES {
                a.status = ActionStatus::Syncing;
                a.last_attempt = Some(now(ctx));
                a.retry_count = a.retry_count.saturating_add(1);
                ctx.db.pending_action().action_id().update(a);
            }
        }
    }
}

#[reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    // Update sync state
    if let Some(mut s) = ctx.db.sync_state().identity().find(&ctx.sender) {
        s.last_seen = now(ctx);
        ctx.db.sync_state().identity().update(s);
    } else {
        let s = SyncState {
            identity: ctx.sender,
            last_seen: now(ctx),
            can_auto_sync: false,
        };
        ctx.db.sync_state().insert(s);
    }

    // Mark chat presence as not typing and update last_seen
    let me = ctx.sender;
    let mut rooms_changed: Vec<String> = Vec::new();
    let mut to_update: Vec<u64> = Vec::new();
    for p in ctx.db.chat_presence().iter() {
        if p.identity == me {
            to_update.push(p.id);
            rooms_changed.push(p.room_id.clone());
        }
    }
    for id in to_update {
        if let Some(mut p) = ctx.db.chat_presence().id().find(&id) {
            p.is_typing = false;
            p.last_seen = now(ctx);
            ctx.db.chat_presence().id().update(p);
        }
    }
    // Recompute stats for changed rooms
    rooms_changed.sort();
    rooms_changed.dedup();
    for room in rooms_changed {
        recompute_room_stats(ctx, &room);
    }

    // Mark itinerary presence inactive
    let mut pres_to_update: Vec<u64> = Vec::new();
    for pr in ctx.db.itinerary_presence().iter() {
        if pr.identity == me {
            pres_to_update.push(pr.id);
        }
    }
    for id in pres_to_update {
        if let Some(mut pr) = ctx.db.itinerary_presence().id().find(&id) {
            pr.is_active = false;
            pr.last_seen = now(ctx);
            ctx.db.itinerary_presence().id().update(pr);
        }
    }

    // Destination presence removal
    let mut dests: Vec<String> = Vec::new();
    let mut dest_rows: Vec<u64> = Vec::new();
    for dp in ctx.db.destination_presence().iter() {
        if dp.identity == me {
            dest_rows.push(dp.id);
            dests.push(dp.destination_id.clone());
        }
    }
    for id in dest_rows {
        if let Some(row) = ctx.db.destination_presence().id().find(&id) {
            ctx.db.destination_presence().id().delete(&row.id);
        }
    }
    dests.sort();
    dests.dedup();
    for d in dests {
        recompute_destination_stats(ctx, &d);
    }
}

// ------------------------
// Booking Reducers
// ------------------------

#[reducer]
pub fn start_viewing_offering(
    ctx: &ReducerContext,
    destination_id: String,
    offering_id: String,
) -> Result<(), String> {
    // Ensure offering exists and is active
    let off = ctx.db.offering().offering_id().find(&offering_id);
    if off.is_none() {
        return Err("Offering not found".into());
    }
    let offering = off.unwrap();
    if !offering.active {
        return Err("Offering is not active".into());
    }

    // Find existing booking by this user for this offering
    let mut existing_id: Option<u64> = None;
    for b in ctx.db.booking().iter() {
        if b.customer == ctx.sender && b.offering_id == offering_id {
            existing_id = Some(b.booking_id);
            break;
        }
    }

    let expire_at = Some(timestamp_plus_secs(&now(ctx), BOOKING_VIEWING_EXPIRE_SECS));
    if let Some(id) = existing_id {
        if let Some(mut b) = ctx.db.booking().booking_id().find(&id) {
            b.status = BookingStatus::Viewing;
            b.locked_by = None;
            b.lock_expires_at = None;
            b.expires_at = expire_at;
            b.destination_id = destination_id;
            b.updated_at = now(ctx);
            ctx.db.booking().booking_id().update(b);
        }
    } else {
        let b = Booking {
            booking_id: 0,
            destination_id,
            offering_id,
            customer: ctx.sender,
            status: BookingStatus::Viewing,
            locked_by: None,
            lock_expires_at: None,
            expires_at: expire_at,
            created_at: now(ctx),
            updated_at: now(ctx),
        };
        ctx.db.booking().insert(b);
    }

    Ok(())
}

#[reducer]
pub fn acquire_booking_lock(
    ctx: &ReducerContext,
    destination_id: String,
    offering_id: String,
    _lock_seconds: u32,
) -> Result<(), String> {
    // Ensure offering exists and active
    let off = ctx.db.offering().offering_id().find(&offering_id);
    if off.is_none() {
        return Err("Offering not found".into());
    }
    let offering = off.unwrap();
    if !offering.active {
        return Err("Offering is not active".into());
    }

    // Compute used capacity: confirmed + active locks
    let current_time = now(ctx);
    let mut used: u32 = 0;
    for b in ctx.db.booking().iter() {
        if b.offering_id == offering_id {
            match b.status {
                BookingStatus::Confirmed => used += 1,
                BookingStatus::Locked => {
                    if lock_is_active(&b.lock_expires_at, &current_time) {
                        used += 1;
                    }
                }
                _ => {}
            }
        }
    }
    if used >= offering.capacity {
        return Err("Capacity exhausted for this offering".into());
    }

    // Upsert booking: set to Locked with fixed timeout
    let mut existing_id: Option<u64> = None;
    for b in ctx.db.booking().iter() {
        if b.customer == ctx.sender && b.offering_id == offering_id {
            existing_id = Some(b.booking_id);
            break;
        }
    }

    let expires = timestamp_plus_secs(&current_time, BOOKING_LOCK_TIMEOUT_SECS);

    if let Some(id) = existing_id {
        if let Some(mut b) = ctx.db.booking().booking_id().find(&id) {
            b.status = BookingStatus::Locked;
            b.locked_by = Some(ctx.sender);
            b.lock_expires_at = Some(expires);
            b.expires_at = None;
            b.destination_id = destination_id;
            b.updated_at = current_time;
            ctx.db.booking().booking_id().update(b);
        }
    } else {
        let b = Booking {
            booking_id: 0,
            destination_id,
            offering_id,
            customer: ctx.sender,
            status: BookingStatus::Locked,
            locked_by: Some(ctx.sender),
            lock_expires_at: Some(expires),
            expires_at: None,
            created_at: current_time,
            updated_at: current_time,
        };
        ctx.db.booking().insert(b);
    }

    Ok(())
}

#[reducer]
pub fn release_booking_lock(ctx: &ReducerContext, booking_id: u64) -> Result<(), String> {
    if let Some(mut b) = ctx.db.booking().booking_id().find(&booking_id) {
        if b.locked_by == Some(ctx.sender) || b.customer == ctx.sender {
            b.status = BookingStatus::Cancelled;
            b.locked_by = None;
            b.lock_expires_at = None;
            b.expires_at = None;
            b.updated_at = now(ctx);
            ctx.db.booking().booking_id().update(b);
            return Ok(());
        } else {
            return Err("Not authorized to release this lock".into());
        }
    }
    Err("Booking not found".into())
}

#[reducer]
pub fn confirm_booking(ctx: &ReducerContext, booking_id: u64) -> Result<(), String> {
    if let Some(mut b) = ctx.db.booking().booking_id().find(&booking_id) {
        // Only lock owner can confirm and lock must be active
        let current_time = now(ctx);
        if b.locked_by != Some(ctx.sender) {
            return Err("Only the lock owner can confirm this booking".into());
        }
        if !lock_is_active(&b.lock_expires_at, &current_time) {
            return Err("Lock has expired".into());
        }

        // Re-validate capacity (atomic within reducer)
        let off = ctx.db.offering().offering_id().find(&b.offering_id);
        if off.is_none() {
            return Err("Offering not found".into());
        }
        let offering = off.unwrap();

        let mut used: u32 = 0;
        for x in ctx.db.booking().iter() {
            if x.offering_id == b.offering_id {
                match x.status {
                    BookingStatus::Confirmed => used += 1,
                    BookingStatus::Locked => {
                        if lock_is_active(&x.lock_expires_at, &current_time) {
                            used += 1;
                        }
                    }
                    _ => {}
                }
            }
        }
        if used > offering.capacity {
            return Err("Capacity exhausted at confirmation time".into());
        }

        b.status = BookingStatus::Confirmed;
        b.locked_by = None;
        b.lock_expires_at = None;
        b.expires_at = None;
        b.updated_at = current_time;
        ctx.db.booking().booking_id().update(b);
        Ok(())
    } else {
        Err("Booking not found".into())
    }
}

#[reducer]
pub fn cancel_booking(ctx: &ReducerContext, booking_id: u64) -> Result<(), String> {
    if let Some(mut b) = ctx.db.booking().booking_id().find(&booking_id) {
        if b.customer != ctx.sender && b.locked_by != Some(ctx.sender) {
            return Err("Not authorized to cancel this booking".into());
        }
        b.status = BookingStatus::Cancelled;
        b.locked_by = None;
        b.lock_expires_at = None;
        b.expires_at = None;
        b.updated_at = now(ctx);
        ctx.db.booking().booking_id().update(b);
        Ok(())
    } else {
        Err("Booking not found".into())
    }
}

// ------------------------
// Destination Viewer Reducers
// ------------------------

#[reducer]
pub fn enter_destination_view(ctx: &ReducerContext, destination_id: String) -> Result<(), String> {
    // Upsert presence
    let mut existing_id: Option<u64> = None;
    for dp in ctx.db.destination_presence().iter() {
        if dp.destination_id == destination_id && dp.identity == ctx.sender {
            existing_id = Some(dp.id);
            break;
        }
    }
    if let Some(id) = existing_id {
        if let Some(mut dp) = ctx.db.destination_presence().id().find(&id) {
            dp.last_seen = now(ctx);
            ctx.db.destination_presence().id().update(dp);
        }
    } else {
        let dp = DestinationPresence {
            id: 0,
            destination_id: destination_id.clone(),
            identity: ctx.sender,
            last_seen: now(ctx),
        };
        ctx.db.destination_presence().insert(dp);
    }
    recompute_destination_stats(ctx, &destination_id);
    Ok(())
}

#[reducer]
pub fn destination_heartbeat(ctx: &ReducerContext, destination_id: String) -> Result<(), String> {
    for dp in ctx.db.destination_presence().iter() {
        if dp.destination_id == destination_id && dp.identity == ctx.sender {
            if let Some(mut row) = ctx.db.destination_presence().id().find(&dp.id) {
                row.last_seen = now(ctx);
                ctx.db.destination_presence().id().update(row);
            }
            return Ok(());
        }
    }
    // If not present, insert
    let dp = DestinationPresence {
        id: 0,
        destination_id: destination_id.clone(),
        identity: ctx.sender,
        last_seen: now(ctx),
    };
    ctx.db.destination_presence().insert(dp);
    recompute_destination_stats(ctx, &destination_id);
    Ok(())
}

#[reducer]
pub fn leave_destination_view(ctx: &ReducerContext, destination_id: String) -> Result<(), String> {
    let mut removed = false;
    let mut to_delete: Vec<u64> = Vec::new();
    for dp in ctx.db.destination_presence().iter() {
        if dp.destination_id == destination_id && dp.identity == ctx.sender {
            to_delete.push(dp.id);
        }
    }
    for id in to_delete {
        ctx.db.destination_presence().id().delete(&id);
        removed = true;
    }
    if removed {
        recompute_destination_stats(ctx, &destination_id);
    }
    Ok(())
}

// ------------------------
// Chat Reducers
// ------------------------

#[reducer]
pub fn create_or_join_room(
    ctx: &ReducerContext,
    room_id: String,
    room_type: ChatRoomType,
    target_id: String,
    role: UserRole,
) -> Result<(), String> {
    // Create room if missing
    if ctx.db.chat_room().room_id().find(&room_id).is_none() {
        let room = ChatRoom {
            room_id: room_id.clone(),
            room_type: room_type.clone(),
            target_id: target_id.clone(),
            created_by: ctx.sender,
            created_at: now(ctx),
        };
        ctx.db.chat_room().insert(room);
    }

    // Upsert presence
    let mut presence_id: Option<u64> = None;
    for p in ctx.db.chat_presence().iter() {
        if p.room_id == room_id && p.identity == ctx.sender {
            presence_id = Some(p.id);
            break;
        }
    }
    if let Some(id) = presence_id {
        if let Some(mut p) = ctx.db.chat_presence().id().find(&id) {
            p.role = role;
            p.is_typing = false;
            p.last_seen = now(ctx);
            ctx.db.chat_presence().id().update(p);
        }
    } else {
        let p = ChatPresence {
            id: 0,
            room_id: room_id.clone(),
            identity: ctx.sender,
            role,
            is_typing: false,
            last_seen: now(ctx),
        };
        ctx.db.chat_presence().insert(p);
    }

    recompute_room_stats(ctx, &room_id);
    Ok(())
}

#[reducer]
pub fn leave_room(ctx: &ReducerContext, room_id: String) -> Result<(), String> {
    let mut to_delete: Vec<u64> = Vec::new();
    for p in ctx.db.chat_presence().iter() {
        if p.room_id == room_id && p.identity == ctx.sender {
            to_delete.push(p.id);
        }
    }
    for id in to_delete {
        ctx.db.chat_presence().id().delete(&id);
    }
    recompute_room_stats(ctx, &room_id);
    Ok(())
}

#[reducer]
pub fn set_typing(ctx: &ReducerContext, room_id: String, is_typing: bool) -> Result<(), String> {
    for p in ctx.db.chat_presence().iter() {
        if p.room_id == room_id && p.identity == ctx.sender {
            if let Some(mut row) = ctx.db.chat_presence().id().find(&p.id) {
                row.is_typing = is_typing;
                row.last_seen = now(ctx);
                ctx.db.chat_presence().id().update(row);
            }
            recompute_room_stats(ctx, &room_id);
            return Ok(());
        }
    }
    Err("Presence not found in room".into())
}

#[reducer]
pub fn send_message(ctx: &ReducerContext, room_id: String, role: UserRole, message: String) -> Result<(), String> {
    let msg = ChatMessage {
        message_id: 0,
        room_id,
        sender: ctx.sender,
        role,
        message,
        is_system: false,
        timestamp: now(ctx),
    };
    ctx.db.chat_message().insert(msg);
    Ok(())
}

#[reducer]
pub fn send_system_message(ctx: &ReducerContext, room_id: String, message: String) -> Result<(), String> {
    let msg = ChatMessage {
        message_id: 0,
        room_id,
        sender: ctx.sender, // can be used to audit who triggered the system message
        role: UserRole::Traveler, // role not meaningful for system, but required
        message,
        is_system: true,
        timestamp: now(ctx),
    };
    ctx.db.chat_message().insert(msg);
    Ok(())
}

// ------------------------
// Itinerary Reducers
// ------------------------

#[reducer]
pub fn create_itinerary(ctx: &ReducerContext, title: String) -> Result<(), String> {
    let it = Itinerary {
        itinerary_id: 0,
        title: title.clone(),
        owner: ctx.sender,
        budget_limit_cents: 0,
        total_estimated_cents: 0,
        created_at: now(ctx),
        updated_at: now(ctx),
    };
    let inserted = match ctx.db.itinerary().try_insert(it) {
        Ok(row) => row,
        Err(e) => return Err(format!("Failed to create itinerary: {}", e)),
    };

    // Add owner as participant
    let part = ItineraryParticipant {
        id: 0,
        itinerary_id: inserted.itinerary_id,
        identity: ctx.sender,
        role: ItineraryRole::Owner,
        added_at: now(ctx),
    };
    ctx.db.itinerary_participant().insert(part);

    Ok(())
}

#[reducer]
pub fn set_itinerary_title(ctx: &ReducerContext, itinerary_id: u64, title: String) -> Result<(), String> {
    if !can_edit_itinerary(ctx, itinerary_id, ctx.sender) {
        return Err("Only owner/editor can modify itinerary".into());
    }
    if let Some(mut it) = ctx.db.itinerary().itinerary_id().find(&itinerary_id) {
        it.title = title;
        it.updated_at = now(ctx);
        ctx.db.itinerary().itinerary_id().update(it);
    }
    Ok(())
}

#[reducer]
pub fn set_itinerary_budget(ctx: &ReducerContext, itinerary_id: u64, budget_limit_cents: i64) -> Result<(), String> {
    // Only owner can set budget
    if let Some(role) = get_itinerary_role(ctx, itinerary_id, ctx.sender) {
        if !matches!(role, ItineraryRole::Owner) {
            return Err("Only owner can set budget".into());
        }
    } else {
        return Err("Not a participant".into());
    }
    if let Some(mut it) = ctx.db.itinerary().itinerary_id().find(&itinerary_id) {
        it.budget_limit_cents = budget_limit_cents;
        it.updated_at = now(ctx);
        ctx.db.itinerary().itinerary_id().update(it);
        recompute_itinerary_totals(ctx, itinerary_id);
        Ok(())
    } else {
        Err("Itinerary not found".into())
    }
}

#[reducer]
pub fn add_participant(
    ctx: &ReducerContext,
    itinerary_id: u64,
    identity: Identity,
    role: ItineraryRole,
) -> Result<(), String> {
    if let Some(it) = ctx.db.itinerary().itinerary_id().find(&itinerary_id) {
        if it.owner != ctx.sender {
            return Err("Only the owner can add participants".into());
        }
        // Prevent duplicates
        for p in ctx.db.itinerary_participant().iter() {
            if p.itinerary_id == itinerary_id && p.identity == identity {
                return Ok(());
            }
        }
        let part = ItineraryParticipant {
            id: 0,
            itinerary_id,
            identity,
            role,
            added_at: now(ctx),
        };
        ctx.db.itinerary_participant().insert(part);
        Ok(())
    } else {
        Err("Itinerary not found".into())
    }
}

#[reducer]
pub fn remove_participant(
    ctx: &ReducerContext,
    itinerary_id: u64,
    identity: Identity,
) -> Result<(), String> {
    if let Some(it) = ctx.db.itinerary().itinerary_id().find(&itinerary_id) {
        if it.owner != ctx.sender && identity != ctx.sender {
            return Err("Only the owner can remove other participants".into());
        }
        let mut to_delete: Vec<u64> = Vec::new();
        for p in ctx.db.itinerary_participant().iter() {
            if p.itinerary_id == itinerary_id && p.identity == identity {
                to_delete.push(p.id);
            }
        }
        for id in to_delete {
            ctx.db.itinerary_participant().id().delete(&id);
        }
        Ok(())
    } else {
        Err("Itinerary not found".into())
    }
}

#[reducer]
pub fn join_itinerary(ctx: &ReducerContext, itinerary_id: u64) -> Result<(), String> {
    // Require participation
    let mut is_participant = false;
    for p in ctx.db.itinerary_participant().iter() {
        if p.itinerary_id == itinerary_id && p.identity == ctx.sender {
            is_participant = true;
            break;
        }
    }
    if !is_participant {
        return Err("You are not a participant of this itinerary".into());
    }

    // Upsert presence
    let mut presence_id: Option<u64> = None;
    for pr in ctx.db.itinerary_presence().iter() {
        if pr.itinerary_id == itinerary_id && pr.identity == ctx.sender {
            presence_id = Some(pr.id);
            break;
        }
    }
    if let Some(id) = presence_id {
        if let Some(mut pr) = ctx.db.itinerary_presence().id().find(&id) {
            pr.is_active = true;
            pr.last_seen = now(ctx);
            ctx.db.itinerary_presence().id().update(pr);
        }
    } else {
        let pr = ItineraryPresence {
            id: 0,
            itinerary_id,
            identity: ctx.sender,
            is_active: true,
            last_seen: now(ctx),
        };
        ctx.db.itinerary_presence().insert(pr);
    }

    Ok(())
}

#[reducer]
pub fn leave_itinerary(ctx: &ReducerContext, itinerary_id: u64) -> Result<(), String> {
    for pr in ctx.db.itinerary_presence().iter() {
        if pr.itinerary_id == itinerary_id && pr.identity == ctx.sender {
            if let Some(mut row) = ctx.db.itinerary_presence().id().find(&pr.id) {
                row.is_active = false;
                row.last_seen = now(ctx);
                ctx.db.itinerary_presence().id().update(row);
            }
            return Ok(());
        }
    }
    Ok(())
}

#[reducer]
pub fn add_activity(
    ctx: &ReducerContext,
    itinerary_id: u64,
    title: String,
    description: String,
    scheduled_at: Option<Timestamp>,
    estimated_cost_cents: i64,
) -> Result<(), String> {
    // Require edit permission
    if !can_edit_itinerary(ctx, itinerary_id, ctx.sender) {
        return Err("Only owner/editor can add activities".into());
    }

    // Insert activity
    let act = ItineraryActivity {
        activity_id: 0,
        itinerary_id,
        title,
        description,
        scheduled_at,
        status: ItineraryActivityStatus::Proposed,
        estimated_cost_cents,
        added_by: ctx.sender,
        added_at: now(ctx),
    };
    ctx.db.itinerary_activity().insert(act);

    recompute_itinerary_totals(ctx, itinerary_id);
    Ok(())
}

#[reducer]
pub fn update_activity(
    ctx: &ReducerContext,
    activity_id: u64,
    title: Option<String>,
    description: Option<String>,
    scheduled_at: Option<Option<Timestamp>>,
    status: Option<ItineraryActivityStatus>,
    estimated_cost_cents: Option<i64>,
) -> Result<(), String> {
    if let Some(mut act) = ctx.db.itinerary_activity().activity_id().find(&activity_id) {
        if !can_edit_itinerary(ctx, act.itinerary_id, ctx.sender) && act.added_by != ctx.sender {
            return Err("Not authorized to update this activity".into());
        }
        if let Some(t) = title { act.title = t; }
        if let Some(d) = description { act.description = d; }
        if let Some(sched) = scheduled_at { act.scheduled_at = sched; }
        if let Some(st) = status { act.status = st; }
        if let Some(cost) = estimated_cost_cents { act.estimated_cost_cents = cost; }
        ctx.db.itinerary_activity().activity_id().update(act);
        // Recompute totals
        // Need itinerary_id from updated row
        if let Some(updated) = ctx.db.itinerary_activity().activity_id().find(&activity_id) {
            recompute_itinerary_totals(ctx, updated.itinerary_id);
        }
        Ok(())
    } else {
        Err("Activity not found".into())
    }
}

#[reducer]
pub fn remove_activity(ctx: &ReducerContext, activity_id: u64) -> Result<(), String> {
    if let Some(act) = ctx.db.itinerary_activity().activity_id().find(&activity_id) {
        // Only owner/editor or activity adder can remove
        let mut allowed = false;
        if act.added_by == ctx.sender {
            allowed = true;
        }
        if can_edit_itinerary(ctx, act.itinerary_id, ctx.sender) {
            allowed = true;
        }
        if !allowed {
            return Err("Not authorized to remove this activity".into());
        }

        // Delete votes for this activity
        let mut votes_to_delete: Vec<u64> = Vec::new();
        for v in ctx.db.activity_vote().iter() {
            if v.activity_id == activity_id {
                votes_to_delete.push(v.id);
            }
        }
        for id in votes_to_delete {
            ctx.db.activity_vote().id().delete(&id);
        }

        // Delete activity
        ctx.db.itinerary_activity().activity_id().delete(&activity_id);

        // Recompute totals
        recompute_itinerary_totals(ctx, act.itinerary_id);

        Ok(())
    } else {
        Err("Activity not found".into())
    }
}

#[reducer]
pub fn vote_activity(ctx: &ReducerContext, activity_id: u64, vote: i8) -> Result<(), String> {
    if vote < -1 || vote > 1 {
        return Err("Vote must be -1, 0, or 1".into());
    }

    // Ensure activity exists
    let act = match ctx.db.itinerary_activity().activity_id().find(&activity_id) {
        Some(a) => a,
        None => return Err("Activity not found".into()),
    };

    // Must be participant to vote
    if get_itinerary_role(ctx, act.itinerary_id, ctx.sender).is_none() {
        return Err("Not a participant".into());
    }

    // Upsert vote; vote==0 means clear
    let mut existing_id: Option<u64> = None;
    for v in ctx.db.activity_vote().iter() {
        if v.activity_id == activity_id && v.voter == ctx.sender {
            existing_id = Some(v.id);
            break;
        }
    }

    if vote == 0 {
        if let Some(id) = existing_id {
            ctx.db.activity_vote().id().delete(&id);
        }
        return Ok(());
    }

    if let Some(id) = existing_id {
        if let Some(mut v) = ctx.db.activity_vote().id().find(&id) {
            v.vote = vote;
            v.updated_at = now(ctx);
            ctx.db.activity_vote().id().update(v);
        }
    } else {
        let v = ActivityVote {
            id: 0,
            activity_id,
            voter: ctx.sender,
            vote,
            updated_at: now(ctx),
        };
        ctx.db.activity_vote().insert(v);
    }

    Ok(())
}

// ------------------------
// Offline-first Reducers
// ------------------------

#[reducer]
pub fn enqueue_pending_action(
    ctx: &ReducerContext,
    action_type: String,
    payload: String,
    target: String,
) -> Result<(), String> {
    let a = PendingAction {
        action_id: 0,
        owner: ctx.sender,
        action_type,
        payload,
        status: ActionStatus::Pending,
        conflict_reason: String::new(),
        created_at: now(ctx),
        last_attempt: None,
        retry_count: 0,
        target,
    };
    ctx.db.pending_action().insert(a);
    Ok(())
}

#[reducer]
pub fn request_sync_attempt(ctx: &ReducerContext, action_id: u64) -> Result<(), String> {
    if let Some(mut a) = ctx.db.pending_action().action_id().find(&action_id) {
        if a.owner != ctx.sender {
            return Err("Cannot modify actions owned by another identity".into());
        }
        if a.retry_count >= OFFLINE_MAX_RETRIES {
            return Err("Max retries reached".into());
        }
        a.status = ActionStatus::Syncing;
        a.last_attempt = Some(now(ctx));
        a.retry_count = a.retry_count.saturating_add(1);
        ctx.db.pending_action().action_id().update(a);
        Ok(())
    } else {
        Err("Pending action not found".into())
    }
}

#[reducer]
pub fn mark_action_synced(ctx: &ReducerContext, action_id: u64) -> Result<(), String> {
    if let Some(mut a) = ctx.db.pending_action().action_id().find(&action_id) {
        if a.owner != ctx.sender {
            return Err("Cannot modify actions owned by another identity".into());
        }
        a.status = ActionStatus::Synced;
        a.last_attempt = Some(now(ctx));
        ctx.db.pending_action().action_id().update(a);
        Ok(())
    } else {
        Err("Pending action not found".into())
    }
}

#[reducer]
pub fn mark_action_failed(ctx: &ReducerContext, action_id: u64, reason: String) -> Result<(), String> {
    if let Some(mut a) = ctx.db.pending_action().action_id().find(&action_id) {
        if a.owner != ctx.sender {
            return Err("Cannot modify actions owned by another identity".into());
        }
        a.status = ActionStatus::Failed;
        a.conflict_reason = reason;
        a.last_attempt = Some(now(ctx));
        ctx.db.pending_action().action_id().update(a);
        Ok(())
    } else {
        Err("Pending action not found".into())
    }
}

#[reducer]
pub fn update_sync_state(ctx: &ReducerContext, can_auto_sync: bool) -> Result<(), String> {
    if let Some(mut s) = ctx.db.sync_state().identity().find(&ctx.sender) {
        s.can_auto_sync = can_auto_sync;
        s.last_seen = now(ctx);
        ctx.db.sync_state().identity().update(s);
    } else {
        let s = SyncState {
            identity: ctx.sender,
            last_seen: now(ctx),
            can_auto_sync,
        };
        ctx.db.sync_state().insert(s);
    }
    Ok(())
}

// ------------------------
// Maintenance Tick (Scheduled)
// ------------------------

#[reducer]
pub fn maintenance_tick(ctx: &ReducerContext, _tick_info: MaintenanceSchedule) -> Result<(), String> {
    // Ensure only scheduler invokes
    if ctx.sender != ctx.identity() {
        return Err("Reducer 'maintenance_tick' may not be invoked by clients, only via scheduling.".into());
    }

    let now_ts = now(ctx);
    let typing_cutoff = timestamp_minus_secs(&now_ts, TYPING_TIMEOUT_SECS);
    let viewer_cutoff = timestamp_minus_secs(&now_ts, DESTINATION_VIEWER_TIMEOUT_SECS);

    // 1) Cleanup booking locks and expired viewings; prune old cancelled
    let mut to_update_bookings: Vec<u64> = Vec::new();
    let mut to_cancel_viewing: Vec<u64> = Vec::new();
    let mut to_prune_cancelled: Vec<u64> = Vec::new();
    for b in ctx.db.booking().iter() {
        match b.status {
            BookingStatus::Locked => {
                if !lock_is_active(&b.lock_expires_at, &now_ts) {
                    to_update_bookings.push(b.booking_id);
                }
            }
            BookingStatus::Viewing => {
                if let Some(exp) = b.expires_at {
                    if exp.to_micros_since_unix_epoch() <= now_ts.to_micros_since_unix_epoch() {
                        to_cancel_viewing.push(b.booking_id);
                    }
                }
            }
            BookingStatus::Cancelled => {
                let prune_cutoff = timestamp_minus_secs(&now_ts, BOOKING_CANCELLED_PRUNE_SECS);
                if b.updated_at.to_micros_since_unix_epoch() <= prune_cutoff.to_micros_since_unix_epoch() {
                    to_prune_cancelled.push(b.booking_id);
                }
            }
            _ => {}
        }
    }
    for id in to_update_bookings {
        if let Some(mut b) = ctx.db.booking().booking_id().find(&id) {
            b.status = BookingStatus::Viewing;
            b.locked_by = None;
            b.lock_expires_at = None;
            b.expires_at = Some(timestamp_plus_secs(&now_ts, BOOKING_VIEWING_EXPIRE_SECS));
            b.updated_at = now_ts;
            ctx.db.booking().booking_id().update(b);
        }
    }
    for id in to_cancel_viewing {
        if let Some(mut b) = ctx.db.booking().booking_id().find(&id) {
            b.status = BookingStatus::Cancelled;
            b.locked_by = None;
            b.lock_expires_at = None;
            b.expires_at = None;
            b.updated_at = now_ts;
            ctx.db.booking().booking_id().update(b);
        }
    }
    for id in to_prune_cancelled {
        ctx.db.booking().booking_id().delete(&id);
    }

    // 2) Typing timeout: set is_typing=false if last_seen older than cutoff
    let mut rooms_changed: Vec<String> = Vec::new();
    for p in ctx.db.chat_presence().iter() {
        if p.is_typing && p.last_seen.to_micros_since_unix_epoch() <= typing_cutoff.to_micros_since_unix_epoch() {
            if let Some(mut row) = ctx.db.chat_presence().id().find(&p.id) {
                row.is_typing = false;
                row.last_seen = now_ts;
                ctx.db.chat_presence().id().update(row);
                rooms_changed.push(p.room_id.clone());
            }
        }
    }
    rooms_changed.sort();
    rooms_changed.dedup();
    for room in rooms_changed {
        recompute_room_stats(ctx, &room);
    }

    // 3) Destination viewer timeout: remove stale presence
    let mut dests_changed: Vec<String> = Vec::new();
    let mut dp_to_delete: Vec<u64> = Vec::new();
    for dp in ctx.db.destination_presence().iter() {
        if dp.last_seen.to_micros_since_unix_epoch() <= viewer_cutoff.to_micros_since_unix_epoch() {
            dp_to_delete.push(dp.id);
            dests_changed.push(dp.destination_id.clone());
        }
    }
    for id in dp_to_delete {
        ctx.db.destination_presence().id().delete(&id);
    }
    dests_changed.sort();
    dests_changed.dedup();
    for d in dests_changed {
        recompute_destination_stats(ctx, &d);
    }

    // 4) Auto-sync trigger for all users with can_auto_sync: move Pending/Failed->Syncing under retry budget
    for s in ctx.db.sync_state().iter() {
        if s.can_auto_sync {
            let owner = s.identity;
            let mut act_ids: Vec<u64> = Vec::new();
            for a in ctx.db.pending_action().iter() {
                if a.owner == owner && (a.status == ActionStatus::Pending || (a.status == ActionStatus::Failed && a.retry_count < OFFLINE_MAX_RETRIES)) {
                    act_ids.push(a.action_id);
                }
            }
            for id in act_ids {
                if let Some(mut a) = ctx.db.pending_action().action_id().find(&id) {
                    if a.retry_count < OFFLINE_MAX_RETRIES {
                        a.status = ActionStatus::Syncing;
                        a.last_attempt = Some(now_ts);
                        a.retry_count = a.retry_count.saturating_add(1);
                        ctx.db.pending_action().action_id().update(a);
                    }
                }
            }
        }
    }

    Ok(())
}