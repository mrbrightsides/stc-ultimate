/**
 * Pinata IPFS Service
 * Real IPFS uploads via Pinata for proof storage and NFT metadata
 */

export interface PinataUploadResult {
  success: boolean;
  ipfsHash?: string;
  cid?: string;
  gatewayUrl?: string;
  pinataUrl?: string;
  timestamp?: number;
  error?: string;
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  [key: string]: unknown;
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadJSONToPinata(
  data: Record<string, unknown>,
  filename: string
): Promise<PinataUploadResult> {
  try {
    const response = await fetch('/api/pinata/upload-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        filename,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Pinata JSON upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadFileToPinata(
  file: File
): Promise<PinataUploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/pinata/upload-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Pinata file upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create NFT metadata and upload to IPFS
 */
export async function createNFTMetadata(
  metadata: IPFSMetadata
): Promise<PinataUploadResult> {
  try {
    const filename = `nft-metadata-${Date.now()}.json`;
    return await uploadJSONToPinata(metadata, filename);
  } catch (error) {
    console.error('NFT metadata creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload IoT proof to IPFS
 */
export async function uploadProofToIPFS(
  proofData: Record<string, unknown>
): Promise<PinataUploadResult> {
  try {
    const filename = `iot-proof-${Date.now()}.json`;
    return await uploadJSONToPinata(proofData, filename);
  } catch (error) {
    console.error('Proof upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get IPFS content via Pinata gateway
 */
export function getIPFSGatewayUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

/**
 * Generate ipfs:// URI from CID
 */
export function getIPFSUri(cid: string): string {
  return `ipfs://${cid}`;
}
