/**
 * HCPS-Tourism 5.0 Framework Configuration
 * Human Cyber-Physical Systems Integration for Smart Tourism
 */

export interface HCPSLayer {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  components: string[];
  technologies: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: string;
  interactions: string[];
  benefits: string[];
}

export interface ResearchPillar {
  id: string;
  title: string;
  description: string;
  metrics: string[];
  methods: string[];
  expectedOutcomes: string[];
}

/**
 * HCPS System Layers - Following the Cyber-Physical-Human model
 */
export const HCPS_LAYERS: HCPSLayer[] = [
  {
    id: 'physical',
    name: 'Physical Layer',
    description: 'Real-world tourism infrastructure, IoT devices, and physical touchpoints',
    color: 'green',
    icon: 'MapPin',
    components: [
      'IoT Sensors (temperature, crowd density, air quality)',
      'RFID/NFC Tags at tourist sites',
      'Smart Locks & Access Control',
      'GPS/Location Beacons',
      'Environmental Monitors',
      'QR Code Checkpoints'
    ],
    technologies: [
      'IoT Devices',
      'RFID/NFC',
      'GPS Systems',
      'Environmental Sensors',
      'Smart Infrastructure'
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber Layer',
    description: 'Digital infrastructure including blockchain, databases, and computational systems',
    color: 'blue',
    icon: 'Server',
    components: [
      'Ethereum Blockchain (Sepolia testnet)',
      'Smart Contracts for escrow & payments',
      'gRPC Data Streaming',
      'SCADA-like Monitoring System',
      'AI Virtual Assistant',
      'Decentralized Storage (IPFS)',
      'Analytics Engine'
    ],
    technologies: [
      'Blockchain (Ethereum)',
      'Smart Contracts (Solidity)',
      'gRPC / Protocol Buffers',
      'AI/ML Models',
      'Cloud Computing',
      'IPFS'
    ]
  },
  {
    id: 'human',
    name: 'Human Layer',
    description: 'User interfaces, experiences, and human-system interactions',
    color: 'purple',
    icon: 'Users',
    components: [
      'Web3 User Interface',
      'Virtual Tourism (360° panoramas)',
      'Metaverse Integration',
      'NFT-based Achievements',
      'Multi-role Access System',
      'AI Chat Assistant',
      'Mobile-responsive Interface'
    ],
    technologies: [
      'React/Next.js',
      'Three.js / React Three Fiber',
      'Web3 Wallets (MetaMask)',
      'NFT Standards (ERC-721)',
      'Progressive Web App'
    ]
  },
  {
    id: 'governance',
    name: 'Governance Layer',
    description: 'Decentralized governance, policies, and regulatory compliance',
    color: 'orange',
    icon: 'Shield',
    components: [
      'DAO Governance Structure',
      'NFT-based Voting Rights',
      'Smart Contract Auditing',
      'Dispute Resolution System',
      'Regulatory Compliance Module',
      'Stakeholder Management'
    ],
    technologies: [
      'DAO Frameworks',
      'NFT Governance',
      'Audit Tools',
      'Compliance Systems'
    ]
  }
];

/**
 * Key Stakeholders in HCPS-Tourism 5.0
 */
export const STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'tourist',
    name: 'Tourist',
    role: 'Primary End-user',
    color: 'cyan',
    icon: 'Plane',
    interactions: [
      'Book tour packages with blockchain payments',
      'Interact with IoT devices at tourist sites',
      'Experience virtual tourism & metaverse',
      'Earn rewards and NFT achievements',
      'Provide feedback for service improvement'
    ],
    benefits: [
      'Transparent pricing & instant payments',
      'Secure escrow protection',
      'Personalized recommendations',
      'Immersive virtual experiences',
      'Token-based rewards'
    ]
  },
  {
    id: 'sme',
    name: 'SME Owner',
    role: 'Service Provider',
    color: 'purple',
    icon: 'Store',
    interactions: [
      'Register services on blockchain',
      'Manage IoT device integrations',
      'Receive automated payments',
      'Access real-time analytics',
      'Participate in decentralized governance'
    ],
    benefits: [
      'Lower transaction fees',
      'Instant payment settlement',
      'Global market access',
      'Real-time performance insights',
      'Fair governance participation'
    ]
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Academic & Data Analyst',
    color: 'green',
    icon: 'BookOpen',
    interactions: [
      'Collect blockchain transaction data',
      'Analyze tourist behavior patterns',
      'Monitor IoT sensor data streams',
      'Generate research metrics',
      'Export data for academic studies'
    ],
    benefits: [
      'Access to real-world blockchain data',
      'Comprehensive analytics dashboard',
      'Data export capabilities',
      'Integration with dissertation work',
      'Transparent audit trails'
    ]
  },
  {
    id: 'admin',
    name: 'Administrator',
    role: 'System Operator',
    color: 'orange',
    icon: 'Shield',
    interactions: [
      'Monitor SCADA dashboard',
      'Manage system health',
      'Configure IoT devices',
      'Handle dispute resolution',
      'Oversee governance processes'
    ],
    benefits: [
      'Centralized control panel',
      'Real-time system monitoring',
      'Anomaly detection',
      'Emergency response tools',
      'Comprehensive audit logs'
    ]
  }
];

/**
 * Research Pillars for Tourism 5.0
 */
export const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: 'blockchain-tourism',
    title: 'Blockchain-enabled Tourism Transactions',
    description: 'Investigating the impact of blockchain technology on tourism payment systems and trust mechanisms',
    metrics: [
      'Transaction processing time',
      'Cost savings vs traditional systems',
      'User trust levels',
      'Smart contract execution accuracy',
      'Dispute resolution efficiency'
    ],
    methods: [
      'Quantitative analysis of transaction data',
      'User satisfaction surveys',
      'Cost-benefit analysis',
      'Comparative studies with traditional systems'
    ],
    expectedOutcomes: [
      'Proof of blockchain efficiency in tourism',
      'Model for decentralized tourism platforms',
      'Framework for smart contract design',
      'Guidelines for Web3 tourism adoption'
    ]
  },
  {
    id: 'iot-integration',
    title: 'IoT Integration for Real-time Tourism Management',
    description: 'Exploring IoT device integration for enhanced tourist experiences and site management',
    metrics: [
      'IoT device uptime',
      'Data streaming latency',
      'Environmental monitoring accuracy',
      'Visitor density management effectiveness',
      'Energy consumption optimization'
    ],
    methods: [
      'gRPC streaming performance tests',
      'Real-time data analysis',
      'IoT device reliability studies',
      'Environmental impact assessments'
    ],
    expectedOutcomes: [
      'Best practices for IoT deployment in tourism',
      'Real-time monitoring frameworks',
      'Energy-efficient IoT architectures',
      'Visitor experience enhancement models'
    ]
  },
  {
    id: 'virtual-tourism',
    title: 'Virtual & Metaverse Tourism Experiences',
    description: 'Evaluating the role of virtual reality and metaverse in sustainable tourism',
    metrics: [
      'User engagement in virtual tours',
      'Conversion from virtual to physical visits',
      'Accessibility improvements',
      'Carbon footprint reduction',
      'User satisfaction scores'
    ],
    methods: [
      'User experience studies',
      'A/B testing of virtual vs traditional marketing',
      'Environmental impact analysis',
      'Accessibility assessments'
    ],
    expectedOutcomes: [
      'Framework for sustainable virtual tourism',
      'Metaverse integration guidelines',
      'Accessibility standards for virtual tours',
      'Economic models for hybrid tourism'
    ]
  },
  {
    id: 'sme-empowerment',
    title: 'SME Empowerment through Web3',
    description: 'Assessing how blockchain and Web3 technologies empower small tourism businesses',
    metrics: [
      'SME adoption rates',
      'Revenue growth',
      'Market reach expansion',
      'Customer acquisition costs',
      'Business sustainability indicators'
    ],
    methods: [
      'Longitudinal business performance studies',
      'Qualitative interviews with SME owners',
      'Market analysis',
      'Financial performance tracking'
    ],
    expectedOutcomes: [
      'SME adoption framework for Web3',
      'Economic impact analysis',
      'Best practices for SME onboarding',
      'Policy recommendations for government support'
    ]
  },
  {
    id: 'governance-models',
    title: 'Decentralized Governance in Tourism Ecosystems',
    description: 'Developing and testing DAO-based governance models for tourism platforms',
    metrics: [
      'Stakeholder participation rates',
      'Voting turnout',
      'Decision implementation speed',
      'Governance satisfaction',
      'Dispute resolution effectiveness'
    ],
    methods: [
      'Governance mechanism experiments',
      'Stakeholder surveys',
      'Voting pattern analysis',
      'Comparative governance studies'
    ],
    expectedOutcomes: [
      'Tourism-specific DAO frameworks',
      'Governance best practices',
      'Stakeholder engagement models',
      'Regulatory compliance guidelines'
    ]
  }
];

/**
 * Tourism 5.0 Characteristics
 */
export const TOURISM_5_CHARACTERISTICS = {
  supersmart: {
    title: 'Super-Smart',
    description: 'AI-driven personalization and predictive analytics',
    features: [
      'AI Virtual Assistant for 24/7 support',
      'Personalized recommendations',
      'Predictive maintenance for IoT devices',
      'Intelligent routing and scheduling'
    ]
  },
  sustainable: {
    title: 'Sustainable',
    description: 'Environmental and social responsibility integration',
    features: [
      'Carbon footprint tracking',
      'Virtual tourism to reduce physical travel',
      'Energy-efficient IoT infrastructure',
      'Local SME empowerment'
    ]
  },
  humanCentric: {
    title: 'Human-Centric',
    description: 'Prioritizing user experience and accessibility',
    features: [
      'Multi-role access system',
      'Inclusive design for all stakeholders',
      'Cultural heritage preservation',
      'Community-driven development'
    ]
  },
  resilient: {
    title: 'Resilient',
    description: 'Robust systems that adapt to disruptions',
    features: [
      'Decentralized infrastructure',
      'Blockchain-based data redundancy',
      'Automated failover mechanisms',
      'Dispute resolution systems'
    ]
  },
  collaborative: {
    title: 'Collaborative',
    description: 'Multi-stakeholder cooperation and co-creation',
    features: [
      'DAO governance for collective decision-making',
      'NFT-based participation rights',
      'Open innovation platform',
      'Cross-sector partnerships'
    ]
  }
};

/**
 * Integration Points between HCPS and Tourism 5.0
 */
export const INTEGRATION_POINTS = [
  {
    hcpsComponent: 'IoT Sensors',
    tourism5Feature: 'Real-time Environmental Monitoring',
    benefit: 'Ensures sustainable tourism by tracking environmental impact',
    example: 'Crowd density sensors prevent overtourism at heritage sites'
  },
  {
    hcpsComponent: 'Blockchain Smart Contracts',
    tourism5Feature: 'Transparent Payment Systems',
    benefit: 'Builds trust and enables fair revenue distribution',
    example: 'Automated escrow releases payments when services are verified'
  },
  {
    hcpsComponent: 'Virtual Tourism Interface',
    tourism5Feature: 'Accessible Global Experiences',
    benefit: 'Democratizes tourism access regardless of physical location',
    example: '360° virtual tours of Indonesian heritage sites'
  },
  {
    hcpsComponent: 'AI Virtual Assistant',
    tourism5Feature: 'Personalized User Experience',
    benefit: 'Enhances satisfaction through intelligent recommendations',
    example: 'AI suggests tours based on preferences and real-time conditions'
  },
  {
    hcpsComponent: 'DAO Governance',
    tourism5Feature: 'Stakeholder Empowerment',
    benefit: 'Ensures inclusive decision-making and fair policies',
    example: 'Token holders vote on platform upgrades and new features'
  }
];

/**
 * Phase Roadmap
 */
export const PHASE_ROADMAP = [
  {
    phase: 0,
    title: 'Foundation & Documentation',
    status: 'completed',
    objectives: [
      'Define HCPS-Tourism 5.0 framework',
      'Document system architecture',
      'Establish research methodology',
      'Map stakeholder requirements'
    ],
    deliverables: [
      'Comprehensive framework documentation',
      'Architecture blueprints',
      'Research protocol',
      'Stakeholder analysis report'
    ]
  },
  {
    phase: 1,
    title: 'Core Infrastructure Development',
    status: 'current',
    objectives: [
      'Enhance blockchain integration',
      'Expand IoT device network',
      'Implement AI recommendation engine',
      'Develop governance mechanisms'
    ],
    deliverables: [
      'Enhanced smart contracts',
      'IoT management dashboard',
      'AI model deployment',
      'DAO governance prototype'
    ]
  },
  {
    phase: 2,
    title: 'Advanced Features & Integration',
    status: 'planned',
    objectives: [
      'Deploy metaverse experiences',
      'Implement NFT achievements',
      'Build cross-chain bridges',
      'Enhance virtual tourism'
    ],
    deliverables: [
      'Metaverse hub',
      'NFT minting system',
      'Multi-chain support',
      'Advanced VR integration'
    ]
  },
  {
    phase: 3,
    title: 'Testing & Validation',
    status: 'planned',
    objectives: [
      'Conduct user acceptance testing',
      'Validate research hypotheses',
      'Performance optimization',
      'Security audits'
    ],
    deliverables: [
      'Test reports',
      'Research findings',
      'Optimization documentation',
      'Security audit results'
    ]
  },
  {
    phase: 4,
    title: 'Deployment & Scaling',
    status: 'future',
    objectives: [
      'Mainnet deployment',
      'Scale to multiple destinations',
      'Onboard SME partners',
      'Launch public beta'
    ],
    deliverables: [
      'Production system',
      'Partner onboarding program',
      'Marketing materials',
      'Operational guidelines'
    ]
  }
];
