const express = require("express");
const ethers = require("ethers");
const fetchBundleId = require("./utils/fetchBundleId");
const User = require("./models/user");
const Bundle = require("./models/bundle");
const fetchPrice = require("./utils/fetchPrice");
const fetchCryptoPrice = require("./utils/fetchCryptoPrice");
const fetchStakingEnds = require("./utils/fetchStakingEnds");
const TempUser = require("./models/tempUsers");

const RSKFetchBundleId = require("./rskUtils/fetchBundleId");
const RSKUser = require("./models/rskUser");
const RSKBundle = require("./models/rskBundle");
const RSKTempUser = require("./models/rskTempUsers");
const updateBalance = require("./rskUtils/updateBalance");
const config = require("./config");



const uploadData = require("./utils/imageStore");
const NFTUser = require("./models/nft_usr");

const router = express.Router();

function isAddress(address) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}

//Add user to the bundle with strike price, address, weight and balance
// TODO: done
router.post("/prediction/new", async (req, res) => {
  /*value=percentage
  index=position
  address=walletaddress
  balance=staking amount
  bundleId=poolId
  price=crypto price
  */
  try {
    let { value, index, address, balance, bundleId, price } = req.body;
    if (!address || !balance || !price) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }
    const [bundle, stakingEnds] = await Promise.all([
      Bundle.findOne({ bundleId: bundleId }),
      fetchStakingEnds(bundleId),
    ]);

    const existingBundle = await User.findOne({
      bundleId: bundleId,
      address: address,
    });
    price = parseFloat(parseFloat(price) / 10 ** 18).toFixed(8);
    balance = parseFloat(parseFloat(balance) / 10 ** 18).toFixed(8);
    if (existingBundle) {
      existingBundle.balance =
        parseFloat(existingBundle.balance) + parseFloat(balance);
      existingBundle.predicted[parseInt(index)] = value;
      existingBundle.prices[parseInt(index)] = price;
      existingBundle.assetsStaked[parseInt(index)] = parseFloat(balance);
      existingBundle.markModified("predicted");
      existingBundle.markModified("prices");
      existingBundle.markModified("assetsStaked");
      await existingBundle.save();
      return res.send({
        success: true,
        message:
          "Successfully staked " + parseFloat(balance).toFixed(2) + " BUND",
      });
    }
    let currentBundle = Math.round((await fetchBundleId()) - 1);
    if (!bundle && currentBundle == bundleId) {

      const prices = await fetchPrice();
      const newBundle = new Bundle();
      newBundle.bundleId = bundleId;
      newBundle.prices = prices.prices;
      newBundle.save();
    }
    let pct = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let userPrice = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsStaked = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    pct[parseInt(index)] = value;
    userPrice[parseInt(index)] = price;
    assetsStaked[parseInt(index)] = parseFloat(balance);

    const user = new User();
    user.address = address;
    user.predicted = pct;
    user.bundleId = bundleId;
    user.prices = userPrice;
    user.assetsStaked = assetsStaked;
    user.balance = parseFloat(balance).toFixed(4);
    console.log({ user })
    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Successfully staked " + parseFloat(balance).toFixed(2) + " BUND",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});

//To retrieve the performance of an user in a bundle.

router.post("/:address/status/:bundleId", async (req, res) => {
  try {
    const { address, bundleId } = req.params;
    if (!address) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }

    const [data, bundle] = await Promise.all([
      User.findOne({ address: address, bundleId: bundleId }),
      Bundle.findOne({ bundleId: bundleId }),
    ]);
    if (!data || !bundle) {
      return res.send({
        error: true,
        message: "Not found",
        status: 404,
      });
    }

    let bundlePrice = data.prices;
    let userWeight = data.predicted;
    let currentPrice = bundle.endPrice;
    if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
    let performance = 0;
    let totalStaked = parseFloat(data.balance);
    let assetsPerformance = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bundPnL = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsCount = 0;
    for (var i = 0; i < 10; i++) {
      if (parseFloat(bundlePrice[i]) > 0) {
        assetsCount++;
        let variation =
          parseFloat(
            (parseFloat(currentPrice[i]) - parseFloat(bundlePrice[i])) /
            parseFloat(bundlePrice[i])
          ) * 100;

        variation = (variation * parseFloat(userWeight[i])) / 100;

        assetsPerformance[i] = parseFloat(variation).toFixed(8);
        bundPnL[i] = parseFloat(variation * data.assetsStaked[i]).toFixed(8);
        performance += (variation * parseFloat(userWeight[i])) / 100;
      }
    }
    if (assetsCount == 0) assetsCount = 1;
    let assetsStaked;
    if (!data.assetsStaked.length) assetsStaked = [];
    else assetsStaked = data.assetsStaked;
    return res.json({
      success: true,
      performance: parseFloat(performance).toFixed(8),
      assets_performance: assetsPerformance,
      bundsEarnedOrLost: bundPnL,
      assets_staked: assetsStaked,
      reward: data.rewards,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});

//To retrieve the leaderboard of a bundle.

router.get("/overall/:bundleId", async (req, res) => {
  let { bundleId } = req.params;
  const [users, bundle] = await Promise.all([
    User.find({ bundleId: bundleId }).sort({ createdAt: -1 }),
    Bundle.findOne({ bundleId: bundleId }),
  ]);
  if (users.length && bundle) {
    let currentPrice = bundle.endPrice;
    if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
    let performance = [];
    let totalBal = 0
    for (var i = 0; i < users.length; i++) {
      let assetsCount = 0;
      let bundlePrice = users[i].prices;
      let value = 0;
      let userWeight = users[i].predicted;
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

      let nft_user = await NFTUser.findOne({ wallet_address: users[i].address });
      totalBal += parseFloat(users[i].balance)
      performance.push({
        address: users[i].address,
        staked: users[i].balance,
        score: parseFloat(value).toFixed(8),
        user_name: nft_user.user_name,
        totalBal
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

    return res.send({
      responseCode: 200,
      responseMessage: "success",
      data: performance,
    });
  } else {
    return res.send({ responseCode: 400, responseMessage: "success", data: [] });
  }
});

router.get("/halloffame", async (req, res) => {
  let users = await User.find(
    { rank: "1" },
    { address: 1, bundleId: 1, _id: 0 }
  );

  let updatedUserData = []
  if (users.length > 0) {
    data = Promise.all(users.map(async (udt) => {

      let nft_user = await NFTUser.findOne({ wallet_address: udt.address });
      return {
        address: udt.address,
        bundleId: udt.bundleId,
        user_name: nft_user.user_name
      }
    }))

    updatedUserData = await data
  }

  return res.send({
    responseCode: 200,
    responseMessage: "success",
    data: updatedUserData,
  });
});

// TODO: done
router.get("/details/:address/:bundleId", async (req, res) => {
  if (!req.params.address || !req.params.bundleId)
    return res.send({
      error: true,
      message: "Address and BundleId required",
    });
  let users = await User.find(
    { address: req.params.address, bundleId: req.params.bundleId },
    { _id: 0, updatedAt: 0, balUpdateHash: 0, __v: 0 }
  ).lean();

  users.map((userDt, index) => {
    let poolData = []
    userDt.assetsStaked.map((dt, ind) => {
      if (dt > 0) {
        poolData.push({
          key: ind,
          tokenTitle: config.LONG_FORM[ind],
          strikePrice: '$' + parseFloat(userDt.prices[ind]).toFixed(2),
          strikeAmount: dt,
          short: config.SHORT_FORM[ind]
        })
      }
    })
    userDt.poolData = poolData
  })

  return res.send({ responseCode: 200, responseMessage: "success", data: users });
});

// TODO: done
router.get("/completed/:address/:poolId", async (req, res) => {
  if (!req.params.address || !req.params.poolId)
    return res.send({
      error: true,
      message: "Address is required",
    });
  let users = await User.find(
    { address: req.params.address, bundleId: { $ne: req.params.poolId } },
    { _id: 0, updatedAt: 0, balUpdateHash: 0, __v: 0 }
  ).lean();

  if (users && users.length > 0) {
    let poolData = []
    balanceSum = Array.from(users, ({ balance }) => balance).reduce((sum, x) => parseFloat(sum) + parseFloat(x))
    users.map((userDt, index) => {

      userDt.assetsStaked.map((dt, ind) => {
        if (dt > 0) {
          poolData.push({
            bundleId: userDt.bundleId,
            key: ind,
            tokenTitle: config.LONG_FORM[ind],
            short: config.SHORT_FORM[ind],
            strikePrice: '$' + parseFloat(userDt.prices[ind]).toFixed(2),
            strikeAmount: dt,
            totalBalance: balanceSum
          })
        }
      })
    })

    return res.send({ responseCode: 200, responseMessage: "success", data: poolData });
  } else {
    return res.send({ responseCode: 200, responseMessage: "success", data: users });
  }


});

router.post("/prices", async (req, res) => {
  try {
    let prices = await fetchPrice();

    return res.send({ success: true, prices: prices.prices });
  } catch (error) {
    console.log(error);
    return res.send({
      error: true,
      message: "Cannot fetch price at the moment",
    });
  }
});

// TODO: done
router.get("/cryptoPrices", async (req, res) => {
  try {
    let prices = await fetchCryptoPrice();
    
    return res.send({ responseCode: 200, responseMessage: "Success", data: prices.bundles });
  } catch (error) {
    console.log(error);
    return res.send({
      responseCode: 500,
      error: true,
      responseMessage: "Cannot fetch price at the moment",
    });
  }
});


//Temp User

router.post("/temp_user/new", async (req, res) => {
  try {
    let { value, index, address, balance, bundleId, price } = req.body;
    if (!value || !address || !index || !balance || !bundleId || !price) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }
    const [bundle, stakingEnds] = await Promise.all([
      Bundle.findOne({ bundleId: bundleId }),
      fetchStakingEnds(bundleId),
    ]);

    const existingBundle = await TempUser.findOne({
      bundleId: bundleId,
      address: address,
    });
    price = parseFloat(parseFloat(price) / 10 ** 18).toFixed(8);
    balance = parseFloat(parseFloat(balance) / 10 ** 18).toFixed(8);
    if (existingBundle) {
      existingBundle.balance =
        parseFloat(existingBundle.balance) + parseFloat(balance);
      existingBundle.predicted[parseInt(index)] = value;
      existingBundle.prices[parseInt(index)] = price;
      existingBundle.assetsStaked[parseInt(index)] = parseFloat(balance);
      existingBundle.markModified("predicted");
      existingBundle.markModified("prices");
      existingBundle.markModified("assetsStaked");
      await existingBundle.save();
      return res.send({
        success: true,
        message: "Temp user updated",
      });
    }
    let currentBundle = Math.round((await fetchBundleId()) - 1);
    if (!bundle && currentBundle == bundleId) {
      const prices = await fetchPrice();
      const newBundle = new Bundle();
      newBundle.bundleId = bundleId;
      newBundle.prices = prices.prices;
      newBundle.save();
    }
    let pct = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let userPrice = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsStaked = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    pct[parseInt(index)] = value;
    userPrice[parseInt(index)] = price;
    assetsStaked[parseInt(index)] = parseFloat(balance);

    const user = new TempUser();
    user.address = address;
    user.predicted = pct;
    user.bundleId = bundleId;
    user.prices = userPrice;
    user.assetsStaked = assetsStaked;
    user.balance = parseFloat(balance).toFixed(4);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Temp User created",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});



router.get("/token/0x2DE5daB3d894CE05e7BBee181216Ef1aDfa8565C/:id", async (req, res) => {
  let { id } = req.params;
  let tokenArray = [

    {
      image: './assets/images/NFTs/rare.jpeg',
      name: 'Rare NFT',
      price: '400 BundNFT',
      id: '0',
      copies: '12',
      basePrice: 400,
      shortDesc: 'DOT vs ETH',
      longDesc: 'Who will become the dominant smart contract platform of the future?'
    },
    {
      image: './assets/images/NFTs/special.jpeg',
      name: 'Special NFT',
      price: '200 BundNFT',
      id: '1',
      copies: '6',
      basePrice: 200,
      shortDesc: 'The Race to the Moon',
      longDesc: 'The battle between exchange tokens over who will become the dominant exchange.'
    },
    {
      image: './assets/images/NFTs/legend.jpeg',
      name: 'Legend NFT',
      price: '800 BundNFT',
      id: '2',
      copies: '1',
      basePrice: 800,
      shortDesc: 'ETH Evolution',
      longDesc: 'Ethereum is constantly evolving and developing as blockchain technology advances.'
    }

  ];

  let tokenObj = {};
  if (id == '0') {
    tokenObj = await tokenArray.filter(x => x.id == id)[0];
  }
  else if (id == '1') {
    tokenObj = await tokenArray.filter(x => x.id == id)[0];
  }
  else if (id == '2') {
    tokenObj = await tokenArray.filter(x => x.id == id)[0];
  } else {
    return res.send({ success: false, data: {}, message: 'Not found.' });
  }
  return res.send({ success: true, data: tokenObj });


})


router.post('/uploadData', async (req, res) => {

  try {
    if (req.files == null) {
      return 3;
    } else {

      if (req.body.updType == 'image') {
        let reponseImg = await uploadData.imageStoreOne(req.files.updDocs);

        if (reponseImg) {
          await res.send({ success: true, data: reponseImg });
        } else {
          return res.status(400).send({
            error: true,
            message: "There is some issue with data upload.",
          });
        }
      }


    }

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "There is some issue with data upload.",
    });
  }



});

//------------------------------------------------------------------------RSK--------------------------------------------------


router.get("/rsk/test", async (req, res) => {
  console.log('---------------------------1')

  let id = await RSKFetchBundleId();

  return res.send({ success: true, data: id });

})


//Add user to the bundle with strike price, address, weight and balance
// RSKUser
// RSKBundle

router.post("/rsk/prediction/new", async (req, res) => {
  try {
    let { value, index, address, balance, bundleId, price } = req.body;
    if (!value || !address || !index || !balance || !bundleId || !price) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }
    const [bundle, stakingEnds] = await Promise.all([
      RSKBundle.findOne({ bundleId: bundleId }),
      fetchStakingEnds(bundleId),
    ]);

    const existingBundle = await RSKUser.findOne({
      bundleId: bundleId,
      address: address,
    });
    price = parseFloat(parseFloat(price) / 10 ** 18).toFixed(8);
    balance = parseFloat(parseFloat(balance) / 10 ** 18).toFixed(8);
    if (existingBundle) {
      existingBundle.balance =
        parseFloat(existingBundle.balance) + parseFloat(balance);
      existingBundle.predicted[parseInt(index)] = value;
      existingBundle.prices[parseInt(index)] = price;
      existingBundle.assetsStaked[parseInt(index)] = parseFloat(balance);
      existingBundle.markModified("predicted");
      existingBundle.markModified("prices");
      existingBundle.markModified("assetsStaked");
      await existingBundle.save();
      return res.send({
        success: true,
        message:
          "Successfully staked " + parseFloat(balance).toFixed(2) + " BUND",
      });
    }
    let currentBundle = Math.round((await fetchBundleId()) - 1);
    if (!bundle && currentBundle == bundleId) {
      const prices = await fetchPrice();
      const newBundle = new RSKBundle();
      newBundle.bundleId = bundleId;
      newBundle.prices = prices.prices;
      newBundle.save();
    }
    let pct = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let userPrice = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsStaked = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    pct[parseInt(index)] = value;
    userPrice[parseInt(index)] = price;
    assetsStaked[parseInt(index)] = parseFloat(balance);

    const user = new RSKUser();
    user.address = address;
    user.predicted = pct;
    user.bundleId = bundleId;
    user.prices = userPrice;
    user.assetsStaked = assetsStaked;
    user.balance = parseFloat(balance).toFixed(4);
    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Successfully staked " + parseFloat(balance).toFixed(2) + " BUND",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});


//To retrieve the performance of an user in a bundle.

router.post("/rsk/:address/status/:bundleId", async (req, res) => {
  try {
    const { address, bundleId } = req.params;
    if (!address) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }

    const [data, bundle] = await Promise.all([
      RSKUser.findOne({ address: address, bundleId: bundleId }),
      RSKBundle.findOne({ bundleId: bundleId }),
    ]);
    if (!data || !bundle) {
      return res.send({
        error: true,
        message: "Not found",
        status: 404,
      });
    }

    let bundlePrice = data.prices;
    let userWeight = data.predicted;
    let currentPrice = bundle.endPrice;
    if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
    let performance = 0;
    let totalStaked = parseFloat(data.balance);
    let assetsPerformance = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bundPnL = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsCount = 0;
    for (var i = 0; i < 10; i++) {
      if (parseFloat(bundlePrice[i]) > 0) {
        assetsCount++;
        let variation =
          parseFloat(
            (parseFloat(currentPrice[i]) - parseFloat(bundlePrice[i])) /
            parseFloat(bundlePrice[i])
          ) * 100;

        variation = (variation * parseFloat(userWeight[i])) / 100;

        assetsPerformance[i] = parseFloat(variation).toFixed(8);
        bundPnL[i] = parseFloat(variation * data.assetsStaked[i]).toFixed(8);
        performance += (variation * parseFloat(userWeight[i])) / 100;
      }
    }
    if (assetsCount == 0) assetsCount = 1;
    let assetsStaked;
    if (!data.assetsStaked.length) assetsStaked = [];
    else assetsStaked = data.assetsStaked;
    return res.json({
      success: true,
      performance: parseFloat(performance).toFixed(8),
      assets_performance: assetsPerformance,
      bundsEarnedOrLost: bundPnL,
      assets_staked: assetsStaked,
      reward: data.rewards,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});



router.post("/rsk/overall/:bundleId", async (req, res) => {
  let { bundleId } = req.params;
  const [users, bundle] = await Promise.all([
    RSKUser.find({ bundleId: bundleId }).sort({ createdAt: -1 }),
    RSKBundle.findOne({ bundleId: bundleId }),
  ]);
  if (users.length && bundle) {
    let currentPrice = bundle.endPrice;
    if (!currentPrice.length) currentPrice = (await fetchPrice()).prices;
    let performance = [];
    for (var i = 0; i < users.length; i++) {
      let assetsCount = 0;
      let bundlePrice = users[i].prices;
      let value = 0;
      let userWeight = users[i].predicted;
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
      performance.push({
        address: users[i].address,
        staked: users[i].balance,
        score: parseFloat(value).toFixed(8),
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

    return res.send({
      success: true,
      performance: performance,
    });
  } else {
    return res.send({ success: true, performance: [] });
  }
});


router.post("/rsk/halloffame", async (req, res) => {
  let users = await RSKUser.find(
    { rank: "1" },
    { address: 1, bundleId: 1, _id: 0 }
  );
  return res.send({ success: true, hallOfFame: users });
});

router.post("/rsk/details/:address/:bundleId", async (req, res) => {
  if (!req.params.address || !req.params.bundleId)
    return res.send({
      error: true,
      message: "Address and BundleId required",
    });
  let users = await RSKUser.find(
    { address: req.params.address, bundleId: req.params.bundleId },
    { _id: 0, updatedAt: 0, balUpdateHash: 0, __v: 0 }
  ).lean();
  return res.send({ success: true, data: users });
});


router.post("/rsk/temp_user/new", async (req, res) => {
  try {
    let { value, index, address, balance, bundleId, price } = req.body;
    if (!value || !address || !index || !balance || !bundleId || !price) {
      return res.send({
        error: true,
        message: "Invalid request",
        status: 400,
      });
    }
    if (!isAddress(address)) {
      return res.send({
        error: true,
        message: "Invalid address format",
        status: 400,
      });
    }
    const [bundle, stakingEnds] = await Promise.all([
      RSKBundle.findOne({ bundleId: bundleId }),
      fetchStakingEnds(bundleId),
    ]);

    const existingBundle = await RSKTempUser.findOne({
      bundleId: bundleId,
      address: address,
    });
    price = parseFloat(parseFloat(price) / 10 ** 18).toFixed(8);
    balance = parseFloat(parseFloat(balance) / 10 ** 18).toFixed(8);
    if (existingBundle) {
      existingBundle.balance =
        parseFloat(existingBundle.balance) + parseFloat(balance);
      existingBundle.predicted[parseInt(index)] = value;
      existingBundle.prices[parseInt(index)] = price;
      existingBundle.assetsStaked[parseInt(index)] = parseFloat(balance);
      existingBundle.markModified("predicted");
      existingBundle.markModified("prices");
      existingBundle.markModified("assetsStaked");
      await existingBundle.save();
      return res.send({
        success: true,
        message: "Temp user updated",
      });
    }
    let currentBundle = Math.round((await fetchBundleId()) - 1);
    if (!bundle && currentBundle == bundleId) {
      const prices = await fetchPrice();
      const newBundle = new RSKBundle();
      newBundle.bundleId = bundleId;
      newBundle.prices = prices.prices;
      newBundle.save();
    }
    let pct = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let userPrice = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let assetsStaked = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    pct[parseInt(index)] = value;
    userPrice[parseInt(index)] = price;
    assetsStaked[parseInt(index)] = parseFloat(balance);

    const user = new RSKTempUser();
    user.address = address;
    user.predicted = pct;
    user.bundleId = bundleId;
    user.prices = userPrice;
    user.assetsStaked = assetsStaked;
    user.balance = parseFloat(balance).toFixed(4);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Temp User created",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: true,
      message: "Cannot update. Please try again.",
    });
  }
});


router.get("/NFT/:wallet_address", async (req, res) => {
  let { wallet_address } = req.params;

  let nft_user = await NFTUser.findOne({ wallet_address: wallet_address });

  if (nft_user && nft_user != undefined && nft_user != null) {
    return res.send({ success: true, data: nft_user });
  } else {
    return res.send({ success: false, data: {}, message: 'Not found.' });
  }
})

router.post("/NFT/create", async (req, res) => {

  let { wallet_address } = req.body;
  if (!wallet_address) {
    return res.send({
      error: true,
      message: "wallet_address required",
      status: 400,
    });
  }
  if (!isAddress(wallet_address)) {
    return res.send({
      error: true,
      message: "Invalid wallet_address format",
      status: 400,
    });
  }
  let createObj = {
    wallet_address: wallet_address,
  };

  if (req.body.user_name && req.body.user_name != undefined) {
    createObj.user_name = req.body.user_name;
  }
  /* if (req.body.user_bio && req.body.user_bio != undefined) {
    createObj.user_bio = req.body.user_bio;
  }
  if (req.body.user_email && req.body.user_email != undefined) {
    createObj.user_email = req.body.user_email;
  }
  if (req.body.user_image && req.body.user_image != undefined) {
    createObj.user_image = req.body.user_image;
  } */
  let nft_user = await NFTUser.findOne({ wallet_address: wallet_address });

  if (nft_user && nft_user != undefined && nft_user != null) {

    await NFTUser.updateOne({ wallet_address: wallet_address }, { $set: createObj }).then(async (resObj) => {
      if (resObj) {
        return await res.send({ success: true, data: resObj, message: 'User Registered successfully.' });
      }
    }).catch((er) => {
      return res.send({ success: false, data: er, message: 'err' });
    });


  } else {

    await NFTUser.create(createObj).then(async (resObj) => {
      if (resObj) {

        /* const provider = new ethers.providers.EtherscanProvider(
          config.NETWORK,
          "V9XWFDNQS1KYD1TIJE7NVS8UMZ3BW9UZY7"
        );

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log({ wallet })

        const contract = new ethers.Contract(
          config.CONTRACT_ADDRESS,
          config.ABI,
          wallet
        );

        let tx = await contract.Register(req.body.user_name);
        console.log("Added user in SC...", tx);

        await tx.wait(); */

        return await res.send({ success: true, data: resObj, message: 'User Registered successfully.' });
      }
    }).catch((er) => {
      return res.send({ success: false, data: er, message: 'err' });
    });
  }
})

router.get("/checkUserStatus/:wallet_address", async (req, res) => {
  let { wallet_address } = req.params;

  let userStatus = await User.find({ wallet_address: wallet_address, rank: { $gt: 0, $lte: 5 } }).sort({ bundleId: "-1" }).limit(30);
  console.log({userStatus})
  if (userStatus && userStatus.length > 0) {
    return res.send({ responseCode: 200, responseMessage: "Success", data: true })
  } else {
    return res.send({ responseCode: 200, responseMessage: "Success", data: false })
  }
})

module.exports = router;