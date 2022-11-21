const { CronJob } = require('cron');
const { Bundle } = require('../../db/models/models');

const { getCryptoPrices } = require('../coingecko/coingecko');
const { getLastBundleId, getBundle, createBundle, setRebaseStatus } = require('../contracts/bundleHelper');
const { distributeRewards } = require('./helpers/distributeRewars');

const bundleCreator = new CronJob('*/1 * * * *', async () => {
  try {
    const lastBundleId = await getLastBundleId();

    if (lastBundleId !== 0) {
      const contractLastBundle = await getBundle(lastBundleId);
      if (new Date(contractLastBundle.end * 1000) > new Date()) {
        console.log(
          `Bundle #${lastBundleId} will end after ${(contractLastBundle.end * 1000 - Date.now()) / 1000} seconds.`
        );
        await distributeRewards(lastBundleId - 1);
        return;
      }
    }

    const prices = await getCryptoPrices();
    await createBundle(prices);
    await setRebaseStatus();
    console.log(`Bundle #${lastBundleId + 1} created.`);

    let newBundle = await Bundle.findOne({ bundleId: lastBundleId + 1 });
    if (!newBundle) {
      newBundle = new Bundle();
      newBundle.bundleId = lastBundleId + 1;
      newBundle.prices = prices;
      await newBundle.save();

      console.log(`Bundle #${lastBundleId + 1} saved.`);
    } else {
      console.log(`Bundle #${lastBundleId + 1} already exist.`);
    }

    const lastBundle = await Bundle.findOne({ bundleId: lastBundleId });
    if (lastBundle) {
      lastBundle.endPrice = prices;
      await lastBundle.save();

      await distributeRewards(lastBundleId);
    }
  } catch (e) {
    console.log('----------');
    console.log(`Error in bundleCreator() at ${new Date().getTime()}.`);
    console.log(e);
    console.log('----------');
  }
});

bundleCreator.start();
