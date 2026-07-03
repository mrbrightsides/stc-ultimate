'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, Download, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { MarketGrowthChart, TokenDistributionChart, UserGrowthChart } from '@/components/whitepaper/chart-components';

const slides = [
  {
    id: 1,
    title: 'STC ULTIMATE',
    subtitle: 'Smart Tourism & Culture Platform',
    content: (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-6xl font-bold mb-8 animate-pulse">
          STC
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          STC ULTIMATE
        </h1>
        <p className="text-2xl text-gray-300 mb-2">Smart Tourism & Culture Platform</p>
        <p className="text-xl text-gray-400 mb-8">Powered by Blockchain • IoT • AI • XR</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>ELPEEF x RANTAI</span>
          <span>•</span>
          <span>December 2025</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'The Problem',
    subtitle: 'Tourism sector inefficiencies costing billions',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-red-400 mb-6">For Tourists</h3>
          <ul className="space-y-4 text-xl text-gray-300">
            <li>💸 <strong>$450M</strong> annual loss to fraud</li>
            <li>🔍 Fragmented booking experiences</li>
            <li>⚠️ High security risks</li>
            <li>📊 No unified loyalty programs</li>
            <li>🌐 Limited real-time information</li>
          </ul>
        </div>
        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-orange-400 mb-6">For SMEs</h3>
          <ul className="space-y-4 text-xl text-gray-300">
            <li>💰 <strong>15-30%</strong> commission fees</li>
            <li>📉 <strong>$1.2B</strong> annual revenue loss</li>
            <li>🏦 Cash flow problems</li>
            <li>🌍 Limited market access</li>
            <li>📱 Lack of digital tools</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Market Opportunity',
    subtitle: '$94.1B by 2030 • 28% annual growth',
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-1 mb-8">
          <MarketGrowthChart />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-5xl font-bold text-purple-400 mb-2">$19.2B</div>
            <div className="text-gray-400">Current (2023)</div>
          </div>
          <div className="text-center bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="text-5xl font-bold text-cyan-400 mb-2">28%</div>
            <div className="text-gray-400">Annual Growth</div>
          </div>
          <div className="text-center bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
            <div className="text-5xl font-bold text-pink-400 mb-2">$94.1B</div>
            <div className="text-gray-400">Target (2030)</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'The Solution',
    subtitle: 'Unified platform connecting all stakeholders',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6">
            <div className="text-4xl mb-3">⛓️</div>
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Blockchain Layer</h3>
            <p className="text-gray-300">Transparent, secure transactions on Ethereum & Base</p>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-6">
            <div className="text-4xl mb-3">📡</div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">IoT Network</h3>
            <p className="text-gray-300">500+ sensors for real-time monitoring & insights</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-6">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-2xl font-bold text-pink-400 mb-2">AI & ML</h3>
            <p className="text-gray-300">Intelligent recommendations & predictive analytics</p>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6">
            <div className="text-4xl mb-3">🌐</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">XR Experiences</h3>
            <p className="text-gray-300">VR/AR immersive destination previews</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: '9 Core Modules',
    subtitle: 'Comprehensive ecosystem',
    content: (
      <div className="grid grid-cols-3 gap-6 h-full">
        {[
          { icon: '🧳', name: 'Tourism', desc: 'Package builder, payments, tracking' },
          { icon: '⛓️', name: 'Blockchain', desc: 'Smart contracts, multi-chain' },
          { icon: '📡', name: 'IoT Network', desc: 'Real-time sensors, SCADA' },
          { icon: '🤖', name: 'AI & ML', desc: 'Trip planner, recommendations' },
          { icon: '🏛️', name: 'Governance', desc: 'DAO, voting, treasury' },
          { icon: '🌐', name: 'Metaverse', desc: 'VR/AR, digital twins' },
          { icon: '🎨', name: 'NFT & Rewards', desc: 'Achievements, marketplace' },
          { icon: '🔬', name: 'Research', desc: 'Analytics, ML insights' },
          { icon: '📊', name: 'Export', desc: 'Reports, blockchain proof' },
        ].map((module, i) => (
          <div key={i} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">{module.icon}</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">{module.name}</h3>
            <p className="text-sm text-gray-400">{module.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 6,
    title: 'Key Features',
    subtitle: 'Value for all stakeholders',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">For Tourists 🧳</h3>
          <ul className="space-y-3 text-lg text-gray-300">
            <li>✓ AI-powered trip planning</li>
            <li>✓ One-click blockchain payments</li>
            <li>✓ NFT loyalty rewards</li>
            <li>✓ VR/AR destination previews</li>
            <li>✓ Real-time IoT updates</li>
            <li>✓ <strong className="text-green-400">25% cost savings</strong></li>
          </ul>
        </div>
        <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-pink-400 mb-6">For SMEs 🏪</h3>
          <ul className="space-y-3 text-lg text-gray-300">
            <li>✓ Direct bookings (no middleman)</li>
            <li>✓ <strong className="text-green-400">2-5%</strong> platform fees only</li>
            <li>✓ Instant smart contract payments</li>
            <li>✓ AI pricing optimization</li>
            <li>✓ Global market access</li>
            <li>✓ <strong className="text-green-400">180% revenue increase</strong></li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Technology Stack',
    subtitle: 'Production-ready infrastructure',
    content: (
      <div className="space-y-6 h-full">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Blockchain</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Ethereum (Sepolia → Mainnet)</li>
              <li>• Base L2 for cost optimization</li>
              <li>• 10,000+ TPS target</li>
              <li>• $0.001-0.01 avg transaction cost</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">IoT & Sensors</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• 500+ smart sensors deployed</li>
              <li>• Real-time environmental monitoring</li>
              <li>• SCADA control system</li>
              <li>• Blockchain-anchored logs</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-pink-400 mb-4">AI & ML</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Recommendation engine (85-92% accuracy)</li>
              <li>• Trip optimization algorithms</li>
              <li>• Sentiment analysis & NLP</li>
              <li>• Fraud detection models</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Security</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Smart contract audits (CertiK)</li>
              <li>• Multi-sig wallets</li>
              <li>• ISO 27001 compliance</li>
              <li>• Bug bounty program ($50K-500K)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: 'Tokenomics',
    subtitle: 'Sustainable economic model',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div>
          <TokenDistributionChart />
        </div>
        <div className="space-y-6">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Token Utility</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Platform payments & bookings</li>
              <li>• Staking (8-12% APY)</li>
              <li>• DAO governance voting</li>
              <li>• Up to 50% fee discounts</li>
              <li>• NFT marketplace transactions</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Distribution</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Total: 1B STC tokens</li>
              <li>• Community: 40%</li>
              <li>• Ecosystem: 25%</li>
              <li>• Team (4yr): 15%</li>
              <li>• Public/Partners: 20%</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    title: 'User Growth',
    subtitle: 'Scaling to 10M+ users by 2030',
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-1 mb-8">
          <UserGrowthChart />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400 mb-2">2K</div>
            <div className="text-sm text-gray-400">Q1 2026</div>
          </div>
          <div className="text-center bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-cyan-400 mb-2">200K</div>
            <div className="text-sm text-gray-400">2027</div>
          </div>
          <div className="text-center bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-pink-400 mb-2">1M</div>
            <div className="text-sm text-gray-400">2028</div>
          </div>
          <div className="text-center bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400 mb-2">10M+</div>
            <div className="text-sm text-gray-400">2029-2030</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    title: 'Roadmap',
    subtitle: 'Phased approach to global expansion',
    content: (
      <div className="space-y-8 h-full">
        {[
          { phase: 'Q3 2025', title: 'Prototype', items: ['Core infrastructure', 'IoT pilot (3 locations)', 'Alpha testing'], color: 'purple' },
          { phase: 'Q1 2026', title: 'MVP Launch', items: ['500+ packages', 'NFT loyalty', 'DAO governance'], color: 'cyan' },
          { phase: '2027', title: 'National', items: ['50+ destinations', '100K users', '5K SMEs'], color: 'pink' },
          { phase: '2028', title: 'ASEAN', items: ['Regional expansion', '1M users', 'Multi-language'], color: 'green' },
          { phase: '2029-2030', title: 'Global', items: ['10M+ users', 'Industry standard', '#1 smart tourism'], color: 'yellow' },
        ].map((milestone, i) => (
          <div key={i} className={`flex gap-6 items-start bg-${milestone.color}-500/10 border border-${milestone.color}-500/30 rounded-xl p-4`}>
            <div className={`w-24 h-24 rounded-full bg-${milestone.color}-500 flex items-center justify-center font-bold shrink-0`}>
              {milestone.phase}
            </div>
            <div>
              <h3 className={`text-2xl font-bold text-${milestone.color}-400 mb-2`}>{milestone.title}</h3>
              <ul className="text-gray-300">
                {milestone.items.map((item, j) => (
                  <li key={j}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 11,
    title: 'Competitive Advantage',
    subtitle: 'Why STC Ultimate wins',
    content: (
      <div className="space-y-8 h-full">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🔥</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">First Mover</h3>
            <p className="text-sm text-gray-400">Only blockchain tourism platform in Indonesia</p>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Full Stack</h3>
            <p className="text-sm text-gray-400">Blockchain + IoT + AI + XR integration</p>
          </div>
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🇮🇩</div>
            <h3 className="text-xl font-bold text-pink-400 mb-2">Local Focus</h3>
            <p className="text-sm text-gray-400">Built for Indonesia, ASEAN-ready</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-purple-400 mb-4">vs Traditional OTAs</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-red-400 mb-3">Traditional</h4>
              <ul className="text-gray-400 space-y-2">
                <li>❌ 15-30% commissions</li>
                <li>❌ Centralized control</li>
                <li>❌ High fraud risk</li>
                <li>❌ No real-time data</li>
                <li>❌ Limited customization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-3">STC Ultimate</h4>
              <ul className="text-gray-300 space-y-2">
                <li>✅ 2-5% platform fees</li>
                <li>✅ Decentralized DAO</li>
                <li>✅ Blockchain security</li>
                <li>✅ Real-time IoT insights</li>
                <li>✅ Full customization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    title: 'Team & Partners',
    subtitle: 'Experienced team with strong network',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-purple-400 mb-6">Core Team</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-cyan-400">Founders</h4>
              <ul className="text-gray-300 text-sm">
                <li>• ELPEEF - Technology & Product</li>
                <li>• RANTAI - Blockchain Architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-pink-400">Technical</h4>
              <ul className="text-gray-300 text-sm">
                <li>• 5 Blockchain Engineers</li>
                <li>• 3 AI/ML Specialists</li>
                <li>• 8 Full-stack Developers</li>
                <li>• 4 IoT Engineers</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">Partners</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-purple-400">Academic</h4>
              <p className="text-gray-300 text-sm">Leading Indonesian universities</p>
            </div>
            <div>
              <h4 className="font-bold text-pink-400">Tourism</h4>
              <p className="text-gray-300 text-sm">Government agencies, hotels, SMEs</p>
            </div>
            <div>
              <h4 className="font-bold text-green-400">Technology</h4>
              <p className="text-gray-300 text-sm">Cloud providers, IoT manufacturers</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-400">Ecosystem</h4>
              <p className="text-gray-300 text-sm">Web3 communities, DeFi protocols</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 13,
    title: 'Go-to-Market',
    subtitle: 'Strategic rollout plan',
    content: (
      <div className="space-y-6 h-full">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Phase 1</h3>
            <h4 className="font-bold text-cyan-400 mb-2">Early Adopters</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Tech-savvy tourists</li>
              <li>• Crypto enthusiasts</li>
              <li>• Progressive SMEs</li>
              <li>• Pilot locations: Bali, Yogyakarta, Jakarta</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Phase 2</h3>
            <h4 className="font-bold text-pink-400 mb-2">Mass Market</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• International tourists</li>
              <li>• Mainstream adoption</li>
              <li>• 50+ destinations</li>
              <li>• Government partnerships</li>
            </ul>
          </div>
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">Phase 3</h3>
            <h4 className="font-bold text-green-400 mb-2">Regional Leader</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• ASEAN expansion</li>
              <li>• Industry standard</li>
              <li>• B2B licensing</li>
              <li>• Global recognition</li>
            </ul>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Marketing Strategy</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="text-gray-300 space-y-2">
              <li>🎯 Influencer partnerships</li>
              <li>📱 Social media campaigns</li>
              <li>🎓 Educational content</li>
              <li>🏆 Referral programs</li>
            </ul>
            <ul className="text-gray-300 space-y-2">
              <li>🤝 Tourism board collaborations</li>
              <li>📰 PR & media coverage</li>
              <li>🎪 Events & conferences</li>
              <li>💼 B2B partnerships</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 14,
    title: 'Use Case: Sarah\'s Journey',
    subtitle: 'Tourist experience',
    content: (
      <div className="space-y-6 h-full">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">Before Trip</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ AI trip planner</li>
              <li>✓ Custom package builder</li>
              <li>✓ Web3 payment (2% cashback)</li>
              <li>✓ VR destination preview</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">During Trip</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ QR code check-ins</li>
              <li>✓ Real-time IoT updates</li>
              <li>✓ AR cultural info</li>
              <li>✓ Smart payments</li>
              <li>✓ Achievement NFTs</li>
            </ul>
          </div>
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-pink-400 mb-3">After Trip</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ Photo NFT collection</li>
              <li>✓ 10% loyalty discount</li>
              <li>✓ DAO participation</li>
              <li>✓ Referral rewards</li>
            </ul>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-3xl font-bold text-green-400 mb-2">25% Cost Savings</h3>
          <p className="text-xl text-gray-300">Compared to traditional booking platforms</p>
        </div>
      </div>
    ),
  },
  {
    id: 15,
    title: 'Use Case: Budi\'s Homestay',
    subtitle: 'SME success story',
    content: (
      <div className="space-y-6 h-full">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Before STC</h3>
            <ul className="text-gray-300 space-y-2">
              <li>❌ 20% OTA commissions</li>
              <li>❌ Delayed payments</li>
              <li>❌ Limited bookings</li>
              <li>❌ No customer data</li>
              <li>❌ High marketing costs</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-400 mb-4">After STC</h3>
            <ul className="text-gray-300 space-y-2">
              <li>✅ 3% platform fee only</li>
              <li>✅ Instant smart contract payments</li>
              <li>✅ Direct global bookings</li>
              <li>✅ Full analytics access</li>
              <li>✅ Free platform marketing</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">+180%</div>
            <div className="text-sm text-gray-400">Revenue Increase</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">$12K</div>
            <div className="text-sm text-gray-400">Annual Savings</div>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">45%</div>
            <div className="text-sm text-gray-400">Customer Retention</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 16,
    title: 'Risk Mitigation',
    subtitle: 'Addressing key challenges',
    content: (
      <div className="grid md:grid-cols-2 gap-6 h-full">
        {[
          {
            title: 'Technical Risks',
            color: 'purple',
            items: ['Smart contract audits (CertiK)', 'Bug bounty program', 'Regular security updates', 'Backup infrastructure'],
          },
          {
            title: 'Market Risks',
            color: 'cyan',
            items: ['Diversified revenue streams', 'Multiple market segments', 'Phased rollout approach', 'Flexible pricing model'],
          },
          {
            title: 'Regulatory Risks',
            color: 'pink',
            items: ['Legal team monitoring', 'Compliance frameworks', 'Government partnerships', 'Proactive adaptation'],
          },
          {
            title: 'Operational Risks',
            color: 'green',
            items: ['24/7 support team', 'Incident response plan', '$10M insurance coverage', 'Redundant systems'],
          },
        ].map((risk, i) => (
          <div key={i} className={`bg-${risk.color}-500/10 border-2 border-${risk.color}-500/30 rounded-xl p-6`}>
            <h3 className={`text-xl font-bold text-${risk.color}-400 mb-4`}>{risk.title}</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              {risk.items.map((item, j) => (
                <li key={j}>✓ {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 17,
    title: 'Financial Projections',
    subtitle: '5-year outlook',
    content: (
      <div className="space-y-8 h-full">
        <div className="grid grid-cols-5 gap-4">
          {[
            { year: '2026', revenue: '$1.2M', users: '10K' },
            { year: '2027', revenue: '$8.5M', users: '200K' },
            { year: '2028', revenue: '$45M', users: '1M' },
            { year: '2029', revenue: '$180M', users: '5M' },
            { year: '2030', revenue: '$450M', users: '10M+' },
          ].map((proj, i) => (
            <div key={i} className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">{proj.year}</div>
              <div className="text-xl font-bold text-cyan-400 mb-1">{proj.revenue}</div>
              <div className="text-sm text-gray-400">{proj.users} users</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-purple-400 mb-3">Revenue Streams</h3>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• Platform fees (2-5%)</li>
              <li>• Premium subscriptions</li>
              <li>• NFT marketplace (2.5%)</li>
              <li>• IoT data licensing</li>
              <li>• API access</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">Unit Economics</h3>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• LTV: $240</li>
              <li>• CAC: $12</li>
              <li>• LTV/CAC: 20x</li>
              <li>• Gross Margin: 75%</li>
              <li>• Payback: 2 months</li>
            </ul>
          </div>
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-pink-400 mb-3">Profitability</h3>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• Break-even: Q4 2026</li>
              <li>• Positive CF: Q1 2027</li>
              <li>• Net margin: 35% (2028)</li>
              <li>• EBITDA: 45% (2030)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 18,
    title: 'Funding & Use of Funds',
    subtitle: 'Strategic capital allocation',
    content: (
      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-purple-400 mb-6">Target Raise</h3>
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-cyan-400 mb-2">$5M</div>
            <div className="text-xl text-gray-400">Seed Round</div>
          </div>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Pre-money valuation:</span>
              <span className="font-bold text-purple-400">$20M</span>
            </div>
            <div className="flex justify-between">
              <span>Post-money valuation:</span>
              <span className="font-bold text-cyan-400">$25M</span>
            </div>
            <div className="flex justify-between">
              <span>Equity offered:</span>
              <span className="font-bold text-pink-400">20%</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum investment:</span>
              <span className="font-bold text-green-400">$100K</span>
            </div>
          </div>
        </div>
        <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">Use of Funds</h3>
          <div className="space-y-4">
            {[
              { category: 'Product Development', percent: 35, amount: '$1.75M' },
              { category: 'Team Expansion', percent: 25, amount: '$1.25M' },
              { category: 'Marketing & Growth', percent: 20, amount: '$1.0M' },
              { category: 'Infrastructure', percent: 10, amount: '$0.5M' },
              { category: 'Legal & Compliance', percent: 5, amount: '$0.25M' },
              { category: 'Reserve', percent: 5, amount: '$0.25M' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm">{item.category}</span>
                  <span className="text-cyan-400 font-bold text-sm">{item.amount}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 19,
    title: 'Why Invest Now',
    subtitle: 'Perfect timing for maximum returns',
    content: (
      <div className="space-y-8 h-full">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📈', title: 'Market Growth', desc: '28% CAGR in smart tourism', color: 'purple' },
            { icon: '🚀', title: 'First Mover', desc: 'Only blockchain solution in Indonesia', color: 'cyan' },
            { icon: '💎', title: 'Huge TAM', desc: '$94B market by 2030', color: 'pink' },
            { icon: '🔧', title: 'Tech Ready', desc: 'Production-ready stack', color: 'green' },
            { icon: '🤝', title: 'Strong Team', desc: 'Experienced founders + advisors', color: 'yellow' },
            { icon: '🎯', title: 'Traction', desc: '100+ early adopters committed', color: 'orange' },
          ].map((reason, i) => (
            <div key={i} className={`bg-${reason.color}-500/10 border-2 border-${reason.color}-500/30 rounded-xl p-6 text-center`}>
              <div className="text-5xl mb-3">{reason.icon}</div>
              <h3 className={`text-xl font-bold text-${reason.color}-400 mb-2`}>{reason.title}</h3>
              <p className="text-sm text-gray-400">{reason.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 border-2 border-purple-500/50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center text-purple-400 mb-4">Investor Returns</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">10-15x</div>
              <div className="text-gray-400">Expected ROI (5 years)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">2027</div>
              <div className="text-gray-400">Profitability Target</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">2029</div>
              <div className="text-gray-400">Exit Opportunity</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 20,
    title: 'Join Us',
    subtitle: 'Let\'s build the future of tourism together',
    content: (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-6xl font-bold mb-8 animate-pulse">
          STC
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-center">
          Transform Tourism with STC Ultimate
        </h1>
        <p className="text-2xl text-gray-300 mb-8 text-center max-w-3xl">
          Indonesia's #1 smart tourism platform powered by blockchain, IoT, AI, and XR
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">$94.1B</h3>
            <p className="text-gray-400">Market Size 2030</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">10M+</h3>
            <p className="text-gray-400">Target Users</p>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-pink-400 mb-2">10-15x</h3>
            <p className="text-gray-400">Expected ROI</p>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <Button className="bg-purple-500 hover:bg-purple-600 text-xl px-12 py-8">
            Invest Now
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20 text-xl px-12 py-8">
            Schedule Meeting
          </Button>
        </div>
        <div className="text-gray-400 space-y-2 text-center">
          <p className="text-lg">📧 support@elpeef.com</p>
          <p className="text-sm">© 2025 STC Ultimate • ELPEEF x RANTAI</p>
        </div>
      </div>
    ),
  },
];

export default function PitchDeckPage(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentSlide((prev: number) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev: number) => (prev - 1 + slides.length) % slides.length);
  };

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
            <span className="text-gray-400">
              Slide {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      </header>

      {/* Slide Content */}
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-3xl p-12 min-h-[600px] shadow-2xl">
          {/* Slide Header */}
          {slides[currentSlide].title && (
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-purple-400 mb-2">
                {slides[currentSlide].title}
              </h1>
              {slides[currentSlide].subtitle && (
                <p className="text-xl text-gray-400">{slides[currentSlide].subtitle}</p>
              )}
            </div>
          )}

          {/* Slide Content */}
          <div className="min-h-[400px]">{slides[currentSlide].content}</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? 'bg-purple-400 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
