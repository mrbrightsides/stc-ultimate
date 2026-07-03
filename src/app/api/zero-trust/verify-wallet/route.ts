/**
 * Wallet Verification API - Phase 2 Zero Trust Security
 * Verifies wallet identity and stores security metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Address } from 'viem';

type WalletVerificationRequest = {
  address: Address;
  riskScore: number;
  transactionCount: number;
  accountAge: number;
};

type StoredWalletData = {
  address: Address;
  riskScore: number;
  transactionCount: number;
  accountAge: number;
  verifiedAt: string;
  lastSeen: string;
  accessCount: number;
  trusted: boolean;
  securityEvents: Array<{
    type: string;
    timestamp: string;
    description: string;
  }>;
};

// In-memory wallet store (replace with database in production)
const walletStore = new Map<Address, StoredWalletData>();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as WalletVerificationRequest;
    const { address, riskScore, transactionCount, accountAge } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const existingWallet = walletStore.get(address);

    if (existingWallet) {
      // Update existing wallet
      existingWallet.riskScore = riskScore;
      existingWallet.transactionCount = transactionCount;
      existingWallet.accountAge = accountAge;
      existingWallet.lastSeen = now;
      existingWallet.accessCount += 1;

      // Check for risk score changes
      const previousRisk = existingWallet.riskScore;
      if (Math.abs(previousRisk - riskScore) > 20) {
        existingWallet.securityEvents.push({
          type: 'risk_score_change',
          timestamp: now,
          description: `Risk score changed from ${previousRisk} to ${riskScore}`,
        });
      }

      // Update trust status
      existingWallet.trusted = riskScore < 50 && accountAge > 30;

      walletStore.set(address, existingWallet);

      return NextResponse.json({
        success: true,
        wallet: existingWallet,
        message: 'Wallet updated successfully',
      });
    }

    // Create new wallet entry
    const newWallet: StoredWalletData = {
      address,
      riskScore,
      transactionCount,
      accountAge,
      verifiedAt: now,
      lastSeen: now,
      accessCount: 1,
      trusted: riskScore < 50 && accountAge > 30,
      securityEvents: [
        {
          type: 'wallet_verified',
          timestamp: now,
          description: 'Wallet verified for the first time',
        },
      ],
    };

    walletStore.set(address, newWallet);

    return NextResponse.json({
      success: true,
      wallet: newWallet,
      message: 'Wallet verified successfully',
    });
  } catch (error) {
    console.error('Wallet verification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify wallet',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address') as Address | null;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address parameter required' },
        { status: 400 }
      );
    }

    const wallet = walletStore.get(address);

    if (!wallet) {
      return NextResponse.json(
        { verified: false, message: 'Wallet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verified: true,
      wallet,
    });
  } catch (error) {
    console.error('Wallet lookup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to lookup wallet',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
