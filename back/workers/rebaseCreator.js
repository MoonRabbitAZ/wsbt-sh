const CronJob = require("cron").CronJob;
const ethers = require("ethers");
require("dotenv").config();
const config = require("../config");
const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);
const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);

// const provider = new ethers.providers.EtherscanProvider(
//     config.NETWORK,
//     "YI71Z1CHFQAZEVS8GK9HW7D3HHHX3DZR7A"
// );

const provider = new Web3(config.RPCURL)

//*/2 * * * *
//0 */5 * * *
var createRebase = new CronJob("0 0 1 * *", async function () {
  try {
        // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        // console.log({ wallet })
        // // //get bundle id from contract
        // const contract = new ethers.Contract(
        //     config.CONTRACT_ADDRESS,
        //     config.ABI,
        //     wallet
        // );

        let gasPrice = await getGasPrice()
        
        let tx = {
          //     // this could be provider.addresses[0] if it exists
          from: config.OWNERAddress,
          //     // target address, this could be a smart contract address
          to: config.CONTRACT_ADDRESS,
          gas: 10000000,
          data: myContract.methods.createRebaseSession().encodeABI()  
        };
  
        const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
        signPromise.then(async (signedTx) => {
  
          const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
  
          sentTx.on("receipt", async receipt => {
            console.log("Rebase Created");
          });
        }).catch((error) => {
          console.log({ RebaseError: error })
        });

    } catch (err) {
        console.log("Rebase creation error", err.message);
    }
})

async function getGasPrice() {
  return await web3.eth.getGasPrice()
}

createRebase.start();
//createRebase()
