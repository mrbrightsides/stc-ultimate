import { NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const PINATA_JWT = process.env.PINATA_JWT || 'defe46eca26f7f1679ca';

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Initialize Pinata SDK
    const pinata = new PinataSDK({
      pinataJwt: PINATA_JWT,
    });

    // Upload file to Pinata
    const upload = await pinata.upload.file(file);

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
    console.error('Pinata file upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
