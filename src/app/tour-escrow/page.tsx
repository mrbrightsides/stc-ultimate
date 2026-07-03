'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles,
  Wallet,
  Shield,
  Users,
  DollarSign,
  ArrowLeft,
  TrendingUp,
  Zap,
  Lock,
  CheckCircle,
  Github,
  ExternalLink,
  X,
  Clock,
  GitBranch,
  Globe,
  Coins
} from 'lucide-react';
import { TreasuryDashboard } from '@/components/mnee/treasury-dashboard';
import { EscrowBookingFlow } from '@/components/mnee/escrow-booking-flow';
import { MNEESwap } from '@/components/mnee/mnee-swap';
import { MNEEBuyFund } from '@/components/mnee/mnee-buy-fund';
import { MNEEPortfolio } from '@/components/mnee/mnee-portfolio';
import { ActivityTimelineFeed } from '@/components/mnee/activity-timeline-feed';
import { StakeholderCoordinationDashboard } from '@/components/mnee/stakeholder-coordination-dashboard';
import { BudgetAllocationViz } from '@/components/mnee/budget-allocation-viz';
import { CoordinationMetrics } from '@/components/mnee/coordination-metrics';
import { TransactionTransparencyPanel } from '@/components/mnee/transaction-transparency-panel';
import { DemoDataControl } from '@/components/mnee/demo-data-control';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import Link from 'next/link';
import { MNEETokenManager } from '@/lib/mnee-token';
import { TourEscrowManager } from '@/lib/tour-escrow-contract';
import { RevenueSplitManager } from '@/lib/revenue-split-contract';
import type { MNEETokenInfo } from '@/lib/mnee-token';
import type { TourEscrow } from '@/lib/tour-escrow-contract';
import type { RevenueSplit } from '@/lib/revenue-split-contract';

type AppMode = 'landing' | 'treasury' | 'booking';

export default function TourEscrowPage() {
  const [mode, setMode] = useState<AppMode>('landing');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  
  // MNEE & Contract managers
  const [mneeManager, setMneeManager] = useState<MNEETokenManager | null>(null);
  const [escrowManager, setEscrowManager] = useState<TourEscrowManager | null>(null);
  const [splitManager, setSplitManager] = useState<RevenueSplitManager | null>(null);
  
  // Data states
  const [mneeInfo, setMneeInfo] = useState<MNEETokenInfo | null>(null);
  const [escrows, setEscrows] = useState<TourEscrow[]>([]);
  const [splits, setSplits] = useState<RevenueSplit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize managers on wallet connect
  useEffect(() => {
    if (provider && walletAddress) {
      initializeManagers();
    }
  }, [provider, walletAddress]);

  // Load demo data on mount (even without wallet)
  useEffect(() => {
    refreshData();
  }, []);

  const initializeManagers = async () => {
    if (!provider) return;
    
    try {
      // Initialize MNEE token manager
      const mnee = new MNEETokenManager();
      await mnee.initialize(provider);
      setMneeManager(mnee);
      
      // Initialize escrow manager
      const escrow = new TourEscrowManager();
      await escrow.initialize(provider);
      setEscrowManager(escrow);
      
      // Initialize split manager
      const split = new RevenueSplitManager();
      await split.initialize(provider);
      setSplitManager(split);
      
      // Load data
      await refreshData();
      
      toast.success('Connected to MNEE platform!');
    } catch (error) {
      console.error('Manager initialization error:', error);
      toast.error('Failed to initialize managers');
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Check for demo data in localStorage first (for hackathon demo)
      const demoEscrows = localStorage.getItem('tour_escrows');
      const demoSplits = localStorage.getItem('revenue_splits');
      
      if (demoEscrows && demoSplits) {
        // Use demo data if available
        const parsedEscrows = JSON.parse(demoEscrows) as TourEscrow[];
        const parsedSplits = JSON.parse(demoSplits) as RevenueSplit[];
        
        setEscrows(parsedEscrows);
        setSplits(parsedSplits);
        
        console.log('✅ Loaded demo data from localStorage:', {
          escrows: parsedEscrows.length,
          splits: parsedSplits.length
        });
      } else if (mneeManager && escrowManager && splitManager && walletAddress) {
        // Fall back to contract data if no demo data
        const info = await mneeManager.getTokenInfo(walletAddress);
        setMneeInfo(info);
        
        const userEscrows = escrowManager.getUserEscrows(walletAddress);
        setEscrows(userEscrows);
        
        const userSplits = splitManager.getUserSplits(walletAddress);
        setSplits(userSplits);
        
        console.log('✅ Loaded contract data:', {
          escrows: userEscrows.length,
          splits: userSplits.length
        });
      }
      
      // Always try to get MNEE info if manager is available
      if (mneeManager && walletAddress) {
        const info = await mneeManager.getTokenInfo(walletAddress);
        setMneeInfo(info);
      }
      
    } catch (error) {
      console.error('Data refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);
      
      // Create provider
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      
      toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setMneeManager(null);
    setEscrowManager(null);
    setSplitManager(null);
    setMneeInfo(null);
    setEscrows([]);
    setSplits([]);
    toast.info('Wallet disconnected');
  };

  const handleEscrowCreated = (escrow: TourEscrow) => {
    setEscrows(prev => [escrow, ...prev]);
    toast.success('Escrow created successfully!');
  };

  const handleSplitCreated = (split: RevenueSplit) => {
    setSplits(prev => [split, ...prev]);
    toast.success('Revenue split executed!');
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
                {mode !== 'landing' && (
                  <NeonButton 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setMode('landing')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </NeonButton>
                )}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <DollarSign className="h-8 w-8 text-cyan-400" />
                    <div className="absolute inset-0 h-8 w-8 text-purple-400 animate-pulse">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      TourEscrow
                    </h1>
                    <p className="text-xs text-gray-400">Powered by MNEE Stablecoin</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <NeonButton 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setIsAboutOpen(true)}
                >
                  About
                </NeonButton>
                
                <Link href="https://stc-ultimate.elpeef.com/">
                  <NeonButton size="sm" variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Back to STC
                  </NeonButton>
                </Link>
                
                {walletAddress ? (
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </Badge>
                    <NeonButton
                      size="sm"
                      variant="secondary"
                      onClick={disconnectWallet}
                    >
                      Disconnect
                    </NeonButton>
                  </div>
                ) : (
                  <NeonButton
                    variant="primary"
                    onClick={connectWallet}
                    loading={isConnecting}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </NeonButton>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {mode === 'landing' && (
            <div className="space-y-16">
              {/* Hero Section */}
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-lg px-6 py-2">
                    MNEE Hackathon Submission
                  </Badge>
                  <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Programmable Tourism Treasury
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Automated escrow and revenue split system for tourism bookings using MNEE USD-backed stablecoin. 
                    Lock payments, auto-distribute to stakeholders, and eliminate payment delays.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {walletAddress ? (
                    <>
                      <NeonButton
                        size="lg"
                        variant="primary"
                        onClick={() => setMode('booking')}
                        className="text-xl px-8 py-4"
                      >
                        <Zap className="h-6 w-6" />
                        Create Booking
                      </NeonButton>
                      <NeonButton
                        size="lg"
                        variant="secondary"
                        onClick={() => setMode('treasury')}
                        className="text-xl px-8 py-4"
                      >
                        <TrendingUp className="h-6 w-6" />
                        View Treasury
                      </NeonButton>
                    </>
                  ) : (
                    <NeonButton
                      size="lg"
                      variant="primary"
                      onClick={connectWallet}
                      loading={isConnecting}
                      className="text-xl px-8 py-4"
                    >
                      <Wallet className="h-6 w-6" />
                      Connect to Start
                    </NeonButton>
                  )}
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 pt-8">
                  <NeonCard glowColor="cyan">
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-cyan-400">{escrows.length}</p>
                      <p className="text-gray-400">Active Escrows</p>
                    </div>
                  </NeonCard>
                  <NeonCard glowColor="purple">
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-purple-400">{splits.length}</p>
                      <p className="text-gray-400">Revenue Splits</p>
                    </div>
                  </NeonCard>
                  <NeonCard glowColor="green">
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-green-400">
                        ${escrows.reduce((sum, e) => sum + parseFloat(e.amountUSD), 0).toFixed(0)}
                      </p>
                      <p className="text-gray-400">Volume (USD)</p>
                    </div>
                  </NeonCard>
                  <NeonCard glowColor="orange">
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-orange-400">1:1</p>
                      <p className="text-gray-400">MNEE/USD Peg</p>
                    </div>
                  </NeonCard>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NeonCard glowColor="cyan" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Smart Escrow</h3>
                    <p className="text-gray-400">
                      MNEE payments locked in smart contracts until service verification. 
                      Auto-release to operators on confirmation.
                    </p>
                  </div>
                </NeonCard>

                <NeonCard glowColor="purple" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Revenue Split</h3>
                    <p className="text-gray-400">
                      Automated multi-stakeholder payment distribution. 
                      Hotel, guide, platform fees split instantly on-chain.
                    </p>
                  </div>
                </NeonCard>

                <NeonCard glowColor="green" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">USD Stability</h3>
                    <p className="text-gray-400">
                      MNEE stablecoin pegged 1:1 to USD eliminates crypto volatility. 
                      Predictable pricing for tourism bookings.
                    </p>
                  </div>
                </NeonCard>

                <NeonCard glowColor="orange" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Instant Settlement</h3>
                    <p className="text-gray-400">
                      No 30-60 day payment delays. Operators receive funds immediately 
                      after service completion verification.
                    </p>
                  </div>
                </NeonCard>

                <NeonCard glowColor="cyan" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Treasury Dashboard</h3>
                    <p className="text-gray-400">
                      Real-time analytics for MNEE balance, escrow status, 
                      and revenue distribution with comprehensive metrics.
                    </p>
                  </div>
                </NeonCard>

                <NeonCard glowColor="purple" className="text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Trust & Transparency</h3>
                    <p className="text-gray-400">
                      All transactions on-chain with full transparency. 
                      Tourists and operators build trust through verifiable records.
                    </p>
                  </div>
                </NeonCard>
              </div>

              {/* MNEE Info */}
              <NeonCard glowColor="green" intense>
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    Built for MNEE Hackathon
                  </h3>
                  <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                    TourEscrow demonstrates <strong>Financial Automation</strong> - programmable invoicing, 
                    escrow, and treasury management powered by MNEE stablecoin on Ethereum.
                  </p>
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <a 
                      href="https://mnee.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Learn about MNEE
                    </a>
                    <a 
                      href="https://github.com/mrbrightsides" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      View Source
                    </a>
                  </div>
                </div>
              </NeonCard>
            </div>
          )}

          {mode === 'treasury' && (
            <div className="space-y-8">
              {/* Treasury Header */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MNEE Treasury Hub
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Manage your MNEE portfolio, swap tokens, buy with fiat, and track automated revenue flows
                </p>
              </div>

              {/* Treasury & Coordination Tabs */}
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="coordination">🔥 Coordination</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="swap">Swap</TabsTrigger>
                  <TabsTrigger value="buy">Buy MNEE</TabsTrigger>
                </TabsList>

                {/* Treasury Dashboard */}
                <TabsContent value="dashboard" className="space-y-6 mt-8">
                  {/* Demo Data Control - For Hackathon Demo */}
                  <DemoDataControl />
                  
                  <TreasuryDashboard
                    mneeInfo={mneeInfo}
                    escrows={escrows}
                    splits={splits}
                    onRefresh={refreshData}
                    isLoading={isLoading}
                  />
                </TabsContent>

                {/* 🔥 COORDINATION HUB - MNEE Hackathon Feature */}
                <TabsContent value="coordination" className="space-y-8 mt-8">
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 text-lg px-6 py-2">
                      Multi-Party Coordination System
                    </Badge>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Real-Time Stakeholder Coordination
                    </h3>
                    <p className="text-gray-300 max-w-3xl mx-auto">
                      Transparent treasury management, automated revenue distribution, and complete audit trail - 
                      solving real coordination problems in tourism payments.
                    </p>
                  </div>

                  {/* Coordination Metrics */}
                  <CoordinationMetrics escrows={escrows} splits={splits} />

                  {/* Stakeholder Coordination */}
                  <StakeholderCoordinationDashboard escrows={escrows} splits={splits} />

                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Activity Timeline */}
                    <ActivityTimelineFeed escrows={escrows} splits={splits} />
                    
                    {/* Budget Allocation */}
                    <div className="space-y-6">
                      <BudgetAllocationViz escrows={escrows} splits={splits} />
                    </div>
                  </div>

                  {/* Transaction Transparency */}
                  <TransactionTransparencyPanel escrows={escrows} splits={splits} />

                  {/* Hackathon Highlights */}
                  <NeonCard glowColor="green" intense>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-2xl font-bold text-white mb-4">
                          🏆 MNEE Hackathon: Coordination Problems Solved
                        </h4>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                          TourEscrow demonstrates comprehensive solutions to real-world coordination challenges
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-lg bg-black/30 border border-green-500/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-500/20">
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                            <h5 className="font-semibold text-white">Treasury Transparency</h5>
                          </div>
                          <p className="text-sm text-gray-400">
                            Complete visibility into fund allocation and revenue distribution with real-time tracking
                          </p>
                        </div>

                        <div className="p-6 rounded-lg bg-black/30 border border-green-500/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                              <Users className="h-6 w-6 text-cyan-400" />
                            </div>
                            <h5 className="font-semibold text-white">Multi-Party Coordination</h5>
                          </div>
                          <p className="text-sm text-gray-400">
                            Automated synchronization of tourists, hotels, guides, platform, and treasury stakeholders
                          </p>
                        </div>

                        <div className="p-6 rounded-lg bg-black/30 border border-green-500/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Shield className="h-6 w-6 text-purple-400" />
                            </div>
                            <h5 className="font-semibold text-white">Smart Governance</h5>
                          </div>
                          <p className="text-sm text-gray-400">
                            On-chain enforcement with blockchain verification eliminates disputes and builds trust
                          </p>
                        </div>
                      </div>
                    </div>
                  </NeonCard>
                </TabsContent>

                {/* MNEE Portfolio with OnchainKit */}
                <TabsContent value="portfolio" className="mt-8">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <MNEEPortfolio 
                      mneeInfo={mneeInfo}
                      onRefresh={refreshData}
                    />
                    
                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <NeonButton
                        variant="primary"
                        onClick={() => {
                          const tabs = document.querySelector('[role="tablist"]');
                          const swapTab = tabs?.querySelector('[value="swap"]') as HTMLButtonElement;
                          swapTab?.click();
                        }}
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                        Swap to MNEE
                      </NeonButton>
                      <NeonButton
                        variant="secondary"
                        onClick={() => {
                          const tabs = document.querySelector('[role="tablist"]');
                          const buyTab = tabs?.querySelector('[value="buy"]') as HTMLButtonElement;
                          buyTab?.click();
                        }}
                        className="w-full"
                      >
                        <DollarSign className="h-4 w-4" />
                        Buy with Fiat
                      </NeonButton>
                    </div>
                  </div>
                </TabsContent>

                {/* MNEE Swap with OnchainKit */}
                <TabsContent value="swap" className="mt-8">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center space-y-2 mb-8">
                      <h3 className="text-2xl font-bold text-white">Swap to MNEE</h3>
                      <p className="text-gray-400">
                        Convert ETH or other tokens to MNEE stablecoin with OnchainKit
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <MNEESwap
                        onSwapSuccess={(txHash) => {
                          toast.success(`Swap successful! Transaction: ${txHash.slice(0, 10)}...`);
                          refreshData();
                        }}
                      />
                    </div>

                    {/* Benefits */}
                    <NeonCard glowColor="cyan" className="max-w-2xl mx-auto">
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">Why swap to MNEE?</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-green-500/20 mt-0.5">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">USD Stability</p>
                              <p className="text-xs text-gray-400">No volatility, 1:1 peg</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 mt-0.5">
                              <Zap className="h-4 w-4 text-cyan-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">Instant Payments</p>
                              <p className="text-xs text-gray-400">Smart contract automation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NeonCard>
                  </div>
                </TabsContent>

                {/* MNEE Buy/Fund with OnchainKit */}
                <TabsContent value="buy" className="mt-8">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center space-y-2 mb-8">
                      <h3 className="text-2xl font-bold text-white">Buy MNEE with Fiat</h3>
                      <p className="text-gray-400">
                        Purchase MNEE directly with USD using credit card, debit card, or bank transfer
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <MNEEBuyFund
                        onPurchaseComplete={(amount) => {
                          toast.success(`Successfully purchased ${amount} MNEE!`);
                          refreshData();
                        }}
                      />
                    </div>

                    {/* Info */}
                    <NeonCard glowColor="purple" className="max-w-2xl mx-auto">
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">Fiat On-Ramp Features</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Instant delivery to your wallet</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Secure payment processing</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Multiple payment methods supported</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>1:1 USD exchange rate</span>
                          </div>
                        </div>
                      </div>
                    </NeonCard>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {mode === 'booking' && (
            <EscrowBookingFlow
              userAddress={walletAddress}
              onEscrowCreated={handleEscrowCreated}
              onSplitCreated={handleSplitCreated}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <p className="text-gray-400">
                  TourEscrow - MNEE Hackathon Financial Automation Track
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                  MNEE: 0x8cce...D6cF
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  Ethereum Mainnet
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* About Modal */}
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-black via-purple-950/20 to-black border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About TourEscrow
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <div className="space-y-8">
              {/* Hero Section */}
              <section className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 mb-4">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Powered by MNEE Programmable Money</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Revolutionizing Tourism Payments
                </h2>
                <p className="text-gray-300">
                  TourEscrow is a blockchain-powered smart escrow system that eliminates payment delays, 
                  automates revenue distribution, and brings transparency to the $1.9 trillion tourism industry.
                </p>
              </section>

              {/* What is TourEscrow */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  What is TourEscrow?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-purple-500/30 bg-black/40">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center gap-2 text-lg">
                        <DollarSign className="h-5 w-5" />
                        The Problem
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-300">Payment Delays</p>
                          <p className="text-sm text-gray-400">Traditional tourism payments take 30-60 days to settle</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-300">Manual Distribution</p>
                          <p className="text-sm text-gray-400">Revenue splits require manual processing and reconciliation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-300">Lack of Transparency</p>
                          <p className="text-sm text-gray-400">No real-time visibility into payment status and distribution</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-500/30 bg-black/40">
                    <CardHeader>
                      <CardTitle className="text-green-300 flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5" />
                        The Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Zap className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-300">Instant Settlement</p>
                          <p className="text-sm text-gray-400">Smart contracts release funds automatically upon verification</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GitBranch className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-300">Automated Splits</p>
                          <p className="text-sm text-gray-400">Revenue distributed to all stakeholders in milliseconds</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Globe className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-300">Full Transparency</p>
                          <p className="text-sm text-gray-400">Real-time dashboard shows all transactions and distributions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="bg-purple-500/30" />

              {/* How It Works */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <GitBranch className="h-6 w-6" />
                  How It Works
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      step: '1',
                      title: 'Book & Lock',
                      description: 'Tourist books a tour and locks payment in MNEE stablecoin (1:1 USD)',
                      icon: Lock,
                      color: 'purple'
                    },
                    {
                      step: '2',
                      title: 'Service Delivery',
                      description: 'Hotel/guide provides service and confirms completion',
                      icon: CheckCircle,
                      color: 'blue'
                    },
                    {
                      step: '3',
                      title: 'Auto-Release',
                      description: 'Smart contract automatically releases escrowed funds',
                      icon: Zap,
                      color: 'green'
                    },
                    {
                      step: '4',
                      title: 'Split & Distribute',
                      description: 'Funds split to hotel (70%), guide (15%), platform (10%), treasury (5%)',
                      icon: GitBranch,
                      color: 'pink'
                    }
                  ].map((item) => (
                    <Card key={item.step} className="border-purple-500/30 bg-black/40">
                      <CardHeader className="pb-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                          <item.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <CardTitle className="text-purple-300 text-sm">
                          Step {item.step}
                        </CardTitle>
                        <CardDescription className="text-white font-semibold text-xs">
                          {item.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <Separator className="bg-purple-500/30" />

              {/* MNEE Integration */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <Coins className="h-6 w-6" />
                  MNEE Integration
                </h3>
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black/40">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-300">Programmable Money for Tourism</CardTitle>
                    <CardDescription className="text-gray-300">
                      MNEE enables automated, trustless coordination between multiple parties
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-purple-400" />
                          </div>
                          <h4 className="font-semibold text-purple-300 text-sm">USD Stability</h4>
                        </div>
                        <p className="text-xs text-gray-400">
                          MNEE is pegged 1:1 to USD, eliminating crypto volatility risk for tourists and operators
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-blue-400" />
                          </div>
                          <h4 className="font-semibold text-blue-300 text-sm">Smart Contract Logic</h4>
                        </div>
                        <p className="text-xs text-gray-400">
                          Programmable rules govern escrow locks, releases, and multi-party splits automatically
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-green-400" />
                          </div>
                          <h4 className="font-semibold text-green-300 text-sm">Base Network</h4>
                        </div>
                        <p className="text-xs text-gray-400">
                          Built on Base (Ethereum L2) for low fees, fast settlements, and OnchainKit integration
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <Separator className="bg-purple-500/30" />

              {/* FAQ */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-purple-300">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="item-1" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
                    <AccordionTrigger className="text-purple-300 hover:text-purple-200 text-sm">
                      What is MNEE and why use it instead of regular crypto?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      MNEE is a stablecoin pegged 1:1 to USD, which means 1 MNEE = $1 USD always. This eliminates the volatility 
                      risk of regular cryptocurrencies like ETH or BTC. Tourists can book tours knowing the exact cost in USD, 
                      and operators receive the exact amount without currency fluctuation risk.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
                    <AccordionTrigger className="text-purple-300 hover:text-purple-200 text-sm">
                      How does the escrow protect both tourists and operators?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      When a tourist books, funds are locked in a smart contract (escrow). The operator can't access funds until 
                      service is delivered and verified. The tourist can't cancel without penalty after service starts. This creates 
                      trust without requiring a third-party intermediary.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
                    <AccordionTrigger className="text-purple-300 hover:text-purple-200 text-sm">
                      What are the revenue split percentages?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      The default split is: Hotel/Operator (70%), Guide/Coordinator (15%), Platform Commission (10%), 
                      and Treasury/Tax (5%). These percentages are configurable per booking and encoded in the smart contract.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
                    <AccordionTrigger className="text-purple-300 hover:text-purple-200 text-sm">
                      Do I need cryptocurrency experience to use TourEscrow?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-sm">
                      No! TourEscrow provides a user-friendly interface with OnchainKit integration. You can fund your wallet 
                      with fiat (credit card, bank transfer) directly in the app, and all pricing is shown in USD.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* CTA Section */}
              <section className="text-center space-y-4 py-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Experience TourEscrow?
                </h3>
                <p className="text-gray-300">
                  Join the future of tourism payments with instant settlements, automated coordination, and full transparency.
                </p>
                <NeonButton
                  variant="primary"
                  onClick={() => setIsAboutOpen(false)}
                  className="mx-auto"
                >
                  Get Started
                </NeonButton>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
