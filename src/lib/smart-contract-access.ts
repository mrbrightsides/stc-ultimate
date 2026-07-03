/**
 * Smart Contract Access Control - Phase 2 Zero Trust Security
 * Token-gated features and on-chain permission verification
 */

import type { Address } from 'viem';
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

export type AccessLevel = 'public' | 'token_holder' | 'staker' | 'dao_member' | 'admin';

export type AccessRequirement = {
  level: AccessLevel;
  minTokenBalance?: bigint;
  requiredNFT?: Address;
  requiredRole?: string;
};

export type AccessCheckResult = {
  hasAccess: boolean;
  level: AccessLevel;
  reasons: string[];
  metadata: {
    tokenBalance?: string;
    nftOwned?: boolean;
    roleHeld?: boolean;
    verifiedAt: string;
  };
};

/**
 * Smart Contract Access Controller
 * Verifies on-chain permissions and token-gates features
 */
export class SmartContractAccessControl {
  private client;

  // Example token addresses (replace with actual deployed addresses)
  private readonly STC_TOKEN_ADDRESS: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base as placeholder
  private readonly STC_NFT_ADDRESS: Address = '0x0000000000000000000000000000000000000000';
  
  constructor() {
    this.client = createPublicClient({
      chain: base,
      transport: http(),
    });
  }

  /**
   * Check if wallet meets access requirements
   */
  async checkAccess(
    wallet: Address,
    requirement: AccessRequirement
  ): Promise<AccessCheckResult> {
    const result: AccessCheckResult = {
      hasAccess: false,
      level: requirement.level,
      reasons: [],
      metadata: {
        verifiedAt: new Date().toISOString(),
      },
    };

    try {
      switch (requirement.level) {
        case 'public':
          result.hasAccess = true;
          result.reasons.push('Public access granted');
          break;

        case 'token_holder':
          if (requirement.minTokenBalance) {
            const balance = await this.getTokenBalance(wallet, this.STC_TOKEN_ADDRESS);
            result.metadata.tokenBalance = balance.toString();

            if (balance >= requirement.minTokenBalance) {
              result.hasAccess = true;
              result.reasons.push(`Token balance sufficient: ${this.formatBalance(balance)}`);
            } else {
              result.reasons.push(
                `Insufficient token balance: ${this.formatBalance(balance)} < ${this.formatBalance(requirement.minTokenBalance)}`
              );
            }
          }
          break;

        case 'staker':
          // Check staking contract for staked tokens
          const stakedBalance = await this.getStakedBalance(wallet);
          result.metadata.tokenBalance = stakedBalance.toString();

          if (stakedBalance > BigInt(0)) {
            result.hasAccess = true;
            result.reasons.push(`Staked tokens: ${this.formatBalance(stakedBalance)}`);
          } else {
            result.reasons.push('No staked tokens found');
          }
          break;

        case 'dao_member':
          // Check DAO membership (could be NFT-based or governance token)
          const isDaoMember = await this.checkDaoMembership(wallet);
          result.metadata.nftOwned = isDaoMember;

          if (isDaoMember) {
            result.hasAccess = true;
            result.reasons.push('DAO membership verified');
          } else {
            result.reasons.push('Not a DAO member');
          }
          break;

        case 'admin':
          // Check admin role in access control contract
          const isAdmin = await this.checkAdminRole(wallet);
          result.metadata.roleHeld = isAdmin;

          if (isAdmin) {
            result.hasAccess = true;
            result.reasons.push('Admin role verified');
          } else {
            result.reasons.push('Admin role not held');
          }
          break;

        default:
          result.reasons.push(`Unknown access level: ${requirement.level}`);
      }
    } catch (error) {
      result.reasons.push(`Access check failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Get ERC20 token balance
   */
  private async getTokenBalance(wallet: Address, tokenAddress: Address): Promise<bigint> {
    try {
      const balance = await this.client.readContract({
        address: tokenAddress,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [wallet],
      });

      return balance as bigint;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get staked token balance
   */
  private async getStakedBalance(wallet: Address): Promise<bigint> {
    // Placeholder - implement actual staking contract call
    // For now, return 0 as staking contract not yet deployed
    try {
      // const stakedBalance = await this.client.readContract({
      //   address: STAKING_CONTRACT_ADDRESS,
      //   abi: parseAbi(['function stakedBalance(address) view returns (uint256)']),
      //   functionName: 'stakedBalance',
      //   args: [wallet],
      // });
      // return stakedBalance as bigint;
      return BigInt(0);
    } catch (error) {
      console.error('Error fetching staked balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Check DAO membership (NFT-based)
   */
  private async checkDaoMembership(wallet: Address): Promise<boolean> {
    try {
      if (this.STC_NFT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        return false; // NFT contract not deployed
      }

      const balance = await this.client.readContract({
        address: this.STC_NFT_ADDRESS,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [wallet],
      });

      return (balance as bigint) > BigInt(0);
    } catch (error) {
      console.error('Error checking DAO membership:', error);
      return false;
    }
  }

  /**
   * Check admin role
   */
  private async checkAdminRole(wallet: Address): Promise<boolean> {
    // Placeholder - implement actual access control contract call
    // For now, return false as access control not deployed
    try {
      // const hasRole = await this.client.readContract({
      //   address: ACCESS_CONTROL_ADDRESS,
      //   abi: parseAbi(['function hasRole(bytes32,address) view returns (bool)']),
      //   functionName: 'hasRole',
      //   args: [ADMIN_ROLE_HASH, wallet],
      // });
      // return hasRole as boolean;
      return false;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  /**
   * Format balance for display
   */
  private formatBalance(balance: bigint): string {
    // Assuming 18 decimals for STC token
    const decimals = 18;
    const divisor = BigInt(10 ** decimals);
    const whole = balance / divisor;
    const fraction = balance % divisor;
    
    return `${whole}.${fraction.toString().padStart(decimals, '0').slice(0, 4)} STC`;
  }

  /**
   * Batch check multiple requirements
   */
  async checkMultipleRequirements(
    wallet: Address,
    requirements: AccessRequirement[]
  ): Promise<AccessCheckResult[]> {
    return Promise.all(
      requirements.map((req: AccessRequirement) => this.checkAccess(wallet, req))
    );
  }

  /**
   * Get recommended access level for wallet
   */
  async getRecommendedAccessLevel(wallet: Address): Promise<AccessLevel> {
    try {
      const tokenBalance = await this.getTokenBalance(wallet, this.STC_TOKEN_ADDRESS);
      const stakedBalance = await this.getStakedBalance(wallet);
      const isDaoMember = await this.checkDaoMembership(wallet);
      const isAdmin = await this.checkAdminRole(wallet);

      if (isAdmin) return 'admin';
      if (isDaoMember) return 'dao_member';
      if (stakedBalance > BigInt(0)) return 'staker';
      if (tokenBalance > BigInt(0)) return 'token_holder';
      return 'public';
    } catch (error) {
      console.error('Error determining access level:', error);
      return 'public';
    }
  }
}

export const smartContractAccessControl = new SmartContractAccessControl();
