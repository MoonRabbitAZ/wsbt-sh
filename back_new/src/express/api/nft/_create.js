/* eslint-disable consistent-return */
const { getAddress } = require('../../../helpers/ethersHelper');
const { NFTUser } = require('../../../../db/models/models');

async function create(req, res) {
  const { walletAddress, username } = req.body;

  if (!walletAddress || !username || username.length === 0) {
    return res.send({ error: true, message: 'Invalid request params', status: 400 });
  }

  if (!getAddress(walletAddress).isAddress)
    return res.send({
      error: true,
      message: 'Invalid walletAddress format',
      status: 400
    });

  const nftUser = await NFTUser.findOne({ walletAddress });
  if (nftUser) {
    await NFTUser.updateOne({ walletAddress }, { $set: { walletAddress, username } })
      .then(async (resObj) => {
        if (resObj)
          return await res.send({
            success: true,
            data: resObj,
            message: 'User updated successfully.'
          });
      })
      .catch((er) => res.send({ success: false, data: er, message: 'err' }));
  } else {
    await NFTUser.create({ walletAddress, username })
      .then(async (resObj) => {
        if (resObj)
          return await res.send({
            success: true,
            data: resObj,
            message: 'User registered successfully.'
          });
      })
      .catch((er) => res.send({ success: false, data: er, message: 'err' }));
  }
}

module.exports = create;
