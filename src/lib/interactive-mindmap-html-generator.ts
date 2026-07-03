// Interactive HTML Mindmap Generator for STC Ultimate
// Generates standalone HTML file with click interactions and detail panels

export interface ModuleDetail {
  id: string
  name: string
  icon: string
  description: string
  keyFeatures: string[]
  useCases: string[]
  techStack: string[]
  integrations: string[]
  subMindmap: string
}

export const moduleDetails: Record<string, ModuleDetail> = {
  tourism: {
    id: 'tourism',
    name: 'Tourism Module',
    icon: '🧳',
    description: 'Comprehensive tourism management system enabling tourists to create custom packages, make payments with CBDC, track journeys with IoT integration, and earn loyalty rewards.',
    keyFeatures: [
      'Custom Package Builder with collaborative planning',
      'Multi-currency CBDC Payment Integration',
      'Real-time IoT-based Journey Tracking',
      'GPS-verified Location Services',
      'NFT-based Loyalty & Reward System'
    ],
    useCases: [
      'Tourist creates custom Bali tour package with budget optimizer',
      'Real-time tracking during heritage site visits with IoT sensors',
      'Earn NFT badges for completing cultural experiences'
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Web3.js', 'GPS API', 'CBDC Integration'],
    integrations: ['Blockchain', 'IoT Network', 'AI Recommendations', 'NFT Rewards'],
    subMindmap: `mindmap
  root((🧳 Tourism))
    Package Builder
      Custom Itineraries
      Budget Calculator
      Multi-destination
      Template Library
    Smart Payments
      CBDC Integration
      Multi-currency
      Escrow Service
    IoT Services
      Smart Transportation
      Real-time Tracking
      Crowd Management
    Journey Tracking
      GPS Integration
      Timeline View
      Memory NFTs
    Loyalty System
      Reward Points
      Partner Discounts
      Token Incentives`
  },
  blockchain: {
    id: 'blockchain',
    name: 'Blockchain Module',
    icon: '⛓️',
    description: 'Decentralized infrastructure powering secure transactions, smart contracts, multi-chain interoperability, and CBDC integration for the Indonesian tourism ecosystem.',
    keyFeatures: [
      'Smart Contract Automation (Escrow, Refunds, Multi-sig)',
      'Multi-chain Support (Ethereum, Base, L2 Scaling)',
      'Byzantine Fault Tolerant Consensus',
      'Indonesian Rupiah Digital (CBDC) Integration',
      'SIWE Protocol & Multi-wallet Authentication'
    ],
    useCases: [
      'Tourist payment held in escrow until service completion',
      'Cross-chain asset transfer between Ethereum and Base',
      'Government-backed CBDC transactions for tourism payments'
    ],
    techStack: ['Solidity', 'Ethereum', 'Base', 'Web3.js', 'Hardhat', 'IPFS'],
    integrations: ['Tourism Payments', 'IoT Oracles', 'DAO Governance', 'NFT Minting'],
    subMindmap: `mindmap
  root((⛓️ Blockchain))
    Smart Contracts
      Payment Logic
      Escrow System
      Automated Refunds
      Multi-sig Wallets
    Multi-chain
      Ethereum Sepolia
      Base Mainnet
      Cross-chain Bridge
      Layer 2 Scaling
    Consensus
      Proof of Stake
      Validator Network
      Byzantine Fault Tolerance
    CBDC Integration
      Indonesian Rupiah Digital
      Bank Indonesia API
      Instant Settlement
    Web3 Auth
      Wallet Connect
      MetaMask
      SIWE Protocol`
  },
  iot: {
    id: 'iot',
    name: 'IoT Network Module',
    icon: '📡',
    description: 'Real-time sensor network infrastructure providing environmental monitoring, crowd management, and blockchain-verified data for smart tourism destinations.',
    keyFeatures: [
      'Temperature, Air Quality, Crowd Density Sensors',
      'Real-time Data Streaming with Edge Computing',
      'SCADA System for Industrial IoT Integration',
      'Blockchain Oracles for Data Verification',
      'Centralized Device Management & Security'
    ],
    useCases: [
      'Monitor crowd density at Borobudur Temple in real-time',
      'Air quality alerts for tourists with respiratory conditions',
      'Energy optimization for smart hotel infrastructure'
    ],
    techStack: ['gRPC', 'MQTT', 'LoRaWAN', 'Edge Computing', 'Blockchain Oracles'],
    integrations: ['Blockchain Verification', 'AI Analytics', 'Tourism Tracking', 'SCADA'],
    subMindmap: `mindmap
  root((📡 IoT Network))
    Sensors
      Temperature
      Air Quality
      Crowd Density
      Traffic Flow
    Real-time Data
      Live Streaming
      Edge Computing
      Low Latency
      5G Integration
    SCADA System
      Supervisory Control
      Data Acquisition
      Alert System
    Blockchain Integration
      IoT Oracles
      Data Verification
      Immutable Logs
    Device Management
      Registration
      Monitoring
      Security Patches`
  },
  ai: {
    id: 'ai',
    name: 'AI & ML Module',
    icon: '🤖',
    description: 'Intelligent recommendation system powered by machine learning for personalized trip planning, predictive analytics, and 24/7 multilingual chatbot assistance.',
    keyFeatures: [
      'AI-powered Trip Planner with Route Optimization',
      'Hybrid Recommendation Engine (Collaborative + Content-based)',
      'Predictive Analytics (Demand, Pricing, Fraud Detection)',
      'Deep Learning Models for Image Recognition',
      'Natural Language Chatbot with Voice Integration'
    ],
    useCases: [
      'AI suggests optimal 7-day Bali itinerary based on weather & crowds',
      'Predict peak tourism seasons for hotel pricing optimization',
      'Chatbot assists tourists in 10+ languages with cultural insights'
    ],
    techStack: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
    integrations: ['Tourism Planning', 'Analytics Dashboard', 'Research Tools', 'IoT Data'],
    subMindmap: `mindmap
  root((🤖 AI & ML))
    Trip Planner
      AI Recommendations
      Route Optimization
      Weather Prediction
      Budget Optimization
    Recommendations
      Collaborative Filtering
      Content-based
      Hybrid Model
      Personalization
    Analytics
      Visitor Patterns
      Revenue Insights
      Sentiment Analysis
      Trend Forecasting
    ML Models
      Demand Prediction
      Price Optimization
      Fraud Detection
      Image Recognition
    Chatbot
      Natural Language
      Multi-language
      Voice Integration
      24/7 Support`
  },
  governance: {
    id: 'governance',
    name: 'Governance Module',
    icon: '🏛️',
    description: 'Decentralized Autonomous Organization (DAO) enabling community-driven governance with weighted voting, treasury management, and regulatory compliance.',
    keyFeatures: [
      'DAO System for Decentralized Decision-making',
      'Weighted & Quadratic Voting with Delegation',
      'Multi-sig Treasury Management',
      'Proposal Submission & Impact Assessment',
      'KYC/AML & GDPR Compliance Framework'
    ],
    useCases: [
      'Community votes on new tourist destination partnerships',
      'Treasury funds allocated for heritage site preservation',
      'Stakeholders propose new loyalty reward mechanisms'
    ],
    techStack: ['Solidity', 'Snapshot', 'Gnosis Safe', 'Governance Tokens', 'Aragon'],
    integrations: ['Blockchain', 'Token System', 'Compliance', 'Community'],
    subMindmap: `mindmap
  root((🏛️ Governance))
    DAO System
      Decentralized Control
      Proposal Submission
      Vote Recording
      Execution Logic
    Token Voting
      Governance Token
      Weighted Voting
      Quadratic Voting
      Delegation
    Treasury
      Fund Management
      Budget Allocation
      Multi-sig Control
      Investment Strategy
    Proposals
      Community Ideas
      Voting Period
      Implementation
      Impact Assessment
    Compliance
      Regulatory Framework
      KYC/AML
      GDPR Compliance
      Audit Reports`
  },
  metaverse: {
    id: 'metaverse',
    name: 'Metaverse Module',
    icon: '🌐',
    description: 'Immersive virtual & augmented reality experiences enabling tourists to explore Indonesian cultural heritage through VR tours, AR navigation, and digital twin replicas.',
    keyFeatures: [
      'Virtual Reality 360° Tours of Heritage Sites',
      'Location-based AR with Historical Overlays',
      'Digital Twin City Replicas with Real-time Sync',
      'Customizable Avatars with NFT Wearables',
      'Live Streaming Virtual Events & Cultural Shows'
    ],
    useCases: [
      'Tourist explores Borobudur in VR before physical visit',
      'AR app overlays historical info when pointing at monuments',
      'Virtual conference on Indonesian tourism in digital twin Jakarta'
    ],
    techStack: ['Unity', 'Unreal Engine', 'WebXR', 'ARKit', 'ARCore', 'Three.js'],
    integrations: ['NFT Wearables', 'Tourism Planning', 'Live Events', 'Blockchain'],
    subMindmap: `mindmap
  root((🌐 Metaverse))
    VR Experiences
      Virtual Tours
      360° Videos
      Immersive Museums
      Cultural Events
    AR Features
      Location-based AR
      Object Recognition
      Historical Overlays
      Navigation Aids
    Digital Twins
      City Replicas
      Real-time Sync
      Simulation
      Planning Tools
    Avatars
      Customization
      NFT Wearables
      Social Interaction
      Cross-platform
    Live Streaming
      Virtual Events
      Cultural Shows
      Guided Tours
      Monetization`
  },
  nft: {
    id: 'nft',
    name: 'NFT & Rewards Module',
    icon: '🎨',
    description: 'Gamified reward system leveraging NFT technology for achievement badges, loyalty programs, marketplace trading, and cultural artifact collectibles.',
    keyFeatures: [
      'Dynamic Achievement NFTs with Rarity Tiers',
      'Peer-to-peer NFT Marketplace with Royalty Split',
      'Loyalty NFTs with Staking & Tier Progression',
      'Gamification (Quests, Leaderboards, Challenges)',
      'Cultural Artifact NFTs with Provenance Tracking'
    ],
    useCases: [
      'Tourist earns "Borobudur Explorer" NFT badge after visit',
      'Trade limited edition cultural artifact NFTs on marketplace',
      'Stake loyalty NFTs for exclusive hotel discounts'
    ],
    techStack: ['ERC-721', 'ERC-1155', 'IPFS', 'OpenZeppelin', 'Metadata Standards'],
    integrations: ['Tourism Loyalty', 'Metaverse Wearables', 'Marketplace', 'Blockchain'],
    subMindmap: `mindmap
  root((🎨 NFT & Rewards))
    Achievement NFTs
      Milestone Badges
      Experience Tokens
      Collector Items
      Rarity Tiers
    Marketplace
      NFT Trading
      Peer-to-peer
      Auction System
      Royalty Split
    Loyalty NFTs
      Dynamic Rewards
      Tier Progression
      Exclusive Access
      Staking Rewards
    Gamification
      Quest System
      Leaderboards
      Challenge Events
      Prize Pool
    Collectibles
      Cultural Artifacts
      Limited Editions
      Artist Collaboration
      Provenance`
  },
  research: {
    id: 'research',
    name: 'Research Module',
    icon: '🔬',
    description: 'Academic research toolkit providing data collection, statistical analysis, machine learning insights, and dissertation support for tourism & technology studies.',
    keyFeatures: [
      'Tourist Behavior & Economic Impact Data Collection',
      'Statistical Methods & Predictive Analytics Tools',
      'Citation-ready Data Export for Dissertations',
      'Interactive Dashboards with Custom Visualizations',
      'Explainable AI for Algorithm Transparency'
    ],
    useCases: [
      'PhD student analyzes tourist spending patterns with ML models',
      'Export blockchain transaction data for academic paper',
      'Create interactive heat maps for tourism flow analysis'
    ],
    techStack: ['Python', 'R', 'Jupyter', 'Pandas', 'Matplotlib', 'Scikit-learn'],
    integrations: ['AI/ML Models', 'IoT Data', 'Blockchain Analytics', 'Export Tools'],
    subMindmap: `mindmap
  root((🔬 Research))
    Data Collection
      Tourist Behavior
      Economic Impact
      Environmental Data
      Satisfaction Surveys
    Analysis Tools
      Statistical Methods
      Predictive Analytics
      Pattern Recognition
      Hypothesis Testing
    Dissertation
      Data Export
      Citation Ready
      Methodology Guide
      Ethics Compliance
    Visualizations
      Interactive Dashboards
      Heat Maps
      Network Graphs
      Time Series
    ML Insights
      Algorithm Library
      Model Training
      Feature Engineering
      Explainable AI`
  },
  export: {
    id: 'export',
    name: 'Export & Reports Module',
    icon: '📊',
    description: 'Comprehensive data export and reporting system generating professional PDFs, Excel sheets, CSV files, blockchain proofs, and compliance audit logs.',
    keyFeatures: [
      'Executive Summary PDF Reports with Branding',
      'Multi-sheet Excel with Pivot Tables & Formulas',
      'Raw CSV Data Export for Large Datasets',
      'Blockchain Transaction Proofs with Verification',
      'Compliance Audit Logs & Activity Timelines'
    ],
    useCases: [
      'Tourism office generates monthly analytics report as PDF',
      'Hotel exports booking data to Excel for financial analysis',
      'Auditor verifies transactions via blockchain proof links'
    ],
    techStack: ['jsPDF', 'ExcelJS', 'CSV Parser', 'Blockchain Explorer API'],
    integrations: ['Analytics', 'Research', 'Blockchain', 'Compliance'],
    subMindmap: `mindmap
  root((📊 Export & Reports))
    PDF Reports
      Executive Summary
      Detailed Analytics
      Visual Charts
      Branded Templates
    Excel Export
      Multi-sheet
      Pivot Tables
      Formatted Data
      Analysis Ready
    CSV Export
      Raw Data
      Clean Format
      Large Datasets
      Automated Backup
    Blockchain Proof
      Transaction Hash
      Timestamp
      Smart Contract Address
      Verification Link
    Audit Logs
      Activity Timeline
      User Actions
      System Events
      Compliance Reports`
  }
}

export function generateInteractiveHTML(): string {
  const modules = Object.values(moduleDetails)
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>STC Ultimate - Interactive Platform Architecture</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: #e2e8f0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .header {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(139, 92, 246, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header h1 {
      font-size: 2rem;
      background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
    
    .header p {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    
    .container {
      display: flex;
      height: calc(100vh - 100px);
    }
    
    .main-mindmap {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      transition: width 0.3s ease;
    }
    
    .main-mindmap.with-panel {
      width: 55%;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .module-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
      border-color: rgba(139, 92, 246, 0.6);
    }
    
    .module-card.active {
      border-color: #8b5cf6;
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
    }
    
    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .module-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 0.5rem;
    }
    
    .module-preview {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    
    .detail-panel {
      position: fixed;
      right: 0;
      top: 100px;
      width: 45%;
      height: calc(100vh - 100px);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-left: 1px solid rgba(139, 92, 246, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      z-index: 50;
    }
    
    .detail-panel.open {
      transform: translateX(0);
    }
    
    .detail-header {
      position: sticky;
      top: 0;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-bottom: 1px solid rgba(139, 92, 246, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    
    .detail-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .close-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.5);
      color: #ef4444;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    
    .close-btn:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.05);
    }
    
    .detail-content {
      padding: 1.5rem;
    }
    
    .section {
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #8b5cf6;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .section-text {
      color: #cbd5e1;
      line-height: 1.7;
      font-size: 0.95rem;
    }
    
    .feature-list, .use-case-list, .tech-list {
      list-style: none;
      padding: 0;
    }
    
    .feature-list li, .use-case-list li, .tech-list li {
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.5);
      border-left: 3px solid #8b5cf6;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    
    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tech-list li {
      border-left: none;
      background: rgba(6, 182, 212, 0.2);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #06b6d4;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      border-radius: 6px;
    }
    
    .integration-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .integration-tag {
      background: rgba(236, 72, 153, 0.2);
      border: 1px solid rgba(236, 72, 153, 0.4);
      color: #ec4899;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }
    
    .sub-mindmap {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto 2rem;
    }
    
    .stat-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 8px;
      padding: 1.25rem;
      text-align: center;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      background: linear-gradient(90deg, #06b6d4, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-label {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 0.5rem;
    }
    
    @media (max-width: 1024px) {
      .container {
        flex-direction: column;
      }
      
      .main-mindmap {
        width: 100% !important;
      }
      
      .detail-panel {
        width: 100%;
        top: 100px;
        height: calc(100vh - 100px);
      }
    }
    
    @media (max-width: 640px) {
      .header h1 {
        font-size: 1.5rem;
      }
      
      .module-grid {
        grid-template-columns: 1fr;
      }
      
      .stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 STC Ultimate Platform Architecture</h1>
    <p>Interactive mindmap - Click any module to explore detailed features, use cases, and technical stack</p>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">9</div>
      <div class="stat-label">Core Modules</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">45+</div>
      <div class="stat-label">Feature Categories</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">200+</div>
      <div class="stat-label">Individual Features</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">100%</div>
      <div class="stat-label">Web3 Native</div>
    </div>
  </div>
  
  <div class="container">
    <div class="main-mindmap" id="mainMindmap">
      <div class="module-grid">
        ${modules.map(module => `
          <div class="module-card" data-module="${module.id}" onclick="openDetail('${module.id}')">
            <span class="module-icon">${module.icon}</span>
            <div class="module-name">${module.name}</div>
            <div class="module-preview">${module.description.substring(0, 100)}...</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="detail-panel" id="detailPanel">
      <div class="detail-header">
        <div class="detail-title" id="detailTitle">
          <span id="detailIcon"></span>
          <span id="detailName"></span>
        </div>
        <button class="close-btn" onclick="closeDetail()">✕ Close</button>
      </div>
      <div class="detail-content" id="detailContent"></div>
    </div>
  </div>
  
  <script>
    // Initialize Mermaid
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#8b5cf6',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#8b5cf6',
        lineColor: '#06b6d4',
        secondaryColor: '#ec4899',
        tertiaryColor: '#06b6d4'
      }
    });
    
    // Module data
    const modules = ${JSON.stringify(moduleDetails)};
    
    let currentModule = null;
    
    function openDetail(moduleId) {
      const module = modules[moduleId];
      if (!module) return;
      
      currentModule = moduleId;
      
      // Update UI
      document.querySelectorAll('.module-card').forEach(card => {
        card.classList.toggle('active', card.dataset.module === moduleId);
      });
      
      document.getElementById('mainMindmap').classList.add('with-panel');
      document.getElementById('detailPanel').classList.add('open');
      
      // Update detail content
      document.getElementById('detailIcon').textContent = module.icon;
      document.getElementById('detailName').textContent = module.name;
      
      const content = \`
        <div class="section">
          <div class="section-title">📝 Overview</div>
          <div class="section-text">\${module.description}</div>
        </div>
        
        <div class="section">
          <div class="section-title">✨ Key Features</div>
          <ul class="feature-list">
            \${module.keyFeatures.map(feature => \`<li>\${feature}</li>\`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">📖 Use Cases</div>
          <ul class="use-case-list">
            \${module.useCases.map(useCase => \`<li>\${useCase}</li>\`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">🔧 Technology Stack</div>
          <ul class="tech-list">
            \${module.techStack.map(tech => \`<li>\${tech}</li>\`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">🔗 Integrations</div>
          <div class="integration-tags">
            \${module.integrations.map(integration => \`<span class="integration-tag">\${integration}</span>\`).join('')}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">🗺️ Detailed Architecture</div>
          <div class="sub-mindmap">
            <pre class="mermaid">\${module.subMindmap}</pre>
          </div>
        </div>
      \`;
      
      document.getElementById('detailContent').innerHTML = content;
      
      // Re-render mermaid diagrams
      mermaid.contentLoaded();
    }
    
    function closeDetail() {
      document.getElementById('mainMindmap').classList.remove('with-panel');
      document.getElementById('detailPanel').classList.remove('open');
      document.querySelectorAll('.module-card').forEach(card => {
        card.classList.remove('active');
      });
      currentModule = null;
    }
    
    // Keyboard shortcut: ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDetail();
    });
  </script>
</body>
</html>`
}