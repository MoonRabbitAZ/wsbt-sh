import {
  BUNDLE_LIST,
  ADD_NFT_USER,
  GET_NFT_USER,
  PLACE_PREDICTION,
  LEADERBOARD,
  CURRENT_POOL_DETAILS,
  COMPLETED_POOL_DETAILS,
  HALL_OF_FAME,
  CHECK_USER_STATUS
} from './reducer.types';
import { apiAction } from './api.action';
import { APIEndpoints, url } from './endpoint';

export function bundleList() {
  return apiAction({
    url: url + APIEndpoints.bundleList,
    method: 'get',
    label: BUNDLE_LIST,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function addNFTUser(data) {
  return apiAction({
    url: url + APIEndpoints.addNFTUser,
    method: 'post',
    label: ADD_NFT_USER,
    isTokenSkipped: true,
    showLoader: true,
    data
  });
}

export function getNFTUser(address) {
  return apiAction({
    url: url + APIEndpoints.getNFTUser + address,
    method: 'get',
    label: GET_NFT_USER,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function placePrediction(data) {
  return apiAction({
    url: url + APIEndpoints.placePrediction,
    method: 'post',
    label: PLACE_PREDICTION,
    isTokenSkipped: true,
    showLoader: true,
    data
  });
}

export function leaderboard(data) {
  return apiAction({
    url: url + APIEndpoints.leaderboard + data,
    method: 'get',
    label: LEADERBOARD,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function currentPoolDetails(data) {
  return apiAction({
    url: url + APIEndpoints.currentPoolDetails + data,
    method: 'get',
    label: CURRENT_POOL_DETAILS,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function completedPoolDetails(data) {
  return apiAction({
    url: url + APIEndpoints.completedPoolDetails + data,
    method: 'get',
    label: COMPLETED_POOL_DETAILS,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function halloffame() {
  return apiAction({
    url: url + APIEndpoints.halloffame,
    method: 'get',
    label: HALL_OF_FAME,
    isTokenSkipped: true,
    showLoader: true
  });
}

export function checkUserStatus(data) {
  return apiAction({
    url: url + APIEndpoints.checkUserStatus + data,
    method: 'get',
    label: CHECK_USER_STATUS,
    isTokenSkipped: true,
    showLoader: true
  });
}
