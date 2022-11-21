import {
  BUNDLE_LIST,
  LEADERBOARD,
  CURRENT_POOL_DETAILS,
  COMPLETED_POOL_DETAILS,
  HALL_OF_FAME,
  CHECK_USER_STATUS
} from '../action/reducer.types';

export default function (state = {}, action) {
  switch (action.type) {
    case BUNDLE_LIST:
      return {
        ...state,
        bundleData: action.payload
      };
    case LEADERBOARD:
      return {
        ...state,
        leaderboardData: action.payload
      };
    case CURRENT_POOL_DETAILS:
      return {
        ...state,
        assetListData: action.payload
      };
    case COMPLETED_POOL_DETAILS:
      return {
        ...state,
        completedListData: action.payload
      };
    case HALL_OF_FAME:
      return {
        ...state,
        hallOfFame: action.payload
      };
    case CHECK_USER_STATUS:
      return {
        ...state,
        isUserEligible: action.payload
      };
    default:
      return state;
  }
}
