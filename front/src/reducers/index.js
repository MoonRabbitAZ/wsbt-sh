import {combineReducers} from 'redux'
import authReducer from './auth.reducer'
import apiReducer from './api.reducer'
import bundleReducer from './bundle.reducer'

export default combineReducers({
  authReducer,
  apiReducer,
  bundleReducer
})
