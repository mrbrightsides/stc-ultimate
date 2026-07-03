import { NextRequest, NextResponse } from 'next/server';

type IpCheckRequest = {
  fingerprint: string;
};

type IpRecord = {
  fingerprint: string;
  ipAddress: string;
  lastSeen: string;
  accessCount: number;
};

const ipStore = new Map<string, IpRecord>();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as IpCheckRequest;
    const { fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    const currentIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || request.ip 
      || '127.0.0.1';

    const existingRecord = ipStore.get(fingerprint);

    if (existingRecord) {
      const ipChanged = existingRecord.ipAddress !== currentIp;
      
      existingRecord.lastSeen = new Date().toISOString();
      existingRecord.accessCount += 1;
      
      if (ipChanged) {
        const previousIp = existingRecord.ipAddress;
        existingRecord.ipAddress = currentIp;
        ipStore.set(fingerprint, existingRecord);

        return NextResponse.json({
          ipChanged: true,
          previousIp,
          currentIp,
          message: 'IP address changed',
        });
      }

      ipStore.set(fingerprint, existingRecord);

      return NextResponse.json({
        ipChanged: false,
        currentIp,
        message: 'IP address unchanged',
      });
    }

    const newRecord: IpRecord = {
      fingerprint,
      ipAddress: currentIp,
      lastSeen: new Date().toISOString(),
      accessCount: 1,
    };

    ipStore.set(fingerprint, newRecord);

    return NextResponse.json({
      ipChanged: false,
      currentIp,
      message: 'First IP record created',
    });
  } catch (error) {
    console.error('IP check error:', error);
    return NextResponse.json(
      { error: 'Failed to check IP', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
