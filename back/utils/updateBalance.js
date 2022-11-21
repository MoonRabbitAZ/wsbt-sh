require("dotenv").config();
const ethers = require("ethers");
const Web3 = require("web3");

const config = require("../config");
const provider = new Web3(config.RPCURL)

const fetchPrice = require("../utils/fetchPrice");
const Bundle = require("../models/bundle");
const User = require("../models/user");
const calculateReward = require("./calculateReward");
const { use } = require("../api");

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
    console.log('-----------1', bundleId);
    const [users, bundle] = await Promise.all([F
      User.find({ bundleId: bundleId }).sort({ createdAt: -1 }),
      Bundle.findOne({ bundleId: bundleId }),
    ]);
    console.log('----users-------', users);
    console.log('---bundle--------', bundle);

    if (users.length && bundle) {
      console.log("Updating balance..");
      let currentPrice = bundle.endPrice;
      if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
      let performance = [];
      for (let i = 0; i < users.length; i++) {
        let bundlePrice = users[i].prices;
        let value = 0;
        let userWeight = users[i].predicted;
        let assetsCount = 0;
        for (let j = 0; j < 10; j++) {
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
      for (let k = 0; k < 10; k++) {
        let reward = rewards[k];
        for (let l = start; l <= end; l++) {
          if (performance[l]) performance[l]["reward"] = reward;
        }
        start = end + 1;
        end = Math.floor(initial * (k + 2));
      }
      let perf = JSON.parse(JSON.stringify(performance));
      let finalReward = await calculateReward(perf);
      console.log("reward", finalReward);
      //  process.exit(1)
      bundle.rewards = finalReward;

      await bundle.save();

      await updateUserBalance(bundleId, finalReward, performance)

      //return;
    } else return;
  } catch (err) {
    console.log("Update Balance error", err.message);
  }
};

async function getGasPrice() {
  return await web3.eth.getGasPrice()
}

const updateUserBalance = async (bundleId, finalReward, performance) => {

  let networkId = await web3.eth.net.getId();
  let gasPrice = await web3.eth.getGasPrice();
  var nonce = await web3.eth.getTransactionCount(config.OWNERAddress);

  console.log({ performance })
  for (var m = 0; m < performance.length; m++) {
    console.log("INNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNnnn")
    let currentUser = await User.findOne({
      address: performance[m].address,
      bundleId: bundleId,
    });
    // console.log("currentUSer", currentUser);
    if (currentUser.isBalanceUpdated) continue;
    currentUser.reward = finalReward[performance[m].address] + "%";
    currentUser.balanceUpdatedAt = new Date();
    currentUser.rank = performance[m].rank;
    currentUser.performance = performance[m].score;

    let isPositive = true;
    if (parseFloat(finalReward[performance[m].address]) < 0) {
      isPositive = false;
    }

    // console.log('-ad--------', currentUser.address);
    // console.log('-bun--------', bundleId);
    // console.log('-rew--------', Math.round(Math.abs(finalReward[currentUser.address]) * 10 ** 6));
    // console.log('-posi--------', isPositive);
    // console.log('finalRRRRR', finalReward[currentUser.address])

    let currentUserReward = finalReward[currentUser.address].toFixed(4)
    
    const transactionObj = {
      address: currentUser.address.toString(),
      bundleId: bundleId.toString(),
      reward: Math.round(Math.abs(currentUserReward) * 10 ** 4),
      isPositive
    }

    console.log({transactionObj})

    try {
      const tx = myContract.methods.updatebal(transactionObj.address, transactionObj.bundleId, transactionObj.reward, transactionObj.isPositive);
      const gas = await tx.estimateGas({ from: config.OWNERAddress });
      //var block = await web3.eth.getBlock("latest");
      const data = tx.encodeABI();
      
  
      //console.log({ gas, gasPrice, nonce })
  
      const payloadObj = {
        to: config.CONTRACT_ADDRESS,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId
      }
      
      console.log({ payloadObj })

      const signedTx = await web3.eth.accounts.signTransaction(
        payloadObj,
        process.env.PRIVATE_KEY
      );
      nonce++;
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log({ receipt });
      console.log(`Transaction hash: ${receipt.transactionHash}`);
      if (receipt.transactionHash) {
        console.log({ receipt })
        currentUser.isBalanceUpdated = true;
        currentUser.balUpdateHash = receipt.hash;
        await currentUser.save();
      }
     
    } catch (error) {
      console.log({ error })
    }
  }
}