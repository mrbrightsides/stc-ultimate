import { NextRequest, NextResponse } from 'next/server';
import { IoTDeviceStorage } from '@/lib/grpc-iot-service';

// ========================================
// GRPC IOT CONTROL API
// Control IoT devices remotely
// ========================================

/**
 * POST /api/grpc/iot/control
 * Control IoT device via gRPC-style API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, action, value, operatorId, reason } = body;
    
    if (!deviceId || !action) {
      return NextResponse.json(
        { error: 'deviceId and action are required' },
        { status: 400 }
      );
    }
    
    const success = IoTDeviceStorage.controlDevice(deviceId, action, value);
    
    if (success) {
      console.log(`✅ Device controlled: ${deviceId} - ${action}`, {
        operatorId,
        reason,
      });
      
      return NextResponse.json({
        success: true,
        message: `Device ${deviceId} ${action} successful`,
        deviceId,
        timestamp: Date.now(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to control device ${deviceId}`,
          deviceId,
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error controlling device:', error);
    return NextResponse.json(
      { error: 'Failed to control device' },
      { status: 500 }
    );
  }
}
