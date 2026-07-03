'use client'

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingTourProps {
  onComplete?: () => void;
  runTour?: boolean;
}

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlight?: string;
}

const TOUR_STORAGE_KEY = 'stc_onboarding_completed';

const tourSteps: TourStep[] = [
  {
    target: 'body',
    title: '🎉 Welcome to STC Ultimate!',
    content: 'Your smart tourism platform powered by blockchain technology. Let\'s take a quick tour to help you get started! You can skip this tour anytime.',
    placement: 'center',
  },
  {
    target: '[data-tour="role-selector"]',
    title: '🎭 Choose Your Role',
    content: 'Switch between Tourist, SME Owner, Researcher, or Administrator to access different features tailored to your needs.',
    placement: 'bottom',
    highlight: '💡 Each role has unique features and access levels!',
  },
  {
    target: '[data-tour="wallet-connector"]',
    title: '👛 Connect Your Wallet',
    content: 'Connect your crypto wallet to make secure payments and interact with blockchain features. We support MetaMask, Coinbase Wallet, and more!',
    placement: 'bottom',
    highlight: '🔐 All transactions are secured on Ethereum Sepolia testnet',
  },
  {
    target: '[data-tour="features-grid"]',
    title: '⚡ Core Features',
    content: 'Explore our powerful features including instant payments, secure escrow, trusted networks, and comprehensive research tools.',
    placement: 'top',
    highlight: '✨ All features are blockchain-powered for maximum security',
  },
  {
    target: '[data-tour="token-analytics"]',
    title: '💰 Token & Analytics',
    content: 'Manage your STC tokens, view comprehensive transaction analytics, and export data for research purposes.',
    placement: 'top',
    highlight: '📊 Real-time analytics with export capabilities',
  },
  {
    target: '[data-tour="transaction-history"]',
    title: '📊 Transaction History',
    content: 'Access your complete transaction history with advanced filtering, sorting, and pagination capabilities.',
    placement: 'top',
    highlight: '💾 Export transactions in multiple formats',
  },
  {
    target: '[data-tour="security"]',
    title: '🛡️ Zero Trust Security',
    content: 'Our advanced security system includes device fingerprinting, risk scoring, and real-time monitoring to protect your transactions.',
    placement: 'top',
    highlight: '🔒 Multi-layer security protection',
  },
  {
    target: '[data-tour="whitepaper"]',
    title: '📚 Learn More',
    content: 'Read our comprehensive whitepaper to understand the technical architecture, research methodology, and system design. You\'re all set to start exploring!',
    placement: 'top',
    highlight: '🚀 Ready to build your first tour package?',
  },
];

export function OnboardingTour({ onComplete, runTour = false }: OnboardingTourProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentTargetRef = useRef<HTMLElement | null>(null);
  const originalStylesRef = useRef<{ position: string; zIndex: string; boxShadow: string; filter: string; transition: string }>({ position: '', zIndex: '', boxShadow: '', filter: '', transition: '' });

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    
    if (!tourCompleted) {
      setTimeout(() => {
        setIsActive(true);
        updateTooltipPosition(0);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      // Cleanup previous target styles
      cleanupTargetStyles();
      // Update position for new step
      updateTooltipPosition(currentStep);
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupTargetStyles();
    };
  }, []);

  useEffect(() => {
    const handleResize = (): void => {
      if (isActive) {
        updateTooltipPosition(currentStep);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, currentStep]);

  const cleanupTargetStyles = (): void => {
    if (currentTargetRef.current) {
      const element = currentTargetRef.current;
      const styles = originalStylesRef.current;
      
      // Restore original styles
      element.style.position = styles.position;
      element.style.zIndex = styles.zIndex;
      element.style.boxShadow = styles.boxShadow;
      element.style.filter = styles.filter;
      element.style.transition = styles.transition;
      
      currentTargetRef.current = null;
    }
  };

  const updateTooltipPosition = (stepIndex: number): void => {
    const step = tourSteps[stepIndex];
    
    if (step.placement === 'center') {
      setTooltipPosition(null);
      setSpotlightRect(null);
      return;
    }

    const targetElement = document.querySelector<HTMLElement>(step.target);
    
    if (!targetElement) {
      console.warn(`Target element not found: ${step.target}`);
      return;
    }

    // Store original styles
    currentTargetRef.current = targetElement;
    originalStylesRef.current = {
      position: targetElement.style.position || '',
      zIndex: targetElement.style.zIndex || '',
      boxShadow: targetElement.style.boxShadow || '',
      filter: targetElement.style.filter || '',
      transition: targetElement.style.transition || '',
    };

    // Elevate target element above blur with purple glow
    const computedPosition = window.getComputedStyle(targetElement).position;
    if (computedPosition === 'static') {
      targetElement.style.position = 'relative';
    }
    targetElement.style.zIndex = '9999';
    targetElement.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)';
    targetElement.style.filter = 'brightness(1.2)';
    targetElement.style.transition = 'all 0.3s ease-in-out';

    const rect = targetElement.getBoundingClientRect();
    setSpotlightRect(rect);

    const tooltipWidth = 400;
    const tooltipHeight = 300;
    const padding = 20;

    let top = 0;
    let left = 0;

    switch (step.placement) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + padding;
        break;
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipHeight > viewportHeight - padding) {
      top = viewportHeight - tooltipHeight - padding;
    }

    setTooltipPosition({ top, left });

    // Scroll element into view
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNext = (): void => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = (): void => {
    completeTour();
  };

  const completeTour = (): void => {
    setIsActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    onComplete?.();
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isCenterPlacement = step.placement === 'center';

  return (
    <>
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        style={{ zIndex: 9998, animation: 'fadeIn 0.3s ease-in-out' }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md transition-all duration-300 ${
          isCenterPlacement ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={
          isCenterPlacement
            ? { zIndex: 10000 }
            : tooltipPosition
            ? {
                zIndex: 10000,
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
              }
            : { zIndex: 10000, opacity: 0 }
        }
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white pr-8">{step.title}</h3>
          <p className="text-gray-300 leading-relaxed">{step.content}</p>

          {step.highlight && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-sm text-cyan-300">{step.highlight}</p>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 my-6">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-cyan-400 w-6'
                  : idx < currentStep
                  ? 'bg-green-400 w-2'
                  : 'bg-gray-600 w-2'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3">
          <div>
            {!isFirstStep && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Skip Tour
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              size="sm"
            >
              {isLastStep ? (
                'Get Started! 🚀'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step counter */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Step {currentStep + 1} of {tourSteps.length}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Hook to restart tour
export function useRestartTour() {
  const restartTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    window.location.reload();
  };

  const isTourCompleted = () => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  };

  return { restartTour, isTourCompleted };
}
