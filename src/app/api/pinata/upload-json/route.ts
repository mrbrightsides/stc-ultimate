import { NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const PINATA_JWT = process.env.PINATA_JWT || 'defe46eca26f7f1679ca';

export async function POST(request: Request): Promise<Response> {
  try {
    const { data, filename } = await request.json();

    if (!data || !filename) {
      return NextResponse.json(
        { success: false, message: 'Missing data or filename' },
        { status: 400 }
      );
    }

    // Initialize Pinata SDK
    const pinata = new PinataSDK({
      pinataJwt: PINATA_JWT,
    });

    // Upload JSON to Pinata
    const upload = await pinata.upload.json(data);

    const ipfsHash = upload.IpfsHash;
    const cid = upload.IpfsHash;
    const timestamp = Date.now();

    return NextResponse.json({
      success: true,
      ipfsHash,
      cid,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      pinataUrl: `https://pinata.cloud/ipfs/${ipfsHash}`,
      timestamp,
    });
  } catch (error) {
    console.error('Pinata upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
