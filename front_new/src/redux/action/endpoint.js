/* eslint-disable camelcase */
export const APIEndpoints = {
  login: '/user/login',
  logout: '/user/logout',
  bundleList: '/api/crypto-prices',
  addNFTUser: '/api/NFT/create',
  getNFTUser: '/api/NFT/get/',
  placePrediction: '/api/prediction/new',
  leaderboard: '/api/overall/',
  currentPoolDetails: '/api/details/',
  completedPoolDetails: '/api/completed/',
  halloffame: '/api/hall-of-fame',
  checkUserStatus: '/api/check-user-status/'
};

export const url = process.env.REACT_APP_BACKEND_URL;
