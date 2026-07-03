import { NextResponse, NextRequest } from "next/server";
import { geoRiskAnalyzer } from '@/lib/geo-risk-analyzer';

type RouteProtectionRule = {
  pattern: RegExp;
  minTrustLevel: 'low' | 'medium' | 'high';
  requiresAuth: boolean;
  geoRestriction?: string;
  allowedRoles?: string[];
  maxRiskScore?: number;
  requiresMFA?: boolean;
};

const protectionRules: RouteProtectionRule[] = [
  {
    pattern: /^\/api\/grpc\//,
    minTrustLevel: 'medium',
    requiresAuth: true,
    maxRiskScore: 60,
  },
  {
    pattern: /^\/research/,
    minTrustLevel: 'medium',
    requiresAuth: false,
    maxRiskScore: 70,
  },
  {
    pattern: /^\/api\/zero-trust\//,
    minTrustLevel: 'low',
    requiresAuth: false,
  },
  {
    pattern: /^\/security-dashboard/,
    minTrustLevel: 'low',
    requiresAuth: false,
    maxRiskScore: 80,
  },
];

// Blocked countries (can be configured)
const BLOCKED_COUNTRIES: string[] = [
  // Add country codes here if you want to geo-block specific countries
  // Example: 'KP' for North Korea
];

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || request.ip 
    || '127.0.0.1';
}

function calculateRequestRiskScore(request: NextRequest): number {
  let riskScore = 0;

  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) {
    riskScore += 10;
  }

  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent || userAgent.length < 20) {
    riskScore += 15;
  }

  const referer = request.headers.get('referer');
  if (!referer && request.method === 'POST') {
    riskScore += 5;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) {
    riskScore += 5;
  }

  return Math.min(riskScore, 100);
}

function getMatchedRule(pathname: string): RouteProtectionRule | null {
  return protectionRules.find(rule => rule.pattern.test(pathname)) || null;
}

export default async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const url = new URL("/api/logger", request.url);
  const requestId = crypto.randomUUID();
  const clientIp = getClientIp(request);
  const riskScore = calculateRequestRiskScore(request);

  try {
    await fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify({
        level: riskScore > 50 ? "warn" : "info",
        requestId,
        request: {
          url: request.url,
          method: request.method,
          path: request.nextUrl.pathname,
          referrerPolicy: request.referrerPolicy,
          clientIp,
          riskScore,
          headers: Object.fromEntries(request.headers.entries()),
          cookies: request.cookies.getAll().reduce((acc, cookie) => {
            acc[cookie.name] = cookie.value;
            return acc;
          }, {} as Record<string, string>),
        },
      }),
    });
  } catch (error) {
    console.error("Error logging request:", error);
  }

  const matchedRule = getMatchedRule(request.nextUrl.pathname);

  // Enhanced enforcement with rule-specific risk thresholds
  if (matchedRule) {
    const maxAllowedRisk = matchedRule.maxRiskScore || 70;
    
    if (riskScore > maxAllowedRisk) {
      return NextResponse.json(
        { 
          error: 'Access denied: Risk score exceeds threshold',
          riskScore,
          threshold: maxAllowedRisk,
          requestId,
          recommendation: 'Please register your device or connect a trusted wallet to reduce your risk score',
        },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next();

  response.headers.set("x-request-id", requestId);
  response.headers.set("x-risk-score", String(riskScore));
  response.headers.set("x-client-ip", clientIp);

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=()"
  );

  if (request.url.startsWith("https")) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.builder.io https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https: wss: ws:",
      "frame-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  if (!isApiRoute) {
    response.cookies.set("x-request-id", requestId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60,
      secure: request.url.startsWith("https"),
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/image|_next/static|api/logger|favicon.ico).*)"],
};
