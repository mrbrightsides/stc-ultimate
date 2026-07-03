import { NextRequest } from 'next/server';
import { AnalyticsStorage } from '@/lib/grpc-analytics-service';

// ========================================
// GRPC ANALYTICS STREAM API - SSE ENDPOINT
// Server-Sent Events for real-time analytics and metrics
// ========================================

/**
 * GET /api/grpc/analytics/stream
 * Stream system metrics and analytics using Server-Sent Events (SSE)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse parameters
  const metricsParam = searchParams.get('metrics');
  const metrics = metricsParam ? metricsParam.split(',') : ['all'];
  const intervalSeconds = parseInt(searchParams.get('interval') || '3', 10);
  
  console.log('🎯 Starting analytics stream:', {
    metrics,
    intervalSeconds,
  });
  
  // Create SSE stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let isActive = true;
      
      // Function to send metrics
      const sendMetrics = () => {
        try {
          const currentMetrics = AnalyticsStorage.getCurrentMetrics();
          
          // Send SSE message
          const message = `data: ${JSON.stringify(currentMetrics)}\n\n`;
          controller.enqueue(encoder.encode(message));
          
          // Send heartbeat
          const heartbeat = `: heartbeat ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('Error sending metrics:', error);
        }
      };
      
      // Send initial metrics
      sendMetrics();
      
      // Poll for updates
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }
        sendMetrics();
      }, intervalSeconds * 1000);
      
      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('🔌 Client disconnected from analytics stream');
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
