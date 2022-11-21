const CoinGecko = require('coingecko-api');
const axios = require('axios');

const { getCoins, getBaseTokens, getAvalancheTokens, coins } = require('./_config');
const { toWei } = require('../helpers/bnHelper');

async function addAvalancheData(tokensResponse, include24hrChange) {
  const addresses = getAvalancheTokens();

  for (const address of addresses) {
    const avalancheResponse = await axios.get('https://api.coingecko.com/api/v3/simple/token_price/avalanche', {
      params: {
        contract_addresses: address,
        vs_currencies: 'usd',
        include_24hr_change: include24hrChange
      }
    });

    if (avalancheResponse.status === 200) {
      tokensResponse.data = { ...tokensResponse.data, ...avalancheResponse.data };
    }
  }

  return tokensResponse;
}

async function getCryptoPrices() {
  const coinGecko = new CoinGecko();

  const coinsResponse = await coinGecko.simple.price({
    ids: getCoins(),
    vs_currencies: ['usd']
  });

  let tokensResponse = await coinGecko.simple.fetchTokenPrice({
    contract_addresses: getBaseTokens(),
    vs_currencies: ['usd']
  });

  tokensResponse = await addAvalancheData(tokensResponse, false);

  const coinsAndTokens = [];
  for (const coinName in coinsResponse.data) {
    coinsAndTokens[coins[coinName].index] = toWei(coinsResponse.data[coinName].usd).toFixed();
  }

  for (const tokenAddress in tokensResponse.data) {
    coinsAndTokens[coins[tokenAddress].index] = toWei(tokensResponse.data[tokenAddress].usd).toFixed();
  }

  return coinsAndTokens;
}

async function getCryptoPricesWithChanges() {
  const coinGecko = new CoinGecko();

  const coinsResponse = await coinGecko.simple.price({
    ids: getCoins(),
    vs_currencies: ['usd'],
    include_24hr_change: true
  });

  let tokensResponse = await coinGecko.simple.fetchTokenPrice({
    contract_addresses: getBaseTokens(),
    vs_currencies: ['usd'],
    include_24hr_change: true
  });

  tokensResponse = await addAvalancheData(tokensResponse, true);

  const coinsAndTokens = [];
  for (const coinName in coinsResponse.data) {
    coinsAndTokens[coins[coinName].index] = {
      ...coins[coinName],
      price: toWei(coinsResponse.data[coinName].usd).toFixed(),
      last24hChange: toWei(coinsResponse.data[coinName].usd_24h_change).toFixed()
    };
  }

  for (const tokenAddress in tokensResponse.data) {
    coinsAndTokens[coins[tokenAddress].index] = {
      ...coins[tokenAddress],
      price: toWei(tokensResponse.data[tokenAddress].usd).toFixed(),
      last24hChange: toWei(tokensResponse.data[tokenAddress].usd_24h_change).toFixed()
    };
  }

  coinsAndTokens.sort((a, b) => b.price - a.price);

  return coinsAndTokens;
}

module.exports = {
  getCryptoPrices,
  getCryptoPricesWithChanges
};
