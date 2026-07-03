'use client'

import { useEffect, useState } from 'react'

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface BeforeInstallPromptEvent extends Event {
  platforms: string[]
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState<boolean>(false)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = (): void => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')
      setIsStandalone(standalone)
      setIsInstalled(standalone)
    }

    checkStandalone()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = (): void => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('No install prompt available')
      return false
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }

  const getInstallInstructions = (): string => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
      return 'Chrome: Click the install button in the address bar or use the menu > Install STC Ultimate'
    } else if (userAgent.includes('firefox')) {
      return 'Firefox: Click the home screen icon in the address bar'
    } else if (userAgent.includes('safari')) {
      return 'Safari: Tap the share button and select "Add to Home Screen"'
    } else if (userAgent.includes('edge')) {
      return 'Edge: Click the install app button in the address bar'
    } else {
      return 'Look for an install or "Add to Home Screen" option in your browser menu'
    }
  }

  const getPWACapabilities = () => {
    return {
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      share: 'share' in navigator,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      storage: 'storage' in navigator && 'estimate' in navigator.storage,
      badgeAPI: 'setAppBadge' in navigator,
    }
  }

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    installPWA,
    getInstallInstructions,
    getPWACapabilities: getPWACapabilities()
  }
}

// PWA Install Prompt Component
export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installPWA, getInstallInstructions } = usePWA()
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [installing, setInstalling] = useState<boolean>(false)

  useEffect(() => {
    // Show prompt after user has been on the site for a while
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShowPrompt(true)
      }
    }, 30000) // Show after 30 seconds

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled])

  const handleInstall = async (): Promise<void> => {
    setInstalling(true)
    const success = await installPWA()
    
    if (success) {
      setShowPrompt(false)
    }
    
    setInstalling(false)
  }

  const handleDismiss = (): void => {
    setShowPrompt(false)
    // Remember user dismissed for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if user already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed') || !showPrompt || !isInstallable || isInstalled) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-gradient-to-r from-cyan-900/95 to-blue-900/95 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7L12 2zm0 2.5L19.5 9H4.5L12 4.5zM4 11h16v8H4v-8z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">Install STC Ultimate</h3>
            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              Get the full app experience with offline access, notifications, and faster loading.
            </p>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-cyan-700 hover:to-cyan-600 disabled:opacity-50 transition-all duration-200"
              >
                {installing ? 'Installing...' : 'Install'}
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-300 hover:text-white text-xs transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// PWA Status Component for Settings
export function PWAStatus() {
  const { isInstalled, isStandalone, getPWACapabilities } = usePWA()
  const capabilities = getPWACapabilities

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">App Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Installed as App</span>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isInstalled ? 'bg-green-900/50 text-green-400' : 'bg-gray-700/50 text-gray-400'
          }`}>
            {isInstalled ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Standalone Mode</span>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isStandalone ? 'bg-green-900/50 text-green-400' : 'bg-gray-700/50 text-gray-400'
          }`}>
            {isStandalone ? 'Active' : 'Browser'}
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Available Features:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(capabilities).map(([feature, supported]) => (
              <div key={feature} className={`flex items-center gap-2 ${
                supported ? 'text-green-400' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  supported ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}