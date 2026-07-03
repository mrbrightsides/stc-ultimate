/**
 * Phase 4: Advanced Blockchain Governance System
 * Enhanced DAO features with multi-sig, quadratic voting, and treasury management
 */

export interface AdvancedProposal {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'treasury' | 'policy' | 'technical';
  status: 'active' | 'passed' | 'rejected' | 'executed';
  createdBy: string;
  createdAt: Date;
  votingEnds: Date;
  votes: ProposalVote[];
  multiSigRequirements: MultiSigConfig;
  quadraticVoting: boolean;
  timeLock: number; // hours
  budgetAllocation?: BudgetAllocation;
}

export interface ProposalVote {
  voter: string;
  votingPower: number;
  choice: 'yes' | 'no' | 'abstain';
  quadraticWeight: number;
  nftTokens: number;
  timestamp: Date;
}

export interface MultiSigConfig {
  required: number;
  total: number;
  signers: string[];
  signatures: Signature[];
}

export interface Signature {
  signer: string;
  signed: boolean;
  timestamp?: Date;
}

export interface BudgetAllocation {
  amount: string; // in IDR
  category: 'development' | 'marketing' | 'operations' | 'grants';
  recipient: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  description: string;
  amount: string;
  status: 'pending' | 'completed' | 'verified';
  dueDate: Date;
}

export interface NFTGovernanceToken {
  id: string;
  owner: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  votingPower: number;
  staked: boolean;
  acquired: Date;
}

export interface TreasuryData {
  totalFunds: string; // in IDR
  allocated: string;
  available: string;
  distributions: TreasuryDistribution[];
}

export interface TreasuryDistribution {
  id: string;
  recipient: string;
  amount: string;
  category: string;
  date: Date;
  status: 'pending' | 'approved' | 'sent';
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  participationRate: number;
  averageVotingPower: number;
  treasuryBalance: string;
  nftHolders: number;
}

// Mock Advanced Proposals
const MOCK_ADVANCED_PROPOSALS: AdvancedProposal[] = [
  {
    id: 'prop-adv-1',
    title: 'Implement Multi-Language VR Tours',
    description: 'Add support for 10 additional languages in VR tourism experiences',
    type: 'improvement',
    status: 'active',
    createdBy: 'dao-member-1',
    createdAt: new Date(Date.now() - 172800000),
    votingEnds: new Date(Date.now() + 345600000),
    votes: [
      {
        voter: '0x742d35Cc...F3A2B1',
        votingPower: 150,
        choice: 'yes',
        quadraticWeight: 12.25,
        nftTokens: 3,
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        voter: '0x8b3a21Dd...E4C5D6',
        votingPower: 200,
        choice: 'yes',
        quadraticWeight: 14.14,
        nftTokens: 4,
        timestamp: new Date(Date.now() - 72000000)
      },
      {
        voter: '0x9c4b32Ee...F5D6E7',
        votingPower: 100,
        choice: 'no',
        quadraticWeight: 10,
        nftTokens: 2,
        timestamp: new Date(Date.now() - 43200000)
      }
    ],
    multiSigRequirements: {
      required: 3,
      total: 5,
      signers: ['signer-1', 'signer-2', 'signer-3', 'signer-4', 'signer-5'],
      signatures: [
        { signer: 'signer-1', signed: true, timestamp: new Date(Date.now() - 36000000) },
        { signer: 'signer-2', signed: true, timestamp: new Date(Date.now() - 28800000) },
        { signer: 'signer-3', signed: false },
        { signer: 'signer-4', signed: true, timestamp: new Date(Date.now() - 21600000) },
        { signer: 'signer-5', signed: false }
      ]
    },
    quadraticVoting: true,
    timeLock: 48,
    budgetAllocation: {
      amount: '125000000', // 125M IDR
      category: 'development',
      recipient: 'Dev Team Alpha',
      milestones: [
        {
          id: 'mile-1',
          description: 'Language infrastructure setup',
          amount: '40000000',
          status: 'completed',
          dueDate: new Date(Date.now() + 604800000)
        },
        {
          id: 'mile-2',
          description: 'Translation and testing',
          amount: '50000000',
          status: 'pending',
          dueDate: new Date(Date.now() + 1209600000)
        },
        {
          id: 'mile-3',
          description: 'Deployment and documentation',
          amount: '35000000',
          status: 'pending',
          dueDate: new Date(Date.now() + 1814400000)
        }
      ]
    }
  },
  {
    id: 'prop-adv-2',
    title: 'SME Funding Program - Q2 2025',
    description: 'Allocate funds to support 20 Indonesian tourism SMEs with blockchain integration',
    type: 'treasury',
    status: 'active',
    createdBy: 'dao-member-2',
    createdAt: new Date(Date.now() - 259200000),
    votingEnds: new Date(Date.now() + 259200000),
    votes: [
      {
        voter: '0xa5d6f7...B2C3D4',
        votingPower: 300,
        choice: 'yes',
        quadraticWeight: 17.32,
        nftTokens: 6,
        timestamp: new Date(Date.now() - 172800000)
      },
      {
        voter: '0xb6e7g8...C3D4E5',
        votingPower: 250,
        choice: 'yes',
        quadraticWeight: 15.81,
        nftTokens: 5,
        timestamp: new Date(Date.now() - 129600000)
      },
      {
        voter: '0xc7f8h9...D4E5F6',
        votingPower: 180,
        choice: 'abstain',
        quadraticWeight: 13.42,
        nftTokens: 3,
        timestamp: new Date(Date.now() - 86400000)
      }
    ],
    multiSigRequirements: {
      required: 4,
      total: 7,
      signers: ['signer-1', 'signer-2', 'signer-3', 'signer-4', 'signer-5', 'signer-6', 'signer-7'],
      signatures: [
        { signer: 'signer-1', signed: true, timestamp: new Date(Date.now() - 64800000) },
        { signer: 'signer-2', signed: true, timestamp: new Date(Date.now() - 57600000) },
        { signer: 'signer-3', signed: false },
        { signer: 'signer-4', signed: true, timestamp: new Date(Date.now() - 50400000) },
        { signer: 'signer-5', signed: false },
        { signer: 'signer-6', signed: true, timestamp: new Date(Date.now() - 43200000) },
        { signer: 'signer-7', signed: false }
      ]
    },
    quadraticVoting: true,
    timeLock: 72,
    budgetAllocation: {
      amount: '500000000', // 500M IDR
      category: 'grants',
      recipient: 'SME Grant Program',
      milestones: [
        {
          id: 'mile-4',
          description: 'Application review and selection',
          amount: '50000000',
          status: 'verified',
          dueDate: new Date(Date.now() + 1209600000)
        },
        {
          id: 'mile-5',
          description: 'First batch funding (10 SMEs)',
          amount: '225000000',
          status: 'pending',
          dueDate: new Date(Date.now() + 2419200000)
        },
        {
          id: 'mile-6',
          description: 'Second batch funding (10 SMEs)',
          amount: '225000000',
          status: 'pending',
          dueDate: new Date(Date.now() + 4838400000)
        }
      ]
    }
  },
  {
    id: 'prop-adv-3',
    title: 'Update Tourism Sustainability Standards',
    description: 'Implement new environmental and cultural sustainability guidelines for platform partners',
    type: 'policy',
    status: 'active',
    createdBy: 'dao-member-3',
    createdAt: new Date(Date.now() - 432000000),
    votingEnds: new Date(Date.now() + 86400000),
    votes: [
      {
        voter: '0xd8g9i0...E5F6G7',
        votingPower: 220,
        choice: 'yes',
        quadraticWeight: 14.83,
        nftTokens: 4,
        timestamp: new Date(Date.now() - 259200000)
      },
      {
        voter: '0xe9h0j1...F6G7H8',
        votingPower: 170,
        choice: 'yes',
        quadraticWeight: 13.04,
        nftTokens: 3,
        timestamp: new Date(Date.now() - 216000000)
      }
    ],
    multiSigRequirements: {
      required: 2,
      total: 3,
      signers: ['signer-1', 'signer-2', 'signer-3'],
      signatures: [
        { signer: 'signer-1', signed: true, timestamp: new Date(Date.now() - 172800000) },
        { signer: 'signer-2', signed: true, timestamp: new Date(Date.now() - 129600000) },
        { signer: 'signer-3', signed: false }
      ]
    },
    quadraticVoting: true,
    timeLock: 24
  }
];

// Mock NFT Governance Tokens
const MOCK_NFT_TOKENS: NFTGovernanceToken[] = [
  {
    id: 'nft-gov-1',
    owner: '0x742d35Cc...F3A2B1',
    tier: 'platinum',
    votingPower: 100,
    staked: true,
    acquired: new Date(Date.now() - 7776000000)
  },
  {
    id: 'nft-gov-2',
    owner: '0x8b3a21Dd...E4C5D6',
    tier: 'gold',
    votingPower: 50,
    staked: true,
    acquired: new Date(Date.now() - 5184000000)
  },
  {
    id: 'nft-gov-3',
    owner: '0x9c4b32Ee...F5D6E7',
    tier: 'silver',
    votingPower: 25,
    staked: false,
    acquired: new Date(Date.now() - 2592000000)
  }
];

/**
 * Get all advanced proposals
 */
export function getAdvancedProposals(): AdvancedProposal[] {
  return JSON.parse(JSON.stringify(MOCK_ADVANCED_PROPOSALS));
}

/**
 * Get active proposals
 */
export function getActiveProposals(): AdvancedProposal[] {
  return MOCK_ADVANCED_PROPOSALS.filter(p => p.status === 'active').map(p => JSON.parse(JSON.stringify(p)));
}

/**
 * Get proposal by ID
 */
export function getProposalById(id: string): AdvancedProposal | null {
  const proposal = MOCK_ADVANCED_PROPOSALS.find(p => p.id === id);
  return proposal ? JSON.parse(JSON.stringify(proposal)) : null;
}

/**
 * Get NFT governance tokens
 */
export function getNFTGovernanceTokens(): NFTGovernanceToken[] {
  return JSON.parse(JSON.stringify(MOCK_NFT_TOKENS));
}

/**
 * Get treasury data
 */
export function getTreasuryData(): TreasuryData {
  return {
    totalFunds: '547800000', // 547.8M IDR
    allocated: '225000000', // 225M IDR
    available: '322800000', // 322.8M IDR
    distributions: [
      {
        id: 'dist-1',
        recipient: 'SME Partner 1',
        amount: '15000000',
        category: 'grants',
        date: new Date(Date.now() - 604800000),
        status: 'sent'
      },
      {
        id: 'dist-2',
        recipient: 'Development Team',
        amount: '40000000',
        category: 'development',
        date: new Date(Date.now() - 432000000),
        status: 'approved'
      },
      {
        id: 'dist-3',
        recipient: 'Marketing Campaign',
        amount: '25000000',
        category: 'marketing',
        date: new Date(Date.now() - 259200000),
        status: 'pending'
      }
    ]
  };
}

/**
 * Get governance statistics
 */
export function getGovernanceStats(): GovernanceStats {
  return {
    totalProposals: 47,
    activeProposals: 3,
    participationRate: 78.4, // percentage
    averageVotingPower: 185.7,
    treasuryBalance: '547800000', // IDR
    nftHolders: 234
  };
}

/**
 * Calculate quadratic voting weight
 */
export function calculateQuadraticWeight(votingPower: number): number {
  return Math.sqrt(votingPower);
}

/**
 * Check if proposal has enough multi-sig signatures
 */
export function hasEnoughSignatures(proposal: AdvancedProposal): boolean {
  const signedCount = proposal.multiSigRequirements.signatures.filter(s => s.signed).length;
  return signedCount >= proposal.multiSigRequirements.required;
}

/**
 * Predict proposal outcome
 */
export function predictProposalOutcome(proposal: AdvancedProposal): {
  prediction: 'likely to pass' | 'likely to fail' | 'uncertain';
  yesVotes: number;
  noVotes: number;
  confidence: number;
} {
  const yesVotes = proposal.votes
    .filter(v => v.choice === 'yes')
    .reduce((sum, v) => sum + (proposal.quadraticVoting ? v.quadraticWeight : v.votingPower), 0);
  
  const noVotes = proposal.votes
    .filter(v => v.choice === 'no')
    .reduce((sum, v) => sum + (proposal.quadraticVoting ? v.quadraticWeight : v.votingPower), 0);

  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

  let prediction: 'likely to pass' | 'likely to fail' | 'uncertain';
  let confidence: number;

  if (yesPercentage >= 60) {
    prediction = 'likely to pass';
    confidence = yesPercentage;
  } else if (yesPercentage <= 40) {
    prediction = 'likely to fail';
    confidence = 100 - yesPercentage;
  } else {
    prediction = 'uncertain';
    confidence = 50;
  }

  return {
    prediction,
    yesVotes,
    noVotes,
    confidence
  };
}

/**
 * Proposal interface for DAO Governance Hub
 */
export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  status: string;
  createdAt: string;
  endDate: string;
  category: string;
  requiredSignatures?: number;
  currentSignatures?: number;
}

/**
 * Vote record interface
 */
export interface VoteRecord {
  id: string;
  proposalTitle: string;
  vote: boolean;
  votedAt: string;
  votingPower: number;
}

/**
 * Treasury transaction interface
 */
export interface TreasuryTransaction {
  id: string;
  description: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: string;
}

/**
 * Get governance system data
 */
export function getGovernanceSystem(): {
  treasury: {
    balance: number;
    allocated: number;
    available: number;
  };
  nftGovernance: {
    totalHolders: number;
    votingPowerDistribution: number[];
  };
} {
  return {
    treasury: {
      balance: 547.8,
      allocated: 225.0,
      available: 322.8
    },
    nftGovernance: {
      totalHolders: 234,
      votingPowerDistribution: [100, 50, 25, 10, 5]
    }
  };
}

/**
 * Get proposals for DAO Hub
 */
export function getProposals(): Proposal[] {
  return MOCK_ADVANCED_PROPOSALS.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    proposer: p.createdBy,
    votesFor: p.votes.filter(v => v.choice === 'yes').reduce((sum, v) => sum + v.votingPower, 0),
    votesAgainst: p.votes.filter(v => v.choice === 'no').reduce((sum, v) => sum + v.votingPower, 0),
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    endDate: p.votingEnds.toISOString(),
    category: p.type,
    requiredSignatures: p.multiSigRequirements.required,
    currentSignatures: p.multiSigRequirements.signatures.filter(s => s.signed).length
  }));
}

/**
 * Get voting history
 */
export function getVotingHistory(): VoteRecord[] {
  return [
    {
      id: 'vote-1',
      proposalTitle: 'Implement Multi-Language VR Tours',
      vote: true,
      votedAt: new Date(Date.now() - 86400000).toISOString(),
      votingPower: 150
    },
    {
      id: 'vote-2',
      proposalTitle: 'SME Funding Program - Q2 2025',
      vote: true,
      votedAt: new Date(Date.now() - 172800000).toISOString(),
      votingPower: 100
    },
    {
      id: 'vote-3',
      proposalTitle: 'Update Tourism Sustainability Standards',
      vote: false,
      votedAt: new Date(Date.now() - 259200000).toISOString(),
      votingPower: 75
    }
  ];
}

/**
 * Get treasury transactions
 */
export function getTreasuryTransactions(): TreasuryTransaction[] {
  const treasuryData = getTreasuryData();
  return treasuryData.distributions.map(d => ({
    id: d.id,
    description: `${d.category}: ${d.recipient}`,
    timestamp: d.date.toISOString(),
    type: 'withdrawal' as const,
    amount: parseFloat(d.amount) / 1000000,
    status: d.status
  }));
}
