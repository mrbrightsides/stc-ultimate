'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Copy, Download } from 'lucide-react'
import { generateInteractiveHTML } from '@/lib/interactive-mindmap-html-generator'

export default function MindmapCodePage() {
  const [copied, setCopied] = useState(false)

  const mermaidCode = `mindmap
  root((STC ULTIMATE
    Smart Tourism & Cultural Platform))
    🧳 Tourism
      Package Builder
        Custom Itineraries
        Budget Calculator
        Multi-destination
        Collaborative Planning
        Template Library
      Smart Payments
        CBDC Integration
        Multi-currency
        Instant Settlement
        Payment Gateway
        Escrow Service
      IoT Services
        Smart Transportation
        Real-time Tracking
        Environmental Sensors
        Crowd Management
        Resource Optimization
      Journey Tracking
        GPS Integration
        Timeline View
        Photo Documentation
        Experience Rating
        Memory NFTs
      Loyalty System
        Reward Points
        Tier Benefits
        Partner Discounts
        Referral Program
        Token Incentives
    ⛓️ Blockchain
      Smart Contracts
        Payment Logic
        Escrow System
        Automated Refunds
        Multi-sig Wallets
        Access Control
      Multi-chain Support
        Ethereum Sepolia
        Base Mainnet
        Cross-chain Bridge
        Layer 2 Scaling
        Interoperability
      Consensus
        Proof of Stake
        Validator Network
        Byzantine Fault Tolerance
        Transaction Finality
        Block Confirmation
      CBDC Integration
        Indonesian Rupiah Digital
        Bank Indonesia API
        Regulatory Compliance
        Instant Settlement
        KYC/AML
      Web3 Authentication
        Wallet Connect
        MetaMask Integration
        SIWE Protocol
        Multi-wallet Support
        Session Management
    📡 IoT Network
      Sensor Infrastructure
        Temperature Sensors
        Air Quality Monitors
        Crowd Density
        Traffic Flow
        Energy Consumption
      Real-time Data
        Live Streaming
        Data Aggregation
        Edge Computing
        Low Latency
        5G Integration
      SCADA System
        Supervisory Control
        Data Acquisition
        Industrial Protocol
        PLC Integration
        Alert System
      Blockchain Integration
        IoT Oracles
        Data Verification
        Immutable Logs
        Device Identity
        Smart Triggers
      Device Management
        Registration
        Monitoring
        Firmware Updates
        Security Patches
        Access Control
    🤖 AI & ML
      Trip Planner
        AI Recommendations
        Route Optimization
        Weather Prediction
        Crowd Avoidance
        Budget Optimization
      Recommendation Engine
        Collaborative Filtering
        Content-based
        Hybrid Model
        Real-time Updates
        Personalization
      Analytics
        Visitor Patterns
        Peak Time Analysis
        Revenue Insights
        Sentiment Analysis
        Trend Forecasting
      ML Models
        Demand Prediction
        Price Optimization
        Churn Prevention
        Fraud Detection
        Image Recognition
      Chatbot Assistant
        Natural Language
        Multi-language
        Context Awareness
        Voice Integration
        24/7 Support
    🏛️ Governance
      DAO System
        Decentralized Control
        Proposal Submission
        Vote Recording
        Execution Logic
        Treasury Management
      Token Voting
        Governance Token
        Weighted Voting
        Quadratic Voting
        Delegation System
        Quorum Rules
      Treasury
        Fund Management
        Budget Allocation
        Transparent Tracking
        Multi-sig Control
        Investment Strategy
      Proposals
        Community Ideas
        Voting Period
        Implementation Plan
        Impact Assessment
        Audit Trail
      Compliance
        Regulatory Framework
        KYC/AML
        Data Protection
        GDPR Compliance
        Audit Reports
    🌐 Metaverse
      VR Experiences
        Virtual Tours
        360° Videos
        Immersive Museums
        Cultural Events
        Interactive Guides
      AR Features
        Location-based AR
        Object Recognition
        Historical Overlays
        Navigation Aids
        Gamification
      Digital Twins
        City Replicas
        Real-time Sync
        Simulation
        Planning Tools
        Training Platform
      Avatars
        Customization
        NFT Wearables
        Social Interaction
        Virtual Identity
        Cross-platform
      Live Streaming
        Virtual Events
        Cultural Shows
        Guided Tours
        Conferences
        Monetization
    🎨 NFT & Rewards
      Achievement NFTs
        Milestone Badges
        Experience Tokens
        Collector Items
        Rarity Tiers
        Social Proof
      Marketplace
        NFT Trading
        Peer-to-peer
        Auction System
        Royalty Split
        Verification
      Loyalty NFTs
        Dynamic Rewards
        Tier Progression
        Exclusive Access
        Partner Benefits
        Staking Rewards
      Gamification
        Quest System
        Leaderboards
        Challenge Events
        Social Sharing
        Prize Pool
      Digital Collectibles
        Cultural Artifacts
        Limited Editions
        Artist Collaboration
        Provenance
        Metadata Rich
    🔬 Research
      Data Collection
        Tourist Behavior
        Economic Impact
        Environmental Data
        Social Metrics
        Satisfaction Surveys
      Analysis Tools
        Statistical Methods
        Predictive Analytics
        Pattern Recognition
        Correlation Studies
        Hypothesis Testing
      Dissertation Support
        Data Export
        Citation Ready
        Methodology Guide
        Ethics Compliance
        Peer Review
      Visualizations
        Interactive Dashboards
        Custom Charts
        Heat Maps
        Network Graphs
        Time Series
      ML Insights
        Algorithm Library
        Model Training
        Feature Engineering
        Performance Metrics
        Explainable AI
    📊 Export & Reports
      PDF Reports
        Executive Summary
        Detailed Analytics
        Visual Charts
        Professional Format
        Branded Templates
      Excel Export
        Multi-sheet
        Pivot Tables
        Formatted Data
        Formulas Included
        Analysis Ready
      CSV Export
        Raw Data
        Clean Format
        Large Datasets
        API Integration
        Automated Backup
      Blockchain Proof
        Transaction Hash
        Timestamp
        Smart Contract Address
        Event Logs
        Verification Link
      Audit Logs
        Activity Timeline
        User Actions
        System Events
        Security Logs
        Compliance Reports`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mermaidCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([mermaidCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stc-ultimate-mindmap.mmd'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const markdownCode = `\`\`\`mermaid
${mermaidCode}
\`\`\``

  const htmlCode = generateInteractiveHTML()
  
  const handleDownloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stc-ultimate-interactive-mindmap.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            STC Ultimate Mindmap
          </h1>
          <p className="text-slate-400">
            Mermaid code untuk comprehensive platform architecture visualization
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-cyan-400">9</div>
              <div className="text-xs text-slate-400">Major Modules</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400">45+</div>
              <div className="text-xs text-slate-400">Feature Categories</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-pink-500/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-pink-400">200+</div>
              <div className="text-xs text-slate-400">Individual Features</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-xs text-slate-400">Open Source</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mermaid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50">
            <TabsTrigger value="mermaid">Mermaid Code</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="mermaid" className="mt-4">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-cyan-400">Mermaid Mindmap Code</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Use this code in any Mermaid-compatible platform (GitHub, GitLab, Notion, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950/80 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 border border-cyan-500/20">
                  <code>{mermaidCode}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markdown" className="mt-4">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-purple-400">Markdown Format</span>
                  <Button
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownCode)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  For use in README.md, documentation, or any markdown file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-950/80 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 border border-purple-500/20">
                  <code>{markdownCode}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <Card className="bg-slate-900/50 border-pink-500/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-pink-400">Interactive HTML</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        await navigator.clipboard.writeText(htmlCode)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      variant="outline"
                      size="sm"
                      className="border-pink-500/30 hover:bg-pink-500/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownloadHTML}
                      variant="outline"
                      size="sm"
                      className="border-pink-500/30 hover:bg-pink-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download HTML
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  🎯 Interactive standalone HTML - Click modules to explore details, sub-mindmaps & use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                  <h4 className="text-pink-400 font-semibold mb-2">✨ Interactive Features:</h4>
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li>Click any module to see detailed architecture</li>
                    <li>View sub-mindmaps for each of 9 modules</li>
                    <li>Explore key features, use cases, tech stack</li>
                    <li>All CSS/JS inline - works offline</li>
                    <li>Perfect for presentations & demos</li>
                  </ul>
                </div>
                <pre className="bg-slate-950/80 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 border border-pink-500/20 max-h-[400px]">
                  <code>{htmlCode.substring(0, 2000)}...

{/* Full HTML code (truncated for display) */}
{/* Download to see complete interactive implementation */}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Usage Guide */}
        <Card className="mt-8 bg-slate-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">📝 In Markdown Files:</h3>
              <p className="text-sm text-slate-400">
                Copy the Markdown format and paste directly into README.md, documentation, or any markdown editor that supports Mermaid (GitHub, GitLab, Notion, Obsidian, etc.)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">🌐 Online Editors:</h3>
              <p className="text-sm text-slate-400">
                Use <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">mermaid.live</a> or <a href="https://mermaid.ink" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">mermaid.ink</a> to visualize and export as PNG/SVG
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">📄 Academic Papers:</h3>
              <p className="text-sm text-slate-400">
                Export as SVG from online editors and include in LaTeX documents or Word files for research papers and dissertations
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">💻 Interactive HTML:</h3>
              <p className="text-sm text-slate-400">
                Download the interactive HTML file for quick presentations - click modules to explore detailed architecture, sub-mindmaps, and use cases. Works offline with all features embedded!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platforms */}
        <Card className="mt-8 bg-slate-900/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-400">Compatible Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '✅ GitHub',
                '✅ GitLab',
                '✅ Notion',
                '✅ Obsidian',
                '✅ VS Code',
                '✅ Confluence',
                '✅ Docusaurus',
                '✅ MkDocs',
              ].map((platform) => (
                <div
                  key={platform}
                  className="p-3 bg-slate-950/50 rounded-lg text-center text-sm text-slate-300 border border-blue-500/20"
                >
                  {platform}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
