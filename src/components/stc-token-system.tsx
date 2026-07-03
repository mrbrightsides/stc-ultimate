'use client'

import { useState, useEffect } from 'react'
import { Coins, Gift, TrendingUp, Users, Award, Zap } from 'lucide-react'

interface STCTokenData {
  balance: number
  earned: number
  staked: number
  redeemable: number
  level: number
  nextLevelThreshold: number
}

interface TokenActivity {
  type: 'earned' | 'redeemed' | 'staked' | 'referral'
  amount: number
  description: string
  timestamp: Date
  txHash?: string
}

interface STCTokenSystemProps {
  walletAddress: string
}

export function STCTokenSystem({ walletAddress }: STCTokenSystemProps) {
  const [tokenData, setTokenData] = useState<STCTokenData>({
    balance: 1250,
    earned: 2340,
    staked: 500,
    redeemable: 750,
    level: 3,
    nextLevelThreshold: 2500
  })
  
  const [activities, setActivities] = useState<TokenActivity[]>([
    {
      type: 'earned',
      amount: 150,
      description: 'Completed Bali journey - Hotel check-in',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      type: 'earned',
      amount: 100,
      description: 'First-time user bonus',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      type: 'redeemed',
      amount: -200,
      description: 'Used for 10% discount on Tokyo package',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      type: 'referral',
      amount: 50,
      description: 'Friend joined through your referral',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'overview' | 'earn' | 'redeem' | 'stake'>('overview')
  const [stakingAmount, setStakingAmount] = useState<string>('')

  // Calculate token rewards based on activity
  const calculateRewards = (activity: string, amount: number): number => {
    const baseRewards: Record<string, number> = {
      'hotel_checkin': 150,
      'flight_boarding': 200,
      'restaurant_dining': 100,
      'shopping': 75,
      'transportation': 50,
      'journey_completion': 500
    }
    
    return baseRewards[activity] || 50
  }

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: 'Explorer', color: 'text-green-400', benefits: ['5% discounts', 'Basic rewards'] },
      { name: 'Traveler', color: 'text-blue-400', benefits: ['10% discounts', 'Priority booking'] },
      { name: 'Adventurer', color: 'text-purple-400', benefits: ['15% discounts', 'Exclusive destinations'] },
      { name: 'Nomad', color: 'text-orange-400', benefits: ['20% discounts', 'VIP support', 'Beta access'] },
      { name: 'Legend', color: 'text-gold-400', benefits: ['25% discounts', 'Custom packages', 'Direct partnerships'] }
    ]
    
    return levels[level - 1] || levels[0]
  }

  const getActivityIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'earned': return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'redeemed': return <Gift className="h-4 w-4 text-blue-400" />
      case 'staked': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'referral': return <Users className="h-4 w-4 text-purple-400" />
      default: return <Coins className="h-4 w-4" />
    }
  }

  const handleStake = async (): Promise<void> => {
    const amount = parseInt(stakingAmount)
    if (!amount || amount > tokenData.balance) return

    // Simulate staking transaction
    setTokenData(prev => ({
      ...prev,
      balance: prev.balance - amount,
      staked: prev.staked + amount
    }))

    setActivities(prev => [{
      type: 'staked',
      amount: amount,
      description: `Staked ${amount} STC tokens for rewards`,
      timestamp: new Date()
    }, ...prev])

    setStakingAmount('')
  }

  const levelInfo = getLevelInfo(tokenData.level)
  const progressPercent = (tokenData.earned / tokenData.nextLevelThreshold) * 100

  return (
    <div className="space-y-6">
      {/* Token Overview Header */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">STC Token Wallet</h2>
              <div className="text-gray-300 text-sm">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{tokenData.balance.toLocaleString()}</div>
            <div className="text-cyan-400 text-sm">STC Available</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${levelInfo.color}`} />
              <span className={`font-semibold ${levelInfo.color}`}>{levelInfo.name}</span>
              <span className="text-gray-400">Level {tokenData.level}</span>
            </div>
            <div className="text-gray-400 text-sm">
              {tokenData.earned} / {tokenData.nextLevelThreshold} XP
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {levelInfo.benefits.map((benefit, idx) => (
              <span key={idx} className="px-2 py-1 bg-black/40 text-cyan-400 rounded text-xs">
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Coins },
          { id: 'earn', label: 'Earn', icon: TrendingUp },
          { id: 'redeem', label: 'Redeem', icon: Gift },
          { id: 'stake', label: 'Stake', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              selectedTab === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stats Cards */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-gray-300 text-sm">Total Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">{tokenData.earned.toLocaleString()}</div>
            <div className="text-green-400 text-sm">+150 this week</div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 text-sm">Staked</span>
            </div>
            <div className="text-2xl font-bold text-white">{tokenData.staked.toLocaleString()}</div>
            <div className="text-yellow-400 text-sm">Earning 12% APY</div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Redeemable</span>
            </div>
            <div className="text-2xl font-bold text-white">{tokenData.redeemable.toLocaleString()}</div>
            <div className="text-blue-400 text-sm">Ready to use</div>
          </div>
        </div>
      )}

      {selectedTab === 'earn' && (
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ways to Earn STC Tokens</h3>
          
          <div className="space-y-4">
            {[
              { activity: 'Complete a journey', reward: '500 STC', description: 'Finish all activities in your booked package' },
              { activity: 'Hotel check-in', reward: '150 STC', description: 'Successfully check into your booked hotel' },
              { activity: 'Flight boarding', reward: '200 STC', description: 'Board your flight on time' },
              { activity: 'Restaurant dining', reward: '100 STC', description: 'Complete meal at partner restaurants' },
              { activity: 'Refer a friend', reward: '50 STC', description: 'When your referral makes their first booking' },
              { activity: 'Write a review', reward: '25 STC', description: 'Leave verified reviews for services used' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">{item.activity}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
                <div className="text-cyan-400 font-semibold">{item.reward}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'redeem' && (
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Redeem Rewards</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { item: '5% Trip Discount', cost: '100 STC', available: true },
              { item: '10% Trip Discount', cost: '200 STC', available: true },
              { item: '15% Trip Discount', cost: '300 STC', available: true },
              { item: 'Free Airport Transfer', cost: '150 STC', available: true },
              { item: 'VIP Hotel Upgrade', cost: '500 STC', available: false },
              { item: 'Exclusive Destination Access', cost: '1000 STC', available: false }
            ].map((reward, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                reward.available 
                  ? 'bg-gray-800/50 border-cyan-500/30 hover:border-cyan-500/50' 
                  : 'bg-gray-900/50 border-gray-700 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">{reward.item}</div>
                  <div className="text-cyan-400">{reward.cost}</div>
                </div>
                <button
                  disabled={!reward.available}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    reward.available
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-700 hover:to-cyan-600'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {reward.available ? 'Redeem' : 'Insufficient Balance'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'stake' && (
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stake STC Tokens</h3>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                <div>
                  <div className="text-white font-semibold">12% Annual Rewards</div>
                  <div className="text-gray-300 text-sm">Earn additional STC tokens by staking</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Amount to Stake (Available: {tokenData.balance} STC)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    placeholder="0"
                    max={tokenData.balance}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => setStakingAmount(tokenData.balance.toString())}
                    className="px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={!stakingAmount || parseInt(stakingAmount) > tokenData.balance}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Stake Tokens
              </button>

              <div className="text-gray-400 text-sm">
                <p>• Staked tokens earn 12% annual rewards</p>
                <p>• Rewards are distributed daily</p>
                <p>• No lock-up period - unstake anytime</p>
                <p>• Higher stake = higher travel rewards multiplier</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
        
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getActivityIcon(activity.type)}
                <div>
                  <div className="text-white text-sm">{activity.description}</div>
                  <div className="text-gray-400 text-xs">
                    {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${
                activity.amount > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {activity.amount > 0 ? '+' : ''}{activity.amount} STC
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}