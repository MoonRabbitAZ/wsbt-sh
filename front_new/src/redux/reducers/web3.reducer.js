import _ from 'lodash';
import { PRELOADER_START, PRELOADER_END } from '../action/reducer.types';

export default function (state = { current: 0, potential: 0 }, action) {
  switch (action.type) {
    case PRELOADER_START:
      return {
        ...state,
        potential: state.potential + 1,
      };
    case PRELOADER_END:
      return {
        ...state,
        current: state.current + 1,
      };
    default:
      return state;
  }
}
