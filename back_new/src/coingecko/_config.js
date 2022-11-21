const coins = {
  bitcoin: {
    index: 0,
    shortName: 'BTC',
    longName: 'Bitcoin'
  },
  ethereum: {
    index: 1,
    shortName: 'ETH',
    longName: 'Ethereum'
  },
  '0x8c6bf16c273636523c29db7db04396143770f6a0': {
    index: 2,
    shortName: 'AAA',
    longName: 'Moon Rabbit'
  },
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef': {
    index: 3,
    shortName: 'BAT',
    longName: 'Basic Attention Token'
  },
  FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z: {
    index: 4,
    shortName: 'AVAX',
    longName: 'Avalanche'
  },
  syscoin: {
    index: 5,
    shortName: 'SYS',
    longName: 'Syscoin'
  },
  cardano: {
    index: 6,
    shortName: 'ADA',
    longName: 'Cardano'
  },
  '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671': {
    index: 7,
    shortName: 'NMR',
    longName: 'Numeraire'
  },
  binancecoin: {
    index: 8,
    shortName: 'BNB',
    longName: 'Binance'
  },
  '0xec67005c4e498ec7f55e092bd1d35cbc47c91892': {
    index: 9,
    shortName: 'MLN',
    longName: 'Enzyme'
  },
  solana: {
    index: 10,
    shortName: 'SOL',
    longName: 'Solana'
  },
  '0x04fa0d235c4abf4bcf4787af4cf447de572ef828': {
    index: 11,
    shortName: 'UMA',
    longName: 'UMA'
  },
  dogecoin: {
    index: 12,
    shortName: 'DOGE',
    longName: 'Dogecoin'
  },
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': {
    index: 13,
    shortName: 'SHIB',
    longName: 'Shiba Inu'
  }
};

function getCoins() {
  const res = [];
  for (const name in coins) {
    if (name.length < 42) res.push(name);
  }

  return res;
}

function getCoin(index) {
  for (const name in coins) {
    if (coins[name].index === index) return coins[name];
  }

  return {
    index: null,
    shortName: '',
    longName: ''
  };
}

function getBaseTokens() {
  const res = [];
  for (const name in coins) {
    if (name.length === 42) res.push(name);
  }

  return res;
}

function getAvalancheTokens() {
  const res = [];
  for (const name in coins) {
    if (name.length === 49) res.push(name);
  }

  return res;
}

module.exports = {
  getCoins,
  getCoin,
  getBaseTokens,
  getAvalancheTokens,
  coins
};
