const { getAddress } = require('../../helpers/ethersHelper');
const { toBn, fromWei } = require('../../helpers/bnHelper');
const { User } = require('../../../db/models/models');

async function predictionNew(req, res, next) {
  try {
    const { value, index, address, balance, bundleId, price } = req.body;

    if (!address || !balance || !price) return next(new Error('Invalid request'));
    if (!getAddress(address).isAddress) return next(new Error('Invalid address format'));

    // const contractBundle = await getBundle(bundleId);
    // if (new Date(contractBundle.stakingEnds * 1000) <= new Date()) next(new Error("Stake period is over"))
    // if (new Date(contractBundle.end * 1000) <= new Date()) next(new Error("Prediction is over"))

    const user = await User.findOne({
      bundleId,
      address
    });

    if (user) {
      user.balance = toBn(user.balance).plus(balance).toString();
      user.predicted[index] = value;
      user.prices[index] = price;
      user.assetsStaked[index] = balance;
      user.markModified('predicted');
      user.markModified('prices');
      user.markModified('assetsStaked');
      await user.save();

      // console.log("User updated", user);

      return res.send({
        success: true,
        message: `Successfully staked ${fromWei(balance).toFixed(2)} token`
      });
    }
    const userPredictions = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    const userPrices = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    const assetsStaked = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

    userPredictions[index] = value;
    userPrices[index] = price;
    assetsStaked[index] = balance;

    const newUser = new User();
    newUser.address = address;
    newUser.predicted = userPredictions;
    newUser.bundleId = bundleId;
    newUser.prices = userPrices;
    newUser.assetsStaked = assetsStaked;
    newUser.balance = balance;
    await newUser.save();

    // console.log("User created:", newUser);

    return res.send({
      success: true,
      message: `Successfully staked ${fromWei(balance).toFixed(2)} token`
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: true, message: 'Cannot update. Please try again.' });
  }
}

module.exports = predictionNew;
