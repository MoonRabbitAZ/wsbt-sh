// const ethers = require("ethers");
const config = require("../RSKconfig");
const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);

const myContract =new web3.eth.Contract(config.ABI,config.CONTRACT_ADDRESS);


module.exports = async (id) => {
    
    let bundle = await myContract.methods.fetchBundle(id).call({from: config.OWNERAddress});
    let staking_ends = await bundle._staking_ends;

    return new Date(staking_ends * 1000);

};
