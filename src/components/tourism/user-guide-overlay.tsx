'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Lock,
  Zap,
  Shield,
  CheckCircle,
  MapPin,
  Wallet
} from 'lucide-react';

interface UserGuideOverlayProps {
  onClose: () => void;
}

const GUIDE_STEPS = [
  {
    title: 'Selamat Datang di STC Ultimate! 🎉',
    description: 'Platform pariwisata blockchain pertama di Indonesia yang menggunakan smart contract escrow untuk melindungi pembayaran Anda.',
    icon: MapPin,
    color: 'cyan',
    details: [
      'Pembayaran aman dengan blockchain',
      'Verifikasi IoT otomatis',
      'Multi-vendor payment distribution',
      'Audit trail lengkap'
    ]
  },
  {
    title: 'Apa itu Escrow? 🔒',
    description: 'Escrow adalah sistem penyimpanan dana di smart contract blockchain. Dana Anda akan ditahan hingga layanan benar-benar diterima.',
    icon: Lock,
    color: 'purple',
    details: [
      'Dana Anda aman di blockchain',
      'Tidak langsung ke vendor',
      'Vendor dibayar setelah verifikasi IoT',
      'Transparan dan dapat diaudit'
    ]
  },
  {
    title: 'Bagaimana IoT Memicu Pembayaran? ⚡',
    description: 'Setiap kali Anda menggunakan layanan (hotel, transport, restoran), perangkat IoT akan memverifikasi dan memicu pembayaran otomatis dari escrow.',
    icon: Zap,
    color: 'green',
    details: [
      '🏨 RFID: Check-in hotel',
      '🚌 QR Code: Naik bus/transportasi',
      '🍽️ Biometric: Makan di restoran',
      '📍 GPS: Aktivitas wisata'
    ]
  },
  {
    title: 'Keamanan Anda Terjamin 🛡️',
    description: 'Jika layanan tidak diterima atau bermasalah, sistem dispute resolution otomatis akan mengembalikan dana Anda.',
    icon: Shield,
    color: 'orange',
    details: [
      'Automatic refund logic',
      'Timeout handling',
      'Service quality verification',
      'Blockchain proof of service'
    ]
  },
  {
    title: 'Cara Menggunakan Platform 📱',
    description: 'Langkah mudah untuk memulai perjalanan Anda dengan STC Ultimate.',
    icon: CheckCircle,
    color: 'cyan',
    details: [
      '1️⃣ Hubungkan wallet Anda (MetaMask)',
      '2️⃣ Pilih destinasi & durasi perjalanan',
      '3️⃣ Lock dana di escrow smart contract',
      '4️⃣ Mulai journey & scan IoT di setiap milestone',
      '5️⃣ Dana otomatis dirilis ke vendor setelah verifikasi'
    ]
  }
];

export function UserGuideOverlay({ onClose }: UserGuideOverlayProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const step = GUIDE_STEPS[currentStep];
  const IconComponent = step.icon;
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <NeonCard glowColor={step.color as any} intense className="max-w-3xl w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-${step.color}-500/20`}>
                <IconComponent className={`h-6 w-6 text-${step.color}-400`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <Badge className={`bg-${step.color}-500/20 text-${step.color}-300 border-${step.color}-500/50 mt-1`}>
                  Langkah {currentStep + 1} dari {GUIDE_STEPS.length}
                </Badge>
              </div>
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </NeonButton>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              {step.description}
            </p>

            <div className={`p-6 rounded-lg bg-${step.color}-500/10 border border-${step.color}-500/30 space-y-3`}>
              {step.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className={`h-5 w-5 text-${step.color}-400 flex-shrink-0 mt-0.5`} />
                  <span className="text-gray-300">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {GUIDE_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? `w-8 bg-${step.color}-400` 
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <NeonButton
              variant="secondary"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </NeonButton>

            <NeonButton
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Mulai Sekarang
                  <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </NeonButton>
          </div>

          {/* Skip All */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Lewati panduan (sudah paham)
            </button>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
