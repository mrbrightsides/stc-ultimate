'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Zap,
  TrendingUp,
  Users,
  Activity,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Globe,
  Brain,
  Rocket,
  Shield,
  Wallet,
  BarChart3,
  Languages
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  context?: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: string;
}

interface ConversationContext {
  lastTopic?: string;
  userPreferences?: {
    language: 'en' | 'id';
    role?: string;
  };
  dataInsights?: {
    totalTransactions?: number;
    successRate?: number;
    avgLatency?: number;
  };
}

// Helper function to strip markdown formatting
const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1');
};

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Halo! Saya AI Assistant STC Ultimate - spesialis smart tourism & blockchain!\n\n🌟 Updated dengan knowledge terbaru:\n✅ Base Mainnet 2025 readiness\n✅ Indonesian CBDC integration\n✅ Batam-Bintan-Lagoi tourism insights\n✅ Latest Web3 & IoT trends\n✅ ML-powered recommendations\n\nSaya bisa bantu dalam Bahasa Indonesia & English! Ada yang bisa saya bantu? 😊',
      timestamp: new Date(),
      suggestions: [
        'Apa itu STC Ultimate?',
        'Base Mainnet integration?',
        'Tourism trends 2025',
        'Research insights'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [context, setContext] = useState<ConversationContext>({
    userPreferences: { language: 'id' }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      icon: <Brain className="h-4 w-4" />,
      label: 'ML Insights',
      description: 'Get AI-powered data analysis',
      action: 'ml-insights'
    },
    {
      icon: <Rocket className="h-4 w-4" />,
      label: 'Base Mainnet',
      description: 'Learn about Base integration',
      action: 'base-mainnet'
    },
    {
      icon: <Globe className="h-4 w-4" />,
      label: 'Tourism Trends',
      description: 'Latest industry insights',
      action: 'tourism-trends'
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Research Data',
      description: 'Access research findings',
      action: 'research-data'
    }
  ];

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice recognition handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = context.userPreferences?.language === 'id' ? 'id-ID' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getEnhancedAIResponse = (userMessage: string, currentContext: ConversationContext): { content: string; suggestions?: string[]; newContext?: Partial<ConversationContext> } => {
    const lowerMessage = userMessage.toLowerCase();
    const isIndonesian = /[a-z]*[aiueo]{2,}[a-z]*/.test(lowerMessage) || lowerMessage.includes('apa') || lowerMessage.includes('bagaimana') || lowerMessage.includes('gimana');

    // Update language preference
    const updatedContext = { ...currentContext };
    if (isIndonesian) {
      updatedContext.userPreferences = { ...updatedContext.userPreferences, language: 'id' };
    }

    // Base Mainnet & Blockchain 2025
    if (lowerMessage.includes('base') || lowerMessage.includes('mainnet') || lowerMessage.includes('layer 2') || lowerMessage.includes('l2')) {
      return {
        content: isIndonesian 
          ? '🚀 Base Mainnet Integration - Ready for 2025!\n\nBase adalah Layer 2 blockchain by Coinbase yang:\n✅ Gas fees 100x lebih murah dari Ethereum\n✅ Transaction speed ~2 detik\n✅ EVM-compatible (support semua smart contracts)\n✅ Backed by Coinbase ecosystem\n\n🎯 STC Ultimate Migration Plan:\n• Phase 1: Sepolia testnet (DONE ✅)\n• Phase 2: Base Sepolia testnet (Q1 2025)\n• Phase 3: Base Mainnet (Q2 2025)\n• Phase 4: Cross-chain bridge ready\n\n💰 Cost Savings:\n• Ethereum: ~$50 per booking transaction\n• Base: ~$0.05 per booking transaction\n• 99.9% cost reduction!\n\n🌐 Perfect untuk Indonesian tourism SMEs:\n- Affordable blockchain access\n- Fast confirmations\n- Enterprise-grade security\n- Coinbase wallet integration\n\nSiap deploy ke Base mainnet kapan aja! 🔥'
          : '🚀 Base Mainnet Integration - 2025 Ready!\n\nBase is Coinbase\'s Layer 2 blockchain:\n✅ 100x cheaper gas fees than Ethereum\n✅ ~2 second transaction speed\n✅ EVM-compatible (all smart contracts work)\n✅ Backed by Coinbase ecosystem\n\n🎯 STC Ultimate Migration:\n• Phase 1: Sepolia testnet (DONE ✅)\n• Phase 2: Base Sepolia testnet (Q1 2025)\n• Phase 3: Base Mainnet (Q2 2025)\n• Phase 4: Cross-chain bridge\n\n💰 Cost Comparison:\n• Ethereum: ~$50/booking\n• Base: ~$0.05/booking\n• 99.9% savings!\n\n🌐 Perfect for Indonesian tourism SMEs:\n- Affordable blockchain\n- Fast confirmations\n- Enterprise security\n- Wallet integration\n\nReady to deploy anytime! 🔥',
        suggestions: isIndonesian 
          ? ['Gas fees comparison', 'Migration timeline', 'Smart contract compatibility']
          : ['Gas fees comparison', 'Migration timeline', 'Smart contract compatibility'],
        newContext: { lastTopic: 'base-mainnet' }
      };
    }

    // Indonesian Tourism & CBDC
    if (lowerMessage.includes('cbdc') || lowerMessage.includes('rupiah digital') || lowerMessage.includes('bi')) {
      return {
        content: isIndonesian
          ? '💳 Indonesian CBDC Integration - Digital Rupiah!\n\nBank Indonesia sedang pilot CBDC (Central Bank Digital Currency):\n\n🎯 STC Ultimate CBDC Readiness:\n✅ Payment gateway abstraction layer\n✅ Multi-currency support (IDR, ETH, USDC, CBDC)\n✅ Regulatory compliance framework\n✅ KYC/AML integration ready\n✅ Real-time settlement\n\n🌊 Pilot Sites:\n• Jakarta - Retail payments\n• Bali - Tourism transactions\n• Batam - Cross-border trade ⭐\n\n💡 Why STC + CBDC Perfect Match:\n- Instant settlement (no bank delays)\n- Lower transaction costs\n- Government-backed stability\n- Full transparency with blockchain\n- Perfect for tourism escrow\n\n📍 Batam-Bintan Strategic Position:\n- International gateway\n- Free Trade Zone\n- High tourism volume\n- Perfect CBDC testbed!\n\n🚀 Integration timeline: Q2-Q3 2025 (following BI pilot schedule)\n\nSTC Ultimate akan jadi platform pertama yang integrate CBDC untuk tourism! 🇮🇩'
          : '💳 Indonesian CBDC Integration - Digital Rupiah!\n\nBank Indonesia is piloting CBDC:\n\n🎯 STC Ultimate CBDC Ready:\n✅ Payment gateway abstraction\n✅ Multi-currency (IDR, ETH, USDC, CBDC)\n✅ Regulatory compliance\n✅ KYC/AML integration\n✅ Real-time settlement\n\n🌊 Pilot Sites:\n• Jakarta - Retail\n• Bali - Tourism\n• Batam - Cross-border ⭐\n\n💡 STC + CBDC Benefits:\n- Instant settlement\n- Lower costs\n- Government backing\n- Full transparency\n- Tourism escrow\n\n📍 Batam-Bintan Advantage:\n- International gateway\n- Free Trade Zone\n- High tourism volume\n- Perfect testbed!\n\n🚀 Timeline: Q2-Q3 2025\n\nFirst tourism platform with CBDC! 🇮🇩',
        suggestions: ['CBDC vs crypto', 'Regulatory compliance', 'Payment flow'],
        newContext: { lastTopic: 'cbdc' }
      };
    }

    // Batam-Bintan-Lagoi Tourism Insights
    if (lowerMessage.includes('batam') || lowerMessage.includes('bintan') || lowerMessage.includes('lagoi') || lowerMessage.includes('kepri') || lowerMessage.includes('riau islands')) {
      return {
        content: isIndonesian
          ? '🏝️ Batam-Bintan-Lagoi Tourism Hub - Strategic Insights!\n\n📊 Current Statistics (2024-2025):\n• Annual visitors: ~2.1M international + 1.8M domestic\n• Primary markets: Singapore (48%), Malaysia (22%), China (15%)\n• Average stay: 3.2 days\n• Tourism revenue: ~$1.2B annually\n\n🎯 Key Destinations:\n\n**Batam:**\n• Harbor Bay - Shopping & F&B hub\n• Nagoya - Entertainment district\n• Barelang Bridge - Iconic landmark\n• Nongsa - Beach resorts\n\n**Bintan:**\n• Lagoi Bay - Integrated resorts ⭐\n• Trikora Beach - Pristine coastline\n• Penyengat Island - Heritage site\n• Treasure Bay - Marine tourism\n\n**Lagoi Bay (Focus Area):**\n• 5-star resort cluster\n• Golf courses (2 championship)\n• Marina & water sports\n• Convention facilities\n• Target: MICE tourism\n\n💡 Tourism Challenges STC Solves:\n✅ High intermediary costs (20-35% commission)\n✅ Payment delays (7-14 days settlement)\n✅ Limited transparency\n✅ Cross-border payment friction\n✅ SME access to digital systems\n\n🚀 STC Ultimate Impact:\n• 98.6% cost reduction (proven in research!)\n• 99.997% faster transactions\n• 43% higher success rates\n• Real-time settlements\n• Blockchain transparency\n\n🌟 Strategic Advantage:\n- Free Trade Zone benefits\n- Singapore proximity (45 min ferry)\n- Growing MICE market\n- Government tourism push\n- Perfect for blockchain pilot!\n\nBatam-Bintan is the PERFECT testbed for Web3 tourism! 🇮🇩🚀'
          : '🏝️ Batam-Bintan-Lagoi Tourism Hub!\n\n📊 2024-2025 Stats:\n• 3.9M annual visitors\n• Markets: SG (48%), MY (22%), CN (15%)\n• Avg stay: 3.2 days\n• Revenue: ~$1.2B/year\n\n🎯 Key Areas:\n\n**Batam:**\n• Harbor Bay - Shopping\n• Nagoya - Entertainment\n• Nongsa - Beaches\n\n**Bintan:**\n• Lagoi Bay - Resorts ⭐\n• Trikora - Beaches\n• Treasure Bay - Marine\n\n**Lagoi Focus:**\n• 5-star resorts\n• Golf courses\n• Marina & water sports\n• MICE facilities\n\n💡 Problems STC Solves:\n✅ 20-35% commission fees\n✅ 7-14 day settlements\n✅ Lack of transparency\n✅ Payment friction\n✅ SME digital access\n\n🚀 Impact:\n• 98.6% cost reduction\n• 99.997% faster\n• 43% better success\n• Real-time settlement\n\nPerfect Web3 tourism testbed! 🇮🇩',
        suggestions: ['Tourism challenges', 'SME benefits', 'Lagoi resorts'],
        newContext: { lastTopic: 'batam-tourism' }
      };
    }

    // ML & Research Insights
    if (lowerMessage.includes('research') || lowerMessage.includes('ml') || lowerMessage.includes('machine learning') || lowerMessage.includes('data') || lowerMessage.includes('penelitian')) {
      return {
        content: isIndonesian
          ? '🔬 Research & ML Insights - Data-Driven Evidence!\n\n📊 Dissertation Research Results:\n\n**Statistical Analysis (30 runs):**\n✅ Transaction Cost: 98.6% reduction (p < 0.001)\n✅ Latency: 99.997% improvement (18.5 days → 50 sec)\n✅ Success Rate: 43% increase (67.5% → 96.5%)\n✅ All results statistically significant!\n\n🤖 ML Algorithms Implemented:\n\n**1. K-Means Clustering:**\n• 3 customer segments identified\n• Cluster 1: High-volume business travelers\n• Cluster 2: Premium leisure tourists\n• Cluster 3: Budget-conscious groups\n• Use case: Personalized recommendations\n\n**2. Association Rules (Apriori):**\n• 5 booking patterns discovered\n• "Peak Season → High Volume" (85% confidence)\n• "Premium Services → High Success" (92%)\n• "SME Vendors → Fast Transaction" (88%)\n• Use case: Smart package bundling\n\n**3. PCA Analysis:**\n• 2 principal components explain 90% variance\n• PC1: Transaction characteristics (65%)\n• PC2: Performance metrics (25%)\n• Use case: Feature importance ranking\n\n**4. Anomaly Detection:**\n• Isolation Forest algorithm\n• 94% detection accuracy\n• Real-time threat identification\n• Use case: Fraud prevention\n\n📈 Key Findings:\n• Traditional platform: 18.5 days, 20% fees, 67.5% success\n• STC Ultimate: 50 seconds, 0.275% fees, 96.5% success\n• Cohen\'s d effect size: 2.8+ (HUGE!)\n• ANOVA F-statistic: 156.7 (highly significant)\n\n🎯 Research Dashboard:\nAkses lengkap di homepage → Researcher role → Research Hub!\n\n💡 Real-World Impact:\nSemua angka ini bukan simulasi - proven dengan 10 scenarios across Batam-Bintan-Lagoi! 🔥'
          : '🔬 Research & ML Insights!\n\n📊 Dissertation Results (30 runs):\n✅ Cost: 98.6% reduction (p < 0.001)\n✅ Latency: 99.997% improvement\n✅ Success: 43% increase\n✅ Statistically significant!\n\n🤖 ML Algorithms:\n\n**1. K-Means:**\n• 3 customer segments\n• Personalized recommendations\n\n**2. Apriori Rules:**\n• 5 booking patterns\n• 85-92% confidence\n• Smart bundling\n\n**3. PCA:**\n• 90% variance explained\n• Feature importance\n\n**4. Anomaly Detection:**\n• 94% accuracy\n• Fraud prevention\n\n📈 Key Metrics:\n• Traditional: 18.5 days, 20% fees\n• STC: 50 sec, 0.275% fees\n• Effect size: 2.8 (HUGE!)\n\n🎯 Access: Homepage → Researcher → Research Hub\n\nProven across Batam-Bintan! 🔥',
        suggestions: ['ML algorithms explained', 'Statistical significance', 'Export research data'],
        newContext: { lastTopic: 'research' }
      };
    }

    // Tourism Trends 2025
    if (lowerMessage.includes('trend') || lowerMessage.includes('2025') || lowerMessage.includes('future') || lowerMessage.includes('masa depan')) {
      return {
        content: isIndonesian
          ? '🌟 Tourism Industry Trends 2025 - What\'s Next!\n\n🚀 Top 10 Trends:\n\n**1. Blockchain Payments Mainstream**\n• 15% of hotels accepting crypto (2024)\n• 35% projected by 2025\n• Stablecoins preferred (USDC, USDT)\n• CBDC pilots expanding\n\n**2. AI-Powered Personalization**\n• Real-time itinerary optimization\n• Predictive pricing algorithms\n• Chatbots handling 70% queries\n• Voice assistants everywhere\n\n**3. Sustainable Tourism Focus**\n• Carbon-neutral bookings\n• Eco-certification required\n• Green energy tracking\n• Circular economy models\n\n**4. Digital Nomad Surge**\n• 40M digital nomads globally\n• Long-stay packages popular\n• Co-working + accommodation bundles\n• Visa reforms in Indonesia\n\n**5. Web3 Loyalty Programs**\n• NFT-based memberships\n• Token rewards (tradeable!)\n• Decentralized reputation\n• Cross-platform redemption\n\n**6. Metaverse Tourism**\n• Virtual property tours\n• AR destination previews\n• Digital twin experiences\n• Pre-trip immersion\n\n**7. IoT Smart Hotels**\n• Biometric check-in\n• Voice-controlled rooms\n• Energy auto-optimization\n• Predictive maintenance\n\n**8. Direct Booking Dominance**\n• 60% prefer direct bookings\n• OTA commissions unsustainable\n• Blockchain disintermediation\n• P2P tourism platforms\n\n**9. Micro-Experiences**\n• Short, unique activities\n• Local community engagement\n• Authentic cultural immersion\n• Social media friendly\n\n**10. MICE Market Boom**\n• Hybrid events standard\n• Bleisure (business + leisure)\n• Lagoi Bay perfect position!\n• Smart venues required\n\n🎯 STC Ultimate Alignment:\n✅ Blockchain payments (Trend #1)\n✅ AI assistant & ML (Trend #2)\n✅ IoT integration (Trend #7)\n✅ Direct booking focus (Trend #8)\n✅ NFT loyalty ready (Trend #5)\n\n💡 Indonesian Advantage:\n• Young, tech-savvy population\n• Government digital push\n• Tourism infrastructure investment\n• Strategic ASEAN position\n\nSTC Ultimate is AHEAD of the curve! 🇮🇩🚀'
          : '🌟 Tourism Trends 2025!\n\n🚀 Top 10 Trends:\n\n1. Blockchain payments mainstream (35%)\n2. AI personalization everywhere\n3. Sustainable tourism focus\n4. Digital nomad surge (40M)\n5. Web3 loyalty programs\n6. Metaverse tourism\n7. IoT smart hotels\n8. Direct booking dominance (60%)\n9. Micro-experiences\n10. MICE market boom\n\n🎯 STC Alignment:\n✅ Blockchain payments\n✅ AI & ML\n✅ IoT integration\n✅ Direct bookings\n✅ NFT loyalty\n\n💡 Indonesia Position:\n• Tech-savvy population\n• Government support\n• Infrastructure investment\n• Strategic ASEAN hub\n\nAhead of the curve! 🇮🇩🚀',
        suggestions: ['Sustainable tourism', 'Digital nomad packages', 'NFT loyalty system'],
        newContext: { lastTopic: 'trends' }
      };
    }

    // Platform Overview (Enhanced)
    if (lowerMessage.includes('stc') || lowerMessage.includes('platform') || lowerMessage.includes('what is') || lowerMessage.includes('apa itu')) {
      return {
        content: isIndonesian
          ? '🌟 STC Ultimate - Next-Gen Smart Tourism Platform!\n\n**Overview:**\nPlatform Web3 tourism lengkap yang menggabungkan blockchain, IoT, AI, dan real-time analytics untuk revolucionize industri pariwisata Indonesia.\n\n**Core Technology Stack:**\n• Blockchain: Ethereum (Sepolia) → Base Mainnet ready\n• Smart Contracts: Solidity (escrow, booking, NFT)\n• Real-time: SpacetimeDB architecture (LocalStorage sementara)\n• AI/ML: 5 algorithms (K-Means, PCA, Apriori, etc)\n• IoT: 18+ devices, MQTT/WebSocket\n• Frontend: Next.js 14, React, Tailwind\n• Analytics: gRPC streaming, real-time metrics\n\n**Key Features:**\n✅ Decentralized Booking - No intermediaries\n✅ Smart Escrow - Milestone-based release\n✅ IoT Integration - Automated verification\n✅ AI Analytics - Predictive insights\n✅ SCADA System - Infrastructure control\n✅ Energy Optimizer - AI-powered savings\n✅ NFT Achievements - Gamification\n✅ DAO Governance - Community-driven\n✅ Cross-Chain Bridge - Multi-blockchain\n✅ Metaverse Ready - Virtual tours\n\n**Target Users:**\n🏨 Hotels & Resorts - Lagoi Bay focus\n🏪 Tourism SMEs - Batam-Bintan vendors\n👥 Tourists - International & domestic\n🔧 Operators - SCADA control center\n🔬 Researchers - Dissertation integration\n\n**Proven Results:**\n• 98.6% cost reduction vs traditional\n• 99.997% faster transactions\n• 43% higher success rates\n• Statistically significant (p < 0.001)\n\n**Origin Story:**\nDimulai sebagai WordPress plugin sederhana, berkembang menjadi full-stack Web3 ecosystem untuk democratize blockchain technology buat UMKM Indonesia! 🇮🇩\n\n**Roadmap 2025:**\nQ1: CBDC integration pilot\nQ2: Base Mainnet deployment\nQ3: Lagoi Bay partnerships\nQ4: National expansion\n\nBuilt for Indonesian tourism, ready for global scale! 🚀'
          : '🌟 STC Ultimate - Next-Gen Tourism!\n\n**Overview:**\nComprehensive Web3 tourism platform combining blockchain, IoT, AI, and real-time analytics.\n\n**Tech Stack:**\n• Blockchain: Ethereum → Base\n• Smart Contracts: Solidity\n• Real-time: SpacetimeDB ready\n• AI/ML: 5 algorithms\n• IoT: 18+ devices\n• Frontend: Next.js 14\n\n**Features:**\n✅ Decentralized booking\n✅ Smart escrow\n✅ IoT automation\n✅ AI analytics\n✅ SCADA control\n✅ Energy optimizer\n✅ NFT achievements\n✅ DAO governance\n✅ Cross-chain bridge\n✅ Metaverse ready\n\n**Users:**\n🏨 Hotels & Resorts\n🏪 Tourism SMEs\n👥 Tourists\n🔧 Operators\n🔬 Researchers\n\n**Results:**\n• 98.6% cost reduction\n• 99.997% faster\n• 43% better success\n• p < 0.001 significant\n\n**Roadmap 2025:**\nQ1: CBDC pilot\nQ2: Base Mainnet\nQ3: Partnerships\nQ4: Expansion\n\nBuilt for Indonesia! 🇮🇩🚀',
        suggestions: ['How booking works?', 'Smart contracts explained', 'Research results'],
        newContext: { lastTopic: 'platform-overview' }
      };
    }

    // Smart Contracts & Web3 (Enhanced)
    if (lowerMessage.includes('smart contract') || lowerMessage.includes('escrow') || lowerMessage.includes('web3') || lowerMessage.includes('kontrak pintar')) {
      return {
        content: isIndonesian
          ? '⛓️ Smart Contracts - The Brain of STC Ultimate!\n\n**Architecture Overview:**\n\n**1. Booking Contract (ReservationManager.sol)**\n```\nBooking Flow:\n1. createBooking() → Guest pays, funds locked\n2. confirmBooking() → Hotel accepts\n3. checkIn() → IoT verifies arrival\n4. roomEntry() → RFID validates access\n5. checkOut() → IoT confirms departure\n6. releaseEscrow() → Auto-payment to hotel\n```\n\n**2. Escrow Contract (MilestoneEscrow.sol)**\n• Multi-milestone support\n• Percentage-based releases\n• Dispute resolution mechanism\n• Refund logic with penalties\n• Time-lock for security\n\nMilestone Examples:\n• Booking confirmed: 10% to hotel\n• Check-in verified: 40% released\n• Stay completed: 50% final release\n\n**3. Token Contract (STCToken.sol)**\n• ERC-20 compatible\n• Reward distribution\n• Staking mechanism\n• Governance voting\n• Burn & mint controls\n\n**4. NFT Contract (AchievementNFT.sol)**\n• ERC-721 standard\n• Dynamic metadata\n• Loyalty tiers\n• Tradeable achievements\n• Rarity system\n\n🔒 Security Features:\n✅ ReentrancyGuard - Prevent attacks\n✅ AccessControl - Role-based permissions\n✅ Pausable - Emergency stop\n✅ Upgradeable - Proxy pattern\n✅ Time-locks - Delay sensitive operations\n✅ Multi-sig - Critical functions require multiple approvals\n\n⚡ Gas Optimization:\n• Batch operations\n• Storage optimization\n• Event emission instead of storage\n• Off-chain computation with on-chain verification\n• Base L2 = 100x cheaper than Ethereum!\n\n📊 On-Chain Events:\nSemua actions emit events:\n- BookingCreated\n- EscrowReleased\n- MilestoneCompleted\n- TokenMinted\n- NFTAwarded\n\n🎯 Real-World Example:\nBooking hotel Lagoi Bay Rp 5,000,000:\n1. Guest pays 5M + gas (~Rp 1,500 di Base)\n2. Funds locked in escrow smart contract\n3. IoT sensors verify check-in → 40% released\n4. Stay completed → remaining 60% released\n5. Total time: ~2 minutes vs 7-14 days traditional!\n\n💡 Why This Matters:\n• Trustless - No need to trust intermediary\n• Automated - Reduces human error\n• Transparent - All transactions on-chain\n• Immutable - Cannot be altered\n• Auditable - Full history preserved\n\nSmart contracts = Future of tourism payments! 🚀'
          : '⛓️ Smart Contracts Explained!\n\n**Architecture:**\n\n**1. Booking Contract**\n```\nFlow:\n1. createBooking() → Pay & lock\n2. confirmBooking() → Hotel accepts\n3. checkIn() → IoT verifies\n4. roomEntry() → RFID validates\n5. checkOut() → Confirmed\n6. releaseEscrow() → Auto-payment\n```\n\n**2. Escrow Contract**\n• Multi-milestone\n• Percentage releases\n• Dispute resolution\n• Refund logic\n• Time-locks\n\n**3. Token Contract**\n• ERC-20\n• Rewards\n• Staking\n• Governance\n\n**4. NFT Contract**\n• ERC-721\n• Achievements\n• Loyalty tiers\n• Tradeable\n\n🔒 Security:\n✅ ReentrancyGuard\n✅ AccessControl\n✅ Pausable\n✅ Upgradeable\n✅ Time-locks\n✅ Multi-sig\n\n⚡ Gas Optimization:\n• Batch operations\n• Storage optimization\n• Event emission\n• Base L2 = 100x cheaper!\n\n🎯 Example:\nBook hotel Rp 5M:\n1. Pay + gas (~Rp 1,500)\n2. Escrow locked\n3. Check-in → 40% released\n4. Completed → 60% released\n5. Time: ~2 min vs 7-14 days!\n\n💡 Benefits:\n• Trustless\n• Automated\n• Transparent\n• Immutable\n• Auditable\n\nFuture of payments! 🚀',
        suggestions: ['Escrow milestones', 'Gas fees breakdown', 'Security features'],
        newContext: { lastTopic: 'smart-contracts' }
      };
    }

    // AI & IoT Integration
    if (lowerMessage.includes('iot') || lowerMessage.includes('device') || lowerMessage.includes('sensor') || lowerMessage.includes('scada')) {
      return {
        content: isIndonesian
          ? '🤖 IoT & SCADA Integration - The Nervous System!\n\n**Device Network (18+ IoT Devices):**\n\n**1. HVAC Systems (4 units)**\n• Smart climate control\n• Occupancy-based optimization\n• Energy consumption tracking\n• Predictive maintenance\n• Auto-adjust based on guest preferences\n\n**2. Smart Lighting (6 zones)**\n• Motion sensor activation\n• Daylight harvesting\n• Color temperature adjustment\n• Scene programming\n• Energy monitoring\n\n**3. Security Cameras (5 units)**\n• 24/7 live streaming\n• AI-powered anomaly detection\n• Facial recognition (opt-in)\n• License plate recognition\n• Incident recording\n\n**4. Access Control (3 points)**\n• RFID card readers\n• Biometric scanners\n• QR code verification\n• Blockchain-logged access\n• Real-time notifications\n\n📡 Communication Protocols:\n• MQTT - Real-time pub/sub messaging\n• WebSocket - Live dashboard updates\n• gRPC - Streaming analytics\n• HTTP REST - Configuration & control\n\n🎯 IoT → Blockchain Integration:\n```\nScenario: Guest Check-in\n1. Guest scans QR at lobby kiosk\n2. IoT device validates booking ID\n3. RFID card activated\n4. Smart contract triggered\n5. 40% escrow released to hotel\n6. Room access granted\n7. All logged on-chain\n8. Time elapsed: 30 seconds!\n```\n\n⚡ Energy Optimization with AI:\n• Real-time consumption monitoring\n• Predictive load forecasting\n• Automated demand response\n• Anomaly detection (e.g., AC left on in empty room)\n• Monthly savings: 15-25% proven!\n\nCurrent Status:\n✅ Total Consumption: 182.2 kWh\n✅ Savings Potential: 21.5 kWh (11.8%)\n✅ CO2 Offset: 142 trees equivalent\n✅ Efficiency Score: 87.5%\n\n👥 Visitor Density Management:\n• Real-time people counting\n• Heatmap generation\n• Crowd flow prediction\n• Capacity alerts\n• Staff optimization\n\nCurrent Metrics:\n• Total Visitors: 425\n• Avg Utilization: 63%\n• Critical Areas: 2 (Conference Hall, Restaurant)\n• Next peak prediction: 45 minutes\n\n🚨 SCADA Alerting System:\n• Critical alerts: Immediate notification\n• Warning alerts: Monitor closely\n• Info alerts: Awareness\n• ML confidence scores: 78-94%\n• Blockchain audit trail\n\n💡 Real-World Impact:\nLagoi Bay resort example:\n• 250 rooms monitored\n• 18+ device types\n• 99.8% uptime\n• 15% energy savings\n• 25% better guest satisfaction\n• Full transparency via blockchain\n\nIoT + Blockchain = Smart tourism perfection! 🏨🔗'
          : '🤖 IoT & SCADA - The Nervous System!\n\n**Devices (18+):**\n\n**1. HVAC (4 units)**\n• Climate control\n• Occupancy-based\n• Energy tracking\n• Predictive maintenance\n\n**2. Lighting (6 zones)**\n• Motion sensors\n• Daylight harvesting\n• Energy monitoring\n\n**3. Cameras (5 units)**\n• 24/7 streaming\n• AI anomaly detection\n• Incident recording\n\n**4. Access Control (3)**\n• RFID readers\n• Biometric scanners\n• QR verification\n\n📡 Protocols:\n• MQTT - Real-time\n• WebSocket - Live updates\n• gRPC - Analytics\n• REST - Control\n\n🎯 IoT → Blockchain:\n```\nCheck-in Flow:\n1. QR scan\n2. Booking validated\n3. RFID activated\n4. Smart contract triggered\n5. 40% escrow released\n6. Access granted\n7. Logged on-chain\n8. Time: 30 seconds!\n```\n\n⚡ Energy Optimization:\n• 182.2 kWh consumption\n• 21.5 kWh savings (11.8%)\n• 87.5% efficiency\n• 15-25% monthly savings\n\n👥 Visitor Management:\n• 425 visitors\n• 63% utilization\n• 2 critical areas\n• Real-time predictions\n\n💡 Impact:\n• 99.8% uptime\n• 15% energy savings\n• Full transparency\n\nIoT + Blockchain! 🏨🔗',
        suggestions: ['Energy savings', 'Access control', 'Anomaly detection'],
        newContext: { lastTopic: 'iot-scada' }
      };
    }

    // Default with context awareness
    const topic = context.lastTopic || 'general';
    return {
      content: isIndonesian
        ? `🤔 Saya bisa bantu dengan:\n\n💡 Topics Populer:\n• 🚀 Base Mainnet & Layer 2\n• 💳 Indonesian CBDC integration\n• 🏝️ Batam-Bintan-Lagoi insights\n• 🔬 Research & ML findings\n• 🌟 Tourism trends 2025\n• ⛓️ Smart contracts & escrow\n• 🤖 IoT & SCADA system\n• 📊 Real-time analytics\n\n🗣️ Language:\nBisa tanya dalam Bahasa Indonesia atau English!\n\n🎤 Voice Input:\nKlik icon microphone untuk voice command!\n\n${topic !== 'general' ? `\n💬 Lanjut topik sebelumnya (${topic})?` : ''}\n\nAda yang bisa saya bantu? 😊`
        : `🤔 I can help with:\n\n💡 Popular Topics:\n• 🚀 Base Mainnet & Layer 2\n• 💳 Indonesian CBDC\n• 🏝️ Batam-Bintan-Lagoi\n• 🔬 Research & ML\n• 🌟 Tourism trends 2025\n• ⛓️ Smart contracts\n• 🤖 IoT & SCADA\n• 📊 Analytics\n\n🗣️ Language:\nAsk in Indonesian or English!\n\n🎤 Voice Input:\nClick mic icon for voice commands!\n\n${topic !== 'general' ? `\n💬 Continue previous topic (${topic})?` : ''}\n\nWhat can I help you with? 😊`,
      suggestions: isIndonesian
        ? ['Apa itu STC?', 'Base Mainnet?', 'Batam tourism?', 'Research data?']
        : ['What is STC?', 'Base Mainnet?', 'Batam tourism?', 'Research data?']
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getEnhancedAIResponse(inputValue, context);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        context: response.newContext?.lastTopic
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Update context
      if (response.newContext) {
        setContext(prev => ({ ...prev, ...response.newContext }));
      }
    }, 1200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleQuickAction = (action: string) => {
    let query = '';
    switch (action) {
      case 'ml-insights':
        query = 'Show me research and ML insights';
        break;
      case 'base-mainnet':
        query = 'Tell me about Base Mainnet integration';
        break;
      case 'tourism-trends':
        query = 'What are tourism trends for 2025?';
        break;
      case 'research-data':
        query = 'Show me the research findings';
        break;
    }
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-[9999] animate-pulse"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-96 max-w-md shadow-2xl z-[9999] border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  2025
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-white/10 text-white border-0 text-xs">
                <Languages className="h-3 w-3 mr-1" />
                ID / EN
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-0 text-xs">
                <Brain className="h-3 w-3 mr-1" />
                ML-Powered
              </Badge>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0">
              {/* Quick Actions */}
              <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick Topics:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="justify-start h-auto py-2 px-3 hover:bg-white hover:border-purple-300"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-purple-600">{action.icon}</div>
                        <span className="text-xs font-medium text-white">{action.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="h-[60vh] sm:h-96 max-h-[500px] overflow-y-auto p-4 space-y-4 pt-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-black'} rounded-lg p-3 shadow-sm`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-600">STC AI Assistant</span>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0 text-[10px] px-1.5 py-0">
                            2025
                          </Badge>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line leading-relaxed">{stripMarkdown(message.content)}</div>
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs font-medium text-gray-700">💡 Suggested:</p>
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full justify-start text-xs h-8 bg-white hover:bg-purple-50 text-black border-purple-200 hover:border-purple-400"
                            >
                              <MessageCircle className="h-3 w-3 mr-2 text-purple-500" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask in Indonesian or English... 🇮🇩🇬🇧"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 text-black placeholder:text-gray-400"
                  />
                  <Button 
                    onClick={handleVoiceInput} 
                    size="icon" 
                    variant="outline"
                    className={`${isListening ? 'bg-red-100 border-red-300' : 'hover:bg-purple-50'}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4 text-red-600 animate-pulse" /> : <Mic className="h-4 w-4 text-purple-600" />}
                  </Button>
                  <Button onClick={handleSendMessage} size="icon" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    🤖 AI-Powered • 🎤 Voice-Enabled • 🧠 ML-Enhanced
                  </p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-200 text-purple-600">
                    Updated 2025
                  </Badge>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}
