// Smart contract types and ABIs for STC Ultimate tourism platform
export type ServiceStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface TourService {
  id: number;
  name: string;
  merchant: string;
  amount: string;
  status: ServiceStatus;
  description: string;
  icon: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  timestamp?: number;
}

export interface TourPackage {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  services: TourService[];
  totalAmount: string;
  status: 'draft' | 'booked' | 'active' | 'completed';
  contractAddress?: string;
  transactionHistory?: TransactionRecord[];
  completedAt?: number;
}

export interface TransactionRecord {
  serviceId: number;
  serviceName: string;
  amount: string;
  txHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
  etherscanUrl?: string;
}

// My Tour Escrow Contract ABI
export const MY_TOUR_ESCROW_ABI = [
  {
    "inputs": [],
    "name": "finalize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "serviceIdx",
        "type": "uint256"
      }
    ],
    "name": "triggerEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxServices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "services",
    "outputs": [
      {
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "paid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPaid",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tourist",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tripEndTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Tour Package Escrow Contract ABI
export const TOUR_PACKAGE_ESCROW_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "serviceIdx",
        "type": "uint256"
      }
    ],
    "name": "completeActivity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "finalizeJourney",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_merchants",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "_tourist",
        "type": "address"
      }
    ],
    "name": "setPackage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "finalized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "getService",
    "outputs": [
      {
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "paid",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "done",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "services",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "paymentAmount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "paid",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tourist",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract addresses
export const CONTRACTS = {
  MY_TOUR_ESCROW: '0xCAF91105884175585e22AceD113F00569547a229' as const,
  TOUR_PACKAGE_ESCROW: '0xBbD364E822E60c4972d12b4BBD2B2cF12c94b613' as const,
} as const;

// Infura configuration
export const INFURA_ENDPOINT = 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206';