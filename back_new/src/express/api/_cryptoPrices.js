const { getCryptoPricesWithChanges } = require('../../coingecko/coingecko');

async function cryptoPrices(req, res, next) {
  try {
    return res.send({ responseCode: 200, responseMessage: 'Success', data: await getCryptoPricesWithChanges() });
  } catch (err) {
    console.log(err.message);
    return next(new Error('Cannot fetch price at the moment'));
  }
}

module.exports = cryptoPrices;
