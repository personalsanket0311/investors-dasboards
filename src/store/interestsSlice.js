import { createSlice } from '@reduxjs/toolkit';

// Saved deal ids. Persisted to localStorage by StoreProvider.
const slice = createSlice({
  name: 'interests',
  initialState: { ids: [] },
  reducers: {
    toggleInterest(state, { payload }) {
      state.ids = state.ids.includes(payload) ? state.ids.filter((id) => id !== payload) : [...state.ids, payload];
    },
    hydrateInterests(state, { payload }) { state.ids = payload; },
    clearInterests(state) { state.ids = []; },
  },
});
export const { toggleInterest, hydrateInterests, clearInterests } = slice.actions;
export default slice.reducer;
