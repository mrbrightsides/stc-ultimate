/**
 * Phase 1: DAO Governance System
 * Decentralized decision-making for the tourism platform
 */

export interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'platform' | 'destination' | 'policy' | 'treasury' | 'technical';
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  startTime: number;
  endTime: number;
  executionTime?: number;
  txHash?: string;
}

export interface DAOMember {
  address: string;
  votingPower: number;
  nftTokens: number;
  reputation: number;
  proposalsCreated: number;
  votesParticipated: number;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  participationRate: number;
  treasuryBalance: string;
}

/**
 * Sample DAO Proposals
 */
export const SAMPLE_PROPOSALS: DAOProposal[] = [
  {
    id: 'prop-001',
    title: 'Add Virtual Reality Tours for Prambanan Temple',
    description: 'Proposal to integrate VR/360° experiences for Prambanan Temple, enabling global accessibility and reducing physical visitor pressure during peak seasons.',
    proposer: '0x742d35Cc9F2F4D2C8F1B16A0F7D8B9C6E5D4F3A2B1',
    category: 'destination',
    status: 'active',
    votesFor: 1250,
    votesAgainst: 320,
    votesAbstain: 85,
    quorum: 1000,
    startTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prop-002',
    title: 'Implement Dynamic Pricing Based on IoT Crowd Data',
    description: 'Use real-time crowd density sensors to adjust tour pricing dynamically, incentivizing off-peak visits and managing overtourism.',
    proposer: '0x8B3D9F2E1C4A5F6D7E8C9B0A1F2E3D4C5B6A7F8E9',
    category: 'technical',
    status: 'active',
    votesFor: 890,
    votesAgainst: 456,
    votesAbstain: 120,
    quorum: 1000,
    startTime: Date.now() - 1 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 6 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prop-003',
    title: 'Allocate Treasury Funds for SME Onboarding Program',
    description: 'Dedicate 50 ETH from treasury to support Indonesian SMEs in joining the platform, including training, smart contract deployment, and marketing.',
    proposer: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
    category: 'treasury',
    status: 'passed',
    votesFor: 2150,
    votesAgainst: 220,
    votesAbstain: 95,
    quorum: 1000,
    startTime: Date.now() - 10 * 24 * 60 * 60 * 1000,
    endTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
    executionTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 'prop-004',
    title: 'Establish Sustainability Standards for Partner Hotels',
    description: 'Mandate carbon footprint tracking and renewable energy usage for all accommodation partners on the platform.',
    proposer: '0x5F6E7D8C9B0A1F2E3D4C5B6A7F8E9D0C1B2A3F4E',
    category: 'policy',
    status: 'active',
    votesFor: 1580,
    votesAgainst: 670,
    votesAbstain: 205,
    quorum: 1000,
    startTime: Date.now() - 4 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 3 * 24 * 60 * 60 * 1000
  },
  {
    id: 'prop-005',
    title: 'Reduce Platform Fees from 5% to 3%',
    description: 'Lower the platform commission to make the service more attractive to SMEs and increase competitiveness.',
    proposer: '0x9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4B3A2F1E0D',
    category: 'platform',
    status: 'rejected',
    votesFor: 720,
    votesAgainst: 1850,
    votesAbstain: 150,
    quorum: 1000,
    startTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
    endTime: Date.now() - 8 * 24 * 60 * 60 * 1000
  }
];

/**
 * Calculate proposal voting progress
 */
export function calculateVotingProgress(proposal: DAOProposal): {
  totalVotes: number;
  forPercentage: number;
  againstPercentage: number;
  abstainPercentage: number;
  quorumReached: boolean;
  timeRemaining: string;
} {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;
  const quorumReached = totalVotes >= proposal.quorum;

  // Calculate time remaining
  const now = Date.now();
  const remaining = proposal.endTime - now;
  let timeRemaining = 'Ended';
  
  if (remaining > 0) {
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      timeRemaining = `${days}d ${hours}h`;
    } else {
      timeRemaining = `${hours}h`;
    }
  }

  return {
    totalVotes,
    forPercentage,
    againstPercentage,
    abstainPercentage,
    quorumReached,
    timeRemaining
  };
}

/**
 * Get proposal outcome prediction
 */
export function predictProposalOutcome(proposal: DAOProposal): {
  prediction: 'pass' | 'reject' | 'uncertain';
  confidence: number;
} {
  const progress = calculateVotingProgress(proposal);
  
  if (!progress.quorumReached) {
    return { prediction: 'uncertain', confidence: 0 };
  }

  const forRatio = proposal.votesFor / (proposal.votesFor + proposal.votesAgainst);
  
  if (forRatio > 0.66) {
    return { prediction: 'pass', confidence: Math.round(forRatio * 100) };
  } else if (forRatio < 0.34) {
    return { prediction: 'reject', confidence: Math.round((1 - forRatio) * 100) };
  } else {
    return { prediction: 'uncertain', confidence: 50 };
  }
}

/**
 * Get governance statistics
 */
export function getGovernanceStats(proposals: DAOProposal[]): GovernanceStats {
  const totalProposals = proposals.length;
  const activeProposals = proposals.filter(p => p.status === 'active').length;
  
  const totalVotes = proposals.reduce((sum, p) => 
    sum + p.votesFor + p.votesAgainst + p.votesAbstain, 0
  );

  // Calculate participation rate (assuming 10,000 total eligible voters)
  const eligibleVoters = 10000;
  const uniqueVoters = Math.min(totalVotes / proposals.length, eligibleVoters);
  const participationRate = (uniqueVoters / eligibleVoters) * 100;

  return {
    totalProposals,
    activeProposals,
    totalVotes,
    participationRate,
    treasuryBalance: '125.5' // ETH
  };
}

/**
 * Voting power calculation based on NFT holdings and reputation
 */
export function calculateVotingPower(member: DAOMember): number {
  // Base power from NFT tokens
  let power = member.nftTokens * 10;
  
  // Reputation multiplier (max 2x)
  const reputationMultiplier = 1 + Math.min(member.reputation / 1000, 1);
  power *= reputationMultiplier;
  
  // Participation bonus (up to 20% extra)
  if (member.votesParticipated > 10) {
    power *= 1.2;
  } else if (member.votesParticipated > 5) {
    power *= 1.1;
  }
  
  return Math.round(power);
}

/**
 * Create a new proposal (simulated)
 */
export function createProposal(
  title: string,
  description: string,
  category: DAOProposal['category'],
  proposer: string
): DAOProposal {
  return {
    id: `prop-${Date.now()}`,
    title,
    description,
    proposer,
    category,
    status: 'active',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    quorum: 1000,
    startTime: Date.now(),
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
}

/**
 * Get DAO Governance data
 */
export function getDAOGovernance(): {
  participationRate: number;
  treasuryBalance: string;
  totalProposals: number;
  activeProposals: number;
} {
  const stats = getGovernanceStats(SAMPLE_PROPOSALS);
  return {
    participationRate: stats.participationRate,
    treasuryBalance: stats.treasuryBalance,
    totalProposals: stats.totalProposals,
    activeProposals: stats.activeProposals
  };
}

/**
 * Get active proposals
 */
export function getActiveProposals(): Array<DAOProposal & { createdAt: Date; endDate: Date }> {
  return SAMPLE_PROPOSALS
    .filter(p => p.status === 'active')
    .map(p => ({
      ...p,
      createdAt: new Date(p.startTime),
      endDate: new Date(p.endTime)
    }));
}

/**
 * Cast a vote on a proposal (simulated)
 */
export function castVote(
  proposalId: string,
  support: boolean,
  votingPower?: number
): { success: boolean; message: string } {
  // In production, this would call the smart contract
  const voteType = support ? 'for' : 'against';
  return {
    success: true,
    message: `Successfully cast ${votingPower || 1} votes "${voteType}" on proposal ${proposalId}`
  };
}
