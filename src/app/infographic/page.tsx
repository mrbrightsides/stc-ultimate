'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Home, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function InfographicPage(): JSX.Element {
  const handleDownload = (): void => {
    alert('Image download coming soon!');
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: 'STC Ultimate - Smart Tourism Platform',
        text: 'Check out STC Ultimate: Indonesia\'s blockchain-powered tourism platform!',
        url: window.location.origin + '/infographic',
      });
    } else {
      alert('Sharing feature not supported in this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload} className="bg-purple-500 hover:bg-purple-600">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Instagram/Social Media Ready Infographic */}
        <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-black border-4 border-purple-500 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNm0wIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02TTI0IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="relative">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-600">
                  STC
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-2">STC ULTIMATE</h1>
              <p className="text-xl opacity-90">Smart Tourism & Culture Platform</p>
              <div className="flex justify-center gap-4 mt-4 text-sm opacity-75">
                <span>Blockchain</span>
                <span>•</span>
                <span>IoT</span>
                <span>•</span>
                <span>AI</span>
                <span>•</span>
                <span>XR</span>
              </div>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-4 gap-0 border-y-4 border-purple-500">
            {[
              { value: '$94.1B', label: 'Market 2030' },
              { value: '28%', label: 'Growth' },
              { value: '10M+', label: 'Users' },
              { value: '25%', label: 'Savings' },
            ].map((stat, i) => (
              <div key={i} className="bg-black/60 p-6 text-center border-r-2 border-purple-500 last:border-r-0">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Problem vs Solution */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 p-8 border-r-2 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">❌</div>
                <h2 className="text-2xl font-bold text-red-400">The Problem</h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold text-lg">•</span>
                  <span><strong className="text-red-300">$450M</strong> annual fraud loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold text-lg">•</span>
                  <span><strong className="text-red-300">15-30%</strong> commission fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold text-lg">•</span>
                  <span>Fragmented systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold text-lg">•</span>
                  <span>No real-time data</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">✅</div>
                <h2 className="text-2xl font-bold text-green-400">The Solution</h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold text-lg">•</span>
                  <span>Blockchain security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold text-lg">•</span>
                  <span><strong className="text-green-300">2-5%</strong> platform fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold text-lg">•</span>
                  <span>Unified ecosystem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold text-lg">•</span>
                  <span>500+ IoT sensors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Modules */}
          <div className="bg-black/60 p-8 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">🎯 9 Core Modules</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🧳', name: 'Tourism' },
                { icon: '⛓️', name: 'Blockchain' },
                { icon: '📡', name: 'IoT' },
                { icon: '🤖', name: 'AI/ML' },
                { icon: '🏛️', name: 'Governance' },
                { icon: '🌐', name: 'Metaverse' },
                { icon: '🎨', name: 'NFT' },
                { icon: '🔬', name: 'Research' },
                { icon: '📊', name: 'Export' },
              ].map((module, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{module.icon}</div>
                  <div className="text-sm font-semibold">{module.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-0 border-t-4 border-purple-500">
            <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 p-8 border-r-2 border-purple-500">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🧳</span> For Tourists
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ AI trip planning</li>
                <li>✓ Blockchain payments</li>
                <li>✓ NFT rewards</li>
                <li>✓ VR/AR previews</li>
                <li>✓ <strong className="text-green-400">25% savings</strong></li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-900/40 to-pink-950/40 p-8">
              <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏪</span> For SMEs
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Direct bookings</li>
                <li>✓ <strong className="text-green-400">2-5%</strong> fees only</li>
                <li>✓ Instant payments</li>
                <li>✓ Global access</li>
                <li>✓ <strong className="text-green-400">180% revenue ↑</strong></li>
              </ul>
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="bg-gradient-to-br from-purple-900/40 to-black p-8 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">🗺️ Roadmap to 2030</h2>
            <div className="space-y-3">
              {[
                { year: 'Q3 2025', milestone: 'Prototype', color: 'purple' },
                { year: 'Q1 2026', milestone: 'MVP Launch', color: 'cyan' },
                { year: '2027', milestone: 'National Expansion', color: 'pink' },
                { year: '2028', milestone: 'ASEAN Leader', color: 'green' },
                { year: '2030', milestone: 'Global Vision', color: 'yellow' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-20 h-12 rounded-lg bg-${item.color}-500 flex items-center justify-center font-bold text-sm shrink-0`}>
                    {item.year}
                  </div>
                  <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                  <div className="text-sm font-semibold">{item.milestone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 p-8 text-center">
            <h2 className="text-3xl font-bold mb-3">🚀 Join the Revolution</h2>
            <p className="text-lg mb-4 opacity-90">
              Transform tourism with blockchain, IoT, AI & XR
            </p>
            <div className="flex justify-center gap-6 text-sm mb-4">
              <div>
                <div className="font-bold text-2xl">$5M</div>
                <div className="opacity-75">Seed Round</div>
              </div>
              <div>
                <div className="font-bold text-2xl">10-15x</div>
                <div className="opacity-75">ROI Target</div>
              </div>
              <div>
                <div className="font-bold text-2xl">2027</div>
                <div className="opacity-75">Profitability</div>
              </div>
            </div>
            <div className="text-sm opacity-75">
              📧 support@elpeef.com • 🌐 stc-ultimate.com
            </div>
          </div>

          {/* Footer Badge */}
          <div className="bg-black p-4 text-center text-xs text-gray-500 border-t-2 border-purple-500">
            <p>© 2025 STC Ultimate • ELPEEF x RANTAI • Indonesia Smart Tourism 2030+</p>
            <p className="mt-1">Read Full Whitepaper at stc-ultimate.com/whitepaper</p>
          </div>
        </div>

        {/* Social Media Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">📱</div>
              <h3 className="font-bold text-purple-400">Instagram</h3>
            </div>
            <p className="text-sm text-gray-400">Perfect for Instagram posts and stories</p>
          </div>
          <div className="bg-white/5 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">🐦</div>
              <h3 className="font-bold text-cyan-400">Twitter/X</h3>
            </div>
            <p className="text-sm text-gray-400">Share as thread or image tweet</p>
          </div>
          <div className="bg-white/5 border border-pink-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">💼</div>
              <h3 className="font-bold text-pink-400">LinkedIn</h3>
            </div>
            <p className="text-sm text-gray-400">Professional network sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
