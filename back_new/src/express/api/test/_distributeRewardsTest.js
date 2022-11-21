const { distributeRewards } = require('../../../cron/helpers/distributeRewars');

async function distributeRewardsTest(req, res) {
  try {
    await distributeRewards(req.params.bundleId);

    return res.send({ responseCode: 200, responseMessage: 'Success', data: true });
  } catch (err) {
    console.log(err.message);
    return res.send({ responseCode: 200, responseMessage: 'Success', data: [] });
  }
}

module.exports = distributeRewardsTest;
