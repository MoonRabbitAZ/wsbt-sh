/* eslint-disable array-callback-return */
const { User } = require('../../../db/models/models');
const { getCoin } = require('../../coingecko/_config');
const { toBn } = require('../../helpers/bnHelper');

async function completed(req, res) {
  if (!req.params.address || !req.params.bundleId) {
    return res.send({ error: true, message: 'Address and BundleId required' });
  }

  const predictions = await User.find(
    { address: req.params.address, bundleId: { $ne: req.params.bundleId } },
    { _id: 0, updatedAt: 0, balUpdateHash: 0, __v: 0 }
  ).lean();

  let totalBalance = 0;
  const poolData = [];
  predictions.forEach((prediction) => {
    totalBalance = toBn(prediction.balance).plus(totalBalance).toString();

    prediction.assetsStaked.map((value, i) => {
      if (value === '0') return;

      const coin = getCoin(i);
      poolData.push({
        key: i,
        tokenTitle: coin.longName,
        strikePrice: prediction.prices[i],
        strikeAmount: value,
        short: coin.shortName,
        balance: prediction.balance,
        bundleId: prediction.bundleId
      });
    });
  });

  const data = {
    totalBalance,
    poolData: poolData.reverse()
  };

  return res.send({ responseCode: 200, responseMessage: 'success', data });
}

module.exports = completed;
