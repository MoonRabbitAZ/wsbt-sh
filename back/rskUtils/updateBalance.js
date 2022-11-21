require("dotenv").config();

const config = require("../RSKconfig");

const fetchPrice = require("../utils/fetchPrice");

const RSKUser = require("../models/rskUser");
const RSKBundle = require("../models/rskBundle");


const calculateReward = require("./calculateReward");

const Web3 = require("web3");
const web3 = new Web3(config.RPCURL);

const myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);

const rewards = {
    0: 3.6,
    1: 2.7,
    2: 1.8,
    3: 0.9,
    4: 0,
    5: 0,
    6: -1,
    7: -2,
    8: -3,
    9: -4,
};
module.exports = async (bundleId) => {
    try {

        const [users, bundle] = await Promise.all([
            RSKUser.find({ bundleId: bundleId }).sort({ createdAt: -1 }),
            RSKBundle.findOne({ bundleId: bundleId }),
        ]);


        if (users.length && bundle) {

            let currentPrice = bundle.endPrice;
            if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
            let performance = [];

            for (var i = 0; i < users.length; i++) {
                let bundlePrice = users[i].prices;
                let value = 0;
                let userWeight = users[i].predicted;
                let assetsCount = 0;
                for (var j = 0; j < 10; j++) {
                    if (parseFloat(bundlePrice[j]) > 0) {
                        assetsCount++;
                        let variation =
                            ((parseFloat(currentPrice[j]) - parseFloat(bundlePrice[j])) /
                                parseFloat(bundlePrice[j])) *
                            100;
                        value += (variation * parseFloat(userWeight[j])) / 100;
                    }
                }
                if (assetsCount == 0) assetsCount = 1;
                performance.push({
                    address: users[i].address,
                    staked: users[i].balance,
                    score: value,
                });
            }
            performance = performance
                .sort(function (a, b) {
                    return b.score - a.score;
                })
                .map(function (e, i) {
                    e.rank = i + 1;
                    return e;
                });

            let start = 0,
                end = Math.floor(performance.length * 0.1),
                initial = performance.length * 0.1;
            for (var i = 0; i < 10; i++) {
                let reward = rewards[i];
                for (var j = start; j <= end; j++) {
                    if (performance[j]) performance[j]["reward"] = reward;
                }
                start = end + 1;
                end = Math.floor(initial * (i + 2));
            }
            let perf = JSON.parse(JSON.stringify(performance));
            let finalReward = await calculateReward(perf);
            console.log("reward", finalReward);

            bundle.rewards = finalReward;

            await bundle.save();


            for (let i = 0; i < performance.length; i++) {
                let currentUser = await RSKUser.findOne({
                    address: performance[i].address,
                    bundleId: bundleId,
                });
                // console.log("currentUSer", currentUser);
                if (currentUser.isBalanceUpdated) continue;
                currentUser.reward = finalReward[performance[i].address] + "%";
                currentUser.balanceUpdatedAt = new Date();
                currentUser.rank = performance[i].rank;
                currentUser.performance = performance[i].score;

                let isPositive = true;
                if (parseFloat(finalReward[performance[i].address]) < 0)
                    isPositive = false;
                console.log('-ad--------', currentUser);

                // console.log('-ad--------', currentUser.address);
                // console.log('-bun--------', bundleId);
                // console.log('-rew--------', Math.round(Math.abs(finalReward[currentUser.address]) * 10 ** 6));
                // console.log('-posi--------', isPositive);


                // let tx = {
                //     // this could be provider.addresses[0] if it exists
                //     from: config.OWNERAddress,
                //     // target address, this could be a smart contract address
                //     to: config.CONTRACT_ADDRESS,
                //     gas: 1000000,
                //     data: myContract.methods.updatebal(currentUser.address, bundleId, Math.round(Math.abs(finalReward[currentUser.address]) * 10 ** 6), isPositive).encodeABI()
                // };

                // const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_RSK);
                // signPromise.then(async (signedTx) => {

                //     const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);

                //     sentTx.on("receipt", async receipt => {
                        currentUser.isBalanceUpdated = true;
                //         currentUser.balUpdateHash = receipt.hash;
                        await currentUser.save();

                //         console.log('---------------resord saved.-----------')
                //     });
                // });

            }



        } else return;

    } catch (err) {
        console.log("Update Balance error", err.message);
    }
};