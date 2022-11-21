const ethers = require('ethers');

const getAddress = (address) => {
  const res = { isAddress: false, address };

  try {
    res.address = ethers.utils.getAddress(address);
    res.isAddress = true;
  } catch {
    res.address = '';
    res.isAddress = false;
  }

  return res;
};

module.exports = {
  getAddress
};
