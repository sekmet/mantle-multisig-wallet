import { createSlice } from '@reduxjs/toolkit';

import type { InitialAppStoreState } from '@/lib/IAppStoreState';

const initialState: InitialAppStoreState = {
  showSidenav: false,
  tokenTypeSelected: 'BitDAO',
};

const appSlice = createSlice({
  name: 'multisig-wallet',
  initialState,
  reducers: {
    toggleShowSidenav(state) {
      /* eslint-disable no-param-reassign */
      state.showSidenav = !state.showSidenav;
    },
    changeTokenType(state, { payload }) {
      /* eslint-disable no-param-reassign */
      state.tokenTypeSelected = payload;
    },
  },
});

export const { toggleShowSidenav, changeTokenType } = appSlice.actions;

export default appSlice.reducer;
