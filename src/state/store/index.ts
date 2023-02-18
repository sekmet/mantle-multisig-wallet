import { configureStore } from '@reduxjs/toolkit';

import appReducer from './app/app.store';

const store = configureStore({
  reducer: { appReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
