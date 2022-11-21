import {API, API_START, API_END, ACCESS_DENIED, API_ERROR, API_SUCCESS} from './reducer.types'

export const apiStart = (label, showLoader, extraParam) => {
  return {
    type: API_START,
    payload: {label, showLoader, extraParam},
  }
}

export const apiEnd = label => ({
  type: API_END,
  payload: label,
})

export const accessDenied = url => {
  return {
    type: ACCESS_DENIED,
    payload: {
      url,
    },
  }
}
// result ---->
export const apiError = data => ({
  type: API_ERROR,
  payload: data,
})

export const apiSuccess = data => ({
  type: API_SUCCESS,
  payload: data,
})

// --- base method for apiAction ---//
export function apiAction(data) {
  return {
    type: API,
    payload: data,
  }
}
