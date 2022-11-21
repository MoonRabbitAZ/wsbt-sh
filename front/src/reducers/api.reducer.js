import _ from 'lodash'
import {ACCESS_DENIED, API_END, API_ERROR, API_START, API_SUCCESS} from '../action/reducer.types'

export default function (state = {successLabels: [], type: [], errorLabels: []}, action) {
  switch (action.type) {
    case API_START:
      return {
        ...state,
        isApiError: false,
        isLoadingData: true,
        type: [...state.type, action.payload.label],
        successData: action.payload.successData,
        showLoader: {
          ...(state.showLoader || {}),
          [action.payload.extraParam ? action.payload.extraParam + action.payload.label : action.payload.label]:
            action.payload.showLoader,
        },
      }
    case API_END: {
      const newType = [...state.type]
      newType.splice(state.type.indexOf(action.payload), 1)
      return {
        ...state,
        isLoadingData: newType.length > 0,
        type: newType,
        showLoader: _.omit(state.showLoader || {}, [
          action.payload.extraParam ? action.payload.extraParam + action.payload : action.payload,
        ]),
        successLabels: state.successLabels.filter(x => x !== action.payload),
        errorLabels: state.errorLabels.filter(x => x !== action.payload),
        apiData: null,
        accessDenied: false,
      }
    }
    case API_ERROR: {
      return {
        ...state,
        errorLabels: [...state.errorLabels, action.payload.label],
        apiData: action.payload,
      }
    }

    case API_SUCCESS: {
      
      return {
        ...state,
        successLabels: [...state.successLabels, action.payload.label],
        apiData: action.payload,
      }
    }

    case ACCESS_DENIED: {
      return {...state, accessDenied: true}
    }

    default:
      return state
  }
}
