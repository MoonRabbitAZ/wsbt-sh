const ethers = require("ethers");
const web3 = require("web3");
const config = require("../config");
const Bundle = require("../models/bundle");
// const provider = new ethers.providers.EtherscanProvider(
//   config.NETWORK,
//   "YI71Z1CHFQAZEVS8GK9HW7D3HHHX3DZR7A"
// );

const provider = new web3(config.RPCURL)

module.exports = async (id) => {
  // const contract = new ethers.Contract(
  //   config.CONTRACT_ADDRESS,
  //   config.ABI,
  //   provider
  // );

  // const contract = new provider.eth.Contract(config.ABI, config.CONTRACT_ADDRESS)

  // try {
  //   let bundle = await contract.methods.fetchBundle(id).call();
  //   let staking_ends = ethers.utils.formatEther(bundle._staking_ends) * 10 ** 18;
  //   return new Date(staking_ends * 1000);
  // } catch (error) {
  //   console.log({ error })
  // }

  let bundleDetails = await Bundle.findOne({ bundleId: id })

  if (bundleDetails) {
    var ISOdatetime = new Date(bundleDetails.createdAt)
    ISOdatetime.setMinutes(ISOdatetime.getMinutes() + 15); // timestamp
    ISOdatetime = new Date(ISOdatetime); // Date object
    return ISOdatetime
  } else {
    return new Date().toISOString()
  }
};
