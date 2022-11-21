import BigNumber from 'bignumber.js';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });
BigNumber.config({ RANGE: 500 });

const toBn = (value) => new BigNumber(value);

const toWei = (value, decimals = 18) => toBn(value).multipliedBy(toBn(10).pow(decimals));

const fromWei = (value, decimals = 18) => toBn(value).dividedBy(toBn(10).pow(decimals));

const zeroAddress = '0x0000000000000000000000000000000000000000';

export { toBn, toWei, fromWei, zeroAddress };
