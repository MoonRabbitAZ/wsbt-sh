'use strict'

const ethers = require("ethers");
const web3 = require("web3");
const config = require("../config");
// const provider = new ethers.providers.EtherscanProvider(
//   config.NETWORK,
//   "YI71Z1CHFQAZEVS8GK9HW7D3HHHX3DZR7A"
// );

const provider = new web3(config.RPCURL)

module.exports = async () => {
  // const contract = new ethers.Contract(
  //   config.CONTRACT_ADDRESS,
  //   config.ABI,
  //   provider
  // );
  

  const contract = new provider.eth.Contract(config.ABI, config.CONTRACT_ADDRESS)
  //console.log({contract})
  try {
  // await contract.methods.poolId().call((err, data) => {
  //   console.log({ data})
  // });
  var bundleId = await contract.methods.bundleId().call();
  //bundleId = ethers.utils.formatEther(bundleId) * 10 ** 18;
  return bundleId;
  } catch (error) {
    console.log({ error })
  }

};
