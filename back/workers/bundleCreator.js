const CronJob = require("cron").CronJob;
const ethers = require("ethers");
const EthereumTx = require('ethereumjs-tx').Transaction
const axios = require("axios")

require("dotenv").config();
const config = require("../config");
const fetchPrice = require("../utils/fetchPrice");
const Bundle = require("../models/bundle");
const fetchBundleId = require("../utils/fetchBundleId");
const fetchPreviousEnd = require("../utils/fetchPreviousEnd");

const Web3 = require("web3");

/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
let web3 = new Web3(new Web3.providers.HttpProvider(config.RPCURL))
const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);


/**
 * Set the web3 default account to use as your public wallet address
 */
web3.eth.defaultAccount = config.OWNERAddress


//*/2 * * * *
//0 */5 * * *

var createBundle = new CronJob("*/1  * * * *", async function () {
  try {

    var bundleId = (await fetchBundleId());
    bundleId = Math.round(bundleId);
    console.log({ bundleId })

    const previousEnd = await fetchPreviousEnd(bundleId);
    console.log(
      "Previous bundle end time: ",
      new Date(previousEnd).getTime(),
      "Current time :",
      new Date().getTime()
    );
    if (new Date(previousEnd) <= new Date()) {

      let [prices] = await Promise.all([fetchPrice()]);

      if (prices.error) return;



      /**
    * Fetch your personal wallet's balance
    */
      // let myBalanceWei = web3.eth.getBalance(web3.eth.defaultAccount).toNumber()
      // let myBalance = web3.fromWei(myBalanceWei, 'ether')

      // console.log(`Your wallet balance is currently ${myBalance} ETH`)


      /**
       * With every new transaction you send using a specific wallet address,
       * you need to increase a nonce which is tied to the sender wallet.
       */
      let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
      console.log(`The outgoing transaction count for your wallet address is: ${nonce}`)


      /**
       * Fetch the current transaction gas prices from https://ethgasstation.info/
       */
      let gasPrices = await getCurrentGasPrices()


      /**
       * Build a new transaction object and sign it locally.
       */
      let details = {
        "to": config.CONTRACT_ADDRESS,
        "data": myContract.methods.createBundle(prices.hexPrices).encodeABI(),
        "gas": 1000000,
        "gasLimit": 100000,
        "gasPrice": gasPrices.low * 1000000000, // converts the gwei price to wei
        "nonce": nonce,
        "chainId": 1280 // EIP 155 chainId - mainnet: 1, rinkeby: 4
      }

      const transaction = new EthereumTx(details)

      /**
    * This is where the transaction is authorized on your behalf.
    * The private key is what unlocks your wallet.
    */
      transaction.sign(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
      


      /**
       * Now, we'll compress the transaction info down into a transportable object.
       */
      const serializedTransaction = transaction.serialize()

      /**
       * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
       */

      // const addr = transaction.from.toString('hex')
      // log(`Based on your private key, your wallet address is ${addr}`)

      /**
       * We're ready! Submit the raw transaction details to the provider configured above.
       */
      const transactionId = web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))


      transactionId.on("receipt", async receipt => {

        /**
        * We now know the transaction ID, so let's build the public Etherscan url where
        * the transaction details can be viewed.
        */
        const url = `https://scan.moonrabbit.com/tx/${transactionId}`
        //log(url.cyan)

        console.log(`Note: please allow for 30 seconds before transaction appears on Etherscan`)

        console.log("Bundle Created");

        let previousBundle = await Bundle.find({})
          .sort({ createdAt: -1 })
          .limit(1);
        let id;

        if (!previousBundle.length) id = 0;
        else {
          id = parseInt(previousBundle[0].bundleId);
          previousBundle[0].endPrice = prices.prices;
          await previousBundle[0].save();
        }

        let newBundle = new Bundle();

        let bundleIdLatest = await fetchBundleId();
        //console.log({ bundleIdLatest, bundleId })
        if (bundleId.toString() == bundleIdLatest.toString()) {
          newBundle.bundleId = Math.round(Number(bundleIdLatest) + 1).toString();
        } else {
          newBundle.bundleId = Math.round(bundleIdLatest).toString();
        }


        newBundle.prices = prices.prices;
        console.log("--", newBundle);
        await newBundle.save();
        console.log("bundleId", bundleId);
      });

      transactionId.on("error", error => {
        console.log("Bundle Error", error);
      })


    } else {
      console.log("Waiting for previous bundle to expire");
    }
  } catch (err) {
    console.log("Bundle creation error", err.message);
  }
});

const getCurrentGasPrices = async () => {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  }

  // console.log("\r\n")
  // log(`Current ETH Gas Prices (in GWEI):`.cyan)
  // console.log("\r\n")
  // log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
  // log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
  // log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
  // console.log("\r\n")

  return prices
}

createBundle.start();
//createBundle()
