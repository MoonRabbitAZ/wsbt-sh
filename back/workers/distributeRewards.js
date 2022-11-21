const config = require("../config");
const Bundle = require("../models/bundle");
const User = require("../models/user");
const updateBalance = require("../utils/updateBalance");
const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);
const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);


let listener = Bundle.watch();

listener.on("change", async (next) => {
    try {
        if (next.operationType == "insert") {
            let doc = next.fullDocument;
            let bundleId = Math.round(parseInt(doc.bundleId) - 1);
            console.log("bundleId", bundleId);
            let users = await User.find({ bundleId: bundleId });
            if (users.length > 0) {
                let gasPrice = await web3.eth.getGasPrice()
                console.log({gasPrice})
                let tx1 = {
                    //     // this could be provider.addresses[0] if it exists
                    from: config.OWNERAddress,
                    //     // target address, this could be a smart contract address
                    to: config.CONTRACT_ADDRESS,
                    gas: 10000000,
                    data: myContract.methods.setRebaseStatus().encodeABI()
                };

                const signPromise1 = web3.eth.accounts.signTransaction(tx1, process.env.PRIVATE_KEY);

                signPromise1.then(async (signedTx1) => {

                    const sentTx1 = web3.eth.sendSignedTransaction(signedTx1.raw || signedTx1.rawTransaction);

                    sentTx1.on("receipt", async receipt => {
                        console.log("Rebase status success")

                        await updateBalance(bundleId)
                        await Bundle.findOneAndUpdate(
                            { bundleId: bundleId },
                            { isRewardDistributed: true }
                        );
                        console.log("Rewards Distributed");
                    })
                })

                // await updateBalance(bundleId)
                // await Bundle.findOneAndUpdate(
                //     { bundleId: bundleId },
                //     { isRewardDistributed: true }
                // );
                // console.log("Rewards Distributed");


            } else console.log("No users staked in the previous pool");
        }
    } catch (error) {
        console.log("Reward distribution error", error);
    }
});
