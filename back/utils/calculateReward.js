const rewards = {
  0: 3.6,
  1: 2.7,
  2: 1.8,
  3: 0.9,
  4: 0,
  5: 0,
  6: -1,
  7: -2,
  8: -3,
  9: -4,
};
module.exports = async (performance) => {
  let perf = JSON.parse(JSON.stringify(performance));
  let totalStaked = 0;

  totalStaked = performance
    .map((item) => item.staked)
    .reduce((prev, next) => parseFloat(prev) + parseFloat(next));
  let poolLimit = totalStaked / 10;
  let rewardPool = [[], [], [], [], [], [], [], [], [], []];
  let finalReward = {};
  var j = 0;
  for (var i = 1; i <= 9; ++i) {
    let currLimit = poolLimit;

    while (currLimit != 0) {
      if (performance[j]) {
        if (currLimit >= performance[j].staked) {
          rewardPool[i - 1].push({
            address: performance[j].address,
            reward: rewards[i - 1],
            bund: performance[j].staked,
          });

          currLimit -= performance[j].staked;
          performance[j++].staked = 0;
        } else {
          performance[j].staked = performance[j].staked - currLimit;
          rewardPool[i - 1].push({
            address: performance[j].address,
            reward: rewards[i - 1],
            bund: currLimit,
          });

          currLimit = 0;
        }
      } else break;
    }
  }
  while (j < performance.length) {
    rewardPool[9].push({
      address: performance[j].address,
      reward: rewards[9],
      bund: performance[j].staked,
    });
    j++;
  }

  for (let i = 0; i < rewardPool.length; i++) {
    for (let j = 0; j < rewardPool[i].length; j++) {
      if (finalReward.hasOwnProperty(rewardPool[i][j].address)) {
        finalReward[rewardPool[i][j].address] +=
          rewardPool[i][j].bund * (rewardPool[i][j].reward / 100);
      } else {
        finalReward[rewardPool[i][j].address] =
          rewardPool[i][j].bund * (rewardPool[i][j].reward / 100);
      }
    }
  }
  for (var address in finalReward) {
    let found = perf.filter((element) => {
      return element.address == address;
    });
    if (found.length) {
      finalReward[address] = (finalReward[address] / found[0].staked) * 100;


    }
  }
  return finalReward;
};
