'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, X, Flashlight, FlashlightOff, RotateCcw } from 'lucide-react'

interface CameraQRScannerProps {
  onScanResult: (data: string) => void
  onClose: () => void
  isOpen: boolean
}

export function CameraQRScanner({ onScanResult, onClose, isOpen }: CameraQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanning, setScanning] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [hasFlashlight, setHasFlashlight] = useState<boolean>(false)
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false)
  const scanIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async (): Promise<void> => {
    try {
      setError('')
      
      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        
        // Check for flashlight capability
        const track = mediaStream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlashlight('torch' in capabilities)
        
        setScanning(true)
        startScanning()
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Unable to access camera. Please allow camera permissions.')
    }
  }

  const stopCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
    
    setScanning(false)
    setFlashlightOn(false)
  }

  const startScanning = (): void => {
    scanIntervalRef.current = setInterval(() => {
      scanForQRCode()
    }, 500) // Scan every 500ms
  }

  const scanForQRCode = (): void => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      context?.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // In a real implementation, you'd use a QR code detection library
      // For demo purposes, we'll simulate QR detection
      simulateQRDetection(canvas)
    }
  }

  const simulateQRDetection = (canvas: HTMLCanvasElement): void => {
    // This is a simulation - in production, use libraries like:
    // - jsQR
    // - qr-scanner
    // - @zxing/library
    
    // For demo, we'll randomly "detect" a QR code
    if (Math.random() < 0.1) { // 10% chance per scan
      const mockQRData = {
        serviceId: 'hotel_001',
        serviceName: 'Grand Hotel Check-in',
        merchantAddress: '0x742d35Cc6634C0532925a3b8D5cBFaC3',
        amount: '0.1',
        userId: 'user_123',
        timestamp: Date.now(),
        signature: 'secure_sig_123'
      }
      
      onScanResult(JSON.stringify(mockQRData))
      onClose()
    }
  }

  const toggleFlashlight = async (): Promise<void> => {
    if (!stream || !hasFlashlight) return

    try {
      const track = stream.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{ torch: !flashlightOn }]
      })
      setFlashlightOn(!flashlightOn)
    } catch (err) {
      console.error('Flashlight error:', err)
    }
  }

  const switchCamera = async (): Promise<void> => {
    stopCamera()
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-white" />
            <span className="text-white font-medium">Scan QR Code</span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasFlashlight && (
              <button
                onClick={toggleFlashlight}
                className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                {flashlightOn ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
              </button>
            )}
            
            <button
              onClick={switchCamera}
              className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className="text-center space-y-4 p-6">
            <div className="text-red-400 text-lg">{error}</div>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning Frame */}
                <div className="w-64 h-64 border-2 border-cyan-400 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>
                  
                  {/* Animated Scan Line */}
                  {scanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400 animate-pulse"></div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-white text-lg font-medium">Position QR code in the frame</div>
                  <div className="text-gray-300 text-sm mt-1">The code will be scanned automatically</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom Instructions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="text-center space-y-2">
          <div className="text-white text-sm">
            {scanning ? 'Scanning for QR codes...' : 'Camera initializing...'}
          </div>
          <div className="text-gray-400 text-xs">
            Make sure the QR code is well-lit and clearly visible
          </div>
        </div>
      </div>
    </div>
  )
}