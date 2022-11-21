import { toWei } from '../helpers/bn.helper';

export default class TokenContract {
  constructor(web3) {
    this.web3 = web3;
    this.instance = null;
  }

  getInstance() {
    if (this.instance !== null) return this.instance;

    if (this.web3 && this.web3 !== '') {
      this.instance = new this.web3.eth.Contract(require('./abi/token.json'), process.env.REACT_APP_TOKEN_ADDRESS);
      return this.instance;
    }

    throw 'Web3 is undefined.';
  }

  async balanceOf(address) {
    if (this.web3 === '') return 0;

    return (await this.getInstance().methods.balanceOf(address).call()).toString();
  }

  async allowance(address) {
    if (this.web3 === '') return 0;

    return (
      await this.getInstance().methods.allowance(address, process.env.REACT_APP_BUNDLE_ADDRESS).call()
    ).toString();
  }

  async approve(amount, sender) {
    if (this.web3 === '') return 0;

    await this.getInstance().methods.approve(process.env.REACT_APP_BUNDLE_ADDRESS, toWei(amount).toString()).send({
      from: sender
    });
  }
}
