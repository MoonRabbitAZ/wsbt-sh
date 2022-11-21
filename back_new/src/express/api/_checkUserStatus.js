const { User } = require('../../../db/models/models');

async function checkUserStatus(req, res) {
  const { walletAddress } = req.params;

  const userStatus = await User.find({ address: walletAddress, rank: { $gt: 0, $lte: 5 } })
    .sort({ bundleId: '-1' })
    .limit(30);

  if (userStatus && userStatus.length > 0) {
    return res.send({ responseCode: 200, responseMessage: 'Success', data: true });
  }
  return res.send({ responseCode: 200, responseMessage: 'Success', data: false });
}

module.exports = checkUserStatus;
