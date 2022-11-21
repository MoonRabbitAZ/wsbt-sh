// const ethers = require("ethers");
const config = require("../RSKconfig");
const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);

const myContract =new web3.eth.Contract(config.ABI,config.CONTRACT_ADDRESS);


module.exports = async () => {
    try {
        let bundleId = await myContract.methods.bundleId().call({from: config.OWNERAddress});
        return bundleId;
    } catch (err) {
        console.log('-------------------err------------', err);
        return err;

    }
};
