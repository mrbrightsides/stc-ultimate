'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Download, Share } from 'lucide-react'

interface QRCodeGeneratorProps {
  serviceId: string
  serviceName: string
  merchantAddress: string
  amount: string
  userId: string
  onScan?: (data: string) => void
}

export function QRCodeGenerator({ 
  serviceId, 
  serviceName, 
  merchantAddress, 
  amount, 
  userId, 
  onScan 
}: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<string>('')
  const [showQR, setShowQR] = useState<boolean>(false)
  
  useEffect(() => {
    // Generate secure QR data with service information
    const qrPayload = {
      serviceId,
      serviceName,
      merchantAddress,
      amount,
      userId,
      timestamp: Date.now(),
      signature: generateSecureSignature(serviceId, userId, amount)
    }
    
    setQrData(JSON.stringify(qrPayload))
  }, [serviceId, serviceName, merchantAddress, amount, userId])

  const generateSecureSignature = (serviceId: string, userId: string, amount: string): string => {
    // Simple signature for demo - in production use proper cryptographic signing
    const data = `${serviceId}-${userId}-${amount}-${Date.now()}`
    return btoa(data).slice(0, 16)
  }

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(qrData)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQR = (): void => {
    const svg = document.querySelector('.qr-code svg')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${serviceName.toLowerCase()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const shareQR = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `STC Service QR - ${serviceName}`,
          text: `Scan this QR code to activate your ${serviceName} service`,
          url: window.location.href
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Service QR Code</h3>
        <button
          onClick={() => setShowQR(!showQR)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all duration-200"
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
      </div>

      {showQR && (
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <div className="flex flex-col items-center space-y-4">
            {/* QR Code Display */}
            <div className="qr-code bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={qrData}
                size={200}
                bgColor="white"
                fgColor="black"
                level="M"
                includeMargin={true}
              />
            </div>

            {/* Service Info */}
            <div className="text-center space-y-2">
              <div className="text-white font-medium">{serviceName}</div>
              <div className="text-cyan-400">{amount} ETH</div>
              <div className="text-gray-400 text-sm">Merchant: {merchantAddress.slice(0, 8)}...</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Copy QR Data"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Download QR Code"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              
              <button
                onClick={shareQR}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Share QR Code"
              >
                <Share className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* QR Instructions */}
            <div className="text-center text-gray-400 text-sm max-w-xs">
              <p>Present this QR code to the merchant to activate your service and trigger automatic payment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}