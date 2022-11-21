/* eslint-disable no-restricted-syntax */
const { User, Bundle } = require('../../../db/models/models');
const { updatebal } = require('../../contracts/bundleHelper');
const { getCryptoPrices } = require('../../coingecko/coingecko');
const { toBn } = require('../../helpers/bnHelper');

const rewards = {
  0: 3.6, // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10
  1: 2.7, // 5, 6, 7, 8, 9, 10
  2: 1.8, // 4, 7, 8, 9, 10
  3: 0.9, // 3, 5, 6, 8, 9, 10
  4: 0.1, // 2, 4, 6, 7, 8, 9, 10
  5: 0, // 5, 7, 9, 10
  6: -1, // 3, 6, 8, 9, 10
  7: -2, // 4, 5, 7, 8, 9, 10
  8: -3, // 6, 7, 8, 9, 10, 10
  9: -4
};

const getFinalRewards = (performance) => {
  const perf = JSON.parse(JSON.stringify(performance));
  let totalStaked = 0;

  totalStaked = perf.map((item) => item.staked).reduce((prev, next) => toBn(prev).plus(next).toString());

  const poolLimit = totalStaked / 10;
  const rewardPool = [[], [], [], [], [], [], [], [], [], []];
  const finalReward = {};
  let j = 0;
  for (let i = 1; i <= 9; ++i) {
    let currLimit = poolLimit;

    // eslint-disable-next-line eqeqeq
    while (currLimit != 0) {
      if (perf[j]) {
        if (currLimit >= perf[j].staked) {
          rewardPool[i - 1].push({
            address: perf[j].address,
            reward: rewards[i - 1],
            bund: Number(perf[j].staked)
          });

          currLimit -= perf[j].staked;
          perf[j++].staked = 0;
        } else {
          perf[j].staked = toBn(perf[j].staked).minus(currLimit).toNumber();
          rewardPool[i - 1].push({
            address: perf[j].address,
            reward: rewards[i - 1],
            bund: currLimit
          });

          currLimit = 0;
        }
      } else break;
    }
  }

  while (j < perf.length) {
    rewardPool[9].push({
      address: perf[j].address,
      reward: rewards[9],
      bund: Number(perf[j].staked)
    });
    j++;
  }

  for (let i = 0; i < rewardPool.length; i++) {
    // eslint-disable-next-line no-shadow
    for (let j = 0; j < rewardPool[i].length; j++) {
      // eslint-disable-next-line no-prototype-builtins
      if (finalReward.hasOwnProperty(rewardPool[i][j].address)) {
        finalReward[rewardPool[i][j].address] = toBn(finalReward[rewardPool[i][j].address])
          .plus(toBn(rewardPool[i][j].bund).multipliedBy(rewardPool[i][j].reward).dividedBy(1e2))
          .toString();
      } else {
        finalReward[rewardPool[i][j].address] = toBn(rewardPool[i][j].bund)
          .multipliedBy(rewardPool[i][j].reward)
          .dividedBy(1e2)
          .toString();
      }
    }
  }

  // eslint-disable-next-line guard-for-in
  for (const address in finalReward) {
    // eslint-disable-next-line eqeqeq
    const found = performance.filter((element) => element.address == address);

    if (found.length) {
      finalReward[address] = toBn(finalReward[address]).dividedBy(found[0].staked).multipliedBy(100).toString();
    }
  }

  return finalReward;
};

const updateUserRewards = async (bundleId, performance, finalRewards) => {
  for (let i = 0; i < performance.length; i++) {
    const user = await User.findOne({
      address: performance[i].address,
      bundleId
    });

    if (user.isBalanceUpdated) {
      console.log(`User ${user.address} in bundle #${bundleId} already updated.`);
      continue;
    }

    user.reward = `${finalRewards[user.address]}%`;
    user.balanceUpdatedAt = new Date();
    user.rank = performance[i].rank;
    user.performance = performance[i].score;

    const isPositive = finalRewards[user.address] >= 0;
    const userReward = toBn(finalRewards[user.address]).abs().multipliedBy(1e4).toFixed(0);

    await updatebal(user.address, bundleId, userReward, isPositive);

    user.isBalanceUpdated = true;
    await user.save();
  }
};

const getRewards = async (users, bundle) => {
  let currentPrice = bundle.endPrice;
  if (currentPrice.length === 0) {
    currentPrice = await getCryptoPrices();
  }

  let performance = [];
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const bundlePrices = users[userIndex].prices;
    const userPredicted = users[userIndex].predicted;

    let score = 0;
    for (let coinKey = 0; coinKey < bundlePrices.length; coinKey++) {
      if (bundlePrices[coinKey] === '0') continue;

      const userPredictedPercent = toBn(userPredicted[coinKey]).dividedBy(1e18);
      // Price index change
      const variation = toBn(currentPrice[coinKey])
        .minus(bundlePrices[coinKey])
        .dividedBy(bundlePrices[coinKey])
        .multipliedBy(100);
      score = toBn(score).plus(variation.multipliedBy(userPredictedPercent).dividedBy(100));
    }

    performance.push({
      address: users[userIndex].address,
      staked: users[userIndex].balance,
      score: score.toNumber()
    });

    performance = performance
      .sort((a, b) => b.score - a.score)
      .map((el, i) => {
        // eslint-disable-next-line no-param-reassign
        el.rank = i + 1;
        return el;
      });

    let start = 0;
    let end = Math.floor(performance.length * 0.1);
    const initial = performance.length * 0.1;

    for (let k = 0; k < 10; k++) {
      const reward = rewards[k];
      for (let l = start; l <= end; l++) {
        if (performance[l]) performance[l].reward = reward;
      }
      start = end + 1;
      end = Math.floor(initial * (k + 2));
    }
  }

  return performance;
};

const distributeRewards = async (bundleId) => {
  try {
    const bundle = await Bundle.findOne({ bundleId });
    if (!bundle) {
      console.log(`RD: bundle #${bundleId} is not exist.`);
      return;
    }

    if (bundle.isRewardDistributed) {
      console.log(`RD: bundle #${bundleId}, rewards already distributed.`);
      return;
    }

    const users = await User.find({ bundleId }).sort({ createdAt: -1 });
    if (users.length === 0) {
      console.log(`RD: bundle #${bundleId}, no users found.`);
      return;
    }

    const performance = await getRewards(users, bundle);
    const finalRewards = getFinalRewards(performance);

    bundle.rewards = finalRewards;
    await bundle.save();

    await updateUserRewards(bundleId, performance, finalRewards);

    await Bundle.findOneAndUpdate({ bundleId }, { isRewardDistributed: true });

    console.log(`Rewards for bundle #${bundleId} distributed.`);
  } catch (e) {
    console.log('----------');
    console.log(`Error in distributeRewards() at ${new Date().getTime()}.`);
    console.log(e);
    console.log('----------');
  }
};

module.exports = {
  distributeRewards
};
