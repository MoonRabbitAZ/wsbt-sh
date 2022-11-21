import {
  LOGOUT,
  LOG_IN,
} from '../action/reducer.types'

export default function (state = {}, action) {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        loginData: action.payload,
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedOut: action.status === 200,
      }
    case 'CLEAR_LOGOUT':
      return {
        ...state,
        isLoggedOut: false,
      }
    default:
      return state
  }
}
