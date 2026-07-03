'use client';

import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe,
  ExternalLink,
  BarChart3,
  Zap,
  Shield,
  FileText,
  Activity,
  Gauge,
  Eye,
  TrendingUp,
  Fingerprint,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface STCApp {
  id: string;
  name: string;
  description: string;
  vision: string;
  url: string;
  icon: React.ReactNode;
  category: 'analytics' | 'security' | 'dashboard' | 'integration' | 'identity' | 'core';
}

const STC_APPS: STCApp[] = [
  {
    id: 'stc-analytics',
    name: 'STC Analytics',
    description: 'Satu tempat buat melihat hasil analisa biaya gas (Vision), temuan keamanan (SWC), dan performa (Bench) dari suatu smart contract secara cepat, ringan, dan terstruktur.',
    vision: 'Visi: Transparansi dan efisiensi dalam setiap transaksi digital.',
    url: 'https://stc-analytics.streamlit.app',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'analytics'
  },
  {
    id: 'stc-gasvision',
    name: 'STC GasVision',
    description: 'Memantau biaya gas transaksi di berbagai testnet (Sepolia, Goerli, Polygon Mumbai, Arbitrum Sepolia) dan mengonversinya ke Rupiah.',
    vision: 'Visi: Memberi kontrol penuh pada pengguna terhadap biaya blockchain.',
    url: 'https://stc-gasvision.streamlit.app',
    icon: <Eye className="h-6 w-6" />,
    category: 'analytics'
  },
  {
    id: 'stc-converter',
    name: 'STC Converter',
    description: 'Memudahkan konversi hasil analisis keamanan Smart Contract Blockchain, yang menggunakan tools seperti Mythril dan Slither dan menghasilkan static analyzer, ke dalam format yang lebih mudah terbaca untuk kepentingan analisis.',
    vision: 'Visi: Memberi kemudahan pada pengguna dalam memeriksa smart contract berdasarkan best practice.',
    url: 'https://stc-converter.streamlit.app',
    icon: <FileText className="h-6 w-6" />,
    category: 'security'
  },
  {
    id: 'stc-bench',
    name: 'STC Bench',
    description: 'Memudahkan tes performa, analisa penggunaan gas, and optimisasi smart contracts di Sepolia testnet.',
    vision: 'Visi: Memberi kenyamanan dalam bertransaksi menggunakan smart contract.',
    url: 'https://stc-bench.elpeef.com',
    icon: <Gauge className="h-6 w-6" />,
    category: 'analytics'
  },
  {
    id: 'stc-insight',
    name: 'STC Insight',
    description: 'Dashboard ini dirancang untuk membantu pelaku industri, peneliti, dan pengembang dalam mengeksplorasi data transaksi wisata secara cepat dan intuitif, mulai dari tren durasi inap, total biaya, hingga metode pembayaran dan status transaksi. Fitur: Interactive charts, CSV & NDJSON support, Configurable delimiter & decimal, Auto-generated heatmaps, dan template Dataset',
    vision: 'Visi: Menjadi dasbor visual interaktif untuk menganalisis data pemesanan dan biaya dalam ekosistem SmartTourismChain (STC).',
    url: 'https://stc-insight.streamlit.app',
    icon: <Activity className="h-6 w-6" />,
    category: 'dashboard'
  },
  {
    id: 'stc-gasx',
    name: 'STC GasX',
    description: 'Menganalisa biaya gas on-chain VS off-chain dan membandingkannya dengan biaya transaksi real-time market data dalam visualisasi profesional.',
    vision: 'Visi: Menjadi dasbor visual yang memberikan gambaran perbedaan biaya transaksi menggunakan block chain dengan tanpa blockchain.',
    url: 'https://stc-gasx.elpeef.com/',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'dashboard'
  },
  {
    id: 'stc-carbonprint',
    name: 'STC CarbonPrint',
    description: 'Modul turunan dari ekosistem SmartTourismChain (STC) yang berfokus pada pengukuran dan visualisasi jejak karbon. Dibangun dari Carbon Layer di ImpactViz, CarbonPrint berkembang menjadi tool mandiri yang dapat digunakan untuk riset, edukasi, hingga perencanaan kebijakan lingkungan—baik di sektor pariwisata maupun industri lainnya. Dengan CarbonPrint, data gas fee blockchain diterjemahkan menjadi angka nyata emisi karbon, sehingga memudahkan langkah mitigasi menuju target FOLU Net Sink 2030 dan tujuan SDGs.',
    vision: 'Visi: Menjadi pusat rujukan dalam transparansi jejak karbon digital, serta mendukung transisi menuju ekonomi hijau melalui inovasi berbasis blockchain.',
    url: 'https://stc-carbonprint.elpeef.com/',
    icon: <Activity className="h-6 w-6" />,
    category: 'dashboard'
  },
  {
    id: 'stc-impactviz',
    name: 'STC ImpactViz',
    description: 'Dashboard analitik berbasis blockchain yang membantu memetakan dampak ekonomi, sosial, dan lingkungan dari aktivitas pariwisata digital. Dengan pendekatan triple bottom line, ImpactViz menyajikan data yang transparan, terukur, dan mudah dipahami untuk semua pihak—mulai dari akademisi, pelaku industri, hingga pemerintah. Kini, dengan tambahan Carbon Layer, ImpactViz juga mampu menampilkan jejak karbon dari setiap transaksi digital, menjadikannya sebagai alat penting menuju pariwisata berkelanjutan.',
    vision: 'Visi: Mewujudkan pariwisata digital yang berkelanjutan dengan menghadirkan transparansi data, inklusi sosial, dan kesadaran lingkungan melalui visualisasi berbasis blockchain.',
    url: 'https://stc-impactviz.elpeef.com/',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'dashboard'
  },
  {
    id: 'stc-connect',
    name: 'STC Connect',
    description: 'Middleware API yang menjadi jembatan antara aplikasi, perangkat IoT, dan blockchain dalam ekosistem SmartTourismChain (STC). Didesain agar developer dan researcher dapat dengan mudah mengintegrasikan fitur on-chain maupun off-chain ke dalam sistem mereka tanpa harus menulis kode blockchain yang kompleks.',
    vision: 'Visi: Menjadikan STC Connect sebagai API Hub yang sederhana namun powerful, yang bisa dipakai siapa saja: akademisi, developer, bahkan industri.',
    url: 'https://stc-connect.elpeef.com/',
    icon: <Zap className="h-6 w-6" />,
    category: 'integration'
  },
  {
    id: 'kyc',
    name: 'KYC',
    description: 'KYC by STC merupakan platform identitas digital berbasis blockchain yang dirancang khusus untuk pelaku industri pariwisata. Dengan teknologi Self-Sovereign Identity (SSI) dan Verifiable Credentials, platform ini menyediakan proses verifikasi identitas yang cepat, aman, dan transparan. KYC by STC memudahkan pelaku wisata dalam mengelola data identitas mereka dengan kontrol penuh atas privasi, serta memungkinkan lembaga terkait untuk melakukan validasi secara efisien dan terpercaya.',
    vision: 'Visi: Menjadi standar nasional dan internasional untuk identitas digital pelaku wisata yang mendukung proses onboarding yang mudah, mematuhi regulasi, dan menjaga keamanan data pribadi. Kami berkomitmen membangun ekosistem pariwisata yang terpercaya dan inklusif melalui pemanfaatan teknologi blockchain.',
    url: 'https://kyc.elpeef.com/',
    icon: <Fingerprint className="h-6 w-6" />,
    category: 'identity'
  },
  {
    id: 'auditour',
    name: 'AudiTour',
    description: 'AudiTour by STC adalah platform audit dan provenance berbasis blockchain yang dirancang untuk mencatat, melacak, dan memverifikasi seluruh aktivitas transaksi wisata. Sistem ini memungkinkan transparansi penuh dengan mencatat jejak digital dari booking, pembayaran, hingga layanan pelanggan secara auditabel. AudiTour by STC mendukung pihak-pihak terkait dalam mengakses data terpercaya dan meningkatkan kepercayaan serta kualitas layanan wisata.',
    vision: 'Visi: Menjadi solusi terpercaya untuk menciptakan ekosistem pariwisata yang transparan dan akuntabel, serta mendorong inovasi di sektor pariwisata digital melalui teknologi blockchain. Kami ingin membantu semua pemangku kepentingan dalam mengelola data transaksi dengan aman dan dapat diverifikasi secara real-time.',
    url: 'https://auditour.elpeef.com/',
    icon: <CheckCircle className="h-6 w-6" />,
    category: 'security'
  },
  {
    id: 'stc-ultimate',
    name: 'STC Ultimate',
    description: 'Aplikasi ini hadir sebagai solusi digital yang revolusioner bagi industri pariwisata, dengan memanfaatkan teknologi blockchain dan integrasi IoT demi mewujudkan transparansi, efisiensi, serta keamanan dalam setiap transaksi perjalanan wisata. Semua layanan—mulai dari tiket pesawat, hotel, transportasi, hingga kuliner dan oleh-oleh—terintegrasi secara otomatis melalui smart contract, memungkinkan wisatawan merasakan pengalaman liburan tanpa repot sekaligus memastikan seluruh pembayaran dilakukan secara real-time dan terverifikasi di setiap aktivitas. Sistem escrow cerdas memberikan perlindungan dana, serta mendukung simulasi maupun implementasi nyata dengan teknologi RFID dan QR untuk menunjang riset serta pengembangan skema perjalanan wisata masa depan.',
    vision: 'Visi: Menjadi platform digital terdepan yang mengubah paradigma industri pariwisata melalui inovasi smart contract dan IoT, menciptakan ekosistem perjalanan yang transparan, otomatis, dan dapat dipercaya oleh semua pihak—mulai dari wisatawan, penyedia layanan, hingga peneliti dan pegiat teknologi. Kami berkomitmen untuk menghadirkan pengalaman liburan yang seamless, aman, dan adaptif terhadap perkembangan teknologi, sembari berkontribusi pada transformasi digital destinasi wisata Indonesia dan dunia.',
    url: 'https://stc-ultimate.elpeef.com/',
    icon: <Sparkles className="h-6 w-6" />,
    category: 'core'
  }
];

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'analytics':
      return 'cyan';
    case 'security':
      return 'orange';
    case 'dashboard':
      return 'purple';
    case 'integration':
      return 'green';
    case 'identity':
      return 'yellow';
    case 'core':
      return 'pink';
    default:
      return 'cyan';
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'analytics':
      return 'Analytics';
    case 'security':
      return 'Security';
    case 'dashboard':
      return 'Dashboard';
    case 'integration':
      return 'Integration';
    case 'identity':
      return 'Identity';
    case 'core':
      return 'Core Platform';
    default:
      return 'App';
  }
};

interface STCEcosystemProps {
  onBackToLanding: () => void;
}

export function STCEcosystem({ onBackToLanding }: STCEcosystemProps) {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <Globe className="h-16 w-16 text-cyan-400" />
            <div className="absolute inset-0 h-16 w-16 text-purple-400 animate-pulse">
              <Globe className="h-16 w-16" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            STC Ecosystem
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ekosistem lengkap untuk Smart Tourism Chain - dari analitik blockchain, 
            keamanan smart contract, hingga platform identitas digital dan audit trail.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <NeonButton
            variant="outline"
            onClick={() => window.open('https://smartourism.elpeef.com', '_blank')}
          >
            <Globe className="h-4 w-4" />
            Official Website
            <ExternalLink className="h-4 w-4" />
          </NeonButton>
        </div>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-sm px-4 py-2">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics Tools
        </Badge>
        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50 text-sm px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          Security Suite
        </Badge>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-sm px-4 py-2">
          <Activity className="h-4 w-4 mr-2" />
          Dashboards
        </Badge>
        <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-sm px-4 py-2">
          <Zap className="h-4 w-4 mr-2" />
          Integration APIs
        </Badge>
        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-sm px-4 py-2">
          <Fingerprint className="h-4 w-4 mr-2" />
          Identity & Audit
        </Badge>
      </div>

      {/* Apps Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STC_APPS.map((app) => (
          <NeonCard 
            key={app.id} 
            glowColor={getCategoryColor(app.category)}
            className="flex flex-col h-full"
          >
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-lg bg-${getCategoryColor(app.category)}-500/20 flex items-center justify-center text-${getCategoryColor(app.category)}-400`}
                  >
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {app.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 text-xs border-${getCategoryColor(app.category)}-500/50 text-${getCategoryColor(app.category)}-300`}
                    >
                      {getCategoryLabel(app.category)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {app.description}
              </p>

              {/* Vision */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <p className="text-gray-300 text-xs italic leading-relaxed">
                  {app.vision}
                </p>
              </div>
            </div>

            {/* Launch Button */}
            <div className="mt-6">
              <NeonButton
                variant={app.id === 'stc-ultimate' ? 'default' : 'secondary'}
                className="w-full"
                onClick={() => window.open(app.url, '_blank')}
              >
                {app.id === 'stc-ultimate' ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    You're Here!
                  </>
                ) : (
                  <>
                    Launch App
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </NeonButton>
            </div>
          </NeonCard>
        ))}
      </div>

      {/* Stats Footer */}
      <NeonCard glowColor="cyan" intense>
        <div className="grid md:grid-cols-3 divide-x divide-cyan-500/20">
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-cyan-400">12</p>
            <p className="text-gray-400 mt-2">Ecosystem Apps</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-cyan-400">6</p>
            <p className="text-gray-400 mt-2">Categories</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-cyan-400">100%</p>
            <p className="text-gray-400 mt-2">Blockchain Powered</p>
          </div>
        </div>
      </NeonCard>

      {/* Back Button */}
      <div className="flex justify-center">
        <NeonButton
          variant="outline"
          onClick={onBackToLanding}
          size="lg"
        >
          Kembali ke Beranda
        </NeonButton>
      </div>
    </div>
  );
}
