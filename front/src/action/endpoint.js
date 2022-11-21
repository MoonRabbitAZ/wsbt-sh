/* eslint-disable camelcase */
export const APIEndpoints = {
  login: '/user/login',
  logout: '/user/logout',
  bundleList: '/api/cryptoPrices',
  addNFTUser: '/api/NFT/create',
  placeBet: '/api/prediction/new',
  leaderboard: '/api/overall/',
  currentPoolDetails: '/api/details/',
  completedPoolDetails: '/api/completed/',
  halloffame: '/api/halloffame',
  checkUserStatus: '/api/checkUserStatus/',
}

export const url = process.env.REACT_APP_URL
