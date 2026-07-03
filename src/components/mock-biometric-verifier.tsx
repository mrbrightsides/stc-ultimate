'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Fingerprint, Check, Loader2 } from 'lucide-react'

interface MockBiometricVerifierProps {
  onVerified: () => void
  userName?: string
}

export function MockBiometricVerifier({ onVerified, userName = 'User' }: MockBiometricVerifierProps): React.JSX.Element {
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  const handleVerify = async (): Promise<void> => {
    setIsVerifying(true)

    // Simulate biometric scan (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock verification result - always success
    const mockBiometricData = {
      verified: true,
      confidence: Math.floor(Math.random() * 10) + 90, // 90-99%
      method: ['fingerprint', 'face', 'iris'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
      userId: userName
    }

    console.log('Mock Biometric Data:', mockBiometricData)

    setIsVerified(true)
    setIsVerifying(false)

    // Callback to parent
    setTimeout(() => {
      onVerified()
    }, 500)
  }

  if (isVerified) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500 p-2">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900">✓ Identitas Terverifikasi</p>
              <p className="text-sm text-green-700">Biometric authentication successful</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-cyan-500 bg-cyan-50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Fingerprint className="h-6 w-6 text-cyan-600 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-cyan-900 mb-1">
              🔐 Milestone ini memerlukan verifikasi biometrik
            </p>
            <p className="text-sm text-cyan-700 mb-3">
              Silakan verifikasi identitas Anda untuk melanjutkan
            </p>

            {!isVerifying ? (
              <Button
                onClick={handleVerify}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Verify Identity
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-cyan-700">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Memverifikasi identitas biometrik...</span>
                </div>
                <div className="bg-cyan-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-600 h-full animate-pulse" style={{ width: '70%' }} />
                </div>
                <p className="text-xs text-cyan-600 text-center">
                  Scanning biometric data...
                </p>
              </div>
            )}
          </div>
        </div>

        {isVerifying && (
          <div className="mt-3 p-3 bg-white rounded border border-cyan-200">
            <p className="text-xs text-gray-600 mb-1">Verification Method:</p>
            <p className="text-sm font-medium text-gray-800">
              {['Fingerprint Scan', 'Face Recognition', 'Iris Scan'][Math.floor(Math.random() * 3)]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
