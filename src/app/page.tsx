'use client'
import { useState, useEffect } from 'react';

import { PackageBuilder } from '@/components/tourism/package-builder';
import { EnhancedDashboard } from '@/components/tourism/enhanced-dashboard';
import { EnhancedJourneyDashboard } from '@/components/tourism/enhanced-journey-dashboard';
import { WalletConnector } from '@/components/tourism/wallet-connector';
import { NetworkDetector } from '@/components/web3/network-detector';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { CurrencyToggle } from '@/components/ui/currency-toggle';
import DissertationIntegrationHub from '@/components/research/dissertation-integration-hub';
import AboutSTCUltimate from '@/components/about/about-stc-ultimate';
import STCConnectSimulation from '@/components/integration/stc-connect-simulation';
import TransactionProofSystem from '@/components/research/transaction-proof-system';
import { 
  Sparkles, 
  MapPin, 
  Zap, 
  Shield, 
  Github, 
  Globe, 
  ArrowLeft,
  Plane,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  BookOpen,
  BarChart3,
  Info,
  Network,
  Cpu,
  Download,
  LayoutDashboard,
  Trophy,
  Calendar,
  CheckCircle,
  GitBranch,
  Wallet
} from 'lucide-react';
import type { TourPackage } from '@/app/types/contracts';
import { sdk } from "@farcaster/miniapp-sdk";
import { STCEcosystem } from '@/components/ecosystem/stc-ecosystem';
import ScadaAuthWrapper from '@/components/scada/scada-auth-wrapper';
import ExportManager from '@/components/export/export-manager';
import DashboardSummary from '@/components/dashboard/dashboard-summary';
import STCComprehensiveNarrative from '@/components/documentation/stc-comprehensive-narrative';
import AdvancedToolsHub from '@/components/advanced/advanced-tools-hub';
import MetaverseHub from '@/components/metaverse/metaverse-hub';
import Phase0Documentation from '@/components/hcps/phase0-documentation';
import DAOGovernanceHub from '@/components/governance/dao-governance-hub';
import AITripPlannerHub from '@/components/trip-planner/ai-trip-planner-hub';
import CollaborationHub from '@/components/collaboration/collaboration-hub';
import CrossChainBridgeHub from '@/components/cross-chain/cross-chain-bridge-hub';
import NFTGalleryHub from '@/components/nft-gallery/nft-gallery-hub';
import BaseWalletHub from '@/components/web3/base-wallet-hub';
import { ZeroTrustDashboard } from '@/components/security/zero-trust-dashboard';
import { RoleSelector } from '@/components/role-selector';
import { useRole } from '@/contexts/role-context';
import { MODULE_METADATA } from '@/lib/roles-config';
import type { AppModule } from '@/lib/roles-config';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";
import Link from 'next/link';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { TourRestartButton } from '@/components/onboarding/TourRestartButton';

type AppMode = 'landing' | 'builder' | 'dashboard' | 'research' | 'about' | 'ecosystem' | 'scada' | 'export' | 'summary' | 'documentation' | 'advanced' | 'metaverse' | 'hcps-framework' | 'governance' | 'trip-planner' | 'collaboration' | 'cross-chain' | 'nft-gallery' | 'base-wallet' | 'security';

export default function STCUltimate() {
  const [mode, setMode] = useState<AppMode>('landing');
  const [currentPackage, setCurrentPackage] = useState<TourPackage | null>(null);
  const [completedJourneys, setCompletedJourneys] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentRate, ethToDisplay, formatCurrency, displayCurrency } = useCurrencyConverter();
  const { hasAccess, roleConfig, accessibleModules } = useRole();
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await sdk.actions.ready();
        console.log("Farcaster SDK initialized successfully");
      } catch (error) {
        console.error('Farcaster SDK error (non-blocking):', error);
      }
    };

    const initializeApp = async () => {
      setIsLoading(true);
      initializeFarcaster().catch(console.error);
      
      // Load completed journeys from localStorage
      try {
        const savedJourneys = localStorage.getItem('stc_completed_journeys');
        if (savedJourneys) {
          setCompletedJourneys(JSON.parse(savedJourneys));
        }
      } catch (error) {
        console.error('Failed to load completed journeys:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoading(false);
    };

    initializeApp();

    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Safety timeout - forcing app to load');
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(safetyTimeout);
  }, []);

  const handlePackageCreated = (tourPackage: TourPackage): void => {
    const packageWithContract = {
      ...tourPackage,
      status: 'booked' as const,
      contractAddress: '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613',
    };
    
    setCurrentPackage(packageWithContract);
    setMode('dashboard');
  };

  const handleServiceTrigger = (serviceId: number, txHash?: string): void => {
    if (!currentPackage) return;

    setCurrentPackage(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        services: prev.services.map(service => 
          service.id === serviceId 
            ? { 
                ...service, 
                status: 'completed' as const,
                transactionHash: txHash,
                timestamp: Date.now()
              }
            : service
        ),
        transactionHistory: [
          ...(prev.transactionHistory || []),
          txHash ? {
            serviceId,
            serviceName: prev.services.find(s => s.id === serviceId)?.name || 'Unknown Service',
            amount: prev.services.find(s => s.id === serviceId)?.amount || '0',
            txHash,
            timestamp: Date.now(),
            status: 'confirmed' as const,
            etherscanUrl: `https://sepolia.etherscan.io/tx/${txHash}`
          } : []
        ].flat()
      };
    });
  };

  const handleFinalizeTour = (): void => {
    if (!currentPackage) return;
    
    setCurrentPackage(prev => {
      if (!prev) return null;
      const completedPackage = { ...prev, status: 'completed' as const, completedAt: Date.now() };
      
      // Save to localStorage
      try {
        const existingJourneys = localStorage.getItem('stc_completed_journeys');
        const journeys = existingJourneys ? JSON.parse(existingJourneys) : [];
        journeys.push(completedPackage);
        localStorage.setItem('stc_completed_journeys', JSON.stringify(journeys));
      } catch (error) {
        console.error('Failed to save completed journey:', error);
      }
      
      return completedPackage;
    });
  };

  const handleRefundIssued = (serviceId: number, amount: string): void => {
    if (!currentPackage) return;
    
    setCurrentPackage(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        services: prev.services.map(service =>
          service.id === serviceId
            ? { ...service, status: 'cancelled' as const }
            : service
        )
      };
    });
  };

  const handleServiceSkipped = (serviceId: number): void => {
    if (!currentPackage) return;
    
    setCurrentPackage(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        services: prev.services.map(service =>
          service.id === serviceId
            ? { ...service, status: 'cancelled' as const }
            : service
        )
      };
    });
  };

  const handleClaimReward = (rewardId: string): void => {
    console.log('Claiming reward:', rewardId);
  };

  const handleMintNFT = (achievementId: string): void => {
    console.log('Minting NFT for achievement:', achievementId);
  };

  const resetToLanding = (): void => {
    setMode('landing');
    setCurrentPackage(null);
  };

  // Navigate to module with access check
  const navigateToModule = (module: AppModule): void => {
    if (!hasAccess(module)) {
      console.warn(`Access denied to module: ${module}`);
      return;
    }
    setMode(module);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string): JSX.Element => {
    const iconMap: Record<string, JSX.Element> = {
      Plane: <Plane className="h-6 w-6" />,
      Activity: <Activity className="h-6 w-6" />,
      LayoutDashboard: <LayoutDashboard className="h-6 w-6" />,
      Globe: <Globe className="h-6 w-6" />,
      Network: <Network className="h-6 w-6" />,
      BarChart3: <BarChart3 className="h-6 w-6" />,
      Cpu: <Cpu className="h-6 w-6" />,
      Download: <Download className="h-6 w-6" />,
      BookOpen: <BookOpen className="h-6 w-6" />,
      Sparkles: <Sparkles className="h-6 w-6" />,
      Info: <Info className="h-6 w-6" />,
      Brain: <TrendingUp className="h-6 w-6" />,
      Users: <Users className="h-6 w-6" />,
      MapPin: <MapPin className="h-6 w-6" />,
      Wallet: <Wallet className="h-6 w-6" />
    };
    return iconMap[iconName] || <Sparkles className="h-6 w-6" />;
  };

  // Get color classes based on role
  const getRoleColorClasses = (): string => {
    const colorMap: Record<string, string> = {
      cyan: 'from-cyan-400 to-cyan-600',
      purple: 'from-purple-400 to-purple-600',
      green: 'from-green-400 to-green-600',
      orange: 'from-orange-400 to-orange-600'
    };
    return colorMap[roleConfig.color] || 'from-cyan-400 to-purple-400';
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
          <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
                {mode !== 'landing' && (
                  <NeonButton 
                    size="sm" 
                    variant="secondary"
                    onClick={resetToLanding}
                    className="flex-shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </NeonButton>
                )}
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-cyan-400" />
                    <div className="absolute inset-0 h-6 w-6 md:h-8 md:w-8 text-purple-400 animate-pulse">
                      <Sparkles className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent truncate">
                      STC Ultimate
                    </h1>
                    <p className="text-xs text-gray-400 hidden sm:block">Smart Tourism Chain</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
                {/* Mindmap Link */}
                {mode === 'landing' && (
                  <>
                    <Link href="/mindmap" className="hidden sm:block">
                      <NeonButton size="sm" variant="secondary">
                        <GitBranch className="h-4 w-4" />
                        <span className="hidden lg:inline">Mindmap</span>
                      </NeonButton>
                    </Link>
                  </>
                )}
                
                {/* Role Selector */}
                <div className="hidden sm:block" data-tour="role-selector">
                  <RoleSelector />
                </div>
                
                {/* Currency Toggle */}
                <div className="hidden md:block">
                  <CurrencyToggle />
                </div>
                
                <div data-tour="wallet-connector">
                  <WalletConnector />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {isLoading ? (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <LoadingSkeleton variant="card" className="max-w-md mx-auto" />
                <div className="flex justify-center gap-4">
                  <LoadingSkeleton variant="card" className="w-32" />
                  <LoadingSkeleton variant="card" className="w-32" />
                  <LoadingSkeleton variant="card" className="w-32" />
                </div>
              </div>
              <LoadingSkeleton variant="stats" />
            </div>
          ) : (
            <NetworkDetector requiredChainId={11155111}>
              {mode === 'landing' && (
                <div className="space-y-16">
                  {/* Role-specific Welcome */}
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getRoleColorClasses()} bg-opacity-20 border border-${roleConfig.color}-500/30`}>
                        <p className="text-lg font-semibold text-white">
                          {roleConfig.icon} Welcome, <span className={`text-${roleConfig.color}-400`}>{roleConfig.name}</span>
                        </p>
                      </div>
                      <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {roleConfig.name === 'Tourist' && 'The Future of Travel'}
                        {roleConfig.name === 'SME Owner' && 'Smart Business Management'}
                        {roleConfig.name === 'Researcher' && 'Advanced Research Platform'}
                        {roleConfig.name === 'Administrator' && 'Complete System Control'}
                      </h2>
                      <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {roleConfig.description}
                      </p>
                    </div>
                    
                    {/* Role Features */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {roleConfig.features.slice(0, 4).map((feature, idx) => (
                        <Badge 
                          key={idx}
                          className={`bg-${roleConfig.color}-500/20 text-${roleConfig.color}-300 border-${roleConfig.color}-500/50 text-base px-4 py-2`}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Accessible Modules */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {accessibleModules.map((moduleId) => {
                        const metadata = MODULE_METADATA[moduleId];
                        if (!metadata) return null;

                        return (
                          <NeonButton
                            key={moduleId}
                            size="lg"
                            variant={metadata.variant}
                            onClick={() => navigateToModule(moduleId)}
                            className="text-xl px-8 py-4"
                          >
                            {getIconComponent(metadata.icon)}
                            {metadata.title}
                          </NeonButton>
                        );
                      })}
                    </div>

                    {/* Access Info */}
                    <Alert className="max-w-2xl mx-auto bg-gray-900/50 border-gray-800">
                      <Lock className="h-4 w-4" />
                      <AlertDescription className="text-gray-400">
                        You have access to <span className={`text-${roleConfig.color}-400 font-semibold`}>{accessibleModules.length} modules</span> as a {roleConfig.name}. 
                        Switch roles to access different features.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="features-grid">
                    <NeonCard glowColor="cyan" className="text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Zap className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Instant Payments</h3>
                        <p className="text-gray-400">
                          Automated escrow smart contracts release payments instantly 
                          when services are consumed. No delays, no disputes.
                        </p>
                      </div>
                    </NeonCard>

                    <NeonCard glowColor="purple" className="text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Shield className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Secure Escrow</h3>
                        <p className="text-gray-400">
                          Your funds are secured in smart contracts until services 
                          are delivered. Complete transparency and protection.
                        </p>
                      </div>
                    </NeonCard>

                    <NeonCard glowColor="green" className="text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Trusted Network</h3>
                        <p className="text-gray-400">
                          Verified merchants and service providers ensure quality 
                          experiences backed by blockchain reputation systems.
                        </p>
                      </div>
                    </NeonCard>

                    <NeonCard glowColor="orange" className="text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Research Platform</h3>
                        <p className="text-gray-400">
                          Comprehensive data collection and analysis tools for 
                          academic research and dissertation studies.
                        </p>
                      </div>
                    </NeonCard>

                    <NeonCard glowColor="purple" className="text-center cursor-pointer" onClick={() => setMode('security')} data-tour="security">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Shield className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Zero Trust Security</h3>
                        <p className="text-gray-400">
                          Device fingerprinting, risk scoring, and real-time 
                          security monitoring with multi-layer protection.
                        </p>
                      </div>
                    </NeonCard>

                    <Link href="/token-analytics" data-tour="token-analytics">
                      <NeonCard glowColor="cyan" className="text-center cursor-pointer hover:scale-105 transition-transform">
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <DollarSign className="h-8 w-8 text-cyan-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Token & Analytics</h3>
                          <p className="text-gray-400">
                            Manage STC tokens, view transaction analytics, 
                            and export data for research purposes.
                          </p>
                        </div>
                      </NeonCard>
                    </Link>

                    <Link href="/transaction-history" data-tour="transaction-history">
                      <NeonCard glowColor="purple" className="text-center cursor-pointer hover:scale-105 transition-transform">
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Activity className="h-8 w-8 text-purple-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Transaction History</h3>
                          <p className="text-gray-400">
                            Complete transaction history with pagination, 
                            filtering, sorting, and CSV/JSON export.
                          </p>
                        </div>
                      </NeonCard>
                    </Link>

                    <Link href="/whitepaper" data-tour="whitepaper">
                      <NeonCard glowColor="orange" className="text-center cursor-pointer hover:scale-105 transition-transform">
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-orange-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Whitepaper</h3>
                          <p className="text-gray-400">
                            Technical documentation, research papers, 
                            and comprehensive system architecture.
                          </p>
                        </div>
                      </NeonCard>
                    </Link>

                    <Link href="/tour-escrow" data-tour="tour-escrow">
                      <NeonCard glowColor="green" className="text-center cursor-pointer hover:scale-105 transition-transform">
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-green-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Tour Escrow</h3>
                          <p className="text-gray-400">
                            Real MNEE escrow transactions with USD-stable payments 
                            and stakeholder coordination dashboard.
                          </p>
                        </div>
                      </NeonCard>
                    </Link>
                  </div>

                  {/* Stats Section */}
                  <div className="text-center">
                    <NeonCard glowColor="orange" intense>
                      <div className="grid md:grid-cols-3 divide-x divide-orange-500/20">
                        <div className="p-8">
                          <p className="text-4xl font-bold text-orange-400">2.8M</p>
                          <p className="text-gray-400 mt-2">ETH Processed</p>
                        </div>
                        <div className="p-8">
                          <p className="text-4xl font-bold text-orange-400">150K+</p>
                          <p className="text-gray-400 mt-2">Happy Travelers</p>
                        </div>
                        <div className="p-8">
                          <p className="text-4xl font-bold text-orange-400">500+</p>
                          <p className="text-gray-400 mt-2">Global Destinations</p>
                        </div>
                      </div>
                    </NeonCard>
                  </div>
                </div>
              )}

              {mode === 'builder' && (
                <PackageBuilder onPackageCreated={handlePackageCreated} />
              )}

              {mode === 'dashboard' && (
                <>
                  {currentPackage ? (
                    <div className="space-y-8">
                      <EnhancedJourneyDashboard
                        tourPackage={currentPackage}
                        onServiceTrigger={handleServiceTrigger}
                        onFinalizeTour={handleFinalizeTour}
                        walletConnected={true}
                      />
                      
                      <EnhancedDashboard
                        tourPackage={currentPackage}
                        onServiceTrigger={handleServiceTrigger}
                        onFinalizeTour={handleFinalizeTour}
                        onRefundIssued={handleRefundIssued}
                        onServiceSkipped={handleServiceSkipped}
                        onClaimReward={handleClaimReward}
                        onMintNFT={handleMintNFT}
                        onBackToBuilder={() => setMode('builder')}
                        walletConnected={true}
                      />
                    </div>
                  ) : completedJourneys.length > 0 ? (
                    <div className="max-w-5xl mx-auto space-y-8">
                      {/* Completed Journeys Display */}
                      <NeonCard glowColor="green" intense>
                        <div className="space-y-6">
                          <div className="text-center space-y-3">
                            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Trophy className="h-10 w-10 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                              Your Completed Journeys
                            </h2>
                            <p className="text-gray-300">
                              You have completed {completedJourneys.length} journey{completedJourneys.length > 1 ? 's' : ''}! View your achievements and start a new adventure.
                            </p>
                          </div>

                          <div className="pt-4 border-t border-green-500/20">
                            <NeonButton
                              variant="primary"
                              size="lg"
                              onClick={() => setMode('builder')}
                              className="w-full"
                            >
                              <Plane className="h-5 w-5 mr-2" />
                              Create New Journey
                            </NeonButton>
                          </div>
                        </div>
                      </NeonCard>

                      {/* Journey History */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">Journey History</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {completedJourneys.slice().reverse().map((journey, index) => {
                            const completedServices = journey.services.filter(s => s.status === 'completed').length;
                            const totalAmount = journey.services
                              .filter(s => s.status === 'completed')
                              .reduce((sum, s) => sum + parseFloat(s.amount), 0)
                              .toFixed(4);
                            
                            return (
                              <NeonCard key={index} glowColor="cyan">
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-xl font-semibold text-white">{journey.destination}</h4>
                                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{journey.startDate} - {journey.endDate}</span>
                                      </div>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  </div>

                                  <div className="pt-4 border-t border-cyan-500/20">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                      <div>
                                        <p className="text-2xl font-bold text-cyan-400">{completedServices}</p>
                                        <p className="text-xs text-gray-400">Services Completed</p>
                                      </div>
                                      <div>
                                        <p className="text-2xl font-bold text-green-400">{totalAmount} ETH</p>
                                        <p className="text-xs text-gray-400">Total Spent</p>
                                      </div>
                                    </div>
                                  </div>

                                  {journey.completedAt && (
                                    <p className="text-xs text-gray-500 text-center">
                                      Completed on {new Date(journey.completedAt).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </NeonCard>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <NeonCard glowColor="cyan" className="text-center">
                        <div className="space-y-6 py-12">
                          <div className="mx-auto w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Activity className="h-10 w-10 text-cyan-400" />
                          </div>
                          
                          <div className="space-y-3">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                              No Active Journey Yet
                            </h2>
                            <p className="text-gray-300 max-w-md mx-auto">
                              You don't have an active journey yet. Create your first tour package to start tracking your adventure!
                            </p>
                          </div>

                          <div className="pt-4">
                            <NeonButton
                              variant="primary"
                              size="lg"
                              onClick={() => setMode('builder')}
                              className="text-lg px-8"
                            >
                              <Plane className="h-5 w-5" />
                              Start Your Journey
                            </NeonButton>
                          </div>
                        </div>
                      </NeonCard>

                      {/* How it Works */}
                      <NeonCard glowColor="purple">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-semibold text-white text-center">
                            How Journey Dashboard Works
                          </h3>
                          
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center space-y-3">
                              <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-purple-400">1</span>
                              </div>
                              <h4 className="font-semibold text-white">Build Package</h4>
                              <p className="text-sm text-gray-400">
                                Select destination, services, and create your custom tour package
                              </p>
                            </div>

                            <div className="text-center space-y-3">
                              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-cyan-400">2</span>
                              </div>
                              <h4 className="font-semibold text-white">Track Progress</h4>
                              <p className="text-sm text-gray-400">
                                Monitor service activation, payments, and journey milestones
                              </p>
                            </div>

                            <div className="text-center space-y-3">
                              <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-green-400">3</span>
                              </div>
                              <h4 className="font-semibold text-white">Complete & Earn</h4>
                              <p className="text-sm text-gray-400">
                                Finish your journey, claim rewards, and mint NFT achievements
                              </p>
                            </div>
                          </div>
                        </div>
                      </NeonCard>

                      {/* Features Preview */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <NeonCard glowColor="orange">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Zap className="h-6 w-6 text-orange-400" />
                              <h4 className="font-semibold text-white">Real-time Tracking</h4>
                            </div>
                            <p className="text-sm text-gray-400">
                              Track all services, payments, and IoT device interactions in real-time with live updates
                            </p>
                          </div>
                        </NeonCard>

                        <NeonCard glowColor="green">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Shield className="h-6 w-6 text-green-400" />
                              <h4 className="font-semibold text-white">Blockchain Security</h4>
                            </div>
                            <p className="text-sm text-gray-400">
                              All transactions secured by smart contracts on Sepolia testnet with full transparency
                            </p>
                          </div>
                        </NeonCard>
                      </div>
                    </div>
                  )}
                </>
              )}

              {mode === 'research' && (
                <div className="space-y-8">
                  <STCConnectSimulation 
                    isActive={true}
                    onDataReceived={(data) => {
                      console.log('STC Connect data received:', data);
                    }}
                  />
                  
                  <TransactionProofSystem 
                    isLiveMode={true}
                    transactions={currentPackage?.transactionHistory ? currentPackage.transactionHistory.map(tx => ({
                      id: tx.serviceId.toString(),
                      serviceId: tx.serviceId,
                      serviceName: tx.serviceName,
                      amount: tx.amount,
                      txHash: tx.txHash,
                      timestamp: tx.timestamp,
                      status: tx.status,
                      from: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
                      to: '0x123456789abcdef123456789abcdef123456789ab',
                      confirmations: 12
                    })) : undefined}
                  />
                  
                  <DissertationIntegrationHub
                    onExperimentComplete={(results) => {
                      console.log('Research experiment completed:', results);
                    }}
                    onDataExport={(data) => {
                      console.log('Research data exported:', data);
                    }}
                    autoRunExperiments={false}
                  />
                </div>
              )}
              
              {mode === 'about' && (
                <AboutSTCUltimate />
              )}
              
              {mode === 'ecosystem' && (
                <STCEcosystem onBackToLanding={resetToLanding} />
              )}
              
              {mode === 'scada' && (
                <ScadaAuthWrapper />
              )}
              
              {mode === 'summary' && (
                <DashboardSummary 
                  onNavigateToModule={(module) => {
                    console.log('🔴 onNavigateToModule called with:', module);
                    if (module.includes('scada')) setMode('scada');
                    else if (module.includes('research')) setMode('research');
                    else if (module.includes('tourism')) setMode('builder');
                    else if (module.includes('blockchain')) setMode('ecosystem');
                    else if (module.includes('dao-governance') || module.includes('governance')) {
                      console.log('🟢 Navigating to DAO Governance!');
                      setMode('governance');
                    }
                    else {
                      console.warn('⚠️ Unknown module:', module);
                    }
                  }}
                />
              )}
              
              {mode === 'export' && (
                <ExportManager />
              )}
              
              {mode === 'documentation' && (
                <STCComprehensiveNarrative onBack={resetToLanding} />
              )}
              
              {mode === 'advanced' && (
                <AdvancedToolsHub onBack={resetToLanding} />
              )}
              
              {mode === 'metaverse' && (
                <MetaverseHub onBack={resetToLanding} />
              )}
              
              {mode === 'hcps-framework' && (
                <Phase0Documentation onBack={resetToLanding} />
              )}
              
              {mode === 'governance' && (
                <DAOGovernanceHub onBack={resetToLanding} />
              )}
              
              {mode === 'trip-planner' && (
                <AITripPlannerHub onBack={resetToLanding} />
              )}
              
              {mode === 'collaboration' && (
                <CollaborationHub onBack={resetToLanding} />
              )}
              
              {mode === 'cross-chain' && (
                <CrossChainBridgeHub onBack={resetToLanding} />
              )}
              
              {mode === 'nft-gallery' && (
                <NFTGalleryHub onBack={resetToLanding} />
              )}
              
              {mode === 'base-wallet' && (
                <BaseWalletHub onBack={resetToLanding} />
              )}
              
              {mode === 'security' && (
                <div className="max-w-5xl mx-auto">
                  <ZeroTrustDashboard />
                </div>
              )}
            </NetworkDetector>
          )}
        </main>

        {/* Onboarding Tour */}
        <OnboardingTour runTour={mode === 'landing'} />

        {/* Tour Restart Button */}
        <TourRestartButton />

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <p className="text-gray-400">
                  Made for Indonesian tourism by STC Ecosystem
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/mrbrightsides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://smartourism.elpeef.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span>Website</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
