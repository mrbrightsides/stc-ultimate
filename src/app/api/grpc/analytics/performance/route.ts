import { NextRequest } from 'next/server';
import { AnalyticsStorage } from '@/lib/grpc-analytics-service';

// ========================================
// GRPC PERFORMANCE STREAM API
// Stream performance data for different components
// ========================================

/**
 * GET /api/grpc/analytics/performance
 * Stream component performance data
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const component = searchParams.get('component') || 'all';
  const intervalSeconds = parseInt(searchParams.get('interval') || '5', 10);
  
  console.log('🎯 Starting performance stream:', {
    component,
    intervalSeconds,
  });
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let isActive = true;
      
      const sendPerformanceData = () => {
        try {
          const components = component === 'all' 
            ? ['blockchain', 'iot', 'scada', 'api']
            : [component];
          
          components.forEach((comp) => {
            const perfData = AnalyticsStorage.getPerformanceData(comp);
            const message = `data: ${JSON.stringify(perfData)}\n\n`;
            controller.enqueue(encoder.encode(message));
          });
          
          const heartbeat = `: heartbeat ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('Error sending performance data:', error);
        }
      };
      
      sendPerformanceData();
      
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }
        sendPerformanceData();
      }, intervalSeconds * 1000);
      
      request.signal.addEventListener('abort', () => {
        console.log('🔌 Client disconnected from performance stream');
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
