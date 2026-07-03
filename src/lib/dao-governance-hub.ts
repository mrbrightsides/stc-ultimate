/**
 * DAO Governance Hub Library
 * Integrated from Phase 1 & Phase 4 governance features
 */

export interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  startDate: Date;
  endDate: Date;
  category: 'platform' | 'treasury' | 'policy' | 'technical';
  requiredQuorum: number;
  currentQuorum: number;
  multiSigRequired?: number;
  multiSigSignatures?: number;
}

export interface TreasuryAllocation {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  color: string;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  rejectedProposals: number;
  participationRate: number;
  treasuryBalance: number;
  nftHolders: number;
  averageVotingPower: number;
}

export interface NFTGovernanceToken {
  id: string;
  tokenId: number;
  owner: string;
  votingPower: number;
  acquisitionDate: Date;
  type: 'founder' | 'contributor' | 'community' | 'special';
}

export function getDAOGovernance(): {
  proposals: DAOProposal[];
  stats: GovernanceStats;
  treasury: TreasuryAllocation[];
  nftTokens: NFTGovernanceToken[];
} {
  const proposals: DAOProposal[] = [
    {
      id: 'prop-001',
      title: 'Integrate VR Tours for Top 10 Destinations',
      description: 'Proposal to develop and integrate immersive VR experiences for Indonesia\'s top 10 tourist destinations including enhanced 360° tours, interactive elements, and AI-guided narratives.',
      proposer: '0x1234...5678',
      status: 'active',
      votesFor: 12500,
      votesAgainst: 3200,
      votesAbstain: 800,
      totalVotes: 16500,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      category: 'platform',
      requiredQuorum: 15000,
      currentQuorum: 16500,
      multiSigRequired: 3,
      multiSigSignatures: 2
    },
    {
      id: 'prop-002',
      title: 'Allocate 50M IDR for SME Marketing Support',
      description: 'Treasury allocation to support small and medium tourism enterprises with digital marketing campaigns, social media presence, and online booking system integration.',
      proposer: '0xabcd...efgh',
      status: 'active',
      votesFor: 18900,
      votesAgainst: 2100,
      votesAbstain: 1000,
      totalVotes: 22000,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-20'),
      category: 'treasury',
      requiredQuorum: 20000,
      currentQuorum: 22000,
      multiSigRequired: 5,
      multiSigSignatures: 4
    },
    {
      id: 'prop-003',
      title: 'Implement Dynamic Pricing Algorithm',
      description: 'Introduce ML-powered dynamic pricing for tours based on demand, seasonality, and market conditions to optimize revenue for SMEs while maintaining competitive prices.',
      proposer: '0x9876...5432',
      status: 'active',
      votesFor: 14200,
      votesAgainst: 5800,
      votesAbstain: 2000,
      totalVotes: 22000,
      startDate: new Date('2024-01-25'),
      endDate: new Date('2024-02-25'),
      category: 'technical',
      requiredQuorum: 18000,
      currentQuorum: 22000
    },
    {
      id: 'prop-004',
      title: 'Update Sustainability Standards',
      description: 'Revise platform policies to enforce stricter environmental and cultural sustainability standards for all listed tours and accommodations.',
      proposer: '0x5555...6666',
      status: 'passed',
      votesFor: 24500,
      votesAgainst: 3200,
      votesAbstain: 1300,
      totalVotes: 29000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      category: 'policy',
      requiredQuorum: 25000,
      currentQuorum: 29000
    },
    {
      id: 'prop-005',
      title: 'Launch NFT Tourism Badges Program',
      description: 'Create a comprehensive NFT badge system to reward tourists for visiting destinations, supporting local businesses, and contributing to sustainable tourism.',
      proposer: '0x7777...8888',
      status: 'passed',
      votesFor: 21000,
      votesAgainst: 4000,
      votesAbstain: 2000,
      totalVotes: 27000,
      startDate: new Date('2023-12-15'),
      endDate: new Date('2024-01-15'),
      category: 'platform',
      requiredQuorum: 20000,
      currentQuorum: 27000
    }
  ];

  const stats: GovernanceStats = {
    totalProposals: 15,
    activeProposals: 3,
    passedProposals: 8,
    rejectedProposals: 4,
    participationRate: 78.4,
    treasuryBalance: 547800000, // 547.8M IDR
    nftHolders: 234,
    averageVotingPower: 2340
  };

  const treasury: TreasuryAllocation[] = [
    {
      category: 'Platform Development',
      allocated: 200000000,
      spent: 145000000,
      remaining: 55000000,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'SME Support',
      allocated: 150000000,
      spent: 89000000,
      remaining: 61000000,
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Marketing',
      allocated: 100000000,
      spent: 67000000,
      remaining: 33000000,
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Research',
      allocated: 80000000,
      spent: 34000000,
      remaining: 46000000,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      category: 'Community Rewards',
      allocated: 120000000,
      spent: 88200000,
      remaining: 31800000,
      color: 'from-red-500 to-rose-500'
    }
  ];

  const nftTokens: NFTGovernanceToken[] = [
    {
      id: 'nft-001',
      tokenId: 1,
      owner: '0x1234...5678',
      votingPower: 5000,
      acquisitionDate: new Date('2023-06-15'),
      type: 'founder'
    },
    {
      id: 'nft-002',
      tokenId: 12,
      owner: '0xabcd...efgh',
      votingPower: 3500,
      acquisitionDate: new Date('2023-08-20'),
      type: 'contributor'
    },
    {
      id: 'nft-003',
      tokenId: 45,
      owner: '0x9876...5432',
      votingPower: 2000,
      acquisitionDate: new Date('2023-10-10'),
      type: 'community'
    },
    {
      id: 'nft-004',
      tokenId: 78,
      owner: '0x5555...6666',
      votingPower: 4200,
      acquisitionDate: new Date('2023-07-25'),
      type: 'founder'
    }
  ];

  return {
    proposals,
    stats,
    treasury,
    nftTokens
  };
}

export function voteOnProposal(proposalId: string, vote: 'for' | 'against' | 'abstain', votingPower: number): boolean {
  console.log(`Voting ${vote} on proposal ${proposalId} with ${votingPower} voting power`);
  return true;
}

export function createProposal(title: string, description: string, category: string): string {
  const proposalId = `prop-${Date.now()}`;
  console.log(`Created proposal ${proposalId}: ${title}`);
  return proposalId;
}

export function calculateQuadraticVotingPower(tokens: number): number {
  return Math.floor(Math.sqrt(tokens));
}

export function getTreasuryTransactions(): Array<{
  id: string;
  date: Date;
  type: 'allocation' | 'spending' | 'income';
  category: string;
  amount: number;
  description: string;
}> {
  return [
    {
      id: 'tx-001',
      date: new Date('2024-01-15'),
      type: 'allocation',
      category: 'Platform Development',
      amount: 50000000,
      description: 'Q1 Development Budget'
    },
    {
      id: 'tx-002',
      date: new Date('2024-01-18'),
      type: 'spending',
      category: 'SME Support',
      amount: -12000000,
      description: 'Marketing Campaign Support'
    },
    {
      id: 'tx-003',
      date: new Date('2024-01-20'),
      type: 'income',
      category: 'Platform Fees',
      amount: 25000000,
      description: 'January Platform Revenue'
    }
  ];
}
