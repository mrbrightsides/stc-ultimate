/**
 * Wallet Activity API - Phase 2 Zero Trust Security
 * Fetches wallet transaction history for analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

type WalletActivityRequest = {
  address: Address;
  limit?: number;
};

type Transaction = {
  hash: string;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  blockNumber: number;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as WalletActivityRequest;
    const { address, limit = 100 } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Create public client for Base chain
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Get current block number
    const currentBlock = await client.getBlockNumber();
    const startBlock = currentBlock - BigInt(10000); // Look back ~10k blocks (~5.5 hours on Base)

    // Fetch transaction history
    // Note: This is a simplified approach. In production, use a block explorer API
    // like Basescan API or The Graph for more comprehensive transaction data
    const transactions: Transaction[] = [];

    try {
      // Fetch recent blocks and filter for transactions involving this address
      // This is a basic implementation - production should use dedicated indexing service
      const blocks = [];
      const batchSize = 100;
      
      for (let i = 0; i < Math.min(limit / 10, 50); i++) {
        const blockNumber = currentBlock - BigInt(i * 20);
        if (blockNumber < startBlock) break;

        try {
          const block = await client.getBlock({ blockNumber, includeTransactions: true });
          blocks.push(block);
        } catch (error) {
          console.error(`Error fetching block ${blockNumber}:`, error);
        }
      }

      // Filter transactions involving the address
      for (const block of blocks) {
        if (!block.transactions) continue;

        for (const tx of block.transactions) {
          if (typeof tx === 'string') continue;

          const transaction = tx as {
            hash: `0x${string}`;
            from: Address;
            to: Address | null;
            value: bigint;
          };

          if (
            transaction.from.toLowerCase() === address.toLowerCase() ||
            (transaction.to && transaction.to.toLowerCase() === address.toLowerCase())
          ) {
            transactions.push({
              hash: transaction.hash,
              from: transaction.from,
              to: transaction.to || ('0x0000000000000000000000000000000000000000' as Address),
              value: transaction.value,
              timestamp: Number(block.timestamp) * 1000,
              blockNumber: Number(block.number),
            });

            if (transactions.length >= limit) break;
          }
        }

        if (transactions.length >= limit) break;
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Return empty array if fetching fails - prevents breaking the security analysis
    }

    // If no on-chain transactions found, generate mock data for demo purposes
    // Remove this in production
    if (transactions.length === 0) {
      const mockTransactions = generateMockTransactions(address, 20);
      return NextResponse.json({
        success: true,
        transactions: mockTransactions,
        count: mockTransactions.length,
        isMockData: true,
        message: 'Using mock transaction data for demo purposes',
      });
    }

    return NextResponse.json({
      success: true,
      transactions: transactions.map((tx: Transaction) => ({
        ...tx,
        value: tx.value.toString(), // Convert bigint to string for JSON
      })),
      count: transactions.length,
      isMockData: false,
    });
  } catch (error) {
    console.error('Wallet activity fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch wallet activity',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Generate mock transactions for demo purposes
 * Remove in production when using real blockchain data
 */
function generateMockTransactions(address: Address, count: number): Transaction[] {
  const now = Date.now();
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const timestamp = now - daysAgo * 24 * 60 * 60 * 1000;
    
    const isOutgoing = Math.random() > 0.5;
    const value = BigInt(Math.floor(Math.random() * 1000000000000000000)); // 0-1 ETH

    transactions.push({
      hash: `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}` as `0x${string}`,
      from: isOutgoing ? address : `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}` as Address,
      to: isOutgoing ? `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}` as Address : address,
      value,
      timestamp,
      blockNumber: 10000000 + i,
    });
  }

  return transactions.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);
}
