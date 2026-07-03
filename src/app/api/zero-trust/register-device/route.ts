import { NextRequest, NextResponse } from 'next/server';

type DeviceRegistrationRequest = {
  fingerprint: string;
  confidence: number;
  components: Record<string, unknown>;
};

type StoredDevice = {
  fingerprint: string;
  confidence: number;
  registeredAt: string;
  lastSeen: string;
  accessCount: number;
  trusted: boolean;
};

const deviceStore = new Map<string, StoredDevice>();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as DeviceRegistrationRequest;
    const { fingerprint, confidence, components } = body;

    if (!fingerprint || typeof confidence !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: fingerprint and confidence' },
        { status: 400 }
      );
    }

    const existingDevice = deviceStore.get(fingerprint);
    
    if (existingDevice) {
      existingDevice.lastSeen = new Date().toISOString();
      existingDevice.accessCount += 1;
      existingDevice.trusted = true;
      deviceStore.set(fingerprint, existingDevice);

      return NextResponse.json({
        success: true,
        device: existingDevice,
        message: 'Device updated successfully',
      });
    }

    const newDevice: StoredDevice = {
      fingerprint,
      confidence,
      registeredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      accessCount: 1,
      trusted: confidence >= 0.85,
    };

    deviceStore.set(fingerprint, newDevice);

    return NextResponse.json({
      success: true,
      device: newDevice,
      message: 'Device registered successfully',
    });
  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register device', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get('fingerprint');

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Fingerprint parameter required' },
        { status: 400 }
      );
    }

    const device = deviceStore.get(fingerprint);

    if (!device) {
      return NextResponse.json(
        { registered: false, message: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      registered: true,
      device,
    });
  } catch (error) {
    console.error('Device lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup device', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
