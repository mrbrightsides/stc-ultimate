import { NextResponse } from 'next/server';
import { IoTDeviceStorage } from '@/lib/grpc-iot-service';

// ========================================
// GRPC IOT STATS API
// Get IoT device statistics
// ========================================

/**
 * GET /api/grpc/iot/stats
 * Get device statistics via gRPC-style API
 */
export async function GET() {
  try {
    const stats = IoTDeviceStorage.getStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting device stats:', error);
    return NextResponse.json(
      { error: 'Failed to get device statistics' },
      { status: 500 }
    );
  }
}
