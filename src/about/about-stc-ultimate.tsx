'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  ChevronRight,
  Smartphone,
  CreditCard,
  MapPin,
  Award,
  BookOpen,
  PlayCircle
} from 'lucide-react';

interface AboutSTCUltimateProps {}

const AboutSTCUltimate: React.FC<AboutSTCUltimateProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'benefits' | 'usage' | 'research'>('overview');

  const features = [
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Pembayaran Blockchain Real",
      description: "Transaksi menggunakan Ethereum Sepolia testnet dengan smart contract yang aman"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Simulasi IoT Lengkap",
      description: "15+ perangkat IoT seperti NFC, RFID, GPS untuk pengalaman wisata yang realistis"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Paket Wisata Komprehensif",
      description: "Booking penerbangan, hotel, transportasi dalam satu platform terintegrasi"
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Sistem Reward STC",
      description: "Dapatkan STC tokens dan achievement badges setiap menyelesaikan perjalanan"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Keamanan Blockchain",
      description: "Semua transaksi tercatat di blockchain dengan transparansi dan keamanan tinggi"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Multi-Chain Support",
      description: "Mendukung berbagai jaringan blockchain untuk fleksibilitas maksimal"
    }
  ];

  const benefits = [
    {
      category: "Untuk Wisatawan",
      items: [
        "Proses booking yang mudah dan transparan",
        "Pembayaran sekali klik dengan teknologi blockchain", 
        "Tracking perjalanan real-time dengan IoT",
        "Reward dan incentive untuk setiap perjalanan",
        "Keamanan data dan transaksi terjamin"
      ]
    },
    {
      category: "Untuk Industri Pariwisata", 
      items: [
        "Otomatisasi proses pembayaran merchant",
        "Transparansi dalam rantai pembayaran",
        "Integrasi IoT untuk monitoring layanan",
        "Data analytics untuk optimisasi bisnis",
        "Cost reduction melalui smart contracts"
      ]
    },
    {
      category: "Untuk Peneliti",
      items: [
        "Platform penelitian blockchain-tourism terintegrasi",
        "Data collection dan analytics comprehensive", 
        "Measurement tools untuk academic research",
        "Real testnet implementation untuk validasi",
        "Export capabilities untuk analisis statistik"
      ]
    }
  ];

  const usageSteps = [
    {
      step: 1,
      title: "Hubungkan Wallet",
      description: "Connect MetaMask wallet Anda ke platform dan pastikan menggunakan Sepolia testnet",
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      step: 2, 
      title: "Pilih Destinasi",
      description: "Browse dan pilih destinasi wisata dari berbagai skenario yang tersedia",
      icon: <MapPin className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Kustomisasi Paket",
      description: "Tambahkan layanan seperti penerbangan, hotel, dan transportasi sesuai kebutuhan",
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Proses Pembayaran",
      description: "Bayar dengan ETH real di Sepolia testnet melalui smart contract",
      icon: <Zap className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Aktivasi IoT",
      description: "Nikmati simulasi IoT devices untuk pengalaman wisata yang realistis",
      icon: <PlayCircle className="h-6 w-6" />
    },
    {
      step: 6,
      title: "Dapatkan Reward",
      description: "Klaim STC tokens, achievements, dan NFT certificate setelah perjalanan selesai",
      icon: <Award className="h-6 w-6" />
    }
  ];

  const researchAspects = [
    {
      title: "Blockchain Integration",
      points: [
        "Smart contract automation untuk tourism industry",
        "Real testnet implementation dengan actual wallet deduction", 
        "Gas optimization dan cost analysis",
        "Multi-chain interoperability testing"
      ]
    },
    {
      title: "IoT Device Integration",
      points: [
        "15+ IoT device types simulation",
        "Real-time device communication protocols",
        "Hotel room access menggunakan NFC/RFID",
        "GPS tracking dan location verification"
      ]
    },
    {
      title: "User Experience Research",
      points: [
        "Transaction flow optimization",
        "Error handling dan recovery mechanisms",
        "Mobile-responsive interface design", 
        "Accessibility untuk diverse users"
      ]
    },
    {
      title: "Economic Impact Analysis",
      points: [
        "Cost reduction melalui smart contracts",
        "Transaction fee optimization",
        "Token economy dan reward systems",
        "Merchant payment automation"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 px-4 py-2 rounded-full">
          <Info className="h-5 w-5 text-cyan-400" />
          <span className="text-cyan-300 font-medium">STC Ultimate Platform</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Tentang STC Ultimate
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Platform pariwisata pintar berbasis blockchain yang mengintegrasikan IoT, smart contracts, 
          dan teknologi Web3 untuk menciptakan pengalaman wisata masa depan yang transparan, aman, dan otomatis.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { key: 'overview', label: 'Gambaran Umum', icon: <Info className="h-4 w-4" /> },
          { key: 'features', label: 'Fitur Utama', icon: <Zap className="h-4 w-4" /> },
          { key: 'benefits', label: 'Manfaat', icon: <Target className="h-4 w-4" /> },
          { key: 'usage', label: 'Cara Penggunaan', icon: <BookOpen className="h-4 w-4" /> },
          { key: 'research', label: 'Aspek Penelitian', icon: <Users className="h-4 w-4" /> }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              activeTab === tab.key 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25' 
                : 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Tujuan Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  STC Ultimate dikembangkan sebagai platform penelitian dan demonstrasi untuk mengeksplorasi potensi 
                  integrasi teknologi blockchain dan IoT dalam industri pariwisata. Platform ini bertujuan untuk:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-cyan-400 font-semibold">Otomatisasi Proses</h4>
                    <p className="text-gray-400 text-sm">
                      Mengotomatisasi booking, pembayaran, dan aktivasi layanan wisata menggunakan smart contracts
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-cyan-400 font-semibold">Transparansi</h4>
                    <p className="text-gray-400 text-sm">
                      Memberikan transparansi penuh dalam transaksi dan alokasi pembayaran kepada merchant
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-cyan-400 font-semibold">Keamanan Data</h4>
                    <p className="text-gray-400 text-sm">
                      Mengamankan data pengguna dan transaksi melalui teknologi blockchain yang immutable
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-cyan-400 font-semibold">Pengalaman IoT</h4>
                    <p className="text-gray-400 text-sm">
                      Menghadirkan pengalaman wisata masa depan dengan integrasi perangkat IoT yang seamless
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-cyan-300">Peneliti & Akademisi</h4>
                    <p className="text-gray-400 text-sm">
                      Platform penelitian untuk thesis, disertasi, dan publikasi akademik
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-cyan-300">Industri Pariwisata</h4>
                    <p className="text-gray-400 text-sm">
                      Eksplorasi teknologi masa depan untuk optimisasi operasional
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-cyan-300">Tech Enthusiasts</h4>
                    <p className="text-gray-400 text-sm">
                      Pengalaman hands-on dengan teknologi blockchain dan IoT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-cyan-300">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-6">
            {benefits.map((benefitCategory, index) => (
              <Card key={index} className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-300">{benefitCategory.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {benefitCategory.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3">
                        <ChevronRight className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-4">
            {usageSteps.map((step, index) => (
              <Card key={index} className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <h3 className="font-semibold text-cyan-300">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg border border-cyan-500/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-cyan-300">Catatan Penting</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Platform ini menggunakan Sepolia testnet untuk demonstrasi. Pastikan wallet Anda terhubung ke jaringan yang benar 
                    dan memiliki ETH testnet yang cukup untuk melakukan transaksi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAspects.map((aspect, index) => (
              <Card key={index} className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-300 text-lg">{aspect.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aspect.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg border border-cyan-500/20">
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">Siap Memulai Perjalanan Blockchain Tourism?</h3>
          <p className="text-gray-300 mb-4">
            Jelajahi masa depan pariwisata dengan teknologi blockchain dan IoT yang terintegrasi
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
              Real Testnet Transactions
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              IoT Device Integration
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-300">
              Academic Research Ready
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSTCUltimate;