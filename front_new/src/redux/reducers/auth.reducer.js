import { LOGOUT, LOG_IN, GET_NFT_USER } from '../action/reducer.types';

export default function (state = {}, action) {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        loginData: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedOut: action.status === 200
      };
    case GET_NFT_USER:
      return {
        ...state,
        nftUser: action.payload
      };
    case 'CLEAR_LOGOUT':
      return {
        ...state,
        isLoggedOut: false
      };
    default:
      return state;
  }
}
