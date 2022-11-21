export default class BundleContract {
  constructor(web3) {
    this.web3 = web3;
    this.instance = null;
  }

  getInstance() {
    if (this.instance !== null) return this.instance;

    if (this.web3 && this.web3 !== '') {
      this.instance = new this.web3.eth.Contract(require('./abi/bundle.json'), process.env.REACT_APP_BUNDLE_ADDRESS);
      return this.instance;
    }

    throw 'Web3 is undefined.';
  }

  async register(sender, username) {
    if (this.web3 === '') return '0';

    await this.getInstance().methods.Register(username).send({ from: sender });
  }

  async placePrediction(sender, index, price, value, bundleId, balance) {
    if (this.web3 === '') return '0';

    await this.getInstance().methods.placePrediction(index, price, value, bundleId, balance).send({ from: sender });
  }

  async withdraw(sender) {
    if (this.web3 === '') return '0';

    await this.getInstance().methods.withdraw().send({ from: sender });
  }

  async participateForMegaPool(sender) {
    if (this.web3 === '') return '0';

    const rebaseSessionId = (await this.getInstance().methods.rebaseSessionId().call()).toString();

    await this.getInstance().methods.participateForMegaPool(rebaseSessionId).send({ from: sender });
  }

  async bundleId() {
    if (this.web3 === '') return '0';

    return String((await this.getInstance().methods.bundleId().call()).toString() - 1);
  }

  async fetchUserPredictions(address, bundleId) {
    if (this.web3 === '')
      return {
        _bundles: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _prices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _amounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        balance: 0,
        totalPredicted: 0
      };

    return await this.getInstance().methods.fetchUserPredictions(address, bundleId).call();
  }

  async fetchUser(address) {
    if (this.web3 === '')
      return {
        username: '',
        claimable: 0,
        stakedBalance: 0,
        active: false
      };

    return await this.getInstance().methods.fetchUser(address).call();
  }

  async fetchBundle(bundleId) {
    let res = {
      prices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      start: 0,
      end: 0,
      staking_ends: 0
    };

    if (this.web3 !== '') {
      try {
        const resp = await this.getInstance().methods.fetchBundle(bundleId).call();
        res = {
          prices: resp._prices,
          start: resp._start,
          end: resp._end,
          stakingEnd: resp._staking_ends
        };
      } catch (e) {
        console.log('fetchBundle() failed.');
      }
    }

    return res;
  }
}
