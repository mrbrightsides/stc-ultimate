# STC Ultimate - Developer Integration Guide

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production-Ready for Pilot Projects

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)
4. [API Reference](#api-reference)
5. [Smart Contract Integration](#smart-contract-integration)
6. [IoT Integration](#iot-integration)
7. [Authentication & Identity](#authentication--identity)
8. [Frontend Components](#frontend-components)
9. [Real-time Features](#real-time-features)
10. [Payment Integration](#payment-integration)
11. [Security Best Practices](#security-best-practices)
12. [Examples & Code Snippets](#examples--code-snippets)
13. [Troubleshooting](#troubleshooting)

---

## Introduction

Welcome to the **STC Ultimate Developer Guide**. This document provides comprehensive technical documentation for developers who want to:

- **Integrate** with STC Ultimate's blockchain-based tourism platform
- **Build** custom applications using our APIs and smart contracts
- **Extend** functionality with new modules or third-party services
- **Deploy** pilot projects (e.g., Pulau Penyengat heritage island)

### What is STC Ultimate?

STC Ultimate is a **Human Cyber-Physical System (HCPS)** for smart tourism, combining:

- ✅ **Blockchain** (Ethereum/Sepolia testnet, Base-ready)
- ✅ **IoT Sensors** (gRPC streaming for real-time data)
- ✅ **AI/ML** (Trip planning, recommendations)
- ✅ **Metaverse** (3D virtual tours, 360° panoramas, avatars)
- ✅ **DAO Governance** (Decentralized decision-making)
- ✅ **Digital Twin** (Real-time sync between physical and digital assets)

### Key Features for Developers

| Feature | Technology | Use Case |
|---------|-----------|----------|
| **Payments** | Smart Contracts (Solidity) | Escrow, milestone-based, instant settlement |
| **Real-time Data** | gRPC + Protocol Buffers | IoT sensor streams, analytics |
| **Identity** | SIWE (Sign-In with Ethereum) | Wallet-based authentication |
| **Data Export** | CSV, JSON, Markdown | Research, analytics, reports |
| **Cross-Chain** | Multi-chain bridge | Ethereum ↔ Base |
| **NFTs** | ERC-721 | Achievement badges, heritage passes |

---

## Architecture Overview

### System Layers (HCPS Framework)

```
┌─────────────────────────────────────────────┐
│  HUMAN LAYER (Tourists, SMEs, Researchers)  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  COLLABORATIVE LAYER (DAO, Multi-user)      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  CYBER LAYER (Blockchain, AI, Metaverse)    │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  PHYSICAL LAYER (IoT Sensors, Real Assets)  │
└─────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Shadcn/ui components

**Blockchain:**
- Ethers.js v5
- Solidity smart contracts
- Sepolia testnet (migration to Base planned)
- SIWE authentication

**Backend APIs:**
- Next.js API Routes (`/api/*`)
- gRPC for IoT streaming
- Protocol Buffers for serialization

**Database & Storage:**
- Blockchain ledger (immutable)
- IPFS for 3D assets (planned)
- Local state management (React Context)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (faucet: https://sepoliafaucet.com/)
- Basic knowledge of React, TypeScript, Solidity

### Installation

```bash
# Clone the repository (if open-sourced)
git clone https://github.com/your-org/stc-ultimate.git
cd stc-ultimate

# Install dependencies
npm install

# Set up environment variables (optional)
# No .env needed for testnet, but for production:
cp .env.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Project Structure

```
stc-ultimate/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/                # API routes
│   │   │   ├── proxy/          # External API proxy
│   │   │   ├── grpc/           # gRPC endpoints
│   │   │   ├── health/         # Health check
│   │   │   └── logger/         # Event logging
│   │   ├── page.tsx            # Main entry point
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── hcps/               # HCPS framework components
│   │   ├── tourism/            # Tourist journey components
│   │   ├── metaverse/          # 3D/VR components
│   │   ├── scada/              # IoT dashboard
│   │   └── ui/                 # Shadcn components
│   ├── lib/                    # Utilities & configs
│   │   ├── enhanced-smart-contracts.ts   # Payment strategies
│   │   ├── grpc-client.ts                # gRPC client
│   │   └── hcps-config.ts                # Framework config
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
├── public/                     # Static assets
└── package.json
```

---

## API Reference

### Base URL

```
Development: http://localhost:3000
Production: https://your-deployment.vercel.app
```

### Authentication

All API calls requiring wallet interaction must be made from the **client-side** with a connected Web3 wallet.

### Available Endpoints

#### 1. **Proxy Endpoint** (Client → External API)

**Endpoint:** `POST /api/proxy`

**Purpose:** Forward client requests to external APIs with CORS handling

**Request Body:**
```typescript
{
  protocol: 'https',           // Protocol (http/https)
  origin: 'api.example.com',   // API domain
  path: '/v1/data',            // Endpoint path
  method: 'POST',              // HTTP method
  headers: {                   // Request headers
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: {                      // Request payload (optional)
    key: 'value'
  }
}
```

**Response:**
```typescript
{
  data: any,        // Response data from external API
  status: number    // HTTP status code
}
```

**Example:**
```typescript
const response = await fetch('/api/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    protocol: 'https',
    origin: 'api.openweathermap.org',
    path: '/data/2.5/weather',
    method: 'GET',
    headers: {},
    body: { q: 'Bali', appid: 'YOUR_API_KEY' }
  })
});
const data = await response.json();
```

---

#### 2. **gRPC IoT Stream** (Real-time sensor data)

**Endpoint:** `GET /api/grpc/iot/stream`

**Purpose:** Real-time IoT sensor data streaming

**Query Parameters:**
- `destinationId` (optional): Filter by destination
- `sensorType` (optional): Filter by sensor type

**Response:** Server-Sent Events (SSE) stream

**Event Types:**
- `temperature`: Temperature readings
- `crowd_density`: Visitor count
- `energy`: Power consumption
- `alert`: Anomaly alerts

**Example:**
```typescript
const eventSource = new EventSource('/api/grpc/iot/stream?destinationId=bali');

eventSource.addEventListener('temperature', (event) => {
  const data = JSON.parse(event.data);
  console.log('Temperature:', data.value, data.unit);
});

eventSource.addEventListener('alert', (event) => {
  const alert = JSON.parse(event.data);
  console.log('Alert:', alert.message);
});
```

---

#### 3. **Health Check**

**Endpoint:** `GET /api/health`

**Purpose:** Check API status

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1703001234567,
  "services": {
    "blockchain": "connected",
    "grpc": "available",
    "database": "healthy"
  }
}
```

---

#### 4. **Location Verification**

**Endpoint:** `POST /api/verify-location`

**Purpose:** Verify user is at physical destination (for milestone unlock)

**Request Body:**
```typescript
{
  destinationId: string,
  userLocation: {
    latitude: number,
    longitude: number
  },
  accuracy: number  // GPS accuracy in meters
}
```

**Response:**
```typescript
{
  verified: boolean,
  distance: number,        // Distance from destination (meters)
  withinRadius: boolean
}
```

---

## Smart Contract Integration

### Network Configuration

**Current Network:** Sepolia Testnet

```typescript
const NETWORK_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia',
  rpc: 'https://sepolia.infura.io/v3/YOUR_KEY',
  explorerUrl: 'https://sepolia.etherscan.io'
};
```

**Future Network:** Base Mainnet (planned)

### Deployed Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **Tour Package Escrow** | `0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613` | Milestone-based payments |
| **My Tour Escrow** | `0xCAF91105884175585e22AceD113F00569547a229` | Event-triggered escrow |

### Payment Strategies

STC Ultimate uses a **multi-strategy payment system** with automatic fallback:

1. **Tour Package Escrow** (Primary)
   - Milestone-based escrow
   - Activity completion verification
   - Automatic fund release

2. **My Tour Escrow** (Secondary)
   - Event-triggered payments
   - IoT integration support

3. **Direct ETH Transfer** (Fallback)
   - Simple wallet-to-wallet transfer
   - Always available

### Integration Example

```typescript
import { PaymentManager } from '@/lib/enhanced-smart-contracts';
import { ethers } from 'ethers';

// Initialize payment manager
const paymentManager = new PaymentManager();

// Execute payment with automatic strategy selection
async function payForService() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  
  const userAddress = await provider.getSigner().getAddress();
  
  const result = await paymentManager.executePayment({
    serviceId: 1,                    // Service identifier
    serviceName: 'Hotel Booking',    // Human-readable name
    amount: '0.05',                  // Amount in ETH
    merchantAddress: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf',
    provider: provider,
    userAddress: userAddress
  });
  
  console.log('Payment successful!');
  console.log('Transaction hash:', result.txHash);
  console.log('Block number:', result.blockNumber);
  console.log('Strategy used:', result.strategy);
  console.log('View on Etherscan:', result.etherscanUrl);
}
```

### Smart Contract ABIs

ABIs are available in `src/app/types/contracts.ts`.

**Example ABI Usage:**
```typescript
import { TOUR_PACKAGE_ESCROW_ABI } from '@/app/types/contracts';
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613',
  TOUR_PACKAGE_ESCROW_ABI,
  provider
);

// Check if activity is completed
const isCompleted = await contract.activityStatus(0);

// Complete activity and release funds
const tx = await contract.completeActivity(0, {
  value: ethers.utils.parseEther('0.1'),
  gasLimit: 200000
});

await tx.wait();
```

---

## IoT Integration

### gRPC Protocol Buffers

STC Ultimate uses **gRPC** with **Protocol Buffers** for efficient IoT data streaming.

### Data Schema

```protobuf
message SensorReading {
  string sensor_id = 1;
  string destination_id = 2;
  string sensor_type = 3;      // "temperature", "crowd_density", "energy"
  double value = 4;
  string unit = 5;
  int64 timestamp = 6;
  map<string, string> metadata = 7;
}

message AlertEvent {
  string alert_id = 1;
  string destination_id = 2;
  string severity = 3;         // "info", "warning", "critical"
  string message = 4;
  int64 timestamp = 5;
}
```

### Streaming Integration

```typescript
import { useGrpcIoTStream } from '@/hooks/use-grpc-iot-stream';

function IoTDashboard() {
  const { 
    data,           // Latest sensor readings
    alerts,         // Alert events
    connected,      // Connection status
    error 
  } = useGrpcIoTStream({
    destinationId: 'pulau-penyengat',
    autoConnect: true
  });
  
  return (
    <div>
      <h2>Real-time IoT Data</h2>
      {data.map(sensor => (
        <div key={sensor.id}>
          {sensor.type}: {sensor.value} {sensor.unit}
        </div>
      ))}
      
      {alerts.map(alert => (
        <Alert severity={alert.severity}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}
```

### Mock Data for Testing

For development without physical IoT devices, use:

```typescript
import { generateMockSensorData } from '@/lib/grpc-iot-service';

const mockData = generateMockSensorData('bali');
// Returns simulated sensor readings for testing
```

---

## Authentication & Identity

### Sign-In with Ethereum (SIWE)

STC Ultimate uses **SIWE** for wallet-based authentication.

**Flow:**
1. User connects MetaMask
2. Sign message to prove ownership
3. Backend verifies signature
4. Session established

**Implementation:**
```typescript
import { SIWEProvider } from '@/contexts/siwe-context';

function App() {
  return (
    <SIWEProvider>
      <YourApp />
    </SIWEProvider>
  );
}

// In component
import { useSIWE } from '@/contexts/siwe-context';

function UserProfile() {
  const { address, signIn, signOut, isAuthenticated } = useSIWE();
  
  if (!isAuthenticated) {
    return <button onClick={signIn}>Connect Wallet</button>;
  }
  
  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={signOut}>Disconnect</button>
    </div>
  );
}
```

### Decentralized Identity (DID)

For enhanced features like **avatar persistence** and **cross-platform identity**, STC uses DID standards.

**Coming Soon:**
- W3C DID integration
- Verifiable credentials for tour guides
- NFT-based identity badges

---

## Frontend Components

### Pre-built UI Components

STC Ultimate provides ready-to-use components:

**Tourist Components:**
```typescript
import { JourneyDashboard } from '@/components/tourism/journey-dashboard';
import { AITripPlannerHub } from '@/components/trip-planner/ai-trip-planner-hub';
import { WalletConnector } from '@/components/tourism/wallet-connector';

<JourneyDashboard userId={address} />
<AITripPlannerHub />
<WalletConnector />
```

**SME Components:**
```typescript
import { AnalyticsDashboard } from '@/components/tourism/analytics-dashboard';
import { VirtualShowroom } from '@/components/metaverse/virtual-showroom';

<AnalyticsDashboard merchantId={merchantAddress} />
<VirtualShowroom items={products} />
```

**Researcher Components:**
```typescript
import { ResearchMetricsDashboard } from '@/components/research/research-metrics-dashboard';
import { ExportManager } from '@/components/export/export-manager';

<ResearchMetricsDashboard />
<ExportManager format="csv" />
```

### Component Library

All components use **Shadcn/ui** with **TailwindCSS**:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

---

## Real-time Features

### Collaboration Hub

Multi-user real-time collaboration for group trip planning:

```typescript
import { CollaborationHub } from '@/components/collaboration/collaboration-hub';

<CollaborationHub 
  sessionId="bali-2024-trip"
  onMessage={(msg) => console.log(msg)}
/>
```

**Features:**
- Real-time chat
- Shared itinerary editing
- Voting on activities
- Live cursor tracking (coming soon)

### Live Streaming

Virtual tour live streaming:

```typescript
import { LiveStreamingPanel } from '@/components/hcps/live-streaming-panel';

<LiveStreamingPanel 
  destinationId="tanah-lot"
  quality="hd"
/>
```

---

## Payment Integration

### IDRT & Digital Rupiah (Future)

**Status:** In planning for Pulau Penyengat pilot

**Integration Points:**
1. **IDRT Token Support**
   - ERC-20 standard
   - 1:1 peg with IDR
   - Cross-chain bridge for Base

2. **Bank Indonesia CBDC** (When available)
   - Retail CBDC integration
   - Smart contract-compatible
   - Instant settlement

**Preparation:**
```typescript
// Placeholder for future IDRT integration
interface IDRTPayment {
  amount: number;         // In IDR
  recipient: string;      // Wallet address
  smartContract: string;  // Payment processor
  metadata: {
    serviceType: string;
    destination: string;
  };
}
```

---

## Security Best Practices

### Smart Contract Safety

1. **Never expose private keys** in frontend code
2. **Validate all inputs** before sending transactions
3. **Use gas limits** to prevent runaway transactions
4. **Check contract addresses** before interaction

```typescript
// Always validate addresses
import { ethers } from 'ethers';

function isValidAddress(address: string): boolean {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
}
```

### API Security

1. **Proxy all external APIs** through `/api/proxy`
2. **Never expose API keys** client-side
3. **Rate limit** sensitive endpoints
4. **Validate origin** for CORS

### User Data

1. **No personal data on blockchain** (only wallet addresses)
2. **Encrypt sensitive data** before storage
3. **GDPR compliance** for EU users
4. **User consent** for data collection

---

## Examples & Code Snippets

### Complete Payment Flow

```typescript
import { useState } from 'react';
import { ethers } from 'ethers';
import { PaymentManager } from '@/lib/enhanced-smart-contracts';

export function PaymentButton({ serviceId, amount, merchant }: Props) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  async function handlePayment() {
    setLoading(true);
    
    try {
      // Connect wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Execute payment
      const paymentManager = new PaymentManager();
      const result = await paymentManager.executePayment({
        serviceId,
        serviceName: 'Hotel Booking',
        amount: amount.toString(),
        merchantAddress: merchant,
        provider,
        userAddress: address
      });
      
      setTxHash(result.txHash);
      alert(`Payment successful! Tx: ${result.txHash}`);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ${amount} ETH`}
    </button>
  );
}
```

### IoT Dashboard Integration

```typescript
import { useEffect, useState } from 'react';

export function LiveIoTMonitor({ destinationId }: { destinationId: string }) {
  const [sensorData, setSensorData] = useState<any[]>([]);
  
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/grpc/iot/stream?destinationId=${destinationId}`
    );
    
    eventSource.addEventListener('temperature', (event) => {
      const data = JSON.parse(event.data);
      setSensorData(prev => [...prev, data]);
    });
    
    eventSource.addEventListener('crowd_density', (event) => {
      const data = JSON.parse(event.data);
      console.log('Crowd density:', data.value);
    });
    
    return () => eventSource.close();
  }, [destinationId]);
  
  return (
    <div>
      <h3>Real-time Sensor Data</h3>
      {sensorData.map((reading, idx) => (
        <div key={idx}>
          {reading.type}: {reading.value} {reading.unit}
        </div>
      ))}
    </div>
  );
}
```

### Export Research Data

```typescript
import { ExportManager } from '@/components/export/export-manager';

export function ResearchTools() {
  const exportData = async () => {
    // Fetch blockchain transaction data
    const transactions = await fetchTransactionHistory();
    
    // Format as CSV
    const csv = transactions.map(tx => 
      `${tx.hash},${tx.from},${tx.to},${tx.value},${tx.timestamp}`
    ).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-data.csv';
    a.click();
  };
  
  return <button onClick={exportData}>Export Transactions</button>;
}
```

---

## Troubleshooting

### Common Issues

#### 1. **"Transaction Failed" Error**

**Cause:** Insufficient gas, wrong network, or contract not initialized

**Solution:**
```typescript
// Check network
const network = await provider.getNetwork();
if (network.chainId !== 11155111) {
  await switchToSepolia();
}

// Check balance
const balance = await signer.getBalance();
if (balance.lt(ethers.utils.parseEther('0.01'))) {
  alert('Insufficient balance. Get Sepolia ETH from faucet.');
}
```

#### 2. **gRPC Stream Disconnects**

**Cause:** Network timeout, server restart

**Solution:**
```typescript
// Implement reconnection logic
function useReconnectingStream(url: string) {
  useEffect(() => {
    let eventSource: EventSource;
    let reconnectTimer: NodeJS.Timeout;
    
    const connect = () => {
      eventSource = new EventSource(url);
      
      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimer = setTimeout(connect, 5000);
      };
    };
    
    connect();
    
    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimer);
    };
  }, [url]);
}
```

#### 3. **CORS Errors**

**Cause:** Direct fetch to external API

**Solution:** Always use `/api/proxy` endpoint

```typescript
// ❌ Wrong
fetch('https://api.external.com/data')

// ✅ Correct
fetch('/api/proxy', {
  method: 'POST',
  body: JSON.stringify({
    protocol: 'https',
    origin: 'api.external.com',
    path: '/data',
    method: 'GET',
    headers: {}
  })
})
```

---

## Support & Resources

### Documentation

- **HCPS Framework:** `/docs/hcps-framework.md`
- **FAQ:** `/docs/faq.md`
- **API Changelog:** `/docs/changelog.md`

### Community

- **GitHub Issues:** [Report bugs](https://github.com/your-org/stc-ultimate/issues)
- **Developer Forum:** [Ask questions](#)
- **Discord:** [Join community](#)

### Contact

For pilot project inquiries (Pulau Penyengat, Bintan):
- **Email:** dev@stc-ultimate.com
- **Project Lead:** [Your Name]

---

## Roadmap

### Q1 2024
- ✅ Sepolia testnet deployment
- ✅ HCPS framework documentation
- ✅ IoT simulation & real sensors
- ✅ Digital Twin integration docs

### Q2 2024
- 🔄 Base mainnet migration
- 🔄 IDRT integration
- 🔄 Pulau Penyengat pilot launch
- 🔄 Enhanced AI trip planner

### Q3 2024
- 📅 Bank Indonesia CBDC integration
- 📅 Multi-island expansion
- 📅 Mobile app (React Native)
- 📅 IPFS storage for 3D assets

### Q4 2024
- 📅 National tourism platform
- 📅 Government partnership
- 📅 International tourist onboarding
- 📅 Academic research portal

---

## License

STC Ultimate is released under **MIT License** for open-source contributions.

For commercial pilot projects, please contact for licensing terms.

---

**Built with ❤️ for sustainable, transparent, and community-first tourism in Indonesia.**

🌍 **From Research to Reality | From Dissertation to Deployment**
