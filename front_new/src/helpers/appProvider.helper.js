import { State } from './state.helper';

const initialState = {
  app: {
    mounted: false
  },
  near: {
    initialized: false
  }
};

export const { appStore, AppProvider } = State(initialState, 'app');

export const onAppMount =
  () =>
  async ({ update }) => {
    update('app', { mounted: true });
  };
