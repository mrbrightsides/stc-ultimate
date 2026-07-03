import { NextResponse } from 'next/server';
import { BlockchainEventStorage } from '@/lib/blockchain-event-tracker';

// ========================================
// GRPC STATS API
// Get blockchain event statistics
// ========================================

/**
 * GET /api/grpc/stats
 * Get event statistics via gRPC-style API
 */
export async function GET() {
  try {
    const stats = BlockchainEventStorage.getStats();
    
    return NextResponse.json({
      totalTransactions: stats.totalTransactions,
      totalEvents: stats.totalEvents,
      totalIoTActions: stats.totalIoTActions,
      totalGasUsed: stats.totalGasUsed,
      avgGasPerTx: stats.avgGasPerTx,
      confirmedTransactions: stats.confirmedTransactions,
      failedTransactions: stats.failedTransactions,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get event statistics' },
      { status: 500 }
    );
  }
}
