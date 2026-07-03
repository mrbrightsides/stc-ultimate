'use client';

/**
 * IPFS Proof Generator for IoT Event Verification
 * Generates cryptographic hashes and uploads to real IPFS via Pinata
 */

import { uploadProofToIPFS } from './pinata-service';
import type { PinataUploadResult } from './pinata-service';

export interface IoTProofData {
  timestamp: number;
  deviceType: string; // RFID, GPS, QR, Biometric
  location: {
    lat: number;
    lng: number;
  };
  deviceId: string;
  serviceName: string;
  vendorAddress: string;
  userAddress: string;
  rawData: string;
}

export interface IPFSProof {
  ipfsHash: string;
  cid: string; // Content Identifier
  gatewayUrl: string;
  metadata: IoTProofData;
  generatedAt: number;
  signature: string;
  pinataUrl?: string;
  uploadResult?: PinataUploadResult;
}

/**
 * Generate IPFS-compatible hash for IoT proof
 */
export function generateIPFSHash(proofData: IoTProofData): string {
  // Simulate CIDv1 format: base58btc encoding
  // Real implementation would use ipfs-core-types
  const timestamp = proofData.timestamp.toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const deviceHash = btoa(proofData.deviceType).substring(0, 8);
  
  // CIDv1 format: Qm + base58 encoded hash (46 chars total)
  return `Qm${timestamp}${random}${deviceHash}`.padEnd(46, Math.random().toString(36).substring(2, 3));
}

/**
 * Generate complete IPFS proof with metadata
 */
export function createIPFSProof(
  deviceType: string,
  serviceName: string,
  vendorAddress: string,
  userAddress: string
): IPFSProof {
  const timestamp = Date.now();
  
  // Simulate location data (in production, would come from actual GPS)
  const locations: Record<string, { lat: number; lng: number }> = {
    'Bali': { lat: -8.3405, lng: 115.0920 },
    'Yogyakarta': { lat: -7.7956, lng: 110.3695 },
    'Jakarta': { lat: -6.2088, lng: 106.8456 },
    'Lombok': { lat: -8.6529, lng: 116.3247 },
  };
  
  const proofData: IoTProofData = {
    timestamp,
    deviceType,
    location: locations['Bali'], // Default to Bali for demo
    deviceId: `DEV-${deviceType}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    serviceName,
    vendorAddress,
    userAddress,
    rawData: btoa(JSON.stringify({
      device: deviceType,
      service: serviceName,
      verified: true,
      timestamp,
    })),
  };
  
  const ipfsHash = generateIPFSHash(proofData);
  
  // Generate cryptographic signature (simulated)
  const signature = `0x${Array.from({ length: 130 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
  
  return {
    ipfsHash,
    cid: ipfsHash,
    gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
    metadata: proofData,
    generatedAt: timestamp,
    signature,
  };
}

/**
 * Verify IPFS proof integrity
 */
export function verifyIPFSProof(proof: IPFSProof): boolean {
  // Simulate verification (in production, would verify signature and hash)
  const recomputedHash = generateIPFSHash(proof.metadata);
  return recomputedHash === proof.ipfsHash;
}

/**
 * Export proof to JSON for audit trail
 */
export function exportProofToJSON(proof: IPFSProof): string {
  return JSON.stringify(proof, null, 2);
}

/**
 * Generate batch proofs for multiple milestones
 */
export function generateBatchProofs(
  milestones: Array<{
    deviceType: string;
    serviceName: string;
    vendorAddress: string;
  }>,
  userAddress: string
): IPFSProof[] {
  return milestones.map(milestone =>
    createIPFSProof(
      milestone.deviceType,
      milestone.serviceName,
      milestone.vendorAddress,
      userAddress
    )
  );
}

/**
 * Upload IoT proof to real IPFS via Pinata
 * This function creates a proof and uploads it to IPFS
 */
export async function uploadProofToRealIPFS(
  deviceType: string,
  serviceName: string,
  vendorAddress: string,
  userAddress: string
): Promise<IPFSProof> {
  const timestamp = Date.now();
  
  // Simulate location data (in production, would come from actual GPS)
  const locations: Record<string, { lat: number; lng: number }> = {
    'Bali': { lat: -8.3405, lng: 115.0920 },
    'Yogyakarta': { lat: -7.7956, lng: 110.3695 },
    'Jakarta': { lat: -6.2088, lng: 106.8456 },
    'Lombok': { lat: -8.6529, lng: 116.3247 },
  };
  
  const proofData: IoTProofData = {
    timestamp,
    deviceType,
    location: locations['Bali'], // Default to Bali for demo
    deviceId: `DEV-${deviceType}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    serviceName,
    vendorAddress,
    userAddress,
    rawData: btoa(JSON.stringify({
      device: deviceType,
      service: serviceName,
      verified: true,
      timestamp,
    })),
  };
  
  // Generate cryptographic signature (simulated)
  const signature = `0x${Array.from({ length: 130 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
  
  // Upload to real IPFS via Pinata
  const uploadResult = await uploadProofToIPFS(proofData);
  
  if (uploadResult.success && uploadResult.ipfsHash) {
    return {
      ipfsHash: uploadResult.ipfsHash,
      cid: uploadResult.cid || uploadResult.ipfsHash,
      gatewayUrl: uploadResult.gatewayUrl || `https://gateway.pinata.cloud/ipfs/${uploadResult.ipfsHash}`,
      pinataUrl: uploadResult.pinataUrl,
      metadata: proofData,
      generatedAt: timestamp,
      signature,
      uploadResult,
    };
  } else {
    // Fallback to simulated hash if upload fails
    const ipfsHash = generateIPFSHash(proofData);
    return {
      ipfsHash,
      cid: ipfsHash,
      gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
      metadata: proofData,
      generatedAt: timestamp,
      signature,
      uploadResult,
    };
  }
}

/**
 * Batch upload multiple proofs to real IPFS
 */
export async function uploadBatchProofsToIPFS(
  milestones: Array<{
    deviceType: string;
    serviceName: string;
    vendorAddress: string;
  }>,
  userAddress: string
): Promise<IPFSProof[]> {
  const uploadPromises = milestones.map(milestone =>
    uploadProofToRealIPFS(
      milestone.deviceType,
      milestone.serviceName,
      milestone.vendorAddress,
      userAddress
    )
  );
  
  return await Promise.all(uploadPromises);
}
