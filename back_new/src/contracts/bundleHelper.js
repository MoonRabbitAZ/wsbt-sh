/* eslint-disable no-underscore-dangle */
const { getBundleInstance, getSigner } = require('./_providerHelper');
const { toBn } = require('../helpers/bnHelper');

async function getLastBundleId() {
  const instance = getBundleInstance();

  try {
    return (await instance.bundleId()).toNumber() - 1;
  } catch (e) {
    console.log('Error on getLastBundleId() call.');
    console.log(e);
  }

  return 0;
}

async function getBundle(id) {
  const instance = getBundleInstance();
  let res = {
    prices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    start: 0,
    end: 0,
    stakingEnds: 0
  };

  try {
    const resp = await instance.fetchBundle(id);
    res = {
      prices: resp._prices,
      start: resp._start.toString(),
      end: resp._end.toString(),
      stakingEnds: resp._staking_ends.toString()
    };
  } catch (e) {
    console.log('Error on getBundle() call.');
    console.log(e);
  }

  return res;
}

async function createBundle(prices) {
  const instance = getBundleInstance();
  const signer = getSigner();

  await instance.connect(signer).createBundle(prices);
}

async function setRebaseStatus() {
  const instance = getBundleInstance();
  const signer = getSigner();

  const gasLimit = toBn((await instance.connect(signer).estimateGas.setRebaseStatus()).toString())
    .multipliedBy('1.5')
    .toFixed(0);

  await instance.connect(signer).setRebaseStatus({ gasLimit });
}

async function updatebal(userAddress, bundleId, reward, isPositive) {
  const instance = getBundleInstance();
  const signer = getSigner();

  await instance.connect(signer).updatebal(userAddress, bundleId, reward, isPositive);
}

module.exports = {
  getLastBundleId,
  getBundle,
  createBundle,
  setRebaseStatus,
  updatebal
};
