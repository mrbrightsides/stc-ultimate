# STC Ultimate - Architecture Documentation

## System Architecture Overview

STC Ultimate menggunakan arsitektur modular berlapis yang memisahkan concerns antara UI, business logic, blockchain integration, dan IoT simulation.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  • Next.js 15 App Router                                    │
│  • React Server Components & Client Components              │
│  • Tailwind CSS Styling                                     │
│  • shadcn/ui Component Library                              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  • Package Builder      • Journey Dashboard                 │
│  • Analytics Dashboard  • QR Scanner                        │
│  • User Guide          • Ecosystem Showcase                 │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  • Milestone Escrow Manager                                 │
│  • Sequential IoT Engine                                    │
│  • Performance Metrics Engine                               │
│  • IPFS Proof Generator                                     │
│  • Dispute Resolution System                                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                           │
│  • Ethers.js Integration                                    │
│  • MetaMask Provider                                        │
│  • Sepolia Testnet                                          │
│  • Transaction Management                                   │
│  • Gas Cost Calculation                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   DATA LAYER                                 │
│  • IPFS Proof Storage                                       │
│  • Transaction Logs                                         │
│  • Performance Metrics                                      │
│  • CSV/JSON Export                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Breakdown

### 1. Destination Configuration (`destinations-config.ts`)

**Purpose**: Central configuration untuk semua destinations, pricing tiers, dan milestone structure.

**Key Components**:
```typescript
interface Destination {
  id: string;              // Unique identifier
  name: string;            // Display name
  description: string;     // Marketing description
  basePrice: string;       // ETH base price
  tier: "budget" | "standard" | "premium";
  highlights: string[];    // Key attractions
  milestones: Milestone[]; // 15 sequential milestones
}
```

**Pricing Logic**:
- Base price varies by destination (0.15 - 0.20 ETH)
- Duration multiplier:
  - 3 days: 1.0x - 1.0x
  - 5 days: 1.6x - 1.8x
  - 7 days: 2.1x - 2.5x
- Final price = basePrice × multiplier

---

### 2. Milestone Escrow Manager (`milestone-escrow.ts`)

**Purpose**: Manages blockchain transactions untuk escrow initialization dan milestone releases.

**Key Functions**:

#### `initializeEscrowBooking()`
```typescript
// Locks total funds in escrow
// Returns booking ID and transaction hash
const booking = await initializeEscrowBooking(
  userAddress,
  destination,
  totalAmount,
  milestones
);
```

#### `releaseMilestonePayment()`
```typescript
// Releases payment untuk specific milestone
// Triggered by IoT verification
const result = await releaseMilestonePayment(
  bookingId,
  milestoneIndex,
  iotProofHash
);
```

**Transaction Flow**:
1. User signs escrow initialization transaction
2. Funds locked in simulated contract
3. Each milestone trigger releases specific amount
4. Funds routed to appropriate vendor address
5. Transaction confirmed on Sepolia testnet

**Gas Calculation**:
```typescript
const gasUsed = BigNumber.from("21000"); // Base transfer
const gasPrice = BigNumber.from("30000000000"); // 30 Gwei
const gasCost = gasUsed.mul(gasPrice); // Total cost in wei
const gasCostETH = ethers.utils.formatEther(gasCost);
```

---

### 3. Sequential IoT Engine (`sequential-iot-engine.tsx`)

**Purpose**: Simulates IoT device triggers dan orchestrates sequential milestone execution.

**5-Stage Verification Process**:

```
Stage 1: DETECTING (5-8 seconds)
  └─ Scanning for IoT device (RFID/GPS/QR/Biometric)

Stage 2: VERIFYING (3-5 seconds)
  └─ Validating device signature and data integrity

Stage 3: BROADCASTING (2-4 seconds)
  └─ Sending transaction to Sepolia mempool

Stage 4: CONFIRMING (8-12 seconds)
  └─ Waiting for block confirmation

Stage 5: RELEASING (instant)
  └─ Escrow releases payment to vendor
```

**IoT Trigger Types**:
- **RFID**: Hotel key cards, access cards
- **GPS**: Location-based verification
- **QR**: Boarding passes, tickets, receipts
- **Biometric**: Fingerprint, facial recognition

**Demo Speed Modes**:
- **Instant**: 5 seconds per milestone (for presentations)
- **Real-time**: 30-40 seconds per milestone (realistic simulation)

---

### 4. IPFS Proof Generator (`ipfs-proof-generator.ts`)

**Purpose**: Generates CIDv1-compatible IPFS hashes untuk IoT verification proofs.

**Proof Structure**:
```typescript
interface IoTProof {
  timestamp: string;       // ISO timestamp
  milestoneId: string;     // Milestone identifier
  deviceType: string;      // RFID, GPS, QR, Biometric
  deviceId: string;        // Unique device ID
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  verificationData: {
    signature: string;     // Cryptographic signature
    confidence: number;    // 0.0 - 1.0
  };
  metadata: {
    vendor: string;
    service: string;
    amount: string;
  };
}
```

**Hash Generation**:
```typescript
// Creates SHA-256 hash
// Formats as CIDv1: bafybei...
const ipfsHash = await generateIPFSProof(proofData);
// Result: bafybeic3k4sygo4mfs3aruqx5r7h...
```

**Gateway URLs**:
- `https://ipfs.io/ipfs/{hash}`
- Publicly accessible untuk third-party verification

---

### 5. Performance Metrics Engine (`performance-metrics.ts`)

**Purpose**: Tracks gas costs, transaction timing, dan efficiency metrics.

**Key Metrics**:

#### Gas Analysis
```typescript
interface GasMetrics {
  totalGasUsed: string;        // Total gas units
  totalGasCost: string;        // ETH cost
  averageGasPerMilestone: string;
  gasPrice: string;            // 30 Gwei
}
```

#### Transaction Timing
```typescript
interface TimingMetrics {
  averageTime: number;         // Milliseconds
  fastestTransaction: number;  // Min time
  slowestTransaction: number;  // Max time
}
```

#### Efficiency Score
```typescript
// Calculated from:
// - Gas efficiency (lower is better)
// - Transaction speed (faster is better)
// - Success rate (higher is better)
const efficiency = calculateEfficiencyScore(metrics);
// Result: 0-100
```

#### Cost Comparison
```typescript
// Traditional payment processor: 3% fee
const traditionalCost = totalAmount * 0.03;

// Blockchain: actual gas cost
const blockchainCost = totalGasCost;

// Savings percentage
const savings = ((traditionalCost - blockchainCost) / traditionalCost) * 100;
// Typical result: 89% savings
```

---

### 6. Dispute Resolution System (`dispute-resolution.ts`)

**Purpose**: Handles failed milestones dan automatic refunds.

**Dispute Scenarios**:

#### Scenario 1: IoT Device Failure
```typescript
// Device tidak respond dalam timeout period
if (milestoneTimeout) {
  const refund = await calculatePartialRefund(
    remainingMilestones,
    totalAmount
  );
  await processRefund(userAddress, refund);
}
```

#### Scenario 2: Service Not Delivered
```typescript
// Vendor tidak provide service
if (serviceNotDelivered) {
  // Release untuk completed milestones
  // Refund untuk remaining milestones
  await handleDisputeResolution(bookingId, milestoneIndex);
}
```

**Refund Logic**:
```typescript
// Calculate proportional refund
const completedValue = completedMilestones.reduce(
  (sum, m) => sum + parseFloat(m.amount), 0
);
const refundAmount = totalAmount - completedValue;
```

---

## 🔄 Data Flow

### End-to-End Journey Flow

```
1. USER SELECTION
   ├─ Select destination (Bali)
   ├─ Select duration (5 days)
   └─ Select dates (Jan 15-19)
        ↓
2. PACKAGE CALCULATION
   ├─ Base price: 0.20 ETH
   ├─ Duration multiplier: 1.7x
   └─ Total: 0.34 ETH
        ↓
3. ESCROW INITIALIZATION
   ├─ User signs MetaMask transaction
   ├─ Funds locked in escrow
   └─ Booking ID generated
        ↓
4. SEQUENTIAL MILESTONE EXECUTION
   ├─ Milestone 1: Departure Flight
   │   ├─ IoT: QR scan detected
   │   ├─ IPFS: Proof generated (bafybei...)
   │   ├─ Blockchain: Release 0.03 ETH
   │   └─ Vendor: Airline receives payment ✅
   │
   ├─ Milestone 2: Arrival Flight
   │   └─ (repeat process)
   │
   ├─ ... (13 more milestones)
   │
   └─ Milestone 15: Return Flight
       └─ Final payment released ✅
            ↓
5. JOURNEY COMPLETE
   ├─ All escrow distributed
   ├─ Analytics generated
   ├─ Audit trail exported
   └─ Success confirmation with QR
```

---

## 🔐 Security Considerations

### 1. Transaction Signing
- All blockchain transactions require MetaMask signature
- No private keys stored in application
- User maintains full custody of funds

### 2. Vendor Address Validation
- All vendor addresses use proper checksum format
- Validated before transaction broadcast
- Displayed to user for manual verification

### 3. IPFS Proof Integrity
- Each proof includes cryptographic signature
- Timestamp prevents replay attacks
- Immutable once generated

### 4. Escrow Safety
- Funds locked until IoT verification
- Sequential ordering prevents double-spending
- Dispute resolution for failed services

---

## 📊 Performance Characteristics

### Expected Performance (Sepolia Testnet)

```
Metric                          Value
─────────────────────────────────────────
Escrow Initialization Time      15-20s
Milestone Trigger Time          30-40s
Total Journey Time (15 steps)   8-10 min
Average Gas per Transaction     21,000
Average Gas Cost per Milestone  0.0003 ETH
Total Gas Cost (15 milestones)  0.0045 ETH
Block Confirmation Time         12-15s
IPFS Proof Generation Time      <1s
Analytics Calculation Time      <2s
```

### Scalability Considerations

**Current Implementation**:
- Sequential execution (one milestone at a time)
- Single user journey at a time
- Testnet limitations

**Production Scalability**:
- Parallel milestone execution where possible
- Multi-user concurrent booking support
- Mainnet optimization dengan gas price oracles
- Layer 2 integration for lower costs

---

## 🧪 Testing Architecture

### Unit Tests
```typescript
// Test escrow initialization
test('initializeEscrowBooking should lock funds', async () => {
  const booking = await initializeEscrowBooking(...);
  expect(booking.status).toBe('active');
});

// Test milestone release
test('releaseMilestonePayment should transfer to vendor', async () => {
  const result = await releaseMilestonePayment(...);
  expect(result.success).toBe(true);
});
```

### Integration Tests
```typescript
// Test full journey flow
test('complete journey should release all funds', async () => {
  // Initialize escrow
  const booking = await initializeEscrow(...);
  
  // Execute all 15 milestones
  for (let i = 0; i < 15; i++) {
    await executeMilestone(booking.id, i);
  }
  
  // Verify all funds distributed
  expect(booking.releasedAmount).toBe(booking.totalAmount);
});
```

### E2E Tests
```typescript
// Test with real MetaMask interaction
test('user can complete full booking flow', async () => {
  await page.goto('/');
  await selectDestination('Bali');
  await selectDuration(5);
  await initializeEscrow();
  await startJourney();
  // ... verify completion
});
```

---

## 🔧 Configuration

### Blockchain Configuration
```typescript
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/...',
  blockExplorer: 'https://sepolia.etherscan.io',
  gasPrice: '30000000000', // 30 Gwei
};
```

### IoT Configuration
```typescript
const IOT_CONFIG = {
  detectionTime: { min: 5000, max: 8000 },
  verificationTime: { min: 3000, max: 5000 },
  broadcastTime: { min: 2000, max: 4000 },
  confirmationTime: { min: 8000, max: 12000 },
};
```

### Demo Mode Configuration
```typescript
const DEMO_CONFIG = {
  instantMode: {
    totalDuration: 5000, // 5s per milestone
  },
  realTimeMode: {
    totalDuration: 35000, // 35s per milestone
  },
};
```

---

## 📚 Further Reading

- [Testing Guide](TESTING.md)
- [Documentation](README.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

**Last Updated**: 2025
**Version**: 1.0.0
