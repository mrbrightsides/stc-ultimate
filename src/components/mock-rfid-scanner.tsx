'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Nfc, Check, Loader2, Wifi } from 'lucide-react'

interface MockRFIDScannerProps {
  onScanned: () => void
  locationName?: string
}

export function MockRFIDScanner({ onScanned, locationName = 'Location' }: MockRFIDScannerProps): React.JSX.Element {
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isScanned, setIsScanned] = useState<boolean>(false)

  const handleScan = async (): Promise<void> => {
    setIsScanning(true)

    // Simulate RFID scan (1.8 seconds)
    await new Promise(resolve => setTimeout(resolve, 1800))

    // Mock RFID data - always success
    const mockRFIDData = {
      scanned: true,
      tagId: `RFID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      frequency: '13.56 MHz', // NFC frequency
      type: ['NFC Type A', 'NFC Type B', 'MIFARE Classic'][Math.floor(Math.random() * 3)],
      signalStrength: Math.floor(Math.random() * 20) + 80, // 80-99%
      timestamp: new Date().toISOString(),
      location: locationName
    }

    console.log('Mock RFID Data:', mockRFIDData)

    setIsScanned(true)
    setIsScanning(false)

    // Callback to parent
    setTimeout(() => {
      onScanned()
    }, 500)
  }

  if (isScanned) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500 p-2">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900">✓ RFID Tag Terscan</p>
              <p className="text-sm text-green-700">Access card validated successfully</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-500 bg-purple-50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Nfc className="h-6 w-6 text-purple-600 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-purple-900 mb-1">
              📡 Milestone ini memerlukan scan RFID/NFC
            </p>
            <p className="text-sm text-purple-700 mb-3">
              Tap kartu akses atau device NFC untuk melanjutkan
            </p>

            {!isScanning ? (
              <Button
                onClick={handleScan}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Nfc className="mr-2 h-4 w-4" />
                Scan RFID Tag
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-700">
                  <Wifi className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-medium">Scanning RFID/NFC tag...</span>
                </div>
                <div className="bg-purple-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-purple-600 text-center">
                  Waiting for tag detection...
                </p>
              </div>
            )}
          </div>
        </div>

        {isScanning && (
          <div className="mt-3 p-3 bg-white rounded border border-purple-200 space-y-2">
            <div>
              <p className="text-xs text-gray-600">Frequency:</p>
              <p className="text-sm font-medium text-gray-800">13.56 MHz (NFC)</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Searching for:</p>
              <p className="text-sm font-medium text-gray-800">MIFARE / NFC Type A/B</p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-purple-200">
          <p className="text-xs text-purple-600 flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Supported: MIFARE, NFC, ISO 14443A/B
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
