module.exports = {
  // NETWORK: "homestead",
  NETWORK: "kovan",

  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  YFI: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  CORE: "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7",
  UNI: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  COINS: ["bitcoin", "ethereum", "syscoin", "cardano", "binancecoin", "solana", "dogecoin"],
  TOKENS: [
    "0x8c6bf16c273636523c29db7db04396143770f6a0",
    "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    "0x1776e1f26f98b1a5df9cd347953a26dd3cb46671",
    "0xec67005c4e498ec7f55e092bd1d35cbc47c91892",
    "0x04fa0d235c4abf4bcf4787af4cf447de572ef828",
    "0x7f4e04aa61b9a46403c1634e91bf31df3bc554cf",
    "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
  ],
  INDEX_MAP: {
    BTC: 0,
    ETH: 1,
    AAA: 2,
    BAT: 3,
    AVAX: 4,
    SYS: 5,
    ADA: 6,
    NMR: 7,
    BNB: 8,
    MLN: 9,
    SOL: 10,
    UMA: 11,
    WSBT: 12,
    DOGE: 13,
    SHIB: 14
  },

  SHORT_FORM: ["BTC", "ETH", "AAA", "BAT", "AVAX", "SYS", "ADA", "NMR", "BNB", "MLN", "SOL", "UMA", "WSBT", "DOGE", "SHIB"],
  LONG_FORM: ["Bitcoin", "Ethereum", "Moon Rabbit", "Basic Attention Token", "Avalanche", "Syscoin", "Cardano", "Numeraire", "BNB", "Enzyme", "Solana", "UMA", "wsb.sh", "Dogecoin", "Shiba Inu"],

  PRICE_MAP: {
    bitcoin: 0,
    ethereum: 1,
    "0x8c6bf16c273636523c29db7db04396143770f6a0": 2,
    "0x0d8775f648430679a709e98d2b0cb6250d2887ef": 3,
    "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z": 4,
    syscoin: 5,
    cardano: 6,
    "0x1776e1f26f98b1a5df9cd347953a26dd3cb46671": 7,
    binancecoin: 8,
    "0xec67005c4e498ec7f55e092bd1d35cbc47c91892": 9,
    solana: 10,
    "0x04fa0d235c4abf4bcf4787af4cf447de572ef828": 11,
    "0x7f4e04aa61b9a46403c1634e91bf31df3bc554cf": 12,
    dogecoin: 12,
    "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": 13
  },
  ABI: [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_prices",
          "type": "uint256[14]"
        }
      ],
      "name": "createBundle",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "createRebaseSession",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "drain",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "rebasePoolId_",
          "type": "uint256"
        }
      ],
      "name": "guessWinnerFromMegaPool",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "rebasePoolId_",
          "type": "uint256"
        }
      ],
      "name": "participateForMegaPool",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        },
        {
          "name": "_prices",
          "type": "uint256"
        },
        {
          "name": "_percent",
          "type": "uint256"
        },
        {
          "name": "_bundleId",
          "type": "uint256"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "PlaceBet",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_username",
          "type": "string"
        }
      ],
      "name": "Register",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "setRebaseStatus",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        },
        {
          "name": "_bundleId",
          "type": "uint256"
        },
        {
          "name": "_reward",
          "type": "uint256"
        },
        {
          "name": "_isPositive",
          "type": "bool"
        }
      ],
      "name": "updatebal",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "new_owner",
          "type": "address"
        }
      ],
      "name": "updateowner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "updatetime",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_bundle_address",
          "type": "address"
        },
        {
          "name": "_mega_pool",
          "type": "address"
        },
        {
          "name": "_rebase_caller",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "bundle_address",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "bundleId",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_bundleId",
          "type": "uint256"
        }
      ],
      "name": "fetchBundle",
      "outputs": [
        {
          "name": "_prices",
          "type": "uint256[14]"
        },
        {
          "name": "_start",
          "type": "uint256"
        },
        {
          "name": "_end",
          "type": "uint256"
        },
        {
          "name": "_staking_ends",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "fetchUser",
      "outputs": [
        {
          "name": "_bundles",
          "type": "uint256[]"
        },
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "claimable",
          "type": "uint256"
        },
        {
          "name": "staked_balance",
          "type": "uint256"
        },
        {
          "name": "active",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        },
        {
          "name": "_bundleId",
          "type": "uint256"
        }
      ],
      "name": "fetchUserBets",
      "outputs": [
        {
          "name": "_bundles",
          "type": "uint256[14]"
        },
        {
          "name": "_prices",
          "type": "uint256[14]"
        },
        {
          "name": "_amounts",
          "type": "uint256[14]"
        },
        {
          "name": "balance",
          "type": "uint256"
        },
        {
          "name": "totalbet",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastcreated",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastRebaseSessionCreated",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastTotalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "megaPool",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        },
        {
          "name": "_bundleId",
          "type": "uint256"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "PlaceBetValid",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "rebaseCaller",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_poolId",
          "type": "uint256"
        },
        {
          "name": "_performance_reward",
          "type": "uint256"
        },
        {
          "name": "_performance_flag",
          "type": "bool"
        }
      ],
      "name": "rebaseReward",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "rebaseSessionId",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rebaseTracer",
      "outputs": [
        {
          "name": "NumberOfOccurances",
          "type": "uint256"
        },
        {
          "name": "numberOfNegativeDates",
          "type": "uint256"
        },
        {
          "name": "createdTime",
          "type": "uint256"
        },
        {
          "name": "endingTime",
          "type": "uint256"
        },
        {
          "name": "user_counter",
          "type": "uint256"
        },
        {
          "name": "winner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "registrationStatus",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        },
        {
          "name": "_bundleId",
          "type": "uint256"
        },
        {
          "name": "_reward",
          "type": "uint256"
        }
      ],
      "name": "updatebalValid",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  CONTRACT_ADDRESS: "0xBC045F57390487ED0dee6D36d181598D2FD981be",
  //RPCURL: "https://kovan.infura.io/v3/e1b75bbfcc444739b9d433c5fd51a5da",
  RPCURL: "https://evm.moonrabbit.com",
  OWNERAddress: "0xBB8cF282aB0529c56a8b76b7AbA6E8f5d7826733"
}
