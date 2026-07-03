'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, Maximize, VolumeX, Volume2, Eye, X } from 'lucide-react'

interface VRPreviewData {
  destination: string
  previewUrl: string
  thumbnails: string[]
  duration: number
  description: string
  highlights: string[]
  type: '360' | 'standard' | 'drone'
}

interface VRDestinationPreviewProps {
  destination: string
  onClose?: () => void
}

export function VRDestinationPreview({ destination, onClose }: VRDestinationPreviewProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentPreview, setCurrentPreview] = useState<VRPreviewData | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sample VR preview data - in production, this would come from CDN/API
  const vrPreviewData: Record<string, VRPreviewData> = {
    'Bali': {
      destination: 'Bali, Indonesia',
      previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnails: [
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1570789210967-2cac73b0a338?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop'
      ],
      duration: 120,
      description: 'Experience the magical beauty of Bali through immersive 360° views. Explore ancient temples, pristine beaches, and lush rice terraces from the comfort of your home.',
      highlights: ['Ancient Temples', 'Pristine Beaches', 'Rice Terraces', 'Cultural Markets', 'Volcanic Landscapes'],
      type: '360'
    },
    'Tokyo': {
      destination: 'Tokyo, Japan',
      previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnails: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=400&h=300&fit=crop'
      ],
      duration: 150,
      description: 'Dive into the neon-lit streets of Tokyo with stunning 360° experiences. From bustling Shibuya crossings to serene traditional gardens.',
      highlights: ['Shibuya Crossing', 'Traditional Gardens', 'Neon Districts', 'Mount Fuji Views', 'Cultural Sites'],
      type: '360'
    },
    'Paris': {
      destination: 'Paris, France',
      previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnails: [
        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop'
      ],
      duration: 180,
      description: 'Walk through the romantic streets of Paris in stunning detail. Experience the Eiffel Tower, Louvre, and charming cafés like never before.',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River', 'Montmartre'],
      type: '360'
    }
  }

  useEffect(() => {
    const preview = vrPreviewData[destination]
    if (preview) {
      setCurrentPreview(preview)
    }
  }, [destination])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = (): void => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedData = (): void => {
      if (isPlaying) {
        video.play()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [isPlaying])

  const togglePlay = (): void => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = (): void => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const resetRotation = (): void => {
    setRotation(0)
  }

  const toggleFullscreen = (): void => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const video = videoRef.current
    if (!video || !currentPreview) return

    const time = (parseFloat(e.target.value) / 100) * currentPreview.duration
    video.currentTime = time
    setCurrentTime(time)
  }

  const closePreview = (): void => {
    setIsOpen(false)
    setIsPlaying(false)
    onClose?.()
  }

  if (!currentPreview) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200"
      >
        <Eye className="h-4 w-4" />
        Preview Destination
      </button>
    )
  }

  return (
    <>
      {/* Preview Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          <Eye className="h-4 w-4" />
          VR Preview - {currentPreview.destination}
        </button>
      )}

      {/* VR Preview Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div ref={containerRef} className="relative w-full h-full">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-white" />
                  <div>
                    <div className="text-white font-semibold">{currentPreview.destination}</div>
                    <div className="text-gray-300 text-sm">{currentPreview.type.toUpperCase()} Experience</div>
                  </div>
                </div>
                
                <button
                  onClick={closePreview}
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Video Container */}
            <div className="relative w-full h-full overflow-hidden">
              <video
                ref={videoRef}
                src={currentPreview.previewUrl}
                className="w-full h-full object-cover"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.5s ease'
                }}
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentPreview.duration > 0 ? (currentTime / currentPreview.duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-white text-sm mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentPreview.duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="text-white font-medium">{currentPreview.destination}</div>
                    <div className="text-gray-300 text-sm">360° Virtual Reality Preview</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRotation(rotation + 90)}
                      className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                      title="Rotate View"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel with Info */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-l border-gray-700 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3">About This Experience</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{currentPreview.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-white font-medium mb-3">Experience Highlights</h4>
                  <div className="space-y-2">
                    {currentPreview.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thumbnails */}
                <div>
                  <h4 className="text-white font-medium mb-3">Preview Gallery</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPreview.thumbnails.map((thumb, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={thumb} 
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VR Instructions */}
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-purple-400 font-medium mb-2">🥽 VR Mode Available</h4>
                  <p className="text-gray-300 text-xs">
                    For the best experience, use VR headset or mobile VR viewer. 
                    Move your device or drag to look around in 360°.
                  </p>
                </div>

                {/* Book Now CTA */}
                <button
                  onClick={closePreview}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all"
                >
                  Book This Destination
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}