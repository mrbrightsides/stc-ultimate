import type { Metadata } from 'next'
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import FarcasterWrapper from "@/components/FarcasterWrapper";
import { AIAssistantWidget } from '@/components/ai-assistant/ai-assistant-widget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body>
            <Providers>
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      <AIAssistantWidget />
      </Providers>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "STC Ultimate",
        description: "Plan and pay for your travel package using Web3. Connect your wallet, book services, and trigger events—all secured by smart contracts. Get refunds or rewards for completed trips.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_c5cac54f-8287-4e4b-b4e5-e8bd79c1d30b-tdskgJAUCxOHshyvNUS4TBsVfd7GEQ","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"STC Ultimate","url":"https://stove-laid-138.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
