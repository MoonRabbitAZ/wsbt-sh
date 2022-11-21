const { ethers } = require('ethers');

function getProvider() {
  return new ethers.providers.JsonRpcProvider(process.env.NETWORK_RPC);
}

function getSigner() {
  return new ethers.Wallet(process.env.PRIVATE_KEY, getProvider());
}

function getBundleInstance() {
  return new ethers.Contract(process.env.BUNDLE_CONTRACT_ADDRESS, require('./abi/bundle.json'), getSigner());
}

module.exports = {
  getBundleInstance,
  getSigner
};
