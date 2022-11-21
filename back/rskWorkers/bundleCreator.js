const CronJob = require("cron").CronJob;
require("dotenv").config();
const config = require("../RSKconfig");
const fetchPrice = require("../utils/fetchPrice");
const Bundle = require("../models/rskBundle");
const fetchBundleId = require("../rskUtils/fetchBundleId");
const fetchPreviousEnd = require("../rskUtils/fetchPreviousEnd");

const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);

const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);


var createBundle = new CronJob("0 */10 * * * *", async function () {

    try {
        let bundleId = (await fetchBundleId()) - 1;
        bundleId = Math.round(bundleId);
        const previousEnd = await fetchPreviousEnd(bundleId);
        console.log(
            "Previous bundle end time: ",
            new Date(previousEnd),
            "Current time :",
            new Date()
        );
        console.log('---------create-----------1',)

        if (new Date(previousEnd) <= new Date()) {
            let [prices] = await Promise.all([fetchPrice()]);
            if (prices.error) return;
            console.log('---------create-----------2')
            let tx = {
                // this could be provider.addresses[0] if it exists
                from: config.OWNERAddress,
                // target address, this could be a smart contract address
                to: config.CONTRACT_ADDRESS,
                gas: 1000000 ,
                data: myContract.methods.createBundle(prices.hexPrices).encodeABI()
            };
            console.log('---------create-----------3')

            const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_RSK);
            console.log('---------create-----------4',signPromise)

            signPromise.then(async(signedTx) => {
                console.log('---------create-----------5')

                const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                console.log('---------create-----------6')

                sentTx.on("receipt", async receipt => {
                    console.log('---------create-----------7')


                    let previousBundle = await Bundle.find({})
                        .sort({ createdAt: -1 })
                        .limit(1);
                    let id;
                    console.log('---------create-----------8')

                    if (!previousBundle.length) id = 0;
                    else {
                        id = parseInt(previousBundle[0].bundleId);
                        previousBundle[0].endPrice = prices.prices;
                        await previousBundle[0].save();
                    }
                    console.log('---------create-----------9')

                    let newBundle = new Bundle();
                    console.log('---------create-----------10')

                    newBundle.bundleId = Math.round(id + 1);

                    newBundle.prices = prices.prices;
                    console.log("--", newBundle);
                    await newBundle.save();
                    console.log("bundleId", bundleId);
                    console.log("Bundle Created");


                });

                sentTx.on("error", err => {
                    // do something on transaction error
                });
            })

        } else {
            console.log("Waiting for previous bundle to expire");
        }

    } catch (err) {
        console.log("Bundle creation error", err.message);
    }

});

// createBundle.start();