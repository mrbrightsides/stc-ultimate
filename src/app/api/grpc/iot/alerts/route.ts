import { NextRequest } from 'next/server';
import { IoTDeviceStorage } from '@/lib/grpc-iot-service';

// ========================================
// GRPC IOT ALERTS STREAM API
// Stream real-time device alerts and warnings
// ========================================

/**
 * GET /api/grpc/iot/alerts
 * Stream device alerts using Server-Sent Events (SSE)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const severitiesParam = searchParams.get('severities');
  const severities = severitiesParam ? severitiesParam.split(',') : [];
  const unacknowledgedOnly = searchParams.get('unacknowledgedOnly') === 'true';
  
  console.log('🎯 Starting device alerts stream:', {
    severities,
    unacknowledgedOnly,
  });
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let isActive = true;
      let lastSentAlertId: string | null = null;
      
      const sendAlerts = () => {
        try {
          const alerts = IoTDeviceStorage.getAllAlerts();
          
          for (const alert of alerts) {
            // Skip if already sent
            if (alert.alertId === lastSentAlertId) break;
            
            // Apply filters
            if (severities.length > 0 && !severities.includes(alert.severity)) {
              continue;
            }
            
            if (unacknowledgedOnly && alert.acknowledged) {
              continue;
            }
            
            // Send SSE message
            const message = `data: ${JSON.stringify(alert)}\n\n`;
            controller.enqueue(encoder.encode(message));
            
            lastSentAlertId = alert.alertId;
          }
          
          // Send heartbeat
          const heartbeat = `: heartbeat ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('Error sending alerts:', error);
        }
      };
      
      sendAlerts();
      
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }
        sendAlerts();
      }, 3000);
      
      request.signal.addEventListener('abort', () => {
        console.log('🔌 Client disconnected from alerts stream');
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
