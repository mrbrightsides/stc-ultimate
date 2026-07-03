import { NextRequest, NextResponse } from 'next/server';
import { BlockchainEventStorage } from '@/lib/blockchain-event-tracker';

// ========================================
// GRPC RECENT EVENTS API
// Get recent blockchain events (batch)
// ========================================

/**
 * GET /api/grpc/recent?count=10
 * Get recent events via gRPC-style API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '10', 10);
    
    const events = BlockchainEventStorage.getRecent(count);
    const totalCount = BlockchainEventStorage.getAll().length;
    
    return NextResponse.json({
      events: events.map(record => ({
        id: record.id,
        txHash: record.txHash,
        blockNumber: record.blockNumber,
        timestamp: record.timestamp,
        from: record.from,
        to: record.to,
        value: record.value,
        gasUsed: record.gasUsed,
        gasCost: record.gasCost,
        status: record.status,
        serviceId: record.serviceId,
        serviceName: record.serviceName,
        bookingId: record.bookingId,
        events: record.events,
        decodedEvents: record.decodedEvents,
        iotActions: record.iotActions,
      })),
      totalCount,
    });
  } catch (error) {
    console.error('Error getting recent events:', error);
    return NextResponse.json(
      { error: 'Failed to get recent events' },
      { status: 500 }
    );
  }
}
