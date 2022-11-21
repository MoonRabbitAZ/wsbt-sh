module.exports = {
  //--------- TODO


  //----testnet
  RPCURL: 'https://public-node.testnet.rsk.co',

  //----mainnet
  // RPCURL: 'https://public-node.rsk.co',

  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  YFI: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  CORE: "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7",
  UNI: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  COINS: ["bitcoin", "polkadot", "binancecoin", "ethereum", "ripple"],
  TOKENS: [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7",
  ],
  INDEX_MAP: {
    BTC: 0,
    ETH: 1,
    DOT: 2,
    LINK: 3,
    XRP: 4,
    YFI: 5,
    CORE: 6,
    BNB: 7,
    UNI: 8,
    USDT: 9,
  },

  PRICE_MAP: {
    bitcoin: 0,
    ethereum: 1,
    polkadot: 2,
    "0x514910771af9ca656af840dff83e8264ecf986ca": 3,
    ripple: 4,
    "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e": 5,
    "0x62359ed7505efc61ff1d56fef82158ccaffa23d7": 6,
    binancecoin: 7,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": 8,
    "0xdac17f958d2ee523a2206206994597c13d831ec7": 9,
  },

  //--------- TODO
  ABI: [{ "constant": false, "inputs": [{ "name": "_prices", "type": "uint256[10]" }], "name": "createBundle", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "index", "type": "uint256" }, { "name": "_prices", "type": "uint256" }, { "name": "_percent", "type": "uint256" }, { "name": "_bundleId", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "PlaceBet", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_bundleId", "type": "uint256" }], "name": "fetchUserInBundle", "outputs": [{ "name": "_betters", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_username", "type": "string" }], "name": "Register", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_user", "type": "address" }, { "name": "_bundleId", "type": "uint256" }], "name": "fetchUserBets", "outputs": [{ "name": "_bundles", "type": "uint256[10]" }, { "name": "_prices", "type": "uint256[10]" }, { "name": "_amounts", "type": "uint256[10]" }, { "name": "balance", "type": "uint256" }, { "name": "totalbet", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fee_collected", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "new_owner", "type": "address" }], "name": "updateowner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_user", "type": "address" }, { "name": "_bundleId", "type": "uint256" }, { "name": "_reward", "type": "uint256" }, { "name": "_isPositive", "type": "bool" }], "name": "updatebal", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "bundleId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_user", "type": "address" }], "name": "fetchUser", "outputs": [{ "name": "_bundles", "type": "uint256[]" }, { "name": "username", "type": "string" }, { "name": "claimable", "type": "uint256" }, { "name": "staked_balance", "type": "uint256" }, { "name": "active", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "collectdeveloperfee", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "lastcreated", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_timestamp", "type": "uint256" }], "name": "updatetime", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_bundleId", "type": "uint256" }], "name": "fetchBundle", "outputs": [{ "name": "_prices", "type": "uint256[10]" }, { "name": "_start", "type": "uint256" }, { "name": "_end", "type": "uint256" }, { "name": "_staking_ends", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "bundle_address", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_bundle_address", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }],
  CONTRACT_ADDRESS: "0x804A3C5bF2aD5cbe9Bb6B5F43e8EB2ccc820eBE6",

  // ABI: [{ "inputs": [{ "internalType": "address", "name": "_bundle_address", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }, { "internalType": "uint256", "name": "_prices", "type": "uint256" }, { "internalType": "uint256", "name": "_percent", "type": "uint256" }, { "internalType": "uint256", "name": "_bundleId", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "PlaceBet", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }], "name": "Register", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "bundleId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "bundle_address", "outputs": [{ "internalType": "contract TokenMintERC20Token", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "collectdeveloperfee", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256[10]", "name": "_prices", "type": "uint256[10]" }], "name": "createBundle", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "fee_collected", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "_bundleId", "type": "uint256" }], "name": "fetchBundle", "outputs": [{ "internalType": "uint256[10]", "name": "_prices", "type": "uint256[10]" }, { "internalType": "uint256", "name": "_start", "type": "uint256" }, { "internalType": "uint256", "name": "_end", "type": "uint256" }, { "internalType": "uint256", "name": "_staking_ends", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "fetchUser", "outputs": [{ "internalType": "uint256[]", "name": "_bundles", "type": "uint256[]" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "uint256", "name": "claimable", "type": "uint256" }, { "internalType": "uint256", "name": "staked_balance", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "uint256", "name": "_bundleId", "type": "uint256" }], "name": "fetchUserBets", "outputs": [{ "internalType": "uint256[10]", "name": "_bundles", "type": "uint256[10]" }, { "internalType": "uint256[10]", "name": "_prices", "type": "uint256[10]" }, { "internalType": "uint256[10]", "name": "_amounts", "type": "uint256[10]" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "totalbet", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "_bundleId", "type": "uint256" }], "name": "fetchUserInBundle", "outputs": [{ "internalType": "address[]", "name": "_betters", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "lastcreated", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "uint256", "name": "_bundleId", "type": "uint256" }, { "internalType": "uint256", "name": "_reward", "type": "uint256" }, { "internalType": "bool", "name": "_isPositive", "type": "bool" }], "name": "updatebal", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "new_owner", "type": "address" }], "name": "updateowner", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "_timestamp", "type": "uint256" }], "name": "updatetime", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }],
  // CONTRACT_ADDRESS: '0xdEF5964bCeACe149B4B3BA51C75D41fC20858b73',

  // OWNERAddress: '0x99155282b02345a411dCFC184cF5AEfea057c0Db'
  OWNERAddress:'0x0D434d59D792e973a881Cf6Db87dA6fD6819d801'

}
