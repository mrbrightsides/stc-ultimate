'use client';

import type { MNEEPayment } from './mnee-token';
import type { TourEscrow } from './tour-escrow-contract';
import type { RevenueSplit, SplitRecipient } from './revenue-split-contract';
import { EscrowStatus } from './tour-escrow-contract';
import { SplitStatus } from './revenue-split-contract';

// ========================================
// MOCK DATA GENERATOR FOR DEMO
// For MNEE Hackathon - Overpopulated Data
// ========================================

// Realistic service names for tourism
const SERVICE_NAMES = [
  // Hotels
  'Grand Bali Resort & Spa',
  'Tokyo Luxury Suites',
  'Paris Boutique Hotel',
  'Dubai Marina View Hotel',
  'New York Manhattan Hotel',
  'London Thames Hotel',
  'Singapore Marina Bay Hotel',
  'Hong Kong Harbor Hotel',
  'Sydney Opera View Hotel',
  'Rome Colosseum Hotel',
  
  // Tours
  'Bali Cultural Heritage Tour',
  'Tokyo Mt. Fuji Day Trip',
  'Paris City Lights Tour',
  'Dubai Desert Safari',
  'NYC Statue of Liberty Tour',
  'London Big Ben Walking Tour',
  'Singapore Gardens Tour',
  'Hong Kong Island Tour',
  'Sydney Harbor Cruise',
  'Rome Ancient City Tour',
  
  // Activities
  'Bali Surfing Lessons',
  'Tokyo Sushi Making Class',
  'Paris Wine Tasting',
  'Dubai Skydiving Experience',
  'NYC Broadway Show',
  'London Eye Ride',
  'Singapore Night Safari',
  'Hong Kong Peak Tram',
  'Sydney Beach Diving',
  'Rome Cooking Class',
  
  // Packages
  '5-Day Bali Adventure Package',
  '7-Day Tokyo Explorer Package',
  '3-Day Paris Romance Package',
  '4-Day Dubai Luxury Package',
  'Weekend NYC Shopping Tour',
  'London Historical 3-Day Tour',
  'Singapore Food Safari',
  'Hong Kong Shopping Spree',
  'Sydney Coastal 5-Day Package',
  'Rome Historical 4-Day Tour',
];

// Wallet addresses for demo
const DEMO_ADDRESSES = {
  tourists: [
    '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf',
    '0x8ba1f109551bd432803012645aac136c6d2d9b59',
    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
  ],
  operators: [
    '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    '0x976ea74026e726554db657fa54763abd0c3a0aa9',
    '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
    '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
    '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
  ],
  platform: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf',
  treasury: '0x8ba1f109551bd432803012645aac136c6d2d9b59',
};

// Generate random date within last N days
function randomDate(daysBack: number): number {
  const now = Date.now();
  const daysInMs = daysBack * 24 * 60 * 60 * 1000;
  return now - Math.floor(Math.random() * daysInMs);
}

// Generate random amount between min and max
function randomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Generate random tx hash
function randomTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Generate random block number
function randomBlockNumber(): number {
  return 18000000 + Math.floor(Math.random() * 1000000);
}

// Random selection helper
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate overpopulated MNEE payments (100+ transactions)
 */
export function generateMockMNEEPayments(count: number = 120): MNEEPayment[] {
  const payments: MNEEPayment[] = [];
  const types: Array<MNEEPayment['type']> = ['booking', 'split', 'escrow_release', 'refund'];
  const statuses: Array<MNEEPayment['status']> = ['confirmed', 'confirmed', 'confirmed', 'pending']; // 75% confirmed

  for (let i = 0; i < count; i++) {
    const type = randomItem(types);
    const amount = randomAmount(50, 5000);
    const timestamp = randomDate(90); // Last 90 days
    const from = randomItem(DEMO_ADDRESSES.tourists);
    const to = randomItem(DEMO_ADDRESSES.operators);
    const status = randomItem(statuses);
    const serviceName = randomItem(SERVICE_NAMES);

    const payment: MNEEPayment = {
      type,
      txHash: randomTxHash(),
      from,
      to,
      amount,
      usdValue: amount, // 1:1 peg
      timestamp,
      blockNumber: randomBlockNumber(),
      gasUsed: (21000 + Math.floor(Math.random() * 100000)).toString(),
      status,
      metadata: {
        serviceId: i + 1,
        serviceName,
        escrowId: `ESC-${i + 1}`,
      },
    };

    payments.push(payment);
  }

  // Sort by timestamp (newest first)
  return payments.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Generate overpopulated tour escrows (50+ bookings)
 */
export function generateMockTourEscrows(count: number = 75): TourEscrow[] {
  const escrows: TourEscrow[] = [];
  const statuses = [
    EscrowStatus.PENDING,
    EscrowStatus.VERIFIED,
    EscrowStatus.RELEASED,
    EscrowStatus.RELEASED, // More released for demo
    EscrowStatus.RELEASED,
    EscrowStatus.REFUNDED,
  ];

  for (let i = 0; i < count; i++) {
    const status = randomItem(statuses);
    const amount = randomAmount(100, 5000);
    const createdAt = randomDate(90);
    const tourist = randomItem(DEMO_ADDRESSES.tourists);
    const operator = randomItem(DEMO_ADDRESSES.operators);
    const serviceName = randomItem(SERVICE_NAMES);

    const statusTexts: Record<EscrowStatus, string> = {
      [EscrowStatus.PENDING]: 'Pending',
      [EscrowStatus.VERIFIED]: 'Verified',
      [EscrowStatus.RELEASED]: 'Released',
      [EscrowStatus.REFUNDED]: 'Refunded',
      [EscrowStatus.DISPUTED]: 'Disputed',
    };

    const escrow: TourEscrow = {
      escrowId: `ESC-${1000 + i}`,
      tourist,
      operator,
      amount,
      amountUSD: amount,
      status,
      statusText: statusTexts[status],
      createdAt,
      serviceId: `SRV-${i + 1}`,
      serviceName,
      tokenAddress: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
      txHash: randomTxHash(),
      releaseTxHash: status === EscrowStatus.RELEASED ? randomTxHash() : undefined,
      refundTxHash: status === EscrowStatus.REFUNDED ? randomTxHash() : undefined,
    };

    escrows.push(escrow);
  }

  // Sort by createdAt (newest first)
  return escrows.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Generate overpopulated revenue splits (50+ distributions)
 */
export function generateMockRevenueSplits(count: number = 70): RevenueSplit[] {
  const splits: RevenueSplit[] = [];
  const statuses = [SplitStatus.PENDING, SplitStatus.EXECUTED, SplitStatus.EXECUTED, SplitStatus.EXECUTED]; // 75% executed

  const splitTypes = [
    { name: 'hotelBooking', splits: [70, 15, 10, 5], roles: ['Hotel', 'Tour Guide', 'Platform', 'Treasury'] },
    { name: 'tourPackage', splits: [60, 20, 12, 8], roles: ['Tour Operator', 'Guide', 'Platform', 'Treasury'] },
    { name: 'activityBooking', splits: [75, 10, 10, 5], roles: ['Provider', 'Coordinator', 'Platform', 'Treasury'] },
  ];

  for (let i = 0; i < count; i++) {
    const status = randomItem(statuses);
    const totalAmount = randomAmount(200, 5000);
    const createdAt = randomDate(90);
    const creator = randomItem(DEMO_ADDRESSES.tourists);
    const splitType = randomItem(splitTypes);
    const serviceName = randomItem(SERVICE_NAMES);

    // Generate recipients based on split type
    const recipients: SplitRecipient[] = [];
    const addresses = [
      randomItem(DEMO_ADDRESSES.operators),
      randomItem(DEMO_ADDRESSES.operators),
      DEMO_ADDRESSES.platform,
      DEMO_ADDRESSES.treasury,
    ];

    splitType.splits.forEach((percentage, idx) => {
      const amount = ((parseFloat(totalAmount) * percentage) / 100).toFixed(2);
      recipients.push({
        address: addresses[idx],
        name: splitType.roles[idx],
        role: splitType.roles[idx],
        percentage,
        amount,
        amountUSD: amount,
      });
    });

    const split: RevenueSplit = {
      splitId: `SPL-${2000 + i}`,
      bookingId: `BK-${i + 1}`,
      creator,
      totalAmount,
      totalAmountUSD: totalAmount,
      recipients,
      status,
      statusText: status === SplitStatus.EXECUTED ? 'Executed' : 'Pending',
      createdAt,
      executedAt: status === SplitStatus.EXECUTED ? createdAt + 60000 : undefined, // 1 min after creation
      txHash: randomTxHash(),
      executeTxHash: status === SplitStatus.EXECUTED ? randomTxHash() : undefined,
    };

    splits.push(split);
  }

  // Sort by createdAt (newest first)
  return splits.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Populate localStorage with mock data
 */
export function populateMockData(options?: {
  payments?: number;
  escrows?: number;
  splits?: number;
}): {
  paymentsGenerated: number;
  escrowsGenerated: number;
  splitsGenerated: number;
  totalVolume: string;
} {
  const paymentCount = options?.payments || 120;
  const escrowCount = options?.escrows || 75;
  const splitCount = options?.splits || 70;

  // Generate mock data
  const payments = generateMockMNEEPayments(paymentCount);
  const escrows = generateMockTourEscrows(escrowCount);
  const splits = generateMockRevenueSplits(splitCount);

  // Save to localStorage
  localStorage.setItem('mnee_payments', JSON.stringify(payments));
  localStorage.setItem('tour_escrows', JSON.stringify(escrows));
  localStorage.setItem('revenue_splits', JSON.stringify(splits));

  // Calculate total volume
  const totalVolume = escrows.reduce((sum, e) => sum + parseFloat(e.amountUSD), 0);

  console.log('🎉 Mock data populated successfully!');
  console.log(`📊 Generated: ${paymentCount} payments, ${escrowCount} escrows, ${splitCount} splits`);
  console.log(`💰 Total volume: $${totalVolume.toFixed(2)}`);

  return {
    paymentsGenerated: payments.length,
    escrowsGenerated: escrows.length,
    splitsGenerated: splits.length,
    totalVolume: totalVolume.toFixed(2),
  };
}

/**
 * Clear all mock data from localStorage
 */
export function clearMockData(): void {
  localStorage.removeItem('mnee_payments');
  localStorage.removeItem('tour_escrows');
  localStorage.removeItem('revenue_splits');
  console.log('🗑️ Mock data cleared!');
}

/**
 * Get current mock data stats
 */
export function getMockDataStats(): {
  payments: number;
  escrows: number;
  splits: number;
  totalVolume: string;
  isEmpty: boolean;
} {
  try {
    const payments = JSON.parse(localStorage.getItem('mnee_payments') || '[]');
    const escrows = JSON.parse(localStorage.getItem('tour_escrows') || '[]');
    const splits = JSON.parse(localStorage.getItem('revenue_splits') || '[]');

    const totalVolume = escrows.reduce(
      (sum: number, e: TourEscrow) => sum + parseFloat(e.amountUSD),
      0
    );

    return {
      payments: payments.length,
      escrows: escrows.length,
      splits: splits.length,
      totalVolume: totalVolume.toFixed(2),
      isEmpty: payments.length === 0 && escrows.length === 0 && splits.length === 0,
    };
  } catch (error) {
    return {
      payments: 0,
      escrows: 0,
      splits: 0,
      totalVolume: '0.00',
      isEmpty: true,
    };
  }
}
