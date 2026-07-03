/**
 * Geo-Context & Time-Based Risk Analyzer - Phase 4 Zero Trust Security
 * Advanced PIP (Policy Information Point) for location and temporal analysis
 */

import type { RiskLevel } from '@/contexts/zero-trust-context';

export type GeoRiskData = {
  ip: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  countryRiskScore: number; // 0-100
  vpnRiskScore: number; // 0-100
  overallGeoRisk: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: string[];
};

export type TimeRiskData = {
  accessHour: number; // 0-23
  accessDay: string;
  timezone: string;
  isUnusualHour: boolean;
  timezoneConsistent: boolean;
  hourRiskScore: number; // 0-100
  consistencyRiskScore: number; // 0-100
  overallTimeRisk: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: string[];
};

export type SessionBehaviorData = {
  sessionDuration: number; // seconds
  pageViewCount: number;
  clickRate: number; // clicks per minute
  typingSpeed: number; // chars per minute
  mouseMovementPattern: 'normal' | 'bot' | 'suspicious';
  behaviorRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: string[];
};

/**
 * High-risk countries based on cybersecurity threat index
 */
const HIGH_RISK_COUNTRIES: Record<string, number> = {
  'RU': 80, // Russia
  'CN': 70, // China
  'KP': 90, // North Korea
  'IR': 75, // Iran
  'VN': 60, // Vietnam
  'PK': 55, // Pakistan
  'NG': 65, // Nigeria
  'UA': 50, // Ukraine
  'BR': 45, // Brazil
  'IN': 40, // India
  'ID': 35, // Indonesia
};

/**
 * Low-risk countries (trusted regions)
 */
const LOW_RISK_COUNTRIES: Record<string, number> = {
  'US': 10, // United States
  'CA': 10, // Canada
  'GB': 15, // United Kingdom
  'AU': 15, // Australia
  'DE': 15, // Germany
  'FR': 15, // France
  'JP': 20, // Japan
  'SG': 20, // Singapore
  'NL': 15, // Netherlands
  'SE': 15, // Sweden
  'NO': 15, // Norway
  'DK': 15, // Denmark
  'FI': 15, // Finland
  'CH': 10, // Switzerland
};

/**
 * Calculate risk level from score
 */
function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

/**
 * Geo-Risk Analyzer
 */
export class GeoRiskAnalyzer {
  /**
   * Analyze geo-location risk
   */
  async analyzeGeoRisk(ip: string): Promise<GeoRiskData> {
    const riskFactors: string[] = [];
    let countryRiskScore = 50; // Default medium risk
    let vpnRiskScore = 0;

    try {
      // Fetch IP geolocation data
      const geoData = await this.fetchGeoLocation(ip);

      // Check country risk
      const countryCode = geoData.country_code || 'XX';
      if (HIGH_RISK_COUNTRIES[countryCode]) {
        countryRiskScore = HIGH_RISK_COUNTRIES[countryCode];
        riskFactors.push(`High-risk country: ${geoData.country}`);
      } else if (LOW_RISK_COUNTRIES[countryCode]) {
        countryRiskScore = LOW_RISK_COUNTRIES[countryCode];
      } else {
        countryRiskScore = 40; // Medium risk for unknown countries
        riskFactors.push('Unknown country risk profile');
      }

      // Check VPN/Proxy/Tor
      const isVPN = geoData.is_vpn || false;
      const isProxy = geoData.is_proxy || false;
      const isTor = geoData.is_tor || false;

      if (isVPN) {
        vpnRiskScore += 30;
        riskFactors.push('VPN detected');
      }
      if (isProxy) {
        vpnRiskScore += 40;
        riskFactors.push('Proxy server detected');
      }
      if (isTor) {
        vpnRiskScore += 60;
        riskFactors.push('Tor network detected');
      }

      const overallGeoRisk = Math.min(
        Math.floor((countryRiskScore + vpnRiskScore) / 2),
        100
      );

      return {
        ip,
        country: geoData.country || 'Unknown',
        city: geoData.city || 'Unknown',
        region: geoData.region || 'Unknown',
        timezone: geoData.timezone || 'Unknown',
        isVPN,
        isProxy,
        isTor,
        countryRiskScore,
        vpnRiskScore,
        overallGeoRisk,
        riskLevel: calculateRiskLevel(overallGeoRisk),
        riskFactors,
      };
    } catch (error) {
      console.error('Geo-risk analysis error:', error);
      
      return {
        ip,
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'Unknown',
        isVPN: false,
        isProxy: false,
        isTor: false,
        countryRiskScore: 50,
        vpnRiskScore: 0,
        overallGeoRisk: 50,
        riskLevel: 'medium',
        riskFactors: ['Geo-location lookup failed'],
      };
    }
  }

  /**
   * Fetch geo-location data from IP via proxy endpoint
   */
  private async fetchGeoLocation(ip: string): Promise<Record<string, unknown>> {
    try {
      // Use proxy endpoint for external API call (CSP compliance)
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'ip-api.com',
          path: `/json/${ip}?fields=status,country,countryCode,region,city,timezone,proxy,hosting`,
          method: 'GET',
          headers: {},
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error('Geo-location API failed');
      }

      const result = await response.json() as { body?: Record<string, unknown> };
      const data = result.body as Record<string, unknown>;

      if (!data || data.status === 'fail') {
        throw new Error('Invalid IP address or geo-location lookup failed');
      }

      return {
        country: data.country as string,
        country_code: data.countryCode as string,
        city: data.city as string,
        region: data.region as string,
        timezone: data.timezone as string,
        is_proxy: data.proxy as boolean,
        is_vpn: data.hosting as boolean, // hosting flag often indicates VPN/datacenter
        is_tor: false, // ip-api doesn't provide tor detection
      };
    } catch (error) {
      console.error('Geo-location fetch error:', error);
      throw error;
    }
  }

  /**
   * Analyze time-based risk
   */
  analyzeTimeRisk(
    userTimezone?: string,
    previousTimezone?: string
  ): TimeRiskData {
    const now = new Date();
    const hour = now.getHours();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const riskFactors: string[] = [];
    let hourRiskScore = 0;
    let consistencyRiskScore = 0;

    // Check unusual hours (2 AM - 5 AM local time)
    const isUnusualHour = hour >= 2 && hour <= 5;
    if (isUnusualHour) {
      hourRiskScore = 30;
      riskFactors.push(`Unusual access time: ${hour}:00 (late night/early morning)`);
    }

    // Check timezone consistency
    const timezoneConsistent = !userTimezone || !previousTimezone || userTimezone === previousTimezone;
    if (!timezoneConsistent) {
      consistencyRiskScore = 40;
      riskFactors.push(`Timezone changed: ${previousTimezone} → ${userTimezone}`);
    }

    // Weekend access (slightly lower risk)
    if (day === 'Saturday' || day === 'Sunday') {
      if (hour >= 8 && hour <= 22) {
        hourRiskScore = Math.max(0, hourRiskScore - 5);
      }
    }

    const overallTimeRisk = Math.min(hourRiskScore + consistencyRiskScore, 100);

    return {
      accessHour: hour,
      accessDay: day,
      timezone: userTimezone || currentTimezone,
      isUnusualHour,
      timezoneConsistent,
      hourRiskScore,
      consistencyRiskScore,
      overallTimeRisk,
      riskLevel: calculateRiskLevel(overallTimeRisk),
      riskFactors,
    };
  }

  /**
   * Analyze session behavior patterns
   */
  analyzeSessionBehavior(
    sessionData: {
      duration: number;
      pageViews: number;
      clicks: number;
      keystrokes: number;
      mouseMovements: number;
    }
  ): SessionBehaviorData {
    const riskFactors: string[] = [];
    let behaviorRiskScore = 0;

    // Calculate rates
    const durationMinutes = sessionData.duration / 60;
    const clickRate = durationMinutes > 0 ? sessionData.clicks / durationMinutes : 0;
    const typingSpeed = durationMinutes > 0 ? sessionData.keystrokes / durationMinutes : 0;

    // Detect bot-like behavior
    let mouseMovementPattern: 'normal' | 'bot' | 'suspicious' = 'normal';

    // Very high click rate (>100 clicks/min) - likely bot
    if (clickRate > 100) {
      behaviorRiskScore += 40;
      riskFactors.push('Extremely high click rate (bot-like behavior)');
      mouseMovementPattern = 'bot';
    }

    // Very low mouse movement - suspicious
    if (sessionData.mouseMovements < 10 && sessionData.clicks > 20) {
      behaviorRiskScore += 30;
      riskFactors.push('Low mouse movement despite high clicks');
      mouseMovementPattern = 'suspicious';
    }

    // Extremely fast typing (>500 chars/min) - copy-paste or bot
    if (typingSpeed > 500) {
      behaviorRiskScore += 25;
      riskFactors.push('Extremely fast typing speed');
    }

    // Very short session with many actions
    if (sessionData.duration < 10 && sessionData.pageViews > 5) {
      behaviorRiskScore += 20;
      riskFactors.push('Rapid page navigation');
    }

    // No interaction (potential passive scraping)
    if (sessionData.duration > 60 && sessionData.clicks === 0 && sessionData.keystrokes === 0) {
      behaviorRiskScore += 15;
      riskFactors.push('No user interaction detected');
    }

    return {
      sessionDuration: sessionData.duration,
      pageViewCount: sessionData.pageViews,
      clickRate,
      typingSpeed,
      mouseMovementPattern,
      behaviorRiskScore: Math.min(behaviorRiskScore, 100),
      riskLevel: calculateRiskLevel(behaviorRiskScore),
      riskFactors,
    };
  }
}

export const geoRiskAnalyzer = new GeoRiskAnalyzer();
