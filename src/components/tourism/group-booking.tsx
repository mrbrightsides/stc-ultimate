'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  UserX, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  Wallet,
  Zap,
  ArrowRight
} from 'lucide-react';
import type { TourPackage, TourService } from '@/app/types/contracts';

interface GroupMember {
  id: string;
  name: string;
  walletAddress: string;
  avatar: string;
  status: 'pending' | 'connected' | 'active' | 'completed';
  completedServices: number[];
}

interface GroupBookingProps {
  tourPackage: TourPackage;
  onServiceTrigger: (serviceId: number, memberId: string) => void;
  onFinalizeTour: () => void;
  walletConnected: boolean;
}

const SAMPLE_MEMBERS: Omit<GroupMember, 'completedServices'>[] = [
  { 
    id: '1', 
    name: 'Alice Chen', 
    walletAddress: '0x742d35Cc7830C4517D4c8e8aC74e5c2D5aAd5D5c',
    avatar: 'AC',
    status: 'connected'
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    walletAddress: '0x8ba1f109551bD432803012645Hac136c9.IsAddress',
    avatar: 'BS',
    status: 'connected'
  },
  { 
    id: '3', 
    name: 'Carol Johnson', 
    walletAddress: '0x1234567890123456789012345678901234567890',
    avatar: 'CJ',
    status: 'pending'
  },
];

export function GroupBooking({ 
  tourPackage, 
  onServiceTrigger, 
  onFinalizeTour, 
  walletConnected 
}: GroupBookingProps) {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>(
    SAMPLE_MEMBERS.map(member => ({ ...member, completedServices: [] }))
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberWallet, setNewMemberWallet] = useState('');
  const [triggeringService, setTriggeringService] = useState<{ serviceId: number; memberId: string } | null>(null);

  const addGroupMember = (): void => {
    if (!newMemberName.trim() || !newMemberWallet.trim()) return;
    
    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: newMemberName,
      walletAddress: newMemberWallet,
      avatar: newMemberName.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'pending',
      completedServices: []
    };
    
    setGroupMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberWallet('');
  };

  const removeGroupMember = (memberId: string): void => {
    setGroupMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleServiceTrigger = async (serviceId: number, memberId: string): Promise<void> => {
    setTriggeringService({ serviceId, memberId });
    
    // Simulate IoT interaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update member's completed services
    setGroupMembers(prev => prev.map(member =>
      member.id === memberId
        ? {
            ...member,
            completedServices: [...member.completedServices, serviceId],
            status: member.completedServices.length + 1 === tourPackage.services.length ? 'completed' : 'active'
          }
        : member
    ));
    
    onServiceTrigger(serviceId, memberId);
    setTriggeringService(null);
  };

  const getServiceCompletionCount = (serviceId: number): number => {
    return groupMembers.filter(member => member.completedServices.includes(serviceId)).length;
  };

  const getMemberProgress = (member: GroupMember): number => {
    return (member.completedServices.length / tourPackage.services.length) * 100;
  };

  const getOverallProgress = (): number => {
    const totalPossibleCompletions = groupMembers.length * tourPackage.services.length;
    const totalCompletions = groupMembers.reduce((sum, member) => sum + member.completedServices.length, 0);
    return totalPossibleCompletions > 0 ? (totalCompletions / totalPossibleCompletions) * 100 : 0;
  };

  const isServiceCompletedByMember = (serviceId: number, memberId: string): boolean => {
    const member = groupMembers.find(m => m.id === memberId);
    return member?.completedServices.includes(serviceId) || false;
  };

  const getMemberStatusColor = (status: GroupMember['status']): string => {
    switch (status) {
      case 'pending':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'connected':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'active':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const isGroupComplete = (): boolean => {
    return groupMembers.every(member => member.status === 'completed');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          Group Travel Dashboard
        </h2>
        <div className="flex items-center justify-center gap-6 text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>{tourPackage.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span>{tourPackage.startDate} - {tourPackage.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            <span>{groupMembers.length} Members</span>
          </div>
        </div>
      </div>

      {/* Group Overview */}
      <NeonCard glowColor="green" intense={isGroupComplete()}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Users className="h-6 w-6 text-green-400" />
              Group Progress
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-400">
                {Math.round(getOverallProgress())}%
              </p>
              <p className="text-sm text-gray-400">Overall Completion</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Group Journey Progress</span>
              <span className="text-green-400 font-medium">{Math.round(getOverallProgress())}%</span>
            </div>
            <Progress 
              value={getOverallProgress()} 
              className="h-3 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-cyan-500"
            />
          </div>

          {isGroupComplete() && (
            <div className="pt-4 border-t border-green-500/20">
              <NeonButton
                variant="success"
                size="lg"
                onClick={onFinalizeTour}
                className="w-full"
              >
                <CheckCircle className="h-5 w-5" />
                Finalize Group Journey & Distribute Rewards
              </NeonButton>
            </div>
          )}
        </div>
      </NeonCard>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Group Members Management */}
        <div className="lg:col-span-1 space-y-6">
          <NeonCard glowColor="purple">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Group Members</h3>
              </div>

              {/* Add New Member */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="member-name" className="text-gray-300 text-sm">Member Name</Label>
                  <Input
                    id="member-name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter full name"
                    className="bg-black/50 border-purple-500/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="member-wallet" className="text-gray-300 text-sm">Wallet Address</Label>
                  <Input
                    id="member-wallet"
                    value={newMemberWallet}
                    onChange={(e) => setNewMemberWallet(e.target.value)}
                    placeholder="0x..."
                    className="bg-black/50 border-purple-500/50 text-white font-mono text-sm"
                  />
                </div>
                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={addGroupMember}
                  disabled={!newMemberName.trim() || !newMemberWallet.trim()}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </NeonButton>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{member.name}</p>
                        <p className="text-gray-400 text-xs font-mono">
                          {member.walletAddress.slice(0, 8)}...{member.walletAddress.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getMemberStatusColor(member.status)} text-xs px-2 py-1`}>
                        {member.status}
                      </Badge>
                      <button
                        onClick={() => removeGroupMember(member.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>

          {/* Individual Progress */}
          <NeonCard glowColor="cyan">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Individual Progress
              </h3>
              
              <div className="space-y-3">
                {groupMembers.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-cyan-500/20 text-cyan-300 text-xs">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm">{member.name}</span>
                      </div>
                      <span className="text-cyan-400 text-sm font-medium">
                        {member.completedServices.length}/{tourPackage.services.length}
                      </span>
                    </div>
                    <Progress 
                      value={getMemberProgress(member)} 
                      className="h-2 bg-black/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Services Grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {tourPackage.services.map((service, index) => {
              const completionCount = getServiceCompletionCount(service.id);
              const completionRate = groupMembers.length > 0 ? (completionCount / groupMembers.length) * 100 : 0;
              
              return (
                <NeonCard
                  key={service.id}
                  glowColor={completionRate === 100 ? 'green' : 'orange'}
                  className="transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Service Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">{completionCount}/{groupMembers.length}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                      </div>
                    </div>

                    {/* Service Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Group Completion</span>
                        <span className="text-green-400 font-medium">{Math.round(completionRate)}%</span>
                      </div>
                      <Progress 
                        value={completionRate} 
                        className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-green-500"
                      />
                    </div>

                    {/* Member Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      {groupMembers.map((member) => {
                        const isCompleted = isServiceCompletedByMember(service.id, member.id);
                        const isTriggering = triggeringService?.serviceId === service.id && triggeringService?.memberId === member.id;
                        const canTrigger = !isCompleted && member.status !== 'pending' && walletConnected;

                        return (
                          <div key={member.id} className="flex items-center justify-between p-2 rounded bg-black/30 border border-gray-700">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarFallback className="bg-gray-600 text-gray-300 text-xs">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-sm truncate">{member.name}</span>
                            </div>
                            
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : canTrigger ? (
                                <NeonButton
                                  size="sm"
                                  variant="primary"
                                  loading={isTriggering}
                                  disabled={isTriggering}
                                  onClick={() => handleServiceTrigger(service.id, member.id)}
                                  className="text-xs px-2 py-1"
                                >
                                  {isTriggering ? (
                                    <Clock className="h-3 w-3" />
                                  ) : (
                                    <Zap className="h-3 w-3" />
                                  )}
                                </NeonButton>
                              ) : member.status === 'pending' ? (
                                <AlertCircle className="h-4 w-4 text-orange-400" />
                              ) : !walletConnected ? (
                                <Wallet className="h-4 w-4 text-red-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </NeonCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}