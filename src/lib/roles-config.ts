/**
 * Role-based Access Control Configuration
 * Defines user roles and their permitted modules/features
 */

export type UserRole = 'tourist' | 'sme' | 'researcher' | 'admin';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
  color: string;
  allowedModules: AppModule[];
  features: string[];
}

export type AppModule = 
  | 'builder'        // Tourism package builder
  | 'dashboard'      // Journey dashboard
  | 'summary'        // Dashboard summary
  | 'metaverse'      // Virtual tourism & 360°
  | 'ecosystem'      // STC Ecosystem
  | 'research'       // Research hub & data collection
  | 'scada'          // SCADA control system
  | 'export'         // Data export manager
  | 'documentation'  // Complete documentation
  | 'advanced'       // Advanced AI tools
  | 'hcps-framework' // HCPS-Tourism 5.0 Framework Documentation
  | 'governance'     // DAO Governance & Voting
  | 'trip-planner'   // AI-powered Trip Planner
  | 'collaboration'  // Real-time Collaboration
  | 'cross-chain'    // Cross-chain Bridge
  | 'nft-gallery'    // NFT Achievements & Badges
  | 'base-wallet'    // Base Smart Wallet & OnchainKit
  | 'about';         // About page

/**
 * Role definitions with access permissions
 */
export const ROLE_DEFINITIONS: Record<UserRole, RoleConfig> = {
  tourist: {
    id: 'tourist',
    name: 'Tourist',
    description: 'Travelers exploring destinations and booking experiences',
    icon: '🧳',
    color: 'cyan',
    allowedModules: ['builder', 'dashboard', 'summary', 'metaverse', 'trip-planner', 'nft-gallery', 'base-wallet', 'about'],
    features: [
      'Book tour packages',
      'Virtual tourism experiences',
      'Real-time journey tracking',
      'Payment & rewards',
      'QR code verification'
    ]
  },
  sme: {
    id: 'sme',
    name: 'SME Owner',
    description: 'Small & Medium Enterprise owners in tourism sector',
    icon: '🏢',
    color: 'purple',
    allowedModules: ['summary', 'ecosystem', 'export', 'advanced', 'metaverse', 'governance', 'cross-chain', 'base-wallet', 'about'],
    features: [
      'Business analytics dashboard',
      'Revenue & booking insights',
      'Customer behavior analysis',
      'Smart contracts management',
      'Data export & reporting',
      'AI-powered recommendations'
    ]
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    description: 'Academic researchers studying smart tourism & blockchain',
    icon: '🔬',
    color: 'green',
    allowedModules: ['research', 'documentation', 'summary', 'export', 'ecosystem', 'hcps-framework', 'governance', 'trip-planner', 'collaboration', 'cross-chain', 'nft-gallery', 'base-wallet', 'metaverse', 'about'],
    features: [
      'Research data collection',
      'Transaction proof system',
      'Comprehensive documentation',
      'Statistical analysis tools',
      'Experiment management',
      'Academic paper export'
    ]
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'System administrators with full access',
    icon: '👑',
    color: 'orange',
    allowedModules: [
      'builder',
      'dashboard',
      'summary',
      'metaverse',
      'ecosystem',
      'research',
      'scada',
      'export',
      'documentation',
      'advanced',
      'hcps-framework',
      'governance',
      'trip-planner',
      'collaboration',
      'cross-chain',
      'nft-gallery',
      'base-wallet',
      'about'
    ],
    features: [
      'Full system access',
      'SCADA control system',
      'IoT device management',
      'Real-time monitoring',
      'User management',
      'Security & audit logs',
      'System configuration'
    ]
  }
};

/**
 * Module metadata for display
 */
export interface ModuleMetadata {
  id: AppModule;
  title: string;
  description: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'outline';
  requiredRoles: UserRole[];
}

export const MODULE_METADATA: Record<AppModule, ModuleMetadata> = {
  builder: {
    id: 'builder',
    title: 'Start Your Journey',
    description: 'Build custom tour packages with smart contracts',
    icon: 'Plane',
    variant: 'primary',
    requiredRoles: ['tourist', 'admin']
  },
  dashboard: {
    id: 'dashboard',
    title: 'Journey Dashboard',
    description: 'Track your real-time tourism experience',
    icon: 'Activity',
    variant: 'secondary',
    requiredRoles: ['tourist', 'admin']
  },
  summary: {
    id: 'summary',
    title: 'Dashboard',
    description: 'Overview of all system modules and metrics',
    icon: 'LayoutDashboard',
    variant: 'secondary',
    requiredRoles: ['researcher', 'admin']
  },
  metaverse: {
    id: 'metaverse',
    title: 'Virtual Tourism',
    description: 'Immersive 360° experiences and virtual showrooms',
    icon: 'Globe',
    variant: 'secondary',
    requiredRoles: ['tourist', 'sme', 'admin']
  },
  ecosystem: {
    id: 'ecosystem',
    title: 'STC Ecosystem',
    description: 'Explore the complete Smart Tourism Chain network',
    icon: 'Network',
    variant: 'secondary',
    requiredRoles: ['sme', 'researcher', 'admin']
  },
  research: {
    id: 'research',
    title: 'Research Hub',
    description: 'Academic research tools and data collection',
    icon: 'BarChart3',
    variant: 'secondary',
    requiredRoles: ['researcher', 'admin']
  },
  scada: {
    id: 'scada',
    title: 'SCADA System',
    description: 'Real-time IoT monitoring and control',
    icon: 'Cpu',
    variant: 'secondary',
    requiredRoles: ['admin']
  },
  export: {
    id: 'export',
    title: 'Export Data',
    description: 'Download reports and analytics',
    icon: 'Download',
    variant: 'secondary',
    requiredRoles: ['sme', 'researcher', 'admin']
  },
  documentation: {
    id: 'documentation',
    title: 'Complete Documentation',
    description: 'Comprehensive technical and user guides',
    icon: 'BookOpen',
    variant: 'outline',
    requiredRoles: ['researcher', 'admin']
  },
  advanced: {
    id: 'advanced',
    title: 'Advanced AI Tools',
    description: 'AI-powered analytics and recommendations',
    icon: 'Sparkles',
    variant: 'secondary',
    requiredRoles: ['sme', 'admin']
  },
  'hcps-framework': {
    id: 'hcps-framework',
    title: 'HCPS-Tourism 5.0',
    description: 'Complete Framework Documentation & Research Foundation',
    icon: 'BookOpen',
    variant: 'primary',
    requiredRoles: ['researcher', 'admin']
  },
  governance: {
    id: 'governance',
    title: 'DAO Governance',
    description: 'Decentralized voting, proposals & treasury management',
    icon: 'Users',
    variant: 'secondary',
    requiredRoles: ['researcher', 'admin', 'sme']
  },
  'trip-planner': {
    id: 'trip-planner',
    title: 'AI Trip Planner',
    description: 'Intelligent tour planning with ML recommendations',
    icon: 'MapPin',
    variant: 'secondary',
    requiredRoles: ['tourist', 'admin']
  },
  collaboration: {
    id: 'collaboration',
    title: 'Collaboration Hub',
    description: 'Real-time chat, whiteboard & video conferencing',
    icon: 'Users',
    variant: 'secondary',
    requiredRoles: ['researcher', 'admin', 'sme']
  },
  'cross-chain': {
    id: 'cross-chain',
    title: 'Cross-Chain Bridge',
    description: 'Transfer tokens across multiple blockchains',
    icon: 'Network',
    variant: 'secondary',
    requiredRoles: ['admin', 'sme']
  },
  'nft-gallery': {
    id: 'nft-gallery',
    title: 'NFT Gallery',
    description: 'Tourism achievements, badges & collectibles',
    icon: 'Sparkles',
    variant: 'secondary',
    requiredRoles: ['tourist', 'researcher', 'admin']
  },
  'base-wallet': {
    id: 'base-wallet',
    title: 'Base Wallet',
    description: 'Smart wallet, token swaps & onchain payments',
    icon: 'Wallet',
    variant: 'primary',
    requiredRoles: ['tourist', 'sme', 'researcher', 'admin']
  },
  about: {
    id: 'about',
    title: 'About App',
    description: 'Learn about STC Ultimate platform',
    icon: 'Info',
    variant: 'outline',
    requiredRoles: ['researcher', 'admin']
  }
};

/**
 * Check if user role has access to a module
 */
export function hasModuleAccess(userRole: UserRole, module: AppModule): boolean {
  const roleConfig = ROLE_DEFINITIONS[userRole];
  return roleConfig.allowedModules.includes(module);
}

/**
 * Get all accessible modules for a role
 */
export function getAccessibleModules(userRole: UserRole): AppModule[] {
  return ROLE_DEFINITIONS[userRole].allowedModules;
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_DEFINITIONS[role];
}

/**
 * Get all roles
 */
export function getAllRoles(): RoleConfig[] {
  return Object.values(ROLE_DEFINITIONS);
}
