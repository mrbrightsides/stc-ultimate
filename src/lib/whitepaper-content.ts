export interface WhitepaperSection {
  id: string;
  title: { en: string; id: string };
  content: { en: string; id: string };
  subsections?: WhitepaperSection[];
}

export const whitepaperContent: WhitepaperSection[] = [
  {
    id: 'executive-summary',
    title: {
      en: 'Executive Summary',
      id: 'Ringkasan Eksekutif',
    },
    content: {
      en: `STC Ultimate represents a paradigm shift in smart tourism infrastructure, combining blockchain technology, IoT networks, artificial intelligence, and extended reality to create a comprehensive ecosystem for Indonesia's tourism sector. Built on Ethereum (Sepolia) and Base Mainnet, the platform enables secure, transparent, and efficient tourism experiences while empowering local businesses and government stakeholders.

Our vision is to establish Indonesia as the leading smart tourism destination in Southeast Asia by 2030, leveraging cutting-edge technology to enhance visitor experiences, boost local economies, and provide data-driven insights for sustainable tourism development.

Key Features:
• Web3-enabled tourism package builder with blockchain-verified transactions
• Real-time IoT sensor network for environmental monitoring and visitor safety
• AI-powered trip planning and personalized recommendations
• DAO governance for community-driven platform evolution
• CBDC integration for seamless, secure payments
• NFT-based loyalty rewards and achievement system
• Metaverse integration with VR/AR experiences
• Comprehensive research tools and analytics dashboard

Market Opportunity: Indonesia's tourism sector generated $19.2B in 2023, with smart tourism investments projected to grow 28% annually through 2030. STC Ultimate addresses critical pain points including payment fraud, inefficient booking systems, lack of real-time data, and limited digital integration.`,
      id: `STC Ultimate merepresentasikan pergeseran paradigma dalam infrastruktur smart tourism, menggabungkan teknologi blockchain, jaringan IoT, kecerdasan buatan, dan extended reality untuk menciptakan ekosistem komprehensif bagi sektor pariwisata Indonesia. Dibangun di Ethereum (Sepolia) dan Base Mainnet, platform ini memungkinkan pengalaman pariwisata yang aman, transparan, dan efisien sambil memberdayakan bisnis lokal dan stakeholder pemerintah.

Visi kami adalah menjadikan Indonesia sebagai destinasi smart tourism terdepan di Asia Tenggara pada tahun 2030, memanfaatkan teknologi mutakhir untuk meningkatkan pengalaman pengunjung, mendorong ekonomi lokal, dan menyediakan wawasan berbasis data untuk pengembangan pariwisata berkelanjutan.

Fitur Utama:
• Pembangun paket wisata berbasis Web3 dengan transaksi terverifikasi blockchain
• Jaringan sensor IoT real-time untuk pemantauan lingkungan dan keamanan pengunjung
• Perencanaan perjalanan bertenaga AI dan rekomendasi personal
• Governance DAO untuk evolusi platform berbasis komunitas
• Integrasi CBDC untuk pembayaran yang mulus dan aman
• Sistem loyalitas dan pencapaian berbasis NFT
• Integrasi metaverse dengan pengalaman VR/AR
• Tool penelitian komprehensif dan dashboard analitik

Peluang Pasar: Sektor pariwisata Indonesia menghasilkan $19.2 miliar pada 2023, dengan investasi smart tourism diproyeksikan tumbuh 28% per tahun hingga 2030. STC Ultimate mengatasi pain point kritis termasuk fraud pembayaran, sistem booking yang tidak efisien, kurangnya data real-time, dan integrasi digital yang terbatas.`,
    },
  },
  {
    id: 'introduction',
    title: {
      en: 'Introduction',
      id: 'Pendahuluan',
    },
    content: {
      en: `Indonesia, with its diverse archipelago of over 17,000 islands, rich cultural heritage, and breathtaking natural landscapes, stands as one of the world's most promising tourism destinations. However, the sector faces significant challenges that hinder its full potential: fragmented booking systems, payment fraud, lack of real-time visitor data, minimal integration between stakeholders, and limited digital infrastructure in remote tourist areas.

Traditional tourism platforms operate in silos, creating inefficiencies for tourists, businesses, and government agencies. Tourists struggle with multiple booking platforms, unclear pricing, and security concerns. Small and medium enterprises (SMEs) face high commission fees, limited market reach, and difficulty accessing capital. Government agencies lack real-time data for policy-making and resource allocation.

STC Ultimate addresses these challenges through a unified, blockchain-powered platform that connects all tourism stakeholders in a transparent, efficient ecosystem. By leveraging Web3 technology, IoT sensors, AI analytics, and immersive XR experiences, we create a next-generation tourism infrastructure that benefits everyone.`,
      id: `Indonesia, dengan kepulauan beragam yang terdiri dari lebih dari 17.000 pulau, warisan budaya yang kaya, dan lanskap alam yang menakjubkan, merupakan salah satu destinasi pariwisata paling menjanjikan di dunia. Namun, sektor ini menghadapi tantangan signifikan yang menghambat potensi penuhnya: sistem booking yang terfragmentasi, fraud pembayaran, kurangnya data pengunjung real-time, integrasi minimal antar stakeholder, dan infrastruktur digital terbatas di area wisata terpencil.

Platform pariwisata tradisional beroperasi dalam silo, menciptakan inefisiensi bagi turis, bisnis, dan lembaga pemerintah. Turis berjuang dengan multiple platform booking, harga tidak jelas, dan kekhawatiran keamanan. Usaha kecil dan menengah (UMKM) menghadapi biaya komisi tinggi, jangkauan pasar terbatas, dan kesulitan mengakses modal. Lembaga pemerintah kekurangan data real-time untuk pembuatan kebijakan dan alokasi sumber daya.

STC Ultimate mengatasi tantangan ini melalui platform terpadu berbasis blockchain yang menghubungkan semua stakeholder pariwisata dalam ekosistem yang transparan dan efisien. Dengan memanfaatkan teknologi Web3, sensor IoT, analitik AI, dan pengalaman XR immersive, kami menciptakan infrastruktur pariwisata generasi berikutnya yang menguntungkan semua pihak.`,
    },
    subsections: [
      {
        id: 'background',
        title: {
          en: 'Background & Context',
          id: 'Latar Belakang & Konteks',
        },
        content: {
          en: `Indonesia's tourism sector contributed 4.8% to GDP in 2023, employing over 13 million people. Pre-pandemic, the sector welcomed 16.1 million international visitors and generated significant foreign exchange. However, digital transformation has been slow, with most tourism businesses still relying on legacy systems.

Key Statistics:
• 19.2 billion USD tourism revenue (2023)
• 4.8% GDP contribution
• 13+ million employed in tourism sector
• Only 32% of SMEs have digital payment systems
• 68% of tourist complaints relate to payment/booking issues
• Average transaction cost: 12-15% in traditional systems`,
          id: `Sektor pariwisata Indonesia berkontribusi 4,8% terhadap PDB pada 2023, mempekerjakan lebih dari 13 juta orang. Pra-pandemi, sektor ini menyambut 16,1 juta pengunjung internasional dan menghasilkan devisa signifikan. Namun, transformasi digital berjalan lambat, dengan sebagian besar bisnis pariwisata masih mengandalkan sistem lama.

Statistik Kunci:
• 19,2 miliar USD pendapatan pariwisata (2023)
• 4,8% kontribusi PDB
• 13+ juta orang bekerja di sektor pariwisata
• Hanya 32% UMKM memiliki sistem pembayaran digital
• 68% keluhan turis terkait masalah pembayaran/booking
• Biaya transaksi rata-rata: 12-15% dalam sistem tradisional`,
        },
      },
      {
        id: 'pain-points',
        title: {
          en: 'Current Pain Points',
          id: 'Pain Point Saat Ini',
        },
        content: {
          en: `**For Tourists:**
• Fragmented booking experiences across multiple platforms
• High risk of fraud and scams
• Lack of transparent pricing
• No unified loyalty program
• Limited real-time information about destinations
• Language barriers
• Estimated annual loss: $450M due to fraud and inefficiencies

**For SMEs & Local Businesses:**
• High commission fees (15-30%) from OTA platforms
• Limited access to international markets
• Cash flow problems due to delayed payments
• Lack of customer data insights
• Minimal marketing tools
• Revenue loss: ~$1.2B annually to intermediaries

**For Government & Tourism Boards:**
• No real-time visitor tracking
• Inability to measure tourism impact accurately
• Difficulty enforcing regulations
• Limited data for policy decisions
• Challenges in resource allocation
• Estimated policy inefficiency cost: $800M annually`,
          id: `**Untuk Turis:**
• Pengalaman booking terfragmentasi di berbagai platform
• Risiko tinggi fraud dan penipuan
• Kurangnya transparansi harga
• Tidak ada program loyalitas terpadu
• Informasi real-time terbatas tentang destinasi
• Hambatan bahasa
• Estimasi kerugian tahunan: $450 juta karena fraud dan inefisiensi

**Untuk UMKM & Bisnis Lokal:**
• Biaya komisi tinggi (15-30%) dari platform OTA
• Akses terbatas ke pasar internasional
• Masalah cash flow karena pembayaran tertunda
• Kurangnya wawasan data pelanggan
• Tool marketing minimal
• Kehilangan pendapatan: ~$1,2 miliar per tahun ke perantara

**Untuk Pemerintah & Dinas Pariwisata:**
• Tidak ada pelacakan pengunjung real-time
• Ketidakmampuan mengukur dampak pariwisata secara akurat
• Kesulitan menegakkan regulasi
• Data terbatas untuk keputusan kebijakan
• Tantangan dalam alokasi sumber daya
• Estimasi biaya inefisiensi kebijakan: $800 juta per tahun`,
        },
      },
    ],
  },
  {
    id: 'platform-overview',
    title: {
      en: 'STC Ultimate Platform Overview',
      id: 'Gambaran Platform STC Ultimate',
    },
    content: {
      en: `STC Ultimate is a multi-layered, modular platform that integrates nine core modules to deliver comprehensive smart tourism solutions. Each module is designed to work independently while seamlessly integrating with others to create a unified ecosystem.`,
      id: `STC Ultimate adalah platform berlapis dan modular yang mengintegrasikan sembilan modul inti untuk memberikan solusi smart tourism komprehensif. Setiap modul dirancang untuk bekerja secara independen sambil terintegrasi dengan yang lain untuk menciptakan ekosistem terpadu.`,
    },
    subsections: [
      {
        id: 'core-modules',
        title: {
          en: '9 Core Modules',
          id: '9 Modul Inti',
        },
        content: {
          en: `**1. Tourism Module**
Package builder, smart payments, IoT-aware services, journey tracking, and loyalty systems

**2. Blockchain Module**
Multi-chain support (Ethereum, Base, L2s), smart contracts, consensus mechanisms, CBDC integration, Web3 authentication

**3. IoT Network Module**
Real-time sensors, environmental monitoring, SCADA system, device control, blockchain integration

**4. AI & ML Module**
Intelligent trip planner, personalized recommendations, predictive analytics, ML models, chatbot assistant

**5. Governance Module**
DAO structure, token-based voting, treasury management, proposal system, compliance framework

**6. Metaverse Module**
VR/AR experiences, digital twins, avatar systems, 360° tours, live streaming

**7. NFT & Rewards Module**
Achievement NFTs, loyalty marketplace, gamification, experience proofs, reward distribution

**8. Research Module**
Data collection, statistical analysis, ML algorithms, visualization tools, dissertation support

**9. Export & Reporting Module**
PDF reports, Excel exports, CSV data, blockchain certificates, audit logs`,
          id: `**1. Modul Pariwisata**
Pembangun paket, pembayaran pintar, layanan IoT, pelacakan perjalanan, dan sistem loyalitas

**2. Modul Blockchain**
Dukungan multi-chain (Ethereum, Base, L2s), smart contract, mekanisme konsensus, integrasi CBDC, autentikasi Web3

**3. Modul Jaringan IoT**
Sensor real-time, pemantauan lingkungan, sistem SCADA, kontrol perangkat, integrasi blockchain

**4. Modul AI & ML**
Perencana perjalanan cerdas, rekomendasi personal, analitik prediktif, model ML, asisten chatbot

**5. Modul Governance**
Struktur DAO, voting berbasis token, manajemen treasury, sistem proposal, kerangka compliance

**6. Modul Metaverse**
Pengalaman VR/AR, digital twin, sistem avatar, tur 360°, live streaming

**7. Modul NFT & Reward**
NFT pencapaian, marketplace loyalitas, gamifikasi, bukti pengalaman, distribusi reward

**8. Modul Penelitian**
Pengumpulan data, analisis statistik, algoritma ML, tool visualisasi, dukungan disertasi

**9. Modul Export & Reporting**
Laporan PDF, export Excel, data CSV, sertifikat blockchain, log audit`,
        },
      },
    ],
  },
  {
    id: 'technology',
    title: {
      en: 'Technology Architecture',
      id: 'Arsitektur Teknologi',
    },
    content: {
      en: `STC Ultimate employs a sophisticated multi-layer architecture designed for scalability, security, and interoperability. The platform operates across five primary technological layers, each serving distinct functions while maintaining seamless integration.`,
      id: `STC Ultimate menggunakan arsitektur multi-layer canggih yang dirancang untuk skalabilitas, keamanan, dan interoperabilitas. Platform beroperasi di lima layer teknologi utama, masing-masing melayani fungsi berbeda sambil mempertahankan integrasi mulus.`,
    },
    subsections: [
      {
        id: 'blockchain-layer',
        title: {
          en: 'Blockchain Layer',
          id: 'Layer Blockchain',
        },
        content: {
          en: `**Multi-Chain Architecture:**
• Primary: Ethereum Sepolia (testnet) → Mainnet migration planned
• Secondary: Base Mainnet (L2 for cost optimization)
• Future: Polygon, Arbitrum, Optimism integration
• Cross-chain bridges for asset interoperability

**Smart Contracts:**
• TourismPackage.sol - Package creation and booking management
• PaymentEscrow.sol - Milestone-based payment release
• LoyaltyNFT.sol - Reward distribution and tracking
• DAOGovernance.sol - Voting and proposal management
• IoTVerifier.sol - Device authentication and data validation

**Consensus & Security:**
• Proof of Stake consensus mechanism
• Multi-signature wallet for treasury
• Time-locked contracts for governance actions
• Oracle integration (Chainlink) for off-chain data
• IPFS for decentralized file storage

**Performance Metrics:**
• Target TPS: 10,000+ (via L2 scaling)
• Block time: ~2 seconds (Base)
• Transaction cost: $0.001-0.01 average
• Finality: ~12 seconds`,
          id: `**Arsitektur Multi-Chain:**
• Primer: Ethereum Sepolia (testnet) → Migrasi mainnet direncanakan
• Sekunder: Base Mainnet (L2 untuk optimasi biaya)
• Masa Depan: Integrasi Polygon, Arbitrum, Optimism
• Bridge cross-chain untuk interoperabilitas aset

**Smart Contract:**
• TourismPackage.sol - Pembuatan paket dan manajemen booking
• PaymentEscrow.sol - Pelepasan pembayaran berbasis milestone
• LoyaltyNFT.sol - Distribusi dan pelacakan reward
• DAOGovernance.sol - Manajemen voting dan proposal
• IoTVerifier.sol - Autentikasi perangkat dan validasi data

**Konsensus & Keamanan:**
• Mekanisme konsensus Proof of Stake
• Dompet multi-signature untuk treasury
• Kontrak time-locked untuk tindakan governance
• Integrasi oracle (Chainlink) untuk data off-chain
• IPFS untuk penyimpanan file terdesentralisasi

**Metrik Performa:**
• Target TPS: 10.000+ (via scaling L2)
• Waktu blok: ~2 detik (Base)
• Biaya transaksi: $0,001-0,01 rata-rata
• Finality: ~12 detik`,
        },
      },
      {
        id: 'iot-layer',
        title: {
          en: 'IoT & Sensor Layer',
          id: 'Layer IoT & Sensor',
        },
        content: {
          en: `**IoT Network Architecture:**
• 500+ smart sensors across pilot locations
• Environmental monitoring (temp, humidity, air quality)
• Visitor density tracking (privacy-preserving)
• Energy consumption optimization
• Real-time alert systems

**SCADA Integration:**
• Centralized control and monitoring dashboard
• Device health tracking and predictive maintenance
• Automated response to threshold breaches
• Historical data analysis and reporting
• Integration with blockchain for immutable logs

**Data Pipeline:**
• Edge computing for real-time processing
• gRPC streaming for low-latency communication
• Data validation and anomaly detection
• Blockchain anchoring for critical events
• Privacy-preserving aggregation techniques

**Security Measures:**
• Device authentication via blockchain certificates
• Encrypted communication channels
• Regular security audits
• Tamper-detection mechanisms
• Zero-trust architecture`,
          id: `**Arsitektur Jaringan IoT:**
• 500+ sensor pintar di lokasi pilot
• Pemantauan lingkungan (suhu, kelembaban, kualitas udara)
• Pelacakan kepadatan pengunjung (privacy-preserving)
• Optimasi konsumsi energi
• Sistem alert real-time

**Integrasi SCADA:**
• Dashboard kontrol dan monitoring terpusat
• Pelacakan kesehatan perangkat dan maintenance prediktif
• Respons otomatis terhadap pelanggaran ambang batas
• Analisis dan pelaporan data historis
• Integrasi dengan blockchain untuk log immutable

**Pipeline Data:**
• Edge computing untuk pemrosesan real-time
• Streaming gRPC untuk komunikasi latensi rendah
• Validasi data dan deteksi anomali
• Blockchain anchoring untuk event kritis
• Teknik agregasi privacy-preserving

**Langkah Keamanan:**
• Autentikasi perangkat via sertifikat blockchain
• Saluran komunikasi terenkripsi
• Audit keamanan reguler
• Mekanisme deteksi tamper
• Arsitektur zero-trust`,
        },
      },
      {
        id: 'ai-ml-layer',
        title: {
          en: 'AI & ML Layer',
          id: 'Layer AI & ML',
        },
        content: {
          en: `**Machine Learning Models:**
• Recommendation Engine: Collaborative filtering + Content-based
• Trip Optimization: Genetic algorithms for route planning
• Price Prediction: Time-series forecasting (LSTM)
• Sentiment Analysis: NLP for review processing
• Anomaly Detection: Isolation Forest for fraud detection

**AI-Powered Features:**
• Intelligent itinerary generation based on preferences
• Real-time chatbot assistance (multilingual)
• Dynamic pricing optimization
• Personalized content recommendations
• Predictive maintenance for IoT devices

**Model Training & Deployment:**
• Training data: 5M+ anonymized booking records
• Accuracy metrics: 85-92% across different models
• Model versioning and A/B testing
• Continuous learning from user interactions
• Edge deployment for low-latency inference

**Privacy & Ethics:**
• Federated learning for privacy preservation
• Differential privacy in data aggregation
• Bias detection and mitigation
• Transparent AI decision-making
• User control over data usage`,
          id: `**Model Machine Learning:**
• Recommendation Engine: Collaborative filtering + Content-based
• Optimasi Perjalanan: Algoritma genetik untuk perencanaan rute
• Prediksi Harga: Forecasting time-series (LSTM)
• Analisis Sentimen: NLP untuk pemrosesan ulasan
• Deteksi Anomali: Isolation Forest untuk deteksi fraud

**Fitur Bertenaga AI:**
• Generasi itinerary cerdas berdasarkan preferensi
• Bantuan chatbot real-time (multibahasa)
• Optimasi pricing dinamis
• Rekomendasi konten personal
• Maintenance prediktif untuk perangkat IoT

**Training & Deployment Model:**
• Data training: 5 juta+ catatan booking anonim
• Metrik akurasi: 85-92% di berbagai model
• Versioning model dan A/B testing
• Pembelajaran berkelanjutan dari interaksi pengguna
• Deployment edge untuk inferensi latensi rendah

**Privasi & Etika:**
• Federated learning untuk preservasi privasi
• Differential privacy dalam agregasi data
• Deteksi dan mitigasi bias
• Pengambilan keputusan AI transparan
• Kontrol pengguna atas penggunaan data`,
        },
      },
    ],
  },
  {
    id: 'use-cases',
    title: {
      en: 'Use Cases & User Journeys',
      id: 'Use Case & User Journey',
    },
    content: {
      en: `STC Ultimate serves multiple stakeholders with tailored experiences for each user type. Below are detailed journey maps showcasing how different personas interact with the platform.`,
      id: `STC Ultimate melayani berbagai stakeholder dengan pengalaman khusus untuk setiap tipe pengguna. Berikut adalah journey map detail yang menampilkan bagaimana berbagai persona berinteraksi dengan platform.`,
    },
    subsections: [
      {
        id: 'tourist-journey',
        title: {
          en: 'Tourist Journey: Sarah from Australia',
          id: 'Perjalanan Turis: Sarah dari Australia',
        },
        content: {
          en: `**Before Trip:**
1. Discovery: Sarah searches for "Bali sustainable tourism" on STC Ultimate
2. AI Planning: Receives personalized 7-day itinerary based on preferences
3. Package Builder: Customizes package (hotels, activities, transportation)
4. Web3 Payment: Connects wallet, pays with ETH/CBDC with 2% cashback in loyalty NFTs
5. Pre-trip Prep: Downloads mobile app, receives QR codes for bookings

**During Trip:**
1. Arrival: QR code scanned at airport, seamless check-in
2. IoT Experience: Real-time notifications (weather, crowd levels, local events)
3. AR Navigation: Uses AR overlays for cultural site information
4. Smart Payments: Contactless payments at vendors, automatic receipts
5. Rewards: Earns achievement NFTs for visiting heritage sites

**After Trip:**
1. Review: Shares experience, earns bonus tokens
2. Photos: Mints photo NFT collection as travel memoir
3. Loyalty: Receives 10% discount token for next booking
4. Community: Joins STC DAO, votes on new destination features
5. Referral: Invites friends, earns referral NFTs

**Value Delivered:**
• 25% cost savings vs traditional booking
• Zero fraud incidents
• Seamless cross-vendor experiences
• Personalized recommendations
• Lasting digital memorabilia`,
          id: `**Sebelum Perjalanan:**
1. Discovery: Sarah mencari "pariwisata berkelanjutan Bali" di STC Ultimate
2. Perencanaan AI: Menerima itinerary 7 hari personal berdasarkan preferensi
3. Package Builder: Menyesuaikan paket (hotel, aktivitas, transportasi)
4. Pembayaran Web3: Menghubungkan wallet, bayar dengan ETH/CBDC dengan cashback 2% dalam loyalty NFT
5. Persiapan Pra-perjalanan: Unduh aplikasi mobile, terima QR code untuk booking

**Selama Perjalanan:**
1. Kedatangan: QR code dipindai di bandara, check-in mulus
2. Pengalaman IoT: Notifikasi real-time (cuaca, tingkat keramaian, acara lokal)
3. Navigasi AR: Gunakan overlay AR untuk informasi situs budaya
4. Pembayaran Pintar: Pembayaran contactless di vendor, tanda terima otomatis
5. Reward: Dapatkan achievement NFT untuk mengunjungi situs warisan

**Setelah Perjalanan:**
1. Ulasan: Bagikan pengalaman, dapatkan bonus token
2. Foto: Mint koleksi foto NFT sebagai kenangan perjalanan
3. Loyalitas: Terima token diskon 10% untuk booking berikutnya
4. Komunitas: Gabung STC DAO, voting fitur destinasi baru
5. Referral: Ajak teman, dapatkan referral NFT

**Nilai yang Diberikan:**
• Penghematan biaya 25% vs booking tradisional
• Nol insiden fraud
• Pengalaman cross-vendor mulus
• Rekomendasi personal
• Memorabilia digital abadi`,
        },
      },
      {
        id: 'sme-journey',
        title: {
          en: 'SME Journey: Budi\'s Homestay Business',
          id: 'Perjalanan UMKM: Bisnis Homestay Budi',
        },
        content: {
          en: `**Onboarding:**
1. Registration: Budi registers his homestay on STC Ultimate
2. KYC Process: Verifies business credentials via blockchain
3. Listing Setup: Creates property listing with 360° photos
4. Smart Contract: Deploys automated booking contract
5. Training: Completes onboarding tutorials

**Operations:**
1. Direct Bookings: Receives bookings without intermediary fees
2. Instant Payments: Gets paid automatically via smart contracts
3. IoT Integration: Installs basic sensors for guest comfort monitoring
4. Analytics: Views real-time occupancy and revenue dashboards
5. Marketing: Leverages platform marketing (no additional cost)

**Growth:**
1. Customer Insights: Accesses anonymized visitor analytics
2. Dynamic Pricing: AI suggests optimal pricing strategies
3. Loyalty Program: Offers exclusive NFT perks to repeat guests
4. Community Network: Collaborates with other local businesses
5. Capital Access: Stakes tokens for working capital loans

**Results After 1 Year:**
• Revenue increase: 180% compared to OTA-dependent model
• Commission savings: $12,000 annually
• Customer retention: 45% (vs 15% previously)
• Average rating: 4.8/5 stars
• Community involvement: Active DAO participant`,
          id: `**Onboarding:**
1. Registrasi: Budi mendaftarkan homestay-nya di STC Ultimate
2. Proses KYC: Verifikasi kredensial bisnis via blockchain
3. Setup Listing: Buat listing properti dengan foto 360°
4. Smart Contract: Deploy kontrak booking otomatis
5. Training: Selesaikan tutorial onboarding

**Operasional:**
1. Booking Langsung: Terima booking tanpa biaya perantara
2. Pembayaran Instan: Dibayar otomatis via smart contract
3. Integrasi IoT: Pasang sensor dasar untuk monitoring kenyamanan tamu
4. Analitik: Lihat dashboard okupansi dan revenue real-time
5. Marketing: Manfaatkan marketing platform (tanpa biaya tambahan)

**Pertumbuhan:**
1. Wawasan Pelanggan: Akses analitik pengunjung anonim
2. Dynamic Pricing: AI menyarankan strategi pricing optimal
3. Program Loyalitas: Tawarkan perk NFT eksklusif untuk tamu berulang
4. Jaringan Komunitas: Kolaborasi dengan bisnis lokal lain
5. Akses Modal: Stake token untuk pinjaman modal kerja

**Hasil Setelah 1 Tahun:**
• Peningkatan revenue: 180% dibanding model bergantung OTA
• Penghematan komisi: $12.000 per tahun
• Retensi pelanggan: 45% (vs 15% sebelumnya)
• Rating rata-rata: 4,8/5 bintang
• Keterlibatan komunitas: Partisipan DAO aktif`,
        },
      },
    ],
  },
  {
    id: 'tokenomics',
    title: {
      en: 'Tokenomics & Economic Model',
      id: 'Tokenomik & Model Ekonomi',
    },
    content: {
      en: `STC Ultimate employs a dual-token system designed for utility and governance, integrated with Indonesian CBDC for seamless fiat transactions.`,
      id: `STC Ultimate menggunakan sistem dual-token yang dirancang untuk utilitas dan governance, terintegrasi dengan CBDC Indonesia untuk transaksi fiat mulus.`,
    },
    subsections: [
      {
        id: 'token-utility',
        title: {
          en: 'Token Utility',
          id: 'Utilitas Token',
        },
        content: {
          en: `**STC Token (Utility):**
• Platform payments and bookings
• Staking for benefits (discounts, priority access)
• Reward distribution to users
• Fee discounts (up to 50% for stakers)
• Access to premium features
• NFT minting and marketplace transactions

**Loyalty NFTs:**
• Unique achievement badges
• Access to exclusive experiences
• Tiered benefits (Bronze, Silver, Gold, Platinum)
• Tradeable on secondary marketplace
• Redeemable for real-world perks
• Proof of experience verification

**CBDC Integration:**
• Seamless IDR payments via Indonesian CBDC
• Instant settlement without volatility
• Regulatory compliance
• Traditional banking integration
• Real-time conversion to crypto assets
• Lower transaction fees`,
          id: `**Token STC (Utilitas):**
• Pembayaran dan booking platform
• Staking untuk benefit (diskon, akses prioritas)
• Distribusi reward ke pengguna
• Diskon biaya (hingga 50% untuk staker)
• Akses ke fitur premium
• Minting NFT dan transaksi marketplace

**Loyalty NFT:**
• Badge pencapaian unik
• Akses ke pengalaman eksklusif
• Benefit bertingkat (Bronze, Silver, Gold, Platinum)
• Dapat diperdagangkan di marketplace sekunder
• Dapat ditukar dengan perk dunia nyata
• Verifikasi bukti pengalaman

**Integrasi CBDC:**
• Pembayaran IDR mulus via CBDC Indonesia
• Penyelesaian instan tanpa volatilitas
• Compliance regulasi
• Integrasi perbankan tradisional
• Konversi real-time ke aset kripto
• Biaya transaksi lebih rendah`,
        },
      },
      {
        id: 'economic-model',
        title: {
          en: 'Economic Sustainability Model',
          id: 'Model Keberlanjutan Ekonomi',
        },
        content: {
          en: `**Revenue Streams:**
• Platform fees: 2-5% per transaction (vs 15-30% traditional)
• Premium features subscriptions
• NFT marketplace transaction fees (2.5%)
• IoT sensor data licensing
• API access for third-party developers
• Advertising from verified partners

**Token Economics:**
• Initial supply: 1 billion STC tokens
• Circulating at launch: 200 million (20%)
• Distribution:
  - Community rewards: 40%
  - Team & advisors: 15% (4-year vesting)
  - Ecosystem development: 25%
  - Public sale: 10%
  - Strategic partners: 10%

**Burn Mechanisms:**
• 1% of transaction fees burned quarterly
• NFT minting burns small STC amount
• Governance proposal submissions require stake
• Reduces inflation and increases scarcity

**Staking Rewards:**
• Base APY: 8-12% depending on lock period
• Bonus APY for DAO participation: +2-5%
• Early staker bonuses
• No penalties for unstaking after lock period`,
          id: `**Sumber Revenue:**
• Biaya platform: 2-5% per transaksi (vs 15-30% tradisional)
• Langganan fitur premium
• Biaya transaksi marketplace NFT (2,5%)
• Lisensi data sensor IoT
• Akses API untuk developer pihak ketiga
• Iklan dari partner terverifikasi

**Ekonomi Token:**
• Supply awal: 1 miliar token STC
• Beredar saat peluncuran: 200 juta (20%)
• Distribusi:
  - Community reward: 40%
  - Tim & advisor: 15% (vesting 4 tahun)
  - Pengembangan ekosistem: 25%
  - Public sale: 10%
  - Partner strategis: 10%

**Mekanisme Burn:**
• 1% dari biaya transaksi dibakar triwulanan
• Minting NFT membakar jumlah STC kecil
• Pengajuan proposal governance memerlukan stake
• Mengurangi inflasi dan meningkatkan kelangkaan

**Reward Staking:**
• APY dasar: 8-12% tergantung periode lock
• Bonus APY untuk partisipasi DAO: +2-5%
• Bonus staker awal
• Tanpa penalti untuk unstaking setelah periode lock`,
        },
      },
    ],
  },
  {
    id: 'governance',
    title: {
      en: 'DAO Governance',
      id: 'Governance DAO',
    },
    content: {
      en: `STC Ultimate is governed by a decentralized autonomous organization (DAO) that empowers community members to shape the platform's future through democratic decision-making.`,
      id: `STC Ultimate dikelola oleh organisasi otonom terdesentralisasi (DAO) yang memberdayakan anggota komunitas untuk membentuk masa depan platform melalui pengambilan keputusan demokratis.`,
    },
    subsections: [
      {
        id: 'governance-structure',
        title: {
          en: 'Governance Structure',
          id: 'Struktur Governance',
        },
        content: {
          en: `**Voting Mechanisms:**
• Token-weighted voting (1 STC = 1 vote)
• Quadratic voting for community proposals
• Delegation system for passive holders
• Time-locked voting to prevent manipulation
• Multi-sig execution for approved proposals

**Proposal Types:**
• Feature requests and platform improvements
• Treasury allocation decisions
• Partnership and collaboration proposals
• Parameter adjustments (fees, rewards, etc.)
• Emergency response actions

**Governance Process:**
1. Proposal submission (requires 10,000 STC stake)
2. Community discussion period (7 days)
3. Voting period (5 days)
4. Quorum requirement: 10% of circulating supply
5. Execution via time-locked smart contract (3 days)

**Treasury Management:**
• Multi-signature wallet (5/7 signers)
• Transparent on-chain treasury
• Quarterly budget proposals
• Community-driven allocation
• Emergency fund (10% of treasury)`,
          id: `**Mekanisme Voting:**
• Voting berbobot token (1 STC = 1 vote)
• Quadratic voting untuk proposal komunitas
• Sistem delegasi untuk holder pasif
• Voting time-locked untuk mencegah manipulasi
• Eksekusi multi-sig untuk proposal disetujui

**Tipe Proposal:**
• Permintaan fitur dan perbaikan platform
• Keputusan alokasi treasury
• Proposal kemitraan dan kolaborasi
• Penyesuaian parameter (biaya, reward, dll.)
• Tindakan respons darurat

**Proses Governance:**
1. Pengajuan proposal (memerlukan stake 10.000 STC)
2. Periode diskusi komunitas (7 hari)
3. Periode voting (5 hari)
4. Persyaratan quorum: 10% dari supply beredar
5. Eksekusi via smart contract time-locked (3 hari)

**Manajemen Treasury:**
• Dompet multi-signature (5/7 penandatangan)
• Treasury on-chain transparan
• Proposal anggaran triwulanan
• Alokasi berbasis komunitas
• Dana darurat (10% dari treasury)`,
        },
      },
    ],
  },
  {
    id: 'security',
    title: {
      en: 'Security & Compliance',
      id: 'Keamanan & Compliance',
    },
    content: {
      en: `Security is paramount in STC Ultimate. The platform implements multiple layers of protection to ensure user safety, data integrity, and regulatory compliance.`,
      id: `Keamanan adalah hal terpenting di STC Ultimate. Platform menerapkan berbagai lapisan perlindungan untuk memastikan keselamatan pengguna, integritas data, dan compliance regulasi.`,
    },
    subsections: [
      {
        id: 'blockchain-security',
        title: {
          en: 'Blockchain Security',
          id: 'Keamanan Blockchain',
        },
        content: {
          en: `**Smart Contract Security:**
• Audited by leading firms (CertiK, OpenZeppelin)
• Formal verification of critical functions
• Bug bounty program ($50K-500K rewards)
• Upgrade mechanism with time-lock
• Emergency pause functionality

**Vulnerability Mitigation:**
• Reentrancy attack protection
• Integer overflow/underflow guards
• Access control via role-based permissions
• Front-running prevention
• Flash loan attack resistance

**Incident Response:**
• 24/7 security monitoring
• Automated alert systems
• Rapid response team
• Insurance coverage ($10M)
• Post-mortem and disclosure policy`,
          id: `**Keamanan Smart Contract:**
• Diaudit oleh perusahaan terkemuka (CertiK, OpenZeppelin)
• Verifikasi formal fungsi kritis
• Program bug bounty (reward $50K-500K)
• Mekanisme upgrade dengan time-lock
• Fungsi pause darurat

**Mitigasi Kerentanan:**
• Perlindungan serangan reentrancy
• Guard integer overflow/underflow
• Kontrol akses via permission berbasis peran
• Pencegahan front-running
• Ketahanan serangan flash loan

**Respons Insiden:**
• Monitoring keamanan 24/7
• Sistem alert otomatis
• Tim respons cepat
• Cakupan asuransi ($10 juta)
• Kebijakan post-mortem dan disclosure`,
        },
      },
      {
        id: 'compliance',
        title: {
          en: 'Regulatory Compliance',
          id: 'Compliance Regulasi',
        },
        content: {
          en: `**Indonesian Regulations:**
• Bank Indonesia (BI) digital currency regulations
• OJK (Financial Services Authority) compliance
• Kominfo data protection requirements
• Tourism Law No. 10/2009 alignment
• Anti-Money Laundering (AML) procedures

**International Standards:**
• GDPR compliance for EU tourists
• CCPA compliance for US users
• ISO 27001 (Information Security Management)
• PCI DSS for payment processing
• SOC 2 Type II certification (in progress)

**Data Privacy:**
• End-to-end encryption
• Anonymization of personal data
• Right to be forgotten (GDPR)
• User consent management
• Regular privacy audits`,
          id: `**Regulasi Indonesia:**
• Regulasi mata uang digital Bank Indonesia (BI)
• Compliance OJK (Otoritas Jasa Keuangan)
• Persyaratan perlindungan data Kominfo
• Alignment Undang-Undang Pariwisata No. 10/2009
• Prosedur Anti-Money Laundering (AML)

**Standar Internasional:**
• Compliance GDPR untuk turis EU
• Compliance CCPA untuk pengguna AS
• ISO 27001 (Manajemen Keamanan Informasi)
• PCI DSS untuk pemrosesan pembayaran
• Sertifikasi SOC 2 Type II (dalam proses)

**Privasi Data:**
• Enkripsi end-to-end
• Anonimisasi data pribadi
• Right to be forgotten (GDPR)
• Manajemen consent pengguna
• Audit privasi reguler`,
        },
      },
    ],
  },
  {
    id: 'roadmap',
    title: {
      en: 'Roadmap & Milestones',
      id: 'Roadmap & Milestone',
    },
    content: {
      en: `Our phased approach ensures sustainable growth while continuously delivering value to users.`,
      id: `Pendekatan bertahap kami memastikan pertumbuhan berkelanjutan sambil terus memberikan nilai kepada pengguna.`,
    },
    subsections: [
      {
        id: 'roadmap-2025-2026',
        title: {
          en: '2025-2026: Foundation & MVP',
          id: '2025-2026: Foundation & MVP',
        },
        content: {
          en: `**Q3 2025: Prototype Development**
• Core blockchain infrastructure deployment
• IoT sensor pilot in 3 locations (Bali, Yogyakarta, Jakarta)
• Basic package builder and payment system
• Web3 wallet integration
• Community onboarding begins

**Q4 2025: Alpha Testing**
• Invite 100 early adopters for testing
• Smart contract security audits
• AI recommendation engine v1
• Mobile app development
• Partnership agreements with 20 SMEs

**Q1 2026: MVP Launch**
• Public platform launch (Sepolia testnet)
• 500+ tourist packages available
• NFT loyalty program activation
• DAO governance initialization
• Marketing campaign begins

**Q2 2026: Expansion**
• Integration with 50+ hotels and homestays
• IoT network expansion to 10 destinations
• Metaverse VR tours launch
• Base Mainnet migration
• Token public sale`,
          id: `**Q3 2025: Pengembangan Prototype**
• Deployment infrastruktur blockchain inti
• Pilot sensor IoT di 3 lokasi (Bali, Yogyakarta, Jakarta)
• Package builder dasar dan sistem pembayaran
• Integrasi wallet Web3
• Onboarding komunitas dimulai

**Q4 2025: Alpha Testing**
• Undang 100 early adopter untuk testing
• Audit keamanan smart contract
• AI recommendation engine v1
• Pengembangan aplikasi mobile
• Perjanjian kemitraan dengan 20 UMKM

**Q1 2026: Peluncuran MVP**
• Peluncuran platform publik (Sepolia testnet)
• 500+ paket wisata tersedia
• Aktivasi program loyalitas NFT
• Inisialisasi governance DAO
• Kampanye marketing dimulai

**Q2 2026: Ekspansi**
• Integrasi dengan 50+ hotel dan homestay
• Ekspansi jaringan IoT ke 10 destinasi
• Peluncuran tur VR metaverse
• Migrasi Base Mainnet
• Token public sale`,
        },
      },
      {
        id: 'roadmap-2027-2030',
        title: {
          en: '2027-2030: Scale & Domination',
          id: '2027-2030: Skala & Dominasi',
        },
        content: {
          en: `**Q3 2026: Pilot Testing**
• Full testing with government tourism boards
• 1,000+ active users
• Cross-chain functionality (Polygon integration)
• AR features for mobile
• Research tools activation

**2027: National Expansion**
• Coverage of 50+ major tourist destinations
• 100,000+ registered users
• 5,000+ SME partners
• Government MOU with 10 provinces
• International tourist onboarding

**2028: Regional Leadership**
• ASEAN expansion (Thailand, Singapore, Malaysia)
• 1M+ users across Southeast Asia
• Multi-language support (10+ languages)
• Advanced AI features (trip planning 2.0)
• Carbon offset integration

**2029-2030: Global Vision**
• Global expansion (target: 10M users)
• Interoperability with international tourism platforms
• STC Protocol as industry standard
• Blockchain tourism consortium
• Indonesia as #1 smart tourism destination`,
          id: `**Q3 2026: Pilot Testing**
• Testing penuh dengan dinas pariwisata pemerintah
• 1.000+ pengguna aktif
• Fungsi cross-chain (integrasi Polygon)
• Fitur AR untuk mobile
• Aktivasi tool penelitian

**2027: Ekspansi Nasional**
• Cakupan 50+ destinasi wisata utama
• 100.000+ pengguna terdaftar
• 5.000+ partner UMKM
• MOU pemerintah dengan 10 provinsi
• Onboarding turis internasional

**2028: Kepemimpinan Regional**
• Ekspansi ASEAN (Thailand, Singapura, Malaysia)
• 1 juta+ pengguna di Asia Tenggara
• Dukungan multi-bahasa (10+ bahasa)
• Fitur AI advanced (trip planning 2.0)
• Integrasi carbon offset

**2029-2030: Visi Global**
• Ekspansi global (target: 10 juta pengguna)
• Interoperabilitas dengan platform pariwisata internasional
• STC Protocol sebagai standar industri
• Konsorsium pariwisata blockchain
• Indonesia sebagai destinasi smart tourism #1`,
        },
      },
    ],
  },
  {
    id: 'team',
    title: {
      en: 'Team & Ecosystem',
      id: 'Tim & Ekosistem',
    },
    content: {
      en: `STC Ultimate is built by a diverse team of blockchain engineers, tourism experts, AI researchers, and business strategists, supported by strategic partners and advisors.`,
      id: `STC Ultimate dibangun oleh tim beragam yang terdiri dari engineer blockchain, ahli pariwisata, peneliti AI, dan strategis bisnis, didukung oleh partner strategis dan advisor.`,
    },
    subsections: [
      {
        id: 'core-team',
        title: {
          en: 'Core Team',
          id: 'Tim Inti',
        },
        content: {
          en: `**Founders:**
• ELPEEF - Technology & Product
• RANTAI - Blockchain Architecture & Research

**Technical Team:**
• Blockchain Engineers (5)
• AI/ML Specialists (3)
• IoT & Hardware Engineers (4)
• Full-stack Developers (8)
• QA & Security Auditors (3)

**Business & Operations:**
• Tourism Industry Advisors (4)
• Marketing & Community (3)
• Legal & Compliance (2)
• Partnership & BD (3)`,
          id: `**Founder:**
• ELPEEF - Teknologi & Produk
• RANTAI - Arsitektur Blockchain & Penelitian

**Tim Teknis:**
• Engineer Blockchain (5)
• Spesialis AI/ML (3)
• Engineer IoT & Hardware (4)
• Developer Full-stack (8)
• QA & Auditor Keamanan (3)

**Bisnis & Operasi:**
• Advisor Industri Pariwisata (4)
• Marketing & Komunitas (3)
• Legal & Compliance (2)
• Partnership & BD (3)`,
        },
      },
      {
        id: 'partners',
        title: {
          en: 'Strategic Partners',
          id: 'Partner Strategis',
        },
        content: {
          en: `**Academic Partners:**
• Leading Indonesian universities for research collaboration
• AI labs for machine learning model development
• Tourism research institutes

**Technology Partners:**
• Blockchain infrastructure providers
• Cloud computing partners (AWS, GCP)
• IoT hardware manufacturers
• Payment gateway providers

**Tourism Partners:**
• Tourism boards and government agencies
• Hotel chains and accommodation networks
• Transportation providers
• Cultural heritage organizations

**Ecosystem Collaborators:**
• Other blockchain tourism projects
• Web3 developer communities
• NFT marketplaces
• DeFi protocols for financial services`,
          id: `**Partner Akademik:**
• Universitas terkemuka Indonesia untuk kolaborasi penelitian
• Lab AI untuk pengembangan model machine learning
• Institut penelitian pariwisata

**Partner Teknologi:**
• Penyedia infrastruktur blockchain
• Partner cloud computing (AWS, GCP)
• Manufaktur hardware IoT
• Penyedia payment gateway

**Partner Pariwisata:**
• Dinas pariwisata dan lembaga pemerintah
• Jaringan hotel dan akomodasi
• Penyedia transportasi
• Organisasi warisan budaya

**Kolaborator Ekosistem:**
• Proyek pariwisata blockchain lainnya
• Komunitas developer Web3
• Marketplace NFT
• Protokol DeFi untuk layanan finansial`,
        },
      },
    ],
  },
  {
    id: 'conclusion',
    title: {
      en: 'Conclusion',
      id: 'Kesimpulan',
    },
    content: {
      en: `STC Ultimate represents more than just a technology platform—it's a vision for the future of tourism in Indonesia and beyond. By combining blockchain's transparency and security, IoT's real-time capabilities, AI's intelligence, and XR's immersive experiences, we create a comprehensive ecosystem that benefits all stakeholders.

Our commitment extends beyond technology implementation. We aim to:
• Empower local communities and SMEs through direct market access
• Preserve and promote Indonesia's rich cultural heritage via digital twins
• Enable sustainable tourism through data-driven resource management
• Foster innovation through open governance and community participation
• Establish Indonesia as the global leader in smart tourism

The journey to "Indonesia Smart Tourism 2030+" begins with STC Ultimate. We invite investors, partners, developers, and tourism enthusiasts to join us in building the future of travel.

Together, we will transform tourism into a transparent, efficient, and enriching experience for everyone.`,
      id: `STC Ultimate merepresentasikan lebih dari sekadar platform teknologi—ini adalah visi untuk masa depan pariwisata di Indonesia dan sekitarnya. Dengan menggabungkan transparansi dan keamanan blockchain, kapabilitas real-time IoT, kecerdasan AI, dan pengalaman immersive XR, kami menciptakan ekosistem komprehensif yang menguntungkan semua stakeholder.

Komitmen kami melampaui implementasi teknologi. Kami bertujuan untuk:
• Memberdayakan komunitas lokal dan UMKM melalui akses pasar langsung
• Melestarikan dan mempromosikan warisan budaya Indonesia yang kaya via digital twin
• Memungkinkan pariwisata berkelanjutan melalui manajemen sumber daya berbasis data
• Mendorong inovasi melalui governance terbuka dan partisipasi komunitas
• Menjadikan Indonesia sebagai pemimpin global dalam smart tourism

Perjalanan menuju "Indonesia Smart Tourism 2030+" dimulai dengan STC Ultimate. Kami mengundang investor, partner, developer, dan penggemar pariwisata untuk bergabung dengan kami dalam membangun masa depan perjalanan.

Bersama, kita akan mentransformasi pariwisata menjadi pengalaman transparan, efisien, dan memperkaya untuk semua orang.`,
    },
  },
];

export function getContentByLanguage(
  section: WhitepaperSection,
  language: 'en' | 'id'
): { title: string; content: string } {
  return {
    title: section.title[language],
    content: section.content[language],
  };
}

export function searchContent(query: string, language: 'en' | 'id'): WhitepaperSection[] {
  const results: WhitepaperSection[] = [];
  const lowerQuery = query.toLowerCase();

  function searchRecursive(section: WhitepaperSection): void {
    const titleMatch = section.title[language].toLowerCase().includes(lowerQuery);
    const contentMatch = section.content[language].toLowerCase().includes(lowerQuery);

    if (titleMatch || contentMatch) {
      results.push(section);
    }

    if (section.subsections) {
      section.subsections.forEach(searchRecursive);
    }
  }

  whitepaperContent.forEach(searchRecursive);
  return results;
}
