const { getCryptoPrices } = require('../../coingecko/coingecko');
const { User, NFTUser, Bundle } = require('../../../db/models/models');

async function overall(req, res) {
  const { bundleId } = req.params;

  const users = await User.find({ bundleId }).sort({ createdAt: -1 });
  const bundle = await Bundle.findOne({ bundleId });

  if (users.length && bundle) {
    let currentPrice = bundle.endPrice;
    if (!currentPrice.length) {
      currentPrice = (await getCryptoPrices()).prices;
    }

    let performance = [];
    let totalBal = 0;
    for (let i = 0; i < users.length; i++) {
      const bundlePrice = users[i].prices;
      let value = 0;
      const userWeight = users[i].predicted;
      for (let j = 0; j < 10; j++) {
        if (parseFloat(bundlePrice[j]) > 0) {
          const variation =
            ((parseFloat(currentPrice[j]) - parseFloat(bundlePrice[j])) / parseFloat(bundlePrice[j])) * 100;
          value += (variation * parseFloat(userWeight[j])) / 100;
        }
      }

      const nftUser = await NFTUser.findOne({ walletAddress: users[i].address });
      totalBal += parseFloat(users[i].balance);
      performance.push({
        address: users[i].address,
        staked: users[i].balance,
        score: parseFloat(value).toFixed(8),
        user_name: nftUser?.username,
        totalBal
      });
    }

    performance = performance
      .sort((a, b) => b.score - a.score)
      .map((e, i) => {
        e.rank = i + 1;
        return e;
      });

    return res.send({
      responseCode: 200,
      responseMessage: 'success',
      data: performance
    });
  }
  return res.send({ responseCode: 400, responseMessage: 'success', data: [] });
}

module.exports = overall;
