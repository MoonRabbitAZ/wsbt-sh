const CoinGecko = require("coingecko-api");
const ethers = require("ethers");
const config = require("../config");
const CoinGeckoClient = new CoinGecko();

module.exports = async () => {
  try {
    let prices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let hexPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let [coinsPrice, tokensPrice] = await Promise.all([
      CoinGeckoClient.simple.price({
        ids: config.COINS,
        vs_currencies: ["usd"],
      }),
      CoinGeckoClient.simple.fetchTokenPrice({
        contract_addresses: config.TOKENS,
        vs_currencies: "usd",
      }),
    ]);

    for (var key in coinsPrice.data) {
      let usdPrice = parseFloat(coinsPrice.data[key].usd).toFixed(4);

      prices[config.PRICE_MAP[key]] = usdPrice;

      hexPrices[config.PRICE_MAP[key]] = ethers.utils.parseEther(usdPrice);
    }
    for (var key in tokensPrice.data) {
      let usdPrice = parseFloat(tokensPrice.data[key].usd).toFixed(4);

      prices[config.PRICE_MAP[key]] = usdPrice;

      hexPrices[config.PRICE_MAP[key]] = ethers.utils.parseEther(usdPrice);
    }
    // console.log(hexPrices);
    return { error: false, prices, hexPrices };
  } catch (err) {
    return { error: true };
  }
};
