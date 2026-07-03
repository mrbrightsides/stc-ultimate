'use client'

import { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Code } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface MindMapNode {
  id: string;
  label: string;
  emoji: string;
  color: string;
  children: {
    label: string;
    items: string[];
  }[];
}

const mindmapData: MindMapNode[] = [
  {
    id: 'tourism',
    label: 'Tourism',
    emoji: '🧳',
    color: 'cyan',
    children: [
      {
        label: 'Package Builder',
        items: ['Custom Itinerary', 'Service Selection', 'Date Planning', 'Price Calculator']
      },
      {
        label: 'Smart Payments',
        items: ['Milestone Escrow', 'Auto Release', 'CBDC Support', 'ETH Payments']
      },
      {
        label: 'IoT Services',
        items: ['QR Check-in', 'GPS Verification', 'RFID Scanner', 'Biometric Auth']
      },
      {
        label: 'Journey Tracking',
        items: ['Live Progress', 'Service Status', 'Transaction History', 'Timeline View']
      },
      {
        label: 'Loyalty System',
        items: ['STC Tokens', 'Reward Points', 'Tier Benefits', 'Cashback']
      }
    ]
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    emoji: '⛓️',
    color: 'purple',
    children: [
      {
        label: 'Smart Contracts',
        items: ['Escrow Logic', 'Milestone Release', 'Refund Handler', 'Event Emission']
      },
      {
        label: 'Multi-Chain',
        items: ['Ethereum Sepolia', 'Base Mainnet', 'Cross-chain Bridge', 'Chain Selector']
      },
      {
        label: 'Consensus',
        items: ['Transaction Validation', 'Block Confirmation', 'Network Sync', 'Gas Optimization']
      },
      {
        label: 'CBDC Integration',
        items: ['Indonesian CBDC', 'Fiat Gateway', 'Currency Converter', 'Rate Oracle']
      },
      {
        label: 'Web3 Auth',
        items: ['Wallet Connect', 'SIWE Protocol', 'MetaMask', 'Multi-sig Support']
      }
    ]
  },
  {
    id: 'iot',
    label: 'IoT Network',
    emoji: '📡',
    color: 'green',
    children: [
      {
        label: 'Sensors',
        items: ['Temperature', 'Humidity', 'Occupancy', 'Energy Monitor']
      },
      {
        label: 'Real-time Data',
        items: ['gRPC Streaming', 'Device Status', 'Alert System', 'Live Metrics']
      },
      {
        label: 'SCADA System',
        items: ['Control Panel', 'Device Management', 'Operator Login', 'System Health']
      },
      {
        label: 'IoT-Blockchain',
        items: ['Device Registry', 'Data Verification', 'Proof of Sensor', 'Immutable Logs']
      },
      {
        label: 'Automation',
        items: ['Service Triggers', 'Auto Check-in', 'Smart Alerts', 'Workflow Engine']
      }
    ]
  },
  {
    id: 'ai',
    label: 'AI & ML',
    emoji: '🤖',
    color: 'orange',
    children: [
      {
        label: 'Trip Planner',
        items: ['AI Suggestions', 'Budget Optimizer', 'Route Planning', 'Preference Learning']
      },
      {
        label: 'Recommendations',
        items: ['Personalized Tours', 'Smart Matching', 'Trending Destinations', 'Similar Users']
      },
      {
        label: 'Analytics',
        items: ['Pattern Detection', 'Behavior Analysis', 'Demand Forecast', 'Anomaly Detection']
      },
      {
        label: 'ML Models',
        items: ['Neural Networks', 'Decision Trees', 'Regression', 'Clustering']
      },
      {
        label: 'Chatbot',
        items: ['Travel Assistant', 'FAQ Support', 'Booking Help', 'Language Support']
      }
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    emoji: '🏛️',
    color: 'pink',
    children: [
      {
        label: 'DAO System',
        items: ['On-chain Voting', 'Proposal Creation', 'Quorum Rules', 'Timelock']
      },
      {
        label: 'Token Voting',
        items: ['STC Token Power', 'Weighted Votes', 'Delegation', 'Vote History']
      },
      {
        label: 'Treasury',
        items: ['Fund Management', 'Budget Allocation', 'Grant System', 'Transparent Spending']
      },
      {
        label: 'Proposals',
        items: ['Feature Requests', 'Parameter Changes', 'Fund Allocation', 'Partnership Votes']
      }
    ]
  },
  {
    id: 'metaverse',
    label: 'Metaverse',
    emoji: '🌐',
    color: 'blue',
    children: [
      {
        label: 'VR Experience',
        items: ['360° Tours', 'Virtual Showroom', 'Immersive Preview', 'VR Mode']
      },
      {
        label: 'AR Features',
        items: ['AR Navigation', 'Point of Interest', 'Visual Markers', 'Object Recognition']
      },
      {
        label: 'Digital Twins',
        items: ['Destination Models', 'Real-time Sync', '3D Replicas', 'Interactive Maps']
      },
      {
        label: 'Avatars',
        items: ['Custom Characters', 'NFT Skins', 'Social Profiles', 'Achievement Display']
      },
      {
        label: 'Live Streaming',
        items: ['Tour Broadcasts', 'Event Coverage', 'Virtual Guides', 'Interactive Chat']
      }
    ]
  },
  {
    id: 'nft',
    label: 'NFT & Rewards',
    emoji: '🎨',
    color: 'yellow',
    children: [
      {
        label: 'Achievements',
        items: ['Journey Badges', 'Milestone NFTs', 'Rare Collections', 'Special Events']
      },
      {
        label: 'Marketplace',
        items: ['NFT Trading', 'Bid System', 'Royalties', 'Price Discovery']
      },
      {
        label: 'Loyalty NFTs',
        items: ['Tier Badges', 'VIP Access', 'Exclusive Perks', 'Partner Benefits']
      },
      {
        label: 'Gamification',
        items: ['Leaderboards', 'Challenges', 'Quests', 'Seasonal Events']
      }
    ]
  },
  {
    id: 'research',
    label: 'Research',
    emoji: '🔬',
    color: 'red',
    children: [
      {
        label: 'Data Collection',
        items: ['Transaction Logs', 'User Behavior', 'IoT Sensors', 'Survey System']
      },
      {
        label: 'Analysis',
        items: ['Statistical Tests', 'Correlation', 'Regression', 'Hypothesis Testing']
      },
      {
        label: 'Dissertation',
        items: ['Research Hub', 'Experiment Runner', 'Data Scenarios', 'Academic Metrics']
      },
      {
        label: 'Visualizations',
        items: ['Charts & Graphs', 'Heatmaps', 'Network Diagrams', 'Flow Charts']
      },
      {
        label: 'ML Insights',
        items: ['Algorithm Testing', 'Model Comparison', 'Performance Metrics', 'Feature Importance']
      }
    ]
  },
  {
    id: 'export',
    label: 'Export & Reports',
    emoji: '📊',
    color: 'teal',
    children: [
      {
        label: 'PDF Reports',
        items: ['Journey Summary', 'Transaction Details', 'Analytics Report', 'Professional Format']
      },
      {
        label: 'Excel Export',
        items: ['Multi-sheet', 'Formatted Tables', 'Charts Included', 'Raw Data']
      },
      {
        label: 'CSV Export',
        items: ['Transaction Logs', 'IoT Data', 'User Analytics', 'Analysis Ready']
      },
      {
        label: 'Blockchain Proof',
        items: ['JSON Certificate', 'Transaction Hash', 'Smart Contract', 'Verification Link']
      },
      {
        label: 'Audit Logs',
        items: ['Complete History', 'Timestamped', 'Immutable', 'Compliance Ready']
      }
    ]
  }
];

export default function STCUltimateMindmap() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['tourism']);
  const [selectedNode, setSelectedNode] = useState<string | null>('tourism');

  const toggleNode = (nodeId: string): void => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
    setSelectedNode(nodeId);
  };

  const expandAll = (): void => {
    setExpandedNodes(mindmapData.map(node => node.id));
  };

  const collapseAll = (): void => {
    setExpandedNodes([]);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <NeonButton size="sm" variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                  </NeonButton>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    STC Ultimate Mindmap
                  </h1>
                  <p className="text-xs text-gray-400">Complete Platform Architecture</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/mindmap-code">
                  <NeonButton size="sm" variant="primary">
                    <Code className="h-4 w-4 mr-2" />
                    Mermaid Code
                  </NeonButton>
                </Link>
                <NeonButton size="sm" variant="secondary" onClick={expandAll}>
                  Expand All
                </NeonButton>
                <NeonButton size="sm" variant="secondary" onClick={collapseAll}>
                  Collapse All
                </NeonButton>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {/* Central Node */}
          <div className="text-center mb-12">
            <NeonCard glowColor="cyan" intense className="inline-block">
              <div className="px-12 py-8">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  STC ULTIMATE
                </h2>
                <p className="text-gray-400 mt-2">Smart Tourism Chain Platform</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">Blockchain</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">IoT</Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">AI/ML</Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">Web3</Badge>
                </div>
              </div>
            </NeonCard>
          </div>

          {/* Mindmap Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {mindmapData.map((node) => {
              const isExpanded = expandedNodes.includes(node.id);
              const isSelected = selectedNode === node.id;

              return (
                <NeonCard
                  key={node.id}
                  glowColor={node.color as any}
                  intense={isSelected}
                  className="transition-all duration-300"
                >
                  {/* Node Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                    onClick={() => toggleNode(node.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{node.emoji}</span>
                      <h3 className={`text-xl font-bold text-${node.color}-400`}>
                        {node.label}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className={`h-5 w-5 text-${node.color}-400`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 text-${node.color}-400`} />
                    )}
                  </div>

                  {/* Node Children */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {node.children.map((category, idx) => (
                        <div key={idx} className="border-l-2 border-gray-700 pl-4">
                          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-${node.color}-400`} />
                            {category.label}
                          </h4>
                          <ul className="space-y-1">
                            {category.items.map((item, itemIdx) => (
                              <li
                                key={itemIdx}
                                className="text-sm text-gray-400 flex items-start gap-2"
                              >
                                <span className="text-gray-600 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </NeonCard>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-16 max-w-4xl mx-auto">
            <NeonCard glowColor="purple" intense>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-purple-400">9</p>
                  <p className="text-gray-400 text-sm mt-1">Major Modules</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">45+</p>
                  <p className="text-gray-400 text-sm mt-1">Feature Categories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">200+</p>
                  <p className="text-gray-400 text-sm mt-1">Individual Features</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400">∞</p>
                  <p className="text-gray-400 text-sm mt-1">Possibilities</p>
                </div>
              </div>
            </NeonCard>
          </div>

          {/* Integration Info */}
          <div className="mt-12 max-w-4xl mx-auto">
            <NeonCard glowColor="cyan">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  🔗 Integrated Ecosystem
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  All modules work together seamlessly through blockchain consensus, 
                  real-time IoT data streams, AI-powered insights, and decentralized governance. 
                  Every feature is designed to enhance the smart tourism experience for 
                  tourists, SMEs, and researchers.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">SpacetimeDB</Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">gRPC</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">Ethereum</Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">Base Network</Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">IPFS</Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50">Web3</Badge>
                </div>
              </div>
            </NeonCard>
          </div>
        </main>
      </div>
    </div>
  );
}
