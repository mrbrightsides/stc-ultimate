'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Users, Vote, TrendingUp, DollarSign, CheckCircle2, Clock, XCircle, AlertCircle, Shield, Coins, FileText } from 'lucide-react';
import { 
  getDAOGovernance, 
  getActiveProposals as getPhase1Proposals, 
  castVote as castPhase1Vote,
  type DAOProposal 
} from '@/lib/phase1-dao-governance';
import { 
  getGovernanceSystem,
  getProposals as getPhase4Proposals,
  getVotingHistory,
  getTreasuryTransactions,
  type Proposal as Phase4Proposal,
  type VoteRecord,
  type TreasuryTransaction
} from '@/lib/phase4-governance';

interface DAOGovernanceHubProps {
  onBack: () => void;
}

export default function DAOGovernanceHub({ onBack }: DAOGovernanceHubProps) {
  const [activeTab, setActiveTab] = useState<string>('proposals');
  const [votingProposal, setVotingProposal] = useState<string | null>(null);

  // Get data from Phase 1 and Phase 4
  const daoData = getDAOGovernance();
  const phase1Proposals = getPhase1Proposals();
  const governanceSystem = getGovernanceSystem();
  const phase4Proposals = getPhase4Proposals();
  const votingHistory = getVotingHistory();
  const treasuryTxns = getTreasuryTransactions();

  // Combine proposals from both phases
  const allProposals = [...phase1Proposals, ...phase4Proposals.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    proposer: p.proposer,
    votesFor: p.votesFor,
    votesAgainst: p.votesAgainst,
    status: p.status as 'active' | 'passed' | 'rejected' | 'pending',
    createdAt: new Date(p.createdAt),
    endDate: new Date(p.endDate),
    category: p.category,
    requiredSignatures: p.requiredSignatures,
    currentSignatures: p.currentSignatures
  }))];

  const handleVote = (proposalId: string, support: boolean): void => {
    castPhase1Vote(proposalId, support);
    setVotingProposal(null);
    // In a real app, this would trigger a blockchain transaction
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      passed: 'bg-green-500/20 text-green-300 border-green-500/50',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/50',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  };

  const getStatusIcon = (status: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      active: <Clock className="h-4 w-4" />,
      passed: <CheckCircle2 className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      pending: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                DAO Governance
              </h1>
              <p className="text-gray-400 mt-2">Decentralized governance for Smart Tourism ecosystem</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Proposals</p>
                  <p className="text-3xl font-bold text-purple-400">{allProposals.length}</p>
                </div>
                <FileText className="h-10 w-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Participation Rate</p>
                  <p className="text-3xl font-bold text-blue-400">{daoData.participationRate}%</p>
                </div>
                <Users className="h-10 w-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Treasury Balance</p>
                  <p className="text-3xl font-bold text-green-400">{governanceSystem.treasury.balance.toFixed(1)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Token Holders</p>
                  <p className="text-3xl font-bold text-orange-400">{governanceSystem.nftGovernance.totalHolders}</p>
                </div>
                <Coins className="h-10 w-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="voting">Voting History</TabsTrigger>
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="nft">NFT Governance</TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="grid gap-6">
              {allProposals.map((proposal) => {
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

                return (
                  <Card key={proposal.id} className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl text-white">{proposal.title}</CardTitle>
                            <Badge className={getStatusColor(proposal.status)}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </Badge>
                          </div>
                          <CardDescription>{proposal.description}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Proposed by: {proposal.proposer}</span>
                            <span>•</span>
                            <span>Ends: {proposal.endDate.toLocaleDateString()}</span>
                            {proposal.requiredSignatures && (
                              <>
                                <span>•</span>
                                <span>Signatures: {proposal.currentSignatures}/{proposal.requiredSignatures}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Vote Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">For: {proposal.votesFor} votes</span>
                          <span className="text-red-400">Against: {proposal.votesAgainst} votes</span>
                        </div>
                        <Progress value={forPercentage} className="h-2" />
                        <p className="text-xs text-gray-400 text-center">
                          {forPercentage.toFixed(1)}% support
                        </p>
                      </div>

                      {/* Voting Buttons */}
                      {proposal.status === 'active' && (
                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/50"
                            onClick={() => handleVote(proposal.id, true)}
                          >
                            <Vote className="h-4 w-4 mr-2" />
                            Vote For
                          </Button>
                          <Button
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
                            onClick={() => handleVote(proposal.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Vote Against
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Voting History Tab */}
          <TabsContent value="voting" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Your Voting History</CardTitle>
                <CardDescription>Review your past votes and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {votingHistory.map((vote) => (
                    <div key={vote.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{vote.proposalTitle}</p>
                        <p className="text-sm text-gray-400">Voted on {new Date(vote.votedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={vote.vote ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                          {vote.vote ? 'For' : 'Against'}
                        </Badge>
                        <span className="text-sm text-gray-400">{vote.votingPower} power</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Treasury Management</CardTitle>
                <CardDescription>Track DAO treasury balance and transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Treasury Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Total Balance</p>
                    <p className="text-2xl font-bold text-green-400">{governanceSystem.treasury.balance.toFixed(1)}M IDR</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Allocated</p>
                    <p className="text-2xl font-bold text-blue-400">{governanceSystem.treasury.allocated.toFixed(1)}M IDR</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Available</p>
                    <p className="text-2xl font-bold text-purple-400">{governanceSystem.treasury.available.toFixed(1)}M IDR</p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Recent Transactions</h4>
                  {treasuryTxns.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{txn.description}</p>
                        <p className="text-sm text-gray-400">{new Date(txn.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${txn.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {txn.type === 'deposit' ? '+' : '-'}{txn.amount.toFixed(1)}M IDR
                        </p>
                        <Badge className={getStatusColor(txn.status)}>
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Governance Tab */}
          <TabsContent value="nft" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>NFT Governance Tokens</CardTitle>
                <CardDescription>Voting power based on NFT holdings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-purple-500/10 border-purple-500/30">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-gray-300">
                    Your voting power is determined by the rarity and quantity of tourism NFTs you hold.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Total Holders</p>
                    <p className="text-2xl font-bold text-purple-400">{governanceSystem.nftGovernance.totalHolders}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Your Voting Power</p>
                    <p className="text-2xl font-bold text-orange-400">{governanceSystem.nftGovernance.votingPowerDistribution[0]}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Voting Power by Rarity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                      <span className="text-gray-300">Common NFTs</span>
                      <span className="font-bold text-gray-400">1 vote each</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded">
                      <span className="text-blue-300">Rare NFTs</span>
                      <span className="font-bold text-blue-400">5 votes each</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-purple-300">Epic NFTs</span>
                      <span className="font-bold text-purple-400">10 votes each</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded">
                      <span className="text-orange-300">Legendary NFTs</span>
                      <span className="font-bold text-orange-400">25 votes each</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
