import {
  LOG_IN,
  LOGOUT,
} from './reducer.types'
import {apiAction} from './api.action'
import {APIEndpoints, url} from './endpoint'

export function loginUser(data) {
  return apiAction({
    url: url + APIEndpoints.login,
    method: 'post',
    label: LOG_IN,
    isTokenSkipped: true,
    showLoader: true,
    data,
  })
}
export function logoutUser() {
  return apiAction({
    url: url + APIEndpoints.logout,
    method: 'get',
    label: LOGOUT,
    showLoader: true,
  })
}
