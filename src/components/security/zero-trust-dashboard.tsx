'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { Identity, Avatar, Name, Address as OnchainAddress, Badge as OnchainBadge } from '@coinbase/onchainkit/identity';
import { useZeroTrust } from '@/contexts/zero-trust-context';
import { useWalletSecurity } from '@/hooks/use-wallet-security';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrustEvolutionChart } from '@/components/security/trust-evolution-chart';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Fingerprint,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Lock,
  Unlock,
  Globe,
  MapPin,
  Network,
  Layers,
} from 'lucide-react';

export function ZeroTrustDashboard() {
  const { address, isConnected } = useAccount();
  const { 
    session, 
    deviceInfo, 
    isLoading, 
    registerDevice, 
    requiresMFA,
    updateWalletSecurity,
    getCombinedTrustScore,
    getTrustHistory,
    updateGeoContext,
  } = useZeroTrust();
  const { security, refreshSecurity, isSecure, trustScore } = useWalletSecurity();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Track last updated values to prevent infinite loop
  const lastUpdateRef = useRef<string>('');

  // Update Zero Trust context with wallet security data
  useEffect(() => {
    if (security.riskMetrics && isConnected && address) {
      // Create a stable hash from the key values
      const currentHash = `${address}-${security.riskMetrics.overallScore}-${security.accessLevel}`;
      
      // Only update if values actually changed
      if (currentHash !== lastUpdateRef.current) {
        lastUpdateRef.current = currentHash;
        updateWalletSecurity(security.riskMetrics, security.accessLevel);
      }
    }
  }, [address, isConnected, security.riskMetrics?.overallScore, security.accessLevel, updateWalletSecurity]);

  // Phase 4: Update geo-context on mount
  useEffect(() => {
    if (session.lastIpAddress) {
      updateGeoContext(session.lastIpAddress).catch(console.error);
    }
  }, [session.lastIpAddress, updateGeoContext]);

  if (isLoading) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Zero Trust Security
          </CardTitle>
          <CardDescription className="text-gray-400">Loading security status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getTrustIcon = (level: string): JSX.Element => {
    switch (level) {
      case 'high': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'medium': return <Activity className="h-5 w-5 text-yellow-400" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      default: return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const combinedTrustScore = getCombinedTrustScore();
  const trustHistory = getTrustHistory();

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <Card className="w-full border-2 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-2xl">
            <Shield className="h-7 w-7 text-blue-400" />
            Zero Trust Security Dashboard - Phase 4
          </CardTitle>
          <CardDescription className="text-gray-300">
            Complete Zero Trust Architecture: PDP + PEP + PIP with Geo-Context & Time-Based Risk Analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                <Shield className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="evolution" className="data-[state=active]:bg-purple-600">
                <Activity className="h-4 w-4 mr-2" />
                Trust Evolution
              </TabsTrigger>
              <TabsTrigger value="context" className="data-[state=active]:bg-green-600">
                <Globe className="h-4 w-4 mr-2" />
                Geo & Time Context
              </TabsTrigger>
              <TabsTrigger value="architecture" className="data-[state=active]:bg-orange-600">
                <Layers className="h-4 w-4 mr-2" />
                Architecture
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Combined Trust Score */}
              <div className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Combined Trust Score
                  </h3>
                  <span className="text-3xl font-bold text-white">{combinedTrustScore}/100</span>
                </div>
                <Progress value={combinedTrustScore} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Device: {deviceInfo?.trustScore || 0}/100</span>
                  <span>Wallet: {trustScore}/100</span>
                </div>
              </div>

              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Trust Level</span>
                    {getTrustIcon(session.trustLevel)}
                  </div>
                  <p className="text-2xl font-bold capitalize text-white">{session.trustLevel}</p>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Device Risk</span>
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{session.riskScore}/100</p>
                  <Badge className={`mt-2 ${getRiskColor(session.riskLevel)}`}>
                    {session.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Wallet Risk</span>
                    <Wallet className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {security.riskMetrics?.overallScore || 'N/A'}{security.riskMetrics && '/100'}
                  </p>
                  {security.riskMetrics && (
                    <Badge className={`mt-2 ${getRiskColor(security.riskMetrics.riskLevel)}`}>
                      {security.riskMetrics.riskLevel.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Device Status</span>
                    <Fingerprint className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {session.isDeviceRegistered ? 'Registered' : 'Unregistered'}
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {!session.isDeviceRegistered && (
                <Alert className="bg-yellow-900/20 border-yellow-700">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Your device is not registered. Register it to improve your trust score and enable seamless access.
                  </AlertDescription>
                </Alert>
              )}

              {requiresMFA() && (
                <Alert className="bg-red-900/20 border-red-700">
                  <Shield className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">
                    Multi-factor authentication required due to elevated risk score. Please complete MFA verification.
                  </AlertDescription>
                </Alert>
              )}

              {!isConnected && (
                <Alert className="bg-blue-900/20 border-blue-700">
                  <Wallet className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Connect your wallet to enable wallet-based security features and improve your trust score.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Trust Evolution Tab */}
            <TabsContent value="evolution" className="space-y-6 mt-6">
              <div className="p-6 bg-gray-900 border border-purple-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Trust Score Evolution
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Real-time visualization of your trust score changes over time with event markers
                </p>
                <TrustEvolutionChart history={trustHistory} />
              </div>

              {/* Trust History Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-gray-400">Peak Trust Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {Math.max(...trustHistory.map(h => h.combinedTrustScore), 0)}/100
                  </p>
                </div>
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-gray-400">Average Trust</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {trustHistory.length > 0
                      ? Math.floor(
                          trustHistory.reduce((sum, h) => sum + h.combinedTrustScore, 0) /
                            trustHistory.length
                        )
                      : 0}
                    /100
                  </p>
                </div>
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-gray-400">Tracking Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trustHistory.length}</p>
                  <p className="text-xs text-gray-500">data points</p>
                </div>
              </div>
            </TabsContent>

            {/* Geo & Time Context Tab */}
            <TabsContent value="context" className="space-y-6 mt-6">
              {session.geoRiskData ? (
                <>
                  {/* Geo-Location Risk */}
                  <div className="p-6 bg-gray-900 border border-green-700/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-400" />
                      Geo-Location Risk Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Country</span>
                          <Badge
                            className={`${getRiskColor(
                              session.geoRiskData.overallGeoRisk > 50 ? 'high' : 'low'
                            )}`}
                          >
                            {(session.geoRiskData.riskLevel || 'medium').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xl font-bold text-white">
                          {session.geoRiskData.country || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {session.geoRiskData.city || 'Unknown City'}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Geo Risk Score</span>
                          <Activity className="h-5 w-5 text-green-400" />
                        </div>
                        <p className="text-xl font-bold text-white">
                          {session.geoRiskData.overallGeoRisk}/100
                        </p>
                        <Progress value={session.geoRiskData.overallGeoRisk} className="h-2 mt-2" />
                      </div>

                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-400">IP Address</span>
                        </div>
                        <p className="text-sm font-mono text-white">
                          {session.lastIpAddress || 'Unknown'}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-gray-400">Timezone</span>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {session.geoRiskData.timezone || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Connection Type Indicators */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {session.geoRiskData.isVPN && (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          VPN Detected
                        </Badge>
                      )}
                      {session.geoRiskData.isProxy && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Proxy Detected
                        </Badge>
                      )}
                      {session.geoRiskData.isTor && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Tor Network
                        </Badge>
                      )}
                      {!session.geoRiskData.isVPN &&
                        !session.geoRiskData.isProxy &&
                        !session.geoRiskData.isTor && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Direct Connection
                          </Badge>
                        )}
                    </div>
                  </div>

                  {/* Time-Based Risk */}
                  {session.timeRiskData && (
                    <div className="p-6 bg-gray-900 border border-blue-700/50 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        Time-Based Risk Analysis
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Access Time</span>
                            <Clock className="h-5 w-5 text-blue-400" />
                          </div>
                          <p className="text-xl font-bold text-white">
                            {new Date().toLocaleTimeString()}
                          </p>
                          {session.timeRiskData.isUnusualHour && (
                            <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                              Unusual Hour
                            </Badge>
                          )}
                        </div>

                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Timezone Consistency</span>
                            {session.timeRiskData.timezoneConsistent ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white">
                            {session.timeRiskData.timezoneConsistent ? 'Consistent' : 'Changed'}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Time Risk Score</span>
                            <Activity className="h-5 w-5 text-blue-400" />
                          </div>
                          <p className="text-xl font-bold text-white">
                            {session.timeRiskData.overallTimeRisk}/100
                          </p>
                          <Progress value={session.timeRiskData.overallTimeRisk} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Alert className="bg-gray-900/50 border-gray-700">
                  <Globe className="h-4 w-4" />
                  <AlertDescription className="text-gray-400">
                    Geo-location and time-based context data is being analyzed. Connect from a new
                    location or refresh the page to see updated risk metrics.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6 mt-6">
              <div className="p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Layers className="h-6 w-6 text-orange-400" />
                  Complete Zero Trust Architecture
                </h3>

                {/* PDP - Policy Decision Point */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">PDP - Policy Decision Point</h4>
                      <p className="text-sm text-gray-400">Scoring Engine & Risk Analysis</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-13 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Device Trust Scoring:</strong> FingerprintJS device fingerprinting with
                        confidence thresholds
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Wallet Risk Analysis:</strong> OnchainKit identity verification +
                        transaction pattern analysis
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Geo-Context Scoring:</strong> IP geolocation + VPN/Proxy/Tor detection +
                        country risk assessment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Time-Based Scoring:</strong> Unusual hour detection + timezone consistency
                        validation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Combined Trust Calculation:</strong> Multi-factor weighted scoring (Device
                        + Wallet + Geo + Time)
                      </span>
                    </li>
                  </ul>
                </div>

                <Separator className="bg-gray-700 my-6" />

                {/* PEP - Policy Enforcement Point */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">PEP - Policy Enforcement Point</h4>
                      <p className="text-sm text-gray-400">Access Control & Security Policies</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-13 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Next.js Middleware:</strong> CSP headers, HSTS, X-Frame-Options,
                        X-Content-Type-Options
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Risk-Based Blocking:</strong> Route-specific risk thresholds (API: 60,
                        Dashboard: 80)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>MFA Enforcement:</strong> Multi-factor authentication required for
                        high-risk sessions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Smart Contract Access Gates:</strong> On-chain permission verification on
                        Base network
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Geo-Blocking:</strong> Country-based access control with high-risk region
                        filtering
                      </span>
                    </li>
                  </ul>
                </div>

                <Separator className="bg-gray-700 my-6" />

                {/* PIP - Policy Information Point */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Network className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        PIP - Policy Information Point
                      </h4>
                      <p className="text-sm text-gray-400">Context Providers & Data Sources</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-13 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Device Context:</strong> Hardware fingerprint, browser signature, OS
                        detection, confidence scoring
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Wallet Context:</strong> On-chain identity (OnchainKit), transaction
                        history, account age, activity patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Geo-Context:</strong> IP geolocation, country risk database, VPN/Proxy/Tor
                        detection APIs
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Time Context:</strong> Access hour patterns, timezone validation,
                        behavioral consistency
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Session Context:</strong> Historical events, trust evolution tracking,
                        security incident logging
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>
                        <strong>Network Context:</strong> IP reputation services, ISP detection, connection
                        type analysis
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Wallet Identity Section - Phase 2 */}
      {isConnected && address && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5 text-purple-400" />
              Wallet Identity & Security (Phase 2)
            </CardTitle>
            <CardDescription className="text-gray-400">
              On-chain identity verification and transaction risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OnchainKit Identity Component */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Identity
                  address={address}
                  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                >
                  <Avatar className="w-16 h-16" />
                  <div className="flex flex-col">
                    <Name className="text-xl font-bold text-white" />
                    <OnchainAddress className="text-sm text-gray-400" />
                    <OnchainBadge className="mt-1" />
                  </div>
                </Identity>
                {isSecure ? (
                  <Lock className="h-8 w-8 text-green-400 ml-auto" />
                ) : (
                  <Unlock className="h-8 w-8 text-orange-400 ml-auto" />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-gray-800 rounded">
                  <span className="text-gray-400 block mb-1">Access Level</span>
                  <span className="font-semibold text-white capitalize">{session.walletAccessLevel}</span>
                </div>
                <div className="p-3 bg-gray-800 rounded">
                  <span className="text-gray-400 block mb-1">Account Age</span>
                  <span className="font-semibold text-white">
                    {security.riskMetrics?.factors.accountAge || 0} days
                  </span>
                </div>
                <div className="p-3 bg-gray-800 rounded">
                  <span className="text-gray-400 block mb-1">Transactions</span>
                  <span className="font-semibold text-white">
                    {security.riskMetrics?.factors.transactionCount || 0}
                  </span>
                </div>
                <div className="p-3 bg-gray-800 rounded">
                  <span className="text-gray-400 block mb-1">Status</span>
                  <span className={`font-semibold ${isSecure ? 'text-green-400' : 'text-orange-400'}`}>
                    {isSecure ? 'Secure' : 'Review Required'}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Risk Analysis */}
            {security.riskMetrics && (
              <div className="space-y-4">
                <Separator className="bg-gray-700" />
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  Risk Analysis
                </h3>

                {/* Trust Indicators */}
                {security.riskMetrics.factors.trustIndicators.length > 0 && (
                  <div className="p-4 bg-green-900/10 border border-green-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Trust Indicators
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {security.riskMetrics.factors.trustIndicators.map((indicator: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suspicious Patterns */}
                {security.riskMetrics.factors.suspiciousPatterns.length > 0 && (
                  <div className="p-4 bg-red-900/10 border border-red-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Suspicious Patterns
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {security.riskMetrics.factors.suspiciousPatterns.map((pattern: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingDown className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {security.riskMetrics.recommendations.length > 0 && (
                  <div className="p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Security Recommendations</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {security.riskMetrics.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={refreshSecurity} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={security.isLoading}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  {security.isLoading ? 'Analyzing...' : 'Refresh Wallet Analysis'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Device Information */}
      {deviceInfo && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-400">Fingerprint:</span>
                <span className="font-mono text-xs text-white">
                  {deviceInfo.fingerprint.slice(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-400">Confidence:</span>
                <span className="font-semibold text-white">
                  {(deviceInfo.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-400">Trust Score:</span>
                <span className="font-semibold text-white">{deviceInfo.trustScore}/100</span>
              </div>
              {deviceInfo.registeredAt && (
                <div className="flex justify-between p-2 bg-gray-900 rounded">
                  <span className="text-gray-400">Registered:</span>
                  <span className="text-xs text-white">
                    {new Date(deviceInfo.registeredAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {!session.isDeviceRegistered && (
              <Button 
                onClick={registerDevice} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Register This Device
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Events */}
      {session.securityEvents.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-yellow-400" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {session.securityEvents.slice().reverse().slice(0, 10).map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-start gap-3 p-3 border border-gray-700 rounded-lg bg-gray-900"
                >
                  <div className="mt-0.5">
                    {event.severity === 'critical' && <XCircle className="h-4 w-4 text-red-400" />}
                    {event.severity === 'high' && <AlertTriangle className="h-4 w-4 text-orange-400" />}
                    {event.severity === 'medium' && <Activity className="h-4 w-4 text-yellow-400" />}
                    {event.severity === 'low' && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white capitalize">
                        {event.type.replace('_', ' ')}
                      </span>
                      <Badge className={`text-xs ${getRiskColor(event.severity)}`}>
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Architecture Info */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-blue-300">
            <Shield className="h-4 w-4" />
            Zero Trust Architecture - Phase 2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
              <span><strong>Device Layer:</strong> FingerprintJS device fingerprinting + behavioral analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
              <span><strong>Wallet Layer:</strong> On-chain identity via OnchainKit + transaction pattern analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
              <span><strong>Combined Trust:</strong> Multi-factor risk scoring (device + wallet + context)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
              <span><strong>Smart Contracts:</strong> Token-gated access control + on-chain permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
              <span><strong>Network Security:</strong> IP monitoring + Next.js middleware (CSP, HSTS)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
