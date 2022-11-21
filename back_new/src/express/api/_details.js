const { User } = require('../../../db/models/models');
const { getCoin } = require('../../coingecko/_config');
const { toBn } = require('../../helpers/bnHelper');

async function details(req, res) {
  if (!req.params.address || !req.params.bundleId) {
    return res.send({ error: true, message: 'Address and BundleId required' });
  }

  const predictions = await User.find(
    { address: req.params.address, bundleId: req.params.bundleId },
    { _id: 0, updatedAt: 0, balUpdateHash: 0, __v: 0 }
  ).lean();

  const poolData = [];
  predictions.forEach((prediction) => {
    // eslint-disable-next-line array-callback-return
    prediction.assetsStaked.map((value, i) => {
      if (value === '0') return;

      const coin = getCoin(i);
      poolData.push({
        key: i,
        tokenTitle: coin.longName,
        strikePrice: prediction.prices[i],
        strikeAmount: value,
        short: coin.shortName,
        balance: prediction.balance
      });
    });
    // userDt.poolData = poolData
  });

  poolData.sort((a, b) => {
    if (toBn(a.strikeAmount).isLessThan(b.strikeAmount)){
      return 1;
    }
    if (toBn(a.strikeAmount).isGreaterThan(b.strikeAmount)){
      return -1;
    }
    return 0;
  })

  return res.send({ responseCode: 200, responseMessage: 'success', data: poolData });
}

module.exports = details;
