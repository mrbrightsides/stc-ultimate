import { NextRequest } from 'next/server';
import { IoTDeviceStorage } from '@/lib/grpc-iot-service';

// ========================================
// GRPC IOT STREAM API - SSE ENDPOINT
// Server-Sent Events for real-time IoT device updates
// ========================================

/**
 * GET /api/grpc/iot/stream
 * Stream IoT device updates using Server-Sent Events (SSE)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse filters from query params
  const categoriesParam = searchParams.get('categories');
  const categories = categoriesParam ? categoriesParam.split(',') : [];
  const statusesParam = searchParams.get('statuses');
  const statuses = statusesParam ? statusesParam.split(',') : [];
  const deviceIdsParam = searchParams.get('deviceIds');
  const deviceIds = deviceIdsParam ? deviceIdsParam.split(',') : [];
  
  console.log('🎯 Starting IoT device stream with filters:', {
    categories,
    statuses,
    deviceIds,
  });
  
  // Create SSE stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let isActive = true;
      
      // Function to send device updates
      const sendDeviceUpdates = () => {
        try {
          const devices = IoTDeviceStorage.getAll();
          
          for (const device of devices) {
            // Apply filters
            if (categories.length > 0 && !categories.includes(device.category)) {
              continue;
            }
            
            if (statuses.length > 0 && !statuses.includes(device.status)) {
              continue;
            }
            
            if (deviceIds.length > 0 && !deviceIds.includes(device.deviceId)) {
              continue;
            }
            
            // Format device for SSE
            const deviceUpdate = {
              deviceId: device.deviceId,
              name: device.name,
              type: device.type,
              category: device.category,
              status: device.status,
              value: device.value,
              unit: device.unit,
              location: device.location,
              timestamp: device.timestamp,
              isActive: device.isActive,
              isControllable: device.isControllable,
              metadata: device.metadata,
            };
            
            // Send SSE message
            const message = `data: ${JSON.stringify(deviceUpdate)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
          
          // Send heartbeat to keep connection alive
          const heartbeat = `: heartbeat ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('Error sending device updates:', error);
        }
      };
      
      // Send initial devices
      sendDeviceUpdates();
      
      // Poll for updates every 2 seconds
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }
        sendDeviceUpdates();
      }, 2000);
      
      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('🔌 Client disconnected from IoT device stream');
        isActive = false;
        clearInterval(interval);
        controller.close();
      });
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
