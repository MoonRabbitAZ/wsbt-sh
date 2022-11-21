const express = require('express');

const predictionNew = require('./_predictionNew');
const cryptoPrices = require('./_cryptoPrices');
const overall = require('./_overall');
const details = require('./_details');
const completed = require('./_completed');
const hallOfFame = require('./_hallOfFame');
const checkUserStatus = require('./_checkUserStatus');
const nftCreate = require('./nft/_create');
const nftGetOne = require('./nft/_getOne');

const distributeRewardsTest = require('./test/_distributeRewardsTest');

const router = express.Router();

// router.get("/test", async (req, res, next) => {
//   res.status(500).send('Hello World!!!');
//
//   // next(new Error("Cannot update. Please try again."))
// })

router.get('/crypto-prices', cryptoPrices);
router.get('/overall/:bundleId', overall);
router.get('/details/:address/:bundleId', details);
router.get('/completed/:address/:bundleId', completed);
router.get('/hall-of-fame', hallOfFame);
router.get('/NFT/get/:walletAddress', nftGetOne);
router.get('/check-user-status/:walletAddress', checkUserStatus);

router.post('/prediction/new', predictionNew);
router.post('/NFT/create', nftCreate);

router.get('/distribute-rewards/:bundleId', distributeRewardsTest);

module.exports = router;
