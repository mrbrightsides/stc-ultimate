'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vote, CheckCircle2, XCircle, Clock, TrendingUp, Coins, Award } from 'lucide-react';
import { 
  getAdvancedProposals, 
  getTreasuryData, 
  getNFTGovernanceTokens,
  predictProposalOutcome,
  hasEnoughSignatures,
  type AdvancedProposal 
} from '@/lib/phase4-governance';

export function AdvancedGovernancePanel() {
  const [proposals, setProposals] = useState<AdvancedProposal[]>(getAdvancedProposals());
  const treasury = getTreasuryData();
  const nftTokens = getNFTGovernanceTokens();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      passed: 'bg-green-500/20 text-green-300 border-green-500/50',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/50',
      executed: 'bg-purple-500/20 text-purple-300 border-purple-500/50'
    };
    return colors[status] || colors.active;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      improvement: 'text-cyan-400',
      treasury: 'text-green-400',
      policy: 'text-yellow-400',
      technical: 'text-purple-400'
    };
    return colors[type] || colors.improvement;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Advanced DAO Governance</CardTitle>
          <CardDescription className="text-gray-400">
            Enhanced proposals with multi-signature approval and quadratic voting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proposals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="proposals" className="data-[state=active]:bg-blue-500/20">
                <Vote className="h-4 w-4 mr-2" />
                Proposals
              </TabsTrigger>
              <TabsTrigger value="treasury" className="data-[state=active]:bg-green-500/20">
                <Coins className="h-4 w-4 mr-2" />
                Treasury
              </TabsTrigger>
              <TabsTrigger value="nft" className="data-[state=active]:bg-purple-500/20">
                <Award className="h-4 w-4 mr-2" />
                NFT Tokens
              </TabsTrigger>
            </TabsList>

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-4 mt-6">
              {proposals.map((proposal) => {
                const outcome = predictProposalOutcome(proposal);
                const signaturesComplete = hasEnoughSignatures(proposal);
                const yesVotes = proposal.votes.filter(v => v.choice === 'yes').length;
                const noVotes = proposal.votes.filter(v => v.choice === 'no').length;
                const totalVotes = proposal.votes.length;
                const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

                return (
                  <div 
                    key={proposal.id}
                    className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">{proposal.title}</h3>
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{proposal.description}</p>
                      </div>
                      <span className={`text-sm font-semibold ${getTypeColor(proposal.type)}`}>
                        {proposal.type}
                      </span>
                    </div>

                    {/* Voting Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Voting Progress</span>
                        <span className="text-white font-semibold">
                          {yesVotes} Yes • {noVotes} No
                        </span>
                      </div>
                      <Progress value={yesPercentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{yesPercentage.toFixed(1)}% in favor</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(proposal.votingEnds).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Multi-Sig Progress */}
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-white">Multi-Signature Approval</h4>
                        {signaturesComplete ? (
                          <Badge className="bg-green-500/20 text-green-300">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-300">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {proposal.multiSigRequirements.signatures.map((sig, idx) => (
                          <div 
                            key={idx}
                            className={`px-3 py-1 rounded text-xs ${
                              sig.signed 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}
                          >
                            {sig.signed ? <CheckCircle2 className="h-3 w-3 inline mr-1" /> : <XCircle className="h-3 w-3 inline mr-1" />}
                            Signer {idx + 1}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {proposal.multiSigRequirements.signatures.filter(s => s.signed).length} of {proposal.multiSigRequirements.required} required signatures obtained
                      </div>
                    </div>

                    {/* Quadratic Voting Info */}
                    {proposal.quadraticVoting && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className="bg-purple-500/20 text-purple-300">
                          📐 Quadratic Voting Enabled
                        </Badge>
                        <span className="text-gray-400">
                          Voting weight = √(voting power)
                        </span>
                      </div>
                    )}

                    {/* Budget Allocation */}
                    {proposal.budgetAllocation && (
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-white mb-3">Budget Allocation</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Amount:</span>
                            <span className="text-green-400 font-semibold">
                              {parseInt(proposal.budgetAllocation.amount).toLocaleString()} IDR
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Category:</span>
                            <span className="text-white">{proposal.budgetAllocation.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Recipient:</span>
                            <span className="text-white">{proposal.budgetAllocation.recipient}</span>
                          </div>
                        </div>

                        {/* Milestones */}
                        <div className="mt-4 space-y-2">
                          <h5 className="text-xs font-semibold text-gray-400">Milestones:</h5>
                          {proposal.budgetAllocation.milestones.map((milestone) => (
                            <div 
                              key={milestone.id}
                              className="flex items-center justify-between text-xs p-2 bg-gray-800/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                {milestone.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-green-400" />}
                                {milestone.status === 'verified' && <CheckCircle2 className="h-3 w-3 text-blue-400" />}
                                {milestone.status === 'pending' && <Clock className="h-3 w-3 text-gray-400" />}
                                <span className="text-gray-300">{milestone.description}</span>
                              </div>
                              <span className="text-green-400 font-semibold">
                                {parseInt(milestone.amount).toLocaleString()} IDR
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prediction */}
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-sm font-semibold text-white">Outcome Prediction</div>
                          <div className="text-xs text-gray-400">Based on current votes</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          outcome.prediction === 'likely to pass' ? 'text-green-400' :
                          outcome.prediction === 'likely to fail' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {outcome.prediction}
                        </div>
                        <div className="text-xs text-gray-500">{outcome.confidence.toFixed(1)}% confidence</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Vote Yes
                      </Button>
                      <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                        <XCircle className="h-4 w-4 mr-2" />
                        Vote No
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* Treasury Tab */}
            <TabsContent value="treasury" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <Coins className="h-8 w-8 text-green-400 mb-3" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {parseInt(treasury.totalFunds).toLocaleString()} IDR
                  </div>
                  <div className="text-sm text-gray-400">Total Treasury</div>
                </div>
                <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {parseInt(treasury.allocated).toLocaleString()} IDR
                  </div>
                  <div className="text-sm text-gray-400">Allocated Funds</div>
                </div>
                <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {parseInt(treasury.available).toLocaleString()} IDR
                  </div>
                  <div className="text-sm text-gray-400">Available Funds</div>
                </div>
              </div>

              {/* Recent Distributions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Distributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {treasury.distributions.map((dist) => (
                      <div 
                        key={dist.id}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-white">{dist.recipient}</div>
                          <div className="text-sm text-gray-400">{dist.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-400">
                            {parseInt(dist.amount).toLocaleString()} IDR
                          </div>
                          <Badge className={
                            dist.status === 'sent' ? 'bg-green-500/20 text-green-300' :
                            dist.status === 'approved' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }>
                            {dist.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NFT Tokens Tab */}
            <TabsContent value="nft" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                {nftTokens.map((token) => (
                  <div 
                    key={token.id}
                    className="p-6 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Award className="h-8 w-8 text-purple-400" />
                      <Badge className={
                        token.tier === 'platinum' ? 'bg-purple-500/20 text-purple-300' :
                        token.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-300' :
                        token.tier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                        'bg-orange-500/20 text-orange-300'
                      }>
                        {token.tier}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Owner:</span>
                        <span className="text-white font-mono">{token.owner.slice(0, 10)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Voting Power:</span>
                        <span className="text-purple-400 font-semibold">{token.votingPower}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className={token.staked ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/20 text-gray-400'}>
                          {token.staked ? 'Staked' : 'Not Staked'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Participation Stats */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Governance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">47</div>
              <div className="text-sm text-gray-400">Total Proposals</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400 mb-1">78.4%</div>
              <div className="text-sm text-gray-400">Participation Rate</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">234</div>
              <div className="text-sm text-gray-400">NFT Holders</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400 mb-1">185.7</div>
              <div className="text-sm text-gray-400">Avg Voting Power</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
