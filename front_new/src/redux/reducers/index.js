import { combineReducers } from 'redux';
import web3Reducer from './web3.reducer';
import authReducer from './auth.reducer';
import apiReducer from './api.reducer';
import bundleReducer from './bundle.reducer';

export default combineReducers({
  web3Reducer,
  authReducer,
  apiReducer,
  bundleReducer
});
