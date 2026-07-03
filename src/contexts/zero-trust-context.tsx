'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { WalletRiskMetrics } from '@/lib/wallet-risk-analyzer';
import type { AccessLevel } from '@/lib/smart-contract-access';
import { geoRiskAnalyzer, type GeoRiskData, type TimeRiskData } from '@/lib/geo-risk-analyzer';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type DeviceInfo = {
  fingerprint: string;
  visitorId: string;
  confidence: number;
  components: Record<string, unknown>;
  registeredAt?: string;
  lastSeen?: string;
  trustScore: number;
};

export type SecurityEvent = {
  id: string;
  timestamp: string;
  type: 'device_change' | 'ip_change' | 'suspicious_time' | 'failed_auth' | 'geo_violation' | 'vpn_detected' | 'timezone_change';
  severity: RiskLevel;
  description: string;
  metadata: Record<string, unknown>;
};

export type TrustHistoryEntry = {
  timestamp: string;
  deviceTrustScore: number;
  walletTrustScore: number;
  combinedTrustScore: number;
  event?: string;
};

export type ZeroTrustSession = {
  deviceFingerprint: string | null;
  isDeviceRegistered: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  lastIpAddress: string | null;
  securityEvents: SecurityEvent[];
  trustLevel: 'untrusted' | 'low' | 'medium' | 'high';
  mfaRequired: boolean;
  // Phase 2: Wallet Integration
  walletAddress: Address | null;
  walletRiskMetrics: WalletRiskMetrics | null;
  walletAccessLevel: AccessLevel;
  combinedTrustScore: number; // Combined device + wallet trust
  // Phase 4: Advanced Context
  geoRiskData: GeoRiskData | null;
  timeRiskData: TimeRiskData | null;
  trustHistory: TrustHistoryEntry[];
};

type ZeroTrustContextType = {
  session: ZeroTrustSession;
  deviceInfo: DeviceInfo | null;
  isLoading: boolean;
  registerDevice: () => Promise<void>;
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
  calculateRiskScore: () => number;
  requiresMFA: () => boolean;
  // Phase 2: Wallet Methods
  updateWalletSecurity: (metrics: WalletRiskMetrics, accessLevel: AccessLevel) => void;
  getCombinedTrustScore: () => number;
  // Phase 4: Advanced Methods
  updateGeoContext: (ip: string) => Promise<void>;
  getTrustHistory: () => TrustHistoryEntry[];
};

const ZeroTrustContext = createContext<ZeroTrustContextType | undefined>(undefined);

export function ZeroTrustProvider({ children }: { children: ReactNode }) {
  const { address: walletAddress, isConnected } = useAccount();

  const [session, setSession] = useState<ZeroTrustSession>({
    deviceFingerprint: null,
    isDeviceRegistered: false,
    riskScore: 0,
    riskLevel: 'low',
    lastIpAddress: null,
    securityEvents: [],
    trustLevel: 'untrusted',
    mfaRequired: false,
    // Phase 2: Wallet fields
    walletAddress: null,
    walletRiskMetrics: null,
    walletAccessLevel: 'public',
    combinedTrustScore: 0,
    // Phase 4: Advanced Context
    geoRiskData: null,
    timeRiskData: null,
    trustHistory: [],
  });

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeFingerprint();
  }, []);

  const initializeFingerprint = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      const device: DeviceInfo = {
        fingerprint: result.visitorId,
        visitorId: result.visitorId,
        confidence: result.confidence.score,
        components: result.components,
        trustScore: 50,
      };

      setDeviceInfo(device);

      const stored = localStorage.getItem('ztrust_device');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { fingerprint: string; registeredAt: string };
          if (parsed.fingerprint === device.fingerprint) {
            device.registeredAt = parsed.registeredAt;
            device.lastSeen = new Date().toISOString();
            device.trustScore = 80;
            
            setSession((prev: ZeroTrustSession) => ({
              ...prev,
              deviceFingerprint: device.fingerprint,
              isDeviceRegistered: true,
              trustLevel: 'high',
              riskScore: calculateInitialRisk(device),
            }));
          } else {
            addSecurityEvent({
              type: 'device_change',
              severity: 'high',
              description: 'Device fingerprint changed since last session',
              metadata: { oldFingerprint: parsed.fingerprint, newFingerprint: device.fingerprint },
            });
            
            setSession((prev: ZeroTrustSession) => ({
              ...prev,
              deviceFingerprint: device.fingerprint,
              isDeviceRegistered: false,
              trustLevel: 'low',
              riskScore: 60,
              mfaRequired: true,
            }));
          }
        } catch (error) {
          console.error('Error parsing stored device:', error);
        }
      } else {
        setSession((prev: ZeroTrustSession) => ({
          ...prev,
          deviceFingerprint: device.fingerprint,
          isDeviceRegistered: false,
          trustLevel: 'untrusted',
          riskScore: calculateInitialRisk(device),
        }));
      }

      await checkIpAddress(device.fingerprint);
    } catch (error) {
      console.error('Fingerprint initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateInitialRisk = (device: DeviceInfo): number => {
    let risk = 0;
    
    if (!device.registeredAt) risk += 20;
    if (device.confidence < 0.9) risk += 15;
    
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) risk += 10;
    
    return Math.min(risk, 100);
  };

  const checkIpAddress = async (fingerprint: string): Promise<void> => {
    try {
      const response = await fetch('/api/zero-trust/check-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      });

      if (response.ok) {
        const data = await response.json() as { ipChanged: boolean; currentIp: string; previousIp?: string };
        
        if (data.ipChanged && data.previousIp) {
          addSecurityEvent({
            type: 'ip_change',
            severity: 'medium',
            description: 'IP address changed since last session',
            metadata: { previousIp: data.previousIp, currentIp: data.currentIp },
          });
          
          setSession((prev: ZeroTrustSession) => ({
            ...prev,
            riskScore: Math.min(prev.riskScore + 15, 100),
            lastIpAddress: data.currentIp,
          }));
        } else {
          setSession((prev: ZeroTrustSession) => ({
            ...prev,
            lastIpAddress: data.currentIp,
          }));
        }
      }
    } catch (error) {
      console.error('IP check error:', error);
    }
  };

  const registerDevice = async (): Promise<void> => {
    if (!deviceInfo) return;

    try {
      const response = await fetch('/api/zero-trust/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprint: deviceInfo.fingerprint,
          confidence: deviceInfo.confidence,
          components: deviceInfo.components,
        }),
      });

      if (response.ok) {
        const registeredDevice = {
          fingerprint: deviceInfo.fingerprint,
          registeredAt: new Date().toISOString(),
        };
        
        localStorage.setItem('ztrust_device', JSON.stringify(registeredDevice));
        
        setSession((prev: ZeroTrustSession) => ({
          ...prev,
          isDeviceRegistered: true,
          trustLevel: 'high',
          riskScore: Math.max(prev.riskScore - 30, 0),
          mfaRequired: false,
        }));

        setDeviceInfo((prev: DeviceInfo | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            registeredAt: registeredDevice.registeredAt,
            trustScore: 90,
          };
        });
      }
    } catch (error) {
      console.error('Device registration error:', error);
    }
  };

  const addSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>): void => {
    const newEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    setSession((prev: ZeroTrustSession) => {
      const updatedEvents = [...prev.securityEvents, newEvent];
      const riskIncrement = getRiskIncrement(event.severity);
      const newRiskScore = Math.min(prev.riskScore + riskIncrement, 100);
      
      return {
        ...prev,
        securityEvents: updatedEvents.slice(-20),
        riskScore: newRiskScore,
        riskLevel: calculateRiskLevel(newRiskScore),
        mfaRequired: newRiskScore >= 50,
      };
    });
  };

  const getRiskIncrement = (severity: RiskLevel): number => {
    const increments: Record<RiskLevel, number> = {
      low: 5,
      medium: 15,
      high: 25,
      critical: 40,
    };
    return increments[severity];
  };

  const calculateRiskLevel = (score: number): RiskLevel => {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  };

  const calculateRiskScore = (): number => {
    return session.riskScore;
  };

  const requiresMFA = (): boolean => {
    return session.mfaRequired || session.riskScore >= 50 || session.combinedTrustScore < 30;
  };

  /**
   * Phase 2: Update wallet security metrics
   */
  const updateWalletSecurity = (metrics: WalletRiskMetrics, accessLevel: AccessLevel): void => {
    setSession((prev: ZeroTrustSession) => {
      const walletTrustScore = Math.max(0, 100 - metrics.overallScore);
      const deviceTrustScore = prev.isDeviceRegistered ? 90 : 50;
      const combinedTrustScore = Math.floor((walletTrustScore + deviceTrustScore) / 2);

      // Add security event if wallet risk is high
      const updatedEvents = [...prev.securityEvents];
      if (metrics.riskLevel === 'high' || metrics.riskLevel === 'critical') {
        updatedEvents.push({
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type: 'suspicious_time',
          severity: metrics.riskLevel,
          description: `High-risk wallet detected: ${metrics.factors.suspiciousPatterns.join(', ')}`,
          metadata: { walletMetrics: metrics },
        });
      }

      return {
        ...prev,
        walletAddress: walletAddress || null,
        walletRiskMetrics: metrics,
        walletAccessLevel: accessLevel,
        combinedTrustScore,
        securityEvents: updatedEvents.slice(-20),
        trustLevel: calculateTrustLevel(combinedTrustScore),
        mfaRequired: prev.mfaRequired || metrics.overallScore >= 50,
      };
    });
  };

  /**
   * Phase 2: Calculate trust level from combined score
   */
  const calculateTrustLevel = (score: number): 'untrusted' | 'low' | 'medium' | 'high' => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'low';
    return 'untrusted';
  };

  /**
   * Phase 2: Get combined trust score
   */
  const getCombinedTrustScore = (): number => {
    return session.combinedTrustScore;
  };

  /**
   * Phase 4: Update geo-context risk
   */
  const updateGeoContext = async (ip: string): Promise<void> => {
    try {
      // Analyze geo-location risk
      const geoRisk = await geoRiskAnalyzer.analyzeGeoRisk(ip);
      
      // Analyze time-based risk
      const timeRisk = geoRiskAnalyzer.analyzeTimeRisk(
        geoRisk.timezone,
        session.geoRiskData?.timezone
      );

      // Add security events for high-risk geo/time factors
      if (geoRisk.isVPN) {
        addSecurityEvent({
          type: 'vpn_detected',
          severity: 'medium',
          description: 'VPN connection detected',
          metadata: { geoRisk },
        });
      }

      if (geoRisk.isProxy || geoRisk.isTor) {
        addSecurityEvent({
          type: 'geo_violation',
          severity: 'high',
          description: `${geoRisk.isTor ? 'Tor' : 'Proxy'} connection detected`,
          metadata: { geoRisk },
        });
      }

      if (!timeRisk.timezoneConsistent && session.geoRiskData) {
        addSecurityEvent({
          type: 'timezone_change',
          severity: 'medium',
          description: 'Timezone changed unexpectedly',
          metadata: { timeRisk },
        });
      }

      if (timeRisk.isUnusualHour) {
        addSecurityEvent({
          type: 'suspicious_time',
          severity: 'low',
          description: 'Access during unusual hours',
          metadata: { timeRisk },
        });
      }

      // Update session with geo/time context
      setSession((prev: ZeroTrustSession) => {
        const additionalRisk = Math.floor((geoRisk.overallGeoRisk + timeRisk.overallTimeRisk) / 4);
        const newRiskScore = Math.min(prev.riskScore + additionalRisk, 100);

        return {
          ...prev,
          geoRiskData: geoRisk,
          timeRiskData: timeRisk,
          riskScore: newRiskScore,
          riskLevel: calculateRiskLevel(newRiskScore),
          lastIpAddress: ip,
        };
      });
    } catch (error) {
      console.error('Geo-context update error:', error);
    }
  };

  /**
   * Phase 4: Add trust history entry
   */
  const addTrustHistoryEntry = (event?: string): void => {
    setSession((prev: ZeroTrustSession) => {
      const deviceTrust = deviceInfo?.trustScore || 0;
      const walletTrust = prev.walletRiskMetrics 
        ? Math.max(0, 100 - prev.walletRiskMetrics.overallScore)
        : 0;
      
      const entry: TrustHistoryEntry = {
        timestamp: new Date().toISOString(),
        deviceTrustScore: deviceTrust,
        walletTrustScore: walletTrust,
        combinedTrustScore: prev.combinedTrustScore,
        event,
      };

      return {
        ...prev,
        trustHistory: [...prev.trustHistory, entry].slice(-50), // Keep last 50 entries
      };
    });
  };

  /**
   * Phase 4: Get trust history
   */
  const getTrustHistory = (): TrustHistoryEntry[] => {
    return session.trustHistory;
  };

  /**
   * Phase 2: Monitor wallet connection changes
   */
  useEffect(() => {
    if (isConnected && walletAddress) {
      addSecurityEvent({
        type: 'device_change',
        severity: 'low',
        description: `Wallet connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        metadata: { walletAddress },
      });
      addTrustHistoryEntry('Wallet connected');
    } else if (!isConnected && session.walletAddress) {
      addSecurityEvent({
        type: 'device_change',
        severity: 'medium',
        description: 'Wallet disconnected',
        metadata: { previousWallet: session.walletAddress },
      });

      setSession((prev: ZeroTrustSession) => ({
        ...prev,
        walletAddress: null,
        walletRiskMetrics: null,
        walletAccessLevel: 'public',
        combinedTrustScore: Math.floor(prev.combinedTrustScore * 0.5), // Reduce trust when wallet disconnects
      }));
      addTrustHistoryEntry('Wallet disconnected');
    }
  }, [isConnected, walletAddress]);

  /**
   * Phase 4: Track trust score changes for history
   */
  useEffect(() => {
    if (session.combinedTrustScore > 0) {
      addTrustHistoryEntry();
    }
  }, [session.combinedTrustScore]);

  return (
    <ZeroTrustContext.Provider
      value={{
        session,
        deviceInfo,
        isLoading,
        registerDevice,
        addSecurityEvent,
        calculateRiskScore,
        requiresMFA,
        // Phase 2 methods
        updateWalletSecurity,
        getCombinedTrustScore,
        // Phase 4 methods
        updateGeoContext,
        getTrustHistory,
      }}
    >
      {children}
    </ZeroTrustContext.Provider>
  );
}

export function useZeroTrust(): ZeroTrustContextType {
  const context = useContext(ZeroTrustContext);
  if (context === undefined) {
    throw new Error('useZeroTrust must be used within ZeroTrustProvider');
  }
  return context;
}
