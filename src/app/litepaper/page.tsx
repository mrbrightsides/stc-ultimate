'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Home, FileText } from 'lucide-react';
import Link from 'next/link';
import { TokenDistributionChart, MarketGrowthChart } from '@/components/whitepaper/chart-components';

export default function LitepaperPage(): JSX.Element {
  const handleDownload = (): void => {
    alert('PDF download coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/whitepaper">
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Full Whitepaper
              </Button>
            </Link>
          </div>
          <Button onClick={handleDownload} className="bg-purple-500 hover:bg-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-6 py-12">
        {/* Cover */}
        <div className="text-center mb-16 py-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-4xl font-bold mx-auto">
              STC
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            STC ULTIMATE LITEPAPER
          </h1>
          <p className="text-xl text-gray-400 mb-2">Executive Summary</p>
          <p className="text-sm text-gray-500">Version 1.0 • December 2025</p>
        </div>

        {/* Section 1: The Problem */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">💡 The Problem</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Indonesia's $19.2B tourism sector suffers from critical inefficiencies:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="font-bold text-red-400 mb-2">For Tourists</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Fragmented booking experiences</li>
                <li>• High fraud risk ($450M annual loss)</li>
                <li>• No unified loyalty program</li>
                <li>• Limited real-time information</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h3 className="font-bold text-orange-400 mb-2">For SMEs</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 15-30% commission fees</li>
                <li>• Limited market access</li>
                <li>• Cash flow problems</li>
                <li>• $1.2B annual revenue loss</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 2: The Solution */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">🚀 The Solution: STC Ultimate</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            A comprehensive smart tourism platform combining blockchain, IoT, AI, and XR technology to create a unified, transparent, and efficient ecosystem.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⛓️</div>
              <h3 className="font-bold text-purple-400 mb-2">Blockchain</h3>
              <p className="text-xs text-gray-400">Transparent, secure transactions on Ethereum & Base</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📡</div>
              <h3 className="font-bold text-cyan-400 mb-2">IoT Network</h3>
              <p className="text-xs text-gray-400">500+ sensors for real-time monitoring</p>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-pink-400 mb-2">AI & ML</h3>
              <p className="text-xs text-gray-400">Personalized recommendations & analytics</p>
            </div>
          </div>
        </Card>

        {/* Section 3: Core Features */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">✨ Core Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-cyan-400 mb-3">For Tourists</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ AI-powered trip planning</li>
                <li>✓ One-click blockchain payments</li>
                <li>✓ NFT loyalty rewards</li>
                <li>✓ VR/AR destination previews</li>
                <li>✓ Real-time IoT updates</li>
                <li>✓ 25% cost savings vs traditional</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-pink-400 mb-3">For SMEs</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Direct bookings (no middleman)</li>
                <li>✓ 2-5% platform fees (vs 15-30%)</li>
                <li>✓ Instant smart contract payments</li>
                <li>✓ AI pricing optimization</li>
                <li>✓ Access to global markets</li>
                <li>✓ 180% revenue increase potential</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 4: Market Opportunity */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">📈 Market Opportunity</h2>
          <div className="mb-6">
            <MarketGrowthChart />
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">$94.1B</div>
              <div className="text-sm text-gray-400">Projected 2030 Revenue</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">28%</div>
              <div className="text-sm text-gray-400">Annual Growth Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">10M+</div>
              <div className="text-sm text-gray-400">Target Users by 2030</div>
            </div>
          </div>
        </Card>

        {/* Section 5: Tokenomics */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">🪙 Tokenomics</h2>
          <div className="mb-6">
            <TokenDistributionChart />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-cyan-400 mb-3">Token Utility</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Platform payments & bookings</li>
                <li>• Staking for benefits (8-12% APY)</li>
                <li>• DAO governance voting</li>
                <li>• NFT minting & marketplace</li>
                <li>• Up to 50% fee discounts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-pink-400 mb-3">Distribution</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Total Supply: 1B STC</li>
                <li>• Community Rewards: 40%</li>
                <li>• Ecosystem Dev: 25%</li>
                <li>• Team (4yr vesting): 15%</li>
                <li>• Public Sale: 10%</li>
                <li>• Strategic Partners: 10%</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 6: Roadmap */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">🗺️ Roadmap</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-32 shrink-0 font-bold text-purple-400">Q3 2025</div>
              <div className="text-gray-300">Prototype development & IoT pilot (3 locations)</div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 shrink-0 font-bold text-cyan-400">Q1 2026</div>
              <div className="text-gray-300">MVP launch with 500+ packages, NFT loyalty, DAO governance</div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 shrink-0 font-bold text-pink-400">2027</div>
              <div className="text-gray-300">National expansion: 50+ destinations, 100K+ users, 5K+ SMEs</div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 shrink-0 font-bold text-green-400">2028</div>
              <div className="text-gray-300">ASEAN expansion: 1M+ users, multi-language support</div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 shrink-0 font-bold text-yellow-400">2029-2030</div>
              <div className="text-gray-300">Global vision: 10M+ users, industry standard protocol</div>
            </div>
          </div>
        </Card>

        {/* Section 7: Team */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">👥 Team & Partners</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-cyan-400 mb-3">Founders</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• ELPEEF - Technology & Product</li>
                <li>• RANTAI - Blockchain Architecture</li>
              </ul>
              <h3 className="font-bold text-cyan-400 mt-4 mb-3">Core Team</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• 5 Blockchain Engineers</li>
                <li>• 3 AI/ML Specialists</li>
                <li>• 8 Full-stack Developers</li>
                <li>• 4 IoT Engineers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-pink-400 mb-3">Strategic Partners</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Leading Indonesian universities</li>
                <li>• Tourism boards & govt agencies</li>
                <li>• Hotel chains & accommodation networks</li>
                <li>• Cloud providers (AWS, GCP)</li>
                <li>• IoT hardware manufacturers</li>
                <li>• Web3 ecosystem partners</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 8: Why Now */}
        <Card className="mb-8 bg-black/40 border-purple-500/30 p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">⏰ Why Now?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-bold text-cyan-400 mb-2">Market Timing</h3>
              <p className="text-sm text-gray-400">Post-pandemic tourism recovery + digital transformation acceleration</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-bold text-purple-400 mb-2">Tech Maturity</h3>
              <p className="text-sm text-gray-400">Blockchain, IoT, AI technologies are production-ready</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🇮🇩</div>
              <h3 className="font-bold text-pink-400 mb-2">Indonesia Vision</h3>
              <p className="text-sm text-gray-400">Government pushing smart city & digital economy initiatives</p>
            </div>
          </div>
        </Card>

        {/* Section 9: Call to Action */}
        <Card className="mb-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 p-8 text-center">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">🚀 Join the Journey</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            STC Ultimate is building the future of tourism in Indonesia and beyond. Join us as we transform tourism into a transparent, efficient, and enriching experience for everyone.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Investor Deck
            </Button>
            <Link href="/whitepaper">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                Read Full Whitepaper
              </Button>
            </Link>
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20">
              Contact Team
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8">
          <p>© 2025 STC Ultimate. All rights reserved.</p>
          <p className="mt-2">support@elpeef.com</p>
        </footer>
      </div>
    </div>
  );
}
