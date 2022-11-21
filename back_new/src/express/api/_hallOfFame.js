const { User, NFTUser } = require('../../../db/models/models');

async function hallOfFame(req, res) {
  const users = await User.find({ rank: '1' }, { address: 1, bundleId: 1, _id: 0 });

  const updatedUsers = [];
  if (users.length > 0) {
    for (const index in users) {
      const nftUser = await NFTUser.findOne({ walletAddress: users[index].address }, { username: 1, _id: 0 });

      updatedUsers.push({
        address: users[index].address,
        bundleId: users[index].bundleId,
        username: nftUser.username
      });
    }
  }

  return res.send({
    responseCode: 200,
    responseMessage: 'success',
    data: updatedUsers
  });
}

module.exports = hallOfFame;
