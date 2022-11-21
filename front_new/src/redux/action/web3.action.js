import { PRELOADER_START, PRELOADER_END } from './reducer.types';

export const startPreloader = () => {
  return {
    type: PRELOADER_START,
  };
};

export const endPreloader = () => ({
  type: PRELOADER_END,
});
