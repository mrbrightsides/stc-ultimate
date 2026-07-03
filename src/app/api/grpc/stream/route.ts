import { NextRequest } from 'next/server';
import { BlockchainEventStorage } from '@/lib/blockchain-event-tracker';

// ========================================
// GRPC STREAM API - SSE ENDPOINT
// Server-Sent Events wrapper for gRPC streaming
// Browser-compatible real-time blockchain events
// ========================================

/**
 * GET /api/grpc/stream
 * Stream blockchain events using Server-Sent Events (SSE)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse filters from query params
  const eventTypesParam = searchParams.get('eventTypes');
  const eventTypes = eventTypesParam ? eventTypesParam.split(',') : [];
  const serviceId = searchParams.get('serviceId');
  const bookingId = searchParams.get('bookingId');
  const includeIoTActions = searchParams.get('includeIoTActions') !== 'false';
  
  console.log('🎯 Starting gRPC event stream with filters:', {
    eventTypes,
    serviceId,
    bookingId,
    includeIoTActions,
  });
  
  // Create SSE stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let lastSentEventId: string | null = null;
      let isActive = true;
      
      // Function to send events
      const sendEvents = () => {
        try {
          const events = BlockchainEventStorage.getAll();
          
          for (const record of events) {
            // Skip if already sent
            if (record.id === lastSentEventId) break;
            
            // Apply filters
            if (eventTypes.length > 0) {
              const hasMatchingEvent = record.events.some((e) =>
                eventTypes.includes(e.eventName)
              );
              if (!hasMatchingEvent) continue;
            }
            
            if (serviceId && record.serviceId?.toString() !== serviceId) {
              continue;
            }
            
            if (bookingId && record.bookingId !== bookingId) {
              continue;
            }
            
            // Format event for SSE
            const event = {
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
              iotActions: includeIoTActions ? record.iotActions : [],
            };
            
            // Send SSE message
            const message = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(message));
            
            lastSentEventId = record.id;
          }
          
          // Send heartbeat to keep connection alive
          const heartbeat = `: heartbeat ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('Error sending events:', error);
        }
      };
      
      // Send initial events
      sendEvents();
      
      // Poll for new events every 2 seconds
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }
        sendEvents();
      }, 2000);
      
      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('🔌 Client disconnected from gRPC stream');
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
