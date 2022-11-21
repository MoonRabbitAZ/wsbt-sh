const CoinGecko = require("coingecko-api");
const ethers = require("ethers");
const config = require("../config");
const CoinGeckoClient = new CoinGecko();
const axios = require('axios');

module.exports = async () => {
  try {
    let prices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let hexPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let [coinsPrice, tokensPrice] = await Promise.all([
      CoinGeckoClient.simple.price({
        ids: config.COINS,
        vs_currencies: ["usd"],
        include_24hr_change: true
      }),
      CoinGeckoClient.simple.fetchTokenPrice({
        contract_addresses: config.TOKENS,
        vs_currencies: "usd",
        include_24hr_change: true
      }),
    ]);

    //console.log({coinsPrice, tokensPrice})
    const { data } = await axios({
      method: "GET",
      url: 'https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z&vs_currencies=usd&include_24hr_change=true',
    });

    if (Object.keys(data).length > 0) {
      tokensPrice.data = { ...tokensPrice.data, 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z': { usd: data['FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z']['usd'], usd_24h_change: data['FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z']['usd_24h_change'] } }
    }

    //console.log({length:tokensPrice.data})
    let finalData = []
    for (var key in coinsPrice.data) {
      let usdPrice = parseFloat(coinsPrice.data[key].usd).toFixed(2);
      let last24hChange = parseFloat(coinsPrice.data[key].usd_24h_change).toFixed(2);

      finalData.push({
        long: config.LONG_FORM[config.PRICE_MAP[key]],
        short: config.SHORT_FORM[config.PRICE_MAP[key]],
        price: usdPrice,
        last24hChange,
        isUp: last24hChange > 0 ? true : false,
        index: config.INDEX_MAP[config.SHORT_FORM[config.PRICE_MAP[key]]]
      })

      prices[config.PRICE_MAP[key]] = usdPrice;
      hexPrices[config.PRICE_MAP[key]] = ethers.utils.parseEther(usdPrice);
    }
    console.log({tokensPrice: tokensPrice.data})
    for (var key in tokensPrice.data) {
      let usdPrice = parseFloat(tokensPrice.data[key].usd).toFixed(2);
      let last24hChange = parseFloat(tokensPrice.data[key].usd_24h_change).toFixed(2);

      finalData.push({
        long: config.LONG_FORM[config.PRICE_MAP[key]],
        short: config.SHORT_FORM[config.PRICE_MAP[key]],
        price: usdPrice,
        last24hChange,
        isUp: last24hChange > 0 ? true : false,
        index: config.INDEX_MAP[config.SHORT_FORM[config.PRICE_MAP[key]]]
      })

      prices[config.PRICE_MAP[key]] = usdPrice;
      hexPrices[config.PRICE_MAP[key]] = ethers.utils.parseEther(usdPrice);
    }

    finalData.sort((a, b) => b.price - a.price)

    return { error: false, bundles: finalData, hexPrices};
  } catch (err) {
    console.log({ err })
    return { error: true };
  }
};
