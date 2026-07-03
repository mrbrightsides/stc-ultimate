'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Home } from 'lucide-react';
import Link from 'next/link';

export default function OnepagerPage(): JSX.Element {
  const handleDownload = (): void => {
    alert('Image download coming soon!');
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
          <Button onClick={handleDownload} className="bg-purple-500 hover:bg-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </Button>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-6 py-12">
        {/* One-Pager Visual */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-3xl p-12 shadow-2xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-4xl font-bold mx-auto animate-pulse">
                STC
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              STC ULTIMATE
            </h1>
            <p className="text-2xl text-gray-300 mb-2">Smart Tourism & Culture Platform</p>
            <p className="text-lg text-gray-400">Blockchain • IoT • AI • XR</p>
          </div>

          {/* Problem & Solution Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Problem */}
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-red-400 mb-4">❌ The Problem</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>$450M</strong> annual fraud loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>15-30%</strong> commission fees for SMEs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Fragmented booking systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>No real-time data for governments</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4">✅ The Solution</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span>Blockchain-verified transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span><strong>2-5%</strong> platform fees only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span>Unified ecosystem for all stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span>500+ IoT sensors for real-time insights</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Modules */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">🎯 9 Core Modules</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { icon: '🧳', name: 'Tourism', color: 'purple' },
                { icon: '⛓️', name: 'Blockchain', color: 'cyan' },
                { icon: '📡', name: 'IoT', color: 'pink' },
                { icon: '🤖', name: 'AI/ML', color: 'green' },
                { icon: '🏛️', name: 'Governance', color: 'yellow' },
                { icon: '🌐', name: 'Metaverse', color: 'purple' },
                { icon: '🎨', name: 'NFT', color: 'pink' },
                { icon: '🔬', name: 'Research', color: 'cyan' },
                { icon: '📊', name: 'Export', color: 'green' },
              ].map((module, i) => (
                <div
                  key={i}
                  className={`bg-${module.color}-500/10 border border-${module.color}-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform`}
                >
                  <div className="text-4xl mb-2">{module.icon}</div>
                  <div className="text-sm font-semibold text-gray-300">{module.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">$94.1B</div>
              <div className="text-sm text-gray-400">2030 Market Size</div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">28%</div>
              <div className="text-sm text-gray-400">Annual Growth</div>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">10M+</div>
              <div className="text-sm text-gray-400">Target Users</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">25%</div>
              <div className="text-sm text-gray-400">Cost Savings</div>
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">🗺️ Roadmap</h2>
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 -z-10"></div>
              {[
                { year: 'Q3 2025', label: 'Prototype', color: 'purple' },
                { year: 'Q1 2026', label: 'MVP', color: 'cyan' },
                { year: '2027', label: 'National', color: 'pink' },
                { year: '2028', label: 'ASEAN', color: 'green' },
                { year: '2030', label: 'Global', color: 'yellow' },
              ].map((milestone, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-${milestone.color}-500 flex items-center justify-center font-bold text-sm mb-2 border-4 border-black`}>
                    {milestone.year}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold">{milestone.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 border-2 border-purple-500/50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              🚀 Transform Tourism with Web3
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Join us in building Indonesia's #1 smart tourism destination by 2030
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-purple-500 hover:bg-purple-600 text-lg px-8 py-6">
                Invest Now
              </Button>
              <Link href="/whitepaper">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20 text-lg px-8 py-6">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-6">support@elpeef.com • © 2025 STC Ultimate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
