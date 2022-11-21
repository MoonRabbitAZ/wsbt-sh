const { NFTUser } = require('../../../../db/models/models');

async function getOne(req, res) {
  const { walletAddress } = req.params;

  const nftUser = await NFTUser.findOne({ walletAddress });

  if (nftUser && nftUser !== undefined && nftUser !== null) {
    return res.send({ status: 200, success: true, data: nftUser });
  }
  return res.send({ status: 200, success: true, data: { walletAddress: '', username: '' } });
}

module.exports = getOne;
