'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Vote, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  DollarSign,
  FileText,
  PlusCircle
} from 'lucide-react';
import type { DAOProposal } from '@/lib/phase1-dao-governance';
import { 
  SAMPLE_PROPOSALS, 
  calculateVotingProgress, 
  predictProposalOutcome,
  getGovernanceStats 
} from '@/lib/phase1-dao-governance';

export function DAOGovernancePanel() {
  const [proposals] = useState<DAOProposal[]>(SAMPLE_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<DAOProposal | null>(null);
  const stats = getGovernanceStats(proposals);

  const getCategoryColor = (category: DAOProposal['category']): string => {
    const colors: Record<DAOProposal['category'], string> = {
      platform: 'cyan',
      destination: 'purple',
      policy: 'green',
      treasury: 'orange',
      technical: 'blue'
    };
    return colors[category];
  };

  const getStatusIcon = (status: DAOProposal['status']): JSX.Element => {
    const icons: Record<DAOProposal['status'], JSX.Element> = {
      active: <Clock className="h-5 w-5 text-cyan-400" />,
      passed: <CheckCircle2 className="h-5 w-5 text-green-400" />,
      rejected: <XCircle className="h-5 w-5 text-red-400" />,
      executed: <CheckCircle2 className="h-5 w-5 text-green-400" />
    };
    return icons[status];
  };

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain'): void => {
    // In production, this would call the smart contract
    alert(`Voted "${voteType}" on proposal ${proposalId}`);
  };

  return (
    <div className="space-y-6">
      {/* Governance Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <NeonCard glowColor="orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Proposals</p>
              <p className="text-3xl font-bold text-orange-400">{stats.totalProposals}</p>
            </div>
            <FileText className="h-12 w-12 text-orange-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Voting</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.activeProposals}</p>
            </div>
            <Vote className="h-12 w-12 text-cyan-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Participation</p>
              <p className="text-3xl font-bold text-purple-400">{stats.participationRate.toFixed(1)}%</p>
            </div>
            <Users className="h-12 w-12 text-purple-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Treasury</p>
              <p className="text-3xl font-bold text-green-400">{stats.treasuryBalance}</p>
              <p className="text-xs text-gray-400">ETH</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-400" />
          </div>
        </NeonCard>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">Active Proposals</h3>
        <NeonButton variant="primary">
          <PlusCircle className="h-4 w-4" />
          Create Proposal
        </NeonButton>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const progress = calculateVotingProgress(proposal);
          const prediction = predictProposalOutcome(proposal);

          return (
            <NeonCard 
              key={proposal.id} 
              glowColor={getCategoryColor(proposal.category)}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setSelectedProposal(proposal)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(proposal.status)}
                      <h4 className="text-lg font-semibold text-white">{proposal.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400">{proposal.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`bg-${getCategoryColor(proposal.category)}-500/20 text-${getCategoryColor(proposal.category)}-400 border-${getCategoryColor(proposal.category)}-500/50 capitalize`}>
                      {proposal.category}
                    </Badge>
                    <Badge className={`${
                      proposal.status === 'active' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' :
                      proposal.status === 'passed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                      proposal.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/50'
                    } capitalize`}>
                      {proposal.status}
                    </Badge>
                  </div>
                </div>

                {proposal.status === 'active' && (
                  <>
                    <div className="space-y-3">
                      {/* Voting Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Votes: {progress.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}</span>
                          <span className={`${progress.quorumReached ? 'text-green-400' : 'text-orange-400'}`}>
                            {progress.quorumReached ? '✓ Quorum Reached' : 'Quorum Required'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div className="h-full flex">
                            <div 
                              className="bg-green-500 transition-all"
                              style={{ width: `${progress.forPercentage}%` }}
                            />
                            <div 
                              className="bg-red-500 transition-all"
                              style={{ width: `${progress.againstPercentage}%` }}
                            />
                            <div 
                              className="bg-gray-600 transition-all"
                              style={{ width: `${progress.abstainPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="text-green-400">For: {proposal.votesFor.toLocaleString()} ({progress.forPercentage.toFixed(1)}%)</span>
                          <span className="text-red-400">Against: {proposal.votesAgainst.toLocaleString()} ({progress.againstPercentage.toFixed(1)}%)</span>
                          <span>Abstain: {proposal.votesAbstain.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Prediction */}
                      {prediction.prediction !== 'uncertain' && (
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${
                          prediction.prediction === 'pass' 
                            ? 'bg-green-500/10 border border-green-500/20' 
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          <TrendingUp className={`h-4 w-4 ${prediction.prediction === 'pass' ? 'text-green-400' : 'text-red-400'}`} />
                          <span className={`text-sm ${prediction.prediction === 'pass' ? 'text-green-400' : 'text-red-400'}`}>
                            Predicted to {prediction.prediction} ({prediction.confidence}% confidence)
                          </span>
                        </div>
                      )}

                      {/* Time Remaining */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Time remaining: {progress.timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vote Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                      <NeonButton
                        variant="default"
                        size="sm"
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleVote(proposal.id, 'for');
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Vote For
                      </NeonButton>
                      <NeonButton
                        variant="default"
                        size="sm"
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleVote(proposal.id, 'against');
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Vote Against
                      </NeonButton>
                      <NeonButton
                        variant="default"
                        size="sm"
                        className="flex-1 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border-gray-500/30"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleVote(proposal.id, 'abstain');
                        }}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Abstain
                      </NeonButton>
                    </div>
                  </>
                )}

                {proposal.status !== 'active' && (
                  <div className="text-sm text-gray-400">
                    <p>Final Results: {proposal.votesFor.toLocaleString()} For, {proposal.votesAgainst.toLocaleString()} Against, {proposal.votesAbstain.toLocaleString()} Abstain</p>
                    {proposal.txHash && (
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${proposal.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        View Transaction →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </NeonCard>
          );
        })}
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedProposal(null)}
        >
          <NeonCard 
            glowColor={getCategoryColor(selectedProposal.category)} 
            className="max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(selectedProposal.status)}
                    <h3 className="text-2xl font-bold text-white">{selectedProposal.title}</h3>
                  </div>
                  <p className="text-gray-400">{selectedProposal.description}</p>
                </div>
                <NeonButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setSelectedProposal(null)}
                >
                  Close
                </NeonButton>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Proposal Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proposal ID:</span>
                      <span className="text-gray-300">{selectedProposal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <Badge className={`bg-${getCategoryColor(selectedProposal.category)}-500/20 text-${getCategoryColor(selectedProposal.category)}-400 capitalize`}>
                        {selectedProposal.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className={`${
                        selectedProposal.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                        selectedProposal.status === 'passed' ? 'bg-green-500/20 text-green-400' :
                        selectedProposal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      } capitalize`}>
                        {selectedProposal.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proposer:</span>
                      <span className="text-gray-300 text-xs">{selectedProposal.proposer.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Voting Summary</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-green-400 font-semibold">{selectedProposal.votesFor.toLocaleString()} For</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-red-400 font-semibold">{selectedProposal.votesAgainst.toLocaleString()} Against</p>
                    </div>
                    <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                      <p className="text-gray-400 font-semibold">{selectedProposal.votesAbstain.toLocaleString()} Abstain</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}
